/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { getAllCategories } from "@/app/api/category";
import { getTopCategoriesProduct } from "@/app/api/product";
import type { CategoryDataResponse } from "@/interface/category";
import type { ProductResponse } from "@/interface/product";
import { toast } from "react-toastify";
import { Filter, Tags } from "lucide-react"; // 🎯 icon danh mục thay cho folder

interface Props {
  userId: string;
  accessToken: string;
  onFilter: (products: ProductResponse) => void;
}

export default function CategoryFilterSheet({ userId, accessToken, onFilter }: Props) {
  const [categories, setCategories] = useState<CategoryDataResponse[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  // Gọi API danh mục
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (err) {
        toast.error("Không thể tải danh mục.");
      }
    };
    fetchCategories();
  }, []);

  // Xử lý chọn danh mục
  const handleSelectCategory = async (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    try {
      const products = await getTopCategoriesProduct(categoryId, userId, accessToken);
      onFilter(products);
    } catch (error) {
      console.error(error);
    }
  };

  // Render cây danh mục có icon mới
  const renderCategoryTree = (categoryList: CategoryDataResponse[], level = 0) => {
    return categoryList.map((cat) => (
      <div key={cat.id} className="ml-2">
        <Button
          variant="ghost"
          onClick={() => handleSelectCategory(cat.id)}
          className={`w-full justify-start px-3 py-2 text-sm rounded-md flex items-center gap-2 transition ${
            selectedCategoryId === cat.id
              ? "bg-blue-100 text-blue-700 font-semibold"
              : "hover:bg-gray-100 text-gray-700"
          }`}
          style={{ paddingLeft: `${level * 16 + 12}px` }}
        >
          <Tags className="w-4 h-4 text-gray-500" />
          {cat.name}
        </Button>

        {cat.children && cat.children.length > 0 && renderCategoryTree(cat.children, level + 1)}
      </div>
    ));
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
       <Button variant="outline" size="icon">
  <Filter className="h-4 w-4" />
</Button>

      </SheetTrigger>
      <SheetContent side="left" className="w-[320px] sm:w-[360px]">
        <SheetHeader>
          <SheetTitle className="text-lg font-bold">Bộ lọc danh mục</SheetTitle>
          <SheetDescription className="text-sm text-gray-500">
            Chọn một danh mục để lọc sản phẩm
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 max-h-[80vh] overflow-y-auto pr-1 space-y-1">
          {renderCategoryTree(categories)}
        </div>
      </SheetContent>
    </Sheet>
  );
}
