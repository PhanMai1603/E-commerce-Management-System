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
   <Customer address={order.shippingAddress} />
     

 
      <Product items={order.items} />
       <Summary totalPrice={order.totalPrice} />
      <OrderTimelineCard
        createdAt={order.createdAt}
        updatedAt={order.updatedAt}
        deliveredAt={order.deliveredAt}
      />


   
      
     

    </div>
  );
}
//className="max-w-7xl mx-auto p-4 space-y-4"