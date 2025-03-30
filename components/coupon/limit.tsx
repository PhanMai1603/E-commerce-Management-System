"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { CouponData } from "@/interface/coupon";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface LimitCouponFormProps {
    userId: string;
    accessToken: string;
    coupon: CouponData;
    setCoupon: React.Dispatch<React.SetStateAction<CouponData>>;
}

const LimitCouponForm: React.FC<LimitCouponFormProps> = ({
    coupon,
    setCoupon,
}) => {
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

    // ✅ Thêm hàm xử lý chọn targetType
    const handleSelect = (value: string) => {
        setCoupon((prev) => ({
            ...prev,
            targetType: value as "Order" | "Delivery" | "Product" | "Category",
        }));
    };

    return (
        <Card className="col-span-1">
            <CardHeader>
                <CardTitle className="text-base">Add Coupon Limit</CardTitle>
            </CardHeader>

            <CardContent className="grid grid-cols-2 gap-4">
                {/* Min Value */}
                <div className="space-y-2 col-span-1">
                    <Label>Min Value</Label>
                    <Input
                        type="number"
                        name="minValue"
                        value={coupon.minValue ?? ""}
                        onChange={handleChange}
                    />
                </div>

                {/* Max Value */}
                <div className="space-y-2 col-span-1">
                    <Label>Max Value</Label>
                    <Input
                        type="number"
                        name="maxValue"
                        value={coupon.maxValue ?? ""}
                        onChange={handleChange}
                    />
                </div>

                {/* Max Uses */}
                <div className="space-y-2">
                    <Label>Max Uses</Label>
                    <Input
                        type="number"
                        name="maxUses"
                        value={coupon.maxUses ?? ""}
                        onChange={handleChange}
                    />
                </div>

                {/* Max Uses Per User */}
                <div className="space-y-2">
                    <Label>Max Uses Per User</Label>
                    <Input
                        type="number"
                        name="maxUsesPerUser"
                        value={coupon.maxUsesPerUser ?? ""}
                        onChange={handleChange}
                    />
                </div>

                {/* Applies to */}
                <div className="space-y-2 col-span-2">
                    <Label>Applies to</Label>
                    <Select onValueChange={handleSelect} value={coupon.targetType}>
                        <SelectTrigger className="flex h-10 hover:bg-gray-600/10">
                            <SelectValue placeholder="Select applicable target" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="Order">Order</SelectItem>
                                <SelectItem value="Delivery">Delivery</SelectItem>
                                <SelectItem value="Category">Category</SelectItem>
                                <SelectItem value="Product">Product</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>
    );
};

export default LimitCouponForm;
