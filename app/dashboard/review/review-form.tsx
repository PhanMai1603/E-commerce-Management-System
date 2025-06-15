"use client";

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, EllipsisVertical } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Review } from "@/interface/review";
import {
  getAllReview,
  getUnreplied,
  getReplied,
  hideReview,
} from "@/app/api/review";
import { toast } from "react-toastify";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function UnrepliedReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unreplied" | "replied">("all");

  const router = useRouter();

  const formatDateTime = (iso: string) => {
    const d = new Date(iso);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    const seconds = String(d.getSeconds()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken") || ""
      : "";

  const fetchReviews = async () => {
    setLoading(true);
    try {
      let data;
      if (filter === "unreplied") {
        data = await getUnreplied(userId, accessToken);
      } else if (filter === "replied") {
        data = await getReplied(userId, accessToken);
      } else {
        data = await getAllReview(userId, accessToken);
      }
      setReviews(data.items || []);
    } catch (err) {
      toast.error("Lỗi khi tải danh sách đánh giá");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId && accessToken) {
      fetchReviews();
    }
  }, [filter]);

  const handleView = (id: string) => {
    router.push(`/dashboard/review/${id}`);
  };

  const handleHide = async (id: string) => {
    try {
      await hideReview(id, userId, accessToken);
      toast.success("Đã ẩn đánh giá thành công");
      fetchReviews(); // Làm mới lại danh sách
    } catch (error) {
      // Lỗi đã được xử lý ở API
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold">Danh sách đánh giá</h1>
      <Card>
        <CardHeader>
          <div className="flex items-end justify-end">
            <Select
              value={filter}
              onValueChange={(value) =>
                setFilter(value as "all" | "unreplied" | "replied")
              }
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Lọc đánh giá" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="unreplied">Chưa phản hồi</SelectItem>
                <SelectItem value="replied">Đã phản hồi</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-md" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hình ảnh</TableHead>
                  <TableHead>Nội dung</TableHead>
                  <TableHead>Số sao</TableHead>
                  <TableHead>Thời gian</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell>
                      {review.images.length > 0 && (
                        <img
                          key="only-image"
                          src={review.images[0]}
                          alt="Hình đánh giá"
                          className="w-12 h-12 object-cover rounded-lg border shadow-sm"
                        />
                      )}
                    </TableCell>
                    <TableCell className="max-w-sm truncate text-sm">
                      {review.content}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-yellow-500">
                        {[...Array(Math.floor(Number(review.star) || 0))].map((_, i) => (
                          <Star key={i} size={14} fill="currentColor" />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDateTime(review.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <EllipsisVertical className="cursor-pointer" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onSelect={() => handleView(review.id)}>
                            Xem chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => handleHide(review.id)}>
                            Ẩn đánh giá
                          </DropdownMenuItem>
                          {/* <DropdownMenuItem
                            onSelect={() => router.push(`/dashboard/review/${review.id}#reply`)}
                          >
                            Phản hồi
                          </DropdownMenuItem> */}
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
