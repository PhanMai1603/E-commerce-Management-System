/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, ChevronUp, EllipsisVertical, Plus } from "lucide-react";
import { getAllCategories, getChildCategories, deleteCategories } from "@/app/api/category";
import * as Category from "@/interface/category";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import CategoryModal from "@/components/category/create";
import { toast } from "react-toastify";
import CategoryEditModal from "@/components/category/edit";

export default function Page() {
  const [categories, setCategories] = useState<Category.CategoryDataResponse[]>([]);
  const [childCategories, setChildCategories] = useState<Record<string, Category.CategoryDataResponse[]>>({});
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [hasChildren, setHasChildren] = useState<Record<string, boolean>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category.CategoryDataResponse | null>(null); // Lưu danh mục cần chỉnh sửa

  // Function to fetch all categories
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
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const checkHasChildren = async (id: string, childCheck: Record<string, boolean>, level: number) => {
    if (level > 2) return; // Only check up to level 2

    try {
      const children = await getChildCategories(id);
      childCheck[id] = children.length > 0;

      if (level < 2) {
        for (const child of children) {
          await checkHasChildren(child.id, childCheck, level + 1);
        }
      }
    } catch (error) {
      console.error(`Error checking child categories for ${id}:`, error);
    }
  };

  const handleEditCategory = (category: Category.CategoryDataResponse) => {
    console.log("Selected category for editing:", category); // Add this log for debugging
    setSelectedCategory(category); // Lưu danh mục cần chỉnh sửa
    setEditModalOpen(true); // Mở modal chỉnh sửa
  };

  const toggleRow = async (id: string, level: number) => {
    if (level > 2) return; // Limit to max 2 levels

    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));

    if (!childCategories[id]) {
      try {
        const children = await getChildCategories(id);
        setChildCategories((prev) => ({
          ...prev,
          [id]: children,
        }));
      } catch (error) {
        console.error("Error fetching child categories:", error);
      }
    }
  };

  const getPadding = (level: number) => {
    const paddingMap = ["pl-4", "pl-8", "pl-12"];
    return paddingMap[level] || "pl-12"; // Limit to 3 levels
  };

  const renderChildren = (parentId: string, level: number): React.ReactNode => {
    if (level > 2) return null; // Limit to 3 levels

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
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDeleteCategory(child.id)}>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
          <TableCell className="text-right">
            {hasChildren[child.id] && level < 2 && (
              <button onClick={() => toggleRow(child.id, level + 1)}>
                {expandedRows[child.id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            )}
          </TableCell>
        </TableRow>

        {expandedRows[child.id] && renderChildren(child.id, level + 1)}
      </React.Fragment>
    ));
  };

  const handleDeleteCategory = async (categoryId: string) => {
    const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
    const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

    // Optimistic UI update: remove category before API call
    setCategories((prevCategories) => prevCategories.filter((category) => category.id !== categoryId));

    try {
      await deleteCategories(categoryId, userId, accessToken);
      toast.success("Category deleted successfully!");
    } catch (error) {
      toast.error("Error deleting category. Please try again.");
      fetchCategories();  // Reload categories in case of error
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Categories</CardTitle>
        <Button onClick={() => setModalOpen(true)} className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Category
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Categories Name</TableHead>
              <TableHead>Action</TableHead>
              <TableHead className="text-right"></TableHead>
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
                        <DropdownMenuItem onClick={() => handleEditCategory(category)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteCategory(category.id)}>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  <TableCell className="text-right">
                    {hasChildren[category.id] && (
                      <button onClick={() => toggleRow(category.id, 1)}>
                        {expandedRows[category.id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
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
      <CategoryModal open={modalOpen} onOpenChange={setModalOpen} onCategoryCreated={fetchCategories} />
      <CategoryEditModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        category={selectedCategory} // Ensure the full category object is passed
        onCategoryUpdated={fetchCategories}
      />
    </Card>
  );
}
