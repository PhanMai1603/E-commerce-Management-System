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
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  COMPLETED: "Completed",
  FAILED: "Failed",
  NOT_RETURNED: "Not Returned",
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
        toast.error("Failed to fetch refund detail")
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
          <p className="text-lg text-gray-600">Loading information...</p>
        </div>
      </div>
    )
  }

  if (!refund) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <p className="text-xl text-red-600 font-medium">Refund request not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 mb-6"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Refund Details</h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">ID: {refund.id}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${STATUS_BADGE[refund.status]}`}>
                {STATUS_LABELS[refund.status] || refund.status}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Refund Information */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Refund Information
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Refund Amount</label>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {refund.amount.toLocaleString()}₫
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Payment Method</label>
                      <p className="text-sm text-gray-900 dark:text-white font-medium">{refund.paymentMethod}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Transaction ID</label>
                      <p className="text-sm text-gray-900 dark:text-white font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        {refund.paymentTransactionId}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Manual Processing</label>
                      <p className="text-sm">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${refund.manualRequired
                            ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
                            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                          }`}>
                          {refund.manualRequired ? "Required" : "Not Required"}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Information */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Refunded Product
                </h2>
              </div>
              <div className="p-6">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <img
                      src={refund.item.image}
                      alt={refund.item.productName}
                      className="w-20 h-20 object-cover rounded-xl border-2 border-gray-200 dark:border-gray-600"
                    />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {refund.item.productName}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{refund.item.variantName}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Quantity:</span>
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm font-medium">
                          {refund.item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Refund Reason */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                  Refund Reason
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Main Reason</label>
                  <p className="mt-1 text-gray-900 dark:text-white font-medium">{refund.reason}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Detailed Description</label>
                  <p className="mt-1 text-gray-700 dark:text-gray-300 leading-relaxed">{refund.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Order Information */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                  Order Information
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Order ID</label>
                  <p className="text-sm font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded mt-1">
                    {refund.order.id}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Order Status</label>
                  <p className="text-sm text-gray-900 dark:text-white font-medium mt-1">{refund.order.status}</p>
                </div>
              </div>
            </div>

            {/* Processing Information */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
                  Processing Information
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Processed By</label>
                  <div className="mt-2 flex items-center gap-3">
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
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                  Processing Timeline
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Refund Requested</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(refund.requestedAt).toLocaleString('en-US')}
                      </p>
                    </div>
                  </div>

                  {refund.approvedAt && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Approved</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(refund.approvedAt).toLocaleString('en-US')}
                        </p>
                      </div>
                    </div>
                  )}

                  {refund.rejectedAt && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Rejected</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(refund.rejectedAt).toLocaleString('en-US')}
                        </p>
                      </div>
                    </div>
                  )}

                  {refund.completedAt && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Completed</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(refund.completedAt).toLocaleString('en-US')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}