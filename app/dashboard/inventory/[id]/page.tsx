/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getDetailInvventory } from "@/app/api/inventory";
import type { InventoryDetailResponse, InventoryDetail } from "@/interface/inventory";
import { toast } from "react-toastify";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function InventoryDetailPage() {
  const { id } = useParams() as { id: string };
  const [data, setData] = useState<InventoryDetailResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const detail = await getDetailInvventory(id, userId, accessToken);
        setData(detail);
      } catch (error) {
        toast.error("Lỗi khi lấy chi tiết phiếu nhập kho");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetail();
  }, [id, userId, accessToken]);

  if (loading) return <p className="text-center text-gray-500">Đang tải dữ liệu...</p>;
  if (!data) return <p className="text-center text-gray-500">Không tìm thấy chi tiết phiếu nhập kho.</p>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Chi tiết phiếu nhập kho</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-gray-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div><strong>Mã nhập:</strong> {data.importCode}</div>
            <div><strong>Lô hàng:</strong> {data.batchCode}</div>
            <div><strong>Nhà cung cấp:</strong> {data.supplier}</div>
            <div><strong>Tổng SL:</strong> {data.totalQuantity}</div>
            <div><strong>Tổng tiền:</strong> {parseInt(data.totalImportPrice).toLocaleString()}đ</div>
            <div><strong>Ghi chú:</strong> {data.note}</div>
            <div><strong>Người tạo:</strong> {data.createdBy.name}</div>
            <div><strong>Ngày tạo:</strong> {new Date(data.createdAt).toLocaleString()}</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Danh sách sản phẩm đã nhập</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hình ảnh</TableHead>
                <TableHead>Tên sản phẩm</TableHead>
                <TableHead>Biến thể</TableHead>
                <TableHead className="text-center">Số lượng</TableHead>
                <TableHead className="text-right">Giá nhập</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.items.map((item: InventoryDetail, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <img
                      src={item.productId.image}
                      alt={item.productName}
                      className="w-16 h-16 object-cover rounded border"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{item.productName}</TableCell>
                  <TableCell>{item.variantSlug || "Không có"}</TableCell>
                  <TableCell className="text-center">{item.quantity}</TableCell>
                  <TableCell className="text-right">{item.importPrice.toLocaleString()}đ</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
