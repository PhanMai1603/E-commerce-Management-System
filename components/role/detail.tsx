/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RoleDetailResponse } from "@/interface/role";

const categories = ["PAGE", "MANAGE_PRODUCT", "SYSTEM", "MANAGE_ORDER", "SETTING"] as const;
const entities: { [key in typeof categories[number]]: string[] } = {
  PAGE: ["PANEL", "DASHBOARD"],
  MANAGE_PRODUCT: ["PRODUCT", "CATEGORY", "ATTRIBUTE", "SKU", "UPLOAD", "COUPON"],
  SYSTEM: ["USER", "ROLE"],
  MANAGE_ORDER: ["REVIEW", "ORDER"],
  SETTING: ["PAYMENT_TYPE", "DELIVERY_TYPE", "CITY"],
};
const actions = ["CREATE", "VIEW", "UPDATE", "DELETE"];

interface RoleDetailsProps {
  roleDetails: RoleDetailResponse | null;
  setModalOpen: (open: boolean) => void;
}

const RoleDetails: React.FC<RoleDetailsProps> = ({ roleDetails, setModalOpen }) => {
  if (!roleDetails) return null; // Nếu không có roleDetails thì không hiển thị gì cả.

  return (
    <Card>
      <CardHeader>
        <CardTitle>Role Details</CardTitle>
        <div className="text-sm text-gray-600">Role Name: {roleDetails.name}</div> {/* Hiển thị tên vai trò */}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              {actions.map((action) => (
                <TableHead key={action} className="text-center">
                  {action}
                </TableHead>
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
                          onClick={(e) => e.preventDefault()} // Ngừng hành động mặc định của checkbox
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
  );
};

export default RoleDetails;
