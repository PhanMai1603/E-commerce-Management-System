export interface ReviewResponse {
    total: number;
    totalPages: number;
    page: number;
    size: number;
    hasMore: boolean;
    items: Review[];
}

export interface Review {
    id: string;
    content: string;
    star: number;
    images: string[];
    userId: {
        id: string;
    };
    orderId: string;
    productId: string;
    variantId: string;
    createdAt: string;
}

// interface/review.ts

export interface ReviewDataResponse {
  id: string;
  orderId: string;
  productId: string;
  variantId: string;
  content: string;
  star: number;
  images: string[];
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  reply: {
    content: string;
    user: {
      id: string;
      name: string;
      avatar: string;
    };
    createdAt: string;
  } | null;
  reports: {
    count: number;
    details: string[];
  };
  isHidden: boolean;
  createdAt: string;
}

export interface ReplyResponse{
    id: string;
    content: string;
    star: number;
    images: string[];
    reply: {
        content: string;
        createdAt: string;
    }
}

export interface HideReview{
    id: string;
    isHidden: boolean;
}
