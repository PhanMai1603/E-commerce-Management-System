/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "react-toastify";
import { updateRole } from "@/app/api/role";
import { RoleDetailResponse } from "@/interface/role";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const categories = ["PAGE", "MANAGE_PRODUCT", "SYSTEM", "MANAGE_ORDER", "SETTING"] as const;

const entities: { [key in typeof categories[number]]: string[] } = {
  PAGE: ["PANEL", "DASHBOARD"],
  MANAGE_PRODUCT: ["PRODUCT", "CATEGORY", "ATTRIBUTE", "SKU", "UPLOAD", "COUPON"],
  SYSTEM: ["USER", "ROLE"],
  MANAGE_ORDER: ["REVIEW", "ORDER"],
  SETTING: ["PAYMENT_TYPE", "DELIVERY_TYPE", "CITY"]
};

const actions = ["CREATE", "VIEW", "UPDATE", "DELETE"];

const categoryLabels: Record<string, string> = {
  PAGE: "Trang chính",
  MANAGE_PRODUCT: "Quản lý sản phẩm",
  SYSTEM: "Hệ thống",
  MANAGE_ORDER: "Quản lý đơn hàng",
  SETTING: "Cài đặt"
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
  PAYMENT_TYPE: "Phương thức thanh toán",
  DELIVERY_TYPE: "Hình thức giao hàng",
  CITY: "Thành phố"
};

const actionLabels: Record<string, string> = {
  CREATE: "Tạo",
  VIEW: "Xem",
  UPDATE: "Sửa",
  DELETE: "Xóa"
};

interface RoleEditFormProps {
  role: RoleDetailResponse;
  onSave: () => void;
  onCancel: () => void;
}

export default function RoleEditForm({ role, onSave, onCancel }: RoleEditFormProps) {
  const [roleName, setRoleName] = useState(role.name ?? "");
  const [permissions, setPermissions] = useState<Record<string, Record<string, Record<string, boolean>>>>({});

  useEffect(() => {
    setRoleName(role.name ?? "");

    const formattedPermissions: Record<string, Record<string, Record<string, boolean>>> = {};
    categories.forEach((category) => {
      formattedPermissions[category] = {};
      entities[category].forEach((entity) => {
        formattedPermissions[category][entity] = {};
        actions.forEach((action) => {
          formattedPermissions[category][entity][action] = !!(
            role.permissions?.[category]?.[entity]?.[action] ?? false
          );
        });
      });
    });

    setPermissions(formattedPermissions);
  }, [role]);

  const togglePermission = (category: string, entity: string, action: string) => {
    setPermissions((prev) => ({
      ...prev,
      [category]: {
        ...(prev[category] || {}),
        [entity]: {
          ...(prev[category]?.[entity] || {}),
          [action]: !(prev[category]?.[entity]?.[action] ?? false)
        }
      }
    }));
  };

  const handleSubmit = async () => {
    const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
    const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

    if (!userId || !accessToken) {
      toast.error("Thiếu thông tin đăng nhập.");
      return;
    }

    const newTrimmed = roleName.trim();
    if (!newTrimmed) {
      toast.error("Tên vai trò không được để trống.");
      return;
    }

    const updatedData: any = {
      name: newTrimmed,
      permissions
    };

    try {
      await updateRole(role.id, updatedData, userId, accessToken);
      toast.success("Cập nhật vai trò thành công!");
      onSave();
      onCancel();
    } catch (error) {
      toast.error("Cập nhật vai trò thất bại.");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Chỉnh sửa vai trò</CardTitle>
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
                <TableHead>Thực thể</TableHead>
                {actions.map((action) => (
                  <TableHead key={action} className="text-center">
                    {actionLabels[action]}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <React.Fragment key={category}>
                  <TableRow key={`${category}-header`} className="bg-gray-200">
                    <TableCell colSpan={actions.length + 1} className="font-bold">
                      {categoryLabels[category]}
                    </TableCell>
                  </TableRow>

                  {entities[category].map((entity) => (
                    <TableRow key={`${category}-${entity}`}>
                      <TableCell className="pl-6">{entityLabels[entity]}</TableCell>
                      {actions.map((action) => (
                        <TableCell key={`${category}-${entity}-${action}`} className="text-center">
                          <Checkbox
                            checked={permissions[category]?.[entity]?.[action] ?? false}
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

      <div className="flex gap-2 justify-end">
        <Button onClick={onCancel} variant="secondary">Hủy</Button>
        <Button onClick={handleSubmit}>Lưu</Button>
      </div>
    </div>
  );
}
