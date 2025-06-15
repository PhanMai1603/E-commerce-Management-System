"use client"

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { toast } from "react-toastify"
import { Refund, RefundData } from "@/interface/refund"
import { getRefund, approveRequest, rejectRequest } from "@/app/api/refund"
import { useRouter } from "next/navigation"

const statusTabs = [
  { label: "Tất cả", value: "ALL" },
  { label: "Đang chờ duyệt", value: "PENDING" },
  { label: "Đã phê duyệt", value: "APPROVED" },
  { label: "Đã từ chối", value: "REJECTED" },
  { label: "Hoàn thành", value: "COMPLETED" },
]

const STATUS_BADGE: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-blue-100 text-blue-800",
  REJECTED: "bg-red-100 text-red-800",
  COMPLETED: "bg-green-100 text-green-800",
}

const STATUS_TEXT: Record<string, string> = {
  PENDING: "Đang chờ duyệt",
  APPROVED: "Đã phê duyệt",
  REJECTED: "Đã từ chối",
  COMPLETED: "Hoàn thành",
}

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
const ORDER_STATUS_BADGE: Record<string, string> = {
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

const RefundPage = () => {
  const [refunds, setRefunds] = useState<Refund[]>([])
  const [loading, setLoading] = useState(true)

  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [approveModalOpen, setApproveModalOpen] = useState(false)
  const [selectedRequests, setSelectedRequests] = useState<Refund["refundRequests"]>([])
  const [rejectReason, setRejectReason] = useState("")

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : ""
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : ""
  const router = useRouter()

  useEffect(() => {
    if (!userId || !accessToken) return

    const fetchRefunds = async () => {
      try {
        const data: RefundData = await getRefund(userId, accessToken)
        setRefunds(data.items)
      } catch (error) {
        toast.error("Không thể tải yêu cầu hoàn tiền")
      } finally {
        setLoading(false)
      }
    }

    fetchRefunds()
  }, [userId, accessToken])

  const refreshData = async () => {
    const data: RefundData = await getRefund(userId, accessToken)
    setRefunds(data.items)
  }

  const handleView = (id: string) => {
    router.push(`/dashboard/refund/${id}`)
  }

  const handleEdit = (id: string) => {
    router.push(`/dashboard/refund/${id}/edit`)
  }

  const renderCardList = (filtered: Refund[]) => {
    if (filtered.length === 0)
      return <p className="mt-4">Không có yêu cầu hoàn tiền nào.</p>

    return (
      <div className="space-y-4 mt-4">
        {filtered.map((refund) => {
          const hasPending = refund.refundRequests.some((r) => r.status === "PENDING")

          return (
            <div key={refund.orderId} className="border rounded-lg p-4 shadow-sm bg-white dark:bg-muted">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm font-medium">
                    <span className="text-gray-500">Mã đơn hàng:</span> {refund.orderId}
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-500">Phương thức thanh toán:</span> {refund.paymentMethod}
                  </p>
                </div>
                <div className="text-right">

                <span className={`px-2 py-1 text-xs rounded font-medium ${ORDER_STATUS_BADGE[refund.orderStatus] || "bg-gray-100 text-gray-800"}`}>
  {ORDER_STATUS_LABELS[refund.orderStatus] || refund.orderStatus}
</span>


                  <p className="text-base font-semibold text-green-600 mt-1">
                    Tổng hoàn: {refund.totalRefundAmount.toLocaleString()}₫
                  </p>
                </div>
              </div>

              <div className="divide-y">
                {refund.refundRequests.map((req) => (
                  <div key={req.id} className="flex gap-3 py-3">
                    <img
                      src={req.item.image}
                      alt={req.item.productName}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1 text-sm">
                      <p className="font-medium">{req.item.productName}</p>
                      <p className="text-gray-600">{req.item.variantName}</p>
                      <p>Số lượng: {req.item.quantity}</p>
                      <p>Lý do: {req.reason}</p>
                      <p>
                        Trạng thái:{" "}
                        <span className={`ml-1 px-2 py-0.5 text-xs rounded ${STATUS_BADGE[req.status] || "bg-gray-100 text-gray-800"}`}>
                          {STATUS_TEXT[req.status] || req.status}
                        </span>
                      </p>
                    </div>
                    <div className="flex items-start">
                      <button
                        className="px-4 py-1 text-sm rounded bg-blue-100 text-blue-800 hover:bg-blue-200"
                        onClick={() => handleView(req.id)}
                      >
                        Chi tiết
                      </button>
                    </div>

                    {req.status === "APPROVED" && (
                      <div className="flex items-start">
                        <button
                          className="px-4 py-1 text-sm rounded bg-gray-100 text-gray-800 hover:bg-gray-200"
                          onClick={() => handleEdit(req.id)}
                        >
                          Xác nhận
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {hasPending && (
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    className="px-4 py-1 text-sm rounded bg-black text-white hover:bg-slate-800"
                    onClick={() => {
                      setSelectedRequests(refund.refundRequests)
                      setApproveModalOpen(true)
                    }}
                  >
                    Duyệt
                  </button>
                  <button
                    className="px-4 py-1 text-sm rounded bg-[#DC143C] text-white hover:bg-red-800"
                    onClick={() => {
                      setSelectedRequests(refund.refundRequests)
                      setRejectModalOpen(true)
                    }}
                  >
                    Từ chối
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Yêu cầu hoàn tiền</h1>

      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <Tabs defaultValue="ALL" className="w-full">
          <TabsList className="w-full h-14 overflow-x-auto whitespace-nowrap rounded-lg bg-gray-100 dark:bg-gray-800 p-2">
            {statusTabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {statusTabs.map((tab) => {
            const filtered =
              tab.value === "ALL"
                ? refunds
                : refunds.filter((r) =>
                    r.refundRequests.some((req) => req.status === tab.value)
                  )

            return (
              <TabsContent key={tab.value} value={tab.value}>
                {renderCardList(filtered)}
              </TabsContent>
            )
          })}
        </Tabs>
      )}

      {/* Approve Modal */}
      {approveModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-muted p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4">Xác nhận duyệt</h2>
            <p>Bạn có chắc chắn muốn duyệt tất cả yêu cầu hoàn tiền của đơn hàng này?</p>
            <div className="flex justify-end gap-2 mt-4">
              <button className="px-4 py-1 text-sm rounded bg-gray-200" onClick={() => setApproveModalOpen(false)}>
                Hủy
              </button>
              <button
                className="px-4 py-1 text-sm rounded bg-black text-white"
                onClick={async () => {
                  for (const req of selectedRequests) {
                    if (req.status === "PENDING") {
                      await approveRequest(req.id, userId, accessToken)
                    }
                  }
                  toast.success("Đã duyệt yêu cầu hoàn tiền thành công!")
                  setApproveModalOpen(false)
                  await refreshData()
                }}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-muted p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4">Từ chối yêu cầu</h2>
            <label className="text-sm mb-2 block">Lý do từ chối:</label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              className="w-full border rounded px-2 py-1 text-sm"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button className="px-4 py-1 text-sm rounded bg-gray-200" onClick={() => setRejectModalOpen(false)}>
                Hủy
              </button>
              <button
                className="px-4 py-1 text-sm rounded bg-red-700 text-white"
                onClick={async () => {
                  if (!rejectReason.trim()) {
                    toast.warning("Vui lòng nhập lý do.")
                    return
                  }
                  for (const req of selectedRequests) {
                    if (req.status === "PENDING") {
                      await rejectRequest({ rejectReason: rejectReason.trim() }, req.id, userId, accessToken)
                    }
                  }
                  toast.success("Đã từ chối tất cả yêu cầu thành công!")
                  setRejectModalOpen(false)
                  setRejectReason("")
                  await refreshData()
                }}
              >
                Gửi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RefundPage
