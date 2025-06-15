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
      <Card className="rounded-2xl shadow-xl border border-gray-200 bg-gradient-to-br from-white to-slate-50">
        <CardHeader className="border-b pb-4">
          <h3 className="text-2xl font-bold text-gray-800">Tóm tắt đơn hàng</h3>
        </CardHeader>

        <CardContent className="space-y-4 text-sm text-gray-700 py-4">
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Tạm tính:</span>
            <span className="font-semibold">{formatCurrency(itemsPrice)}</span>
          </div>

          <div className="flex justify-between text-red-600">
            <span>Giảm giá sản phẩm:</span>
            <span>-{formatCurrency(productDiscount)}</span>
          </div>

          <div className="flex justify-between text-red-600">
            <span>Mã giảm giá:</span>
            <span>-{formatCurrency(couponDiscount)}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Phí vận chuyển:</span>
            <span className="font-semibold">{formatCurrency(shippingPrice)}</span>
          </div>

          <div className="flex justify-between text-red-600">
            <span>Giảm giá vận chuyển:</span>
            <span>-{formatCurrency(shippingDiscount)}</span>
          </div>

          <hr className="my-2 border-t border-gray-300" />

          <div className="flex justify-between text-green-600 font-medium">
            <span>Tiết kiệm tổng cộng:</span>
            <span>-{formatCurrency(totalSavings)}</span>
          </div>

          <div className="flex justify-between items-center border-t pt-4 mt-4 text-lg font-bold text-gray-900">
            <span>Tổng thanh toán:</span>
            <span className="text-green-700">{formatCurrency(totalPrice)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
