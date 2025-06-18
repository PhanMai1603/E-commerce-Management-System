/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useState } from "react";
import { getReview } from "@/app/api/statistics";
import { format } from "date-fns";
import { toast } from "react-toastify";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { vi } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ReviewStat {
  _id: string; // ngày
  count: number; // số lượng đánh giá
}

interface ReviewStatisticsMetadata {
  reviewStats: ReviewStat[];
  reportStats: number;
  worstRatedProducts: number;
}

export default function ReviewChart({
  userId,
  accessToken,
}: {
  userId: string;
  accessToken: string;
}) {
  const [startDate, setStartDate] = useState<Date>(
    new Date(new Date().setDate(new Date().getDate() - 7))
  );
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [data, setData] = useState<ReviewStat[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getReview(
        userId,
        accessToken,
        format(startDate, "yyyy-MM-dd"),
        format(endDate, "yyyy-MM-dd")
      );
      setData(result.reviewStats);
    } catch (error) {
      toast.error("Lỗi khi tải dữ liệu đánh giá");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Card className="p-4 space-y-4">
      <CardHeader>
        <CardTitle>Biểu đồ đánh giá theo thời gian</CardTitle>
      </CardHeader>

      <div className="flex gap-4 items-end">
        <div className="flex flex-col">
          <label className="text-sm mb-1">Từ ngày</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[150px] justify-start text-left">
                {format(startDate, "dd/MM/yyyy", { locale: vi })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={startDate} onSelect={(date) => date && setStartDate(date)} />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex flex-col">
          <label className="text-sm mb-1">Đến ngày</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[150px] justify-start text-left">
                {format(endDate, "dd/MM/yyyy", { locale: vi })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={endDate} onSelect={(date) => date && setEndDate(date)} />
            </PopoverContent>
          </Popover>
        </div>
        <Button onClick={fetchData} disabled={loading}>
          {loading ? "Đang tải..." : "Lọc dữ liệu"}
        </Button>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="_id" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#8884d8" name="Số đánh giá" />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
