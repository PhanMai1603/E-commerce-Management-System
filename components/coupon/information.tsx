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

    // ✅ Cập nhật type khi chọn từ dropdown
    const handleSelect = (value: "PERCENT" | "AMOUNT") => {
        setCoupon((prev) => ({
            ...prev,
            type: value, // ✅ Đúng kiểu enum, không cần ép kiểu
        }));
    };
    
    return (
        <Card className="col-span-1">
            <CardHeader>
                <CardTitle className="text-base">Add Coupon Information</CardTitle>
            </CardHeader>

            <CardContent className="grid grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-2 col-span-1">
                    <Label>Coupon Name</Label>
                    <Input
                        name="name"
                        value={coupon.name}
                        type="text"
                        placeholder="Enter coupon name"
                        onChange={handleChange}
                    />
                </div>

                {/* Code */}
                <div className="space-y-2">
                    <Label>Code</Label>
                    <Input 
                        name="code" 
                        value={coupon.code} 
                        onChange={handleChange} 
                    />
                </div>

                {/* Start Date */}
                <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Popover open={openStart} onOpenChange={setOpenStart}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-full justify-start text-left"
                            >
                                {coupon.startDate ? (
                                    new Date(coupon.startDate).toLocaleDateString()
                                ) : (
                                    <span>Pick a date</span>
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

                {/* End Date */}
                <div className="space-y-2">
                    <Label>End Date</Label>
                    <Popover open={openEnd} onOpenChange={setOpenEnd}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-full justify-start text-left"
                            >
                                {coupon.endDate ? (
                                    new Date(coupon.endDate).toLocaleDateString()
                                ) : (
                                    <span>Pick a date</span>
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

                {/* Types */}
                <div className="space-y-2 col-span-1">
                    <Label>Types</Label>
                    <Select onValueChange={handleSelect} value={coupon.type}>
                        <SelectTrigger className="flex h-10 hover:bg-gray-600/10">
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="PERCENT">Percent</SelectItem>
                                <SelectItem value="AMOUNT">Amount</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* Value */}
                <div className="space-y-2 col-span-1">
                    <Label>Value</Label>
                    <Input
                        name="value"
                        type="number"
                        value={coupon.value}
                        onChange={handleChange}
                    />
                </div>
            </CardContent>
        </Card>
    );
};

export default InformationCouponForm;
