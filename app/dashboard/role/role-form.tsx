"use client";
import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { Ellipsis, Plus } from "lucide-react";
import { getAllRole } from "@/app/api/role";
import { Role } from "@/interface/role";
import get from "lodash/get";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function RoleTable() {
  const [roles, setRoles] = useState<Role[]>([]);
  const router = useRouter();

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

  const fetchRoles = useCallback(async () => {
    try {
      const page = 1;
      const size = 10;

      if (!userId || !accessToken) {
        toast.error("User authentication is required.");
        return;
      }

      const roleData = await getAllRole(userId, accessToken, page, size);
      setRoles(roleData.roles);
    } catch (error) {
      const errorMessage = get(error, "response.data.error.message", "An unknown error occurred.");
      toast.error(errorMessage);
    }
  }, [userId, accessToken]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Roles</CardTitle>
        <Button onClick={() => router.push("/dashboard/role/create")} className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Role
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>A list of available roles.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Role ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {roles.length > 0 ? (
              roles.map((role, index) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell className="font-medium">{role.name}</TableCell>
                  <TableCell className="text-right">
                    <Ellipsis className="cursor-pointer" />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center">No roles found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
