// Public, unauthenticated calls to the backend - used by CallbackForm.tsx and
// PartnerEnquiryModal.tsx on the main site. These never attach a JWT (there
// isn't one - the visitor isn't logged in), unlike src/lib/admin-api.ts.

import { API_BASE_URL } from "@/lib/api-config";

import type {
  VendorPageResponse,
  VendorResponse,
  VendorSearchParams,
} from "@/types/vendor";

export class PublicApiError extends Error {
  fieldErrors?: Record<string, string>;
  status?: number;

  constructor(
    message: string,
    fieldErrors?: Record<string, string>,
    status?: number,
  ) {
    super(message);
    this.name = "PublicApiError";
    this.fieldErrors = fieldErrors;
    this.status = status;
  }
}

async function publicGet<T>(
  path: string,
  signal?: AbortSignal,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    signal,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : undefined;

  if (!response.ok) {
    const message = data?.message ?? "Unable to load data right now.";
    throw new PublicApiError(
      message,
      data?.fieldErrors,
      response.status,
    );
  }

  return data as T;
}

async function publicPost<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : undefined;

  if (!response.ok) {
    const message = data?.message ?? "Something went wrong. Please try again.";
    throw new PublicApiError(
      message,
      data?.fieldErrors,
      response.status,
    );
  }

  return data as T;
}

export interface SubmitLeadPayload {
  propertyId?: string;
  vendorId?: string;
  name: string;
  phone: string;
  email?: string;
  preferredDate?: string;
  eventType?: string;
  message?: string;
}

export async function submitLead(payload: SubmitLeadPayload) {
  return publicPost("/api/leads", payload);
}

export interface SubmitPartnerPayload {
  businessName: string;
  fullName: string;
  businessType: string;
  city: string;
  location: string;
  phoneNumber: string;
}

export async function submitPartnerRequest(payload: SubmitPartnerPayload) {
  return publicPost("/api/partners", payload);
}

export async function getActiveVendors(
  params: VendorSearchParams = {},
  signal?: AbortSignal,
): Promise<VendorPageResponse> {
  const searchParams = new URLSearchParams({
    status: "ACTIVE",
    page: String(params.page ?? 0),
    size: String(params.size ?? 100),
  });

  const city = params.city?.trim();
  const keyword = params.keyword?.trim();

  if (city) {
    searchParams.set("city", city);
  }

  if (params.category) {
    searchParams.set("category", params.category);
  }

  if (keyword) {
    searchParams.set("keyword", keyword);
  }

  if (params.sort) {
    searchParams.set("sort", params.sort);
  }

  return publicGet<VendorPageResponse>(
    `/api/vendors?${searchParams.toString()}`,
    signal,
  );
}

export async function getVendorById(
  vendorId: string,
  signal?: AbortSignal,
): Promise<VendorResponse | null> {
  const normalizedId = vendorId.trim();

  if (!normalizedId) {
    return null;
  }

  try {
    const vendor = await publicGet<VendorResponse>(
      `/api/vendors/${encodeURIComponent(normalizedId)}`,
      signal,
    );

    return vendor.status === "ACTIVE"
      ? vendor
      : null;
  } catch (error) {
    if (
      error instanceof PublicApiError &&
      error.status === 404
    ) {
      return null;
    }

    throw error;
  }
}
