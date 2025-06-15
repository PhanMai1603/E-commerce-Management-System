/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "react-toastify";
import { createRole } from "@/app/api/role";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const categoryLabels: Record<string, string> = {
  PAGE: "Trang",
  MANAGE_PRODUCT: "Quản lý sản phẩm",
  SYSTEM: "Hệ thống",
  MANAGE_ORDER: "Quản lý đơn hàng",
  SETTING: "Cài đặt",
};

const entityLabels: Record<string, string> = {
  PANEL: "Bảng điều khiển",
  DASHBOARD: "Thống kê",
  PRODUCT: "Sản phẩm",
  CATEGORY: "Danh mục",
  ATTRIBUTE: "Thuộc tính",
  SKU: "Biến thể",
  UPLOAD: "Tải lên",
  COUPON: "Mã giảm giá",
  USER: "Người dùng",
  ROLE: "Vai trò",
  REVIEW: "Đánh giá",
  ORDER: "Đơn hàng",
  PAYMENT_TYPE: "Thanh toán",
  DELIVERY_TYPE: "Giao hàng",
  CITY: "Thành phố",
};

const actionLabels: Record<string, string> = {
  CREATE: "Tạo",
  VIEW: "Xem",
  UPDATE: "Cập nhật",
  DELETE: "Xoá",
};

const RoleCreationForm = ({ onRoleCreated, onCancel }: { onRoleCreated: () => void; onCancel: () => void }) => {
  const [roleName, setRoleName] = useState("");
  const [permissions, setPermissions] = useState<Record<string, Record<string, Record<string, boolean>>>>({});

  const togglePermission = (category: string, entity: string, action: string) => {
    setPermissions((prev) => ({
      ...prev,
      [category]: {
        ...(prev[category] || {}),
        [entity]: {
          ...(prev[category]?.[entity] || {}),
          [action]: !(prev[category]?.[entity]?.[action] ?? false),
        },
      },
    }));
  };

  const handleSubmit = async () => {
    if (!roleName.trim()) {
      toast.error("Tên vai trò không được để trống");
      return;
    }

    const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
    const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

    if (!userId || !accessToken) {
      toast.error("Thiếu thông tin xác thực người dùng");
      return;
    }

    try {
      await createRole({ name: roleName, permissions }, userId, accessToken);
      toast.success("Tạo vai trò thành công!");
      onRoleCreated();
      onCancel();
    } catch (error) {
      toast.error("Không thể tạo vai trò");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Tạo vai trò mới</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Nhập tên vai trò"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            className="mb-4"
          />

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Phân quyền</TableHead>
                {actions.map((action) => (
                  <TableHead key={action} className="text-center">{actionLabels[action]}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <React.Fragment key={category}>
                  <TableRow key={`${category}-header`} className="bg-gray-200">
                    <TableCell colSpan={actions.length + 1} className="font-bold">
                      {categoryLabels[category] || category}
                    </TableCell>
                  </TableRow>

                  {entities[category].map((entity) => (
                    <TableRow key={`${category}-${entity}`}>
                      <TableCell className="pl-6">{entityLabels[entity] || entity}</TableCell>
                      {actions.map((action) => (
                        <TableCell key={`${category}-${entity}-${action}`} className="text-center">
                          <Checkbox
                            checked={!!(permissions[category]?.[entity]?.[action] ?? false)}
                            onCheckedChange={() => togglePermission(category, entity, action)}
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

      <div className="flex justify-end gap-3 mt-2">
        <Button variant="outline" onClick={onCancel}>Huỷ</Button>
        <Button onClick={handleSubmit}>Tạo vai trò</Button>
      </div>
    </div>
  );
};

export default RoleCreationForm;
