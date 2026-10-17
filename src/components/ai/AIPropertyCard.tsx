"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Eye,
  MapPin,
  PhoneCall,
  Sparkles,
  Users,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

import { siteConfig } from "@/data/site";
import { getPropertyPriceDisplay } from "@/lib/formatters";
import { isVideoUrl } from "@/lib/media";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import type { PropertyCardData, PropertyType } from "@/types/property";

export interface AIProperty {
  id: string;
  slug?: string | null;
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

  const mediaUrls =
    property.images
      ?.slice()
      .sort(
        (firstMedia, secondMedia) =>
          Number(secondMedia.primary || secondMedia.isPrimary) -
          Number(firstMedia.primary || firstMedia.isPrimary),
      )
      .map((item) => item.url?.trim())
      .filter((mediaUrl): mediaUrl is string => Boolean(mediaUrl)) ?? [];
  const images = mediaUrls.filter((mediaUrl) => !isVideoUrl(mediaUrl));
  const videoUrls = mediaUrls.filter(isVideoUrl);

  const startingPrice =
    property.startingPrice == null ? null : Number(property.startingPrice);
  const endingPrice =
    property.endingPrice == null ? null : Number(property.endingPrice);

  return {
    id: property.id,
    slug: property.slug?.trim() || property.id,
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
    imageUrls:
      images.length > 0 ? images : ["/images/property-placeholder.svg"],
    videoUrls,
    mediaUrls,
    status: "ACTIVE",
  };
}

export default function AIPropertyCard({ property, distanceKm }: Props) {
  const image =
    property.images
      ?.slice()
      .sort(
        (firstMedia, secondMedia) =>
          Number(secondMedia.primary || secondMedia.isPrimary) -
          Number(firstMedia.primary || firstMedia.isPrimary),
      )
      .map((item) => item.url?.trim())
      .filter((mediaUrl): mediaUrl is string => Boolean(mediaUrl))
      .find((mediaUrl) => !isVideoUrl(mediaUrl));

  const whatsapp = buildWhatsAppUrl(
    `Hi BookFarmVilla team, I am interested in ${property.title}. Please share its availability and enquiry details.`,
  );

  const propertyCardData = toPropertyCardData(property);
  const propertyDetailIdentifier = propertyCardData?.slug?.trim() || property.id;
  const priceDisplay = getPropertyPriceDisplay(
    property.startingPrice,
    property.endingPrice,
  );

  const amenities =
    property.amenities?.map((amenity) => amenity.trim()).filter(Boolean) ?? [];
  const visibleAmenities = amenities.slice(0, 2);
  const remainingAmenities = Math.max(amenities.length - 2, 0);

  return (
    <article className="flex h-[420px] min-w-0 flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="relative h-36 shrink-0 overflow-hidden bg-gray-100">
        {image ? (
          <Image
            src={image}
            alt={`${property.title} in ${property.city ?? "India"}`}
            fill
            unoptimized
            sizes="(max-width: 639px) calc(100vw - 28px), 380px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-4 text-center text-sm text-gray-400">
            No verified image
          </div>
        )}

        {property.type && (
          <span className="absolute left-3 top-3 max-w-[calc(100%-1.5rem)] truncate rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold text-[#1E8A32] shadow">
            {property.type.replaceAll("_", " ")}
          </span>
        )}
      </div>

      <div className="flex min-h-0 flex-1 flex-col p-3.5">
        <div className="flex min-w-0 items-start justify-between gap-2">
          <h3
            className="line-clamp-1 min-w-0 text-sm font-bold text-[#0F172A]"
            title={property.title}
          >
            {property.title}
          </h3>

          {typeof property.averageRating === "number" &&
            property.averageRating > 0 && (
              <span className="shrink-0 text-xs font-semibold text-amber-600">
                ★ {property.averageRating.toFixed(1)}
              </span>
            )}
        </div>

        <div className="mt-1 min-h-[72px] text-xs">
          {property.city && (
            <p className="flex min-w-0 items-center gap-1 text-gray-500">
              <MapPin size={12} className="shrink-0" aria-hidden="true" />
              <span className="line-clamp-1 min-w-0">{property.city}</span>
            </p>
          )}

          <a
            href={`tel:${siteConfig.contact.phone.replace(/\D/g, "")}`}
            className="mt-1 inline-flex max-w-full items-center gap-1 font-medium text-[#1E8A32] hover:underline"
            aria-label={`Call Booksy's booking team at ${siteConfig.contact.phone}`}
          >
            <PhoneCall size={12} className="shrink-0" aria-hidden="true" />
            <span className="truncate">{siteConfig.contact.phone}</span>
          </a>

          {distanceKm !== undefined && Number.isFinite(distanceKm) && (
            <p className="mt-1 font-medium text-[#1E8A32]">
              {distanceKm.toFixed(1)} km away
            </p>
          )}
        </div>

        <div className="mt-2 flex h-16 flex-wrap content-start gap-1.5 overflow-hidden text-[11px] text-gray-600">
          {typeof property.capacity === "number" && property.capacity > 0 && (
            <span className="inline-flex h-7 items-center gap-1 rounded-full bg-gray-50 px-2">
              <Users size={12} className="shrink-0 text-[#2EAD45]" />
              {property.capacity} guests
            </span>
          )}

          {visibleAmenities.map((amenity) => (
            <span
              key={amenity}
              className="inline-flex h-7 max-w-full items-center gap-1 rounded-full bg-gray-50 px-2"
              title={amenity}
            >
              <Sparkles
                size={11}
                className="shrink-0 text-[#2EAD45]"
                aria-hidden="true"
              />
              <span className="max-w-[130px] truncate">{amenity}</span>
            </span>
          ))}

          {remainingAmenities > 0 && (
            <span className="inline-flex h-7 items-center rounded-full bg-[#DCFCE7] px-2 font-semibold text-[#1E8A32]">
              +{remainingAmenities} more
            </span>
          )}
        </div>

        <div className="mt-auto flex min-w-0 items-end justify-between gap-2 border-t border-gray-100 pt-3">
          <div className="min-w-0">
            <p className="text-[10px] font-medium text-gray-400">
              {priceDisplay.label || "Pricing"}
            </p>
            <p
              className="line-clamp-1 text-sm font-bold text-[#0F172A]"
              title={priceDisplay.value}
            >
              {priceDisplay.value}
            </p>
          </div>

          <div className="flex shrink-0 gap-1.5">
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`WhatsApp about ${property.title}`}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-[#1E8A32] transition-colors hover:bg-[#2EAD45] hover:text-white"
            >
              <FaWhatsapp size={17} aria-hidden="true" />
            </a>

            {propertyCardData ? (
              <Link
                href={`/properties/${encodeURIComponent(
                  propertyDetailIdentifier,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 items-center gap-1 rounded-lg bg-[#2EAD45] px-3 text-[11px] font-semibold text-white transition-colors hover:bg-[#1E8A32]"
                aria-label={`Open details for ${property.title} in a new tab`}
              >
                <Eye size={13} aria-hidden="true" />
                View
              </Link>
            ) : (
              <button
                type="button"
                disabled
                className="flex h-9 cursor-not-allowed items-center gap-1 rounded-lg bg-gray-300 px-3 text-[11px] font-semibold text-white"
              >
                <Eye size={13} aria-hidden="true" />
                View
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
