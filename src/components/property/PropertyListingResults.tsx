"use client";

import { useEffect, useState } from "react";

import PropertyCard from "@/components/property/PropertyCard";
import { getActiveProperties } from "@/lib/property-api";
import type { PropertyCardData } from "@/types/property";

interface PropertyListingResultsProps {
  type?: PropertyCardData["type"];
  city?: string;
  minCapacity?: number;
}

export default function PropertyListingResults({
  type,
  city,
  minCapacity,
}: PropertyListingResultsProps) {
  const requestKey = JSON.stringify([
    type ?? null,
    city ?? null,
    minCapacity ?? null,
  ]);

  const [result, setResult] = useState<{
    requestKey: string | null;
    properties: PropertyCardData[];
    hasError: boolean;
  }>({
    requestKey: null,
    properties: [],
    hasError: false,
  });

  const loading = result.requestKey !== requestKey;
  const { properties, hasError } = result;

  useEffect(() => {
    const controller = new AbortController();

    getActiveProperties(
      {
        type,
        city,
        minCapacity,
        size: 100,
      },
      controller.signal,
    )
      .then((nextProperties) => {
        if (controller.signal.aborted) {
          return;
        }

        setResult({
          requestKey,
          properties: nextProperties,
          hasError: false,
        });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return;
        }

        setResult({
          requestKey,
          properties: [],
          hasError: true,
        });

        console.error("Unable to load property listing:", error);
      });

    return () => controller.abort();
  }, [type, city, minCapacity, requestKey]);

  if (loading) {
    return (
      <div
        className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center text-sm text-gray-500"
        role="status"
      >
        Loading properties...
      </div>
    );
  }

  if (hasError) {
    return (
      <div
        className="rounded-2xl border border-amber-200 bg-amber-50 px-6 py-12 text-center"
        role="alert"
      >
        <p className="font-semibold text-amber-900">
          Properties could not be loaded right now.
        </p>
        <p className="mt-2 text-sm text-amber-800">
          Please refresh the page or try again shortly.
        </p>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
        <p className="text-base font-semibold text-[#0F172A]">
          No properties available
        </p>
        <p className="mt-2 text-sm text-gray-500">
          No active properties are currently available in this category.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {properties.map((property) => (
        <div key={property.id} className="flex justify-center md:block">
          <PropertyCard property={property} />
        </div>
      ))}
    </div>
  );
}
