/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DeliveryDataResponse } from "@/interface/delivery";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getDeliveryDetail, updateActive, updateDeactivate, updateDelivery } from "@/app/api/delivery";
import { toast } from "react-toastify";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

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

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";
  const router = useRouter();

  useEffect(() => {
    const fetchDeliveryDetail = async () => {
      try {
        if (!id || !userId || !accessToken) {
          toast.error("Cần xác thực người dùng.");
          return;
        }

        const data = await getDeliveryDetail(Array.isArray(id) ? id[0] : id, userId, accessToken);

        const validatedPricing = data.pricing.map(tier => ({
          ...tier,
          threshold: tier.threshold < 0 ? 0 : tier.threshold,
          feePerKm: tier.feePerKm < 0 ? 0 : tier.feePerKm,
        }));

        const validatedDelivery = {
          ...data,
          maxDistance: data.maxDistance < 0 ? 0 : data.maxDistance,
          baseFee: data.baseFee < 0 ? 0 : data.baseFee,
          pricing: validatedPricing,
        };

        setDelivery(validatedDelivery);
      } catch (error) {
        toast.error("Không thể tải thông tin phương thức giao hàng.");
      }
    };

    fetchDeliveryDetail();
  }, [id, userId, accessToken]);

  const handlePricingChange = (index: number, field: string, value: string) => {
    const updatedPricing = [...delivery.pricing];
    const newValue = field === "threshold" ? parseInt(value) : parseFloat(value);
    const validatedValue = newValue < 0 ? 0 : newValue;

    updatedPricing[index] = {
      ...updatedPricing[index],
      [field]: validatedValue,
    };

    setDelivery({ ...delivery, pricing: updatedPricing });
  };

  const handleMaxDistanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setDelivery({ ...delivery, maxDistance: value < 0 ? 0 : value });
  };

  const handleBaseFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setDelivery({ ...delivery, baseFee: value < 0 ? 0 : value });
  };

  const checkUserAuth = () => {
    if (!id || !userId || !accessToken) {
      toast.error("Cần xác thực người dùng.");
      return false;
    }
    return true;
  };

  const handleStatusChange = async (isActive: boolean) => {
    if (!checkUserAuth()) return;

    try {
      if (isActive) {
        await updateActive(Array.isArray(id) ? id[0] : id || "", userId, accessToken);
        toast.success("Đã kích hoạt phương thức giao hàng.");
      } else {
        await updateDeactivate(Array.isArray(id) ? id[0] : id || "", userId, accessToken);
        toast.success("Đã vô hiệu hóa phương thức giao hàng.");
      }

      const updatedDelivery = await getDeliveryDetail(Array.isArray(id) ? id[0] : id || "", userId, accessToken);
      setDelivery(updatedDelivery);

    } catch (error) {
      toast.error("Không thể cập nhật trạng thái.");
    }
  };

  const handleSave = async () => {
    if (!checkUserAuth()) return;
    try {
      const updatedDelivery = await updateDelivery(Array.isArray(id) ? id[0] : id || "", delivery, userId, accessToken);
      setDelivery(updatedDelivery);
      toast.success("Cập nhật phương thức giao hàng thành công.");
      router.push("/dashboard/delivery");
    } catch (error) {
      toast.error("Cập nhật thất bại.");
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Chỉnh sửa phương thức giao hàng</CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-2 gap-x-4 gap-y-6">
          <div className="grid col-span-2 gap-x-4 gap-y-6">
            <div className="col-span-2">
              <Label>Tên phương thức giao hàng</Label>
              <Input
                name="name"
                value={delivery.name}
                type="text"
                placeholder="Nhập tên phương thức"
                onChange={(e) => setDelivery({ ...delivery, name: e.target.value })}
              />
            </div>

            <div className="col-span-1">
              <Label>Khoảng cách tối đa (km)</Label>
              <Input
                name="maxDistance"
                value={delivery.maxDistance}
                type="number"
                placeholder="Nhập khoảng cách tối đa"
                onChange={handleMaxDistanceChange}
              />
            </div>
            <div className="col-span-1">
              <Label>Phí cơ bản (VNĐ)</Label>
              <Input
                name="baseFee"
                value={delivery.baseFee}
                type="number"
                placeholder="Nhập phí cơ bản"
                onChange={handleBaseFeeChange}
              />
            </div>

            {delivery.pricing && delivery.pricing.length > 0 && (
              <div className="col-span-2 grid grid-cols-1 gap-4">
                <Label>Phí theo khoảng cách</Label>
                {delivery.pricing.map((tier, index) => (
                  <div key={index} className="grid grid-cols-3 gap-4 items-end border p-2 rounded-md">
                    <div>
                      <Label>Ngưỡng (Km)</Label>
                      <Input
                        type="number"
                        value={tier.threshold}
                        placeholder="Nhập ngưỡng"
                        onChange={(e) => handlePricingChange(index, "threshold", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Phí mỗi Km (VNĐ)</Label>
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
              <Input value={delivery.isActive ? "Đang hoạt động" : "Ngừng hoạt động"} readOnly />
            </div>

            <div className="col-span-2 flex gap-4 items-center">
              <div className="flex items-center space-x-4">
                <Label htmlFor="statusSwitch">Kích hoạt</Label>
                <Switch
                  id="statusSwitch"
                  checked={delivery.isActive}
                  onCheckedChange={(checked) => handleStatusChange(checked)}
                />
              </div>
            </div>

          </div>
        </CardContent>
      </Card>

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
            onChange={(e) => setDelivery({ ...delivery, description: e.target.value })}
          />
        </CardContent>
      </Card>

      <div className="col-span-2 flex justify-end gap-4 mt-4">
        <Button
          onClick={() => router.push("/dashboard/delivery")}
          className='bg-gray-200 text-gray-900 hover:bg-gray-300'
        >
          HỦY
        </Button>

        <Button
          className="col-span-2 flex place-self-end"
          onClick={handleSave}
        >
          LƯU
        </Button>
      </div>
    </div>
  );
}
