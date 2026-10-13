"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  CheckCircle2,
  PhoneCall,
  X,
} from "lucide-react";

import CallbackForm from "@/components/callback/CallbackForm";
import { useCallbackModal } from "@/components/callback/CallbackContext";

export default function CallbackModal() {
  const {
    isOpen,
    selectedProperty,
    selectedVendor,
    closeCallback,
  } = useCallbackModal();

  const [isSuccessful, setIsSuccessful] =
    useState(false);

  const handleClose = useCallback(() => {
    setIsSuccessful(false);
    closeCallback();
  }, [closeCallback]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, [isOpen, handleClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex h-[100dvh] items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          handleClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="callback-modal-title"
        className="relative flex max-h-[calc(100dvh-0.5rem)] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:max-h-[90dvh] sm:rounded-3xl"
      >
        {/* Modal header */}
        <div className="z-10 flex shrink-0 items-start justify-between gap-3 border-b border-gray-100 bg-white px-4 py-4 sm:gap-4 sm:px-8 sm:py-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#DCFCE7] sm:h-11 sm:w-11">
              <PhoneCall
                size={21}
                className="text-[#2EAD45]"
                aria-hidden="true"
              />
            </div>

            <div>
              <h2
                id="callback-modal-title"
                className="text-lg font-bold text-[#0F172A] sm:text-xl"
              >
                Request a Callback
              </h2>

              <p className="mt-1 text-xs leading-5 text-gray-500 sm:text-sm">
                {selectedVendor
                  ? "Our team will contact you regarding your selected service provider."
                  : selectedProperty
                    ? "Our team will contact you regarding your selected property."
                    : "Our team will contact you regarding your enquiry."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-[#0F172A]"
            aria-label="Close callback form"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {/* Modal content */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-8 sm:py-8">
          {isSuccessful ? (
            <div className="py-6 text-center sm:py-8">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#DCFCE7]">
                <CheckCircle2
                  size={32}
                  className="text-[#2EAD45]"
                  aria-hidden="true"
                />
              </div>

              <h3 className="mt-5 text-2xl font-bold text-[#0F172A]">
                Request Submitted
              </h3>

              <p
                className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500"
                role="status"
              >
                Your callback request has been submitted successfully. Our team
                will contact you shortly regarding{" "}
                {selectedVendor
                  ? "the selected service provider."
                  : selectedProperty
                    ? "the selected property."
                    : "your enquiry."}
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
            <CallbackForm
              key={
                selectedVendor
                  ? `vendor-${selectedVendor.id}`
                  : selectedProperty
                    ? `property-${selectedProperty.id}`
                    : "general-enquiry"
              }
              initialProperty={selectedProperty}
              initialVendor={selectedVendor}
              onSuccess={() => setIsSuccessful(true)}
              onCancel={handleClose}
            />
          )}
        </div>
      </div>
    </div>
  );
}
