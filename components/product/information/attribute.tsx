/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { getAllAttributes } from "@/app/api/attribute";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { AllAttributeResponse } from "@/interface/attribute";
import { ProductAttribute, ProductData } from "@/interface/product";
import { Plus, X, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface AttributeFormProps {
  product: ProductData;
  setProduct: React.Dispatch<React.SetStateAction<ProductData>>;
  userId: string,
  accessToken: string,
}

interface SelectedValues {
  valueId: string,
  value: string,
}

const AttributeForm: React.FC<AttributeFormProps> = ({product, setProduct, userId, accessToken }) => {
  const [attributes, setAttributes] = useState<AllAttributeResponse>();
  const [newAttributes, setNewAttributes] = useState<ProductAttribute[]>([]);
  const [isSelectOpen, setIsSelectOpen] = useState<boolean[]>([]);
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean[]>([]);
  const [selectedValues, setSelectedValues] = useState<SelectedValues[][]>([]);
  const [deletedInfo, setDeletedInfo] = useState<{
    valueId: string;
    valueName: string;
    attrName: string;
  } | null>(null);

  useEffect(() => {
    const fetchAttribute = async () => {
      if (isSelectOpen) {
        try {
          const response = await getAllAttributes(userId, accessToken);
          setAttributes(response);
        } catch (error) {
          console.error("Error fetching attributes:", error);
        }
      }
    }

    fetchAttribute();
  }, [accessToken, isSelectOpen, userId]);

  // Set product.attributes
  useEffect(() => {
    setProduct((prev) => {
      const validAttributes = newAttributes.filter(attr => attr.id !== "" && attr.values.length > 0);

      return { ...prev, attributes: [...validAttributes] };
    });
  }, [newAttributes, setProduct]);

  // Set product.variants
  useEffect(() => {
    if (!attributes) return;

    // Set variants dựa trên thứ tự của newAttributes
    setProduct((prev) => {
      const newVariants = newAttributes.map((newAttr) => {
        const matchingAttr = attributes.items.find(attr =>
          newAttr.id === attr.id &&
          attr.isVariantAttribute &&
          newAttr.values.length >= 2
        );
        if (!matchingAttr) return null;

        // Lọc giá trị options của variant theo thứ tự values trong newAttr
        const options = matchingAttr.values
          .filter((value) => newAttr.values.includes(value.valueId))
          .sort((a, b) => {
            // Sắp xếp options theo thứ tự values trong newAttr
            const indexA = newAttr.values.indexOf(a.valueId);
            const indexB = newAttr.values.indexOf(b.valueId);
            return indexA - indexB;
          })
          .map((value) => value.value);

        const oldVariant = prev.variants?.find((v) => v.name === matchingAttr.name);

        let images: string[] = [];
        if (oldVariant && oldVariant.name === "Color") {
          images = options.map((option) => {
            const oldIdx = oldVariant.options.findIndex((opt) => opt === option);
            return oldIdx !== -1 ? oldVariant.images?.[oldIdx] || "" : "";
          });
        }

        return {
          name: matchingAttr.name,
          options,
          images,
        };
      }).filter((variant) => variant !== null);

      return {
        ...prev,
        variants: newVariants.length === 0 ? undefined : newVariants,
      };
    });

    // Reset sau khi xử lý
    if (deletedInfo) setDeletedInfo(null);
  }, [newAttributes, attributes, deletedInfo, setProduct]);

  const handleAdd = () => {
    setNewAttributes((prev) => [...prev, { id: "", values: [] }]);
    setSelectedValues((prev) => [...prev, []]);
    setIsSelectOpen((prev) => [...prev, false]);
    setIsPopoverOpen((prev) => [...prev, false]);
  };

  const handleDeleteAttribute = (index: number) => {
    setNewAttributes((prev) => prev.filter((_, i) => i !== index));
    setSelectedValues((prev) => prev.filter((_, i) => i !== index));
    setIsSelectOpen((prev) => prev.filter((_, i) => i !== index));
    setIsPopoverOpen((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSelectChange = (isOpen: boolean, index: number) => {
    setIsPopoverOpen((prev) =>
      prev.map((item, i) => (i === index ? isOpen : item))
    );
  };

  const handleChangeName = (value: string, index: number) => {
    setNewAttributes((prev) =>
      prev.map((item, i) =>
        i === index ? { id: value, values: [] } : item
      )
    );

    setSelectedValues((prev) => {
      const updatedValues = [...prev];
      updatedValues[index] = [];
      return updatedValues;
    });
  };

  const handlePopoverChange = (isOpen: boolean, index: number) => {
    setIsPopoverOpen((prev) =>
      prev.map((item, i) => (i === index ? isOpen : item))
    );
  };

  const handleValueChange = (valueId: string, value: string, index: number) => {
    setSelectedValues((prev) => {
      const updatedValues = [...prev];

      // Đảm bảo mảng tại index tồn tại, nếu chưa có thì tạo mới
      if (!updatedValues[index]) {
        updatedValues[index] = [];
      }

      // Kiểm tra xem valueId đã tồn tại chưa
      const exists = updatedValues[index].some((v) => v.valueId === valueId);

      if (exists) {
        // Nếu tồn tại, cập nhật value
        updatedValues[index] = updatedValues[index].filter((v) => v.valueId !== valueId);
      } else {
        // Nếu chưa tồn tại, thêm mới vào mảng
        updatedValues[index] = [...updatedValues[index], { valueId, value: value }];
      }

      // Cập nhật setNewAttributes sau khi setSelectedValues đã hoàn tất
      setNewAttributes((prevAttributes) =>
        prevAttributes.map((item, i) =>
          i === index
            ? { ...item, values: updatedValues[index] && updatedValues[index].map((v) => v.valueId) }
            : item
        )
      );

      return updatedValues; // Trả về state mới cho setSelectedValues
    });
  };

  const handleDeleteValue = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    selected: SelectedValues,
    index: number
  ) => {
    event.preventDefault();

    const currentAttr = attributes?.items.find(attr => attr.id === newAttributes[index].id);
    if (!currentAttr) return;

    const deletedValue = currentAttr.values.find(v => v.valueId === selected.valueId);
    if (!deletedValue) return;

    setSelectedValues((prev) => {
      const updatedValues = prev.map((values, i) =>
        i === index ? values.filter((value) => value.valueId !== selected.valueId) : values
      );

      // Cập nhật newAttributes
      setNewAttributes((prevAttributes) =>
        prevAttributes.map((item, i) =>
          i === index
            ? { ...item, values: updatedValues[index].map((v) => v.valueId) }
            : item
        )
      );

      // Gửi thông tin xóa cho useEffect xử lý
      setDeletedInfo({
        valueId: selected.valueId,
        valueName: selected.value,
        attrName: currentAttr.name,
      })

      return updatedValues;
    });
  };

  return (
    <div className="flex flex-col gap-y-4">
      {newAttributes.map((attribute, index) => (
        <div
          key={index}
          className="grid grid-cols-12 gap-x-4 items-center"
        >
          <Select
            value={attribute.id}
            onOpenChange={(isOpen) => handleSelectChange(isOpen, index)}
            onValueChange={(value) => handleChangeName(value, index)}
          >
            <SelectTrigger className='col-span-3 hover:bg-gray-600/10'>
              <SelectValue placeholder="Select name" />
            </SelectTrigger>
            <SelectContent className="h-full">
              <SelectGroup>
                <SelectLabel className="text-[0.75rem]">Generate to variant</SelectLabel>
                {attributes && attributes.items
                  .filter(attribute => attribute.isVariantAttribute === true)
                  .map((attribute) => (
                    <SelectItem key={attribute.id} value={attribute.id}>{attribute.name}</SelectItem>
                  ))}
              </SelectGroup>
              <span className="block w-full h-0.5 my-2 bg-gray-200"></span>
              <SelectGroup>
                <SelectLabel className="text-[0.75rem]">Not generate to variant</SelectLabel>
                {attributes && attributes.items.filter(attribute => attribute.isVariantAttribute === false).map((attribute) => (
                  <SelectItem key={attribute.id} value={attribute.id}>{attribute.name}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Popover
            open={isPopoverOpen[index]}
            onOpenChange={(isOpen) => handlePopoverChange(isOpen, index)}
          >
            <PopoverTrigger
              asChild
              className="col-span-8 border rounded-md min-h-9"
            >
              <div className='flex items-center'>
                <div className={`${!selectedValues[index] || selectedValues[index].length === 0 ? 'hidden' : 'flex'} flex-wrap w-full gap-y-2 py-2`}>
                  {selectedValues[index] && selectedValues[index].map((selected) => (
                    <div
                      key={selected.valueId}
                      className='relative'
                    >
                      <span className='text-sm text-nowrap font-medium px-3 py-1 ml-2 bg-gray-600/10 rounded-full'>{selected.value}</span>
                      <Button
                        onClick={(event) => handleDeleteValue(event, selected, index)}
                        className='absolute h-auto -top-1 -right-1 p-1 bg-red-300 hover:bg-red-500 [&_svg]:size-2'
                      >
                        <X />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button className='flex justify-between items-center w-full px-3 bg-transparent font-normal text-gray-600 hover:bg-transparent'>
                  Select product attributes
                  <ChevronDown />
                </Button>
              </div>
            </PopoverTrigger>
            <PopoverContent className='grid grid-cols-3 gap-x-14 gap-y-2 w-full min-w-[var(--radix-popper-anchor-width)]'>
              {/* Lấy values của attribute hiện tại */}
              {(() => {
                const currentAttribute = attributes?.items.find(item => item.id === attribute.id);
                const currentValues = currentAttribute?.values || [];

                // Kiểm tra xem tất cả values đã được chọn chưa
                const isAllSelected = currentValues.length > 0 && currentValues.every(value =>
                  selectedValues[index]?.some(selected => selected.valueId === value.valueId)
                );

                return (
                  <>
                    {/* Select All Checkbox */}
                    <div className='flex justify-between items-center space-x-4'>
                      <Label>Select All</Label>
                      <Checkbox
                        checked={isAllSelected}
                        onCheckedChange={() => {
                          const updated = isAllSelected ? [] : currentValues.map(value => ({
                            valueId: value.valueId,
                            value: value.value
                          }));

                          setSelectedValues((prev) => {
                            const updatedValues = [...prev];
                            updatedValues[index] = updated;

                            setNewAttributes((prevAttributes) =>
                              prevAttributes.map((item, i) =>
                                i === index
                                  ? { ...item, values: updated.map((v) => v.valueId) }
                                  : item
                              )
                            );

                            return updatedValues;
                          });
                        }}
                      />
                    </div>

                    {/* Các value cụ thể */}
                    {currentValues.map((value) => (
                      <div
                        key={value.valueId}
                        className='flex justify-between items-center space-x-4'
                      >
                        <Label htmlFor={value.valueId}>{value.value}</Label>
                        <Checkbox
                          id={value.valueId}
                          checked={selectedValues[index]?.some((c) => c.valueId === value.valueId)}
                          onCheckedChange={() => handleValueChange(value.valueId, value.value, index)}
                        />
                      </div>
                    ))}
                  </>
                );
              })()}
            </PopoverContent>

          </Popover>

          <Button
            onClick={() => handleDeleteAttribute(index)}
            className='col-span-1 w-fit flex items-center justify-center font-bold bg-transparent text-red-400 hover:bg-transparent hover:text-red-500 [&_svg]:size-6'
          >
            <X />
          </Button>
        </div>
      ))}

      <Button
        onClick={handleAdd}
        className='relative w-full flex justify-center items-center bg-white rounded-md border border-dashed border-gray-400 hover:cursor-pointer hover:bg-gray-600/10 focus-visible:outline-none focus-visible:ring-0 [&_svg]:size-6 group overflow-hidden'>
        <Plus className='text-gray-400 group-hover:text-gray-500' />
      </Button>
    </div>
  )
}

export default AttributeForm;
