"use client";
import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { Ellipsis, Plus } from "lucide-react";
import { getAllDelivery } from "@/app/api/delivery";
import { DeliveriesData } from "@/interface/delivery";
import get from "lodash/get";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function TableDemo() {
  const [deliveries, setDeliveries] = useState<DeliveriesData[]>([]);
  const router = useRouter();
  
  // Lấy userId và accessToken từ localStorage
  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

  // Hàm fetch dữ liệu từ API
  const fetchDeliveries = useCallback(async () => {
    try {
      if (!userId || !accessToken) {
        toast.error("User authentication is required.");
        return;
      }
      const response = await getAllDelivery(userId, accessToken);
      setDeliveries(response.deliveries); // Đảm bảo đúng kiểu dữ liệu
    } catch (error) {
      const errorMessage = get(error, "message", "An unknown error occurred.");
      toast.error(errorMessage);
    }
  }, [userId, accessToken]);

  // Gọi API khi component mount
  useEffect(() => {
    fetchDeliveries();
  }, [fetchDeliveries]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Deliveries</CardTitle>
        <Button onClick={() => router.push("/dashboard/delivery/create")} className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Delivery
          </Button>
      </CardHeader>

      <CardContent>
        <Table>
          <TableCaption>A list of available delivery methods.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {deliveries.length > 0 ? (
              deliveries.map((delivery, index) => (
                <TableRow key={delivery.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell className="font-medium">{delivery.name}</TableCell>
                  <TableCell className="font-medium">{delivery.description}</TableCell>
                  <TableCell className="font-medium">
                    <span
                      className={`inline-block py-1 px-3 rounded-full text-sm font-semibold ${
                        delivery.isActive
                          ? "bg-[#22C55E29] text-[#118D57]"
                          : "bg-[#FF563029] text-[#B71D18]"
                      }`}
                    >
                      {delivery.isActive ? "Available" : "Unavailable"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Ellipsis className="cursor-pointer" />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No delivery methods found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      <CardFooter className="border-t pt-3 flex justify-end">
        <span className="text-sm text-gray-500">Total Methods: {deliveries.length}</span>
      </CardFooter>
    </Card>
  );
}
