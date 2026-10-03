export type PropertyType =
  | "FARMHOUSE"
  | "VILLA"
  | "WEDDING_LAWN";

export type PropertyStatus = "ACTIVE" | "INACTIVE";

export interface PropertyCardData {
  id: string;
  name: string;
  type: PropertyType;
  description?: string;
  location: string;
  city?: string;
  rating?: number;
  reviewCount?: number;
  guestCapacity: number;
  bedrooms?: number;
  hasPool: boolean;
  amenities?: string[];
  latitude?: number | null;
  longitude?: number | null;
  startingPrice?: number | null;
  endingPrice?: number | null;
  priceSuffix?: string;
  imageUrl: string;
  imageUrls?: string[];
  badge?: string;
  status: PropertyStatus;
}

export interface PropertyImageResponse {
  id: string;
  url: string;
  isPrimary: boolean;
}

export interface PropertyApiResponse {
  id: string;
  title: string;
  description?: string | null;
  type: PropertyType;
  address?: string | null;
  city: string;
  latitude?: number | null;
  longitude?: number | null;
  startingPrice?: number | null;
  endingPrice?: number | null;
  capacity?: number | null;
  contactPhone?: string | null;
  status: PropertyStatus;
  amenities?: string[] | null;
  images?: PropertyImageResponse[] | null;
  averageRating?: number | null;
  createdAt?: string;
  modifiedAt?: string;
}

export interface PropertyPageResponse {
  content: PropertyApiResponse[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}
