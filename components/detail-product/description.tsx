import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ProductDetail } from "@/interface/product";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Tag } from "lucide-react";

interface ProductDescriptionProps {
  product: ProductDetail;
}

export default function ProductDescription({ product }: ProductDescriptionProps) {
  return (
    <Card className="col-start-2 col-span-8 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold flex items-center">
          Thông tin chi tiết
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Danh mục */}
        <div>
          <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
            <Tag size={16} className="text-gray-500" />
            <span>Danh mục</span>
          </h3>
          <div className="flex flex-wrap gap-2 mt-1">
            {product.category.map((cat) => (
              <Badge
                key={cat.id}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-md text-sm font-medium transition-colors"
              >
                {cat.name}
              </Badge>
            ))}
          </div>
        </div>

        <Separator />

        {/* Mô tả */}
        <div>
          <h3 className="text-sm font-medium mb-2">Mô tả sản phẩm</h3>
          <div className="rounded-md bg-gray-50 p-4">
            <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-line">
              {product.description}
            </p>
          </div>
        </div>

        <Separator />

        {/* Thông số */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Số lượng còn lại</h3>
            <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-md font-medium">
              {product.quantity} sản phẩm
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Chính sách đổi trả</h3>
            <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-md font-medium">
              Trong vòng {product.returnDays} ngày
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
