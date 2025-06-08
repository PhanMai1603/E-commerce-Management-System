"use client";

import React from "react";
import {
  ClipboardList,
  Package,
  Clock,
  Truck,
  CheckCircle,
  RotateCcw,
} from "lucide-react";

interface StatusStep {
  index: number;
  name: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  description: string;
}

interface Props {
  paymentMethod: string;
  currentStatus: string;
}

const RETURN_FLOW: StatusStep[] = [
  {
    index: 99,
    name: "RETURN",
    label: "Returned",
    icon: RotateCcw,
    description: "Item has been returned by the customer",
  },
];

const STOP_FLOW = ["CANCELLED", "NOT_DELIVERED"];

const CODStatus: StatusStep[] = [
  {
    index: 0,
    name: "PENDING",
    label: "Order Placed",
    icon: ClipboardList,
    description: "We have received your order",
  },
  {
    index: 1,
    name: "PROCESSING",
    label: "Processing",
    icon: Package,
    description: "Your items are being prepared",
  },
  {
    index: 2,
    name: "READY_TO_SHIP",
    label: "Ready to Ship",
    icon: Clock,
    description: "Waiting for the courier to collect the parcel",
  },
  {
    index: 3,
    name: "IN_TRANSIT",
    label: "In Transit",
    icon: Truck,
    description: "Your order is on the way to your address",
  },
  {
    index: 4,
    name: "DELIVERED",
    label: "Delivered",
    icon: CheckCircle,
    description: "Your package has been delivered successfully",
  },
];


const VNPayStatus: StatusStep[] = [
  {
    index: 0,
    name: "AWAITING_PAYMENT",
    label: "Awaiting Payment",
    icon: Clock,
    description: "Please complete your payment to proceed",
  },
  {
    index: 1,
    name: "PROCESSING",
    label: "Processing",
    icon: Package,
    description: "We are preparing your order",
  },
  {
    index: 2,
    name: "READY_TO_SHIP",
    label: "Ready to Ship",
    icon: Clock,
    description: "Your order is ready for dispatch",
  },
  {
    index: 3,
    name: "IN_TRANSIT",
    label: "In Transit",
    icon: Truck,
    description: "Your order is on the way",
  },
  {
    index: 4,
    name: "DELIVERED",
    label: "Delivered",
    icon: CheckCircle,
    description: "Your package has been delivered",
  },
];

const MOMOStatus = [...VNPayStatus];

export default function OrderTimeline({ paymentMethod, currentStatus }: Props) {
  const isCancelled = STOP_FLOW.includes(currentStatus);
  const isReturned = currentStatus === "RETURN";

  const baseSteps =
    paymentMethod === "COD"
      ? CODStatus
      : paymentMethod === "MOMO"
      ? MOMOStatus
      : VNPayStatus;

  const allSteps = isReturned ? [...baseSteps, ...RETURN_FLOW] : baseSteps;

  const currentIndex = isCancelled
    ? -1
    : allSteps.findIndex((s) => s.name === currentStatus);

  const visibleSteps = isCancelled
    ? []
    : allSteps;

  const getStepStatus = (stepIndex: number) => {
    if (isCancelled) return "pending";
    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "current";
    return "pending";
  };

  const getStepStyles = (status: string) => {
    switch (status) {
      case "completed":
        return {
          circle: "bg-green-500 text-white shadow-lg ring-4 ring-green-100",
          line: "bg-green-500",
          text: "text-green-600",
          badge: "bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium border border-green-200",
        };
      case "current":
        return {
          circle: "bg-blue-500 text-white shadow-lg ring-4 ring-blue-100",
          line: "bg-gray-200",
          text: "text-blue-600 font-semibold",
          badge: "bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium border border-blue-200",
        };
      default:
        return {
          circle: "bg-gray-200 text-gray-400",
          line: "bg-gray-200",
          text: "text-gray-400",
          badge: "bg-gray-50 text-gray-500 px-3 py-1 rounded-full text-xs font-medium border border-gray-200",
        };
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 col-span-3">
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Order Status</h3>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium border border-purple-200">
              {paymentMethod === "COD"
                ? "Cash on Delivery"
                : paymentMethod === "MOMO"
                ? "MoMo Payment"
                : "VNPay Payment"}
            </span>

            <span
              className={
                isCancelled
                  ? "bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium border border-red-200"
                  : getStepStyles(getStepStatus(currentIndex)).badge
              }
            >
              {isCancelled
                ? currentStatus === "CANCELLED"
                  ? "Cancelled"
                  : "Delivery Failed"
                : allSteps[currentIndex]?.label || "Unknown"}
            </span>
          </div>
        </div>

        {/* Timeline */}
        {!isCancelled && (
          <>
            <div className="hidden md:block">
              <div className="flex items-start justify-between relative">
                {visibleSteps.map((step, idx) => {
                  const status = getStepStatus(idx);
                  const styles = getStepStyles(status);
                  const isLast = idx === visibleSteps.length - 1;
                  const IconComponent = step.icon;

                  return (
                    <div key={step.name} className="flex flex-col items-center relative flex-1">
                      {!isLast && (
                        <div className={`absolute top-6 left-1/2 w-full h-0.5 ${styles.line} z-0 translate-x-1/2`} />
                      )}
                      <div
                        className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center ${styles.circle}`}
                      >
                        <IconComponent size={20} />
                      </div>
                      <div className="mt-4 text-center max-w-[120px]">
                        <p className={`text-sm font-medium ${styles.text}`}>{step.label}</p>
                        <p className="text-xs text-gray-500 mt-1">{step.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-6 bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-green-500 h-full transition-all duration-700 ease-out"
                style={{
                  width:
                    currentIndex >= 0
                      ? `${((currentIndex + 1) / visibleSteps.length) * 100}%`
                      : "0%",
                }}
              />
            </div>

            <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
              <span>Progress</span>
              <span>
                {currentIndex >= 0 ? currentIndex + 1 : 0}/{visibleSteps.length} steps completed
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
