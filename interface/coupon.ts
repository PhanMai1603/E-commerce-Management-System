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
    total: number; // Sửa lại tên cho rõ ràng
    totalPages: number; 
    page: number;
    size: number;
    hasMore: boolean;
    items: GetAllCoupon[];
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
//detail
export interface GetCouponResponse {
    coupon: Coupon;
    targets: TargetPagination;
}

export interface Coupon {
  id: string;
  name: string;
  code: string;
  description?: string;
  startDate: string; // ISO date string
  endDate: string;   // ISO date string
  type: "PERCENT" | "AMOUNT"; // loại giảm giá
  value: number;
  minValue: number;
  maxValue: number;
  maxUses: number;
  maxUsesPerUser: number;
  targetType: "Order" | "Delivery" | "Product" |"Category"; // mục tiêu áp dụng
  targetIds: string[];
  usesCount: number;
  usersUsed: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TargetPagination {
  total: number;
  totalPages: number;
  page: number;
  size: number;
  hasMore: boolean;
  items: TargetItem[];
}

export interface TargetItem {
  id: string;
  code: string;
  name: string;
  mainImage?: string;
}
