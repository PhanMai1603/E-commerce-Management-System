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

import { Ellipsis } from 'lucide-react';


const role = [
    {
        id: 1,
        name: "Basic",
    },
    {
        id: 2,
        name: "Admin",
    },
    {
        id: 3,
        name: "Manager",
    },

]

export function TableDemo() {
    return (
        <Table>
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
                <TableRow>
                    {/* <TableHead className="w-[100px]">Invoice</TableHead> */}

                    <TableHead>Role ID</TableHead>
                    <TableHead>Name</TableHead>

                    <TableHead className="text-right"></TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {role.map((role) => (
                    <TableRow key={role.id}>
                        <TableCell className="font-medium">{role.id}</TableCell>
                        <TableCell className="font-medium">{role.name}</TableCell>
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