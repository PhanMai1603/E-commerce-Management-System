/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from "react";
import {
    User,
    MoreHorizontal,
    Truck,
    ClipboardList,
    ClipboardCheck,
    CreditCard,
    CheckCircle,
    Clock,
    Package,
} from "lucide-react";

const CODStatus = [
    {
        index: 0,
        name: "PENDING",
        label: "Order Placed",
        icon: ClipboardList,
        description: "Order has been placed"
    },
    {
        index: 1,
        name: "PROCESSING",
        label: "Processing",
        icon: Package,
        description: "Preparing your order"
    },
    {
        index: 2,
        name: "AWAITING_SHIPMENT",
        label: "Ready to Ship",
        icon: Clock,
        description: "Order ready for shipment"
    },
    {
        index: 3,
        name: "SHIPPED",
        label: "Shipped",
        icon: Truck,
        description: "Order is on the way"
    },
    {
        index: 4,
        name: "DELIVERED",
        label: "Delivered",
        icon: CheckCircle,
        description: "Order delivered successfully"
    },
];

const VNPayStatus = [
    {
        index: 0,
        name: "AWAITING_PAYMENT",
        label: "Awaiting Payment",
        icon: CreditCard,
        description: "Waiting for payment"
    },
    {
        index: 1,
        name: "PAID",
        label: "Payment Confirmed",
        icon: CheckCircle,
        description: "Payment received"
    },
    {
        index: 2,
        name: "PROCESSING",
        label: "Processing",
        icon: Package,
        description: "Preparing your order"
    },
    {
        index: 3,
        name: "AWAITING_SHIPMENT",
        label: "Ready to Ship",
        icon: Clock,
        description: "Order ready for shipment"
    },
    {
        index: 4,
        name: "SHIPPED",
        label: "Shipped",
        icon: Truck,
        description: "Order is on the way"
    },
    {
        index: 5,
        name: "DELIVERED",
        label: "Delivered",
        icon: CheckCircle,
        description: "Order delivered successfully"
    },
];

interface StatusStep {
    index: number;
    name: string;
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    description: string;
}

interface Props {
    paymentMethod: string; // hoặc 'COD' | 'VNPay' | string
    currentStatus: string;
}

export default function OrderTimeline({ paymentMethod, currentStatus }: Props) {
    const steps = paymentMethod === "COD" ? CODStatus : VNPayStatus;
    const currentIndex = steps.findIndex((step) => step.name === currentStatus);

    const getStepStatus = (stepIndex: number) => {
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
                    badge: "bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium border border-green-200"
                };
            case "current":
                return {
                    circle: "bg-blue-500 text-white shadow-lg ring-4 ring-blue-100",
                    line: "bg-gray-200",
                    text: "text-blue-600 font-semibold",
                    badge: "bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium border border-blue-200"
                };

            default:
                return {
                    circle: "bg-gray-200 text-gray-400",
                    line: "bg-gray-200",
                    text: "text-gray-400",
                    badge: "bg-gray-50 text-gray-500 px-3 py-1 rounded-full text-xs font-medium border border-gray-200"
                };
        }
    };

    return (
        <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 col-span-2">
            <div className="p-6">
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Order Status</h3>
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium border border-purple-200">
                            {paymentMethod === "COD" ? "Cash on Delivery" : "VNPay Payment"}
                        </span>
                        <span className={getStepStyles(getStepStatus(currentIndex)).badge}>
                            {steps[currentIndex]?.label || "Unknown"}
                        </span>
                    </div>
                </div>

                {/* Desktop Timeline */}
                <div className="hidden md:block">
                    <div className="flex items-start justify-between relative">
                        {steps.map((step, idx) => {
                            const status = getStepStatus(idx);
                            const styles = getStepStyles(status);
                            const isLast = idx === steps.length - 1;
                            const IconComponent = step.icon;

                            return (
                                <div key={step.name} className="flex flex-col items-center relative flex-1">
                                    {/* Connection Line */}
                                    {!isLast && (
                                        <div className={`absolute top-6 left-1/2 w-full h-0.5 ${styles.line} z-0 translate-x-1/2`} />
                                    )}

                                    {/* Step Circle */}
                                    <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${styles.circle}`}>
                                        <IconComponent size={20} />
                                    </div>

                                    {/* Step Content */}
                                    <div className="mt-4 text-center max-w-[120px]">
                                        <p className={`text-sm font-medium transition-colors duration-300 ${styles.text}`}>
                                            {step.label}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1 leading-tight">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Mobile Timeline */}
                <div className="md:hidden space-y-4">
                    {steps.map((step, idx) => {
                        const status = getStepStatus(idx);
                        const styles = getStepStyles(status);
                        const isLast = idx === steps.length - 1;
                        const IconComponent = step.icon;

                        return (
                            <div key={step.name} className="flex items-start gap-4 relative">
                                {/* Vertical Connection Line */}
                                {!isLast && (
                                    <div className={`absolute left-6 top-12 w-0.5 h-8 ${styles.line}`} />
                                )}

                                {/* Step Circle */}
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${styles.circle} flex-shrink-0`}>
                                    <IconComponent size={20} />
                                </div>

                                {/* Step Content */}
                                <div className="flex-1 min-w-0 pt-2">
                                    <p className={`text-sm font-medium transition-colors duration-300 ${styles.text}`}>
                                        {step.label}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Progress Bar */}
                <div className="mt-6 bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                        className="bg-gradient-to-r from-blue-500 to-green-500 h-full transition-all duration-700 ease-out"
                        style={{
                            width: `${currentIndex >= 0 ? ((currentIndex + 1) / steps.length) * 100 : 0}%`
                        }}
                    />
                </div>

                {/* Progress Text */}
                <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                    <span>Progress</span>
                    <span>{currentIndex >= 0 ? currentIndex + 1 : 0}/{steps.length} steps completed</span>
                </div>
            </div>
        </div>
    );
}