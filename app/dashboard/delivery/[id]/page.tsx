/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DeliveryDataResponse } from "@/interface/delivery"; // Import interface
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getDeliveryDetail } from "@/app/api/delivery";
import { toast } from "react-toastify";
import { Textarea } from "@/components/ui/textarea";

export default function Page() {
  const { id } = useParams(); // Lấy id từ URL
  const [delivery, setDelivery] = useState<DeliveryDataResponse>({
    id: "",
    name: "",
    description: "",
    maxDistance: 0,
    baseFee: 0,
    pricing: [],
    isActive: false,  // Trạng thái là active hay inactive
  });

  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

  useEffect(() => {
    const fetchDeliveryDetail = async () => {
      try {
        if (!id || !userId || !accessToken) {
          toast.error("User authentication is required.");
          return;
        }
        const data = await getDeliveryDetail(Array.isArray(id) ? id[0] : id, userId, accessToken);
        setDelivery(data);  // Dữ liệu trả về sẽ có kiểu DeliveryDataResponse
      } catch (error) {
        toast.error("Failed to fetch delivery details.");
      }
    };

    fetchDeliveryDetail();
  }, [id, userId, accessToken]);

  const handlePricingChange = (index: number, field: string, value: string) => {
    const updatedPricing = [...delivery.pricing];
    updatedPricing[index] = {
      ...updatedPricing[index],
      [field]: field === 'threshold' ? parseInt(value) : parseFloat(value),
    };
    setDelivery({ ...delivery, pricing: updatedPricing });
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Detail Delivery Information</CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-2 gap-x-4 gap-y-6">
          <div className="grid col-span-2 gap-x-4 gap-y-6">
            {/* Delivery Name */}
            <div className="col-span-2">
              <Label>Delivery Name</Label>
              <Input
                name="name"
                value={delivery.name}
                type="text"
                placeholder="Enter delivery name"
                readOnly
              />
            </div>

            {/* Max Distance & Base Fee trên cùng một dòng */}
            <div className="col-span-1">
              <Label>Max Distance (km)</Label>
              <Input
                name="maxDistance"
                value={delivery.maxDistance}
                type="number"
                placeholder="Enter max distance"
                readOnly
              />
            </div>
            <div className="col-span-1">
              <Label>Base Fee</Label>
              <Input
                name="baseFee"
                value={delivery.baseFee}
                type="number"
                placeholder="Enter base fee"
                readOnly
              />
            </div>

            {/* Hiển thị Pricing */}
            {delivery.pricing && delivery.pricing.length > 0 && (
              <div className="col-span-2 grid grid-cols-1 gap-4">
                <Label>Fee Per Km</Label>
                {delivery.pricing.map((tier, index) => (
                  <div key={index} className="grid grid-cols-2 gap-4 items-end border p-2 rounded-md">
                    {/* Threshold */}
                    <div>
                      <Label>Threshold (Km)</Label>
                      <Input
                        type="number"
                        value={tier.threshold}
                        placeholder="Enter threshold"
                        onChange={(e) => handlePricingChange(index, 'threshold', e.target.value)}
                      />
                    </div>

                    {/* Fee Per Km */}
                    <div>
                      <Label>Fee Per Km</Label>
                      <Input
                        type="number"
                        value={tier.feePerKm}
                        placeholder="Enter fee per km"
                        onChange={(e) => handlePricingChange(index, 'feePerKm', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Hiển thị trạng thái */}
            <div className="col-span-2">
              <Label>Status</Label>
              <Input
                value={delivery.isActive ? "Available" : "Unavailable"}
                readOnly
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cột phải */}
      <Card className="col-span-1 flex flex-col h-full">
        <CardHeader>
          <CardTitle className="text-base">Delivery Description</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <Textarea
            name="description"
            value={delivery.description}
            placeholder="Enter product description..."
            className="flex-1 h-full resize-none"
            readOnly
          />
        </CardContent>
      </Card>
    </div>
  );
}
