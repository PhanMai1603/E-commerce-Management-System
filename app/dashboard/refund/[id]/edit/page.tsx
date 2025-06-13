/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { confirmRequest } from "@/app/api/refund";
import { getPayment, manualRefund } from "@/app/api/payment";
import type { ConfirmRequest, ConfirmRequestResponse } from "@/interface/refund";
import type { PaymentResponse, Bank } from "@/interface/payment";
import { uploadTransfer } from "@/app/api/upload";

export default function ConfirmRefundPage() {
  const { id: refundLogId } = useParams() as { id: string };
  const router = useRouter();

  const [isCash, setIsCash] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ConfirmRequestResponse | null>(null);
  const [paymentDetail, setPaymentDetail] = useState<PaymentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [bankInfo, setBankInfo] = useState<Bank>({
    bankName: "",
    accountNumber: "",
    accountHolder: "",
    transferImage: ""
  });
  const [isManualRefunded, setIsManualRefunded] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const uid = localStorage.getItem("userId");
    if (token && uid) {
      setAccessToken(token);
      setUserId(uid);
    } else {
      setError("Không tìm thấy thông tin đăng nhập.");
    }
  }, []);

  const handleConfirm = async () => {
    if (!refundLogId || !userId || !accessToken) {
      setError("Thiếu thông tin cần thiết.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const data: ConfirmRequest = {
      refundLogIds: [refundLogId],
      isCash,
    };

    try {
      const response = await confirmRequest(data, userId, accessToken);
      setResult(response);

      if (!isCash && response.refundResult?.refundTransaction?.id) {
        const transactionId = response.refundResult.refundTransaction.id;
        const paymentRes = await getPayment(transactionId, userId, accessToken);
        setPaymentDetail(paymentRes);
      }
    } catch (err: any) {
      setError(err.message || "Lỗi không xác định.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualRefund = async () => {
    if (!paymentDetail) return;
    try {
      setIsLoading(true);
      await manualRefund(bankInfo, paymentDetail.transactionId, userId, accessToken);
      setIsManualRefunded(true);
    } catch (err: any) {
      setError(err.message || "Gửi hoàn tiền ngân hàng thất bại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Refund confirmation</h1>
              <p className="text-sm text-gray-500 mt-1">
                Refund request code: <span className="font-mono bg-gray-100 px-2 py-1 rounded text-gray-800">{refundLogId}</span>
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Processing</span>
            </div>
          </div>
        </div>

        {!result && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Select refund method</h2>

            <div className="space-y-4">
              <div
                className={`relative rounded-lg border-2 p-4 cursor-pointer transition-all ${!isCash
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                onClick={() => setIsCash(false)}
              >
                <div className="flex items-start space-x-3">
                  <input
                    type="radio"
                    name="refundType"
                    value="bank"
                    checked={!isCash}
                    onChange={() => setIsCash(false)}
                    className="mt-1 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      <span className="text-lg font-medium text-gray-900">Refund Via Bank</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Money will be transferred directly to your bank account.</p>
                  </div>
                </div>
              </div>

              <div
                className={`relative rounded-lg border-2 p-4 cursor-pointer transition-all ${isCash
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                onClick={() => setIsCash(true)}
              >
                <div className="flex items-start space-x-3">
                  <input
                    type="radio"
                    name="refundType"
                    value="cash"
                    checked={isCash}
                    onChange={() => setIsCash(true)}
                    className="mt-1 text-green-600 focus:ring-green-500"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span className="text-lg font-medium text-gray-900">Cash Refund</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Cash Back In Store</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleConfirm}
                disabled={isLoading || !accessToken}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Xác nhận hoàn tiền"
                )}
              </button>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Success Result */}
        {result && (
          <div className="space-y-6">
            {/* Success Header */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h2 className="text-2xl font-bold text-green-800">  </h2>
                  <p className="text-green-600 mt-1">Yêu cầu hoàn tiền của bạn đã được xử lý thành công</p>
                </div>
              </div>
            </div>

            {/* Order Information */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin đơn hàng</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Mã đơn hàng</p>
                  <p className="font-mono text-lg font-semibold text-gray-900">{result.orderId}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Số tiền hoàn</p>
                  <p className="text-lg font-semibold text-green-600">{result.totalRefundAmount.toLocaleString()}₫</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Trạng thái</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {result.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Bank Information */}
            {paymentDetail && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin giao dịch ngân hàng</h3>

                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">ID giao dịch:</span>
                      <span className="ml-2 font-mono text-gray-900">{paymentDetail.transactionId}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Phương thức:</span>
                      <span className="ml-2 text-gray-900">{paymentDetail.paymentMethod}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Số tiền:</span>
                      <span className="ml-2 font-semibold text-blue-600">{paymentDetail.amount.toLocaleString()}₫</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Trạng thái:</span>
                      <span className="ml-2 text-gray-900">{paymentDetail.status}</span>
                    </div>
                    <div className="md:col-span-2">
                      <span className="font-medium text-gray-700">Hoàn thành:</span>
                      <span className="ml-2 text-gray-900">{new Date(paymentDetail.completedAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Bank Form */}
                <div className="border-t pt-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Refunded bank information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tên ngân hàng</label>
                      <input
                        type="text"
                        placeholder="VD: Vietcombank, BIDV, Techcombank..."
                        value={bankInfo.bankName}
                        onChange={(e) => setBankInfo({ ...bankInfo, bankName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Số tài khoản</label>
                      <input
                        type="text"
                        placeholder="Nhập số tài khoản ngân hàng"
                        value={bankInfo.accountNumber}
                        onChange={(e) => setBankInfo({ ...bankInfo, accountNumber: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Chủ tài khoản</label>
                      <input
                        type="text"
                        placeholder="Tên chủ tài khoản"
                        value={bankInfo.accountHolder}
                        onChange={(e) => setBankInfo({ ...bankInfo, accountHolder: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ảnh chuyển khoản</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          try {
                            setIsLoading(true); // hiển thị loading nếu muốn
                            const imageUrl = await uploadTransfer(file, userId, accessToken);
                            setBankInfo((prev) => ({ ...prev, transferImage: imageUrl }));
                          } catch (err: any) {
                            setError(err.message || "Upload ảnh thất bại.");
                          } finally {
                            setIsLoading(false);
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {bankInfo.transferImage && (
                        <div className="mt-2">
                          <img
                            src={bankInfo.transferImage}
                            alt="Ảnh chuyển khoản"
                            className="w-40 h-auto rounded border"
                          />
                        </div>
                      )}

                    </div>
                  </div>

                  <div className="mt-6">
                    {!isManualRefunded ? (
                      <button
                        onClick={handleManualRefund}
                        disabled={isLoading}
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {isLoading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Đang gửi...
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                            Gửi thông tin & Hoàn tiền
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <p className="text-green-800 font-semibold">Đã gửi hoàn tiền ngân hàng thành công!</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Cash Refund Notice */}
            {!paymentDetail && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h4 className="text-lg font-medium text-blue-800">Giao dịch hoàn tiền đã xác nhận</h4>
                    <p className="text-blue-600 mt-1">Hoàn tiền bằng tiền mặt hoặc không cần qua ngân hàng</p>
                  </div>
                </div>
              </div>
            )}

            {/* Back Button */}
            <div className="flex justify-center pt-6 border-t">
              <button
                onClick={() => router.push("/dashboard/refund")}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl border border-gray-300 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Quay lại danh sách hoàn tiền</span>
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}