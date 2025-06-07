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
      toast.error("Error loading review");
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
      toast.success("Review hidden successfully");
      fetchReviews(); // Refresh list
    } catch (error) {
      // Error đã xử lý trong API
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold">All Review</h1>
      <Card>
        <CardHeader>
          <div className="flex items-end justify-end">
            <Select
              value={filter}
              onValueChange={(value) =>
                setFilter(value as "all" | "unreplied" | "replied")
              }
            >
              <SelectTrigger className="w-[110px]">
                <SelectValue placeholder="Lọc đánh giá" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="unreplied">Unreplied</SelectItem>
                <SelectItem value="replied">Replied</SelectItem>
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
                  <TableHead>Image</TableHead>
                  <TableHead>Content</TableHead>
                  <TableHead>Star</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell>
                      {review.images.length > 0 && (
                        <div className="flex flex-wrap gap-3">

                          <img
                            key="only-image"
                            src={review.images[0]}
                            alt="Review Image"
                            className="w-12 h-12 object-cover rounded-lg border shadow-sm"
                          />
                        </div>
                      )}

                    </TableCell>
                    <TableCell className="max-w-sm truncate text-sm">
                      {review.content}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-yellow-500">
                        {[...Array(Math.max(0, Math.floor(Number(review.star) || 0)))].map((_, i) => (
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
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => handleHide(review.id)}>
                            Hide review
                          </DropdownMenuItem>
                          {/* <DropdownMenuItem
                            onSelect={() => router.push(`/dashboard/review/${review.id}#reply`)}
                          >
                            Reply
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
