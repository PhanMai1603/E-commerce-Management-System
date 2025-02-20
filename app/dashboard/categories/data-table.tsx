"use client";
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
import { ChevronDown, ChevronUp, Ellipsis } from "lucide-react";
import React, { useState } from "react";

interface Category {
  name: string;
  action?: string;
  children: Category[];
}

const categories: Category[] = [
  {
    name: "Man",
    action: "Edit",
    children: [
      { name: "Shoes", children: [{ name: "Sneakers", children: [] }, { name: "Boots", children: [] }] },
      { name: "Shirts", children: [{ name: "Casual Shirts", children: [] }, { name: "Formal Shirts", children: [] }] },
      { name: "Accessories", children: [] },
    ],
  },
  {
    name: "Woman",
    action: "Edit",
    children: [
      { name: "Dresses", children: [{ name: "Evening Gowns", children: [] }, { name: "Casual Dresses", children: [] }] },
      { name: "Handbags", children: [{ name: "Clutches", children: [] }, { name: "Totes", children: [] }] },
      { name: "Jewelry", children: [] },
    ],
  },
];

export function TableDemo() {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const toggleRow = (name: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const renderChildren = (
    children: Category[],
    parentKey: string,
    level: number
  ): React.ReactNode => {
    return children.map((child, index) => (
      <React.Fragment key={`${parentKey}-${child.name}-${index}`}>
        <TableRow className="bg-gray-50">
          <TableCell className={`pl-${level * 4}`}>{child.name}</TableCell>
          <TableCell>
            <Ellipsis />
          </TableCell>
          <TableCell className="text-right">
            {child.children.length > 0 && (
              <button
                onClick={() => toggleRow(`${parentKey}-${child.name}`)}
                aria-label={`Toggle ${child.name}`}
              >
                {expandedRows[`${parentKey}-${child.name}`] ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
            )}
          </TableCell>
        </TableRow>

        {/* Render nested children if expanded */}
        {expandedRows[`${parentKey}-${child.name}`] &&
          renderChildren(child.children, `${parentKey}-${child.name}`, level + 1)}
      </React.Fragment>
    ));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>A list of your recent categories.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Categories</TableHead>
              <TableHead>Action</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {categories.map((category) => (
              <React.Fragment key={category.name}>
                <TableRow>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>
                    <Ellipsis />
                  </TableCell>
                  <TableCell className="text-right flex items-center justify-end">
                    <button
                      className="mr-2"
                      onClick={() => toggleRow(category.name)}
                      aria-label={`Toggle ${category.name}`}
                    >
                      {expandedRows[category.name] ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </TableCell>
                </TableRow>

                {/* Render subcategories when expanded */}
                {expandedRows[category.name] &&
                  renderChildren(category.children, category.name, 1)}
              </React.Fragment>
            ))}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right">50</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
    </Card>
  );
}
