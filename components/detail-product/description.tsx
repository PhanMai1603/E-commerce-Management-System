import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ProductDetail } from "@/interface/product";
import { Badge } from "../ui/badge";
import { Tag } from "lucide-react";

interface ProductDescriptionProps {
  product: ProductDetail;
}

export default function ProductDescription({ product }: ProductDescriptionProps) {
  return (
    <Card className="col-start-2 col-span-8">
      <CardHeader>
        <CardTitle>Detail</CardTitle>
      </CardHeader>

      <CardContent>
        {/* Category Section */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
            <span>Categories</span>
          </h3>
          <div className="flex flex-wrap gap-2 mt-1">
            {product.category.map((cat) => (
              <Badge 
                key={cat.id} 
                className="bg-gray-300 hover:bg-gray-400 text-black px-3 py-1 rounded-full text-sm font-medium transition-colors"
              >
                {cat.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Description Section */}
        <div className="mb-2">
          <h3 className="text-sm font-medium mb-3">Description</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-black leading-relaxed text-sm whitespace-pre-line">
              {product.description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}