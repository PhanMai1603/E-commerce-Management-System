"use client";
import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { LockKeyhole, Pencil } from "lucide-react";
import { getAllRole, getRoleDetail } from "@/app/api/role";
import { Role, RoleDetailResponse } from "@/interface/role";
import get from "lodash/get";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import React from "react";

const categories = ["PAGE", "MANAGE_PRODUCT", "SYSTEM", "MANAGE_ORDER", "SETTING"] as const;
const entities: { [key in typeof categories[number]]: string[] } = {
  PAGE: ["PANEL", "DASHBOARD"],
  MANAGE_PRODUCT: ["PRODUCT", "CATEGORY", "ATTRIBUTE", "SKU", "UPLOAD", "COUPON"],
  SYSTEM: ["USER", "ROLE"],
  MANAGE_ORDER: ["REVIEW", "ORDER"],
  SETTING: ["PAYMENT_TYPE", "DELIVERY_TYPE", "CITY"],
};
const actions = ["CREATE", "VIEW", "UPDATE", "DELETE"];

export function RoleTable() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [roleDetails, setRoleDetails] = useState<RoleDetailResponse | null>(null);

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

  const fetchRoleDetails = useCallback(async (roleId: string) => {
    try {
      if (!userId || !accessToken) {
        toast.error("User authentication is required.");
        return;
      }

      const details = await getRoleDetail(roleId, userId, accessToken);
      setRoleDetails(details);
    } catch (error) {
      const errorMessage = get(error, "response.data.error.message", "An unknown error occurred.");
      toast.error(errorMessage);
    }
  }, [userId, accessToken]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  useEffect(() => {
    if (selectedRole) {
      fetchRoleDetails(selectedRole);
    }
  }, [selectedRole, fetchRoleDetails]);

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>All Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => (
                  <TableRow
                    key={role.id}
                    className={selectedRole === role.id ? "bg-gray-50" : "hover:bg-gray-100"}
                    onClick={() => setSelectedRole(role.id)}
                  >
                    <TableCell>{role.name}</TableCell>
                    <TableCell>
                      {role.name === "Admin" || role.name === "Basic" ? <LockKeyhole /> : <Pencil />}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <div className="col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Role Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  {actions.map((action) => (
                    <TableHead key={action} className="text-center">{action}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <React.Fragment key={category}>
                    <TableRow key={`${category}-header`} className="bg-gray-200">
                      <TableCell colSpan={actions.length + 1} className="font-bold">
                        {category}
                      </TableCell>
                    </TableRow>
                    {entities[category].map((entity) => (
                      <TableRow key={`${category}-${entity}`}>
                        <TableCell className="pl-6">
                          {entity.charAt(0).toUpperCase() + entity.slice(1).toLowerCase()}
                        </TableCell>

                        {actions.map((action) => (
                          <TableCell key={`${category}-${entity}-${action}`} className="text-center">
                            <Checkbox
                              checked={!!(roleDetails?.permissions?.[category]?.[entity]?.[action] ?? false)}
                              onClick={(e) => e.preventDefault()}
                            />

                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}