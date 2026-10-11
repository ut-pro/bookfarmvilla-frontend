"use client";

import { useState } from "react";
import Image from "next/image";
import {
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  MapPin,
  PhoneCall,
  Star,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

import { useCallbackModal } from "@/components/callback/CallbackContext";
import { getVendorPriceDisplay } from "@/lib/formatters";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import type {
  VendorCategory,
  VendorResponse,
} from "@/types/vendor";

interface VendorDetailsPageContentProps {
  vendor: VendorResponse;
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

export default function VendorDetailsPageContent({
  vendor,
}: VendorDetailsPageContentProps) {
  const { openVendorCallback } = useCallbackModal();

  const [activeImageIndex, setActiveImageIndex] =
    useState(0);

  const [failedImageUrls, setFailedImageUrls] =
    useState<string[]>([]);

  const categoryLabel =
    categoryLabels[vendor.category];

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
    Number.isFinite(vendor.averageRating) &&
    vendor.averageRating > 0;

  const whatsappUrl = buildWhatsAppUrl(
    `Hi BookFarmVilla team, I am interested in ${vendor.name} for ${categoryLabel}. Please share service availability and enquiry details.`,
  );

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

  return (
    <article className="overflow-hidden rounded-3xl bg-white shadow-xl">
      <div className="relative h-72 overflow-hidden bg-[#F0FDF4] sm:h-96 lg:h-[520px]">
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
            sizes="(max-width: 1280px) 100vw, 1200px"
            className="object-cover"
            onError={() =>
              handleImageError(activeImageUrl)
            }
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7] px-6 text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-white shadow-sm">
              <BriefcaseBusiness
                size={42}
                className="text-[#2EAD45]"
                aria-hidden="true"
              />
            </div>

            <p className="mt-5 text-xl font-semibold text-[#1E8A32]">
              {categoryLabel}
            </p>
          </div>
        )}

        {activeImageUrl && (
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/55 to-transparent" />
        )}

        <span className="absolute left-5 top-5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-[#1E8A32] shadow-sm">
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

            <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2 rounded-full bg-black/40 px-3 py-2 backdrop-blur-sm">
              {imageUrls.map((imageUrl, index) => (
                <button
                  key={`${imageUrl}-${index}`}
                  type="button"
                  onClick={() =>
                    setActiveImageIndex(index)
                  }
                  className={`h-2 rounded-full transition-all ${
                    safeImageIndex === index
                      ? "w-6 bg-white"
                      : "w-2 bg-white/60 hover:bg-white"
                  }`}
                  aria-label={`Show vendor image ${
                    index + 1
                  }`}
                  aria-current={
                    safeImageIndex === index
                      ? "true"
                      : undefined
                  }
                />
              ))}
            </div>

            <span className="absolute bottom-5 right-5 rounded-full bg-black/45 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
              {safeImageIndex + 1} / {imageUrls.length}
            </span>
          </>
        )}
      </div>

      <div className="p-6 sm:p-8 lg:p-10">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold leading-tight text-[#0F172A] sm:text-4xl">
              {vendor.name}
            </h1>

            <p className="mt-3 flex items-center gap-2 text-sm text-gray-500 sm:text-base">
              <MapPin
                size={18}
                className="shrink-0 text-[#2EAD45]"
                aria-hidden="true"
              />
              {vendor.city}
            </p>
          </div>

          {hasRating && (
            <div
              className="flex w-fit shrink-0 items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 text-amber-700"
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

        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-[#F8FAFC] p-5">
            <BriefcaseBusiness
              size={21}
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

          <div className="rounded-2xl bg-[#F8FAFC] p-5">
            <MapPin
              size={21}
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
          className="mt-10"
          aria-labelledby="vendor-page-description"
        >
          <h2
            id="vendor-page-description"
            className="text-xl font-bold text-[#0F172A]"
          >
            About this service provider
          </h2>

          <p className="mt-3 text-sm leading-7 text-gray-600 sm:text-base">
            {vendor.description?.trim() ||
              "Professional event services available for your celebration."}
          </p>
        </section>

        <div className="mt-10 flex flex-col gap-5 border-t border-gray-100 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium text-gray-400">
              {priceDisplay.label || "Pricing"}
            </p>

            <p className="mt-1 text-2xl font-bold text-[#0F172A]">
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
              onClick={() =>
                openVendorCallback(vendor)
              }
              className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#2EAD45] px-6 text-sm font-semibold text-white shadow-md shadow-green-500/20 transition-colors hover:bg-[#1E8A32] sm:flex-none"
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
  );
}