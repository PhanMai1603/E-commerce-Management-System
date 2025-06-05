/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DeliveryDataResponse } from "@/interface/delivery"; // Import interface
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getDeliveryDetail, updateActive, updateDeactivate, updateDelivery } from "@/app/api/delivery"; // Import API functions
import { toast } from "react-toastify";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export default function Page() {
  const { id } = useParams(); // Lấy id từ URL
  const [delivery, setDelivery] = useState<DeliveryDataResponse>({
    id: "",
    name: "",
    description: "",
    maxDistance: 0,
    baseFee: 0,
    pricing: [],
    isActive: false,
  });

  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";
  const router = useRouter();
  useEffect(() => {
    const fetchDeliveryDetail = async () => {
      try {
        if (!id || !userId || !accessToken) {
          toast.error("User authentication is required.");
          return;
        }

        const data = await getDeliveryDetail(Array.isArray(id) ? id[0] : id, userId, accessToken);

        // Kiểm tra và thay đổi các giá trị âm thành 0 trong dữ liệu trả về
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

        setDelivery(validatedDelivery); // Cập nhật lại dữ liệu với các giá trị đã kiểm tra
      } catch (error) {
        toast.error("Failed to fetch delivery details.");
      }
    };

    fetchDeliveryDetail();
  }, [id, userId, accessToken]);


  const handlePricingChange = (index: number, field: string, value: string) => {
    const updatedPricing = [...delivery.pricing];

    // Kiểm tra nếu giá trị là số âm và thay thế bằng 0
    const newValue = field === "threshold" ? parseInt(value) : parseFloat(value);
    const validatedValue = newValue < 0 ? 0 : newValue;

    updatedPricing[index] = {
      ...updatedPricing[index],
      [field]: validatedValue,
    };

    setDelivery({ ...delivery, pricing: updatedPricing });
  };

  // Cập nhật các giá trị khác trong state, đảm bảo không có giá trị âm
  const handleMaxDistanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setDelivery({ ...delivery, maxDistance: value < 0 ? 0 : value });
  };

  const handleBaseFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setDelivery({ ...delivery, baseFee: value < 0 ? 0 : value });
  };

  // Check for authentication
  const checkUserAuth = () => {
    if (!id || !userId || !accessToken) {
      toast.error("User authentication is required.");
      return false;
    }
    return true;
  };

  // Handle activation of delivery
  const handleStatusChange = async (isActive: boolean) => {
    if (!checkUserAuth()) return;

    try {
      if (isActive) {
        await updateActive(Array.isArray(id) ? id[0] : id || "", userId, accessToken); // Cập nhật trạng thái active
        toast.success("Delivery activated successfully.");
      } else {
        await updateDeactivate(Array.isArray(id) ? id[0] : id || "", userId, accessToken); // Cập nhật trạng thái inactive
        toast.success("Delivery deactivated successfully.");
      }

      // Cập nhật lại dữ liệu sau khi thay đổi trạng thái
      const updatedDelivery = await getDeliveryDetail(Array.isArray(id) ? id[0] : id || "", userId, accessToken);
      setDelivery(updatedDelivery);

    } catch (error) {
      toast.error("Failed to update delivery status.");
    }
  };

  // Handle saving the updates for all fields
  const handleSave = async () => {
    if (!checkUserAuth()) return;
    try {
      const updatedDelivery = await updateDelivery(Array.isArray(id) ? id[0] : id || "", delivery, userId, accessToken);
      setDelivery(updatedDelivery); // Update state with the latest delivery details
      toast.success("Update delivery successfully.");
    } catch (error) {
      toast.error("Failed to update delivery.");
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Edit Delivery Information</CardTitle>
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
                onChange={(e) => setDelivery({ ...delivery, name: e.target.value })}
              />
            </div>

            {/* Max Distance & Base Fee on the same row */}
            <div className="col-span-1">
              <Label>Max Distance (km)</Label>
              <Input
                name="maxDistance"
                value={delivery.maxDistance}
                type="number"
                placeholder="Enter max distance"
                onChange={handleMaxDistanceChange}
              />
            </div>
            <div className="col-span-1">
              <Label>Base Fee</Label>
              <Input
                name="baseFee"
                value={delivery.baseFee}
                type="number"
                placeholder="Enter base fee"
                onChange={handleBaseFeeChange}
              />
            </div>

            {/* Show Pricing */}
            {delivery.pricing && delivery.pricing.length > 0 && (
              <div className="col-span-2 grid grid-cols-1 gap-4">
                <Label>Fee Per Km</Label>
                {delivery.pricing.map((tier, index) => (
                  <div key={index} className="grid grid-cols-3 gap-4 items-end border p-2 rounded-md">
                    {/* Threshold */}
                    <div>
                      <Label>Threshold (Km)</Label>
                      <Input
                        type="number"
                        value={tier.threshold}
                        placeholder="Enter threshold"
                        onChange={(e) => handlePricingChange(index, "threshold", e.target.value)}
                      />
                    </div>

                    {/* Fee Per Km */}
                    <div>
                      <Label>Fee Per Km</Label>
                      <Input
                        type="number"
                        value={tier.feePerKm}
                        placeholder="Enter fee per km"
                        onChange={(e) => handlePricingChange(index, "feePerKm", e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Show Status */}
            <div className="col-span-2">
              <Label>Status</Label>
              <Input value={delivery.isActive ? "Available" : "Unavailable"} readOnly />
            </div>

            {/* Action Switch */}
            <div className="col-span-2 flex gap-4 items-center">
              <div className="flex items-center space-x-4">
                <Switch
                  checked={delivery.isActive}
                  onCheckedChange={(checked) => handleStatusChange(checked)}
                />
              </div>
            </div>

          </div>
        </CardContent>
      </Card>

      {/* Right Column */}
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
            onChange={(e) => setDelivery({ ...delivery, description: e.target.value })}
          />
        </CardContent>
      </Card>

      <div className="col-span-2 flex justify-end gap-4 mt-4">
        <Button
          onClick={() => router.push("/dashboard/delivery")}
          className='bg-gray-200 text-gray-900 hover:bg-gray-300'
        >
          CANCEL
        </Button>

        <Button
          className="col-span-2 flex place-self-end"
          onClick={handleSave}
        >
          SAVE
        </Button>
      </div>
    </div>
  );
}
