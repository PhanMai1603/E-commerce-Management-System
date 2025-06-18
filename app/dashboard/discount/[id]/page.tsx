/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { PromotionDetail, PromotionProduct, PromotionCategory } from "@/interface/inventory";
import { getDetailDiscount } from "@/app/api/inventory";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const STATUS_COLOR: Record<string, string> = {
  ACTIVE: "bg-green-500",
  EXPIRED: "bg-gray-400",
  CANCELLED: "bg-red-500",
};
const TYPE_LABEL: Record<string, string> = {
  PERCENT: "Giảm theo %",
  AMOUNT: "Giảm số tiền",
};

export default function DiscountDetailPage() {
  const { id } = useParams() as { id: string };
  const [detail, setDetail] = useState<PromotionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    // Lấy userId và accessToken từ localStorage phía client
    setUserId(localStorage.getItem("userId"));
    setAccessToken(localStorage.getItem("accessToken"));
  }, []);

  useEffect(() => {
    if (!id || !userId || !accessToken) return;
    setLoading(true);
    getDetailDiscount(id, userId, accessToken)
      .then(setDetail)
      .finally(() => setLoading(false));
  }, [id, userId, accessToken]);

  if (loading) return <div className="p-4">Đang tải...</div>;
  if (!detail) return <div className="p-4">Không tìm thấy thông tin khuyến mãi.</div>;

  return (
    <Card className="max-w-3xl mx-auto p-4 space-y-4">
      <CardHeader>
        <CardTitle>
          Chi tiết khuyến mãi&nbsp;
          <Badge className={STATUS_COLOR[detail.status] + " text-white"}>
            {detail.status === "ACTIVE" ? "Đang áp dụng" :
              detail.status === "EXPIRED" ? "Hết hạn" : "Đã huỷ"}
          </Badge>
        </CardTitle>
        <div className="mt-2 text-sm text-muted-foreground">
          Mã khuyến mãi: <b>{detail.code}</b>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div><b>Loại:</b> {TYPE_LABEL[detail.discountType]}</div>
            <div>
              <b>Giá trị:</b>{" "}
              {detail.discountType === "PERCENT" ? (
                <span>{detail.discountValue}%</span>
              ) : (
                <span>{detail.discountValue.toLocaleString()} đ</span>
              )}
            </div>
            <div>
              <b>Thời gian áp dụng:</b>{" "}
              {format(new Date(detail.discountStart), "dd/MM/yyyy", { locale: vi })} -{" "}
              {format(new Date(detail.discountEnd), "dd/MM/yyyy", { locale: vi })}
            </div>
            <div>
              <b>Ghi chú:</b>{" "}
              {detail.note ? detail.note : <span className="italic text-gray-400">Không có</span>}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={detail.createdBy.avatar} />
                <AvatarFallback>{detail.createdBy.name[0]}</AvatarFallback>
              </Avatar>
              <span className="text-xs text-gray-500">Tạo bởi: {detail.createdBy.name}</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={detail.updatedBy.avatar} />
                <AvatarFallback>{detail.updatedBy.name[0]}</AvatarFallback>
              </Avatar>
              <span className="text-xs text-gray-500">Cập nhật: {detail.updatedBy.name}</span>
            </div>
            <div className="mt-2 text-xs text-gray-400">
              Tạo lúc: {format(new Date(detail.createdAt), "HH:mm dd/MM/yyyy", { locale: vi })}
            </div>
            <div className="text-xs text-gray-400">
              Cập nhật: {format(new Date(detail.updatedAt), "HH:mm dd/MM/yyyy", { locale: vi })}
            </div>
          </div>
        </div>
        {/* Sản phẩm áp dụng */}
        <div>
          <div className="font-semibold mb-2">Sản phẩm áp dụng ({detail.items.length})</div>
          {detail.items.length === 0 ? (
            <div className="text-gray-400 italic">Không có sản phẩm áp dụng.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead>Tên sản phẩm</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {detail.items.map((prod: PromotionProduct) => (
                  <TableRow key={prod.productId}>
                    <TableCell>
                      {prod.productImage ? (
                        <img src={prod.productImage} alt={prod.productName} className="h-10 w-10 object-cover rounded-lg" />
                      ) : (
                        <div className="h-10 w-10 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">No image</div>
                      )}
                    </TableCell>
                    <TableCell>{prod.productName}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
        {/* Danh mục áp dụng */}
        <div>
          <div className="font-semibold mb-2">Danh mục áp dụng ({detail.categories.length})</div>
          {detail.categories.length === 0 ? (
            <div className="text-gray-400 italic">Không có danh mục áp dụng.</div>
          ) : (
            <ul className="flex flex-wrap gap-2">
              {detail.categories.map((cat: PromotionCategory) => (
                <li key={cat.categoryId}>
                  <Badge variant="secondary">{cat.categoryName}</Badge>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
