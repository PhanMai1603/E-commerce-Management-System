export interface BannerItem {
  id: string;
  imageUrl: string;
  isActive: boolean;
}

export interface BannerGroup {
  id: string;
  name: string;
  items: BannerItem[];
  total: number;
}

export interface BannerMetadata {
  group: BannerGroup[];
  total: number;
}

///create
export type BannerPosition = "SLIDE" | "FOOTER" | "CATEGORY";

export interface BannerRequest {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaUrl: string;
  imageUrl: string;
  position: BannerPosition;
  category: string[];   // mảng ID danh mục
  isActive: boolean;
  startDate: string;    // ISO date string
  endDate: string;      // ISO date string
}


//

export interface BannerCategory {
  id: string;
  name: string;
}

export interface BannerResponseResponse{
  id: string;
  title: string;
  imageUrl: string;
  isActive: boolean;
  displayOrder: number;
  position: BannerPosition;
  category: BannerCategory[]; // có thể là mảng rỗng hoặc nhiều category
}

//publish
export interface Status{
    id: string,
    isActive: boolean,
    updatedAt: string,
}


///details

export interface BannerCategory {
  id: string;
  name: string;
}

export interface BannerDetailMetadata {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaUrl: string;
  imageUrl: string;
  publicId: string;
  displayOrder: number;
  isActive: boolean;
  startDate: string; // ISO string
  endDate: string;   // ISO string
  position: BannerPosition;
  category: BannerCategory[];
  createdBy: string;
  updatedBy: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

