/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import { useEffect, useState } from "react";
import { getInvventory } from "@/app/api/inventory";
import type { InventoryResponse, Inventory } from "@/interface/inventory";
import { toast } from "react-toastify";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import { useRouter } from "next/navigation";

export default function InventoryForm() {
  const [inventoryList, setInventoryList] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

  useEffect(() => {
    const fetchInventory = async () => {
      setLoading(true);
      try {
        const data: InventoryResponse = await getInvventory(userId, accessToken);
        setInventoryList(data.items);
      } catch (error) {
        toast.error("Lỗi khi lấy danh sách kho hàng");
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, [userId, accessToken]);

  const handleView = (item: Inventory ) => {
    router.push(`/dashboard/inventory/${item.id}`);
  };
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Lịch sử nhập kho</h1>
      <Card>
        <CardHeader>
       
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Đang tải dữ liệu...</p>
          ) : inventoryList.length === 0 ? (
            <p>Không có dữ liệu kho hàng nào.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã nhập</TableHead>
                  <TableHead>Lô hàng</TableHead>
                  <TableHead>Nhà cung cấp</TableHead>
                  <TableHead>Tổng SL</TableHead>
                  <TableHead>Tổng tiền</TableHead>
                  <TableHead>Ghi chú</TableHead>
                  <TableHead>Người tạo</TableHead>
                  <TableHead>Thời gian tạo</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventoryList.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.importCode}</TableCell>
                    <TableCell>{item.batchCode}</TableCell>
                    <TableCell>{item.supplier}</TableCell>
                    <TableCell>{item.totalQuantity}</TableCell>
                    <TableCell>{item.totalImportPrice.toLocaleString()}đ</TableCell>
                    <TableCell>{item.note}</TableCell>
                    <TableCell>{item.createdBy?.name}</TableCell>
                    <TableCell>{new Date(item.createdAt).toLocaleString()}</TableCell>
                                          <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <EllipsisVertical className="cursor-pointer" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleView(item)}>
                              Xem
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
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
