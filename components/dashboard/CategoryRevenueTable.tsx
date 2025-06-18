/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { JSX, useEffect, useState } from "react";
import { getCategory } from "@/app/api/statistics";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { ChevronDown, ChevronRight } from "lucide-react";

interface CategoryRevenue {
  id: string;
  name: string;
  parentId: string | null;
  totalRevenue: number;
  totalOrders: number;
  children: CategoryRevenue[];
}

export default function CategoryRevenueTable({
  userId,
  accessToken,
  startDate,
  endDate,
}: {
  userId: string;
  accessToken: string;
  startDate: Date;
  endDate: Date;
}) {
  const [data, setData] = useState<CategoryRevenue[]>([]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getCategory(
        userId,
        accessToken,
        format(startDate, "yyyy-MM-dd"),
        format(endDate, "yyyy-MM-dd")
      );
      setData(res);
    } catch (err) {
      toast.error("Lỗi khi tải dữ liệu doanh thu theo danh mục.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

const renderCategoryRows = (categories: CategoryRevenue[], level = 0): JSX.Element[] => {
  return categories.flatMap((category) => {
    const isExpanded = expanded[category.id] || false;
    const hasChildren = category.children && category.children.length > 0;

    const currentRow = (
      <TableRow key={category.id}>
        <TableCell className="text-left">
          <div className="flex items-center">
            {hasChildren && (
              <button
                onClick={() => toggleExpand(category.id)}
                className="mr-1 text-sm focus:outline-none"
              >
                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
            )}
            <span className="block" style={{ paddingLeft: `${level * 16}px` }}>
              {category.name}
            </span>
          </div>
        </TableCell>
        <TableCell className="text-right">
          {category.totalRevenue.toLocaleString()} đ
        </TableCell>
        <TableCell className="text-right">{category.totalOrders}</TableCell>
      </TableRow>
    );

    const childRows =
      hasChildren && isExpanded
        ? renderCategoryRows(category.children, level + 1)
        : [];

    return [currentRow, ...childRows];
  });
};



  return (
    <Card className="p-4 space-y-4">
      <CardHeader>
        <CardTitle>Doanh thu theo danh mục</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Danh mục</TableHead>
              <TableHead className="text-right">Doanh thu</TableHead>
              <TableHead className="text-right">Số đơn</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-4">
                  Không có dữ liệu.
                </TableCell>
              </TableRow>
            ) : (
              renderCategoryRows(data)
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
