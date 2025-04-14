'use client'

import { useEffect, useState } from "react";
import { getAllAttributes } from "@/app/api/attribute";
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
import { AllAttributeResponse } from "@/interface/attribute";
import { ProductAttribute, ProductDetail } from "@/interface/product";
import { Plus, X, ChevronDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface AttributeFormProps {
  userId: string;
  accessToken: string;
  setProduct: React.Dispatch<React.SetStateAction<ProductDetail>>;
}

interface SelectedValues {
  valueId: string;
  value: string;
}

const AttributeForm: React.FC<AttributeFormProps> = ({setProduct, userId, accessToken}) => {
  const [attributes, setAttributes] = useState<AllAttributeResponse>();
  const [newAttributes, setNewAttributes] = useState<ProductAttribute[]>([]);
  const [isPopoverOpen, setIsPopoverOpen] = useState<Array<boolean>>([]);
  const [isSelectOpen, setIsSelectOpen] = useState<Array<boolean>>([]);
  const [selectedValues, setSelectedValues] = useState<SelectedValues[][]>([]);

  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const response = await getAllAttributes(userId, accessToken);
        setAttributes(response);
      } catch (error) {
        console.error("Error fetching attributes:", error);
      }
    };

    fetchAttributes();
  }, [accessToken, userId]);

  useEffect(() => {
    if (attributes?.items?.length) {
      setNewAttributes(
        attributes.items.map((attr) => ({ id: attr.id, values: [] }))
      );
      setSelectedValues(
        attributes.items.map((attr) =>
          attr.values.map((v) => ({ valueId: v.valueId, value: v.value }))
        )
      );
    }
  }, [attributes]);

  useEffect(() => {
    setProduct((prev) => {
      const validAttributes = newAttributes.filter(
        (attr) => attr.id !== "" && attr.values.length > 0
      );
      return { ...prev, attributes: validAttributes };
    });
  }, [newAttributes, setProduct]);

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
      const updated = [...prev];
      if (!updated[index]) updated[index] = [];

      const exists = updated[index].some((v) => v.valueId === valueId);
      if (exists) {
        updated[index] = updated[index].filter((v) => v.valueId !== valueId);
      } else {
        updated[index].push({ valueId, value });
      }

      setNewAttributes((prevAttrs) =>
        prevAttrs.map((item, i) =>
          i === index ? { ...item, values: updated[index].map((v) => v.valueId) } : item
        )
      );

      return updated;
    });
  };

  const handleDeleteValue = (e: React.MouseEvent, valueId: string, index: number) => {
    e.stopPropagation(); // Prevent event propagation

    setSelectedValues((prev) => {
      const updated = [...prev];
      // Remove the value from the selected values for the given index
      updated[index] = updated[index].filter((v) => v.valueId !== valueId);

      // Update the newAttributes state accordingly
      setNewAttributes((prevAttrs) =>
        prevAttrs.map((item, i) =>
          i === index ? { ...item, values: updated[index].map((v) => v.valueId) } : item
        )
      );

      return updated;
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
          >
            <SelectTrigger className="col-span-3 hover:bg-gray-600/10">
              <SelectValue placeholder="Select name" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel className="text-xs">Generate to variant</SelectLabel>
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
                <SelectLabel className="text-xs">Not generate to variant</SelectLabel>
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
                  className={`${
                    !selectedValues[index]?.length ? 'hidden' : 'flex'
                  } flex-wrap w-full gap-y-2 py-2`}
                >
                  {selectedValues[index]?.map((selected) => (
                    <div key={selected.valueId} className="relative">
                      <span className="text-sm font-medium px-3 py-1 ml-2 bg-gray-600/10 rounded-full">
                        {selected.value}
                      </span>
                      <Button
                        onClick={(e) => handleDeleteValue(e, selected.valueId, index)}
                        className="absolute -top-2 -right-2 text-xs rounded-full w-4 h-4 flex justify-center items-center bg-gray-500"
                      >
                        <X className="w-2.5 h-2.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-[400px]">
              {attributes?.items
                .find((item) => item.id === attribute.id)
                ?.values.map((value) => (
                  <div key={value.valueId} className="flex justify-between items-center space-x-4">
                    <Label htmlFor={value.valueId}>{value.value}</Label>
                    <Checkbox
                      id={value.valueId}
                      checked={selectedValues[index]?.some((c) => c.valueId === value.valueId)}
                      onCheckedChange={() => handleValueChange(value.valueId, value.value, index)}
                    />
                  </div>
                ))}
            </PopoverContent>
          </Popover>

          <Button
            variant="destructive"
            className="col-span-1 justify-center text-xs py-2"
            onClick={() => handleDeleteAttribute(index)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ))}

      <Button onClick={handleAdd} variant="outline" className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        Add Attribute
      </Button>
    </div>
  );
};

export default AttributeForm;
