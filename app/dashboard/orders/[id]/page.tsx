"use client";
import { getOrderDetail } from "@/app/api/order";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { OrderMetadata } from "@/interface/order";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  PackageOpen,
  CreditCard,
  Tag,
  MapPin,
} from "lucide-react";

export const OrderDetail = () => {
  const [order, setOrder] = useState<OrderMetadata | null>(null);
  const [loading, setLoading] = useState(true);

  const rawId = useParams().id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  useEffect(() => {
    if (!id) return;
    const fetchOrder = async () => {
      try {
        const userId = localStorage.getItem("userId") || "";
        const accessToken = localStorage.getItem("accessToken") || "";
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

  const renderStatusBadge = (status: string) => {
    let bgColor = "";
    let textColor = "";
    let text = "";

    switch (status) {
      case "PENDING":
        bgColor = "bg-yellow-100";
        textColor = "text-yellow-700";
        text = "PENDING FOR CONFIRMATION";
        break;

      case "AWAITING_PAYMENT":
        bgColor = "bg-blue-100";
        textColor = "text-blue-700";
        text = "WAIT FOR PAYMENT";
        break;

      case "PAID":
        bgColor = "bg-blue-100";
        textColor = "text-blue-700";
        text = "PAID";
        break;

      case "PROCESSING":
        bgColor = "bg-orange-100";
        textColor = "text-orange-700";
        text = "PROCESSING ORDER";
        break;

      case "AWAITING_SHIPMENT":
        bgColor = "bg-blue-100";
        textColor = "text-blue-700";
        text = "WAITING FOR SHIPMENT";
        break;

      case "SHIPPED":
        bgColor = "bg-blue-100";
        textColor = "text-blue-700";
        text = "SHIPPED";
        break;

      case "DELIVERED":
        bgColor = "bg-green-100";
        textColor = "text-green-700";
        text = "DELIVERED SUCCESSFULLY";
        break;

      case "CANCELLED":
        bgColor = "bg-red-100";
        textColor = "text-red-700";
        text = "CANCELLED";
        break;

      case "RETURNED":
        bgColor = "bg-gray-100";
        textColor = "text-gray-700";
        text = "RETURNED";
        break;
    }

    return (
      <div
        className={`w-full px-6 py-4 ${bgColor} ${textColor} text-base font-semibold`}
      >
        {text}
      </div>
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
    <div className="space-y-2">
      <Card>
        <CardHeader>
          <CardTitle>Order #{id}</CardTitle>
        </CardHeader>
      </Card>

      <Card>
        {/* Order Status */}
        <div>{renderStatusBadge(order.status)}</div>
        {/* Payment Info */}
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Payment</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Payment Method</span>
            <span className="font-medium">{order.paymentMethod}</span>
          </div>
          {order.couponCode && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Coupon Code</span>
              <div className="flex items-center gap-1">
                <Tag size={16} className="text-primary" />
                <span className="font-medium">{order.couponCode}</span>
              </div>
            </div>
          )}
        </CardContent>

        <div className="border-t mx-6" />

        {/* Shipping Info */}
        <CardHeader className="pb-3 pt-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg"> Shipping Address</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-1">
            <p className="font-medium">
              {order.shippingAddress.fullname}
              <span className="text-gray-600">
                {" "}
                (+84) {order.shippingAddress.phone}
              </span>
            </p>

            <p className="text-gray-600">
              {`${order.shippingAddress.street}, ${order.shippingAddress.ward}, ${order.shippingAddress.district}, ${order.shippingAddress.city}`}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Product List */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <PackageOpen className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">
              Product({order.items.length})
            </CardTitle>
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
                    {/* Tên sản phẩm */}
                    <p className="font-medium text-lg">{item.productName}</p>

                    {/* Biến thể + Số lượng trên cùng một hàng */}
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <p>{item.variantSlug}</p>
                      <p>
                        x <span className="font-medium">{item.quantity}</span>
                      </p>
                    </div>

                    {/* Giá và giảm giá nằm bên phải */}
                    <div className="flex flex-col items-end gap-1 mt-2 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">
                          {item.price.toLocaleString()}đ
                        </span>
                      </div>
                      {item.discount > 0 && (
                        <div className="text-red-500">
                          Giảm giá:{" "}
                          <span className="font-medium">
                            {item.discount.toLocaleString()}đ
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* <div className="text-right">
                    <p className="font-semibold">
                      {(
                        (item.price - item.discount) *
                        item.quantity
                      ).toLocaleString()}
                      đ
                    </p>
                  </div> */}
                </div>
                {index < order.items.length - 1 && (
                  <Separator className="my-4" />
                )}
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Price</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-600">Subtotal</span>
              <span>{order.itemsPrice.toLocaleString()}đ</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-600">Item Discount</span>
              <span className="text-red-500">
                -{order.itemsDiscount.toLocaleString()}đ
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-600">Shipping Fee</span>
              <span>{order.shippingPrice.toLocaleString()}đ</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-600">Shipping Discount</span>
              <span className="text-red-500">
                -{order.shippingDiscount.toLocaleString()}đ
              </span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between items-center py-2">
              <span className="font-bold text-lg">Total</span>
              <span className="font-bold text-lg text-primary">
                {order.totalPrice.toLocaleString()}đ
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderDetail;
