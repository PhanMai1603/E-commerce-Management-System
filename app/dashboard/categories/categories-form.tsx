/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, ChevronUp, EllipsisVertical, Plus } from "lucide-react";
import {
  getAllCategories,
  getChildCategories,
  deleteCategories,
} from "@/app/api/category";
import * as Category from "@/interface/category";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import CategoryModal from "@/components/category/create";
import CategoryEditModal from "@/components/category/edit";
import { toast } from "react-toastify";
import React from "react";

export default function Page() {
  const [categories, setCategories] = useState<Category.CategoryDataResponse[]>([]);
  const [childCategories, setChildCategories] = useState<Record<string, Category.CategoryDataResponse[]>>({});
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [hasChildren, setHasChildren] = useState<Record<string, boolean>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category.CategoryDataResponse | null>(null);

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data);

      const childCheck: Record<string, boolean> = {};
      for (const category of data) {
        await checkHasChildren(category.id, childCheck, 1);
      }
      setHasChildren(childCheck);
    } catch (error) {
      console.error("Lỗi khi tải danh sách danh mục:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const checkHasChildren = async (id: string, childCheck: Record<string, boolean>, level: number) => {
    if (level > 2) return;
    try {
      const children = await getChildCategories(id);
      childCheck[id] = children.length > 0;

      if (level < 2) {
        for (const child of children) {
          await checkHasChildren(child.id, childCheck, level + 1);
        }
      }
    } catch (error) {
      console.error(`Lỗi khi kiểm tra danh mục con của ${id}:`, error);
    }
  };

  const toggleRow = async (id: string, level: number) => {
    if (level > 2) return;

    const isExpanded = expandedRows[id];
    setExpandedRows((prev) => ({ ...prev, [id]: !isExpanded }));

    if (!isExpanded || !childCategories[id]) {
      try {
        const children = await getChildCategories(id);
        setChildCategories((prev) => ({ ...prev, [id]: children }));
      } catch (error) {
        console.error("Lỗi khi tải danh mục con:", error);
      }
    }
  };

  const getPadding = (level: number) => {
    return ["pl-4", "pl-8", "pl-12"][level] || "pl-12";
  };

  const renderChildren = (parentId: string, level: number): React.ReactNode => {
    if (level > 2) return null;
    const children = childCategories[parentId] || [];
    return children.map((child) => (
      <React.Fragment key={child.id}>
        <TableRow>
          <TableCell className={getPadding(level)}>{child.name}</TableCell>
          <TableCell>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <EllipsisVertical />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleEditCategory(child)}>
                  Chỉnh sửa
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDeleteCategory(child.id)}>
                  Xoá
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
          <TableCell className="text-right">
            {hasChildren[child.id] && level < 2 && (
              <button onClick={() => toggleRow(child.id, level + 1)}>
                {expandedRows[child.id] ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
            )}
          </TableCell>
        </TableRow>
        {expandedRows[child.id] && renderChildren(child.id, level + 1)}
      </React.Fragment>
    ));
  };

  const handleDeleteCategory = async (id: string) => {
    const userId = localStorage.getItem("userId") || "";
    const token = localStorage.getItem("accessToken") || "";

    try {
      await deleteCategories(id, userId, token);
      toast.success("Xoá danh mục thành công!");

      setCategories((prev) => prev.filter((cat) => cat.id !== id));
      setChildCategories((prev) => {
        const newChildCategories = { ...prev };
        delete newChildCategories[id];
        for (const parentId in newChildCategories) {
          newChildCategories[parentId] = newChildCategories[parentId].filter(
            (child) => child.id !== id
          );
        }
        return newChildCategories;
      });
      setExpandedRows((prev) => {
        const newExpandedRows = { ...prev };
        delete newExpandedRows[id];
        return newExpandedRows;
      });
      setHasChildren((prev) => {
        const newHasChildren = { ...prev };
        for (const parentId in prev) {
          if (!prev[parentId] || (childCategories[parentId] || []).length === 0) {
            delete newHasChildren[parentId];
          }
        }
        return newHasChildren;
      });
    } catch (error) {
      toast.error("❌ Xoá danh mục thất bại.");
      console.error("Lỗi khi xoá danh mục:", error);
    }
  };

  const handleEditCategory = (category: Category.CategoryDataResponse) => {
    setSelectedCategory(category);
    setEditModalOpen(true);
  };

  const handleCategoryCreated = async () => {
    setExpandedRows({});
    setChildCategories({});
    setHasChildren({});
    await fetchCategories();

    const updatedExpandedRows = { ...expandedRows };
    const updatedChildCategories = { ...childCategories };
    for (const id in updatedExpandedRows) {
      if (updatedExpandedRows[id]) {
        try {
          const children = await getChildCategories(id);
          updatedChildCategories[id] = children;
        } catch (error) {
          console.error("Lỗi khi tải lại danh mục con:", error);
        }
      }
    }
    setChildCategories(updatedChildCategories);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Danh sách danh mục</h1>
      <Card>
        <CardHeader className="pb-0">
          <div className="w-full flex justify-end">
            <Button onClick={() => setModalOpen(true)} className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Thêm danh mục
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên danh mục</TableHead>
                <TableHead>Thao tác</TableHead>
                <TableHead className="text-right" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <React.Fragment key={category.id}>
                  <TableRow>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <EllipsisVertical />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleEditCategory(category)}>
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteCategory(category.id)}>
                            Xoá
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                    <TableCell className="text-right">
                      {hasChildren[category.id] && (
                        <button onClick={() => toggleRow(category.id, 1)}>
                          {expandedRows[category.id] ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </TableCell>
                  </TableRow>
                  {expandedRows[category.id] && renderChildren(category.id, 1)}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </CardContent>

        <CategoryModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          onCategoryCreated={handleCategoryCreated}
        />

        <CategoryEditModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          category={selectedCategory}
          onCategoryUpdated={handleCategoryCreated}
        />
      </Card>
    </div>
  );
}
