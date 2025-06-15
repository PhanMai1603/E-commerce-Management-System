/* eslint-disable @typescript-eslint/no-unused-vars */
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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error("Lỗi khi tải danh mục:", error);
      }
    };

    if (open) {
      fetchCategories();
      resetState();
    }
  }, [open]);

  const resetState = () => {
    setNewCategory({ name: "", parentId: "", childId: "" });
    setChildCategories([]);
    setSubChildCategories([]);
  };

  const handleParentChange = async (parentId: string) => {
    setNewCategory({ name: newCategory.name, parentId, childId: "" });
    setChildCategories([]);
    setSubChildCategories([]);

    if (parentId) {
      try {
        const data = await getChildCategories(parentId);
        setChildCategories(data);
      } catch (error) {
        console.error("Lỗi khi tải danh mục con:", error);
      }
    }
  };

  const handleChildChange = async (childId: string) => {
    setNewCategory((prev) => ({ ...prev, childId }));
    setSubChildCategories([]);

    if (childId) {
      try {
        const data = await getChildCategories(childId);
        setSubChildCategories(data);
      } catch (error) {
        console.error("Lỗi khi tải danh mục con cấp 2:", error);
      }
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategory.name.trim()) {
      toast.error("Tên danh mục không được để trống!");
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
      toast.success("✅ Tạo danh mục thành công!");

      resetState();
      onOpenChange(false);
      onCategoryCreated();
    } catch (error) {
      console.error("Lỗi khi tạo danh mục:", error);
      toast.error("❌ Tạo danh mục thất bại.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm danh mục mới</DialogTitle>
        </DialogHeader>

        <Input
          placeholder="Nhập tên danh mục"
          value={newCategory.name}
          onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
        />

        <select
          value={newCategory.parentId}
          onChange={(e) => handleParentChange(e.target.value)}
          className="w-full p-2 border rounded-md mt-2"
        >
          <option value="">Không có danh mục cha (Cấp 1)</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        {childCategories.length > 0 && (
          <select
            value={newCategory.childId}
            onChange={(e) => handleChildChange(e.target.value)}
            className="w-full p-2 border rounded-md mt-2"
          >
            <option value="">Chọn danh mục con</option>
            {childCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        )}

        <Button onClick={handleCreateCategory} className="mt-2">
          Thêm danh mục
        </Button>
      </DialogContent>
    </Dialog>
  );
}
