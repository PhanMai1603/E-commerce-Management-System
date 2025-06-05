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
import {
  getAllOrder,
  getSearchOrder,
  updateOrderStatus,
} from "@/app/api/order";
import { Order } from "@/interface/order";
import { toast } from "react-toastify";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@/components/ui/pagination";
import {
  EllipsisVertical,
  Eye,
  PencilLine,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { OrderStatusModal } from "@/components/order/edit-order";

import { PaymentStatusBadge } from "@/components/order/payment-status";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SearchBar from "@/components/Search";
import { OrderStatusBadge } from "@/components/order/order-status";

export function OrderPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(5);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken") || ""
      : "";

  const fetchOrders = async () => {
    try {
      let response;
      if (searchQuery.trim()) {
        response = await getSearchOrder(searchQuery, userId, accessToken, page, size);
      } else {
        response = await getAllOrder(userId, accessToken, page, size);
      }

      setOrders(response.items || []);
      setTotalItems(response.total || 0);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      toast.error("Failed to load orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [userId, accessToken, page, size, searchQuery]);

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
      toast.error("Failed to update order status");
    } finally {
      setSelectedOrderId(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">All Orders</h1>

      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground whitespace-nowrap">
                Show:
              </label>
              <Select
                value={size.toString()}
                onValueChange={(val) => {
                  setSize(Number(val));
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-10 rounded-md px-3 py-2 text-sm">
                  <SelectValue placeholder="Select page size" />
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
            <SearchBar
              setQuery={(query: string) => {
                setSearchQuery(query);
                setPage(1); // reset lại về trang đầu khi tìm kiếm
              }}
            />


          </div>
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
                <TableHead>Payment Status</TableHead>
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

        <CardFooter className="border-t pt-3 flex flex-col md:flex-row items-center justify-between gap-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage((prev) => Math.max(prev - 1, 1));
                  }}
                />
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

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage((prev) => Math.min(prev + 1, totalPages));
                  }}
                />
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
    </div>
  );
}
