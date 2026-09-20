"use client";

import Image from "next/image";
import {
  BedDouble,
  MapPin,
  Users,
  Waves,
} from "lucide-react";

import Rating from "@/components/ui/Rating";
import { formatIndianCurrency } from "@/lib/formatters";
import type { PropertyCardData } from "@/types/property";
import { useCallbackModal } from "@/components/callback/CallbackContext";

interface PropertyCardProps {
  property: PropertyCardData;
  onRequestCallback?: (property: PropertyCardData) => void;
}

export default function PropertyCard({
  property,
  onRequestCallback,
}: PropertyCardProps) {
   const { openPropertyCallback } = useCallbackModal();

  const handleRequestCallback = () => {
    if (onRequestCallback) {
      onRequestCallback(property);
      return;
    }

    openPropertyCallback(property);
  };

  return (
    <article className="group w-[300px] flex-shrink-0 snap-start overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl md:w-auto">
      {/* Property image */}
      <div className="relative h-[200px] overflow-hidden">
        <Image
          src={property.imageUrl}
          alt={`${property.name} in ${property.location}`}
          fill
          sizes="(max-width: 767px) 300px, (max-width: 1023px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Optional property badge */}
        {property.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-[#2EAD45] px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
            {property.badge}
          </span>
        )}
      </div>

      {/* Property information */}
      <div className="p-4">
        {/* Property name and rating */}
        <div className="mb-1 flex items-start justify-between gap-2">
          <h3
            className="line-clamp-1 text-base font-semibold leading-tight text-[#0F172A]"
            title={property.name}
          >
            {property.name}
          </h3>

          <Rating
            rating={property.rating}
            reviewCount={property.reviewCount}
          />
        </div>

        {/* Location */}
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

        {/* Property highlights */}
        <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-gray-600">
          <span className="flex items-center gap-1">
            <Users
              size={13}
              className="text-[#2EAD45]"
              aria-hidden="true"
            />

            {property.guestCapacity} Guests
          </span>

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

        {/* Price and callback action */}
        <div className="flex items-end justify-between gap-2 border-t border-gray-100 pt-3">
          <div className="min-w-0">
            {typeof property.startingPrice === "number" ? (
              <>
                <p className="mb-0.5 text-[10px] font-medium text-gray-400">
                  Starting from
                </p>

                <div>
                  <span className="text-lg font-bold text-[#0F172A]">
                    {formatIndianCurrency(property.startingPrice)}
                  </span>

                  {property.priceSuffix && (
                    <span className="ml-1 text-xs text-gray-400">
                      {property.priceSuffix}
                    </span>
                  )}
                </div>
              </>
            ) : (
              <p className="text-sm font-semibold text-[#0F172A]">
                Price on request
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleRequestCallback}
            className="shrink-0 whitespace-nowrap rounded-lg bg-[#DCFCE7] px-3 py-2 text-xs font-semibold text-[#1E8A32] transition-colors hover:bg-[#2EAD45] hover:text-white"
            aria-label={`Request a callback for ${property.name}`}
          >
            Request Callback
          </button>
        </div>
      </div>
    </article>
  );
}