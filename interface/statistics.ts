export interface Sales{
    orderCount: number;  
    productCount: number;
    userCount: number;
    soldProduct: number;
}


export interface DoanhThu {
  _id: string;
  totalRevenue: number;
  totalOrders: number;
}

export interface OrderRecords{
    totalRevenue: number,
    totalOrders: number,
    orderStatusCounts: {
        PENDING: number,
        AWAITING_PAYMENT: number,
        PROCESSING: number,
        READY_TO_SHIP: number,
        IN_TRANSIT: number,
        DELIVERED: number,
        CANCELLED: number,
        DELIVERY_FAILED: number,
        RETURN: number,
    }
}

export interface CategoryRevenue {
  id: string;
  name: string;
  parentId: string | null;
  totalRevenue: number;
  totalOrders: number;
  children: CategoryRevenue[];
}

export interface BestSellerProduct {
  totalQuantitySold: number;
  totalRevenue: number;
  productId: string;
  productName: string;
  mainImage: string;
  variantName?: string;
}

export interface BestSellerMetadata {
  total: number;
  totalPages: number;
  page: number;
  size: number;
  hasMore: boolean;
  items: BestSellerProduct[];
}

export interface ReturnRateProduct {
  productId: string;
  productName: string;
  mainImage: string;
  totalSold: number;
  totalReturned: number;
  returnRate: number; // Tỷ lệ hoàn trả, có thể là số nguyên hoặc số thập phân
}

export interface ReturnRateMetadata {
  total: number;
  totalPages: number;
  page: number;
  size: number;
  hasMore: boolean;
  items: ReturnRateProduct[];
}

export interface ReviewStat {
  _id: string;      // Ngày theo định dạng YYYY-MM-DD
  count: number;    // Số lượng đánh giá trong ngày đó
}

export interface ReviewStatisticsMetadata {
  reviewStats: ReviewStat[];
  reportStats: number,           // Mảng trống hiện tại, có thể thay bằng kiểu cụ thể nếu có dữ liệu
  worstRatedProducts: number,    // Mảng trống hiện tại, có thể thay bằng kiểu cụ thể nếu có dữ liệu
}

