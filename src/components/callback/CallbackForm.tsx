"use client";

import { useState, type FormEvent } from "react";

import { mockProperties } from "@/data/properties";
import type {
  CallbackFormErrors,
  CallbackLeadDraft,
} from "@/types/lead";
import type { PropertyCardData } from "@/types/property";

interface CallbackFormProps {
  initialProperty: PropertyCardData | null;
  onSuccess: (lead: CallbackLeadDraft) => void;
  onCancel: () => void;
}

export default function CallbackForm({
  initialProperty,
  onSuccess,
  onCancel,
}: CallbackFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [propertyId, setPropertyId] = useState(
    initialProperty?.id ?? "",
  );

  const [errors, setErrors] =
    useState<CallbackFormErrors>({});

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const validateForm = (): CallbackFormErrors => {
    const nextErrors: CallbackFormErrors = {};
    const phoneDigits = phone.replace(/\D/g, "");

    if (name.trim().length < 2) {
      nextErrors.name =
        "Please enter a valid name.";
    }

    if (phoneDigits.length < 10 || phoneDigits.length > 13) {
      nextErrors.phone =
        "Please enter a valid phone number.";
    }

    if (
      email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      nextErrors.email =
        "Please enter a valid email address.";
    }

    if (!propertyId) {
      nextErrors.propertyId =
        "Please select a property.";
    }

    if (message.length > 500) {
      nextErrors.message =
        "Message cannot exceed 500 characters.";
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
    setIsSubmitting(true);

    const leadDraft: CallbackLeadDraft = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      message: message.trim() || undefined,
      propertyId,
    };

    /*
     * UI-only development submission.
     * Replace this with POST /api/leads after confirming
     * the exact backend LeadRequest DTO.
     */
    console.log("Callback lead draft:", leadDraft);

    await new Promise((resolve) => {
      window.setTimeout(resolve, 500);
    });

    setIsSubmitting(false);
    onSuccess(leadDraft);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
      noValidate
    >
      {/* Property selection */}
      <div>
        <label
          htmlFor="callback-property"
          className="mb-1.5 block text-sm font-semibold text-[#0F172A]"
        >
          Property
          <span className="ml-1 text-red-500">*</span>
        </label>

        <select
          id="callback-property"
          value={propertyId}
          onChange={(event) => {
            setPropertyId(event.target.value);

            if (errors.propertyId) {
              setErrors((currentErrors) => ({
                ...currentErrors,
                propertyId: undefined,
              }));
            }
          }}
          disabled={Boolean(initialProperty)}
          className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-[#0F172A] outline-none transition-colors disabled:cursor-not-allowed disabled:bg-gray-100 ${
            errors.propertyId
              ? "border-red-400 focus:border-red-500"
              : "border-gray-200 focus:border-[#2EAD45]"
          }`}
        >
          <option value="">
            Select a property
          </option>

          {mockProperties.map((property) => (
            <option
              key={property.id}
              value={property.id}
            >
              {property.name} — {property.location}
            </option>
          ))}
        </select>

        {initialProperty && (
          <p className="mt-1.5 text-xs text-gray-500">
            This enquiry is for {initialProperty.name}.
          </p>
        )}

        {errors.propertyId && (
          <p className="mt-1.5 text-xs text-red-500">
            {errors.propertyId}
          </p>
        )}
      </div>

      {/* Name */}
      <div>
        <label
          htmlFor="callback-name"
          className="mb-1.5 block text-sm font-semibold text-[#0F172A]"
        >
          Full Name
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
          className={`w-full rounded-xl border px-4 py-3 text-sm text-[#0F172A] outline-none transition-colors placeholder:text-gray-400 ${
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
            className={`w-full rounded-xl border px-4 py-3 text-sm text-[#0F172A] outline-none transition-colors placeholder:text-gray-400 ${
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
            className={`w-full rounded-xl border px-4 py-3 text-sm text-[#0F172A] outline-none transition-colors placeholder:text-gray-400 ${
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
          className={`w-full resize-none rounded-xl border px-4 py-3 text-sm text-[#0F172A] outline-none transition-colors placeholder:text-gray-400 ${
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

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-[#2EAD45] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1E8A32] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting
            ? "Submitting..."
            : "Request Callback"}
        </button>
      </div>
    </form>
  );
}