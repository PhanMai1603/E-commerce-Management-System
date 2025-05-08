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
          Details
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Category Section */}
        <div>
          <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
            <Tag size={16} className="text-gray-500" />
            <span>Categories</span>
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

        {/* Description Section */}
        <div>
          <h3 className="text-sm font-medium mb-2">Description</h3>
          <div className="rounded-md bg-gray-50 p-4">
            <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-line">
              {product.description}
            </p>
          </div>
        </div>

        <Separator />

        {/* Product Specs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Quantity Available</h3>
            <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-md font-medium">
              {product.quantity} items
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Return Policy</h3>
            <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-md font-medium">
              {product.returnDays} days
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}