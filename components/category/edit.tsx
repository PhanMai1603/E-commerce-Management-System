/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateCategories } from "@/app/api/category";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

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

export default function CategoryEditModal({ open, onOpenChange, category, onCategoryUpdated }: CategoryEditModalProps) {
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

      await updateCategories({ categoryId: category.id, name: categoryName }, userId, accessToken);
      toast.success("Category updated successfully!");

      onOpenChange(false);
      onCategoryUpdated();
    } catch (error) {
      toast.error("Error updating category. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>

        <Input placeholder="Category Name" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />

        <Button onClick={handleUpdateCategory} className="mt-2">
          SAVE CHANGE
        </Button>
      </DialogContent>
    </Dialog>
  );
}
