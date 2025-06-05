
export interface ShippingAddress {
    fullname: string;
    phone: string;
    city: string;
    district: string;
    ward: string;
    street: string;
  }
  
  export interface DeliveryMethod {
    id: string;
    name: string;
    price: string;
  }

export interface Item{
  productName: string;
  image:string;
  quantity: number;
}
export interface Order {
  id: string;
  userId: string;
  totalPrice: number;
  status: string;
  paymentMethod: string;
  paymentStatus:string;
  deliveryMethod: string;
  items:Item[];  
  shippingAddress:ShippingAddress;
  createdAt: string;
  updatedAt: string;
  nextStatus: string;
  }
  
  export interface OrderResponse{
    total: number;
    totalPages: number;
    page: number;
    size: number;
    hasMore: boolean;
    items: Order[];
  }

  //##GET DETAIL###
export interface OrderItem {
    productId: string;
    variantId: string;
    productName: string;
    variantSlug: string;
    image: string;
    price: number;
    quantity: number;
    productDiscount: number,
    couponDiscount: number;
    returnDays: number;
    total:number;
  }
  
  export interface OrderMetaResponse {
      order: OrderDetail;
  }
  export interface OrderDetail{
  id: string;
  userId: string;
  user:{
    name: string;
    email:string;
  }
  couponCode: string;
  status: string;
  nextStatus:string
  paymentMethod: string;
  paymentStatus:string;
  pricing: {
    itemsPrice:number;
    productDiscount: number;
    couponDiscount: number;
    shippingPrice: number;
    shippingDiscount: number;
    totalSavings: number;
    totalPrice: number;
  }
  timestamps:{
    createdAt:string;
    updatedAt:string
    paidAt:string
    deliveredAt:string
    requestedAt:string
    approvedAt:string
  }

  returnReason:string |null
  deliveryMethod:DeliveryMethod;
  shippingAddress:ShippingAddress;
  items:OrderItem[];  
  }