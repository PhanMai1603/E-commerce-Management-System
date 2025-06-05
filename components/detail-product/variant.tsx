import { ProductDetailResponse, SkuList } from "@/interface/product";
import React from "react";
import { Card } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ProductVariantProps {
  skuList: SkuList[];
  setProduct: React.Dispatch<React.SetStateAction<ProductDetailResponse>>;
}

export default function ProductVariant({
  skuList,
}: ProductVariantProps) {
  return (
    <Card className="col-start-2 col-span-8 flex flex-col p-4">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Variants</h3>

      {skuList.length > 0 ? (
        <Table className="w-full border rounded-lg overflow-hidden">
          <TableHeader>
            <TableRow>
              <TableHead>Slug</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Sold</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {skuList.map((variant, index) => (
              <TableRow
                key={index}
                className="hover:bg-gray-100 transition-colors duration-200"
              >
                <TableCell>{variant.slug}</TableCell>
                <TableCell>{variant.price.toLocaleString()}đ</TableCell>
                <TableCell>{variant.quantity}</TableCell>
                <TableCell>{variant.sold}</TableCell>
                <TableCell className="px-4 py-2 ">
                  <span
                    className={`inline-block px-2 py-1 rounded-2xl text-sm font-semibold whitespace-nowrap
      ${
        variant.status === "PUBLISHED"
          ? "bg-[#00B8D929] text-[#006C9C]"
          : variant.status === "DRAFT"
          ? "bg-[#919EAB29] text-[#637381]"
          : variant.status === "DISCONTINUED"
          ? "bg-[#FF563029] text-[#B71D18]"
          : variant.status === "OUT_OF_STOCK"
          ? "bg-[#FFAB0029] text-[#B76E00]"
          : "bg-gray-200 text-gray-600"
      }`}
                  >
                    {variant.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="text-sm text-gray-500 italic">No variants available</p>
      )}
    </Card>
  );
}
