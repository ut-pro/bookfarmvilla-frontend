"use client";

import {
  useCallback,
  useEffect,
  useState,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";

import {
  Building2,
  CheckCircle2,
  ChevronDown,
  Handshake,
  MapPin,
  X,
} from "lucide-react";

import { submitPartnerRequest, PublicApiError } from "@/lib/public-api";

interface PartnerEnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PartnerFormValues {
  businessName: string;
  city: string;
  fullName: string;
  businessType: string;
  location: string;
  phone: string;
}

type PartnerFormField = keyof PartnerFormValues;
type PartnerFormErrors = Partial<Record<PartnerFormField, string>>;

const initialFormValues: PartnerFormValues = {
  businessName: "",
  city: "",
  fullName: "",
  businessType: "",
  location: "",
  phone: "",
};

const businessTypes = [
  "Farmhouse",
  "Villa",
  "Wedding Lawn",
  "Catering Service",
  "DJ & Entertainment",
  "Photography Service",
  "Decoration Service",
  "Makeup Artist",
  "Other Event Service",
];

const partnerCities = [
  "Delhi",
  "New Delhi",
  "Noida",
  "Greater Noida",
  "Gurugram",
  "Faridabad",
  "Ghaziabad",
];

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

function getBusinessNameError(value: string): string | undefined {
  const normalizedBusinessName = normalizeSpaces(value);
  const lettersAndNumbers =
    normalizedBusinessName.match(/[\p{L}\p{N}]/gu) ?? [];

  if (lettersAndNumbers.length < 3) {
    return "Business name must contain at least 3 letters or numbers.";
  }

  if (normalizedBusinessName.length > 80) {
    return "Business name cannot exceed 80 characters.";
  }

  if (!/^[\p{L}\p{M}\p{N} &'().,\/-]+$/u.test(normalizedBusinessName)) {
    return "Business name contains an unsupported character.";
  }

  return undefined;
}

function getAddressError(value: string): string | undefined {
  const normalizedAddress = normalizeSpaces(value);
  const lettersAndNumbers =
    normalizedAddress.match(/[\p{L}\p{N}]/gu) ?? [];

  if (normalizedAddress.length < 5 || lettersAndNumbers.length < 3) {
    return "Please enter the complete business address.";
  }

  if (normalizedAddress.length > 200) {
    return "Address cannot exceed 200 characters.";
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

export default function PartnerEnquiryModal({
  isOpen,
  onClose,
}: PartnerEnquiryModalProps) {
  const [formValues, setFormValues] =
    useState<PartnerFormValues>(initialFormValues);
  const [errors, setErrors] = useState<PartnerFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [highlightedCityIndex, setHighlightedCityIndex] = useState(0);
  const [isBusinessTypeOpen, setIsBusinessTypeOpen] = useState(false);
  const [highlightedBusinessTypeIndex, setHighlightedBusinessTypeIndex] =
    useState(0);

  const handleClose = useCallback(() => {
    setFormValues(initialFormValues);
    setErrors({});
    setIsSubmitting(false);
    setIsSuccessful(false);
    setSubmitError(null);
    setIsCityOpen(false);
    setHighlightedCityIndex(0);
    setIsBusinessTypeOpen(false);
    setHighlightedBusinessTypeIndex(0);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      if (isBusinessTypeOpen) {
        setIsBusinessTypeOpen(false);
        setHighlightedBusinessTypeIndex(0);
        return;
      }

      if (isCityOpen) {
        setIsCityOpen(false);
        setHighlightedCityIndex(0);
        return;
      }

      handleClose();
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, isCityOpen, isBusinessTypeOpen, handleClose]);

  if (!isOpen) {
    return null;
  }

  const updateField = (field: PartnerFormField, value: string) => {
    setFormValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        [field]: undefined,
      }));
    }
  };

  const visibleBusinessTypes = businessTypes.filter(
    (businessType) => businessType !== formValues.businessType,
  );

  const handleBusinessTypeKeyDown = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
  ) => {
    if (
      !isBusinessTypeOpen &&
      (event.key === "ArrowDown" || event.key === "ArrowUp")
    ) {
      event.preventDefault();
      setIsBusinessTypeOpen(true);
      setIsCityOpen(false);
      setHighlightedBusinessTypeIndex(0);
      return;
    }

    if (!isBusinessTypeOpen) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedBusinessTypeIndex((currentIndex) =>
        Math.min(currentIndex + 1, visibleBusinessTypes.length - 1),
      );
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedBusinessTypeIndex((currentIndex) =>
        Math.max(currentIndex - 1, 0),
      );
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const selectedBusinessType =
        visibleBusinessTypes[highlightedBusinessTypeIndex];

      if (selectedBusinessType) {
        updateField("businessType", selectedBusinessType);
        setIsBusinessTypeOpen(false);
        setHighlightedBusinessTypeIndex(0);
      }
    }

    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      setIsBusinessTypeOpen(false);
      setHighlightedBusinessTypeIndex(0);
    }
  };

  const visiblePartnerCities = partnerCities.filter(
    (city) => city !== formValues.city,
  );

  const handleCityKeyDown = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
  ) => {
    if (
      !isCityOpen &&
      (event.key === "ArrowDown" || event.key === "ArrowUp")
    ) {
      event.preventDefault();
      setIsCityOpen(true);
      setHighlightedCityIndex(0);
      return;
    }

    if (!isCityOpen) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedCityIndex((currentIndex) =>
        Math.min(currentIndex + 1, visiblePartnerCities.length - 1),
      );
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedCityIndex((currentIndex) =>
        Math.max(currentIndex - 1, 0),
      );
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const selectedCity = visiblePartnerCities[highlightedCityIndex];

      if (selectedCity) {
        updateField("city", selectedCity);
        setIsCityOpen(false);
        setHighlightedCityIndex(0);
      }
    }

    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      setIsCityOpen(false);
      setHighlightedCityIndex(0);
    }
  };

  const validateForm = (): PartnerFormErrors => {
    const nextErrors: PartnerFormErrors = {};
    const businessNameError = getBusinessNameError(
      formValues.businessName,
    );
    const fullNameError = getFullNameError(formValues.fullName);
    const addressError = getAddressError(formValues.location);

    if (businessNameError) {
      nextErrors.businessName = businessNameError;
    }

    if (!partnerCities.includes(formValues.city)) {
      nextErrors.city = "Please select a city.";
    }

    if (fullNameError) {
      nextErrors.fullName = fullNameError;
    }

    if (!businessTypes.includes(formValues.businessType)) {
      nextErrors.businessType = "Please select a valid business type.";
    }

    if (addressError) {
      nextErrors.location = addressError;
    }

    if (!normalizePhoneNumber(formValues.phone)) {
      nextErrors.phone =
        "Enter a valid 10-digit phone number starting with 6, 7, 8, or 9.";
    }

    return nextErrors;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      await submitPartnerRequest({
        businessName: normalizeSpaces(formValues.businessName),
        city: normalizeSpaces(formValues.city),
        fullName: normalizeSpaces(formValues.fullName),
        businessType: formValues.businessType,
        location: normalizeSpaces(formValues.location),
        phoneNumber:
          normalizePhoneNumber(formValues.phone) ?? formValues.phone.trim(),
      });
      setIsSuccessful(true);
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

  const inputClassName = (field: PartnerFormField) =>
    `min-h-12 w-full rounded-xl border bg-white px-4 py-3 text-base text-[#0F172A] outline-none transition-colors placeholder:text-gray-400 sm:text-sm ${
      errors[field]
        ? "border-red-400 focus:border-red-500"
        : "border-gray-200 focus:border-[#2EAD45]"
    }`;

  return (
    <div
      className="fixed inset-0 z-[110] flex h-[100dvh] items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          handleClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="partner-enquiry-title"
        className="relative flex max-h-[calc(100dvh-0.5rem)] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:max-h-[90dvh] sm:rounded-3xl"
      >
        <div className="z-10 flex shrink-0 items-start justify-between gap-3 border-b border-gray-100 bg-white px-4 py-4 sm:gap-4 sm:px-8 sm:py-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#DCFCE7] sm:h-11 sm:w-11">
              <Handshake
                size={22}
                className="text-[#2EAD45]"
                aria-hidden="true"
              />
            </div>

            <div>
              <h2
                id="partner-enquiry-title"
                className="text-lg font-bold text-[#0F172A] sm:text-xl"
              >
                Partner With BookFarmVilla
              </h2>
              <p className="mt-1 text-xs leading-5 text-gray-500 sm:text-sm">
                Share your business details and our team will get in touch.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-[#0F172A]"
            aria-label="Close partner enquiry form"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-8 sm:py-8">
          {isSuccessful ? (
            <div className="py-6 text-center sm:py-10">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#DCFCE7]">
                <CheckCircle2
                  size={34}
                  className="text-[#2EAD45]"
                  aria-hidden="true"
                />
              </div>

              <h3 className="mt-5 text-2xl font-bold text-[#0F172A]">
                Details Received
              </h3>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
                Your partner enquiry has been received. Our team will review
                it and get in touch with you shortly.
              </p>

              <button
                type="button"
                onClick={handleClose}
                className="mt-7 min-h-12 w-full rounded-xl bg-[#2EAD45] px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1E8A32] sm:w-auto"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="partner-business-name"
                    className="mb-1.5 block text-sm font-semibold text-[#0F172A]"
                  >
                    Name of Business <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="partner-business-name"
                    type="text"
                    value={formValues.businessName}
                    onChange={(event) =>
                      updateField("businessName", event.target.value)
                    }
                    placeholder="Enter your business name"
                    autoComplete="organization"
                    maxLength={80}
                    aria-invalid={Boolean(errors.businessName)}
                    className={inputClassName("businessName")}
                  />
                  {errors.businessName && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {errors.businessName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="full-name"
                    className="mb-1.5 block text-sm font-semibold text-[#0F172A]"
                  >
                    Your Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="full-name"
                    type="text"
                    value={formValues.fullName}
                    onChange={(event) =>
                      updateField("fullName", event.target.value)
                    }
                    placeholder="Enter your full name"
                    autoComplete="name"
                    maxLength={20}
                    aria-invalid={Boolean(errors.fullName)}
                    className={inputClassName("fullName")}
                  />
                  {errors.fullName && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    id="partner-business-type-label"
                    className="mb-1.5 block text-sm font-semibold text-[#0F172A]"
                  >
                    Business Type <span className="text-red-500">*</span>
                  </label>

                  <div
                    className="relative"
                    onBlur={(event) => {
                      const nextFocusedElement = event.relatedTarget;

                      if (
                        !(nextFocusedElement instanceof Node) ||
                        !event.currentTarget.contains(nextFocusedElement)
                      ) {
                        setIsBusinessTypeOpen(false);
                        setHighlightedBusinessTypeIndex(0);
                      }
                    }}
                  >
                    <button
                      id="partner-business-type"
                      type="button"
                      onClick={() => {
                        setIsBusinessTypeOpen((current) => !current);
                        setIsCityOpen(false);
                        setHighlightedBusinessTypeIndex(0);
                      }}
                      onKeyDown={handleBusinessTypeKeyDown}
                      aria-labelledby="partner-business-type-label partner-business-type"
                      aria-haspopup="listbox"
                      aria-expanded={isBusinessTypeOpen}
                      aria-controls="partner-business-type-options"
                      aria-activedescendant={
                        isBusinessTypeOpen
                          ? `partner-business-type-option-${highlightedBusinessTypeIndex}`
                          : undefined
                      }
                      aria-invalid={Boolean(errors.businessType)}
                      className={`${inputClassName("businessType")} flex items-center justify-between gap-3 text-left`}
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <Building2
                          size={17}
                          className="shrink-0 text-[#2EAD45]"
                          aria-hidden="true"
                        />
                        <span
                          className={`truncate ${
                            formValues.businessType
                              ? "text-[#0F172A]"
                              : "text-gray-400"
                          }`}
                        >
                          {formValues.businessType || "Select business type"}
                        </span>
                      </span>

                      <ChevronDown
                        size={17}
                        className={`shrink-0 text-gray-500 transition-transform ${
                          isBusinessTypeOpen ? "rotate-180" : ""
                        }`}
                        aria-hidden="true"
                      />
                    </button>

                    {isBusinessTypeOpen && (
                      <ul
                        id="partner-business-type-options"
                        role="listbox"
                        aria-label="Select business type"
                        className="absolute left-0 right-0 top-[calc(100%+0.4rem)] z-40 max-h-56 overflow-y-auto rounded-xl border border-gray-200 bg-white py-1 shadow-xl"
                      >
                        {visibleBusinessTypes.map((businessType, index) => {
                          const isActive =
                            index === highlightedBusinessTypeIndex;

                          return (
                            <li key={businessType}>
                              <button
                                id={`partner-business-type-option-${index}`}
                                type="button"
                                role="option"
                                aria-selected={false}
                                onMouseEnter={() =>
                                  setHighlightedBusinessTypeIndex(index)
                                }
                                onClick={() => {
                                  updateField("businessType", businessType);
                                  setIsBusinessTypeOpen(false);
                                  setHighlightedBusinessTypeIndex(0);
                                }}
                                className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium transition-colors ${
                                  isActive
                                    ? "bg-[#F0FDF4] text-[#1E8A32]"
                                    : "text-gray-700 hover:bg-gray-50"
                                }`}
                              >
                                <Building2
                                  size={15}
                                  className="shrink-0 text-[#2EAD45]"
                                  aria-hidden="true"
                                />
                                {businessType}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>

                  {errors.businessType && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {errors.businessType}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    id="partner-city-label"
                    className="mb-1.5 block text-sm font-semibold text-[#0F172A]"
                  >
                    City <span className="text-red-500">*</span>
                  </label>

                  <div
                    className="relative"
                    onBlur={(event) => {
                      const nextFocusedElement = event.relatedTarget;

                      if (
                        !(nextFocusedElement instanceof Node) ||
                        !event.currentTarget.contains(nextFocusedElement)
                      ) {
                        setIsCityOpen(false);
                        setHighlightedCityIndex(0);
                      }
                    }}
                  >
                    <button
                      id="partner-city"
                      type="button"
                      onClick={() => {
                        setIsCityOpen((current) => !current);
                        setIsBusinessTypeOpen(false);
                        setHighlightedCityIndex(0);
                      }}
                      onKeyDown={handleCityKeyDown}
                      aria-labelledby="partner-city-label partner-city"
                      aria-haspopup="listbox"
                      aria-expanded={isCityOpen}
                      aria-controls="partner-city-options"
                      aria-activedescendant={
                        isCityOpen
                          ? `partner-city-option-${highlightedCityIndex}`
                          : undefined
                      }
                      aria-invalid={Boolean(errors.city)}
                      className={`${inputClassName("city")} flex items-center justify-between gap-3 text-left`}
                    >
                      <span
                        className={
                          formValues.city
                            ? "text-[#0F172A]"
                            : "text-gray-400"
                        }
                      >
                        {formValues.city || "Select city"}
                      </span>

                      <ChevronDown
                        size={17}
                        className={`shrink-0 text-gray-500 transition-transform ${
                          isCityOpen ? "rotate-180" : ""
                        }`}
                        aria-hidden="true"
                      />
                    </button>

                    {isCityOpen && (
                      <ul
                        id="partner-city-options"
                        role="listbox"
                        aria-label="Select city"
                        className="absolute left-0 right-0 top-[calc(100%+0.4rem)] z-30 max-h-56 overflow-y-auto rounded-xl border border-gray-200 bg-white py-1 shadow-xl"
                      >
                        {visiblePartnerCities.map((city, index) => {
                          const isActive = index === highlightedCityIndex;

                          return (
                            <li key={city}>
                              <button
                                id={`partner-city-option-${index}`}
                                type="button"
                                role="option"
                                aria-selected={false}
                                onMouseEnter={() =>
                                  setHighlightedCityIndex(index)
                                }
                                onClick={() => {
                                  updateField("city", city);
                                  setIsCityOpen(false);
                                  setHighlightedCityIndex(0);
                                }}
                                className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium transition-colors ${
                                  isActive
                                    ? "bg-[#F0FDF4] text-[#1E8A32]"
                                    : "text-gray-700 hover:bg-gray-50"
                                }`}
                              >
                                <MapPin
                                  size={15}
                                  className="shrink-0 text-[#2EAD45]"
                                  aria-hidden="true"
                                />
                                {city}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>

                  {errors.city && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {errors.city}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="partner-address"
                    className="mb-1.5 block text-sm font-semibold text-[#0F172A]"
                  >
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="partner-address"
                    type="text"
                    value={formValues.location}
                    onChange={(event) =>
                      updateField("location", event.target.value)
                    }
                    placeholder="Enter complete business address"
                    autoComplete="street-address"
                    maxLength={200}
                    aria-invalid={Boolean(errors.location)}
                    className={inputClassName("location")}
                  />
                  {errors.location && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {errors.location}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="partner-phone"
                    className="mb-1.5 block text-sm font-semibold text-[#0F172A]"
                  >
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="partner-phone"
                    type="tel"
                    value={formValues.phone}
                    onChange={(event) =>
                      updateField("phone", event.target.value)
                    }
                    placeholder="+91 98765 43210"
                    autoComplete="tel"
                    inputMode="tel"
                    maxLength={18}
                    aria-invalid={Boolean(errors.phone)}
                    className={inputClassName("phone")}
                  />
                  {errors.phone && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              {submitError && (
                <div className="mt-5 break-words rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {submitError}
                </div>
              )}

              <div className="mt-6 flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleClose}
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
                  {isSubmitting ? "Submitting..." : "Submit Details"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}


