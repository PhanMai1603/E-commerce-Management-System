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
    admin:{
        name:string,
        email:string,
    }
    approvedAt:string,
    rejectedAt:string,
    completedAt:string,
    requestedAt:string,
    isManualRequired: boolean,
}

export interface RefundDataDetail {
    id: string,
    orderId: string,
    amount: number,
    status: string,
    paymentTransactionId: string,
    item: {
        productName: string,
        variantName: string,
    }
    reason: string,
    description: string,
    requestedAt: string,
    approvedAt: string,
    completedAt: string,
    admin: string,
}

export interface ConfirmRequest{
    refundLogIds: string[],
    isCash:boolean,
}