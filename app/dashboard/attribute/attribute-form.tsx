/* eslint-disable react-hooks/exhaustive-deps */
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
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(5);
  const [totalPages, setTotalPages] = useState<number>(1);

  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

  const fetchAttributes = async () => {
    setLoading(true);
    try {
      const response = await getAllAttributes(userId, accessToken, page, size);
      setAttributes(response.items);
    } catch (error) {
      toast.error("Không thể lấy danh sách thuộc tính.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttributes();
  }, [userId, accessToken, page, size]);

  const handleAddAttribute = async () => {
    if (!attributeName || !attributeType) {
      return toast.error("Vui lòng điền đầy đủ thông tin!");
    }

    if (isVariant && attributeValues.length === 0) {
      return toast.error("Vui lòng thêm ít nhất một giá trị!");
    }

    const hasEmpty = attributeValues.some((v) => !v.value || !v.description_url);
    if (isVariant && hasEmpty) {
      return toast.error("Vui lòng điền đầy đủ các trường giá trị!");
    }

    try {
      await createAttribute(userId, accessToken, {
        name: attributeName,
        type: attributeType,
        isVariantAttribute: isVariant,
        values: isVariant ? attributeValues : [],
      });

      toast.success("Thêm thuộc tính thành công!");
      setAttributeName("");
      setAttributeType("");
      setIsVariant(false);
      setAttributeValues([{ value: "", description_url: "" }]);
      fetchAttributes();
    } catch {
      toast.error("Không thể thêm thuộc tính.");
    }
  };

  const handleAddValue = async () => {
    if (!editingAttribute || values.length === 0) {
      return toast.error("Vui lòng nhập ít nhất một giá trị!");
    }

    const isEmpty = values.some((v) => !v.value || !v.description_url);
    if (isEmpty) return toast.error("Vui lòng điền đầy đủ các trường giá trị!");

    const inputSet = new Set(values.map(v => v.value.trim().toLowerCase()));
    if (inputSet.size !== values.length) {
      return toast.error("Có giá trị bị trùng lặp trong ô nhập!");
    }

    const existing = new Set(
      editingAttribute.values?.map(v => v.value.trim().toLowerCase())
    );
    const hasDuplicate = values.some(v => existing.has(v.value.trim().toLowerCase()));
    if (hasDuplicate) {
      return toast.error("Một hoặc nhiều giá trị đã tồn tại trong thuộc tính này!");
    }

    try {
      await addValueToAttribute(userId, accessToken, {
        attributeId: editingAttribute.id,
        values,
      });

      toast.success("Thêm giá trị thành công!");
      setValues([]);
      setEditingAttribute(null);
      fetchAttributes();
    } catch {
      toast.error("Không thể thêm giá trị.");
    }
  };

  const handleEdit = (id: string) => {
    const attr = attributes.find((attr) => attr.id === id);
    if (attr) {
      setEditingAttribute(attr);
      setValues([{ value: "", description_url: "" }]);
    } else {
      toast.error("Không tìm thấy thuộc tính.");
    }
  };

  const handleView = (attribute: AttributeItem) => {
    console.log("Xem thuộc tính:", attribute);
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      <AttributeTable
        attributes={attributes}
        loading={loading}
        onEdit={handleEdit}
        onView={handleView}
        page={page}
        setPage={setPage}
        size={size}
        setSize={setSize}
        totalPages={totalPages}
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
          onCancel={() => setEditingAttribute(null)}
        />
      )}
    </div>
  );
}
