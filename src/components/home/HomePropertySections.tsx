"use client";

import { useEffect, useState } from "react";

import PropertySection from "@/components/home/PropertySection";
import { getActiveProperties } from "@/lib/property-api";
import type { PropertyCardData } from "@/types/property";

interface HomeProperties {
  farmhouses: PropertyCardData[];
  villas: PropertyCardData[];
  weddingLawns: PropertyCardData[];
  holidayHomes: PropertyCardData[];
}

const EMPTY_PROPERTIES: HomeProperties = {
  farmhouses: [],
  villas: [],
  weddingLawns: [],
  holidayHomes: [],
};

export default function HomePropertySections() {
  const [properties, setProperties] = useState(EMPTY_PROPERTIES);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProperties() {
      try {
        // Load active properties once and reuse the API-backed data for every
        // homepage card section instead of issuing one request per category.
        const allProperties = await getActiveProperties(
          { size: 100 },
          controller.signal,
        );

        const takeCategory = (type: PropertyCardData["type"]) =>
          allProperties.filter((property) => property.type === type).slice(0, 4);

        setProperties({
          farmhouses: takeCategory("FARMHOUSE"),
          villas: takeCategory("VILLA"),
          weddingLawns: takeCategory("WEDDING_LAWN"),
          holidayHomes: takeCategory("AIRBNB"),
        });
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setHasError(true);
        console.error("Unable to load homepage properties:", error);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadProperties();

    return () => controller.abort();
  }, []);

  return (
    <>
      {hasError && (
        <div
          className="mx-auto mt-10 max-w-[1344px] px-6 lg:px-12"
          role="alert"
        >
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
            Properties could not be loaded right now. Please refresh the
            page or try again shortly.
          </div>
        </div>
      )}

      <PropertySection
        id="farmhouses"
        subtitle="Trending Near You"
        title="Popular Farmhouses"
        properties={properties.farmhouses}
        isLoading={loading}
        viewAllLabel="View All Farmhouses"
        viewAllHref="/properties?type=FARMHOUSE"
        backgroundClassName="bg-white"
      />

      <PropertySection
        id="villas"
        subtitle="Handpicked Collection"
        title="Luxury Villas"
        properties={properties.villas}
        isLoading={loading}
        viewAllLabel="View All Villas"
        viewAllHref="/properties?type=VILLA"
        backgroundClassName="bg-[#F8FAFC]"
      />

      <PropertySection
        id="holiday-homes"
        subtitle="Curated Stays"
        title="Holiday Homes"
        properties={properties.holidayHomes}
        isLoading={loading}
        viewAllLabel="View All Holiday Homes"
        viewAllHref="/properties?type=AIRBNB"
        backgroundClassName="bg-white"
      />

      <PropertySection
        id="wedding-lawns"
        subtitle="Your Dream Venue Awaits"
        title="Wedding Lawns"
        properties={properties.weddingLawns}
        isLoading={loading}
        viewAllLabel="View All Wedding Lawns"
        viewAllHref="/properties?type=WEDDING_LAWN"
        backgroundClassName="bg-[#F8FAFC]"
      />
    </>
  );
}
