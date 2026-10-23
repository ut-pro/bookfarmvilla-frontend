"use client";

import { useEffect, useRef, useState } from "react";

import PropertyCard from "@/components/property/PropertyCard";
import { getActiveProperties } from "@/lib/property-api";
import type { PropertyCardData } from "@/types/property";

interface SuggestedPropertiesProps {
  currentPropertyId: string;
  currentPropertyType: PropertyCardData["type"];
}

const MAX_SUGGESTIONS = 2;

// Fallback priority order for each property type
const FALLBACK_TYPES: Record<PropertyCardData["type"], PropertyCardData["type"][]> = {
  FARMHOUSE: ["FARMHOUSE", "AIRBNB", "VILLA"],
  VILLA: ["VILLA", "FARMHOUSE", "AIRBNB"],
  AIRBNB: ["AIRBNB", "FARMHOUSE", "VILLA"],
  WEDDING_LAWN: ["WEDDING_LAWN", "FARMHOUSE", "VILLA", "AIRBNB"],
};

export default function SuggestedProperties({
  currentPropertyId,
  currentPropertyType,
}: SuggestedPropertiesProps) {
  const [properties, setProperties] = useState<PropertyCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

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

    // Create intersection observer for lazy loading
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadSuggestions();
            observerRef.current?.disconnect();
          }
        });
      },
      { rootMargin: "100px" }
    );

    if (sectionRef.current) {
      observerRef.current.observe(sectionRef.current);
    }

    return () => {
      controller.abort();
      observerRef.current?.disconnect();
    };
  }, [currentPropertyId, currentPropertyType]);

  if (loading) {
    return (
      <section ref={sectionRef} aria-labelledby="suggested-properties-heading" className="mt-10 sm:mt-12">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8" role="status">
          <h2 id="suggested-properties-heading" className="text-xl font-bold text-[#0F172A] mb-6">
            Suggested Properties
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-44 bg-gray-200 rounded-2xl mb-3"></div>
                <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
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
    <section ref={sectionRef} aria-labelledby="suggested-properties-heading" className="mt-10 sm:mt-12">
      <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8">
        <h2 id="suggested-properties-heading" className="text-xl font-bold text-[#0F172A] mb-6">
          Suggested Properties
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {properties.map((property) => (
            <div key={property.id} className="flex h-full justify-center">
              <PropertyCard property={property} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}