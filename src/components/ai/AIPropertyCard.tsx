"use client";

import { usePropertyDetails } from "@/components/property/PropertyDetailsContext";
import type { PropertyCardData, PropertyType } from "@/types/property";
import { Eye, MapPin, MessageCircle, Users, Waves } from "lucide-react";
import { getPropertyPriceDisplay } from "@/lib/formatters";

import { buildWhatsAppUrl } from "@/lib/whatsapp";

export interface AIProperty {
  id: string;
  title: string;
  description?: string | null;
  type?: PropertyType | null;
  address?: string | null;
  city?: string | null;
  startingPrice?: number | string | null;
  endingPrice?: number | string | null;
  capacity?: number | null;
  latitude?: number | null;
  longitude?: number | null;
  contactPhone?: string | null;
  amenities?: string[];
  averageRating?: number | null;
  images?: {
    id: string;
    url: string;
    primary?: boolean;
    isPrimary?: boolean;
  }[];
}

interface Props {
  property: AIProperty;
  distanceKm?: number;
}

function toPropertyCardData(property: AIProperty): PropertyCardData | null {
  if (
    property.type !== "FARMHOUSE" &&
    property.type !== "VILLA" &&
    property.type !== "WEDDING_LAWN"
  ) {
    return null;
  }

  const images =
    property.images
      ?.slice()
      .sort(
        (firstImage, secondImage) =>
          Number(secondImage.primary || secondImage.isPrimary) -
          Number(firstImage.primary || firstImage.isPrimary),
      )
      .map((item) => item.url)
      .filter(Boolean) ?? [];
  const startingPrice =
    property.startingPrice == null ? null : Number(property.startingPrice);
  const endingPrice =
    property.endingPrice == null ? null : Number(property.endingPrice);

  return {
    id: property.id,
    name: property.title,
    type: property.type,
    description: property.description ?? undefined,
    location: property.address?.trim() || property.city || "India",
    city: property.city ?? undefined,
    rating: property.averageRating ?? undefined,
    guestCapacity: property.capacity ?? 0,
    hasPool:
      property.amenities?.some((amenity) =>
        amenity.toLowerCase().includes("pool"),
      ) ?? false,
    amenities: property.amenities ?? [],
    latitude: property.latitude ?? null,
    longitude: property.longitude ?? null,
    startingPrice:
      startingPrice !== null && Number.isFinite(startingPrice)
        ? startingPrice
        : null,
    endingPrice:
      endingPrice !== null && Number.isFinite(endingPrice)
        ? endingPrice
        : null,
    imageUrl: images[0] ?? "/images/property-placeholder.svg",
    imageUrls: images,
    status: "ACTIVE",
  };
}

export default function AIPropertyCard({ property, distanceKm }: Props) {
  const { openPropertyDetails } = usePropertyDetails();

  const image = property.images?.find(
    (item) => item.primary || item.isPrimary,
  )?.url
    ?? property.images?.[0]?.url;

  const hasPool = property.amenities?.some((a) =>
    a.toLowerCase().includes("pool"),
  );

  const whatsapp = buildWhatsAppUrl(
    `Hi BookFarmVilla team, I am interested in ${property.title}. Please share its availability and enquiry details.`,
  );

  const propertyCardData = toPropertyCardData(property);

  const priceDisplay = getPropertyPriceDisplay(
    property.startingPrice,
    property.endingPrice,
  );

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="relative h-36 overflow-hidden bg-gray-100">
        {image ? (
          <img
            src={image}
            alt={`${property.title} in ${property.city ?? "India"}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            No verified image
          </div>
        )}

        {property.type && (
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold text-[#1E8A32] shadow">
            {property.type.replaceAll("_", " ")}
          </span>
        )}
      </div>

      <div className="p-3.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-sm font-bold text-[#0F172A]">
            {property.title}
          </h3>

          {typeof property.averageRating === "number" && property.averageRating > 0 && (
            <span className="shrink-0 text-xs font-semibold text-amber-600">
              ★ {property.averageRating.toFixed(1)}
            </span>
          )}
        </div>

        {property.city && (
          <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
            <MapPin size={12} />
            <span className="line-clamp-1">{property.city}</span>
          </p>
        )}
        {distanceKm !== undefined && Number.isFinite(distanceKm) && (
          <p className="mt-1 text-xs font-medium text-[#1E8A32]">
            {distanceKm.toFixed(1)} km away
          </p>
        )}

        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5 text-[11px] text-gray-600">
          {typeof property.capacity === "number" && (
            <span className="flex items-center gap-1">
              <Users size={12} className="text-[#2EAD45]" />
              {property.capacity} guests
            </span>
          )}

          {hasPool && (
            <span className="flex items-center gap-1 text-blue-500">
              <Waves size={12} />
              Pool
            </span>
          )}

          {property.amenities?.slice(0, 3).map((amenity) => (
            <span key={amenity} className="rounded-full bg-gray-50 px-2 py-1">
              {amenity}
            </span>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between gap-2 border-t border-gray-100 pt-3">
          <div className="min-w-0">
            {priceDisplay.label && (
              <p className="text-[10px] font-medium text-gray-400">
                {priceDisplay.label}
              </p>
            )}

            <p className="line-clamp-1 text-sm font-bold text-[#0F172A]">
              {priceDisplay.value}
            </p>
          </div>

          <div className="flex gap-1.5">
            {whatsapp && (
              <a
                href={whatsapp}
                target="_blank"
                rel="noreferrer"
                aria-label={`WhatsApp ${property.title}`}
                className="rounded-lg bg-green-50 p-2 text-[#1E8A32] hover:bg-[#2EAD45] hover:text-white"
              >
                <MessageCircle size={15} />
              </a>
            )}

            <button
              type="button"
              onClick={() => {
                if (propertyCardData) {
                  openPropertyDetails(propertyCardData);
                }
              }}
              disabled={!propertyCardData}
              className="flex items-center gap-1 rounded-lg bg-[#2EAD45] px-3 py-2 text-[11px] font-semibold text-white hover:bg-[#1E8A32]"
            >
              <Eye size={13} />
              View
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
