import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ProductDetail } from "@/interface/product";

interface ProductDescriptionProps {
  product: ProductDetail;
}

export default function ProductDescription({ product }: ProductDescriptionProps) {
  return (
    <Card className="col-start-2 col-span-8 flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl text-gray-800">Description</CardTitle>
      </CardHeader>
      <CardContent>
        <div> {product.description}</div>
      </CardContent>
    </Card>
  );
}
