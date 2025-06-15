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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  getAllOrder,
  updateOrderStatus,
} from "@/app/api/order";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination";
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
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(5);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);

  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken") || ""
      : "";

  const fetchOrders = async () => {
    try {
      const response = await getAllOrder(userId, accessToken, page, size);
      setOrders(response.items || []);
      setTotalItems(response.total);
      setTotalPages(response.totalPages);
    } catch (error) {
      toast.error("Không thể tải danh sách đơn hàng");
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
      toast.success("Cập nhật trạng thái đơn hàng thành công!");
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
        <CardTitle>Tất cả đơn hàng</CardTitle>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground whitespace-nowrap">
              Hiển thị:
            </label>
            <Select
              value={size.toString()}
              onValueChange={(val) => {
                setSize(Number(val));
                setPage(1);
              }}
            >
              <SelectTrigger className="h-10 rounded-md px-3 py-2 text-sm">
                <SelectValue placeholder="Chọn số lượng mỗi trang" />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 25, 50, 100].map((option) => (
                  <SelectItem key={option} value={option.toString()}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Khách hàng</TableHead>
              <TableHead>Sản phẩm</TableHead>
              <TableHead>Tổng tiền</TableHead>
              <TableHead>Ngày đặt</TableHead>
              <TableHead>Hình thức giao hàng</TableHead>
              <TableHead>Phương thức thanh toán</TableHead>
              <TableHead>Trạng thái thanh toán</TableHead>
              <TableHead>Trạng thái đơn hàng</TableHead>
              <TableHead>Trạng thái tiếp theo</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.shippingAddress.fullname}</TableCell>
                <TableCell>
                  {order.items.reduce((total, item) => total + item.quantity, 0)}
                </TableCell>
                <TableCell>{order.totalPrice.toLocaleString()}₫</TableCell>
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
                        <span className="sr-only">Mở menu</span>
                        <EllipsisVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleView(order)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Xem chi tiết
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedOrderId(order.id);
                          setModalOpen(true);
                        }}
                      >
                        <PencilLine className="mr-2 h-4 w-4" />
                        Cập nhật trạng thái
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <CardFooter className="border-t pt-3 flex flex-col md:flex-row items-center justify-between gap-4">

  <Pagination>
    <PaginationContent>
      <PaginationItem>
        <PaginationLink
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setPage((prev) => Math.max(prev - 1, 1));
          }}
        >
          Trước
        </PaginationLink>
      </PaginationItem>

      {Array.from({ length: totalPages }).map((_, i) => {
        const pageNumber = i + 1;
        return (
          <PaginationItem key={pageNumber}>
            <PaginationLink
              href="#"
              isActive={pageNumber === page}
              onClick={(e) => {
                e.preventDefault();
                setPage(pageNumber);
              }}
            >
              {pageNumber}
            </PaginationLink>
          </PaginationItem>
        );
      })}

      {totalPages > 5 && (
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
      )}

      <PaginationItem>
        <PaginationLink
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setPage((prev) => Math.min(prev + 1, totalPages));
          }}
        >
          Sau
        </PaginationLink>
      </PaginationItem>
    </PaginationContent>
  </Pagination>
</CardFooter>



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
