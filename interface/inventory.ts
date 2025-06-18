export interface InventoryResponse {
    total: string,
    totalPages: string,
    page: string,
    size: string, 
    hasMore: boolean,
    items: Inventory []
}

export interface Inventory{
    id: string,
    importCode: string,
    batchCode: string,
    supplier: string,
    totalImportPrice:number,
    totalQuantity: string,
    note: string,
    createdBy: {
        id: string, 
        name: string,
        avatar: string,
    }
    updatedBy: {
        id: string,
        name: string,
        avatar: string,
    }
    createdAt: string,
    updatedAt: string
}

//getDetail

export interface InventoryDetailResponse{
    id: string,
    importCode: string,
    items:InventoryDetail[],
    batchCode: string,
    supplier: string,
    totalImportPrice: string,
    totalQuantity: string,
    note: string,
    createdBy: {
        id: string, 
        name: string,
        avatar: string,
    }
    updatedBy: {
        id: string,
        name: string,
        avatar: string,
    }
    createdAt: string,
    updatedAt: string
}

export interface InventoryDetail{
    productId: {
        id: string,
        image: string
    }
    productName: string,
    variantId: string,
    variantSlug: string,
    quantity: number,
    importPrice: number,
}

//create
export interface ImportRequest {
  batchCode?: string; // Có thể truyền hoặc để backend tự tạo
  supplier: string;
  note?: string;
  items: ImportItem[];
}

export interface ImportItem {
  productKey: string;

  // Trường hợp có danh sách variant
  skuList?: VariantImport[];

  // Trường hợp không có variant
  quantity?: number;
  importPrice?: number;
}

export interface VariantImport {
  variantId: string;
  quantity: number;
  importPrice: number;
}


export interface ImportResponse {
  id: string;
  importCode: string;
  items: ImportedItem[];
  batchCode: string;
  supplier: string;
  totalImportPrice: number;
  totalQuantity: number;
  note?: string;
  createdAt: string; // ISO Date string
}

export interface ImportedItem {
  productId: string;
  productName: string;
  variantId: string | null;
  variantSlug: string | null;
  quantity: number;
  importPrice: number;
}


export type DiscountType = "PERCENT" | "AMOUNT"; // hoặc enum nếu cần

export interface Promotion{
  discountType: DiscountType;      // Loại giảm giá: phần trăm hoặc cố định
  discountValue: number;           // Giá trị giảm giá (ví dụ 20%)
  startDate: string;               // Ngày bắt đầu (ISO string)
  endDate: string;                 // Ngày kết thúc (ISO string)
  note: string;                    // Ghi chú cho chương trình khuyến mãi
  productIds: string[];            // Danh sách ID sản phẩm áp dụng
  categoryIds: string[];           // Danh sách ID danh mục áp dụng
}

export interface PromotionItem {
  productId: string;
  productName: string;
  productImage: string | null;
}

export interface PromotionCategory {
  categoryId: string;
  categoryName: string;
}

export type PromotionStatus = "ACTIVE" | "EXPIRED" | "CANCELLED"; // có thể mở rộng tùy hệ thống

export interface PromotionMetadata {
  id: string;
  code: string;
  type: DiscountType;
  status: PromotionStatus;
  items: PromotionItem[];
  categories: PromotionCategory[];
  discountType: DiscountType;
  discountValue: number;
  discountStart: string;   // ISO date string
  discountEnd: string;     // ISO date string
  note: string;
  createdAt: string;       // ISO date string
}


//

export interface PromotionUser {
  id: string;
  name: string;
  avatar: string;
}

export interface PromotionListItem {
  id: string;
  code: string;
  type: DiscountType;
  discountType: DiscountType;
  discountValue: number;
  discountStart: string; // ISO date
  discountEnd: string;   // ISO date
  createdBy: PromotionUser;
  updatedBy: PromotionUser;
  createdAt: string;     // ISO date
  updatedAt: string;     // ISO date
}

export interface PromotionListMetadata {
  total: number;
  totalPages: number;
  page: number;
  size: number;
  hasMore: boolean;
  items: PromotionListItem[];
}

//detail

export interface PromotionUser {
  id: string;
  name: string;
  avatar: string;
}

export interface PromotionProduct {
  productId: string;
  productName: string;
  productImage: string | null;
}

export interface PromotionCategory {
  categoryId: string;
  categoryName: string;
}

export interface PromotionDetail {
  id: string;
  code: string;
  type: DiscountType;
  status: PromotionStatus;
  items: PromotionProduct[];
  categories: PromotionCategory[];
  discountType: DiscountType;
  discountValue: number;
  discountStart: string;    // ISO date
  discountEnd: string;      // ISO date
  note: string;
  createdBy: PromotionUser;
  updatedBy: PromotionUser;
  createdAt: string;        // ISO date
  updatedAt: string;        // ISO date
}
