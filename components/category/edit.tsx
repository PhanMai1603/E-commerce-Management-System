/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateCategories } from "@/app/api/category";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { X } from "lucide-react";

type Category = {
  id: string;
  name: string;
  parentId: string | null;
};

type CategoryEditModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
  onCategoryUpdated: () => void;
};

export default function CategoryEditModal({
  open,
  onOpenChange,
  category,
  onCategoryUpdated,
}: CategoryEditModalProps) {
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    if (category) {
      setCategoryName(category.name);
    }
  }, [category]);

  const handleUpdateCategory = async () => {
    if (!category || !categoryName.trim()) {
      toast.error("Tên danh mục không được để trống!");
      return;
    }

    try {
      const userId = localStorage.getItem("userId") || "";
      const accessToken = localStorage.getItem("accessToken") || "";

      await updateCategories(
        { categoryId: category.id, name: categoryName },
        userId,
        accessToken
      );
      toast.success("Cập nhật danh mục thành công!");
      onOpenChange(false);
      onCategoryUpdated();
    } catch (error) {
      toast.error("Cập nhật thất bại. Vui lòng thử lại!");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
          onClick={() => onOpenChange(false)}
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-semibold mb-4">Chỉnh sửa danh mục</h2>
        <Input
          placeholder="Tên danh mục"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        />
        <Button onClick={handleUpdateCategory} className="mt-4 w-full">
          Lưu thay đổi
        </Button>
      </div>
    </div>
  );
}
