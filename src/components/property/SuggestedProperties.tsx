"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { getActiveProperties } from "@/lib/property-api";
import type { PropertyCardData } from "@/types/property";

interface SuggestedPropertiesProps {
  currentPropertyId: string;
  currentPropertyType: PropertyCardData["type"];
}

const MAX_SUGGESTIONS = 4;

// Fallback priority order for each property type
const FALLBACK_TYPES: Record<PropertyCardData["type"], PropertyCardData["type"][]> = {
  FARMHOUSE: ["FARMHOUSE", "AIRBNB", "VILLA"],
  VILLA: ["VILLA", "FARMHOUSE", "AIRBNB"],
  AIRBNB: ["AIRBNB", "FARMHOUSE", "VILLA"],
  WEDDING_LAWN: ["WEDDING_LAWN", "FARMHOUSE", "VILLA", "AIRBNB"],
};

const propertyTypeLabels: Record<PropertyCardData["type"], string> = {
  FARMHOUSE: "Farmhouse",
  VILLA: "Villa",
  WEDDING_LAWN: "Wedding Lawn",
  AIRBNB: "Holiday Home",
};

export default function SuggestedProperties({
  currentPropertyId,
  currentPropertyType,
}: SuggestedPropertiesProps) {
  const [properties, setProperties] = useState<PropertyCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadSuggestions() {
      try {
        const fallbackTypes = FALLBACK_TYPES[currentPropertyType] || [currentPropertyType];
        let allSuggestions: PropertyCardData[] = [];
        const seenIds = new Set<string>([currentPropertyId]);

        for (const type of fallbackTypes) {
          if (allSuggestions.length >= MAX_SUGGESTIONS) break;

          const needed = MAX_SUGGESTIONS - allSuggestions.length;
          const fetched = await getActiveProperties(
            { type, size: needed + 5 }, // Fetch extra to account for filtering
            controller.signal,
          );

          // Filter out current property and duplicates
          const filtered = fetched.filter(
            (p) => p.id !== currentPropertyId && !seenIds.has(p.id)
          );

          filtered.forEach((p) => seenIds.add(p.id));
          allSuggestions = [...allSuggestions, ...filtered.slice(0, needed)];
        }

        setProperties(allSuggestions.slice(0, MAX_SUGGESTIONS));
        setHasError(false);
      } catch (error) {
        if (controller.signal.aborted) return;
        setHasError(true);
        console.error("Failed to load suggested properties:", error);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadSuggestions();

    return () => {
      controller.abort();
    };
  }, [currentPropertyId, currentPropertyType]);

  if (loading) {
    return (
      <section aria-labelledby="suggested-properties-heading" className="mt-12 sm:mt-16">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8" role="status">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
            <div>
              <h2 id="suggested-properties-heading" className="text-xl font-bold text-[#0F172A]">
                You May Also Like
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Similar properties you might be interested in
              </p>
            </div>
          </div>
          <div className="-mx-2 flex snap-x snap-mandatory gap-3 overflow-x-auto px-2 pb-3 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 lg:grid-cols-4 [scrollbar-width:thin]">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-[78%] shrink-0 snap-start animate-pulse rounded-xl border border-gray-100 bg-white overflow-hidden sm:w-auto sm:shrink">
                <div className="h-44 bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-4 w-3/4 bg-gray-200 rounded" />
                  <div className="h-3 w-1/2 bg-gray-200 rounded" />
                  <div className="h-4 w-1/3 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (hasError || properties.length === 0) {
    return null; // Hide section on error or no suggestions
  }

  return (
    <section aria-labelledby="suggested-properties-heading" className="mt-12 sm:mt-16">
      <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
          <div>
            <h2 id="suggested-properties-heading" className="text-xl font-bold text-[#0F172A]">
              You May Also Like
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Similar properties you might be interested in
            </p>
          </div>
          <Link
            href="/properties"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1E8A32] hover:text-[#0F172A] transition-colors sm:ml-auto"
          >
            View All
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>

        <div className="-mx-2 flex snap-x snap-mandatory gap-3 overflow-x-auto px-2 pb-3 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 lg:grid-cols-4 [scrollbar-width:thin]">
          {properties.map((property) => {
            const propertyDetailIdentifier = property.slug?.trim() || property.id;
            const propertyTypeLabel = propertyTypeLabels[property.type] || property.type;

            return (
              <div key={property.id} className="flex h-full w-[78%] shrink-0 snap-start justify-center sm:w-auto sm:shrink">
                <article className="group relative flex h-full w-full min-w-0 max-w-none flex-col overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:max-w-none">
                  <Link
                    href={`/properties/${encodeURIComponent(propertyDetailIdentifier)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 z-10 cursor-pointer rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2EAD45] focus-visible:ring-inset"
                    aria-label={`Open details for ${property.name} in a new tab`}
                  />
                  <div className="relative aspect-[16/10] shrink-0 overflow-hidden sm:aspect-[4/3]">
                    <Image
                      src={property.imageUrl}
                      alt={`${property.name} in ${property.location}`}
                      fill
                      unoptimized
                      sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-[#2EAD45] px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
                      {propertyTypeLabel}
                    </span>
                    {typeof property.rating === "number" && (
                      <div
                        className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-sm px-2 py-1 text-xs font-semibold text-[#0F172A] shadow-sm"
                        aria-label={`${property.rating.toFixed(1)} out of 5 stars`}
                      >
                        <svg width={12} height={12} className="fill-amber-400 text-amber-400" aria-hidden="true" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        {property.rating.toFixed(1)}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-3 sm:p-4">
                    <h3 className="text-base font-semibold leading-tight text-[#0F172A] line-clamp-1" title={property.name}>
                      {property.name}
                    </h3>

                    <div className="mt-2 flex items-center gap-1 text-sm text-gray-500">
                      <svg width={14} height={14} className="shrink-0 text-[#2EAD45]" aria-hidden="true" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <span className="line-clamp-1">{property.location}</span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {property.amenities?.slice(0, 3).map((amenity) => (
                        <span
                          key={amenity}
                          className="flex items-center gap-1 rounded-full bg-[#F8FAFC] px-2.5 py-1 text-[11px] font-medium text-gray-600"
                          title={amenity}
                        >
                          <svg width={12} height={12} className="shrink-0 text-[#2EAD45]" aria-hidden="true" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span className="line-clamp-1">{amenity}</span>
                        </span>
                      ))}
                      {(property.amenities?.length ?? 0) > 3 && (
                        <span className="rounded-full bg-[#DCFCE7] px-2.5 py-1 text-[11px] font-semibold text-[#1E8A32]">
                          +{(property.amenities?.length ?? 0) - 3} more
                        </span>
                      )}
                    </div>

                    <div className="mt-auto border-t border-gray-100 pt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[11px] font-medium text-gray-400">
                            Starting from
                          </p>
                          <p className="text-lg font-bold text-[#0F172A]">
                            {property.startingPrice
                              ? `₹${property.startingPrice.toLocaleString("en-IN")}${property.priceSuffix ? ` ${property.priceSuffix}` : ""}`
                              : "Contact for pricing"}
                          </p>
                        </div>
                        <a
                          href={`/properties/${encodeURIComponent(propertyDetailIdentifier)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-lg bg-[#2EAD45] px-4 text-sm font-semibold text-white shadow-sm hover:bg-[#1E8A32] transition-colors"
                        >
                          View Details
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}