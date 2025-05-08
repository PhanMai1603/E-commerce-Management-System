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

export function Order() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(1);
  const [size] = useState(10);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const router = useRouter();

  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken") || ""
      : "";

  const fetchOrders = async () => {
    try {
      const response = await getAllOrder(userId, accessToken, page, size);
      setOrders(response.orders || []);
    } catch (error) {
      toast.error("Failed to load orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

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
      <CardHeader className="flex justify-between items-center">
        <CardTitle>All Orders</CardTitle>
      </CardHeader>

      <CardContent>
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
              <TableHead className="text-right">Actions</TableHead>
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
                <TableCell className="text-left">{order.paymentMethod}</TableCell>
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
                        canceled: "bg-red-100 text-red-700",
                      }[order.status.toLowerCase()] ||
                      "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {order.status.replaceAll("_", " ")}
                  </span>
                </TableCell>
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
                      <DropdownMenuItem onClick={() => setSelectedOrderId(order.id)}>
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
    

    </Card>
  );
}
