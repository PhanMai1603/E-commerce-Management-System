export interface Variant {
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
  status: string;
  rating: number;
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
  variants?: Variant[];
  skuList?: ProductSKU[];
}

// Interface upload hình ảnh sản phẩm
export interface UploadProduct {
  file: File;
}

export interface ProductDataResponse {
  code: string;
}


export interface PublishProductResponse {
  status: string,
  updatedAt: string,
}

// Interface cho chi tiết sản phẩm
export interface Category {
  id: string;
  name: string;
}

export interface SkuList {
  id: string;
  slug: string;
  tierIndex: number[];
  isDefault: boolean;
  price: number;
  quantity: number;
  sold: number;
  status: string;
  createdBy: string;  
  updatedBy: string;
}

// Interface for Product Detail Response
export interface ProductDetail{
  id: string;
  code: string;
  name: string;
  slug: string;
  description: string;
  video: string;
  mainImage: string;
  subImages: string[];
  qrCode: string;
  originalPrice: number;
  minPrice: number;
  maxPrice: number;
  discountType: "PERCENT" | "AMOUNT";
  discountValue: number;
  discountStart: string | null;
  discountEnd: string | null;
  quantity: number;
  sold: number;
  category: Category[];
  attributes: Attribute[];
  status: string;
  rating: number;
  ratingCount: number;
  views: number;
  uniqueViews: string[];
  createdBy: string;
  updatedBy: string;
  returnDays: number;
  variants?: Variant[];
  variantAttributes?: Attribute[];
  price: number;
  discountedPrice: number | null;
  hasDiscount: boolean;
}

export interface UpdateSkuList {
  tierIndex: number[];
  price: number;
  quantity: number;
  slug: string;
}

export interface Attribute {
  type: string;
  name: string;
  values: {
    value: string;
    descriptionUrl: string;
  }[];
}

export interface ProductUpdate{
  productKey: string;
  name?: string;
  slug?: string;
  description?: string;
  video?: string;
  mainImage?: string;
  subImages?: string[];
  qrCode?: string;
  originalPrice?: number;
  minPrice?: number;
  maxPrice?: number;
  discountType?: "PERCENT" | "AMOUNT";
  discountValue?: number;
  discountStart?: string | null;
  discountEnd?: string | null;
  quantity?: number;
  sold?: number;
  category?: string[];
  attributes?: ProductAttribute[];
  status?: string;
  rating?: number;
  ratingCount?: number;
  views?: number;
  uniqueViews?: string[];
  createdBy?: string;
  updatedBy?: string;
  returnDays?: number;
  variants?: Variant[] | null;
  price?: number;
  discountedPrice?: number | null;
  hasDiscount?: boolean;
  skuList?: UpdateSkuList[];
}

export interface ProductDetailResponse {
  product: ProductDetail;
  skuList: {
    skuList: SkuList[];
  };
}

// Interface cho phản hồi khi cập nhật sản phẩm
export interface ProductUpdateResponse {
  prd_name?: string;
  prd_description?: string;
  prd_video?: string;
  prd_main_image?: string;
  prd_sub_images?: string[];
  prd_category?: Category[];
  prd_attributes?: Attribute[];
  prd_original_price?: number;
  prd_min_price: number;
  prd_max_price: number;
  prd_discount_type?: "AMOUNT" | "PERCENT";
  prd_discount_value?: number;
  prd_discount_start?: string;
  prd_discount_end?: string;
  prd_quantity?: number;
  prd_sold?: number;
  prd_variants?:{
    var_name?: "color";
    var_options?: string[];
    var_images?: string[]
  }
  // prd_variant_attributes?: VariantAttribute[];
  // prd_sku_list?: SkuList[];
  return_days?: number;
  prd_rating?: number;
  updatedBy: string;
}

export interface ImportProduct {
  id: string;
  quantity?: number; // Optional if skuList is provided
  skuList?: { 
    id: string; 
    quantity: number;
  }[]; // Optional if quantity is provided
}

export interface ImportProductResponse {
  id: string;
  name: string;
  quantity: number;
  status: string;
}