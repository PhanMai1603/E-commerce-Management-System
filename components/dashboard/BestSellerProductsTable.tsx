"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { BestSellerMetadata } from "@/interface/statistics"; // cập nhật path nếu khác

interface Props {
  data: BestSellerMetadata;
}

export default function BestSellerProductsTable({ data }: Props) {
  if (!data || data.items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>🔥 Sản phẩm bán chạy</CardTitle>
        </CardHeader>
        <CardContent>Không có dữ liệu.</CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>🔥 Sản phẩm bán chạy</CardTitle>
      </CardHeader>
      <CardContent className="overflow-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-muted">
              <th className="text-left py-2 px-3">Sản phẩm</th>
              <th className="text-left py-2 px-3">Biến thể</th>
              <th className="text-right py-2 px-3">Đã bán</th>
              <th className="text-right py-2 px-3">Doanh thu</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((product) => (
              <tr
                key={product.productId + product.variantName}
                className="border-b border-muted hover:bg-muted/40 transition"
              >
                <td className="py-2 px-3 flex items-center gap-2">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={product.mainImage} alt={product.productName} />
                  </Avatar>
                  <span>{product.productName}</span>
                </td>
                <td className="py-2 px-3">{product.variantName || "—"}</td>
                <td className="py-2 px-3 text-right">{product.totalQuantitySold}</td>
                <td className="py-2 px-3 text-right text-green-600 font-medium">
                  {product.totalRevenue.toLocaleString()} ₫
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
