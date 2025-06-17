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