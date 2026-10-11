"use client";

import {
  Building2,
  MapPin,
  PhoneCall,
  Star,
  Users,
  Sparkles,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import AmenityIcon from "@/components/ui/AmenityIcon";
import DetailsImageGallery from "@/components/ui/DetailsImageGallery";

import { useCallbackModal } from "@/components/callback/CallbackContext";
import { useUserLocation } from "@/components/location/UserLocationContext";
import { calculateDistanceInKm } from "@/lib/distance";
import { getPropertyPriceDisplay } from "@/lib/formatters";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import type {
  PropertyCardData,
  PropertyType,
} from "@/types/property";

interface PropertyDetailsPageContentProps {
  property: PropertyCardData;
}

const propertyTypeLabels: Record<PropertyType, string> = {
  FARMHOUSE: "Farmhouse",
  VILLA: "Villa",
  WEDDING_LAWN: "Wedding Lawn",
};

export default function PropertyDetailsPageContent({
  property,
}: PropertyDetailsPageContentProps) {

  const { openPropertyCallback } = useCallbackModal();
  const { location: userLocation } =
    useUserLocation();

  const images =
    property.imageUrls && property.imageUrls.length > 0
      ? property.imageUrls
      : [property.imageUrl];

  const amenityCount =
    property.amenities?.length ?? 0;

  const priceDisplay = getPropertyPriceDisplay(
    property.startingPrice,
    property.endingPrice,
    property.priceSuffix,
  );

  const distanceKm = userLocation
    ? calculateDistanceInKm(userLocation, property)
    : undefined;

  const whatsappUrl = buildWhatsAppUrl(
    `Hi BookFarmVilla team, I am interested in ${property.name}. Please share its availability and enquiry details.`,
  );

  return (
    <article className="overflow-hidden rounded-3xl border border-gray-100 bg-white">
      <DetailsImageGallery
        images={images}
        title={property.name}
        badge={propertyTypeLabels[property.type]}
      />

      <div className="p-6 sm:p-8 lg:p-10">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold leading-tight text-[#0F172A] sm:text-4xl">
              {property.name}
            </h1>

            <p className="mt-3 flex items-start gap-2 text-sm leading-6 text-gray-500 sm:text-base">
              <MapPin
                size={18}
                className="mt-0.5 shrink-0 text-[#2EAD45]"
                aria-hidden="true"
              />
              {property.location}
            </p>

            {distanceKm !== undefined && (
              <p className="mt-2 text-sm font-semibold text-[#1E8A32]">
                {distanceKm.toFixed(1)} km away from your
                location
              </p>
            )}
          </div>

          {typeof property.rating === "number" && (
            <div
              className="flex w-fit shrink-0 items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 text-amber-700"
              aria-label={`${property.rating} out of 5 stars`}
            >
              <Star
                size={17}
                className="fill-amber-400 text-amber-400"
                aria-hidden="true"
              />
              <span className="font-bold">
                {property.rating}
              </span>
            </div>
          )}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-[#F8FAFC] p-5">
            <Building2
              size={21}
              className="text-[#2EAD45]"
              aria-hidden="true"
            />
            <p className="mt-2 text-xs text-gray-500">
              Property type
            </p>
            <p className="mt-1 text-sm font-semibold text-[#0F172A]">
              {propertyTypeLabels[property.type]}
            </p>
          </div>

          <div className="rounded-2xl bg-[#F8FAFC] p-5">
            <Users
              size={21}
              className="text-[#2EAD45]"
              aria-hidden="true"
            />
            <p className="mt-2 text-xs text-gray-500">
              Guest capacity
            </p>
            <p className="mt-1 text-sm font-semibold text-[#0F172A]">
              {property.guestCapacity > 0
                ? `Up to ${property.guestCapacity} guests`
                : "Contact for capacity"}
            </p>
          </div>

          <div className="rounded-2xl bg-[#F8FAFC] p-5">
            <Sparkles
              size={21}
              className="text-[#2EAD45]"
              aria-hidden="true"
            />

            <p className="mt-2 text-xs text-gray-500">
              Amenities
            </p>

            <p className="mt-1 text-sm font-semibold text-[#0F172A]">
              {amenityCount > 0
                ? `${amenityCount} ${
                    amenityCount === 1
                      ? "amenity"
                      : "amenities"
                  } included`
                : "Contact for amenities"}
            </p>
          </div>
        </div>

        {property.description && (
          <section
            className="mt-10"
            aria-labelledby="property-page-description"
          >
            <h2
              id="property-page-description"
              className="text-xl font-bold text-[#0F172A]"
            >
              About this property
            </h2>

            <p className="mt-4 whitespace-pre-line text-sm leading-8 text-gray-600 sm:text-base">
              {property.description}
            </p>
          </section>
        )}

        {property.amenities &&
          property.amenities.length > 0 && (
            <section
              className="mt-10"
              aria-labelledby="property-page-amenities"
            >
              <h2
                id="property-page-amenities"
                className="text-xl font-bold text-[#0F172A]"
              >
                Amenities
              </h2>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {property.amenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-3 rounded-2xl border border-green-100 bg-[#F0FDF4] px-4 py-3.5"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#2EAD45]">
                      <AmenityIcon
                        amenity={amenity}
                        size={18}
                      />
                    </span>

                    <span className="text-sm font-semibold text-[#0F172A]">
                      {amenity}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

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
              aria-label={`WhatsApp about ${property.name}`}
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
                openPropertyCallback(property)
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