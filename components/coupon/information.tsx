"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { CouponData } from "@/interface/coupon";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { CalendarIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "../ui/popover";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface InformationCouponFormProps {
    userId: string;
    accessToken: string;
    coupon: CouponData;
    setCoupon: React.Dispatch<React.SetStateAction<CouponData>>;
}

const InformationCouponForm: React.FC<InformationCouponFormProps> = ({
    coupon,
    setCoupon,
}) => {
    const [openStart, setOpenStart] = useState(false);
    const [openEnd, setOpenEnd] = useState(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        let newValue: string | number | null = value;
        if (["value", "minValue", "maxValue", "maxUses", "maxUsesPerUser"].includes(name)) {
            newValue = value === "" ? null : Math.max(0, Number(value));
        }

        setCoupon((prev) => ({
            ...prev,
            [name]: newValue,
        }));
    };

    const handleDateChange = (date: Date | undefined, field: "startDate" | "endDate") => {
        setCoupon((prev) => ({
            ...prev,
            [field]: date ? date.toISOString() : "",
        }));
    };

    const handleSelect = (value: "PERCENT" | "AMOUNT") => {
        setCoupon((prev) => ({
            ...prev,
            type: value,
        }));
    };

    return (
        <Card className="col-span-1">
            <CardHeader>
                <CardTitle className="text-base">Thông tin mã giảm giá</CardTitle>
            </CardHeader>

            <CardContent className="grid grid-cols-2 gap-4">
                {/* Tên mã giảm giá */}
                <div className="space-y-2 col-span-1">
                    <Label>Tên mã</Label>
                    <Input
                        name="name"
                        value={coupon.name}
                        type="text"
                        placeholder="Nhập tên mã giảm giá"
                        onChange={handleChange}
                    />
                </div>

                {/* Mã code */}
                <div className="space-y-2">
                    <Label>Mã code</Label>
                    <Input
                        name="code"
                        value={coupon.code}
                        placeholder="Nhập mã"
                        onChange={handleChange}
                    />
                </div>

                {/* Ngày bắt đầu */}
                <div className="space-y-2">
                    <Label>Ngày bắt đầu</Label>
                    <Popover open={openStart} onOpenChange={setOpenStart}>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left">
                                {coupon.startDate ? (
                                    new Date(coupon.startDate).toLocaleDateString("vi-VN")
                                ) : (
                                    <span>Chọn ngày</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={coupon.startDate ? new Date(coupon.startDate) : undefined}
                                onSelect={(date) => {
                                    handleDateChange(date, "startDate");
                                    setOpenStart(false);
                                }}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                {/* Ngày kết thúc */}
                <div className="space-y-2">
                    <Label>Ngày kết thúc</Label>
                    <Popover open={openEnd} onOpenChange={setOpenEnd}>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left">
                                {coupon.endDate ? (
                                    new Date(coupon.endDate).toLocaleDateString("vi-VN")
                                ) : (
                                    <span>Chọn ngày</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={coupon.endDate ? new Date(coupon.endDate) : undefined}
                                onSelect={(date) => {
                                    handleDateChange(date, "endDate");
                                    setOpenEnd(false);
                                }}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                {/* Loại giảm giá */}
                <div className="space-y-2 col-span-1">
                    <Label>Loại giảm giá</Label>
                    <Select onValueChange={handleSelect} value={coupon.type}>
                        <SelectTrigger className="flex h-10 hover:bg-gray-600/10">
                            <SelectValue placeholder="Chọn loại" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="PERCENT">Theo phần trăm</SelectItem>
                                <SelectItem value="AMOUNT">Theo số tiền</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* Giá trị giảm */}
                <div className="space-y-2 col-span-1">
                    <Label>Giá trị</Label>
                    <Input
                        name="value"
                        type="number"
                        value={coupon.value}
                        onChange={handleChange}
                        placeholder="Nhập giá trị giảm"
                    />
                </div>
            </CardContent>
        </Card>
    );
};

export default InformationCouponForm;
