"use client";

import { useState, type FormEvent } from "react";

import { submitLead, PublicApiError } from "@/lib/public-api";
import type {
  CallbackFormErrors,
  CallbackLeadDraft,
} from "@/types/lead";
import type { PropertyCardData } from "@/types/property";
import type { VendorResponse } from "@/types/vendor";

interface CallbackFormProps {
  initialProperty: PropertyCardData | null;
  initialVendor: VendorResponse | null;
  onSuccess: (lead: CallbackLeadDraft) => void;
  onCancel: () => void;
}

function normalizeSpaces(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

function getFullNameError(value: string): string | undefined {
  const normalizedName = normalizeSpaces(value);
  const letters = normalizedName.match(/\p{L}/gu) ?? [];

  if (letters.length < 3) {
    return "Name must contain at least 3 letters.";
  }

  if (normalizedName.length > 20) {
    return "Name cannot exceed 20 characters.";
  }

  if (!/^[\p{L}\p{M} ]+$/u.test(normalizedName)) {
    return "Name can contain letters and spaces only.";
  }

  return undefined;
}

function normalizePhoneNumber(value: string): string | null {
  const normalizedValue = value.trim();

  if (!/^[+\d\s().-]+$/.test(normalizedValue)) {
    return null;
  }

  let digits = normalizedValue.replace(/\D/g, "");

  if (digits.length === 12 && digits.startsWith("91")) {
    digits = digits.slice(2);
  }

  return /^[6-9]\d{9}$/.test(digits) ? digits : null;
}

function getEmailError(value: string): string | undefined {
  const normalizedEmail = value.trim();

  if (!normalizedEmail) {
    return undefined;
  }

  if (normalizedEmail.length > 254) {
    return "Email address is too long.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(normalizedEmail)) {
    return "Please enter a valid email address.";
  }

  return undefined;
}

export default function CallbackForm({
  initialProperty,
  initialVendor,
  onSuccess,
  onCancel,
}: CallbackFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [errors, setErrors] =
    useState<CallbackFormErrors>({});

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [submitError, setSubmitError] = useState<string | null>(null);

  const isVendorEnquiry = Boolean(initialVendor);

  const validateForm = (): CallbackFormErrors => {
    const nextErrors: CallbackFormErrors = {};
    const nameError = getFullNameError(name);
    const emailError = getEmailError(email);

    if (nameError) {
      nextErrors.name = nameError;
    }

    if (!normalizePhoneNumber(phone)) {
      nextErrors.phone =
        "Enter a valid 10-digit phone number starting with 6, 7, 8, or 9.";
    }

    if (emailError) {
      nextErrors.email = emailError;
    }


    return nextErrors;
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setSubmitError(null);
    setIsSubmitting(true);

    const leadDraft: CallbackLeadDraft = {
      name: normalizeSpaces(name),
      phone: normalizePhoneNumber(phone) ?? phone.trim(),
      email: email.trim().toLowerCase() || undefined,
      message: normalizeSpaces(message) || undefined,
      propertyId: initialProperty?.id,
      vendorId: initialVendor?.id,
    };

    try {
      await submitLead({
        propertyId: leadDraft.propertyId,
        vendorId: leadDraft.vendorId,
        name: leadDraft.name,
        phone: leadDraft.phone,
        email: leadDraft.email,
        message: leadDraft.message,
      });
      onSuccess(leadDraft);
    } catch (error) {
      if (error instanceof PublicApiError) {
        setSubmitError(error.message);
      } else {
        setSubmitError("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 sm:space-y-5"
      noValidate
    >
      {/* Selected property or vendor context */}
      {initialVendor ? (
        <div>
          <label
            htmlFor="callback-vendor"
            className="mb-1.5 block text-sm font-semibold text-[#0F172A]"
          >
            Service Provider
          </label>

          <input
            id="callback-vendor"
            type="text"
            value={`${initialVendor.name} — ${initialVendor.city}`}
            readOnly
            className="min-h-12 w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-base text-[#0F172A] outline-none sm:text-sm"
          />

          <p className="mt-1.5 text-xs text-gray-500">
            This enquiry is for {initialVendor.name}.
          </p>
        </div>
      ) : initialProperty ? (
        <div>
          <label
            htmlFor="callback-property"
            className="mb-1.5 block text-sm font-semibold text-[#0F172A]"
          >
            Property
          </label>

          <input
            id="callback-property"
            type="text"
            value={`${initialProperty.name} — ${initialProperty.location}`}
            readOnly
            className="min-h-12 w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-base text-[#0F172A] outline-none sm:text-sm"
          />

          <p className="mt-1.5 text-xs text-gray-500">
            This enquiry is for {initialProperty.name}.
          </p>
        </div>
      ) : null}

      {/* Name */}
      <div>
        <label
          htmlFor="callback-name"
          className="mb-1.5 block text-sm font-semibold text-[#0F172A]"
        >
          Your Full Name
          <span className="ml-1 text-red-500">*</span>
        </label>

        <input
          id="callback-name"
          type="text"
          value={name}
          onChange={(event) => {
            setName(event.target.value);

            if (errors.name) {
              setErrors((currentErrors) => ({
                ...currentErrors,
                name: undefined,
              }));
            }
          }}
          placeholder="Enter your full name"
          autoComplete="name"
          maxLength={20}
          aria-invalid={Boolean(errors.name)}
          className={`min-h-12 w-full rounded-xl border px-4 py-3 text-base text-[#0F172A] outline-none transition-colors placeholder:text-gray-400 sm:text-sm ${
            errors.name
              ? "border-red-400 focus:border-red-500"
              : "border-gray-200 focus:border-[#2EAD45]"
          }`}
        />

        {errors.name && (
          <p className="mt-1.5 text-xs text-red-500">
            {errors.name}
          </p>
        )}
      </div>

      {/* Phone and email */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="callback-phone"
            className="mb-1.5 block text-sm font-semibold text-[#0F172A]"
          >
            Phone Number
            <span className="ml-1 text-red-500">*</span>
          </label>

          <input
            id="callback-phone"
            type="tel"
            value={phone}
            onChange={(event) => {
              setPhone(event.target.value);

              if (errors.phone) {
                setErrors((currentErrors) => ({
                  ...currentErrors,
                  phone: undefined,
                }));
              }
            }}
            placeholder="+91 98765 43210"
            autoComplete="tel"
            inputMode="tel"
            maxLength={18}
            aria-invalid={Boolean(errors.phone)}
            className={`min-h-12 w-full rounded-xl border px-4 py-3 text-base text-[#0F172A] outline-none transition-colors placeholder:text-gray-400 sm:text-sm ${
              errors.phone
                ? "border-red-400 focus:border-red-500"
                : "border-gray-200 focus:border-[#2EAD45]"
            }`}
          />

          {errors.phone && (
            <p className="mt-1.5 text-xs text-red-500">
              {errors.phone}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="callback-email"
            className="mb-1.5 block text-sm font-semibold text-[#0F172A]"
          >
            Email
            <span className="ml-1 text-xs font-normal text-gray-400">
              Optional
            </span>
          </label>

          <input
            id="callback-email"
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);

              if (errors.email) {
                setErrors((currentErrors) => ({
                  ...currentErrors,
                  email: undefined,
                }));
              }
            }}
            placeholder="you@example.com"
            autoComplete="email"
            maxLength={254}
            aria-invalid={Boolean(errors.email)}
            className={`min-h-12 w-full rounded-xl border px-4 py-3 text-base text-[#0F172A] outline-none transition-colors placeholder:text-gray-400 sm:text-sm ${
              errors.email
                ? "border-red-400 focus:border-red-500"
                : "border-gray-200 focus:border-[#2EAD45]"
            }`}
          />

          {errors.email && (
            <p className="mt-1.5 text-xs text-red-500">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      {/* Message */}
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label
            htmlFor="callback-message"
            className="text-sm font-semibold text-[#0F172A]"
          >
            Message
            <span className="ml-1 text-xs font-normal text-gray-400">
              Optional
            </span>
          </label>

          <span className="text-xs text-gray-400">
            {message.length}/500
          </span>
        </div>

        <textarea
          id="callback-message"
          value={message}
          onChange={(event) => {
            setMessage(event.target.value);

            if (errors.message) {
              setErrors((currentErrors) => ({
                ...currentErrors,
                message: undefined,
              }));
            }
          }}
          maxLength={500}
          rows={4}
          placeholder="Tell us about your event or any specific requirements..."
          className={`w-full resize-none rounded-xl border px-4 py-3 text-base text-[#0F172A] outline-none transition-colors placeholder:text-gray-400 sm:text-sm ${
            errors.message
              ? "border-red-400 focus:border-red-500"
              : "border-gray-200 focus:border-[#2EAD45]"
          }`}
        />

        {errors.message && (
          <p className="mt-1.5 text-xs text-red-500">
            {errors.message}
          </p>
        )}
      </div>

      {/* API-level submission error */}
      {submitError && (
        <div className="break-words rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {submitError}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="min-h-12 w-full rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="min-h-12 w-full rounded-xl bg-[#2EAD45] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1E8A32] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {isSubmitting
            ? "Submitting..."
            : "Request Callback"}
        </button>
      </div>
    </form>
  );
}

