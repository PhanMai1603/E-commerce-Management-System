import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { EllipsisVertical } from "lucide-react";

const products = [
  {
    name: "Man",
    price: 136.0,
    stock: 10,
    rating: 4.5,
    status: "Draft",
  },
  {
    name: "Men",
    price: 136.0,
    stock: 10,
    rating: 4.5,
    status: "Published",
  },
  {
    name: "Woman",
    price: 136.0,
    stock: 10,
    rating: 4.5,
    status: "Unpublished",
  },
];

export function TableDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Product List</CardTitle>
        {/* <Button>Add product</Button> */}
      </CardHeader>

      <CardContent>
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Publish</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {products.map((product) => (
              <TableRow key={product.name}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell className="font-medium">{product.price}</TableCell>
                <TableCell className="font-medium">{product.stock}</TableCell>
                <TableCell className="font-medium">{product.rating}</TableCell>
                <TableCell className="font-medium">
                  <span
                    className={`inline-block py-1 px-3 rounded-md text-sm font-semibold ${
                      product.status === "Published"
                        ? "bg-[#00B8D929] text-[#006C9C]"
                        : product.status === "Draft"
                        ? "bg-[#919EAB29] text-[#637381]"
                        : "bg-[#FF563029] text-[#B71D18]"
                    }`}
                  >
                    {product.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <EllipsisVertical />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <CardFooter className="border-t pt-3 flex justify-end">
        <span className="text-sm text-gray-500">Total Products: {products.length}</span>
      </CardFooter>
    </Card>
  );
}
