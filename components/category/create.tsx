/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createCategories, getAllCategories, getChildCategories } from "@/app/api/category";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

type Category = {
  id: string;
  name: string;
  parentId: string | null;
};

type CategoryModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCategoryCreated: () => void;
};

export default function CategoryModal({ open, onOpenChange, onCategoryCreated }: CategoryModalProps) {
  const [newCategory, setNewCategory] = useState({ name: "", parentId: "", childId: "" });
  const [categories, setCategories] = useState<Category[]>([]);
  const [childCategories, setChildCategories] = useState<Category[]>([]);
  const [subChildCategories, setSubChildCategories] = useState<Category[]>([]);

  // Lấy danh mục cấp 1 (cha)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    if (open) fetchCategories();
  }, [open]);

  // Khi chọn danh mục cha, tải danh mục con cấp 2
  const handleParentChange = async (parentId: string) => {
    setNewCategory((prev) => ({
      ...prev,
      parentId, // Lưu danh mục cha
      childId: "", // Reset danh mục con khi đổi cha
    }));
    setChildCategories([]); 
    setSubChildCategories([]);

    if (parentId) {
      try {
        const data = await getChildCategories(parentId);
        setChildCategories(data);
      } catch (error) {
        console.error("Error fetching child categories:", error);
      }
    }
  };

  // Khi chọn danh mục con, tải danh mục con cấp 3
  const handleChildChange = async (childId: string) => {
    setNewCategory((prev) => ({
      ...prev,
      childId, // Chỉ cập nhật childId, giữ nguyên parentId
    }));
    setSubChildCategories([]);

    if (childId) {
      try {
        const data = await getChildCategories(childId);
        setSubChildCategories(data);
      } catch (error) {
        console.error("Error fetching sub-child categories:", error);
      }
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategory.name.trim()) {
      toast.error("Category name is required!");
      return;
    }

    // Nếu parentId là chuỗi rỗng, chuyển thành null
    const categoryData = {
      name: newCategory.name,
      parentId: newCategory.childId || newCategory.parentId || null, // Lấy childId nếu có, nếu không thì lấy parentId
    };

    try {
      const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
      const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

      await createCategories(categoryData, userId, accessToken);
      toast.success("Category created successfully!");

      setNewCategory({ name: "", parentId: "", childId: "" });
      onOpenChange(false);
      onCategoryCreated();
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
        </DialogHeader>

        <Input
          placeholder="Category Name"
          value={newCategory.name}
          onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
        />

        {/* Dropdown danh mục cấp 1 */}
        <select
          value={newCategory.parentId}
          onChange={(e) => handleParentChange(e.target.value)}
          className="w-full p-2 border rounded-md mt-2"
        >
          <option value="">No Parent (Top-level Category)</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        {/* Dropdown danh mục cấp 2 */}
        {childCategories.length > 0 && (
          <select
            value={newCategory.childId}
            onChange={(e) => handleChildChange(e.target.value)}
            className="w-full p-2 border rounded-md mt-2"
          >
            <option value="">Select Subcategory</option>
            {childCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        )}

        <Button onClick={handleCreateCategory} className="mt-2">
          ADD CATEGORY
        </Button>
      </DialogContent>
    </Dialog>
  );
}
