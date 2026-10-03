// Public, unauthenticated calls to the backend - used by CallbackForm.tsx and
// PartnerEnquiryModal.tsx on the main site. These never attach a JWT (there
// isn't one - the visitor isn't logged in), unlike src/lib/admin-api.ts.

import { API_BASE_URL } from "@/lib/api-config";

export class PublicApiError extends Error {
  fieldErrors?: Record<string, string>;

  constructor(message: string, fieldErrors?: Record<string, string>) {
    super(message);
    this.name = "PublicApiError";
    this.fieldErrors = fieldErrors;
  }
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
    throw new PublicApiError(message, data?.fieldErrors);
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
