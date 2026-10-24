export type PropertyType =
  | "FARMHOUSE"
  | "VILLA"
  | "WEDDING_LAWN"
  | "AIRBNB";

export type PropertyStatus = "ACTIVE" | "INACTIVE";

export interface PropertyCardData {
  id: string;
  slug?: string;
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
  videoUrls?: string[];
  mediaUrls?: string[];
  badge?: string;
  status: PropertyStatus;
  vendorId?: string;
}

export interface PropertyImageResponse {
  id: string;
  url: string;
  isPrimary: boolean;
}

export interface PropertyApiResponse {
  id: string;
  slug: string;
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
  status?: PropertyStatus;
  amenities?: string[] | null;
  images?: PropertyImageResponse[] | null;
  // The list endpoint returns PropertyCardResponse with imageUrls, averageRating,
  // and reviewCount; detail endpoints may instead return images and status.
  imageUrls?: string[] | null;
  averageRating?: number | null;
  rating?: number | null;
  reviewCount?: number | null;
  totalReviews?: number | null;
  reviewsCount?: number | null;
  numberOfReviews?: number | null;
  ratingsCount?: number | null;
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
