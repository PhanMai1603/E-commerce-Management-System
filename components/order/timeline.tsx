/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ShoppingCart, Clock, CheckCircle2, Truck } from "lucide-react";

interface OrderTimelineCardProps {
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
  deliveredAt?: string;
}

export default function OrderTimelineCard({
  createdAt,
  updatedAt,
  paidAt,
  deliveredAt,
}: OrderTimelineCardProps) {
  const steps = [
    {
      label: "Đã đặt hàng",
      description: "Đơn hàng được tạo thành công",
      date: createdAt,
      icon: <ShoppingCart className="w-4 h-4" />,
    },
    paidAt && {
      label: "Đã thanh toán",
      description: "Hệ thống đã ghi nhận thanh toán",
      date: paidAt,
      icon: <CheckCircle2 className="w-4 h-4" />,
    },
    {
      label: "Đã cập nhật",
      description: "Trạng thái đơn hàng đã được cập nhật",
      date: updatedAt,
      icon: <Clock className="w-4 h-4" />,
    },
    deliveredAt && {
      label: "Đã giao hàng",
      description: "Đơn hàng đã được giao đến bạn",
      date: deliveredAt,
      icon: <Truck className="w-4 h-4" />,
    },
  ].filter(Boolean);

  return (
    <Card className="col-span-4 md:col-span-3 p-4">
      <CardHeader className="pb-2">
        <h2 className="text-lg font-semibold text-gray-800">Tiến trình đơn hàng</h2>
        <p className="text-sm text-gray-500">Theo dõi trạng thái đơn hàng của bạn</p>
      </CardHeader>

      <CardContent>
        <ol className="space-y-4">
          {steps.map((step: any, idx: number) => (
            <li key={idx} className="flex items-start gap-3">
              <div className="mt-1 text-gray-500">{step.icon}</div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-800">{step.label}</h4>
                <p className="text-sm text-gray-500">{step.description}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(step.date).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}{" "}
                  •{" "}
                  {new Date(step.date).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
