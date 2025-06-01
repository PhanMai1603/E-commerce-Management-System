import React from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import Image from "next/image";
import { OrderItem } from "@/interface/order";

interface ProductProps {
  items: OrderItem[];
}

export default function Product({ items }: ProductProps) {
  return (
    <div className="col-span-3">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Products</h3>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  
                  {/* <TableHead>Product Discount</TableHead>
                  <TableHead>Coupon Discount</TableHead> */}
                  <TableHead>Subtotal</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {items.map((item) => {
                  const finalPrice = item.price - item.productDiscount - item.couponDiscount;
                  const subtotal = finalPrice * item.quantity;

                  return (
                    <TableRow key={item.variantId}>
                      <TableCell>
                        <Image
                          src={item.image}
                          alt={item.productName}
                          width={50}
                          height={50}
                          className="rounded-md object-cover"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{item.productName}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.variantSlug}
                        </div>
                      </TableCell>
                    
                      <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.price.toLocaleString()}₫</TableCell>
                      {/* <TableCell>{item.productDiscount.toLocaleString()}₫</TableCell>
                      <TableCell>{item.couponDiscount.toLocaleString()}₫</TableCell> */}
                      <TableCell className="font-semibold">
                        {subtotal.toLocaleString()}₫
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
