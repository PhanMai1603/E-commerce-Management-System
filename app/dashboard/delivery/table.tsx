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


const delivery = [
    {
        id: 1,
        name: "Free delivery within 5km",
        description: "Free delivery service for orders within 5km",
        status: "Active", //đơn hàng
    },
    {
        id: 2,
        name: "Suburban delivery",
        description: "Delivery service to suburban areas and neighboring provinces.",
        status: "Inactive", //đơn hàng
    },

]
import { Ellipsis } from 'lucide-react';

export function TableDemo() {
    return (
        <Table>
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="text-lg">Name</TableHead>
                    <TableHead className="text-lg">Description</TableHead>
                    <TableHead className="text-lg">Status</TableHead>
                    <TableHead className="text-right"></TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {delivery.map((delivery) => (
                    <TableRow key={delivery.id}>

                        <TableCell className="font-medium">{delivery.name}</TableCell>
                        <TableCell className="font-medium">{delivery.description}</TableCell>
                        <TableCell className="font-medium">{delivery.status}</TableCell>
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