/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { getTrend } from "@/app/api/statistics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Legend,
    CartesianGrid,
} from "recharts";

import { toast } from "react-toastify";
import { format } from "date-fns";
import { vi } from "date-fns/locale/vi";


interface DoanhThu {
    _id: string;
    totalRevenue: number;
    totalOrders: number;
}

export default function TrendChart({
    userId,
    accessToken,
}: {
    userId: string;
    accessToken: string;
}) {
    const [data, setData] = useState<DoanhThu[]>([]);
    const [startDate, setStartDate] = useState<Date>(
        new Date(new Date().setDate(new Date().getDate() - 7))
    );
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [groupBy, setGroupBy] = useState<"day" | "week" | "month">("day");
    const [loading, setLoading] = useState<boolean>(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const result = await getTrend(
                userId,
                accessToken,
                format(startDate, "yyyy-MM-dd"),
                format(endDate, "yyyy-MM-dd"),
                groupBy
            );
            setData(result);
        } catch (err) {
            toast.error("Lỗi khi tải dữ liệu");
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
                <CardTitle>Thống kê doanh thu & đơn hàng</CardTitle>
            </CardHeader>

            <div className="flex flex-wrap gap-4 items-end">
                <div className="flex flex-col">
                    <label className="text-sm mb-1">Từ ngày</label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-[150px] justify-start text-left">
                                {format(startDate, "dd/MM/yyyy", { locale: vi })}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={startDate}
                                onSelect={(date) => date && setStartDate(date)}
                            />
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
                            <Calendar
                                mode="single"
                                selected={endDate}
                                onSelect={(date) => date && setEndDate(date)}
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="flex flex-col">
                    <label className="text-sm mb-1">Nhóm theo</label>
                    <Select value={groupBy} onValueChange={(value) => setGroupBy(value as any)}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Group by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="day">Theo ngày</SelectItem>
                            <SelectItem value="week">Theo tuần</SelectItem>
                            <SelectItem value="month">Theo tháng</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Button onClick={fetchData} disabled={loading}>
                    {loading ? "Đang tải..." : "Lọc dữ liệu"}
                </Button>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="_id" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="totalRevenue" name="Doanh thu" fill="#8884d8" />
                    <Bar yAxisId="right" dataKey="totalOrders" name="Đơn hàng" fill="#82ca9d" />
                </BarChart>

            </ResponsiveContainer>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>{groupBy === "day" ? "Ngày" : groupBy === "week" ? "Tuần" : "Tháng"}</TableHead>
                        <TableHead>Doanh thu</TableHead>
                        <TableHead>Số đơn</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((item) => (
                        <TableRow key={item._id}>
                            <TableCell>{item._id}</TableCell>
                            <TableCell>{item.totalRevenue.toLocaleString()} đ</TableCell>
                            <TableCell>{item.totalOrders}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
}
