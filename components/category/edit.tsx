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
      toast.error("Category name cannot be empty!");
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
      toast.success("Category updated successfully!");
      onOpenChange(false);
      onCategoryUpdated();
    } catch (error) {
      toast.error("Error updating category. Please try again.");
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
        <h2 className="text-xl font-semibold mb-4">Edit Category</h2>
        <Input
          placeholder="Category Name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        />
        <Button onClick={handleUpdateCategory} className="mt-4 w-full">
          Save Changes
        </Button>
      </div>
    </div>
  );
}
