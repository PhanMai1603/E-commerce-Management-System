"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";

export default function DiscountForm() {
  const [form, setForm] = useState({
    name: "",
    code: "",
    description: "",
    type: "PERCENT",
    value: "",
    minValue: "",
    maxValue: "",
    targetType: "Order",
    maxUses: "",
    maxUsesPerUser: "",
    startDate: "",
    endDate: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold">Tạo Mã Giảm Giá</h2>
      
      {/* Thông tin chung */}
      <Card>
        <CardHeader>
          <CardTitle>Thông Tin Chung</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Tên mã giảm giá</Label>
            <Input name="name" value={form.name} onChange={handleChange} />
          </div>
          <div>
            <Label>Mã code</Label>
            <Input name="code" value={form.code} onChange={handleChange} />
          </div>
          <div>
            <Label>Mô tả</Label>
            <Textarea name="description" value={form.description} onChange={handleChange} />
          </div>
        </CardContent>
      </Card>

      {/* Cấu hình giảm giá */}
      <Card>
        <CardHeader>
          <CardTitle>Cấu Hình Giảm Giá</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Loại giảm giá</Label>
            <Select name="type" value={form.type} onValueChange={(value) => setForm({ ...form, type: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại giảm giá" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PERCENT">Phần trăm</SelectItem>
                <SelectItem value="AMOUNT">Giá trị cố định</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Giá trị giảm</Label>
            <Input name="value" type="number" value={form.value} onChange={handleChange} />
          </div>
          <div>
            <Label>Giá trị tối thiểu</Label>
            <Input name="minValue" type="number" value={form.minValue} onChange={handleChange} />
          </div>
          <div>
            <Label>Giá trị tối đa</Label>
            <Input name="maxValue" type="number" value={form.maxValue} onChange={handleChange} />
          </div>
        </CardContent>
      </Card>
      
      {/* Điều kiện áp dụng */}
      <Card>
        <CardHeader>
          <CardTitle>Điều Kiện Áp Dụng</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Loại áp dụng</Label>
            <Select name="targetType" value={form.targetType} onValueChange={(value) => setForm({ ...form, targetType: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại áp dụng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Order">Đơn hàng</SelectItem>
                <SelectItem value="Product">Sản phẩm</SelectItem>
                <SelectItem value="Category">Danh mục</SelectItem>
                <SelectItem value="Delivery">Giao hàng</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Số lần sử dụng tối đa</Label>
            <Input name="maxUses" type="number" value={form.maxUses} onChange={handleChange} />
          </div>
          <div>
            <Label>Số lần sử dụng tối đa mỗi người</Label>
            <Input name="maxUsesPerUser" type="number" value={form.maxUsesPerUser} onChange={handleChange} />
          </div>
        </CardContent>
      </Card>

      {/* Thời gian hiệu lực */}
      <Card>
        <CardHeader>
          <CardTitle>Thời Gian Hiệu Lực</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Ngày bắt đầu</Label>
            <Input name="startDate" type="date" value={form.startDate} onChange={handleChange} />
          </div>
          <div>
            <Label>Ngày kết thúc</Label>
            <Input name="endDate" type="date" value={form.endDate} onChange={handleChange} />
          </div>
        </CardContent>
      </Card>

      {/* Nút tạo mã giảm giá */}
      <Button className="w-full mt-4">Tạo mã giảm giá</Button>
    </div>
  );
}