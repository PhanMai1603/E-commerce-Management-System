/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DeliveryDataResponse } from "@/interface/delivery";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getDeliveryDetail } from "@/app/api/delivery";
import { toast } from "react-toastify";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function Page() {
  const { id } = useParams();
  const [delivery, setDelivery] = useState<DeliveryDataResponse>({
    id: "",
    name: "",
    description: "",
    maxDistance: 0,
    baseFee: 0,
    pricing: [],
    isActive: false,
  });
  const router = useRouter();
  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

  useEffect(() => {
    const fetchDeliveryDetail = async () => {
      try {
        if (!id || !userId || !accessToken) {
          toast.error("Cần đăng nhập để xem thông tin giao hàng.");
          return;
        }
        const data = await getDeliveryDetail(Array.isArray(id) ? id[0] : id, userId, accessToken);
        setDelivery(data);
      } catch (error) {
        toast.error("Không thể tải thông tin giao hàng.");
      }
    };

    fetchDeliveryDetail();
  }, [id, userId, accessToken]);

  const handlePricingChange = (index: number, field: string, value: string) => {
    const updatedPricing = [...delivery.pricing];
    updatedPricing[index] = {
      ...updatedPricing[index],
      [field]: field === "threshold" ? parseInt(value) : parseFloat(value),
    };
    setDelivery({ ...delivery, pricing: updatedPricing });
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        {/* Cột trái */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Thông tin giao hàng</CardTitle>
          </CardHeader>

          <CardContent className="grid grid-cols-2 gap-x-4 gap-y-6">
            <div className="grid col-span-2 gap-x-4 gap-y-6">
              <div className="col-span-2">
                <Label>Tên phương thức giao hàng</Label>
                <Input
                  name="name"
                  value={delivery.name}
                  type="text"
                  placeholder="Nhập tên phương thức giao hàng"
                  readOnly
                />
              </div>

              <div className="col-span-1">
                <Label>Khoảng cách tối đa (km)</Label>
                <Input
                  name="maxDistance"
                  value={delivery.maxDistance}
                  type="number"
                  placeholder="Nhập khoảng cách tối đa"
                  readOnly
                />
              </div>
              <div className="col-span-1">
                <Label>Phí cơ bản (VNĐ)</Label>
                <Input
                  name="baseFee"
                  value={delivery.baseFee}
                  type="number"
                  placeholder="Nhập phí cơ bản"
                  readOnly
                />
              </div>

              {/* Bảng giá theo km */}
              {delivery.pricing && delivery.pricing.length > 0 && (
                <div className="col-span-2 grid grid-cols-1 gap-4">
                  <Label>Giá theo khoảng cách</Label>
                  {delivery.pricing.map((tier, index) => (
                    <div key={index} className="grid grid-cols-2 gap-4 items-end border p-2 rounded-md">
                      <div>
                        <Label>Ngưỡng (Km)</Label>
                        <Input
                          type="number"
                          value={tier.threshold}
                          placeholder="Nhập ngưỡng km"
                          onChange={(e) => handlePricingChange(index, "threshold", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Phí mỗi km (VNĐ)</Label>
                        <Input
                          type="number"
                          value={tier.feePerKm}
                          placeholder="Nhập phí mỗi km"
                          onChange={(e) => handlePricingChange(index, "feePerKm", e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="col-span-2">
                <Label>Trạng thái</Label>
                <Input
                  value={delivery.isActive ? "Đang hoạt động" : "Ngừng hoạt động"}
                  readOnly
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cột phải: mô tả */}
        <Card className="col-span-1 flex flex-col h-full">
          <CardHeader>
            <CardTitle className="text-base">Mô tả phương thức giao hàng</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <Textarea
              name="description"
              value={delivery.description}
              placeholder="Nhập mô tả..."
              className="flex-1 h-full resize-none"
              readOnly
            />
          </CardContent>
        </Card>
      </div>

      {/* Nút quay lại */}
      <div className="flex justify-end mt-6">
        <Button onClick={() => router.push("/dashboard/delivery")}>Quay lại</Button>
      </div>
    </div>
  );
}
