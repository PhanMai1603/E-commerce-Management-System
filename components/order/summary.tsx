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

  return (
    <div className="col-span-1">
      <Card>
        <CardHeader>
          <h3 className="text-xl font-semibold">Order Summary</h3>
        </CardHeader>

        <CardContent className="space-y-2 text-lg">
          <div className="flex justify-between">
            <span>Items Price:</span>
            <span>{itemsPrice.toLocaleString()} VND</span>
          </div>
          <div className="flex justify-between">
            <span>Product Discount:</span>
            <span>-{productDiscount.toLocaleString()} VND</span>
          </div>
          <div className="flex justify-between">
            <span>Coupon Discount:</span>
            <span>-{couponDiscount.toLocaleString()} VND</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping Fee:</span>
            <span>{shippingPrice.toLocaleString()} VND</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping Discount:</span>
            <span>-{shippingDiscount.toLocaleString()} VND</span>
          </div>
          <div className="flex justify-between text-green-600">
            <span>Total Savings:</span>
            <span>-{totalSavings.toLocaleString()} VND</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-semibold">
            <span>Total to Pay:</span>
            <span>{totalPrice.toLocaleString()} VND</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
