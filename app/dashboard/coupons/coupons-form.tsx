/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { EllipsisVertical, Plus } from "lucide-react";
import { getAllCoupons } from "@/app/api/coupon";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { toast } from "react-toastify";
import { getAllCouponsResponse, GetCouponResponse } from "@/interface/coupon";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// ✅ Mapping để hiển thị tiếng Việt
const COUPON_TYPE_LABEL: Record<string, string> = {
  PERCENT: "Phần trăm",
  FIXED: "Giảm tiền",
};

const TARGET_TYPE_LABEL: Record<string, string> = {
  Order: "Đơn hàng",
  Delivery: "Vận chuyển",
  Category: "Danh mục",
  Product: "Sản phẩm",
};

export default function CouponTable() {
  const [couponsData, setCouponsData] = useState<getAllCouponsResponse | null>(null);
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(5);

  const router = useRouter();

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await getAllCoupons(userId, accessToken, page, size);
        setCouponsData(response);
      } catch (error) {
        toast.error("Không lấy được phiếu giảm giá");
      }
    };

    fetchCoupons();
  }, [userId, accessToken, page, size]);

  const handleView = (couponId: string) => {
    router.push(`/dashboard/coupons/${couponId}`);
  };


  const totalPages = couponsData?.totalPages || 1;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (

    <div>
      <h1 className="text-2xl font-bold mb-6">Danh sách mã giảm giá</h1>

      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4">
          {/* Left side: Show dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground whitespace-nowrap">Hiển thị:</label>
            <Select
              value={size.toString()}
              onValueChange={(val) => {
                setSize(Number(val));
                setPage(1); // Reset về page 1 khi đổi size
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

          {/* Right side: Add button */}
          <Button
            onClick={() => router.push("/dashboard/coupons/create")}
            className="flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Thêm mã giảm giá
          </Button>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên</TableHead>
                <TableHead>Mã</TableHead>
                <TableHead>Giảm giá</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Áp dụng cho</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {couponsData?.items?.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell className="font-medium">{coupon.name}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-full text-sm font-semibold bg-gray-200 text-gray-700">
                      {coupon.code}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 font-semibold">
                      {coupon.value} {coupon.type === "PERCENT" ? "%" : "VND"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span><strong>Từ:</strong> {new Date(coupon.startDate).toLocaleDateString()}</span>
                      <span>
                        <strong>Đến:</strong> {new Date(coupon.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{COUPON_TYPE_LABEL[coupon.type] ?? coupon.type}</TableCell>
                  <TableCell>{TARGET_TYPE_LABEL[coupon.targetType] ?? coupon.targetType}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-sm font-semibold ${coupon.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                        }`}
                    >
                      {coupon.isActive ? "Đang hoạt động" : "Hết hạn"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <EllipsisVertical className="cursor-pointer" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(coupon.id)}>
                          Xem chi tiết
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

          </Table>
        </CardContent>

        <CardFooter className="border-t pt-3 flex justify-between">
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
      </Card>
    </div>
  );
}
