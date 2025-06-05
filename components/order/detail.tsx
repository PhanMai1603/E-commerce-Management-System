/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";

import { getOrderDetail } from "@/app/api/order";
import { OrderDetail } from "@/interface/order";

import OrderTimeline from "./orderstatus";
import Summary from "./summary";
import Product from "./product";
import Customer from "./customer";
import OrderTimelineCard from "./timeline";

export default function OrderDetailPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "";

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      const userId = localStorage.getItem("userId") || "";
      const accessToken = localStorage.getItem("accessToken") || "";

      if (!id || !userId || !accessToken) return;

      try {
        const data = await getOrderDetail(id, userId, accessToken);
        setOrder(data.order);
      } catch (error) {
        toast.error("Failed to load order details.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!order) return <p className="text-center mt-10 text-red-500">Order not found.</p>;

  return (
    <div className="grid grid-cols-4 gap-4">
      {/* Timeline luôn nằm trên cùng */}
      <OrderTimeline
        paymentMethod={order.paymentMethod}
        currentStatus={order.status.toUpperCase()}
      />
      <Summary pricing={order.pricing} />
      <Product items={order.items} />
      <Customer address={order.shippingAddress} />
      <OrderTimelineCard
        createdAt={order.timestamps.createdAt}
        updatedAt={order.timestamps.updatedAt}
        paidAt={order.timestamps.paidAt}
        deliveredAt={order.timestamps.deliveredAt}
        requestedAt={order.timestamps.requestedAt}
        approvedAt={order.timestamps.approvedAt}
      />
    </div>
  );
}
//className="max-w-7xl mx-auto p-4 space-y-4"