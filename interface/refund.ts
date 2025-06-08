/* eslint-disable @typescript-eslint/no-explicit-any */
export interface RefundResponse{
    refundLogId: string,
    status: string,
    approvedAt: string,
}

export interface RejectReason{
    rejectReason: string,
}
export interface RejectReasonResponse{
    refundLogId: string,
    status: string,
}
export interface RefundData{
    total: number,
    totalPages: number,
    page: number,
    size: number,
    hasMore: boolean,
    items: Refund[],
}

export interface Refund{
    orderId: string,
    paymentMethod: string,
    orderStatus: string,
    totalRefundAmount: number,
    refundRequests:RefundRequest[],
}

export interface RefundRequest{
    id: string,
    amount: number,
    status: string,
    reason:string,
    description: string,
    item :{
        productId:string,
        productName:string,
        variantId: string,
        variantName: string,
        image:string,
        quantity: number,
    }
    admin: string,
    approvedAt:string,
    rejectedAt:string,
    completedAt:string,
    requestedAt:string,
    isManualRequired: boolean,
}

export interface RefundDataDetail {
    id: string,
    order: {
        id: string;
        status: string;
    }
    paymentTransactionId: string,
    amount: number,
    paymentMethod: string,
    status: string,
    reason: string,
    description: string,
    item:{
        productId: string,
        productName: string,
        variantId: string,
        variantName: string,
        image: string,
        quantity: string,
    }
    admin: {
        id: string,
        name: string, 
        email: string,
    }
    manualRequired: boolean,
    requestedAt: string,
    approvedAt: string,
    rejectedAt: string,
    completedAt: string,
}

export interface ConfirmRequest{
    refundLogIds: string[],
    isCash:boolean,
}

export interface ConfirmRequestResponse {
  orderId: string;
  totalRefundAmount: number;
  refundResult: {
    status: string;
    message: string;
    refundTransaction: {
      id: string;
      orderId: string;
      transactionId: string;
      type: string;
      method: string; // "BANK" | "COD"
      amount: number;
      status: string;
      bankDetails: {
        bankName: string;
        accountNumber: string;
        accountHolder: string;
        transferImage: string;
      } | null; // <-- allow null
      adminId: string;
      admin: Record<string, any>;
      completedAt: string;
      createdAt: string;
      updatedAt: string;
    };
  };
  status: string;
  refundLogIds: string[];
}
