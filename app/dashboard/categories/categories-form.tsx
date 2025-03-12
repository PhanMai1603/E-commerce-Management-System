"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, ChevronUp, EllipsisVertical, Plus } from "lucide-react";
import { getAllCategories, getChildCategories } from "@/app/api/category";
import * as Category from "@/interface/category";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Page() {
  const [categories, setCategories] = useState<Category.CategoryDataResponse[]>([]);
  const [childCategories, setChildCategories] = useState<Record<string, Category.CategoryDataResponse[]>>({});
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [hasChildren, setHasChildren] = useState<Record<string, boolean>>({});
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);

        const childCheck: Record<string, boolean> = {};
        for (const category of data) {
          await checkHasChildren(category.id, childCheck);
        }
        setHasChildren(childCheck);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkHasChildren = async (id: string, childCheck: Record<string, boolean>) => {
    try {
      const children = await getChildCategories(id);
      childCheck[id] = children.length > 0;
      for (const child of children) {
        await checkHasChildren(child.id, childCheck);
      }
    } catch (error) {
      console.error(`Error checking child categories for ${id}:`, error);
    }
  };

  const toggleRow = async (id: string) => {
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

  const renderChildren = (parentId: string, level: number): React.ReactNode => {
    const children = childCategories[parentId] || [];

    return children.map((child) => (
      <React.Fragment key={child.id}>
        <TableRow className="bg-gray-50">
          <TableCell className={`pl-${level * 4}`}>{child.name}</TableCell>
          <TableCell>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <EllipsisVertical />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => console.log("View", child)}>View</DropdownMenuItem>
                <DropdownMenuItem onClick={() => console.log("Edit", child)}>Edit</DropdownMenuItem>
                <DropdownMenuItem onClick={() => console.log("Delete", child)}>Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
          <TableCell className="text-right">
            {hasChildren[child.id] && (
              <button onClick={() => toggleRow(child.id)}>
                {expandedRows[child.id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            )}
          </TableCell>
        </TableRow>

        {expandedRows[child.id] && renderChildren(child.id, level + 1)}
      </React.Fragment>
    ));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Categories</CardTitle>
        <Button onClick={() => router.push("/dashboard/categories/create")} className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Category
          </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>A list of your recent categories.</TableCaption>
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
                        <DropdownMenuItem onClick={() => console.log("View", category)}>View</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => console.log("Edit", category)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => console.log("Delete", category)}>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  <TableCell className="text-right flex items-center justify-end">
                    {hasChildren[category.id] && (
                      <button onClick={() => toggleRow(category.id)}>
                        {expandedRows[category.id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    )}
                  </TableCell>
                </TableRow>

                {expandedRows[category.id] && renderChildren(category.id, 1)}
              </React.Fragment>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right">{categories.length}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
    </Card>
  );
}
