/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAllDiscount } from "@/app/api/inventory"; // Đường dẫn đúng với API của bạn
import type { PromotionListItem, PromotionListMetadata, DiscountType, PromotionStatus } from "@/interface/inventory";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EllipsisVertical, Plus } from "lucide-react";

function getTypeLabel(type: DiscountType) {
  return type === "PERCENT" ? "Phần trăm (%)" : "Số tiền (VNĐ)";
}

function getStatusColor(status: PromotionStatus) {
  switch (status) {
    case "ACTIVE": return "bg-green-100 text-green-700";
    case "EXPIRED": return "bg-gray-100 text-gray-600";
    case "CANCELLED": return "bg-red-100 text-red-700";
    default: return "bg-gray-100 text-gray-600";
  }
}

export default function AllDiscountPage() {
  const [data, setData] = useState<PromotionListMetadata | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Lấy userId/accessToken từ localStorage (hoặc context, redux, tùy dự án)
  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : "";
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";

  const fetchDiscounts = async () => {
    if (!userId || !accessToken) return;
    setLoading(true);
    try {
      // Nếu API có phân trang, truyền page/size vào URL
      const result = await getAllDiscount(userId, accessToken); // có thể thêm (page, size) nếu backend hỗ trợ
      setData(result);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

    const handleView = (item: string) => {
    router.push(`/dashboard/discount/${item}`);
  };

  return (
    <Card className="p-4">
         <div className="flex justify-end mb-0">
    <Button
      onClick={() => router.push("/dashboard/discount/create")}
      className="flex items-center gap-2"
    >
      <Plus className="w-5 h-5" />
      Thêm mã khuyến mãi
    </Button>
  </div>
      <CardHeader>
        <CardTitle>Danh sách khuyến mãi</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã KM</TableHead>
              <TableHead>Loại</TableHead>
              <TableHead>Giá trị</TableHead>
              <TableHead>Ngày bắt đầu</TableHead>
              <TableHead>Ngày kết thúc</TableHead>
              <TableHead>Người tạo</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!data || data.items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  Không có dữ liệu.
                </TableCell>
              </TableRow>
            ) : (
              data.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-semibold">{item.code}</TableCell>
                  <TableCell>
                    <Badge>{getTypeLabel(item.discountType)}</Badge>
                  </TableCell>
                  <TableCell>
                    {item.discountType === "PERCENT"
                      ? `${item.discountValue}%`
                      : `${item.discountValue.toLocaleString()} đ`}
                  </TableCell>
                  <TableCell>
                    {format(new Date(item.discountStart), "dd/MM/yyyy", { locale: vi })}
                  </TableCell>
                  <TableCell>
                    {format(new Date(item.discountEnd), "dd/MM/yyyy", { locale: vi })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <img
                        src={item.createdBy.avatar || "/avatar.jpg" }
                        alt={item.createdBy.name}
                        className="w-7 h-7 rounded-full border"
                      />
                      <span>{item.createdBy.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(new Date(item.createdAt), "dd/MM/yyyy HH:mm", { locale: vi })}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <EllipsisVertical className="cursor-pointer" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(item.id)}>
                          Xem chi tiết
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
