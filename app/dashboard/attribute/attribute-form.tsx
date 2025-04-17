/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getAllAttributes, createAttribute, addValueToAttribute } from "@/app/api/attribute";
import { AttributeItem } from "@/interface/attribute";
import AttributeTable from "@/components/attribute/allAttributes";
import AddAttributeForm from "@/components/attribute/addAttribute";
import AddValueForm from "@/components/attribute/addValue";

export default function AttributesTableWrapper() {
  const [attributes, setAttributes] = useState<AttributeItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [attributeName, setAttributeName] = useState("");
  const [attributeType, setAttributeType] = useState<"COLOR" | "TEXT" | "">("");
  const [isVariant, setIsVariant] = useState(false);
  const [newValue, setNewValue] = useState("");
  const [descriptionUrl, setDescriptionUrl] = useState("");
  const [editingAttribute, setEditingAttribute] = useState<AttributeItem | null>(null);

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

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
    if (!attributeName || !attributeType) return toast.error("Please fill in all required information!");
    if (isVariant && (!newValue || !descriptionUrl)) return toast.error("Please fill in all value information!");

    try {
      const values = isVariant ? [{ value: newValue, description_url: descriptionUrl }] : [];

      await createAttribute(userId, accessToken, {
        name: attributeName,
        type: attributeType,
        isVariantAttribute: isVariant,
        values,
      });

      toast.success("Attribute added successfully!");
      setAttributeName("");
      setAttributeType("");
      setIsVariant(false);
      setNewValue("");
      setDescriptionUrl("");
      fetchAttributes();
    } catch {
      toast.error("Failed to add attribute.");
    }
  };

  const handleAddValue = async () => {
    if (!editingAttribute || !newValue) return toast.error("Please fill in all required information!");

    try {
      await addValueToAttribute(userId, accessToken, {
        attributeId: editingAttribute.id,
        values: [{ value: newValue, description_url: descriptionUrl }],
      });

      toast.success("Value added successfully!");
      setNewValue("");
      setDescriptionUrl("");
      setEditingAttribute(null);
      fetchAttributes();
    } catch {
      toast.error("Failed to add value.");
    }
  };

  const handleEdit = (id: string) => {
    const attr = attributes.find(attr => attr.id === id);
    if (attr) {
      setEditingAttribute(attr);
      setNewValue("");
      setDescriptionUrl("");
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
        newValue={newValue}
        setNewValue={setNewValue}
        descriptionUrl={descriptionUrl}
        setDescriptionUrl={setDescriptionUrl}
        onSubmit={handleAddAttribute}
        disabled={!!editingAttribute}
      />
      {editingAttribute && (
        <AddValueForm
          attribute={editingAttribute}
          newValue={newValue}
          setNewValue={setNewValue}
          descriptionUrl={descriptionUrl}
          setDescriptionUrl={setDescriptionUrl}
          onSubmit={handleAddValue}
        />
      )}
    </div>
  );
}
