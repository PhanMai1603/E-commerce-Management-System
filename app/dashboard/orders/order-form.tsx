/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "react-toastify"
import Link from "next/link"

import { getAllOrder, updateOrderStatus } from "@/app/api/order"
import { codManualRefund } from "@/app/api/payment"
import { uploadTransfer } from "@/app/api/upload"

import { Order, OrderStatus, PaymentMethod, PaymentStatus } from "@/interface/order"

const ORDER_STATUS_LABELS: Record<string, string> = {
  ALL: "Tất cả",
  PENDING: "Chờ xác nhận",
  AWAITING_PAYMENT: "Chờ thanh toán",
  PROCESSING: "Đang xử lý",
  READY_TO_SHIP: "Sẵn sàng giao",
  IN_TRANSIT: "Đang giao",
  DELIVERED: " Đã giao",
  CANCELLED: " Đã hủy",
  DELIVERY_FAILED: "Không giao được",
  RETURN: "Hoàn trả",
}


const statusBadge: Record<OrderStatus, string> = {
  PENDING: "bg-gray-200 text-gray-800",
  AWAITING_PAYMENT: "bg-yellow-100 text-yellow-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  READY_TO_SHIP: "bg-indigo-100 text-indigo-800",
  IN_TRANSIT: "bg-sky-100 text-sky-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  DELIVERY_FAILED: "bg-emerald-100 text-emerald-800",
  RETURN: "bg-orange-200 text-orange-900",
}

const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  COD: "Thanh toán khi nhận hàng",
  VNPAY: "VNPay",
  MOMO: "MoMo",
  MANUAL: "Chuyển khoản ngân hàng",
};

const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  PENDING: "Đang chờ xử lý",
  CANCELLED: "Đã hủy",
  COMPLETED: "Hoàn tất",
  FAILED: "Thất bại",
  PENDING_REFUND: "Chờ hoàn tiền",
  REFUNDED: "Đã hoàn tiền",
};

const PAYMENT_STATUS_BADGE: Record<PaymentStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",       // Đang chờ xử lý
  CANCELLED: "bg-red-100 text-red-800",           // Đã hủy
  COMPLETED: "bg-green-100 text-green-800",       // Hoàn tất
  FAILED: "bg-red-200 text-red-900",              // Thất bại
  PENDING_REFUND: "bg-blue-100 text-blue-800",    // Chờ hoàn tiền
  REFUNDED: "bg-gray-200 text-gray-800",          // Đã hoàn tiền
};

const isUpdatableStatus = (status: OrderStatus): boolean => {
  return ![
    OrderStatus.RETURN,
    OrderStatus.CANCELLED,
    OrderStatus.DELIVERED,
    OrderStatus.DELIVERY_FAILED,
  ].includes(status)
}


// Payment Modal Component
const PaymentModal = ({
  isOpen,
  onClose,
  orderId,
  bankInfo,
  setBankInfo,
  onSubmit
}: {
  isOpen: boolean
  onClose: () => void
  orderId: string
  bankInfo: any
  setBankInfo: (info: any) => void
  onSubmit: (orderId: string) => void
}) => {
  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold">Thông tin thanh toán</h2>
                <p className="text-blue-100 text-sm">Order ID: {orderId}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Bank Name */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Tên Ngân hàng <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={bankInfo.bankName}
                    onChange={(e) => setBankInfo({ ...bankInfo, bankName: e.target.value })}
                    placeholder="Enter bank name"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white shadow-sm"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Card Number */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Số thẻ <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={bankInfo.accountNumber}
                    onChange={(e) => setBankInfo({ ...bankInfo, accountNumber: e.target.value })}
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white shadow-sm"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Cardholder Name */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Tên chủ thẻ <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={bankInfo.accountHolder}
                    onChange={(e) => setBankInfo({ ...bankInfo, accountHolder: e.target.value })}
                    placeholder="Enter cardholder name"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white shadow-sm"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Transfer Photo */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Transfer Photo <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        try {
                          const userId = localStorage.getItem("userId") || ""
                          const accessToken = localStorage.getItem("accessToken") || ""
                          const url = await uploadTransfer(file, userId, accessToken)
                          setBankInfo({ ...bankInfo, transferImage: url })
                          toast.success("Đã tải ảnh lên thành công.")
                        } catch {
                          toast.error("Không tải được hình ảnh.")
                        }
                      }}
                      className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white hover:bg-gray-50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  {bankInfo.transferImage && (
                    <div className="relative inline-block">
                      <img
                        src={bankInfo.transferImage}
                        alt="Transfer Receipt"
                        className="w-48 h-auto border-2 border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                      />
                      <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row gap-3 p-6 bg-gray-50 border-t border-gray-200 rounded-b-2xl">
            <button
              onClick={() => onSubmit(orderId)}
              className="flex-1 sm:flex-none px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-green-700 focus:ring-4 focus:ring-green-200 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              GỬI
            </button>
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-8 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-semibold rounded-lg hover:from-gray-600 hover:to-gray-700 focus:ring-4 focus:ring-gray-200 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              HUỶ
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default function OrderPage() {
  const [allOrders, setAllOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [showBankFormForOrder, setShowBankFormForOrder] = useState<string | null>(null)
  const [bankInfo, setBankInfo] = useState({
    bankName: "",
    accountNumber: "",
    accountHolder: "",
    transferImage: "",
  })

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const userId = localStorage.getItem("userId") || ""
      const accessToken = localStorage.getItem("accessToken") || ""
      const res = await getAllOrder(userId, accessToken, 1, 100)
      setAllOrders(res.items)
    } catch (err) {
      toast.error("Không tải được danh sách đơn hàng.")
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
      toast.success("Trạng thái đơn hàng đã được cập nhật thành công!")
      fetchOrders()
    } catch (error) {
      toast.error("Không cập nhật được trạng thái đơn hàng.")
    } finally {
      setSelectedOrderId(null)
    }
  }

  const handleSubmitRefund = async (orderId: string) => {
    const userId = localStorage.getItem("userId") || ""
    const accessToken = localStorage.getItem("accessToken") || ""

    if (!bankInfo.transferImage) {
      toast.error("Vui lòng tải ảnh.")
      return
    }

    try {
      await codManualRefund(bankInfo, orderId, userId, accessToken)
      toast.success("Yêu cầu thanh toán đã được gửi.")
      setShowBankFormForOrder(null)
      setBankInfo({
        bankName: "",
        accountNumber: "",
        accountHolder: "",
        transferImage: "",
      })
      fetchOrders()
    } catch {
      toast.error("Không thể gửi thanh toán.")
    }
  }

  const isBeforeDelivered = (status: OrderStatus) => {
    return (
      [
        OrderStatus.PENDING,
        OrderStatus.AWAITING_PAYMENT,
        OrderStatus.PROCESSING,
        OrderStatus.READY_TO_SHIP,
        OrderStatus.IN_TRANSIT,
      ] as OrderStatus[]
    ).includes(status)
  }

  const statusTabs = ["ALL", ...Object.values(OrderStatus)] as string[]

  const renderOrderCard = (order: Order) => (
    <div key={order.id} className="rounded-lg border p-4 mb-4 bg-white dark:bg-muted">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="space-y-1 text-sm">
          <p><strong>Mã đơn hàng:</strong> {order.id}</p>
          <p><strong>Ngày đặt hàng:</strong> {new Date(order.createdAt).toLocaleString()}</p>
          <p><strong>Loại vận chuyển:</strong> {order.deliveryMethod}</p>
        </div>

        <div className="flex flex-col gap-1 text-sm text-right">
          <span className={`px-3 py-1 rounded-full font-medium ${statusBadge[order.status as OrderStatus]}`}>
            {ORDER_STATUS_LABELS[order.status]}
          </span>
          <span className="font-semibold text-lg">Price: {order.totalPrice.toLocaleString()} ₫</span>
        </div>
      </div>

      <div className="divide-y mt-4">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-4 py-2">
            <img src={item.image} alt={item.productName} className="w-12 h-12 object-cover rounded border" />
            <div className="flex-1 text-sm">
              <p className="font-medium">{item.productName}</p>
              <p className="text-muted-foreground">Số lượng: {item.quantity}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-end gap-2 pt-4">
        <div className="space-y-1 text-sm">
          <p><strong>Phương thức thanh toán:</strong> {PAYMENT_METHOD_LABELS[order.paymentMethod as PaymentMethod]}</p>
          <p>
            <span className={`inline-block px-2 py-1 rounded ${PAYMENT_STATUS_BADGE[order.paymentStatus as PaymentStatus]}`}>
              {PAYMENT_STATUS_LABELS[order.paymentStatus as PaymentStatus]}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/dashboard/orders/${order.id}`}>
            <button className="px-3 py-1 text-sm rounded bg-blue-100 text-blue-800 hover:bg-blue-200 transition">Chi tiết</button>
          </Link>
          {isUpdatableStatus(order.status as OrderStatus) && (
            <button
              onClick={() => setSelectedOrderId(order.id)}
              className="px-3 py-1 text-sm rounded bg-gray-100 text-gray-800 hover:bg-gray-200 transition"
            >
              Cập nhật
            </button>
          )}

          {isBeforeDelivered(order.status as OrderStatus) &&
            order.paymentMethod === "COD" &&
            order.paymentStatus === "PENDING" && (
              <button
                onClick={() => setShowBankFormForOrder(order.id)}
                className="px-3 py-1 text-sm rounded bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition"
              >
                Xác nhận
              </button>
            )}

        </div>
      </div>

      {selectedOrderId === order.id && (
        <div className="mt-3 bg-gray-50 border rounded p-3 text-sm">
          <p>Bạn có muốn cập nhật trạng thái đơn hàng không?</p>
          <div className="flex gap-2 mt-2">
            <button onClick={confirmEdit} className="px-3 py-1 rounded bg-green-100 text-green-800 hover:bg-green-200">Xác nhận</button>
            <button onClick={() => setSelectedOrderId(null)} className="px-3 py-1 rounded bg-red-100 text-red-800 hover:bg-red-200">Huỷ</button>
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
      <h1 className="text-xl font-semibold mb-4">Danh sách đơn hàng</h1>
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

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showBankFormForOrder !== null}
        onClose={() => {
          setShowBankFormForOrder(null)
          setBankInfo({
            bankName: "",
            accountNumber: "",
            accountHolder: "",
            transferImage: "",
          })
        }}
        orderId={showBankFormForOrder || ""}
        bankInfo={bankInfo}
        setBankInfo={setBankInfo}
        onSubmit={handleSubmitRefund}
      />
    </div>
  )
}