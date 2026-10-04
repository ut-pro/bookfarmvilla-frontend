"use client";

import { useState } from "react";
import Image from "next/image";
import {
  BriefcaseBusiness,
  MapPin,
  Star,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

import { useCallbackModal } from "@/components/callback/CallbackContext";
import { useVendorDetails } from "@/components/vendor/VendorDetailsContext";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import type {
  VendorCategory,
  VendorResponse,
} from "@/types/vendor";

const categoryLabels: Record<VendorCategory, string> = {
  CATERER: "Catering",
  PHOTOGRAPHER: "Photography",
  DJ: "DJ & Entertainment",
  DECORATOR: "Decoration",
  MAKEUP_ARTIST: "Other Event Services",
  OTHER: "Other Event Services",
};

function getPrimaryVendorImage(
  vendor: VendorResponse,
): string | null {
  const imageUrl = vendor.images
    ?.slice()
    .sort(
      (firstImage, secondImage) =>
        Number(secondImage.isPrimary) -
        Number(firstImage.isPrimary),
    )
    .map((image) => image.url?.trim())
    .find(Boolean);

  if (!imageUrl) {
    return null;
  }

  try {
    const parsedUrl = new URL(imageUrl);

    if (
      !["http:", "https:"].includes(parsedUrl.protocol) ||
      parsedUrl.hostname === "example.com"
    ) {
      return null;
    }

    return imageUrl;
  } catch {
    return null;
  }
}

export default function VendorCard({
  vendor,
}: {
  vendor: VendorResponse;
}) {
  const { openVendorCallback } = useCallbackModal();
  const { openVendorDetails } = useVendorDetails();
  const [imageFailed, setImageFailed] = useState(false);

  const imageUrl = getPrimaryVendorImage(vendor);
  const categoryLabel = categoryLabels[vendor.category];

  const whatsappUrl = buildWhatsAppUrl(
    `Hi BookFarmVilla team, I am interested in ${vendor.name} for ${categoryLabel}. Please share service availability and enquiry details.`,
  );
  const description =
    vendor.description?.trim() ||
    "Professional event services available for your celebration.";
  const priceDisplay =
    vendor.priceRange?.trim() || "Price on request";

  const hasRating =
    typeof vendor.averageRating === "number" &&
    Number.isFinite(vendor.averageRating);

  return (
    <article className="group relative flex h-full w-[300px] flex-shrink-0 snap-start flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl md:w-auto">
      <button
        type="button"
        onClick={() => openVendorDetails(vendor)}
        className="absolute inset-0 z-10 cursor-pointer rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2EAD45] focus-visible:ring-inset"
        aria-label={`View details for ${vendor.name}`}
      />
      <div className="relative h-[200px] shrink-0 overflow-hidden bg-[#F0FDF4]">
        {imageUrl && !imageFailed ? (
          <Image
            src={imageUrl}
            alt={`${vendor.name} in ${vendor.city}`}
            fill
            unoptimized
            sizes="(max-width: 767px) 300px, (max-width: 1023px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7] px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
              <BriefcaseBusiness
                size={26}
                className="text-[#2EAD45]"
                aria-hidden="true"
              />
            </div>

            <p className="mt-3 text-sm font-semibold text-[#1E8A32]">
              {categoryLabel}
            </p>
          </div>
        )}

        <span className="absolute left-3 top-3 rounded-full bg-[#2EAD45] px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
          {categoryLabel}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1 flex items-start justify-between gap-2">
          <h3
            className="line-clamp-1 text-base font-semibold leading-tight text-[#0F172A]"
            title={vendor.name}
          >
            {vendor.name}
          </h3>

          {hasRating && (
            <span
              className="flex shrink-0 items-center gap-1 text-xs font-semibold text-[#0F172A]"
              aria-label={`${vendor.averageRating} out of 5 rating`}
            >
              <Star
                size={13}
                className="fill-amber-400 text-amber-400"
                aria-hidden="true"
              />
              {vendor.averageRating?.toFixed(1)}
            </span>
          )}
        </div>

        <div className="mb-3 flex items-center gap-1 text-xs text-gray-500">
          <MapPin
            size={12}
            className="shrink-0"
            aria-hidden="true"
          />

          <span className="line-clamp-1">
            {vendor.city}
          </span>
        </div>

        <p className="mb-4 line-clamp-2 min-h-10 text-xs leading-5 text-gray-600">
          {description}
        </p>

        <div className="mt-auto border-t border-gray-100 pt-3">
          <div className="min-w-0">
            <p className="mb-0.5 text-[10px] font-medium text-gray-400">
              Service pricing
            </p>

            <p
              className="text-sm font-bold leading-tight text-[#0F172A]"
              title={priceDisplay}
            >
              {priceDisplay}
            </p>
          </div>

          <div className="relative z-20 mt-3 flex items-center gap-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`WhatsApp about ${vendor.name}`}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-50 text-[#1E8A32] transition-colors hover:bg-[#2EAD45] hover:text-white"
            >
              <FaWhatsapp
                size={17}
                aria-hidden="true"
              />
            </a>

            <button
              type="button"
              onClick={() => openVendorCallback(vendor)}
              className="flex h-10 flex-1 items-center justify-center whitespace-nowrap rounded-lg bg-[#DCFCE7] px-3 text-xs font-semibold text-[#1E8A32] transition-colors hover:bg-[#2EAD45] hover:text-white"
              aria-label={`Request a callback for ${vendor.name}`}
            >
              Request Callback
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}