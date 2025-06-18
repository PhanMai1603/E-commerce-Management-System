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

interface Props {
  orderRecords: OrderRecords;
}

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

const COLORS = [
  "#EF4444",
  "#F59E0B",
  "#10B981",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
  "#22D3EE",
  "#A855F7",
  "#F97316",
];

export default function DashboardOrderOverview({ orderRecords }: Props) {
  const { theme } = useTheme();

  const statusData = Object.entries(orderRecords.orderStatusCounts)
    .filter(([, value]) => value > 0)
    .map(([key, value], index) => ({
      name: ORDER_STATUS_LABELS[key],
      value,
      fill: COLORS[index % COLORS.length],
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
