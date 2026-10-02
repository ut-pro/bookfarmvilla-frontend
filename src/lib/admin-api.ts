// Centralized API + token handling for the /admin panel.
//
// Every authenticated admin request goes through adminApiFetch() below, which
// attaches the JWT from localStorage automatically. No component should call
// fetch() directly against the backend for admin actions - that would mean
// duplicating the auth-header logic (and the 401-handling logic) in every
// component, which is exactly what this file exists to avoid.
//
// This runs entirely client-side (localStorage requires the browser), so every
// file that imports this must be a "use client" component.

import type {
  AdminAmenity,
  AdminBooking,
  AdminBookingPayload,
  AdminLead,
  AdminPartner,
  AdminProperty,
  AdminPropertyPayload,
  AdminVendor,
  AdminVendorPayload,
  BookingStatus,
  LeadStatus,
  ListingStatus,
  LoginResponse,
  PageResponse,
  PartnerStatus,
  PaymentStatus,
  PropertyType,
  VendorCategory,
} from "@/types/admin";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

const TOKEN_KEY = "bfv_admin_token";
const USER_KEY = "bfv_admin_user";

// ---------------------------------------------------------------------------
// Token storage
// ---------------------------------------------------------------------------

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}

export function setStoredUser(user: {
  userId: string;
  name: string;
  email: string;
  role: string;
}): void {
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getStoredUser(): {
  userId: string;
  name: string;
  email: string;
  role: string;
} | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/** Decodes a JWT's payload without any external library - just base64url + JSON.parse. */
function decodeJwtPayload(token: string): { exp?: number } | null {
  try {
    const payload = token.split(".")[1];
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(normalized);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export function isTokenValid(token: string | null): boolean {
  if (!token) return false;
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return false;
  return payload.exp * 1000 > Date.now();
}

export function isAuthenticated(): boolean {
  return isTokenValid(getToken());
}

// ---------------------------------------------------------------------------
// Core fetch wrapper
// ---------------------------------------------------------------------------

export class AdminApiError extends Error {
  status: number;
  fieldErrors?: Record<string, string>;

  constructor(message: string, status: number, fieldErrors?: Record<string, string>) {
    super(message);
    this.name = "AdminApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

async function adminApiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers ?? {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Session expired or invalid token - clear it and send the admin back to login.
    clearToken();
    if (typeof window !== "undefined" && !window.location.pathname.endsWith("/admin/login")) {
      window.location.href = "/admin/login";
    }
    throw new AdminApiError("Your session has expired. Please log in again.", 401);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  const data = text ? JSON.parse(text) : undefined;

  if (!response.ok) {
    const message = data?.message ?? "Something went wrong. Please try again.";
    throw new AdminApiError(message, response.status, data?.fieldErrors);
  }

  return data as T;
}

function buildQuery(params: Record<string, string | number | undefined | null>): string {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      search.append(key, String(value));
    }
  });
  const query = search.toString();
  return query ? `?${query}` : "";
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export async function login(email: string, password: string): Promise<LoginResponse> {
  return adminApiFetch<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function logout(): void {
  clearToken();
  if (typeof window !== "undefined") {
    window.location.href = "/admin/login";
  }
}

// ---------------------------------------------------------------------------
// Properties
// ---------------------------------------------------------------------------

export async function fetchProperties(params: {
  type?: PropertyType;
  city?: string;
  status?: ListingStatus;
  keyword?: string;
  page?: number;
  size?: number;
}): Promise<PageResponse<AdminProperty>> {
  const query = buildQuery({
    type: params.type,
    city: params.city,
    status: params.status,
    keyword: params.keyword,
    page: params.page ?? 0,
    size: params.size ?? 20,
  });
  return adminApiFetch<PageResponse<AdminProperty>>(`/api/properties${query}`);
}

export async function fetchProperty(id: string): Promise<AdminProperty> {
  return adminApiFetch<AdminProperty>(`/api/properties/${id}`);
}

export async function createProperty(payload: AdminPropertyPayload): Promise<AdminProperty> {
  return adminApiFetch<AdminProperty>("/api/properties", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateProperty(
  id: string,
  payload: AdminPropertyPayload
): Promise<AdminProperty> {
  return adminApiFetch<AdminProperty>(`/api/properties/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteProperty(id: string): Promise<void> {
  return adminApiFetch<void>(`/api/properties/${id}`, { method: "DELETE" });
}

// ---------------------------------------------------------------------------
// Vendors
// ---------------------------------------------------------------------------

export async function fetchVendors(params: {
  category?: VendorCategory;
  city?: string;
  status?: ListingStatus;
  keyword?: string;
  page?: number;
  size?: number;
}): Promise<PageResponse<AdminVendor>> {
  const query = buildQuery({
    category: params.category,
    city: params.city,
    status: params.status,
    keyword: params.keyword,
    page: params.page ?? 0,
    size: params.size ?? 20,
  });
  return adminApiFetch<PageResponse<AdminVendor>>(`/api/vendors${query}`);
}

export async function fetchVendor(id: string): Promise<AdminVendor> {
  return adminApiFetch<AdminVendor>(`/api/vendors/${id}`);
}

export async function createVendor(payload: AdminVendorPayload): Promise<AdminVendor> {
  return adminApiFetch<AdminVendor>("/api/vendors", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateVendor(id: string, payload: AdminVendorPayload): Promise<AdminVendor> {
  return adminApiFetch<AdminVendor>(`/api/vendors/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteVendor(id: string): Promise<void> {
  return adminApiFetch<void>(`/api/vendors/${id}`, { method: "DELETE" });
}

// ---------------------------------------------------------------------------
// Amenities (used to populate the property form's amenity picker)
// ---------------------------------------------------------------------------

export async function fetchAmenities(): Promise<AdminAmenity[]> {
  return adminApiFetch<AdminAmenity[]>("/api/amenities");
}

// ---------------------------------------------------------------------------
// Leads (Enquiries)
// ---------------------------------------------------------------------------

export async function fetchLeads(params: {
  status?: LeadStatus;
  page?: number;
  size?: number;
}): Promise<PageResponse<AdminLead>> {
  const query = buildQuery({
    status: params.status,
    page: params.page ?? 0,
    size: params.size ?? 20,
  });
  return adminApiFetch<PageResponse<AdminLead>>(`/api/leads${query}`);
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<AdminLead> {
  return adminApiFetch<AdminLead>(`/api/leads/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

// ---------------------------------------------------------------------------
// Partners
// ---------------------------------------------------------------------------

export async function fetchPartners(params: {
  status?: PartnerStatus;
  page?: number;
  size?: number;
}): Promise<PageResponse<AdminPartner>> {
  const query = buildQuery({
    status: params.status,
    page: params.page ?? 0,
    size: params.size ?? 20,
  });
  return adminApiFetch<PageResponse<AdminPartner>>(`/api/partners${query}`);
}

export async function deletePartner(id: string): Promise<void> {
  return adminApiFetch<void>(`/api/partners/${id}`, { method: "DELETE" });
}

// ---------------------------------------------------------------------------
// Bookings
// ---------------------------------------------------------------------------

export async function fetchBookings(params: {
  listingType?: PropertyType;
  status?: BookingStatus;
  paymentStatus?: PaymentStatus;
  keyword?: string;
  page?: number;
  size?: number;
}): Promise<PageResponse<AdminBooking>> {
  const query = buildQuery({
    listingType: params.listingType,
    status: params.status,
    paymentStatus: params.paymentStatus,
    keyword: params.keyword,
    page: params.page ?? 0,
    size: params.size ?? 20,
  });
  return adminApiFetch<PageResponse<AdminBooking>>(`/api/bookings${query}`);
}

export async function createBooking(payload: AdminBookingPayload): Promise<AdminBooking> {
  return adminApiFetch<AdminBooking>("/api/bookings", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateBooking(
  id: string,
  payload: AdminBookingPayload
): Promise<AdminBooking> {
  return adminApiFetch<AdminBooking>(`/api/bookings/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteBooking(id: string): Promise<void> {
  return adminApiFetch<void>(`/api/bookings/${id}`, { method: "DELETE" });
}
