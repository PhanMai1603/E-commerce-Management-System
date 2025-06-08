export interface PaymentResponse{
    transactionId: string,
    orderId: string,
    amount: number,
    paymentMethod: string,
    status: string,
    type: string,
    bankDetails:{
        bankName: string,
        accountNumber: string,
        accountHolder: string,
        transferImage: string,
    }
    admin:{
        name: string,
        email: string,
    }
    completedAt: string,
    refundLogs: Refund[]
}

export interface Refund{
    id: string,
    status: string,
    reason: string,
    description: string,
    amount: number,
    item: {
        productId: string,
        productName: string,
        variantId: string,
        variantName: string,
        image: string,
        quantity: number,
    }
}

export interface ManualRefund{
    paymentTransactionId: string,
    totalRefundAmount: number,
    refundStatus: string,
}

export interface Bank{
    bankName:string;
    accountNumber: string;
    accountHolder: string;
    transferImage: string,
}


export interface TransactionResponse{
    total: number,
    totalPages: number,
    page: number,
    size: number,
    hasMore: boolean,
    items: Transaction[],
}

export interface Transaction{
    id: string,
    transactionId: string,
    type: string,
    method: string,
    amount: number,
    status: string,
    adminId: string,
    admin:{
        name: string,
        email: string,
    }
    completedAt: string
}

export interface CODManual{
    id: string;
    orderId: string,
    transactionId: string,
    type: string,
    method: string,
    amount: string,
    status: string,
    bankDetails: string,
    adminId: string,
    admin: string,
    completedAt: string,
    createdAt: string,
    updatedAt: string,
}
