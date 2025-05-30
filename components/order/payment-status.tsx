import React from "react";
import { CreditCard } from "lucide-react";

interface PaymentStatusBadgeProps {
  status: string;
}

const statusClasses: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  completed: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
  pending_refund: "bg-purple-100 text-purple-700",
  refunded: "bg-emerald-100 text-emerald-700",
};

export const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = ({ status }) => {
  const normalized = status.toLowerCase();
  const classes = statusClasses[normalized] || "bg-gray-100 text-gray-700";

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${classes}`}>
      <CreditCard className="w-4 h-4" />
      {status.replaceAll("_", " ")}
    </span>
  );
};
