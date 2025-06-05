import React from "react";
import { Truck } from "lucide-react";

interface OrderStatusBadgeProps {
  status: string;
}

const orderStatusClasses: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  awaiting_payment: "bg-blue-100 text-blue-700",
  processing: "bg-orange-100 text-orange-700",
  awaiting_shipment: "bg-indigo-100 text-indigo-700",
  shipped: "bg-cyan-100 text-cyan-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  return_requested: "bg-amber-100 text-amber-700",
  returned: "bg-gray-100 text-gray-700",
  pending_refund: "bg-purple-100 text-purple-700",
  refunded: "bg-emerald-100 text-emerald-700",
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


