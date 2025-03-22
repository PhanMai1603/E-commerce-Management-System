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
  userId: string,
  accessToken: string,
  setProduct: React.Dispatch<React.SetStateAction<ProductData>>;
}

interface SelectedValues {
  valueId: string,
  value: string,
}

const AttributeForm: React.FC<AttributeFormProps> = ({ setProduct, userId, accessToken }) => {
  const [attributes, setAttributes] = useState<AllAttributeResponse>();
  const [newAttributes, setNewAttributes] = useState<Array<ProductAttribute>>([]);
  const [isSelectOpen, setIsSelectOpen] = useState<Array<boolean>>([]);
  const [isPopoverOpen, setIsPopoverOpen] = useState<Array<boolean>>([]);
  const [selectedValues, setSelectedValues] = useState<Array<SelectedValues[]>>([]);

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

  useEffect(() => {
    setProduct((prev) => {
      const validAttributes = newAttributes.filter(attr => attr.id !== "" && attr.values.length > 0);
  
      return { ...prev, attributes: [...validAttributes] };
    });
  }, [newAttributes, setProduct]);

  useEffect(() => {
    if (!attributes) return; // Kiểm tra dữ liệu hợp lệ

    updateVariants(attributes, newAttributes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newAttributes, attributes]);

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

  const handleDeleteValue = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, valueId: string, index: number) => {
    event.preventDefault();

    setSelectedValues((prev) => {
      // Cập nhật mảng tại index cụ thể
      const updatedValues = prev.map((values, i) =>
        i === index ? values.filter((value) => value.valueId !== valueId) : values
      );

      // Cập nhật setNewAttributes sau khi setSelectedValues đã hoàn tất
      setNewAttributes((prevAttributes) =>
        prevAttributes.map((item, i) =>
          i === index
            ? { ...item, values: updatedValues[index].map((v) => v.valueId) }
            : item
        )
      );

      return updatedValues; // Trả về state mới cho setSelectedValues
    });
  };

  const updateVariants = (attributes: AllAttributeResponse, newAttributes: ProductAttribute[]) => {
    if (!attributes || !newAttributes) return;
  
    // Lọc danh sách các thuộc tính cần cập nhật
    const filteredAttributes = attributes.items.filter(attr =>
      newAttributes.some(newAttr => 
        newAttr.id === attr.id && 
        attr.isVariantAttribute && 
        newAttr.values.length >= 2 // Chỉ lấy những thuộc tính có ít nhất 2 giá trị
      )
    );
  
    // Tạo danh sách biến thể (variants) mới
    const newVariants = filteredAttributes.map(attr => {
      // Tìm các giá trị `value` có trong `newAttributes`
      const matchingValues = newAttributes.find(newAttr => newAttr.id === attr.id)?.values || [];
  
      return {
        name: attr.name,
        images: [],
        options: attr.values
          .filter(value => matchingValues.includes(value.valueId)) // Chỉ lấy giá trị khớp với newAttributes
          .map(value => value.value), // Chuyển về dạng mảng `options`
      };
    });
  
    setProduct(prev => ({
      ...prev,
      variants: newVariants.length === 0 ? undefined : newVariants, // Gán lại danh sách variants mới
    }));
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
                        onClick={(event) => handleDeleteValue(event, selected.valueId, index)}
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
              {/* Lấy mảng values từ phần tử có id bằng id của attribute */}
              {attributes && attributes.items ? attributes.items
                .find(item => item.id === attribute.id)?.values
                .map((value) => (
                  <div
                    key={value.valueId}
                    className='flex justify-between items-center space-x-4'
                  >
                    <Label htmlFor={value.valueId}>{value.value}</Label>
                    <Checkbox
                      id={value.valueId}
                      checked={selectedValues[index] && selectedValues[index].some((c) => c.valueId === value.valueId)}
                      onCheckedChange={() => handleValueChange(value.valueId, value.value, index)}
                    />
                  </div>
                )) : (
                <div>No values found.</div>
              )}
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