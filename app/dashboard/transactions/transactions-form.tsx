/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { Transaction } from "@/interface/payment";
import { toast } from "react-toastify";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { getTransactions } from "@/app/api/payment";

type PaymentStatus =
  | "PENDING"
  | "CANCELLED"
  | "COMPLETED"
  | "FAILED"
  | "PENDING_REFUND"
  | "REFUNDED";

const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  PENDING: "Đang chờ xử lý",
  CANCELLED: "Đã hủy",
  COMPLETED: "Hoàn tất",
  FAILED: "Thất bại",
  PENDING_REFUND: "Chờ hoàn tiền",
  REFUNDED: "Đã hoàn tiền",
};

const PAYMENT_STATUS_COLORS: Record<PaymentStatus, string> = {
  PENDING: "bg-yellow-500 text-black",
  CANCELLED: "bg-gray-500",
  COMPLETED: "bg-green-500",
  FAILED: "bg-red-500",
  PENDING_REFUND: "bg-orange-500",
  REFUNDED: "bg-blue-500",
};

const TRANSACTION_TYPE_LABELS = {
  PAYMENT: "Thanh toán",
  REFUND: "Hoàn tiền",
};

export default function TransactionsForm() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken") || ""
      : "";

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const data = await getTransactions(userId, accessToken);
      setTransactions(data.items || []);
    } catch (error) {
      toast.error("Không thể tải danh sách giao dịch.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId && accessToken) {
      fetchTransactions();
    }
  }, []);

  const formatDateTime = (iso: string) => {
    const d = new Date(iso);
    return `${d.toLocaleDateString("vi-VN")} ${d.toLocaleTimeString("vi-VN")}`;
  };

  const renderStatus = (status: string) => {
    const label = PAYMENT_STATUS_LABELS[status as PaymentStatus] || status;
    const color = PAYMENT_STATUS_COLORS[status as PaymentStatus] || "bg-gray-300";
    return <Badge className={color}>{label}</Badge>;
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Giao dịch</h1>
      <Card>
        <CardHeader />
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã giao dịch</TableHead>
                  <TableHead>Số tiền</TableHead>
                  <TableHead>Phương thức</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Người xử lý</TableHead>
                  <TableHead>Thời gian hoàn tất</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell title={tx.transactionId}>
                      {tx.transactionId}
                    </TableCell>

                    <TableCell className="font-semibold">
                      {tx.amount.toLocaleString("vi-VN")}₫
                    </TableCell>

                    <TableCell
                      className="truncate max-w-[120px]"
                      title={tx.method}
                    >
                      {tx.method}
                    </TableCell>

                    <TableCell
                      className="truncate max-w-[120px]"
                      title={tx.type}
                    >
                      {
                        TRANSACTION_TYPE_LABELS[
                          tx.type as keyof typeof TRANSACTION_TYPE_LABELS
                        ] || tx.type
                      }
                    </TableCell>

                    <TableCell>{renderStatus(tx.status)}</TableCell>

                    <TableCell>
                      {tx.admin ? (
                        <>
                          <div className="text-sm">{tx.admin.name}</div>
                          <div
                            className="text-xs text-muted-foreground truncate max-w-[160px]"
                            title={tx.admin.email}
                          >
                            {tx.admin.email}
                          </div>
                        </>
                      ) : (
                        <div className="text-sm text-muted-foreground italic">
                          Chưa có người xử lý
                        </div>
                      )}
                    </TableCell>

                    <TableCell>{formatDateTime(tx.completedAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
