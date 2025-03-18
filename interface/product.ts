export  interface Variant {
    name: string;
    images: string[];
    options: string[];
  }
  
export interface Product {
    id: string;
    code: string;
    name: string;
    slug: string;
    video: string;
    mainImage: string;
    qrCode: string;
    originalPrice: number;
    minPrice: number;
    maxPrice: number;
    discountType: "PERCENT" | "AMOUNT";
    discountValue: number;
    discountStart: string;
    discountEnd: string;
    quantity: number;
    sold: number;
    status: string;//
    rating: number;
    ratingCount: number;
    views: number;
    uniqueViews: string[];
    createdBy: string;
    updatedBy: string;
    returnDays: number;
    variants: Variant[];
  }
  
export interface ProductResponse {
    totalPages: number;
    totalProducts: number;
    currentPage: number;
    products: Product[];
  }
  
  
//Create Product
// Interface cho thuộc tính sản phẩm
export interface ProductAttribute {
  id: string;
  values: string[];
}

// Interface cho danh sách SKU (chỉ dành cho sản phẩm có variant)
export interface ProductSKU {
  tierIndex: number[]; // Chỉ mục của biến thể
  isDefault: boolean;
  price: number;
  quantity: number;
}

// Interface chung cho tất cả sản phẩm
export interface ProductData {
  name: string;
  mainImage: string;
  subImages: string[];
  video: string;
  originalPrice: number;
  description: string;
  category: string[]; // Định dạng đồng nhất
  attributes: ProductAttribute[]; // Định dạng đồng nhất
  returnDays: number;
  variants?: Variant[]; // Chỉ dành cho sản phẩm có variant
  skuList?: ProductSKU[]; // Chỉ dành cho sản phẩm có variant
}

export interface ProductResponse {
  code: string;
}

