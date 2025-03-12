"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Ellipsis } from "lucide-react";
import { getAllUser } from "@/app/api/user";
import { UserData } from "@/interface/user";
import { toast } from "react-toastify";

export function UserTable() {
  const [users, setUsers] = useState<UserData[]>([]);

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUser(userId, accessToken);
        setUsers(response.users);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error("Failed to fetch users");
      }
    };

    fetchUsers();
  }, [userId, accessToken]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Users</CardTitle>
      </CardHeader>

      <CardContent>
        <Table>
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
            {users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell className="font-medium">{user.role?.name || "N/A"}</TableCell>
                  <TableCell className="font-medium">
                    <span
                      className={`inline-block py-1 px-3 rounded-full text-sm font-semibold ${user.status?.toUpperCase() === "ACTIVE"
                          ? "bg-[#22C55E29] text-[#118D57]"
                          : user.status?.toUpperCase() === "BLOCKED"
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
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500">
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="border-t pt-3 flex justify-end">
        <span className="text-sm text-gray-500">Total Users: {users.length}</span>
      </CardFooter>
    </Card>
  );
}
