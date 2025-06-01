import React from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';

type SummaryProps = {
  totalPrice: number;
  shippingPrice?: number; // optional, default if not passed
};

export default function Summary({ totalPrice, shippingPrice = 5000 }: SummaryProps) {
  const finalAmount = totalPrice + shippingPrice;

  return (
    <div className="col-span-1">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Order Summary</h3>
        </CardHeader>

        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>{totalPrice.toLocaleString()} VND</span>
          </div>
          {/* <div className="flex justify-between">
            <span>Shipping Fee:</span>
            <span>{shippingPrice.toLocaleString()} VND</span>
          </div> */}
          <div className="border-t pt-2 flex justify-between font-semibold">
            <span>Total:</span>
            <span>{finalAmount.toLocaleString()} VND</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
