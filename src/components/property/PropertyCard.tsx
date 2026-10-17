"use client";

import {
  MapPin,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import AmenityIcon from "@/components/ui/AmenityIcon";

import { useCallbackModal } from "@/components/callback/CallbackContext";
import { useUserLocation } from "@/components/location/UserLocationContext";
import { calculateDistanceInKm } from "@/lib/distance";
import Rating from "@/components/ui/Rating";
import { getPropertyPriceDisplay } from "@/lib/formatters";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import type { PropertyCardData } from "@/types/property";

interface PropertyCardProps {
  property: PropertyCardData;
  onRequestCallback?: (property: PropertyCardData) => void;
  displayMode?: "grid" | "carousel";
}

export default function PropertyCard({
  property,
  onRequestCallback,
  displayMode = "grid",
}: PropertyCardProps) {
  const { openPropertyCallback } = useCallbackModal();

  const { location: userLocation } =
    useUserLocation();

  const distanceKm = userLocation
    ? calculateDistanceInKm(userLocation, property)
    : undefined;

  const priceDisplay = getPropertyPriceDisplay(
    property.startingPrice,
    property.endingPrice,
    property.priceSuffix,
  );

  const whatsappUrl = buildWhatsAppUrl(
    `Hi BookFarmVilla team, I am interested in ${property.name}. Please share its availability and enquiry details.`,
  );

  const availableAmenities =
    property.amenities
      ?.map((amenity) => amenity.trim())
      .filter(Boolean) ?? [];

  const visibleAmenities =
    availableAmenities.slice(0, 2);

  const remainingAmenityCount = Math.max(
    availableAmenities.length -
      visibleAmenities.length,
    0,
  );

  const handleRequestCallback = () => {
    if (onRequestCallback) {
      onRequestCallback(property);
      return;
    }

    openPropertyCallback(property);
  };

  
  const propertyDetailIdentifier = property.slug?.trim() || property.id;


  return (
    <article
      className={`group relative flex h-full flex-shrink-0 flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl ${
        displayMode === "carousel"
          ? "w-[82vw] min-w-[260px] max-w-[320px] snap-start md:w-auto md:min-w-0 md:max-w-none"
          : "w-full min-w-0 max-w-[420px] sm:max-w-none"
      }`}
    >
      <Link
        href={`/properties/${encodeURIComponent(
          propertyDetailIdentifier,
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute inset-0 z-10 cursor-pointer rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2EAD45] focus-visible:ring-inset"
        aria-label={`Open details for ${property.name} in a new tab`}
      />

      <div className="relative h-44 shrink-0 overflow-hidden sm:h-[200px]">
        <Image
          src={property.imageUrl}
          alt={`${property.name} in ${property.location}`}
          fill
          unoptimized
          sizes="(max-width: 639px) 82vw, (max-width: 1023px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {property.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-[#2EAD45] px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
            {property.badge}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        <div className="mb-1 flex items-start justify-between gap-2">
          <h3
            className="line-clamp-1 text-base font-semibold leading-tight text-[#0F172A]"
            title={property.name}
          >
            {property.name}
          </h3>

          {typeof property.rating === "number" && (
            <Rating
              rating={property.rating}
              reviewCount={property.reviewCount}
            />
          )}
        </div>

        <div className="mb-3">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <MapPin
              size={12}
              className="shrink-0"
              aria-hidden="true"
            />

            <span className="line-clamp-1">
              {property.location}
            </span>
          </div>

          {distanceKm !== undefined && (
            <p className="mt-1 text-xs font-medium text-[#1E8A32]">
              {distanceKm.toFixed(1)} km away
            </p>
          )}
        </div>

        <div className="mb-4 flex min-h-16 flex-wrap content-start items-start gap-1.5 text-xs text-gray-600 sm:gap-2">
          {property.guestCapacity > 0 && (
            <span className="flex items-center gap-1">
              <Users
                size={13}
                className="shrink-0 text-[#2EAD45]"
                aria-hidden="true"
              />
              Up to {property.guestCapacity} guests
            </span>
          )}

          {visibleAmenities.map((amenity) => (
            <span
              key={amenity}
              className="flex max-w-full items-center gap-1.5 rounded-full bg-[#F8FAFC] px-2.5 py-1 text-[11px] font-medium text-gray-600"
              title={amenity}
            >
              <AmenityIcon
                amenity={amenity}
                size={13}
                className="shrink-0 text-[#2EAD45]"
              />

              <span className="line-clamp-1">
                {amenity}
              </span>
            </span>
          ))}

          {remainingAmenityCount > 0 && (
            <span className="rounded-full bg-[#DCFCE7] px-2.5 py-1 text-[11px] font-semibold text-[#1E8A32]">
              +{remainingAmenityCount} more
            </span>
          )}

          {property.guestCapacity <= 0 &&
            visibleAmenities.length === 0 && (
              <span className="text-xs text-gray-400">
                Details available on request
              </span>
            )}
        </div>

        <div className="mt-auto border-t border-gray-100 pt-3">
          <div className="min-w-0">
            <p className="mb-0.5 text-[10px] font-medium text-gray-400">
              {priceDisplay.label || "Pricing"}
            </p>

            <p
              className="break-words text-sm font-bold leading-tight text-[#0F172A]"
              title={priceDisplay.value}
            >
              {priceDisplay.value}
            </p>
          </div>

          <div className="relative z-20 mt-3 flex items-center gap-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`WhatsApp about ${property.name}`}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-50 text-[#1E8A32] transition-colors hover:bg-[#2EAD45] hover:text-white"
            >
              <FaWhatsapp
                size={17}
                aria-hidden="true"
              />
            </a>

            <button
              type="button"
              onClick={handleRequestCallback}
              className="flex h-10 flex-1 items-center justify-center whitespace-nowrap rounded-lg bg-[#DCFCE7] px-3 text-xs font-semibold text-[#1E8A32] transition-colors hover:bg-[#2EAD45] hover:text-white"
              aria-label={`Request a callback for ${property.name}`}
            >
              Request Callback
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

