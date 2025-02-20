"use client";

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

const users = [
  {
    id: 1,
    name: "John Doe",
    email: "daohoangdang1123@gmail.com",
    role: "Admin",
    status: "Active",
  },
  {
    id: 2,
    name: "John Doe",
    email: "maiphan1603@gmail.com",
    role: "Basic",
    status: "Blocked",
  },
];

export function TableDemo() {
  return (
    <Table>
      <TableCaption>A list of your recent users.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Fullname</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right"></TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.name}</TableCell>
            <TableCell className="font-medium">{user.email}</TableCell>
            <TableCell className="font-medium">{user.role}</TableCell>
            <TableCell className="font-medium">
              <span
                className={`inline-block py-1 px-3 rounded-full text-sm font-semibold ${
                  user.status === "Active"
                    ? "bg-[#22C55E29] text-[#118D57]"
                    : user.status === "Blocked"
                    ? "bg-[#FF563029] text-[#B71D18]"
                    : "bg-[#919EAB29] text-[#637381]"
                }`}
              >
                {user.status}
              </span>
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
