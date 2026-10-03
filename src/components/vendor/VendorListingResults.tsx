"use client";

import { useEffect, useState } from "react";

import VendorCard from "@/components/vendor/VendorCard";
import { getActiveVendors } from "@/lib/public-api";
import type {
  VendorCategory,
  VendorCategoryFilter,
  VendorResponse,
} from "@/types/vendor";

interface VendorListingResultsProps {
  category?: VendorCategoryFilter;
}

interface VendorListingState {
  requestKey: string | null;
  vendors: VendorResponse[];
  hasError: boolean;
}

function sortAndRemoveDuplicateVendors(
  vendors: VendorResponse[],
): VendorResponse[] {
  const uniqueVendors = new Map(
    vendors.map((vendor) => [vendor.id, vendor]),
  );

  return Array.from(uniqueVendors.values()).sort(
    (firstVendor, secondVendor) =>
      firstVendor.name.localeCompare(secondVendor.name),
  );
}

export default function VendorListingResults({
  category,
}: VendorListingResultsProps) {
  const requestKey = category ?? "ALL_SERVICES";

  const [result, setResult] = useState<VendorListingState>({
    requestKey: null,
    vendors: [],
    hasError: false,
  });

  const loading = result.requestKey !== requestKey;
  const { vendors, hasError } = result;

  useEffect(() => {
    const controller = new AbortController();

    const request =
      category === "OTHER_SERVICES"
        ? Promise.all([
            getActiveVendors(
              {
                category: "MAKEUP_ARTIST",
                size: 100,
              },
              controller.signal,
            ),
            getActiveVendors(
              {
                category: "OTHER",
                size: 100,
              },
              controller.signal,
            ),
          ]).then(([makeupArtists, otherServices]) => [
            ...makeupArtists.content,
            ...otherServices.content,
          ])
        : getActiveVendors(
            {
              category: category as
                | VendorCategory
                | undefined,
              size: 100,
            },
            controller.signal,
          ).then((response) => response.content);

    request
      .then((nextVendors) => {
        if (controller.signal.aborted) {
          return;
        }

        setResult({
          requestKey,
          vendors:
            sortAndRemoveDuplicateVendors(nextVendors),
          hasError: false,
        });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return;
        }

        setResult({
          requestKey,
          vendors: [],
          hasError: true,
        });

        console.error(
          "Unable to load vendor listing:",
          error,
        );
      });

    return () => controller.abort();
  }, [category, requestKey]);

  if (loading) {
    return (
      <div
        className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center text-sm text-gray-500"
        role="status"
      >
        Loading service providers...
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
          Service providers could not be loaded right now.
        </p>

        <p className="mt-2 text-sm text-amber-800">
          Please refresh the page or try again shortly.
        </p>
      </div>
    );
  }

  if (vendors.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
        <p className="text-base font-semibold text-[#0F172A]">
          No service providers available
        </p>

        <p className="mt-2 text-sm text-gray-500">
          No active service providers are currently available in
          this category.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {vendors.map((vendor) => (
        <div
          key={vendor.id}
          className="flex justify-center md:block"
        >
          <VendorCard vendor={vendor} />
        </div>
      ))}
    </div>
  );
}