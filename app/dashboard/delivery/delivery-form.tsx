"use client";
import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { EllipsisVertical, Plus } from "lucide-react";
import { getAllDelivery } from "@/app/api/delivery";
import { DeliveriesData } from "@/interface/delivery";
import get from "lodash/get";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export function TableDemo() {
  const [deliveries, setDeliveries] = useState<DeliveriesData[]>([]);
  const router = useRouter();

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

  const fetchDeliveries = useCallback(async () => {
    try {
      if (!userId || !accessToken) {
        toast.error("Yêu cầu xác thực người dùng.");
        return;
      }
      const response = await getAllDelivery(userId, accessToken);
      setDeliveries(response.deliveries);
    } catch (error) {
      const errorMessage = get(error, "message", "Có lỗi xảy ra.");
      toast.error(errorMessage);
    }
  }, [userId, accessToken]);

  useEffect(() => {
    fetchDeliveries();
  }, [fetchDeliveries]);

  const handleView = (delivery: DeliveriesData) => {
    router.push(`/dashboard/delivery/${delivery.id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/dashboard/delivery/${id}/edit`);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Danh sách phương thức giao hàng</h1>
      <Card>
        <CardHeader className="flex flex-row items-center justify-end pb-0">
          <Button
            onClick={() => router.push("/dashboard/delivery/create")}
            className="flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Thêm phương thức
          </Button>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {deliveries.length > 0 ? (
                deliveries.map((delivery) => (
                  <TableRow key={delivery.id}>
                    <TableCell className="font-medium">{delivery.name}</TableCell>
                    <TableCell className="font-medium">{delivery.description}</TableCell>
                    <TableCell className="font-medium">
                      <span
                        className={`inline-block py-1 px-3 rounded-full text-sm font-semibold ${delivery.isActive
                          ? "bg-[#22C55E29] text-[#118D57]"
                          : "bg-[#FF563029] text-[#B71D18]"
                          }`}
                      >
                        {delivery.isActive ? "Đang hoạt động" : "Ngừng hoạt động"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <EllipsisVertical className="cursor-pointer" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleView(delivery)}>
                            Xem chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(delivery.id)}>
                            Chỉnh sửa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Không có phương thức giao hàng nào.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>

        <CardFooter className="border-t pt-3 flex justify-end">
          <span className="text-sm text-gray-500">Tổng số: {deliveries.length}</span>
        </CardFooter>
      </Card>
    </div>
  );
}
