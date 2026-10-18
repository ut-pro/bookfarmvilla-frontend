"use client";

import {
  BriefcaseBusiness,
  MapPin,
  PhoneCall,
  Star,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

import { useCallbackModal } from "@/components/callback/CallbackContext";
import DetailsImageGallery from "@/components/ui/DetailsImageGallery";
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
  MAKEUP_ARTIST: "Makeup & Styling",
  OTHER: "Other Event Services",
};

function getVendorImageUrls(vendor: VendorResponse): string[] {
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
            ["http:", "https:"].includes(parsedUrl.protocol) &&
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
  const categoryLabel = categoryLabels[vendor.category];
  const imageUrls = getVendorImageUrls(vendor);

  const priceDisplay = getVendorPriceDisplay(vendor.priceRange);

  const hasRating =
    typeof vendor.averageRating === "number" &&
    Number.isFinite(vendor.averageRating) &&
    vendor.averageRating > 0;

  const whatsappUrl = buildWhatsAppUrl(
    `Hi BookFarmVilla team, I am interested in ${vendor.name} for ${categoryLabel}. Please share service availability and enquiry details.`,
  );

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm sm:rounded-3xl">
      {imageUrls.length > 0 ? (
        <DetailsImageGallery
          mediaUrls={imageUrls}
          title={vendor.name}
          badge={categoryLabel}
        />
      ) : (
        <div className="flex h-64 flex-col items-center justify-center bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7] px-6 text-center sm:h-80 lg:h-96">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-sm sm:h-24 sm:w-24">
            <BriefcaseBusiness
              size={40}
              className="text-[#2EAD45]"
              aria-hidden="true"
            />
          </div>

          <p className="mt-4 text-lg font-semibold text-[#1E8A32] sm:mt-5 sm:text-xl">
            {categoryLabel}
          </p>
        </div>
      )}

      <div className="p-4 sm:p-8 lg:p-10">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start sm:gap-6">
          <div className="min-w-0">
            <h1 className="break-words text-2xl font-bold leading-tight text-[#0F172A] sm:text-3xl lg:text-4xl">
              {vendor.name}
            </h1>

            <p className="mt-3 flex items-start gap-2 break-words text-sm leading-6 text-gray-500 sm:text-base">
              <MapPin
                size={18}
                className="mt-0.5 shrink-0 text-[#2EAD45]"
                aria-hidden="true"
              />
              <span className="min-w-0">{vendor.city}</span>
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
        </header>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_320px] xl:gap-10 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0">
            <section aria-label="Service provider summary">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="min-w-0 rounded-2xl bg-[#F8FAFC] p-4 sm:p-5">
                  <BriefcaseBusiness
                    size={21}
                    className="text-[#2EAD45]"
                    aria-hidden="true"
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Service category
                  </p>
                  <p className="mt-1 break-words text-sm font-semibold text-[#0F172A]">
                    {categoryLabel}
                  </p>
                </div>

                <div className="min-w-0 rounded-2xl bg-[#F8FAFC] p-4 sm:p-5">
                  <MapPin
                    size={21}
                    className="text-[#2EAD45]"
                    aria-hidden="true"
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Service location
                  </p>
                  <p className="mt-1 break-words text-sm font-semibold text-[#0F172A]">
                    {vendor.city}
                  </p>
                </div>
              </div>
            </section>

            <section
              className="mt-8 sm:mt-10"
              aria-labelledby="vendor-page-description"
            >
              <h2
                id="vendor-page-description"
                className="text-xl font-bold text-[#0F172A]"
              >
                About this service provider
              </h2>

              <p className="mt-4 whitespace-pre-line break-words text-sm leading-7 text-gray-600 sm:text-base sm:leading-8">
                {vendor.description?.trim() ||
                  "Professional event services available for your celebration."}
              </p>
            </section>
          </div>

          <aside className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-28">
            <p className="text-xs font-medium text-gray-400">
              {priceDisplay.label || "Pricing"}
            </p>

            <p
              className="mt-1 break-words text-2xl font-bold text-[#0F172A]"
              title={priceDisplay.value}
            >
              {priceDisplay.value}
            </p>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              Contact our team to confirm service availability and final pricing for your event.
            </p>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`WhatsApp about ${vendor.name}`}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#2EAD45] bg-green-50 px-4 text-sm font-semibold text-[#1E8A32] transition-colors hover:bg-[#2EAD45] hover:text-white"
              >
                <FaWhatsapp size={20} aria-hidden="true" />
                WhatsApp
              </a>

              <button
                type="button"
                onClick={() => openVendorCallback(vendor)}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#2EAD45] px-4 text-sm font-semibold text-white shadow-md shadow-green-500/20 transition-colors hover:bg-[#1E8A32]"
              >
                <PhoneCall size={18} aria-hidden="true" />
                Request Callback
              </button>
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}
