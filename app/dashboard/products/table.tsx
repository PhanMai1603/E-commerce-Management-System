import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"
const products = [
  {
    name: "Man",
    price: 136.000,
    stock: 10,
    rating: 4.5,
    status: "Draft"
  },
  {
    name: "Men",
    price: 136.000,
    stock: 10,
    rating: 4.5,
    status: "Published"
  },
  {
    name: "Woman",
    price: 136.000,
    stock: 10,
    rating: 4.5,
    status: "Unpublished"
  }
]
import { EllipsisVertical } from 'lucide-react';

export function TableDemo() {
  return (
    <div>
      <h1>All Product List</h1>
      <div className="mb-6 flex justify-end">
        <Button>Add product</Button>
      </div>
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>

          <TableRow>
            {/* <TableHead className="w-[100px]">Invoice</TableHead> */}
            <TableHead>Product Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Publish</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {products.map((products) => (
            <TableRow key={products.name}>
              {/* image */}
              <TableCell className="font-medium">{products.name}</TableCell>
              <TableCell className="font-medium">{products.price}</TableCell>
              <TableCell className="font-medium">{products.stock}</TableCell>
              <TableCell className="font-medium">{products.rating}</TableCell>
              <TableCell className="font-medium">
                <span
                  className={`inline-block py-1 px-3 rounded-md text-sm font-semibold ${products.status === "Published"
                      ? "bg-[#00B8D929] text-[#006C9C]"
                      : products.status === "Draft"
                        ? "bg-[#919EAB29] text-[#637381]"
                        : "bg-[#FF563029] text-[#B71D18]"
                    }`}
                >
                  {products.status}
                </span>

              </TableCell>
              <TableCell className="text-righ t"><EllipsisVertical /></TableCell>
            </TableRow>
          ))}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">50</TableCell>
          </TableRow>
        </TableFooter>

      </Table>
    </div>
  )
}
