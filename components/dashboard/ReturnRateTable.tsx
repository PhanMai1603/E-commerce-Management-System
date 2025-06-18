/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { getReturn } from "@/app/api/statistics";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { toast } from "react-toastify";

interface ReturnRateProduct {
  productId: string;
  productName: string;
  mainImage: string;
  totalSold: number;
  totalReturned: number;
  returnRate: number;
}

interface ReturnRateMetadata {
  total: number;
  totalPages: number;
  page: number;
  size: number;
  hasMore: boolean;
  items: ReturnRateProduct[];
}

export default function ReturnRateTable({ userId, accessToken }: { userId: string; accessToken: string }) {
  const [data, setData] = useState<ReturnRateProduct[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchReturnData = async () => {
    setLoading(true);
    try {
      const res = await getReturn(userId, accessToken);
      setData(res.items);
    } catch (error) {
      toast.error("Lỗi khi tải dữ liệu hoàn trả.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturnData();
  }, []);

  return (
    <Card className="p-4 space-y-4">
      <CardHeader>
        <CardTitle>Sản phẩm có tỷ lệ hoàn trả cao</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Hình ảnh</TableHead>
              <TableHead>Tên sản phẩm</TableHead>
              <TableHead className="text-right">Đã bán</TableHead>
              <TableHead className="text-right">Đã hoàn</TableHead>
              <TableHead className="text-right">Tỷ lệ hoàn trả</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  Không có dữ liệu hoàn trả.
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.productId}>
                  <TableCell>
                    <img src={item.mainImage} alt={item.productName} className="w-14 h-14 object-cover rounded" />
                  </TableCell>
                  <TableCell>{item.productName}</TableCell>
                  <TableCell className="text-right">{item.totalSold}</TableCell>
                  <TableCell className="text-right">{item.totalReturned}</TableCell>
                  <TableCell className="text-right text-red-500 font-medium">
                    {(item.returnRate * 100).toFixed(2)}%
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

