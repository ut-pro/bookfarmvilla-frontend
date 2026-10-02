// Shared types for the /admin panel. Kept separate from the public-site types
// in src/types/property.ts and src/types/lead.ts so the admin panel's data
// shapes (which map 1:1 to the backend DTOs) don't get tangled up with the
// public site's display-oriented types.

export type PropertyType = "FARMHOUSE" | "VILLA" | "WEDDING_LAWN";
export type ListingStatus = "ACTIVE" | "INACTIVE";
export type LeadStatus = "NEW" | "CONTACTED" | "CONVERTED" | "CLOSED";
export type VendorCategory =
  | "CATERER"
  | "DECORATOR"
  | "PHOTOGRAPHER"
  | "MAKEUP_ARTIST"
  | "DJ"
  | "OTHER";
export type PartnerStatus = "PENDING" | "OPEN" | "ACCEPTED" | "DECLINED";
export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
export type PaymentStatus = "UNPAID" | "PAID" | "REFUNDED";

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface AdminPropertyImage {
  id: string;
  url: string;
  isPrimary: boolean;
}

export interface AdminProperty {
  id: string;
  title: string;
  description: string | null;
  type: PropertyType;
  address: string | null;
  city: string;
  latitude: number | null;
  longitude: number | null;
  startingPrice: number | null;
  endingPrice: number | null;
  capacity: number | null;
  contactPhone: string;
  status: ListingStatus;
  amenities: string[];
  images: AdminPropertyImage[];
  averageRating: number | null;
  createdAt: string;
  modifiedAt: string;
}

export interface AdminPropertyPayload {
  id?: string;
  title: string;
  description?: string;
  type: PropertyType;
  address?: string;
  city: string;
  latitude?: number | null;
  longitude?: number | null;
  startingPrice?: number | null;
  endingPrice?: number | null;
  capacity?: number | null;
  contactPhone: string;
  status?: ListingStatus;
  amenityIds?: string[];
  imageUrls?: string[];
}

export interface AdminVendorImage {
  id: string;
  url: string;
  isPrimary: boolean;
}

export interface AdminVendor {
  id: string;
  name: string;
  category: VendorCategory;
  description: string | null;
  city: string;
  priceRange: string | null;
  contactPhone: string;
  status: ListingStatus;
  images: AdminVendorImage[];
  averageRating: number | null;
  createdAt: string;
  modifiedAt: string;
}

export interface AdminVendorPayload {
  id?: string;
  name: string;
  category: VendorCategory;
  description?: string;
  city: string;
  priceRange?: string;
  contactPhone: string;
  status?: ListingStatus;
  imageUrls?: string[];
}

export interface AdminAmenity {
  id: string;
  name: string;
}

export interface AdminLead {
  id: string;
  propertyId: string | null;
  propertyTitle: string | null;
  vendorId: string | null;
  vendorName: string | null;
  name: string;
  phone: string;
  email: string | null;
  preferredDate: string | null;
  eventType: string | null;
  message: string | null;
  status: LeadStatus;
  createdAt: string;
  modifiedAt: string;
}

export interface AdminPartner {
  id: string;
  businessName: string;
  fullName: string;
  businessType: string;
  city: string;
  location: string;
  phoneNumber: string;
  status: PartnerStatus;
  createdAt: string;
  modifiedAt: string;
}

export interface AdminBooking {
  id: string;
  customerName: string;
  customerPhone: string | null;
  propertyId: string | null;
  propertyTitle: string | null;
  listingType: PropertyType;
  bookingDate: string;
  amount: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
  modifiedAt: string;
}

export interface AdminBookingPayload {
  id?: string;
  customerName: string;
  customerPhone?: string;
  propertyId?: string | null;
  listingType: PropertyType;
  bookingDate: string;
  amount: number;
  status?: BookingStatus;
  paymentStatus?: PaymentStatus;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "GUEST" | "STAFF" | "ADMIN";
}

export interface LoginResponse {
  token: string;
  userId: string;
  name: string;
  email: string;
  role: "GUEST" | "STAFF" | "ADMIN";
}
