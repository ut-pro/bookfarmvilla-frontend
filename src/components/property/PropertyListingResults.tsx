"use client";

import { useEffect, useState } from "react";

import PropertyCard from "@/components/property/PropertyCard";
import PropertyListingToolbar from "./PropertyListingToolbar";
import { getActiveProperties } from "@/lib/property-api";
import type { PropertyCardData } from "@/types/property";

interface PropertyListingResultsProps {
  type?: PropertyCardData["type"];
  city?: string;
  sort?: string;
  keyword?: string;
}

export default function PropertyListingResults({
  type,
  city,
  sort: initialSort,
  keyword: initialKeyword,
}: PropertyListingResultsProps) {
  const [sort, setSort] = useState<string>(initialSort || "relevance");
  const [keyword, setKeyword] = useState<string>(initialKeyword || "");
  const [userLocation, setUserLocation] = useState<{lat: number; lng: number} | null>(null);
  const [distanceSortedProperties, setDistanceSortedProperties] = useState<PropertyCardData[]>([]);

  const requestKey = JSON.stringify([
    type ?? null,
    city ?? null,
    sort,
    keyword,
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
        sort: sort !== "relevance" && sort !== "distance_asc" ? sort : undefined,
        keyword: keyword || undefined,
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
  }, [type, city, sort, keyword, requestKey]);

  // Handle distance sorting client-side when user has location
  useEffect(() => {
    if (sort === "distance_asc" && userLocation && properties.length > 0) {
      const propertiesWithDistance = properties.map(prop => {
        if (prop.latitude != null && prop.longitude != null) {
          const R = 6371; // Earth's radius in km
          const dLat = (userLocation.lat - prop.latitude) * Math.PI / 180;
          const dLon = (userLocation.lng - prop.longitude) * Math.PI / 180;
          const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(userLocation.lat * Math.PI / 180) * Math.cos(prop.latitude * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          return { ...prop, distance: R * c };
        }
        return { ...prop, distance: Infinity };
      });

      propertiesWithDistance.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
      setDistanceSortedProperties(propertiesWithDistance);
    } else {
      setDistanceSortedProperties([]);
    }
  }, [sort, userLocation, properties]);

  if (loading) {
    return (
      <>
        <PropertyListingToolbar
          initialType={type}
          initialCity={city}
          initialSort={sort}
          initialKeyword={keyword}
        />
        <div
          className="mt-6 rounded-2xl border border-gray-200 bg-white px-4 py-12 text-center text-sm text-gray-500 sm:px-6 sm:py-16"
          role="status"
        >
          Loading properties...
        </div>
      </>
    );
  }

  if (hasError) {
    return (
      <>
        <PropertyListingToolbar
          initialType={type}
          initialCity={city}
          initialSort={sort}
          initialKeyword={keyword}
        />
        <div
          className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-10 text-center sm:px-6 sm:py-12"
          role="alert"
        >
          <p className="font-semibold text-amber-900">
            Properties could not be loaded right now.
          </p>
          <p className="mt-2 text-sm text-amber-800">
            Please refresh the page or try again shortly.
          </p>
        </div>
      </>
    );
  }

  if (properties.length === 0) {
    return (
      <>
        <PropertyListingToolbar
          initialType={type}
          initialCity={city}
          initialSort={sort}
          initialKeyword={keyword}
        />
        <div className="mt-6 rounded-2xl border border-dashed border-gray-300 bg-white px-4 py-12 text-center sm:px-6 sm:py-16">
          <p className="text-base font-semibold text-[#0F172A]">
            No properties available
          </p>
          <p className="mt-2 text-sm text-gray-500">
            No active properties are currently available in this category.
          </p>
        </div>
      </>
    );
  }

  const displayProperties = sort === "distance_asc" && distanceSortedProperties.length > 0
    ? distanceSortedProperties
    : properties;

  return (
    <>
      <PropertyListingToolbar
        initialType={type}
        initialCity={city}
        initialSort={sort}
        initialKeyword={keyword}
        userLocation={userLocation}
        onRequestLocation={() => {
          if (!navigator.geolocation) return;
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setUserLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              });
            },
            () => {},
            { timeout: 10000, enableHighAccuracy: true }
          );
        }}
      />
      <div className="mt-6 grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
        {displayProperties.map((property) => (
          <div key={property.id} className="flex h-full justify-center sm:block">
            <PropertyCard property={property} />
          </div>
        ))}
      </div>
    </>
  );
}