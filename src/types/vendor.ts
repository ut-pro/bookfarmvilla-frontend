export type VendorCategory =
  | "CATERER"
  | "DECORATOR"
  | "PHOTOGRAPHER"
  | "MAKEUP_ARTIST"
  | "DJ"
  | "OTHER";

export type VendorCategoryFilter =
  | "CATERER"
  | "PHOTOGRAPHER"
  | "DJ"
  | "DECORATOR"
  | "OTHER_SERVICES";

export type VendorStatus = "ACTIVE" | "INACTIVE";

export interface VendorImage {
  id: string;
  url: string;
  isPrimary: boolean;
}

export interface VendorResponse {
  id: string;
  name: string;
  category: VendorCategory;
  description?: string | null;
  city: string;
  priceRange?: string | null;
  contactPhone: string;
  status: VendorStatus;
  images?: VendorImage[];
  averageRating?: number | null;
  createdAt?: string | null;
  modifiedAt?: string | null;
}

export interface VendorPageResponse {
  content: VendorResponse[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface VendorSearchParams {
  city?: string;
  category?: VendorCategory;
  keyword?: string;
  page?: number;
  size?: number;
  sort?: string;
}