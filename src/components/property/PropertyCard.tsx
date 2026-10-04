"use client";

import Image from "next/image";
import {
  BedDouble,
  MapPin,
  Users,
  Waves,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

import { useCallbackModal } from "@/components/callback/CallbackContext";
import { usePropertyDetails } from "@/components/property/PropertyDetailsContext";
import Rating from "@/components/ui/Rating";
import { getPropertyPriceDisplay } from "@/lib/formatters";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import type { PropertyCardData } from "@/types/property";

interface PropertyCardProps {
  property: PropertyCardData;
  onRequestCallback?: (property: PropertyCardData) => void;
}

export default function PropertyCard({
  property,
  onRequestCallback,
}: PropertyCardProps) {
  const { openPropertyCallback } = useCallbackModal();
  const { openPropertyDetails } = usePropertyDetails();

  const priceDisplay = getPropertyPriceDisplay(
    property.startingPrice,
    property.endingPrice,
    property.priceSuffix,
  );

  const whatsappUrl = buildWhatsAppUrl(
    `Hi BookFarmVilla team, I am interested in ${property.name}. Please share its availability and enquiry details.`,
  );

  const handleRequestCallback = () => {
    if (onRequestCallback) {
      onRequestCallback(property);
      return;
    }

    openPropertyCallback(property);
  };

  return (
    <article className="group relative flex h-full w-[300px] flex-shrink-0 snap-start flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl md:w-auto">
      <button
        type="button"
        onClick={() => openPropertyDetails(property)}
        className="absolute inset-0 z-10 cursor-pointer rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2EAD45] focus-visible:ring-inset"
        aria-label={`View details for ${property.name}`}
      />

      <div className="relative h-[200px] shrink-0 overflow-hidden">
        <Image
          src={property.imageUrl}
          alt={`${property.name} in ${property.location}`}
          fill
          unoptimized
          sizes="(max-width: 767px) 300px, (max-width: 1023px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {property.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-[#2EAD45] px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
            {property.badge}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
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

        <div className="mb-3 flex items-center gap-1 text-xs text-gray-500">
          <MapPin
            size={12}
            className="shrink-0"
            aria-hidden="true"
          />

          <span className="line-clamp-1">
            {property.location}
          </span>
        </div>

        <div className="mb-4 flex min-h-10 flex-wrap items-start gap-x-3 gap-y-2 text-xs text-gray-600">
          {property.guestCapacity > 0 && (
            <span className="flex items-center gap-1">
              <Users
                size={13}
                className="text-[#2EAD45]"
                aria-hidden="true"
              />
              Up to {property.guestCapacity} guests
            </span>
          )}

          {typeof property.bedrooms === "number" && (
            <span className="flex items-center gap-1">
              <BedDouble
                size={13}
                className="text-[#2EAD45]"
                aria-hidden="true"
              />
              {property.bedrooms} Beds
            </span>
          )}

          {property.hasPool && (
            <span className="flex items-center gap-1 text-blue-500">
              <Waves size={13} aria-hidden="true" />
              Pool
            </span>
          )}
        </div>

        <div className="mt-auto border-t border-gray-100 pt-3">
          <div className="min-w-0">
            <p className="mb-0.5 text-[10px] font-medium text-gray-400">
              {priceDisplay.label || "Pricing"}
            </p>

            <p className="text-sm font-bold leading-tight text-[#0F172A]">
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
