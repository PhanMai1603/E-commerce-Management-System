'use client'

import { useEffect, useMemo, useRef, useState } from "react";
import { getAllAttribute } from "@/app/api/attribute";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { AddValue, AllAttributeResponse, AttributeData } from "@/interface/attribute";
import { ProductAttribute, ProductDetail, ProductUpdate } from "@/interface/product";
import { ChevronDown, Plus, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface AttributeFormProps {
  product: ProductDetail;
  setUpdatedProduct: React.Dispatch<React.SetStateAction<ProductUpdate>>;
  userId: string,
  accessToken: string,
}

interface SelectedValues {
  valueId: string;
  value: string;
}

const AttributeForm: React.FC<AttributeFormProps> = ({ product, setUpdatedProduct, userId, accessToken }) => {
  const [productAttributes, setProductAttributes] = useState<AttributeData[]>([]);
  const [attributes, setAttributes] = useState<AllAttributeResponse>();
  const [initAttributes, setInitAttributes] = useState<ProductAttribute[]>([]);
  const [newAttributes, setNewAttributes] = useState<ProductAttribute[]>([]);
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean[]>([]);
  const [isSelectOpen, setIsSelectOpen] = useState<boolean[]>([]);
  const [selectedValues, setSelectedValues] = useState<SelectedValues[][]>([]);
  const [deletedInfo, setDeletedInfo] = useState<{
    valueId: string;
    valueName: string;
    attrName: string;
  } | null>(null);

  const hasInitialized = useRef(false);

  const validAttributes = useMemo(() => {
    return newAttributes.filter(attr => attr.id !== "" && attr.values.length > 0);
  }, [newAttributes]);

  const isDifferent = useMemo(() => {
    return JSON.stringify(validAttributes) !== JSON.stringify(initAttributes);
  }, [validAttributes, initAttributes]);

  const shouldUpdate = useMemo(() => {
    return isDifferent && validAttributes.length > 0 && initAttributes.length > 0;
  }, [isDifferent, validAttributes, initAttributes]);

  useEffect(() => {
    type RawValue = { value: string; descriptionUrl: string };

    const convertToAddValue = (values: RawValue[]): AddValue[] =>
      values.map((v) => ({
        value: v.value,
        description_url: v.descriptionUrl,
      }));

    const normalAttrs: AttributeData[] = (product.attributes || []).map((attr) => ({
      name: attr.name,
      type: attr.type as "COLOR" | "TEXT",
      isVariantAttribute: false,
      values: convertToAddValue(attr.values),
    }));

    const variantAttrs: AttributeData[] = (product.variantAttributes || []).map((attr) => ({
      name: attr.name,
      type: attr.type as "COLOR" | "TEXT",
      isVariantAttribute: true,
      values: convertToAddValue(attr.values),
    }));

    setProductAttributes([...normalAttrs, ...variantAttrs]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Chuyển product.attributes và product.variantAttributes thành initAttributes và newAttributes
  useEffect(() => {
    if (hasInitialized.current) return;
    if (!attributes || productAttributes.length === 0) return;

    const matchedAttributes: ProductAttribute[] = [];
    const matchedSelectedValues: SelectedValues[][] = [];

    productAttributes.forEach((pa) => {
      const matchedAttr = attributes.items.find(attr => attr.name === pa.name);
      if (!matchedAttr || !pa.values) return;

      const matchedValueIds: string[] = [];
      const selectedVals: SelectedValues[] = [];

      pa.values.forEach(productVal => {
        const matchedVal = matchedAttr.values.find(attrVal => attrVal.value === productVal.value);
        if (matchedVal) {
          matchedValueIds.push(matchedVal.valueId);
          selectedVals.push({
            valueId: matchedVal.valueId,
            value: matchedVal.value
          });
        }
      });

      if (matchedValueIds.length > 0) {
        matchedAttributes.push({
          id: matchedAttr.id,
          values: matchedValueIds
        });
        matchedSelectedValues.push(selectedVals);
      }
    });

    hasInitialized.current = true;
    setInitAttributes(matchedAttributes);
    setNewAttributes(matchedAttributes);
    setSelectedValues(matchedSelectedValues);
  }, [attributes, productAttributes]);

  useEffect(() => {
    const fetchAttribute = async () => {
      if (isSelectOpen) {
        try {
          const response = await getAllAttribute(userId, accessToken);
          setAttributes(response);
        } catch (error) {
          console.error("Lỗi khi tìm nạp thuộc tính:", error);
        }
      }
    }

    fetchAttribute();
  }, [accessToken, isSelectOpen, userId]);

  // Set updatedProduct.attributes
  useEffect(() => {
    setUpdatedProduct((prev) => {
      if (shouldUpdate) {
        return {
          ...prev,
          attributes: [...validAttributes],
        };
      } else {
        
        const updated = { ...prev };
        delete updated["attributes"];
        return updated;
      }
    });
  }, [shouldUpdate, validAttributes, setUpdatedProduct]);

  // Set updatedProduct.variants
  useEffect(() => {
    if (!attributes) return; // Kiểm tra dữ liệu hợp lệ

    setUpdatedProduct(prev => {
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

        const oldVariant = prev.variants
          ? prev.variants.find((v) => v.name === matchingAttr.name)
          : product.variants?.find((v) => v.name === matchingAttr.name);

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

      if (shouldUpdate && newVariants.length > 0) {
        return {
          ...prev,
          variants: newVariants, // Gán lại danh sách variants mới
        };
      } else {
        const updated = { ...prev };
        delete updated["variants"];
        return updated;
      }
    });

    // Reset sau khi xử lý
    if (deletedInfo) setDeletedInfo(null);
  }, [newAttributes, attributes, product.variants, shouldUpdate, deletedInfo, setUpdatedProduct]);

  const handleAdd = () => {
    setNewAttributes((prev) => [...prev, { id: "", values: [] }]);
    setSelectedValues((prev) => [...prev, []]);
    setIsPopoverOpen((prev) => [...prev, false]);
    setIsSelectOpen((prev) => [...prev, false]);
  };

  const handleDeleteAttribute = (index: number) => {
    setNewAttributes((prev) => prev.filter((_, i) => i !== index));
    setSelectedValues((prev) => prev.filter((_, i) => i !== index));
    setIsPopoverOpen((prev) => prev.filter((_, i) => i !== index));
    setIsSelectOpen((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSelectChange = (isOpen: boolean, index: number) => {
    setIsSelectOpen((prev) =>
      prev.map((item, i) => (i === index ? isOpen : item))
    );
  };

  const handlePopoverChange = (isOpen: boolean, index: number) => {
    setIsPopoverOpen((prev) =>
      prev.map((item, i) => (i === index ? isOpen : item))
    );
  };

  const handleChangeName = (value: string, index: number) => {
    setNewAttributes((prev) =>
      prev.map((item, i) => (i === index ? { id: value, values: [] } : item))
    );
    setSelectedValues((prev) => {
      const updatedValues = [...prev];
      updatedValues[index] = [];
      return updatedValues;
    });
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
        <div key={index} className="grid grid-cols-12 gap-x-4 items-center">
          <Select
            value={attribute.id}
            onOpenChange={(isOpen) => handleSelectChange(isOpen, index)}
            onValueChange={(value) => handleChangeName(value, index)}
            disabled={
              initAttributes.some(init =>
                init.id === attribute.id
              )
            }
          >
            <SelectTrigger className="col-span-3 hover:bg-gray-600/10">
              <SelectValue placeholder="Chọn thuộc tính" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel className="text-xs">Có biến thể</SelectLabel>
                {attributes?.items
                  .filter((attr) => attr.isVariantAttribute)
                  .map((attr) => (
                    <SelectItem key={attr.id} value={attr.id}>
                      {attr.name}
                    </SelectItem>
                  ))}
              </SelectGroup>
              <span className="block w-full h-0.5 my-2 bg-gray-200"></span>
              <SelectGroup>
                <SelectLabel className="text-xs">Không có biến thể</SelectLabel>
                {attributes?.items
                  .filter((attr) => !attr.isVariantAttribute)
                  .map((attr) => (
                    <SelectItem key={attr.id} value={attr.id}>
                      {attr.name}
                    </SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Popover
            open={isPopoverOpen[index]}
            onOpenChange={(isOpen) => handlePopoverChange(isOpen, index)}
          >
            <PopoverTrigger asChild className="col-span-8 border rounded-md min-h-9">
              <div className="flex items-center">
                <div
                  className={`${!selectedValues[index]?.length ? 'hidden' : 'flex'
                    } flex-wrap w-full gap-y-2 py-2`}
                >
                  {selectedValues[index]?.map((selected) => (
                    <div key={selected.valueId} className="relative">
                      <span className="text-sm font-medium px-3 py-1 ml-2 bg-gray-600/10 rounded-full">
                        {selected.value}
                      </span>

                      {!initAttributes.some(init =>
                        init.id === attribute.id && init.values.includes(selected.valueId)
                      ) && (
                          <Button
                            onClick={(e) => handleDeleteValue(e, selected, index)}
                            className="absolute -top-2 -right-2 text-xs rounded-full w-4 h-4 flex justify-center items-center bg-gray-500"
                          >
                            <X className="w-2.5 h-2.5" />
                          </Button>
                        )}
                    </div>
                  ))}
                </div>
                <Button
                  className='flex justify-between items-center w-full px-3 bg-transparent font-normal text-gray-600 hover:bg-transparent'
                >
                  Chọn thuộc tính sản phẩm
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
                        disabled={
                          initAttributes.some(init =>
                            init.id === attribute.id
                          )
                        }
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
                          disabled={
                            initAttributes.some(init =>
                              init.id === attribute.id && init.values.includes(value.valueId)
                            )
                          }
                        />
                      </div>
                    ))}
                  </>
                );
              })()}
            </PopoverContent>
          </Popover>

          {!initAttributes.some(init =>
            init.id === attribute.id
          ) && (
              <Button
                variant="destructive"
                onClick={() => handleDeleteAttribute(index)}
                className='col-span-1 w-fit flex items-center justify-center font-bold bg-transparent text-red-400 hover:bg-transparent hover:text-red-500 [&_svg]:size-6'
              >
                <X className="w-4 h-4" />
              </Button>
            )}
        </div>
      ))}

      <Button
        onClick={handleAdd}
        variant="outline"
        className='relative w-full flex justify-center items-center bg-white rounded-md border border-dashed border-gray-400 hover:cursor-pointer hover:bg-gray-600/10 focus-visible:outline-none focus-visible:ring-0 [&_svg]:size-6 group overflow-hidden'>
        <Plus className='text-gray-400 group-hover:text-gray-500' />
      </Button>
    </div>
  );
};

export default AttributeForm;
