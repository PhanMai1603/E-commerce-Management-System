import React from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';

interface SummaryProps {
  pricing: {
    itemsPrice: number;
    productDiscount: number;
    couponDiscount: number;
    shippingPrice: number;
    shippingDiscount: number;
    totalSavings: number;
    totalPrice: number;
  };
}

export default function Summary({ pricing }: SummaryProps) {
  const {
    itemsPrice,
    productDiscount,
    couponDiscount,
    shippingPrice,
    shippingDiscount,
    totalSavings,
    totalPrice,
  } = pricing;

  const formatCurrency = (value: number) =>
    `${value.toLocaleString('vi-VN')} ₫`;

  return (
    <div className="col-span-1">
      <Card className="shadow-lg border border-gray-200 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="border-b pb-4">
          <h3 className="text-xl font-bold text-gray-900">Order Summary</h3>
        </CardHeader>

        <CardContent className="space-y-3 text-sm text-gray-700">
          {/* Items */}
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span className="font-medium">{formatCurrency(itemsPrice)}</span>
          </div>

          {/* Discounts */}
          <div className="flex justify-between text-red-600">
            <span>Product Discount:</span>
            <span>-{formatCurrency(productDiscount)}</span>
          </div>
          <div className="flex justify-between text-red-600">
            <span>Coupon Discount:</span>
            <span>-{formatCurrency(couponDiscount)}</span>
          </div>

          {/* Shipping */}
          <div className="flex justify-between">
            <span>Shipping Fee:</span>
            <span className="font-medium">{formatCurrency(shippingPrice)}</span>
          </div>
          <div className="flex justify-between text-red-600">
            <span>Shipping Discount:</span>
            <span>-{formatCurrency(shippingDiscount)}</span>
          </div>

          {/* Total Savings */}
          <div className="flex justify-between text-green-600 font-medium border-t pt-3">
            <span>Total Savings:</span>
            <span>-{formatCurrency(totalSavings)}</span>
          </div>

          {/* Grand total */}
          <div className="flex justify-between items-center border-t pt-4 mt-2 text-lg font-bold text-gray-900">
            <span>Total to Pay:</span>
            <span className="text-green-700">{formatCurrency(totalPrice)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
