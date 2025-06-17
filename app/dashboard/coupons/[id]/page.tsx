/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getDetailCoupons } from "@/app/api/coupon";
import { TargetItem, GetCouponResponse } from "@/interface/coupon";
import { toast } from "react-toastify";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function CouponDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState<GetCouponResponse | null>(null);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(5);

  const userId =
    typeof window !== "undefined"
      ? localStorage.getItem("userId") || ""
      : "";
  const accessToken =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken") || ""
      : "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getDetailCoupons(
          id as string,
          userId,
          accessToken,
          page,
          size
        );
        setData(res);
      } catch (err) {
        toast.error("Không lấy được chi tiết mã giảm giá.");
      }
    };

    fetchData();
  }, [id, userId, accessToken, page, size]);

  if (!data) return <div className="text-center mt-10">Đang tải...</div>;

  const { coupon, targets } = data;

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Thông tin mã giảm giá */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Thông tin mã giảm giá
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-gray-700">
          <p>
            <strong>Tên:</strong> {coupon.name}
          </p>
          <p>
            <strong>Mã:</strong>{" "}
            <span className="font-mono bg-gray-100 px-2 py-1 rounded text-black">
              {coupon.code}
            </span>
          </p>
          <p>
            <strong>Mô tả:</strong> {coupon.description || "Không có"}
          </p>
          <p>
            <strong>Giá trị:</strong> {coupon.value}{" "}
            {coupon.type === "PERCENT" ? "%" : "VND"}
          </p>
          <p>
            <strong>Thời gian:</strong>{" "}
            {new Date(coupon.startDate).toLocaleDateString()} -{" "}
            {new Date(coupon.endDate).toLocaleDateString()}
          </p>
          <p>
            <strong>Trạng thái:</strong>{" "}
            <span
              className={`font-semibold px-2 py-1 rounded-full ${
                coupon.isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {coupon.isActive ? "Đang hoạt động" : "Hết hạn"}
            </span>
          </p>
        </CardContent>
      </Card>

      {/* Danh sách đối tượng áp dụng */}
      <Card>
        <CardHeader>
          <CardTitle>Đối tượng áp dụng</CardTitle>
        </CardHeader>
        <CardContent>
          {targets.items.length === 0 ? (
            <p className="text-gray-500">Không có dữ liệu áp dụng.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hình ảnh</TableHead>
                    <TableHead>Mã</TableHead>
                    <TableHead>Tên</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {targets.items.map((item: TargetItem) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        {item.mainImage ? (
                          <img
                            src={item.mainImage}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded shadow"
                          />
                        ) : (
                          <span className="italic text-gray-400">
                            Không có ảnh
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="font-mono">{item.code}</TableCell>
                      <TableCell>{item.name}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {targets.totalPages > 1 && (
                <Pagination className="mt-4">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (page > 1) setPage(page - 1);
                        }}
                      />
                    </PaginationItem>

                    {Array.from({ length: targets.totalPages }, (_, i) => (
                      <PaginationItem key={i + 1}>
                        <PaginationLink
                          href="#"
                          isActive={page === i + 1}
                          onClick={(e) => {
                            e.preventDefault();
                            setPage(i + 1);
                          }}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (page < targets.totalPages) setPage(page + 1);
                        }}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
