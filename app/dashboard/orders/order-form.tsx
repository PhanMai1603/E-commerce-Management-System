"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { getAllOrder } from "@/app/api/order";
import { Order } from "@/interface/order";
import { toast } from "react-toastify";

export function OrderPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(1);
  const [size] = useState(10); // số dòng mỗi trang

  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken") || ""
      : "";

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getAllOrder(userId, accessToken, page, size);
        setOrders(response.orders || []);
      } catch (error) {
        toast.error("Failed to load orders");
      }
    };
    fetchOrders();
  }, [userId, accessToken, page, size]);

  return (
    <Card className="p-4 mt-4">
      <h2 className="text-xl font-semibold mb-4">Danh sách đơn hàng</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Delivery Method</TableHead>
            <TableHead>Payment Method</TableHead>
            <TableHead>Order Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>{order.shippingAddress.fullname}</TableCell>
              <TableCell>{order.totalPrice.toLocaleString()}đ</TableCell>
              <TableCell>
                {new Date(order.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>{order.deliveryMethod.name}</TableCell>
              <TableCell>{order.paymentMethod}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-sm font-medium ${
                    {
                      pending: "bg-yellow-100 text-yellow-700",
                      awaiting_payment: "bg-blue-100 text-blue-700",
                      paid: "bg-blue-100 text-blue-700",
                      processing: "bg-orange-100 text-orange-700",
                      awaiting_shipment: "bg-blue-100 text-blue-700",
                      shipped: "bg-blue-100 text-blue-700",
                      delivered: "bg-green-100 text-green-700",
                      cancelled: "bg-red-100 text-red-700",
                      returned: "bg-gray-100 text-gray-700",
                      canceled: "bg-red-100 text-red-700", // đề phòng sai chính tả
                    }[order.status.toLowerCase()] || "bg-gray-100 text-gray-700"
                  }`}
                >
                  {order.status.replaceAll("_", " ")}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
