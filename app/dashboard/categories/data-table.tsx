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
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion"

const categories = [
  {
    name: "Man",
    action: "Edit",
  }
]
import { Ellipsis } from 'lucide-react';

export function TableDemo() {
  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          {/* <TableHead className="w-[100px]">Invoice</TableHead> */}
          <TableHead>Categories</TableHead>
          <TableHead>Action</TableHead>
          <TableHead className="text-right"></TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {categories.map((categories) => (
          <TableRow key={categories.name}>
            <TableCell className="font-medium">{categories.name}</TableCell>
            <TableCell className="text-right"><Ellipsis /></TableCell>
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
  )
}
