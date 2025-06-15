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

export default function TransactionsForm() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

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
    switch (status) {
      case "COMPLETED":
        return <Badge className="bg-green-500">Thành công</Badge>;
      case "FAILED":
        return <Badge className="bg-red-500">Thất bại</Badge>;
      case "PENDING":
        return <Badge className="bg-yellow-500 text-black">Đang xử lý</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
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
                      {tx.type}
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
