"use client";

import {
  Building2,
  MapPin,
  PhoneCall,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

import { useCallbackModal } from "@/components/callback/CallbackContext";
import { useUserLocation } from "@/components/location/UserLocationContext";
import AmenityIcon from "@/components/ui/AmenityIcon";
import DetailsImageGallery from "@/components/ui/DetailsImageGallery";
import { calculateDistanceInKm } from "@/lib/distance";
import { getPropertyPriceDisplay } from "@/lib/formatters";
import { sanitizeBlogHtml } from "@/lib/blog-html";
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
  AIRBNB: "Airbnb",
};

export default function PropertyDetailsPageContent({
  property,
}: PropertyDetailsPageContentProps) {
  const { openPropertyCallback } = useCallbackModal();
  const { location: userLocation } = useUserLocation();

  const mediaUrls =
    property.mediaUrls && property.mediaUrls.length > 0
      ? property.mediaUrls
      : property.imageUrls && property.imageUrls.length > 0
        ? property.imageUrls
        : [property.imageUrl];

  const amenities =
    property.amenities
      ?.map((amenity) => amenity.trim())
      .filter(Boolean) ?? [];

  const amenityCount = amenities.length;

  const priceDisplay = getPropertyPriceDisplay(
    property.startingPrice,
    property.endingPrice,
    property.priceSuffix,
  );

  const distanceKm = userLocation
    ? calculateDistanceInKm(userLocation, property)
    : undefined;

  const description =
    property.description?.trim() ?? "";

  const hasRichDescription =
    /<(?:p|h[1-4]|ul|ol|li|strong|em|u|blockquote|span|br)\b/i.test(
      description,
    );

  const sanitizedDescription = hasRichDescription
    ? sanitizeBlogHtml(description)
    : "";

  const whatsappUrl = buildWhatsAppUrl(
    `Hi BookFarmVilla team, I am interested in ${property.name}. Please share its availability and enquiry details.`,
  );

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm sm:rounded-3xl">
      <DetailsImageGallery
        mediaUrls={mediaUrls}
        title={property.name}
        badge={propertyTypeLabels[property.type]}
      />

      <div className="p-4 sm:p-8 lg:p-10">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start sm:gap-6">
          <div className="min-w-0">
            <h1 className="break-words text-2xl font-bold leading-tight text-[#0F172A] sm:text-3xl lg:text-4xl">
              {property.name}
            </h1>

            <p className="mt-3 flex items-start gap-2 break-words text-sm leading-6 text-gray-500 sm:text-base">
              <MapPin
                size={18}
                className="mt-0.5 shrink-0 text-[#2EAD45]"
                aria-hidden="true"
              />
              <span className="min-w-0">{property.location}</span>
            </p>

            {distanceKm !== undefined && (
              <p className="mt-2 text-sm font-semibold text-[#1E8A32]">
                {distanceKm.toFixed(1)} km away from your location
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
              <span className="font-bold">{property.rating}</span>
            </div>
          )}
        </header>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_320px] xl:gap-10 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0">
            <section aria-label="Property summary">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="min-w-0 rounded-2xl bg-[#F8FAFC] p-4 sm:p-5">
                  <Building2
                    size={21}
                    className="text-[#2EAD45]"
                    aria-hidden="true"
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Property type
                  </p>
                  <p className="mt-1 break-words text-sm font-semibold text-[#0F172A]">
                    {propertyTypeLabels[property.type]}
                  </p>
                </div>

                <div className="min-w-0 rounded-2xl bg-[#F8FAFC] p-4 sm:p-5">
                  <Users
                    size={21}
                    className="text-[#2EAD45]"
                    aria-hidden="true"
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Guest capacity
                  </p>
                  <p className="mt-1 break-words text-sm font-semibold text-[#0F172A]">
                    {property.guestCapacity > 0
                      ? `Up to ${property.guestCapacity} guests`
                      : "Contact for capacity"}
                  </p>
                </div>

                <div className="col-span-2 min-w-0 rounded-2xl bg-[#F8FAFC] p-4 sm:col-span-1 sm:p-5">
                  <Sparkles
                    size={21}
                    className="text-[#2EAD45]"
                    aria-hidden="true"
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Amenities
                  </p>
                  <p className="mt-1 break-words text-sm font-semibold text-[#0F172A]">
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
            </section>

            {property.description && (
              <section
                className="mt-8 sm:mt-10"
                aria-labelledby="property-page-description"
              >
                <h2
                  id="property-page-description"
                  className="text-xl font-bold text-[#0F172A]"
                >
                  About this property
                </h2>

                {hasRichDescription ? (
                  <div
                    className={
                      "mt-4 break-words text-sm leading-7 text-gray-600 sm:text-base sm:leading-8 " +
                      "[&_p]:my-3 " +
                      "[&_h1]:mb-4 [&_h1]:mt-7 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:leading-tight [&_h1]:text-[#0F172A] " +
                      "[&_h2]:mb-3 [&_h2]:mt-6 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:leading-tight [&_h2]:text-[#0F172A] " +
                      "[&_h3]:mb-3 [&_h3]:mt-5 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-[#0F172A] " +
                      "[&_h4]:mb-2 [&_h4]:mt-4 [&_h4]:text-lg [&_h4]:font-semibold [&_h4]:text-[#0F172A] " +
                      "[&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 " +
                      "[&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 " +
                      "[&_li]:my-1.5 [&_li]:pl-1 " +
                      "[&_strong]:font-semibold [&_strong]:text-[#0F172A] " +
                      "[&_blockquote]:my-4 [&_blockquote]:border-l-4 [&_blockquote]:border-green-300 " +
                      "[&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-600"
                    }
                    dangerouslySetInnerHTML={{
                      __html: sanitizedDescription,
                    }}
                  />
                ) : (
                  <p className="mt-4 whitespace-pre-line break-words text-sm leading-7 text-gray-600 sm:text-base sm:leading-8">
                    {description}
                  </p>
                )}
              </section>
            )}

            {amenities.length > 0 && (
              <section
                className="mt-8 sm:mt-10"
                aria-labelledby="property-page-amenities"
              >
                <h2
                  id="property-page-amenities"
                  className="text-xl font-bold text-[#0F172A]"
                >
                  Amenities
                </h2>

                <div className="mt-5 grid grid-cols-2 gap-2.5 sm:gap-3 xl:grid-cols-3">
                  {amenities.map((amenity) => (
                    <div
                      key={amenity}
                      className="flex min-w-0 items-center gap-2.5 rounded-2xl border border-green-100 bg-[#F0FDF4] px-3 py-3 sm:gap-3 sm:px-4 sm:py-3.5"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-[#2EAD45] sm:h-9 sm:w-9">
                        <AmenityIcon
                          amenity={amenity}
                          size={18}
                        />
                      </span>

                      <span className="min-w-0 break-words text-xs font-semibold text-[#0F172A] sm:text-sm">
                        {amenity}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm lg:sticky lg:top-28 sm:p-6">
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
              Contact our team to confirm availability and final pricing for your event.
            </p>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`WhatsApp about ${property.name}`}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#2EAD45] bg-green-50 px-4 text-sm font-semibold text-[#1E8A32] transition-colors hover:bg-[#2EAD45] hover:text-white"
              >
                <FaWhatsapp size={20} aria-hidden="true" />
                WhatsApp
              </a>

              <button
                type="button"
                onClick={() => openPropertyCallback(property)}
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
