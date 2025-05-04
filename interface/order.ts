
export interface ShippingAddress {
    fullname: string;
    phone: string;
  }
  
  export interface DeliveryMethod {
    id: string;
    name: string;
  }

export interface Order {
    createdAt: string | number | Date;
    id: string;
    shippingAddress: ShippingAddress;
    paymentMethod: string;
    deliveryMethod: DeliveryMethod;
    totalPrice: number;
    status: string;
    nextStatus: string;
  }
  
  export interface OrderResponse{
    totalPages: number;
    totalOrders: number;
    currentPage: number;
    orders: Order[];
  }

  //##GET DETAIL###
export interface OrderItem {
    productId: string;
    variantId: string;
    productName: string;
    variantSlug: string;
    price: number;
    image: string;
    quantity: number;
  }
  
  export interface ShippingAddressDetail {
    fullname: string;
    phone: string;
    city: string;
    district: string;
    ward: string;
    street: string;
  }
  
  export interface DeliveryMethodDetail{
    name: string;
    id: string;
  }
  
  export interface OrderMetadata {
    id: string;
    userId: string;
    couponId: string;
    items: OrderItem[];
    shippingAddress: ShippingAddressDetail;
    paymentMethod: string;
    deliveryMethod: DeliveryMethodDetail;
    itemsPrice: number;
    discountPrice: number;
    shippingPrice: number;
    totalPrice: number;
    status: string;
  }
  
  export interface OrderMetaResponse {
      orders: OrderMetadata;
  }
  
  
  