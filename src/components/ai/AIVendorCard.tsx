"use client";

import { useState } from "react";
import Image from "next/image";
import {
  BriefcaseBusiness,
  Eye,
  MapPin,
  Star,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

import { useVendorDetails } from "@/components/vendor/VendorDetailsContext";
import { getVendorPriceDisplay } from "@/lib/formatters";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import type {
  VendorCategory,
  VendorResponse,
} from "@/types/vendor";

interface AIVendorCardProps {
  vendor: VendorResponse;
  distanceKm?: number;
}

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
      !["http:", "https:"].includes(
        parsedUrl.protocol,
      ) ||
      parsedUrl.hostname === "example.com"
    ) {
      return null;
    }

    return imageUrl;
  } catch {
    return null;
  }
}

export default function AIVendorCard({
  vendor,
  distanceKm,
}: AIVendorCardProps) {
  const { openVendorDetails } = useVendorDetails();

  const [imageFailed, setImageFailed] =
    useState(false);

  const imageUrl = getPrimaryVendorImage(vendor);
  const categoryLabel = categoryLabels[vendor.category];

  const priceDisplay = getVendorPriceDisplay(
    vendor.priceRange,
  );

  const whatsappUrl = buildWhatsAppUrl(
    `Hi BookFarmVilla team, I am interested in ${vendor.name} for ${categoryLabel}. Please share service availability and enquiry details.`,
  );

  const hasRating =
    typeof vendor.averageRating === "number" &&
    Number.isFinite(vendor.averageRating) &&
    vendor.averageRating > 0;

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="relative h-36 overflow-hidden bg-gray-100">
        {imageUrl && !imageFailed ? (
          <Image
            src={imageUrl}
            alt={`${vendor.name} in ${vendor.city}`}
            fill
            unoptimized
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7] text-[#1E8A32]">
            <BriefcaseBusiness
              size={28}
              aria-hidden="true"
            />

            <p className="mt-2 text-sm font-semibold">
              {categoryLabel}
            </p>
          </div>
        )}

        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold text-[#1E8A32] shadow">
          {categoryLabel}
        </span>
      </div>

      <div className="p-3.5">
        <div className="flex items-start justify-between gap-2">
          <h3
            className="line-clamp-1 text-sm font-bold text-[#0F172A]"
            title={vendor.name}
          >
            {vendor.name}
          </h3>

          {hasRating && (
            <span
              className="flex shrink-0 items-center gap-1 text-xs font-semibold text-amber-600"
              aria-label={`${vendor.averageRating} out of 5 rating`}
            >
              <Star
                size={12}
                className="fill-amber-400 text-amber-400"
                aria-hidden="true"
              />
              {vendor.averageRating?.toFixed(1)}
            </span>
          )}
        </div>

        <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
          <MapPin
            size={12}
            className="shrink-0"
            aria-hidden="true"
          />

          <span className="line-clamp-1">
            {vendor.city}
          </span>
        </p>

        {distanceKm !== undefined &&
          Number.isFinite(distanceKm) && (
            <p className="mt-1 text-xs font-medium text-[#1E8A32]">
              {distanceKm.toFixed(1)} km away
            </p>
          )}

        <div className="mt-3 flex min-h-7 items-center text-[11px] text-gray-600">
          <span className="flex items-center gap-1 rounded-full bg-gray-50 px-2 py-1">
            <BriefcaseBusiness
              size={12}
              className="text-[#2EAD45]"
              aria-hidden="true"
            />
            {categoryLabel}
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between gap-2 border-t border-gray-100 pt-3">
          <div className="min-w-0">
            <p className="text-[10px] font-medium text-gray-400">
              {priceDisplay.label || "Pricing"}
            </p>

            <p className="line-clamp-1 text-sm font-bold text-[#0F172A]">
              {priceDisplay.value}
            </p>
          </div>

          <div className="flex gap-1.5">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`WhatsApp about ${vendor.name}`}
              className="rounded-lg bg-green-50 p-2 text-[#1E8A32] transition-colors hover:bg-[#2EAD45] hover:text-white"
            >
              <FaWhatsapp
                size={17}
                aria-hidden="true"
              />
            </a>

            <button
              type="button"
              onClick={() => openVendorDetails(vendor)}
              className="flex items-center gap-1 rounded-lg bg-[#2EAD45] px-3 py-2 text-[11px] font-semibold text-white transition-colors hover:bg-[#1E8A32]"
              aria-label={`View details for ${vendor.name}`}
            >
              <Eye size={13} aria-hidden="true" />
              View
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}