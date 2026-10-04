"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  MapPin,
  PhoneCall,
  Star,
  X,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

import { useCallbackModal } from "@/components/callback/CallbackContext";
import { getVendorPriceDisplay } from "@/lib/formatters";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import type {
  VendorCategory,
  VendorResponse,
} from "@/types/vendor";

interface VendorDetailsModalProps {
  vendor: VendorResponse;
  onClose: () => void;
}

const categoryLabels: Record<VendorCategory, string> = {
  CATERER: "Catering",
  PHOTOGRAPHER: "Photography",
  DJ: "DJ & Entertainment",
  DECORATOR: "Decoration",
  MAKEUP_ARTIST: "Other Event Services",
  OTHER: "Other Event Services",
};

function getVendorImageUrls(
  vendor: VendorResponse,
): string[] {
  return (
    vendor.images
      ?.slice()
      .sort(
        (firstImage, secondImage) =>
          Number(secondImage.isPrimary) -
          Number(firstImage.isPrimary),
      )
      .map((image) => image.url?.trim())
      .filter((imageUrl): imageUrl is string => {
        if (!imageUrl) {
          return false;
        }

        try {
          const parsedUrl = new URL(imageUrl);

          return (
            ["http:", "https:"].includes(
              parsedUrl.protocol,
            ) &&
            parsedUrl.hostname !== "example.com"
          );
        } catch {
          return false;
        }
      }) ?? []
  );
}

export default function VendorDetailsModal({
  vendor,
  onClose,
}: VendorDetailsModalProps) {
  const { openVendorCallback } = useCallbackModal();

  const [activeImageIndex, setActiveImageIndex] =
    useState(0);

  const [failedImageUrls, setFailedImageUrls] =
    useState<string[]>([]);

  const categoryLabel = categoryLabels[vendor.category];

  const imageUrls = getVendorImageUrls(vendor).filter(
    (imageUrl) => !failedImageUrls.includes(imageUrl),
  );

  const safeImageIndex = Math.min(
    activeImageIndex,
    Math.max(imageUrls.length - 1, 0),
  );

  const activeImageUrl =
    imageUrls[safeImageIndex] ?? null;

  const priceDisplay = getVendorPriceDisplay(
    vendor.priceRange,
  );

  const hasRating =
    typeof vendor.averageRating === "number" &&
    Number.isFinite(vendor.averageRating);

  const whatsappUrl = buildWhatsAppUrl(
    `Hi BookFarmVilla team, I am interested in ${vendor.name} for ${categoryLabel}. Please share service availability and enquiry details.`,
  );

  const closeModal = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
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
  }, [closeModal]);

  const showPreviousImage = () => {
    setActiveImageIndex((currentIndex) =>
      currentIndex === 0
        ? imageUrls.length - 1
        : currentIndex - 1,
    );
  };

  const showNextImage = () => {
    setActiveImageIndex((currentIndex) =>
      currentIndex === imageUrls.length - 1
        ? 0
        : currentIndex + 1,
    );
  };

  const handleImageError = (imageUrl: string) => {
    setFailedImageUrls((currentUrls) =>
      currentUrls.includes(imageUrl)
        ? currentUrls
        : [...currentUrls, imageUrl],
    );
  };

  const handleRequestCallback = () => {
    onClose();
    openVendorCallback(vendor);
  };

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/65 p-3 backdrop-blur-md sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          closeModal();
        }
      }}
    >
      <article
        role="dialog"
        aria-modal="true"
        aria-labelledby="vendor-details-title"
        className="scrollbar-hide relative max-h-[94vh] w-full max-w-4xl overflow-y-auto overscroll-contain rounded-3xl bg-white shadow-2xl"
      >
        <div className="relative h-64 overflow-hidden rounded-t-3xl bg-[#F0FDF4] sm:h-80 lg:h-[390px]">
          {activeImageUrl ? (
            <Image
              key={activeImageUrl}
              src={activeImageUrl}
              alt={`${vendor.name} — image ${
                safeImageIndex + 1
              }`}
              fill
              priority
              unoptimized
              sizes="(max-width: 1024px) 100vw, 896px"
              className="object-cover"
              onError={() =>
                handleImageError(activeImageUrl)
              }
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7] px-6 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-sm">
                <BriefcaseBusiness
                  size={36}
                  className="text-[#2EAD45]"
                  aria-hidden="true"
                />
              </div>

              <p className="mt-4 text-lg font-semibold text-[#1E8A32]">
                {categoryLabel}
              </p>
            </div>
          )}

          {activeImageUrl && (
            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/55 to-transparent" />
          )}

          <button
            type="button"
            onClick={closeModal}
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm transition-colors hover:bg-black/65"
            aria-label="Close vendor details"
          >
            <X size={21} aria-hidden="true" />
          </button>

          <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-[#1E8A32] shadow-sm backdrop-blur-sm">
            {categoryLabel}
          </span>

          {imageUrls.length > 1 && (
            <>
              <button
                type="button"
                onClick={showPreviousImage}
                className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm transition-colors hover:bg-black/65"
                aria-label="Show previous vendor image"
              >
                <ChevronLeft
                  size={24}
                  aria-hidden="true"
                />
              </button>

              <button
                type="button"
                onClick={showNextImage}
                className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm transition-colors hover:bg-black/65"
                aria-label="Show next vendor image"
              >
                <ChevronRight
                  size={24}
                  aria-hidden="true"
                />
              </button>

              <span className="absolute bottom-4 right-4 rounded-full bg-black/45 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                {safeImageIndex + 1} / {imageUrls.length}
              </span>
            </>
          )}
        </div>

        <div className="px-6 py-6 sm:px-8 sm:py-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
            <div className="min-w-0">
              <h2
                id="vendor-details-title"
                className="text-2xl font-bold leading-tight text-[#0F172A] sm:text-3xl"
              >
                {vendor.name}
              </h2>

              <p className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                <MapPin
                  size={17}
                  className="shrink-0 text-[#2EAD45]"
                  aria-hidden="true"
                />
                {vendor.city}
              </p>
            </div>

            {hasRating && (
              <div
                className="flex shrink-0 items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 text-amber-700"
                aria-label={`${vendor.averageRating} out of 5 stars`}
              >
                <Star
                  size={17}
                  className="fill-amber-400 text-amber-400"
                  aria-hidden="true"
                />
                <span className="font-bold">
                  {vendor.averageRating?.toFixed(1)}
                </span>
              </div>
            )}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-[#F8FAFC] p-4">
              <BriefcaseBusiness
                size={20}
                className="text-[#2EAD45]"
                aria-hidden="true"
              />
              <p className="mt-2 text-xs text-gray-500">
                Service category
              </p>
              <p className="mt-1 text-sm font-semibold text-[#0F172A]">
                {categoryLabel}
              </p>
            </div>

            <div className="rounded-2xl bg-[#F8FAFC] p-4">
              <MapPin
                size={20}
                className="text-[#2EAD45]"
                aria-hidden="true"
              />
              <p className="mt-2 text-xs text-gray-500">
                Service location
              </p>
              <p className="mt-1 text-sm font-semibold text-[#0F172A]">
                {vendor.city}
              </p>
            </div>
          </div>

          <section
            className="mt-8"
            aria-labelledby="vendor-description"
          >
            <h3
              id="vendor-description"
              className="text-lg font-bold text-[#0F172A]"
            >
              About this service provider
            </h3>

            <p className="mt-3 text-sm leading-7 text-gray-600">
              {vendor.description?.trim() ||
                "Professional event services available for your celebration."}
            </p>
          </section>

          <div className="mt-8 flex flex-col gap-4 border-t border-gray-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-medium text-gray-400">
                {priceDisplay.label || "Pricing"}
              </p>

              <p className="mt-1 text-xl font-bold text-[#0F172A]">
                {priceDisplay.value}
              </p>
            </div>

            <div className="flex w-full items-center gap-2 sm:w-auto">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`WhatsApp about ${vendor.name}`}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-50 text-[#1E8A32] transition-colors hover:bg-[#2EAD45] hover:text-white"
              >
                <FaWhatsapp
                  size={20}
                  aria-hidden="true"
                />
              </a>

              <button
                type="button"
                onClick={handleRequestCallback}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#2EAD45] px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-green-500/20 transition-colors hover:bg-[#1E8A32] sm:flex-none"
              >
                <PhoneCall
                  size={18}
                  aria-hidden="true"
                />
                Request Callback
              </button>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}