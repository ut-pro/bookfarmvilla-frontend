"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  MapPin,
  PhoneCall,
  Star,
  Users,
  Waves,
  X,
} from "lucide-react";

import { useCallbackModal } from "@/components/callback/CallbackContext";
import { formatIndianCurrency } from "@/lib/formatters";
import type {
  PropertyCardData,
  PropertyType,
} from "@/types/property";

interface PropertyDetailsModalProps {
  property: PropertyCardData;
  onClose: () => void;
}

const propertyTypeLabels: Record<PropertyType, string> = {
  FARMHOUSE: "Farmhouse",
  VILLA: "Villa",
  WEDDING_LAWN: "Wedding Lawn",
};

export default function PropertyDetailsModal({
  property,
  onClose,
}: PropertyDetailsModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { openPropertyCallback } = useCallbackModal();

  const images =
    property.imageUrls && property.imageUrls.length > 0
      ? property.imageUrls
      : [property.imageUrl];

  const closeModal = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [closeModal]);

  const showPreviousImage = () => {
    setActiveImageIndex((currentIndex) =>
      currentIndex === 0 ? images.length - 1 : currentIndex - 1,
    );
  };

  const showNextImage = () => {
    setActiveImageIndex((currentIndex) =>
      currentIndex === images.length - 1 ? 0 : currentIndex + 1,
    );
  };

  const handleRequestCallback = () => {
    onClose();
    openPropertyCallback(property);
  };

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/65 p-3 backdrop-blur-md sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          closeModal();
        }
      }}
    >
      <article
        role="dialog"
        aria-modal="true"
        aria-labelledby="property-details-title"
        className="scrollbar-hide relative max-h-[94vh] w-full max-w-4xl overflow-y-auto overscroll-contain rounded-3xl bg-white shadow-2xl"
      >
        <div className="relative h-64 overflow-hidden rounded-t-3xl bg-gray-100 sm:h-80 lg:h-[390px]">
          <Image
            src={images[activeImageIndex]}
            alt={`${property.name} — image ${activeImageIndex + 1}`}
            fill
            priority
            unoptimized
            sizes="(max-width: 1024px) 100vw, 896px"
            className="object-cover"
          />

          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/55 to-transparent" />

          <button
            type="button"
            onClick={closeModal}
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm transition-colors hover:bg-black/65"
            aria-label="Close property details"
          >
            <X size={21} aria-hidden="true" />
          </button>

          <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-[#1E8A32] shadow-sm backdrop-blur-sm">
            {propertyTypeLabels[property.type]}
          </span>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={showPreviousImage}
                className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm transition-colors hover:bg-black/65"
                aria-label="Show previous property image"
              >
                <ChevronLeft size={24} aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={showNextImage}
                className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm transition-colors hover:bg-black/65"
                aria-label="Show next property image"
              >
                <ChevronRight size={24} aria-hidden="true" />
              </button>

              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 rounded-full bg-black/35 px-3 py-2 backdrop-blur-sm">
                {images.map((imageUrl, index) => (
                  <button
                    key={`${imageUrl}-${index}`}
                    type="button"
                    onClick={() => setActiveImageIndex(index)}
                    className={`h-2 rounded-full transition-all ${
                      activeImageIndex === index
                        ? "w-6 bg-white"
                        : "w-2 bg-white/60 hover:bg-white/85"
                    }`}
                    aria-label={`Show property image ${index + 1}`}
                    aria-current={
                      activeImageIndex === index ? "true" : undefined
                    }
                  />
                ))}
              </div>

              <span className="absolute bottom-4 right-4 rounded-full bg-black/45 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                {activeImageIndex + 1} / {images.length}
              </span>
            </>
          )}
        </div>

        <div className="px-6 py-6 sm:px-8 sm:py-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
            <div className="min-w-0">
              <h2
                id="property-details-title"
                className="text-2xl font-bold leading-tight text-[#0F172A] sm:text-3xl"
              >
                {property.name}
              </h2>

              <p className="mt-2 flex items-start gap-2 text-sm leading-6 text-gray-500">
                <MapPin
                  size={17}
                  className="mt-0.5 shrink-0 text-[#2EAD45]"
                  aria-hidden="true"
                />
                {property.location}
              </p>
            </div>

            {typeof property.rating === "number" && (
              <div
                className="flex shrink-0 items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 text-amber-700"
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
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-[#F8FAFC] p-4">
              <Building2
                size={20}
                className="text-[#2EAD45]"
                aria-hidden="true"
              />
              <p className="mt-2 text-xs text-gray-500">Property type</p>
              <p className="mt-1 text-sm font-semibold text-[#0F172A]">
                {propertyTypeLabels[property.type]}
              </p>
            </div>

            <div className="rounded-2xl bg-[#F8FAFC] p-4">
              <Users
                size={20}
                className="text-[#2EAD45]"
                aria-hidden="true"
              />
              <p className="mt-2 text-xs text-gray-500">Guest capacity</p>
              <p className="mt-1 text-sm font-semibold text-[#0F172A]">
                {property.guestCapacity > 0
                  ? `Up to ${property.guestCapacity} guests`
                  : "Contact for capacity"}
              </p>
            </div>

            <div className="rounded-2xl bg-[#F8FAFC] p-4">
              <Waves
                size={20}
                className={
                  property.hasPool ? "text-blue-500" : "text-gray-400"
                }
                aria-hidden="true"
              />
              <p className="mt-2 text-xs text-gray-500">Swimming pool</p>
              <p className="mt-1 text-sm font-semibold text-[#0F172A]">
                {property.hasPool ? "Available" : "Not listed"}
              </p>
            </div>
          </div>

          {property.description && (
            <section className="mt-8" aria-labelledby="property-description">
              <h3
                id="property-description"
                className="text-lg font-bold text-[#0F172A]"
              >
                About this property
              </h3>
              <p className="mt-3 text-sm leading-7 text-gray-600">
                {property.description}
              </p>
            </section>
          )}

          {property.amenities && property.amenities.length > 0 && (
            <section className="mt-8" aria-labelledby="property-amenities">
              <h3
                id="property-amenities"
                className="text-lg font-bold text-[#0F172A]"
              >
                Amenities
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {property.amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="rounded-full border border-green-100 bg-green-50 px-3 py-1.5 text-xs font-medium text-[#1E8A32]"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </section>
          )}

          <div className="mt-8 flex flex-col gap-4 border-t border-gray-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-medium text-gray-400">
                {property.priceRange ? "Price range" : "Starting from"}
              </p>
              <p className="mt-1 text-xl font-bold text-[#0F172A]">
                {property.priceRange
                  ? property.priceRange
                  : typeof property.startingPrice === "number"
                    ? `${formatIndianCurrency(property.startingPrice)}${property.priceSuffix ?? ""}`
                    : "Price on request"}
              </p>
            </div>

            <button
              type="button"
              onClick={handleRequestCallback}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2EAD45] px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-green-500/20 transition-colors hover:bg-[#1E8A32]"
            >
              <PhoneCall size={18} aria-hidden="true" />
              Request Callback
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}
