"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "next-themes";
import React from "react";

// Định nghĩa kiểu dữ liệu
export interface OrderRecords {
  totalRevenue: number;
  totalOrders: number;
  orderStatusCounts: {
    PENDING: number;
    AWAITING_PAYMENT: number;
    PROCESSING: number;
    READY_TO_SHIP: number;
    IN_TRANSIT: number;
    DELIVERED: number;
    CANCELLED: number;
    DELIVERY_FAILED: number;
    RETURN: number;
  };
}

// Nhãn tiếng Việt
const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: "Chờ xác nhận",
  AWAITING_PAYMENT: "Chờ thanh toán",
  PROCESSING: "Đang xử lý",
  READY_TO_SHIP: "Sẵn sàng giao",
  IN_TRANSIT: "Đang vận chuyển",
  DELIVERED: "Đã giao",
  CANCELLED: "Đã huỷ",
  DELIVERY_FAILED: "Thất bại",
  RETURN: "↩Hoàn trả",
};

// Gán màu logic từng trạng thái
const ORDER_STATUS_COLORS: Record<
  keyof OrderRecords["orderStatusCounts"],
  string
> = {
  PENDING: "#a3a3a3",           // Xám - Chờ xác nhận
  AWAITING_PAYMENT: "#fde047",  // Vàng - Chờ thanh toán
  PROCESSING: "#3b82f6",        // Xanh dương - Đang xử lý
  READY_TO_SHIP: "#38bdf8",     // Xanh cyan - Sẵn sàng giao
  IN_TRANSIT: "#6366f1",        // Xanh tím - Đang vận chuyển
  DELIVERED: "#22c55e",         // Xanh lá - Đã giao
  CANCELLED: "#ef4444",         // Đỏ - Đã huỷ
  DELIVERY_FAILED: "#f43f5e",   // Đỏ hồng - Thất bại
  RETURN: "#f59e42",            // Cam - Hoàn trả
};

interface Props {
  orderRecords: OrderRecords;
}

export default function DashboardOrderOverview({ orderRecords }: Props) {
  const { theme } = useTheme();

  // Chuẩn hoá dữ liệu cho PieChart
  const statusData = Object.entries(orderRecords.orderStatusCounts)
    .filter(([, value]) => value > 0)
    .map(([key, value]) => ({
      name: ORDER_STATUS_LABELS[key],
      value,
      fill: ORDER_STATUS_COLORS[key as keyof typeof ORDER_STATUS_COLORS],
    }));

  return (
    <div className="space-y-6">
      {/* Tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Tổng đơn hàng đã giao</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {orderRecords.totalOrders}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tổng doanh thu</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold ">
            {orderRecords.totalRevenue.toLocaleString()} ₫
          </CardContent>
        </Card>
      </div>

      {/* Biểu đồ tròn */}
      <Card>
        <CardHeader>
          <CardTitle>Phân tích trạng thái đơn hàng</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                outerRadius={120}
                label
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === "dark" ? "#1f2937" : "#fff",
                  border: "1px solid #ccc",
                  borderRadius: 8,
                  boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
