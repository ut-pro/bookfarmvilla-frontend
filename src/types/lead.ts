export interface CallbackLeadDraft {
  name: string;
  phone: string;
  email?: string;
  message?: string;
  propertyId: string;
}

export type CallbackFormField =
  | "name"
  | "phone"
  | "email"
  | "message"
  | "propertyId";

export type CallbackFormErrors = Partial<
  Record<CallbackFormField, string>
>;