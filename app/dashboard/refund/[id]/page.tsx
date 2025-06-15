/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getRefundDetail } from "@/app/api/refund"
import { RefundDataDetail } from "@/interface/refund"
import { toast } from "react-toastify"

const STATUS_BADGE: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 border border-yellow-200",
  APPROVED: "bg-blue-100 text-blue-800 border border-blue-200",
  REJECTED: "bg-red-100 text-red-800 border border-red-200",
  COMPLETED: "bg-green-100 text-green-800 border border-green-200",
  FAILED: "bg-gray-100 text-gray-800 border border-gray-200",
  NOT_RETURNED: "bg-purple-100 text-purple-800 border border-purple-200",
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Đang chờ xử lý",
  APPROVED: "Đã chấp thuận",
  REJECTED: "Đã từ chối",
  COMPLETED: "Đã hoàn tất",
  FAILED: "Thất bại",
  NOT_RETURNED: "Chưa hoàn hàng",
}

export default function RefundDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [refund, setRefund] = useState<RefundDataDetail | null>(null)
  const [loading, setLoading] = useState(true)

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : ""
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : ""

  useEffect(() => {
    if (!id || !userId || !accessToken) return

    const fetchDetail = async () => {
      try {
        const data = await getRefundDetail(id as string, userId, accessToken)
        setRefund(data)
      } catch (err) {
        toast.error("Không thể tải chi tiết yêu cầu hoàn tiền")
      } finally {
        setLoading(false)
      }
    }

    fetchDetail()
  }, [id, userId, accessToken])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    )
  }

  if (!refund) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <p className="text-xl text-red-600 font-medium">Không tìm thấy yêu cầu hoàn tiền</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 mb-6"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Chi tiết hoàn tiền</h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Mã yêu cầu: {refund.id}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${STATUS_BADGE[refund.status]}`}>
                {STATUS_LABELS[refund.status] || refund.status}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Refund Information */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Thông tin hoàn tiền</h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Số tiền hoàn</label>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {refund.amount.toLocaleString("vi-VN")}₫
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Phương thức thanh toán</label>
                  <p className="text-sm text-gray-900 dark:text-white font-medium">{refund.paymentMethod}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Mã giao dịch</label>
                  <p className="text-sm font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded mt-1">
                    {refund.paymentTransactionId}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Xử lý thủ công</label>
                  <p className="text-sm mt-1">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${refund.manualRequired
                        ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      }`}>
                      {refund.manualRequired ? "Cần xử lý thủ công" : "Không cần"}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Product */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Sản phẩm đã hoàn</h2>
              </div>
              <div className="p-6 flex items-start gap-6">
                <img
                  src={refund.item.image}
                  alt={refund.item.productName}
                  className="w-20 h-20 object-cover rounded-xl border-2 border-gray-200 dark:border-gray-600"
                />
                <div className="flex-1 space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{refund.item.productName}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{refund.item.variantName}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Số lượng: {refund.item.quantity}</p>
                </div>
              </div>
            </div>

            {/* Reason */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Lý do hoàn tiền</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Lý do chính</label>
                  <p className="mt-1 text-gray-900 dark:text-white font-medium">{refund.reason}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Mô tả chi tiết</label>
                  <p className="mt-1 text-gray-700 dark:text-gray-300 leading-relaxed">{refund.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Info */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Thông tin đơn hàng</h2>
              </div>
              <div className="p-6 space-y-2">
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Mã đơn hàng</label>
                  <p className="text-sm font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded mt-1">
                    {refund.order.id}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Trạng thái</label>
                  <p className="text-sm text-gray-900 dark:text-white mt-1">{refund.order.status}</p>
                </div>
              </div>
            </div>

            {/* Admin Info */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Người xử lý</h2>
              </div>
              <div className="p-6 flex gap-3 items-start">
                <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                    {refund.admin.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{refund.admin.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{refund.admin.email}</p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Tiến trình xử lý</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Yêu cầu hoàn tiền</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(refund.requestedAt).toLocaleString('vi-VN')}
                  </p>
                </div>

                {refund.approvedAt && (
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Đã chấp thuận</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(refund.approvedAt).toLocaleString('vi-VN')}
                    </p>
                  </div>
                )}

                {refund.rejectedAt && (
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Đã từ chối</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(refund.rejectedAt).toLocaleString('vi-VN')}
                    </p>
                  </div>
                )}

                {refund.completedAt && (
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Đã hoàn tất</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(refund.completedAt).toLocaleString('vi-VN')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
