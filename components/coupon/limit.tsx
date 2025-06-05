/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { CouponData } from "@/interface/coupon";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";

import { getAllCategories } from "@/app/api/category";
import { getAllProduct } from "@/app/api/product";
import CategorySelection from "../coupon/category";
import { ProductData } from "@/interface/product";

interface LimitCouponFormProps {
  userId: string;
  accessToken: string;
  coupon: CouponData;
  product: ProductData;
  setProduct: React.Dispatch<React.SetStateAction<ProductData>>;
  setCoupon: React.Dispatch<React.SetStateAction<CouponData>>;
}

const LimitCouponForm: React.FC<LimitCouponFormProps> = ({
  coupon,
  setCoupon,
  userId,
  accessToken,
  setProduct,
}) => {
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [products, setProducts] = useState<{ id: string; name: string }[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const fetchData = async () => {
      if (!coupon.targetType) return;

      // Reset
      setCategories([]);
      setProducts([]);

      try {
        if (coupon.targetType === "Category") {
          const data = await getAllCategories();
          setCategories(data);
        } else if (coupon.targetType === "Product") {
          if (!userId || !accessToken) return;

          const response = await getAllProduct(userId, accessToken, 1, 50);
          setProducts(response.items);
          setTotalPages(response.totalPages);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [coupon.targetType, userId, accessToken]); // 👈 Thêm đầy đủ dependency


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let newValue: string | number | null = value;

    if (
      ["value", "minValue", "maxValue", "maxUses", "maxUsesPerUser"].includes(name)
    ) {
      newValue = value === "" ? null : Math.max(0, Number(value));
    }

    setCoupon((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSelectTargetType = (value: string) => {
    setCoupon((prev) => ({
      ...prev,
      targetType: value as CouponData["targetType"],
      targetIds: [],
    }));
  };

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="text-base">Add Coupon Limit</CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-2 gap-4">
        <div className="space-y-2 col-span-1">
          <Label>Min Value</Label>
          <Input
            type="number"
            name="minValue"
            value={coupon.minValue ?? ""}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2 col-span-1">
          <Label>Max Value</Label>
          <Input
            type="number"
            name="maxValue"
            value={coupon.maxValue ?? ""}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label>Max Uses</Label>
          <Input
            type="number"
            name="maxUses"
            value={coupon.maxUses ?? ""}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label>Max Uses Per User</Label>
          <Input
            type="number"
            name="maxUsesPerUser"
            value={coupon.maxUsesPerUser ?? ""}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2 col-span-2">
          <Label>Applies to</Label>
          <Select value={coupon.targetType} onValueChange={handleSelectTargetType}>
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

        {coupon.targetType === "Category" && (
          <div className="space-y-2 col-span-2">
            <Label>Select Category</Label>
            <CategorySelection
              setProduct={setProduct}
              setCoupon={setCoupon} // 👈 thêm dòng này
            />
          </div>
        )}

        {coupon.targetType === "Product" && (
          <div className="space-y-2 col-span-2">
            <Label>Select Products</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left"
                >
                  {coupon.targetIds.length > 0
                    ? `${coupon.targetIds.length} product(s) selected`
                    : "Select products"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full max-h-60 overflow-y-auto">
                <div className="space-y-2">
                  {products.map((product) => (
                    <div key={product.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={product.id}
                        checked={coupon.targetIds.includes(product.id)}
                        onCheckedChange={(checked) => {
                          setCoupon((prev) => ({
                            ...prev,
                            targetIds: checked
                              ? [...prev.targetIds, product.id]
                              : prev.targetIds.filter((id) => id !== product.id),
                          }));
                        }}
                      />
                      <label htmlFor={product.id} className="text-sm">
                        {product.name}
                      </label>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LimitCouponForm;
