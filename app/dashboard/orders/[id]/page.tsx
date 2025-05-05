"use client";
import { getOrderDetail } from "@/app/api/order";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { OrderMetadata } from "@/interface/order";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { PackageOpen, Truck, CreditCard, Tag, Badge } from "lucide-react";

export const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<OrderMetadata | null>(null);
  const [loading, setLoading] = useState(true);

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderDetail(id, userId, accessToken);
        setOrder(data.orders);
      } catch (err) {
        toast.error("Không thể tải thông tin đơn hàng.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  // Helper function to render status badge with appropriate color
  const renderStatusBadge = (status) => {
    const statusStyles = {
      "pending": "bg-yellow-100 text-yellow-800",
      "processing": "bg-blue-100 text-blue-800",
      "shipped": "bg-purple-100 text-purple-800",
      "delivered": "bg-green-100 text-green-800",
      "cancelled": "bg-red-100 text-red-800"
    };
    
    const defaultStyle = "bg-gray-100 text-gray-800";
    const style = statusStyles[status?.toLowerCase()] || defaultStyle;
    
    return (
      <Badge className={`${style} font-medium px-3 py-1 rounded-md`}>
        {status}
      </Badge>
    );
  };

  if (loading || !order) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-6 w-1/2 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
            <Skeleton className="h-40 w-full mt-4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Đơn hàng #{id}</h1>
          <p className="text-gray-500 mt-1">Đặt hàng ngày {new Date().toLocaleDateString('vi-VN')}</p>
        </div>
        <div>{renderStatusBadge(order.status)}</div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Payment Information */}
        <Card className="h-full">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Thanh toán</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Phương thức:</span>
              <span className="font-medium">{order.paymentMethod}</span>
            </div>
            {order.couponCode && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Mã giảm giá:</span>
                <div className="flex items-center gap-1">
                  <Tag size={16} className="text-primary" />
                  <span className="font-medium">{order.couponCode}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Shipping Information */}
        <Card className="h-full">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Địa chỉ giao hàng</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-1">
              <p className="font-medium">{order.shippingAddress.fullname}</p>
              <p className="text-gray-600">{order.shippingAddress.phone}</p>
              <p className="text-gray-600">{`${order.shippingAddress.street}, ${order.shippingAddress.ward}`}</p>
              <p className="text-gray-600">{`${order.shippingAddress.district}, ${order.shippingAddress.city}`}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Product List */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <PackageOpen className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Sản phẩm ({order.items.length})</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <React.Fragment key={item.variantId}>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-24 h-24 object-cover rounded-md border"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-lg">{item.productName}</p>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="text-sm text-gray-600">Số lượng: <span className="font-medium">{item.quantity}</span></div>
                      <div className="text-sm text-gray-600">
                        Đơn giá: <span className="font-medium">{item.price.toLocaleString()}đ</span>
                      </div>
                      {item.discount > 0 && (
                        <div className="text-sm text-red-500">
                          Giảm giá: <span className="font-medium">{item.discount.toLocaleString()}đ</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {((item.price - item.discount) * item.quantity).toLocaleString()}đ
                    </p>
                  </div>
                </div>
                {index < order.items.length - 1 && <Separator className="my-4" />}
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Tổng tiền</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-600">Tạm tính:</span>
              <span>{order.itemsPrice.toLocaleString()}đ</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-600">Giảm giá sản phẩm:</span>
              <span className="text-red-500">-{order.itemsDiscount.toLocaleString()}đ</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-600">Phí vận chuyển:</span>
              <span>{order.shippingPrice.toLocaleString()}đ</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-600">Giảm giá vận chuyển:</span>
              <span className="text-red-500">-{order.shippingDiscount.toLocaleString()}đ</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between items-center py-2">
              <span className="font-bold text-lg">Tổng cộng:</span>
              <span className="font-bold text-lg text-primary">{order.totalPrice.toLocaleString()}đ</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderDetail;