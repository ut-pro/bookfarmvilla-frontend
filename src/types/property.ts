export type PropertyType =
  | "FARMHOUSE"
  | "VILLA"
  | "WEDDING_LAWN";

export type PropertyStatus = "ACTIVE" | "INACTIVE";

export interface PropertyCardData {
  id: string;
  name: string;
  type: PropertyType;
  location: string;
  rating: number;
  reviewCount: number;
  guestCapacity: number;
  bedrooms?: number;
  hasPool: boolean;
  startingPrice?: number;
  priceSuffix?: string;
  imageUrl: string;
  badge?: string;
  status: PropertyStatus;
}