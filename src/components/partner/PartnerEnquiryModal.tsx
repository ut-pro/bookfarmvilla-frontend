"use client";

import {
  useCallback,
  useEffect,
  useState,
  type FormEvent,
} from "react";

import {
  Building2,
  CheckCircle2,
  Handshake,
  X,
} from "lucide-react";

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

export default function PartnerEnquiryModal({
  isOpen,
  onClose,
}: PartnerEnquiryModalProps) {
  const [formValues, setFormValues] =
    useState<PartnerFormValues>(initialFormValues);
  const [errors, setErrors] = useState<PartnerFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);

  const handleClose = useCallback(() => {
    setFormValues(initialFormValues);
    setErrors({});
    setIsSubmitting(false);
    setIsSuccessful(false);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, handleClose]);

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

  const validateForm = (): PartnerFormErrors => {
    const nextErrors: PartnerFormErrors = {};
    const phoneDigits = formValues.phone.replace(/\D/g, "");

    if (formValues.businessName.trim().length < 2) {
      nextErrors.businessName = "Please enter the business name.";
    }

    if (formValues.city.trim().length < 2) {
      nextErrors.city = "Please enter the city.";
    }

    if (formValues.fullName.trim().length < 2) {
      nextErrors.fullName = "Please enter your full name.";
    }

    if (!formValues.businessType) {
      nextErrors.businessType = "Please select a business type.";
    }

    if (formValues.location.trim().length < 5) {
      nextErrors.location = "Please enter the complete location.";
    }

    if (phoneDigits.length < 10 || phoneDigits.length > 13) {
      nextErrors.phone = "Please enter a valid phone number.";
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
    setIsSubmitting(true);

    const partnerEnquiry = {
      businessName: formValues.businessName.trim(),
      city: formValues.city.trim(),
      fullName: formValues.fullName.trim(),
      businessType: formValues.businessType,
      location: formValues.location.trim(),
      phone: formValues.phone.trim(),
    };

    // Frontend-only preview. Connect an API endpoint here later.
    console.log("Partner enquiry:", partnerEnquiry);

    await new Promise((resolve) => {
      window.setTimeout(resolve, 500);
    });

    setIsSubmitting(false);
    setIsSuccessful(true);
  };

  const inputClassName = (field: PartnerFormField) =>
    `w-full rounded-xl border bg-white px-4 py-3 text-sm text-[#0F172A] outline-none transition-colors placeholder:text-gray-400 ${
      errors[field]
        ? "border-red-400 focus:border-red-500"
        : "border-gray-200 focus:border-[#2EAD45]"
    }`;

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
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
        className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-gray-100 bg-white px-6 py-5 sm:px-8">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#DCFCE7]">
              <Handshake
                size={22}
                className="text-[#2EAD45]"
                aria-hidden="true"
              />
            </div>

            <div>
              <h2
                id="partner-enquiry-title"
                className="text-xl font-bold text-[#0F172A]"
              >
                Partner With BookFarmVilla
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Share your business details and our team will get in touch.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-[#0F172A]"
            aria-label="Close partner enquiry form"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="px-6 py-6 sm:px-8 sm:py-8">
          {isSuccessful ? (
            <div className="py-10 text-center">
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
                Your partner enquiry has been captured in the frontend
                preview. Submission to the backend can be connected later.
              </p>

              <button
                type="button"
                onClick={handleClose}
                className="mt-7 rounded-xl bg-[#2EAD45] px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1E8A32]"
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
                    htmlFor="partner-business-type"
                    className="mb-1.5 block text-sm font-semibold text-[#0F172A]"
                  >
                    Business Type <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2
                      size={17}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#2EAD45]"
                      aria-hidden="true"
                    />
                    <select
                      id="partner-business-type"
                      value={formValues.businessType}
                      onChange={(event) =>
                        updateField("businessType", event.target.value)
                      }
                      className={`${inputClassName("businessType")} pl-11`}
                    >
                      <option value="">Select business type</option>
                      {businessTypes.map((businessType) => (
                        <option key={businessType} value={businessType}>
                          {businessType}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.businessType && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {errors.businessType}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="partner-city"
                    className="mb-1.5 block text-sm font-semibold text-[#0F172A]"
                  >
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="partner-city"
                    type="text"
                    value={formValues.city}
                    onChange={(event) => updateField("city", event.target.value)}
                    placeholder="Enter city"
                    autoComplete="address-level2"
                    className={inputClassName("city")}
                  />
                  {errors.city && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {errors.city}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="partner-location"
                    className="mb-1.5 block text-sm font-semibold text-[#0F172A]"
                  >
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="partner-location"
                    type="text"
                    value={formValues.location}
                    onChange={(event) =>
                      updateField("location", event.target.value)
                    }
                    placeholder="Enter complete business location or address"
                    autoComplete="street-address"
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
                    className={inputClassName("phone")}
                  />
                  {errors.phone && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6 flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleClose}
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
