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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
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
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
      >
        {/* Modal header */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-gray-100 bg-white px-6 py-5 sm:px-8">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#DCFCE7]">
              <PhoneCall
                size={21}
                className="text-[#2EAD45]"
                aria-hidden="true"
              />
            </div>

            <div>
              <h2
                id="callback-modal-title"
                className="text-xl font-bold text-[#0F172A]"
              >
                Request a Callback
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Our team will contact you regarding your selected property.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-[#0F172A]"
            aria-label="Close callback form"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {/* Modal content */}
        <div className="px-6 py-6 sm:px-8 sm:py-8">
          {isSuccessful ? (
            <div className="py-8 text-center">
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
                Your callback request has been submitted successfully.
                Our team will contact you shortly regarding the selected
                property.
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
            <CallbackForm
              key={selectedProperty?.id ?? "general-enquiry"}
              initialProperty={selectedProperty}
              onSuccess={() => setIsSuccessful(true)}
              onCancel={handleClose}
            />
          )}
        </div>
      </div>
    </div>
  );
}