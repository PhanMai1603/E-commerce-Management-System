"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getAllAttributes,
  createAttribute,
  addValueToAttribute,
} from "@/app/api/attribute";
import { AttributeItem } from "@/interface/attribute";
import AttributeTable from "@/components/attribute/allAttributes";
import AddAttributeForm from "@/components/attribute/addAttribute";
import AddValueForm from "@/components/attribute/addValue";

interface ValueInput {
  value: string;
  description_url: string;
}

export default function AttributesTableWrapper() {
  const [attributes, setAttributes] = useState<AttributeItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [attributeName, setAttributeName] = useState("");
  const [attributeType, setAttributeType] = useState<"COLOR" | "TEXT" | "">("");
  const [isVariant, setIsVariant] = useState(false);
  const [attributeValues, setAttributeValues] = useState<ValueInput[]>([
    { value: "", description_url: "" },
  ]);
  const [editingAttribute, setEditingAttribute] = useState<AttributeItem | null>(null);
  const [values, setValues] = useState<ValueInput[]>([]);

  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

  const fetchAttributes = async () => {
    setLoading(true);
    try {
      const response = await getAllAttributes(userId, accessToken);
      setAttributes(response.items);
    } catch (error) {
      toast.error("Failed to fetch attributes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttributes();
  }, []);

  const handleAddAttribute = async () => {
    if (!attributeName || !attributeType) {
      return toast.error("Please fill in all required information!");
    }

    if (isVariant && attributeValues.length === 0) {
      return toast.error("Please add at least one value!");
    }

    const hasEmpty = attributeValues.some((v) => !v.value || !v.description_url);
    if (isVariant && hasEmpty) {
      return toast.error("Please fill all value fields!");
    }

    try {
      await createAttribute(userId, accessToken, {
        name: attributeName,
        type: attributeType,
        isVariantAttribute: isVariant,
        values: isVariant ? attributeValues : [],
      });

      toast.success("Attribute added successfully!");
      setAttributeName("");
      setAttributeType("");
      setIsVariant(false);
      setAttributeValues([{ value: "", description_url: "" }]);
      fetchAttributes();
    } catch {
      toast.error("Failed to add attribute.");
    }
  };

  const handleAddValue = async () => {
    if (!editingAttribute || values.length === 0) {
      return toast.error("Please fill in at least one value!");
    }

    const isEmpty = values.some((v) => !v.value || !v.description_url);
    if (isEmpty) return toast.error("Please fill all value fields!");

    try {
      await addValueToAttribute(userId, accessToken, {
        attributeId: editingAttribute.id,
        values,
      });

      toast.success("Values added successfully!");
      setValues([]);
      setEditingAttribute(null);
      fetchAttributes();
    } catch {
      toast.error("Failed to add values.");
    }
  };

  const handleEdit = (id: string) => {
    const attr = attributes.find((attr) => attr.id === id);
    if (attr) {
      setEditingAttribute(attr);
      setValues([{ value: "", description_url: "" }]);
    } else {
      toast.error("Attribute not found.");
    }
  };

  const handleView = (attribute: AttributeItem) => {
    console.log("Viewing attribute:", attribute);
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      <AttributeTable
        attributes={attributes}
        loading={loading}
        onEdit={handleEdit}
        onView={handleView}
      />

      <AddAttributeForm
        attributeName={attributeName}
        setAttributeName={setAttributeName}
        attributeType={attributeType}
        setAttributeType={setAttributeType}
        isVariant={isVariant}
        setIsVariant={setIsVariant}
        attributeValues={attributeValues}
        setAttributeValues={setAttributeValues}
        onSubmit={handleAddAttribute}
        disabled={!!editingAttribute}
      />

      {editingAttribute && (
        <AddValueForm
          attribute={editingAttribute}
          values={values}
          setValues={setValues}
          onSubmit={handleAddValue}
        />
      )}
    </div>
  );
}
