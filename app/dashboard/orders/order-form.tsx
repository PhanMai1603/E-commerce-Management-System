/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "react-toastify"
import { getAllOrder, updateOrderStatus } from "@/app/api/order"
import { Order, OrderStatus, PaymentMethod, PaymentStatus } from "@/interface/order"
import Link from "next/link"


const ORDER_STATUS_LABELS: Record<string, string> = {
  ALL: "All",
  PENDING: "Pending",
  AWAITING_PAYMENT: "Awaiting Payment",
  PROCESSING: "Processing",
  AWAITING_SHIPMENT: "Awaiting Shipment",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  NOT_DELIVERED: "Not Delivered",
  RETURN: "Returned",
}
const statusBadge: Record<OrderStatus, string> = {
  PENDING: "bg-gray-200 text-gray-800",
  AWAITING_PAYMENT: "bg-yellow-100 text-yellow-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  AWAITING_SHIPMENT: "bg-indigo-100 text-indigo-800",
  SHIPPED: "bg-sky-100 text-sky-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  NOT_DELIVERED: "bg-emerald-100 text-emerald-800",
  RETURN: "bg-orange-200 text-orange-900",
}

const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  COD: "Cash on Delivery",
  VNPAY: "VNPay",
  MOMO: "Momo",
  MANUAL: "Bank Transfer",
}

const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  PENDING: "Pending",
  CANCELLED: "Cancelled",
  COMPLETED: "Completed",
  FAILED: "Failed",
  PENDING_REFUND: "Pending Refund",
  REFUNDED: "Refunded",
}

const PAYMENT_STATUS_BADGE: Record<PaymentStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CANCELLED: "bg-red-100 text-red-800",
  COMPLETED: "bg-green-100 text-green-800",
  FAILED: "bg-red-200 text-red-900",
  PENDING_REFUND: "bg-blue-100 text-blue-800",
  REFUNDED: "bg-gray-200 text-gray-800",
}

export default function OrderPage() {
  const [allOrders, setAllOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const userId = localStorage.getItem("userId") || ""
      const accessToken = localStorage.getItem("accessToken") || ""
      const res = await getAllOrder(userId, accessToken, 1, 100)
      setAllOrders(res.items)
    } catch (err) {
      toast.error("Failed to load order list.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const confirmEdit = async () => {
    if (!selectedOrderId) return
    try {
      const userId = localStorage.getItem("userId") || ""
      const accessToken = localStorage.getItem("accessToken") || ""
      await updateOrderStatus(selectedOrderId, userId, accessToken)
      toast.success("Order status updated successfully!")
      fetchOrders()
    } catch (error) {
      toast.error("Failed to update order status.")
    } finally {
      setSelectedOrderId(null)
    }
  }

  const statusTabs = ["ALL", ...Object.values(OrderStatus)]

  const renderOrderCard = (order: Order) => (
    <div
      key={order.id}
      className="rounded-lg border p-4 mb-4 bg-white dark:bg-muted"
    >
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="space-y-1 text-sm">
          <p><strong>ID:</strong> {order.id}</p>
          <p><strong>Ordered Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
          <p><strong>Delivery:</strong> {order.deliveryMethod}</p>
        </div>

        <div className="flex flex-col gap-1 text-sm text-right">
          <span className={`px-3 py-1 rounded-full font-medium ${statusBadge[order.status as OrderStatus]}`}>{ORDER_STATUS_LABELS[order.status]}</span>
          <span className="font-semibold text-lg">Price:{order.totalPrice.toLocaleString()} ₫</span>
        </div>
      </div>

      <div className="divide-y mt-4">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-4 py-2">
            <img src={item.image} alt={item.productName} className="w-12 h-12 object-cover rounded border" />
            <div className="flex-1 text-sm">
              <p className="font-medium">{item.productName}</p>
              <p className="text-muted-foreground">Quantity: {item.quantity}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-end gap-2 pt-4">
        <div className="space-y-1 text-sm">
          <p><strong>Payment:</strong> {PAYMENT_METHOD_LABELS[order.paymentMethod as PaymentMethod]}</p>
          <p>
            <span className={`inline-block px-2 py-1 rounded ${PAYMENT_STATUS_BADGE[order.paymentStatus as PaymentStatus]}`}>
              {PAYMENT_STATUS_LABELS[order.paymentStatus as PaymentStatus]}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/dashboard/orders/${order.id}`}>
            <button className="px-3 py-1 text-sm rounded bg-blue-100 text-blue-800 hover:bg-blue-200 transition">Details</button>
          </Link>
          <button onClick={() => setSelectedOrderId(order.id)} className="px-3 py-1 text-sm rounded bg-gray-100 text-gray-800 hover:bg-gray-200 transition">Update</button>
        </div>
      </div>

      {selectedOrderId === order.id && (
        <div className="mt-3 bg-gray-50 border rounded p-3 text-sm">
          <p>Do you want to update the order status?</p>
          <div className="flex gap-2 mt-2">
            <button onClick={confirmEdit} className="px-3 py-1 rounded bg-green-100 text-green-800 hover:bg-green-200">Confirm</button>
            <button onClick={() => setSelectedOrderId(null)} className="px-3 py-1 rounded bg-red-100 text-red-800 hover:bg-red-200">Cancel</button>
          </div>
        </div>
      )}
    </div>
  )

  const renderOrders = (orders: Order[]) =>
    orders.length === 0 ? <p className="py-4">No orders found.</p> : orders.map(renderOrderCard)

  const filterByStatus = (status: string) =>
    status === "ALL" ? allOrders : allOrders.filter((order) => order.status === status)

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Orders</h1>
      <Tabs defaultValue="ALL" className="w-full">
        <TabsList className="w-full h-14 overflow-x-auto whitespace-nowrap rounded-lg bg-gray-100 dark:bg-gray-800 p-2">

          {statusTabs.map((status) => (
            <TabsTrigger key={status} value={status}>
              {ORDER_STATUS_LABELS[status] || status}
            </TabsTrigger>
          ))}
        </TabsList>

        {statusTabs.map((status) => (
          <TabsContent key={status} value={status}>
            {loading ? (
              <p className="py-4">Loading orders...</p>
            ) : (
              renderOrders(filterByStatus(status))
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
