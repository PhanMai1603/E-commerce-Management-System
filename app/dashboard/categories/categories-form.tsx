/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect, useState } from "react";
import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { ChevronDown, ChevronUp, EllipsisVertical, Plus } from "lucide-react";
import { getAllCategories, getChildCategories, deleteCategories } from "@/app/api/category";
import * as Category from "@/interface/category";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
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
      console.error("Error fetching categories:", error);
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
      console.error(`Error checking child categories for ${id}:`, error);
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
        console.error("Error fetching child categories:", error);
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
                <DropdownMenuItem onClick={() => handleEditCategory(child)}>Edit</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDeleteCategory(child.id)}>Delete</DropdownMenuItem>
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

  const handleDeleteCategory = async (id: string) => {
    const userId = localStorage.getItem("userId") || "";
    const token = localStorage.getItem("accessToken") || "";

    setCategories((prev) => prev.filter((cat) => cat.id !== id));
    try {
      await deleteCategories(id, userId, token);
      toast.success("Category deleted successfully!");
    } catch (error) {
      toast.error("Error deleting category.");
      fetchCategories();
    }
  };

  const handleEditCategory = (category: Category.CategoryDataResponse) => {
    setSelectedCategory(category);
    setEditModalOpen(true);
  };

  const handleCategoryCreated = async () => {
    await fetchCategories();

    // Refetch all child lists that are currently expanded
    for (const id in expandedRows) {
      if (expandedRows[id]) {
        const children = await getChildCategories(id);
        setChildCategories((prev) => ({ ...prev, [id]: children }));
      }
    }
  };

  return (
    <div className="p-0 grid grid-cols-1 lg:grid-cols-1 gap-4">
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
                <TableHead>Category Name</TableHead>
                <TableHead>Action</TableHead>
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
        <CategoryModal open={modalOpen} onOpenChange={setModalOpen} onCategoryCreated={handleCategoryCreated} />
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
