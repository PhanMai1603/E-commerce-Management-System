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
  
  import { Ellipsis } from "lucide-react";
  
  const coupons = [
    {
      id: 1,
      name: "Product Discount",
      code: "DISCOUNT10",
      startDate: "12 May 2023",
      endDate: "12 Jun 2023",
      type: "PERCENT", // AMOUNT
      value: "20",
      targetType: "ORDER", // PRODUCT // DELIVERY
      isActive: true,
    },
    {
      id: 2,
      name: "Black Discount",
      code: "DISCOUNT20",
      startDate: "12 May 2023",
      endDate: "12 Jun 2023",
      type: "AMOUNT", 
      value: "20",
      targetType: "PRODUCT", // PRODUCT // DELIVERY
      isActive: false,
    },
    {
        id: 3,
        name: "Sale",
        code: "DISCOUNT30",
        startDate: "12 May 2023",
        endDate: "12 Jun 2023",
        type: "AMOUNT", 
        value: "20",
        targetType: "DELIVERY", // PRODUCT // DELIVERY
        isActive: false,
      },
  ];
  
  export function TableDemo() {
    return (
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name Coupons</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Target Type</TableHead>
            <TableHead>Is Active</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
  
        <TableBody>
          {coupons.map((coupon) => (
            <TableRow key={coupon.id}>
              <TableCell className="font-medium">{coupon.name}</TableCell>
              <TableCell className="font-medium">{coupon.code}</TableCell>
              <TableCell className="font-medium">{coupon.startDate}</TableCell>
              <TableCell className="font-medium">{coupon.endDate}</TableCell>
              <TableCell className="font-medium">{coupon.type}</TableCell>
              <TableCell className="font-medium">{coupon.value}</TableCell>
              <TableCell className="font-medium">{coupon.targetType}</TableCell>
              <TableCell className="font-medium">
                {coupon.isActive ? "Active" : "Inactive"}
              </TableCell>
              <TableCell className="text-right">
                <Ellipsis />
              </TableCell>
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
    );
  }
  