import React from "react";
import { Truck } from "lucide-react";

interface OrderStatusBadgeProps {
  status: string;
}

const orderStatusClasses: Record<string, string> = {
  pending: "bg-yellow-50 text-yellow-800",
  awaiting_payment: "bg-sky-50 text-sky-800",
  processing: "bg-amber-50 text-amber-800",
  awaiting_shipment: "bg-purple-50 text-purple-800",
  shipped: "bg-blue-50 text-blue-800",
  delivered: "bg-emerald-50 text-emerald-800",
  cancelled: "bg-rose-50 text-rose-800",
  not_delivered: "bg-stone-100 text-stone-700",
  return: "bg-gray-50 text-gray-800",
};

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
  const normalized = status.toLowerCase();
  const classes = orderStatusClasses[normalized] || "bg-gray-100 text-gray-700";

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${classes}`}>
      <Truck className="w-4 h-4" />
      {status.replaceAll("_", " ")}
    </span>
  );
};


