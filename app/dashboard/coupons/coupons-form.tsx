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
import { getAllCouponsResponse } from "@/interface/coupon";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
        toast.error("Failed to fetch coupons");
      }
    };

    fetchCoupons();
  }, [userId, accessToken, page, size]);


  const totalPages = couponsData?.totalPages || 1;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };


  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <CardTitle>All Coupons</CardTitle>

        {/* Show + Add Coupon cùng hàng */}
        <div className="flex items-center justify-between gap-4 w-full md:w-auto">
          {/* Show dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground whitespace-nowrap">Show:</label>
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

          {/* Nút Add */}
          <Button onClick={() => router.push("/dashboard/coupons/create")} className="flex items-center gap-2 h-10">
            <Plus className="w-5 h-5" />
            Add Coupon
          </Button>
        </div>
      </CardHeader>


      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name Coupons</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Applies To</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {couponsData?.coupons?.map((coupon) => (
              <TableRow key={coupon.id}>
                <TableCell className="font-medium">{coupon.name}</TableCell>
                <TableCell>
                  <span className="px-2 py-1 rounded-full text-sm font-semibold bg-gray-200 text-gray-700">
                    {coupon.code}
                  </span>
                </TableCell>
                <TableCell>{new Date(coupon.startDate).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(coupon.endDate).toLocaleDateString()}</TableCell>
                <TableCell>{coupon.type}</TableCell>
                <TableCell>
                  <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 font-semibold">
                    -{coupon.value} {coupon.type === "PERCENT" ? "%" : "VND"}
                  </span>
                </TableCell>
                <TableCell>{coupon.targetType}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-sm font-semibold ${coupon.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                  >
                    {coupon.isActive ? "Active" : "Expired"}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <EllipsisVertical />
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

            {totalPages > 5 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

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
    </Card>
  );
}
