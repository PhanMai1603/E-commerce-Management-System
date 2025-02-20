"use client";
import React from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export function OrderPage() {
  const orderStatuses = [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "awaiting_payment", label: "Awaiting Payment" },
    { value: "paid", label: "Paid" },
    { value: "processing", label: "Processing" },
    { value: "awaiting_shipment", label: "Awaiting Shipment" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
    { value: "returned", label: "Returns/ Refunds" },
  ];

  const orders = [
    {
      id: "ORD-1733802614609",
      date: "10:50 10/12/2024",
      product: {
        name: "Áo jumper",
        color: "Xanh dương",
        size: "M",
        quantity: 2,
        price: 286300,
        originalPrice: 499000,
      },
      total: 594600,
      paymentMethod: "VNPAY",
      status: "processing", // Matches "Đang xử lý"
    },
    {
      id: "ORD-12",
      date: "10:50 10/12/2024",
      product: {
        name: "Áo jumper",
        color: "Xanh dương",
        size: "M",
        quantity: 2,
        price: 286300,
        originalPrice: 499000,
      },
      total: 594600,
      paymentMethod: "VNPAY",
      status: "pending", // Matches "Chờ xác nhận"
    },
    {
      id: "ORD-13",
      date: "10:50 10/12/2024",
      product: {
        name: "Áo jumper",
        color: "Xanh dương",
        size: "M",
        quantity: 2,
        price: 286300,
        originalPrice: 499000,
      },
      total: 594600,
      paymentMethod: "VNPAY",
      status: "awaiting_payment", // Matches "Chờ xác nhận"
    },
    {
      id: "ORD-14",
      date: "10:50 10/12/2024",
      product: {
        name: "Áo jumper",
        color: "Xanh dương",
        size: "M",
        quantity: 2,
        price: 286300,
        originalPrice: 499000,
      },
      total: 594600,
      paymentMethod: "VNPAY",
      status: "paid", // Matches "Chờ xác nhận"
    },
    {
      id: "ORD-15",
      date: "10:50 10/12/2024",
      product: {
        name: "Áo jumper",
        color: "Xanh dương",
        size: "M",
        quantity: 2,
        price: 286300,
        originalPrice: 499000,
      },
      total: 594600,
      paymentMethod: "VNPAY",
      status: "processing", // Matches "Chờ xác nhận"
    },
    {
      id: "ORD-16",
      date: "10:50 10/12/2024",
      product: {
        name: "Áo jumper",
        color: "Xanh dương",
        size: "M",
        quantity: 2,
        price: 286300,
        originalPrice: 499000,
      },
      total: 594600,
      paymentMethod: "VNPAY",
      status: "awaiting_shipment", // Matches "Chờ xác nhận"
    },
    {
      id: "ORD-17",
      date: "10:50 10/12/2024",
      product: {
        name: "Áo jumper",
        color: "Xanh dương",
        size: "M",
        quantity: 2,
        price: 286300,
        originalPrice: 499000,
      },
      total: 594600,
      paymentMethod: "VNPAY",
      status: "shipped", // Matches "Chờ xác nhận"
    },
    {
      id: "ORD-18",
      date: "10:50 10/12/2024",
      product: {
        name: "Áo jumper",
        color: "Xanh dương",
        size: "M",
        quantity: 2,
        price: 286300,
        originalPrice: 499000,
      },
      total: 594600,
      paymentMethod: "VNPAY",
      status: "delivered", // Matches "Chờ xác nhận"
    },
    {
      id: "ORD-19",
      date: "10:50 10/12/2024",
      product: {
        name: "Áo jumper",
        color: "Xanh dương",
        size: "M",
        quantity: 2,
        price: 286300,
        originalPrice: 499000,
      },
      total: 594600,
      paymentMethod: "VNPAY",
      status: "cancelled", // Matches "Chờ xác nhận"
    },
    {
      id: "ORD-20",
      date: "10:50 10/12/2024",
      product: {
        name: "Áo jumper",
        color: "Xanh dương",
        size: "M",
        quantity: 2,
        price: 286300,
        originalPrice: 499000,
      },
      total: 594600,
      paymentMethod: "VNPAY",
      status: "returned", // Matches "Chờ xác nhận"
    },
  ];

  return (
    <div className="p-6">
      <Tabs defaultValue="all">
        <TabsList className="flex space-x-2">
          {orderStatuses.map((status) => (
            <TabsTrigger key={status.value} value={status.value}>
              {status.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {orderStatuses.map((status) => (
          <TabsContent key={status.value} value={status.value}>
            {orders
              .filter((order) =>
                status.value === "all" ? true : order.status === status.value
              )
              .map((order) => (
                <div
                  key={order.id}
                  className="mt-4 p-4 bg-white rounded-lg shadow-md"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">
                        Mã đơn hàng: {order.id}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Ngày đặt: {order.date}
                      </p>
                    </div>
                    <Button className="text-sm">{status.label}</Button>
                  </div>
                  <div className="flex items-center space-x-4">
                    <img
                      src="pole3 (2).webp"
                      alt={order.product.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div>
                      <h4 className="font-medium">{order.product.name}</h4>
                      <p className="text-sm text-gray-500">
                        Màu: {order.product.color}, Kích thước: {order.product.size}
                      </p>
                      <p className="text-sm">x{order.product.quantity}</p>
                    </div>
                    <div className="ml-auto text-right">
                      <p className="text-red-500 font-medium">
                        {order.product.price.toLocaleString()} đ
                      </p>
                      <p className="text-sm line-through text-gray-400">
                        {order.product.originalPrice.toLocaleString()} đ
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-gray-500">
                    <p>Phương thức thanh toán: {order.paymentMethod}</p>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <p className="text-lg font-semibold">
                      Tổng số tiền:{" "}
                      <span className="text-red-500">
                        {order.total.toLocaleString()} đ
                      </span>
                    </p>
                    <Button variant="outline">Chi tiết đơn hàng</Button>
                  </div>
                </div>
              ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
