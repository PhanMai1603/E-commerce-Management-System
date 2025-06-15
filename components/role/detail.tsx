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

const categoryLabels: Record<string, string> = {
  PAGE: "Trang chính",
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
  PAYMENT_TYPE: "Phương thức thanh toán",
  DELIVERY_TYPE: "Hình thức giao hàng",
  CITY: "Thành phố",
};

const actionLabels: Record<string, string> = {
  CREATE: "Tạo",
  VIEW: "Xem",
  UPDATE: "Sửa",
  DELETE: "Xóa",
};

interface RoleDetailsProps {
  roleDetails: RoleDetailResponse | null;
  setModalOpen: (open: boolean) => void;
}

const RoleDetails: React.FC<RoleDetailsProps> = ({ roleDetails }) => {
  if (!roleDetails) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chi tiết vai trò</CardTitle>
        <div className="mt-2 px-4 py-2 rounded-md bg-gray-100 text-gray-800 text-base font-semibold inline-block shadow-sm items-center gap-2">
          🛡️ Tên vai trò: <span className="text-primary font-bold">{roleDetails.name}</span>
        </div>
      </CardHeader>
      <CardContent>
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
                <TableRow key={`${category}-header`}>
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
  );
};

export default RoleDetails;
