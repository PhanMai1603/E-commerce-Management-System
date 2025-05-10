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

  // Fetch top-level categories when the modal is opened
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    if (open) {
      fetchCategories();
      resetState();  // Reset everything on open
    }
  }, [open]);

  // Reset all states on modal close
  const resetState = () => {
    setNewCategory({ name: "", parentId: "", childId: "" });
    setChildCategories([]);
    setSubChildCategories([]);
  };

  // Handle parent category change
  const handleParentChange = async (parentId: string) => {
    setNewCategory({ name: newCategory.name, parentId, childId: "" });
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

  // Handle child category change
  const handleChildChange = async (childId: string) => {
    setNewCategory((prev) => ({ ...prev, childId }));
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

  // Create new category
  const handleCreateCategory = async () => {
    if (!newCategory.name.trim()) {
      toast.error("Category name is required!");
      return;
    }

    const categoryData = {
      name: newCategory.name,
      parentId: newCategory.childId || newCategory.parentId || null,
    };

    try {
      const userId = localStorage.getItem("userId") || "";
      const accessToken = localStorage.getItem("accessToken") || "";

      await createCategories(categoryData, userId, accessToken);
      toast.success("Category created successfully!");

      resetState();
      onOpenChange(false);
      onCategoryCreated();
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Failed to create category.");
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

        {/* Dropdown for Parent (Top-level) */}
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

        {/* Dropdown for Child (Level 2) */}
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
