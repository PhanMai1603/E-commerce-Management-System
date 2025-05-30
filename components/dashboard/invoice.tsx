/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getAllOrder,
  updateOrderStatus,
} from "@/app/api/order";
import type { Order } from "@/interface/order";
import { toast } from "react-toastify";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  EllipsisVertical,
  Eye,
  PencilLine,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PaymentStatusBadge } from "../order/payment-status";
import { OrderStatusBadge } from "../order/order-status";
import { OrderStatusModal } from "../order/edit-order";

export function Order() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(1);
  const [size] = useState(10);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);


  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken") || ""
      : "";

  const fetchOrders = async () => {
    try {
      const response = await getAllOrder(userId, accessToken);
      setOrders(response.items || []);
    } catch (error) {
      toast.error("Failed to load orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [userId, accessToken, page, size]);


  const handleView = (order: Order) => {
    router.push(`/dashboard/orders/${order.id}`);
  };

  const confirmEdit = async () => {
    if (!selectedOrderId) return;
    try {
      await updateOrderStatus(selectedOrderId, userId, accessToken);
      toast.success("Order status updated successfully!");
      fetchOrders();
    } catch (error) {
      // lỗi đã được xử lý trong API
    } finally {
      setSelectedOrderId(null);
    }
  };

  return (
    <Card>
      <CardHeader className="flex justify-between items-start text-xl">
        <CardTitle>All Orders</CardTitle>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Delivery Method</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableCell>Paymet Status</TableCell>
                <TableHead>Order Status</TableHead>
                <TableHead>Next Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
          </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.shippingAddress.fullname}</TableCell>
                  <TableCell>
                    {order.items.reduce((total, item) => total + item.quantity, 0)}
                  </TableCell>

                  <TableCell>{order.totalPrice.toLocaleString()}đ</TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </TableCell>

                  <TableCell>{order.deliveryMethod}</TableCell>
                  <TableCell className="text-left">{order.paymentMethod}</TableCell>
                  <TableCell>
                    <PaymentStatusBadge status={order.paymentStatus} />
                  </TableCell>
                  <TableCell>
                    <OrderStatusBadge status={order.status} />
                  </TableCell>

                  <TableCell>{order.nextStatus}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <EllipsisVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(order)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedOrderId(order.id);
                            setModalOpen(true);
                          }}
                        >

                          <PencilLine className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
        </Table>
      </CardContent>

      {/* Alert Dialog Confirm Edit */}
      <OrderStatusModal
              open={modalOpen}
              onClose={() => {
                setModalOpen(false);
                setSelectedOrderId(null);
              }}
              onConfirm={() => {
                confirmEdit();
                setModalOpen(false);
              }}
            />
    

    </Card>
  );
}
