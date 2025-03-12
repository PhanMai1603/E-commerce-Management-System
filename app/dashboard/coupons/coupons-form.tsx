"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { EllipsisVertical, Plus } from "lucide-react";
import { getAllCoupons } from "@/app/api/coupon";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { toast } from "react-toastify";
import { getAllCouponsResponse } from "@/interface/coupon";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function CouponTable() {
  const [couponsData, setCouponsData] = useState<getAllCouponsResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
 const router = useRouter();

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await getAllCoupons(userId, accessToken, currentPage, pageSize);
        setCouponsData(response);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error("Failed to fetch coupons");
      }
    };

    fetchCoupons();
  }, [userId, accessToken, currentPage, pageSize]);

  const totalPages = couponsData?.totalPages || 1;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <Card>
      {/* Header với nút Add Coupons */}
      <CardHeader className="flex justify-between items-center">
        <CardTitle>All Coupons</CardTitle>
        <Button onClick={() => router.push("/dashboard/coupons/create")} className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Coupon
          </Button>
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
                <TableCell className="font-medium">
                  <span className="px-2 py-1 rounded-full text-sm font-semibold bg-gray-200 text-gray-700">
                    {coupon.code}
                  </span>
                </TableCell>
                <TableCell className="font-medium">{new Date(coupon.startDate).toLocaleDateString()}</TableCell>
                <TableCell className="font-medium">{new Date(coupon.endDate).toLocaleDateString()}</TableCell>
                <TableCell className="font-medium">{coupon.type}</TableCell>

                <TableCell className="font-medium">
                  <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 font-semibold">
                    -{coupon.value} {coupon.type === "PERCENT" ? "%" : "VND"}
                  </span>
                </TableCell>
                <TableCell className="font-medium">{coupon.targetType}</TableCell>
                <TableCell className="font-medium">
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

      {/* Pagination */}
      <CardFooter className="border-t pt-3 flex justify-between">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => handlePageChange(currentPage - 1)}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {currentPage > 2 && (
              <>
                <PaginationItem>
                  <PaginationLink href="#" onClick={() => handlePageChange(1)}>
                    1
                  </PaginationLink>
                </PaginationItem>
                {currentPage > 3 && <PaginationItem>...</PaginationItem>}
              </>
            )}

            {currentPage > 1 && (
              <PaginationItem>
                <PaginationLink href="#" onClick={() => handlePageChange(currentPage - 1)}>
                  {currentPage - 1}
                </PaginationLink>
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationLink href="#" isActive>
                {currentPage}
              </PaginationLink>
            </PaginationItem>

            {currentPage < totalPages && (
              <PaginationItem>
                <PaginationLink href="#" onClick={() => handlePageChange(currentPage + 1)}>
                  {currentPage + 1}
                </PaginationLink>
              </PaginationItem>
            )}

            {currentPage < totalPages - 1 && (
              <>
                {currentPage < totalPages - 2 && <PaginationItem>...</PaginationItem>}
                <PaginationItem>
                  <PaginationLink href="#" onClick={() => handlePageChange(totalPages)}>
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              </>
            )}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() => handlePageChange(currentPage + 1)}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardFooter>
    </Card>
  );
}
