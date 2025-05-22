export interface GetAllCoupon {
    id: string;
    name: string;
    code: string;
    startDate: string; // Hoặc Date nếu cần
    endDate: string; // Hoặc Date nếu cần
    type: "PERCENT" | "AMOUNT"; // Nếu có nhiều loại
    value: number;
    targetType: "Order" | "Delivery" | "Product" | "Category"; // Nếu có nhiều loại
    isActive: boolean;
}

export interface getAllCouponsResponse {
    totalCoupons: number; // Sửa lại tên cho rõ ràng
    totalPages: number; 
    currentPage: number;
    coupons: GetAllCoupon[];
}

export interface CouponData {
    name: string;
    code: string;
    description: string;
    startDate: string;
    endDate: string;
    type: "PERCENT" | "AMOUNT";
    value: number ;
    minValue: number;
    maxValue: number;
    maxUses: number;
    maxUsesPerUser: number;
    targetType: "Order" | "Delivery" | "Product" |"Category";
    targetIds: string[];
  }

  export interface CouponDataResponse {
    name: string;
    code: string;
    description: string;
    startDate: string; // Date in ISO format
    endDate: string; // Date in ISO format
    type: "PERCENT" | "AMOUNT";
    value: number;
    minValue: number;
    maxValue: number;
    maxUses: number;
    maxUsesPerUser: number;
    targetType: "Order" | "Delivery" | "Product" |"Category";
    targetIds: string[]; // Array of target IDs
    isActive: boolean;
}
