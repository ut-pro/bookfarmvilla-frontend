"use client";

import { useEffect, useState } from "react";

import VendorCard from "@/components/vendor/VendorCard";
import VendorListingToolbar from "./VendorListingToolbar";
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
  const [sort, setSort] = useState<string>("relevance");
  const [keyword, setKeyword] = useState<string>("");
  const [city, setCity] = useState<string>("");

  const requestKey = JSON.stringify([
    category ?? null,
    city ?? null,
    sort,
    keyword,
  ]);

  const [result, setResult] = useState<VendorListingState>({
    requestKey: null,
    vendors: [],
    hasError: false,
  });

  const loading = result.requestKey !== requestKey;
  const { vendors, hasError } = result;

  useEffect(() => {
    const controller = new AbortController();

    const apiCategory: VendorCategory | undefined =
      category === "OTHER_SERVICES"
        ? "OTHER"
        : category;

    const request = getActiveVendors(
      {
        category: apiCategory,
        city: city || undefined,
        sort: sort !== "relevance" ? sort : undefined,
        keyword: keyword || undefined,
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
  }, [category, city, sort, keyword, requestKey]);

  if (loading) {
    return (
      <>
        <VendorListingToolbar initialCategory={category} />
        <div
          className="mt-6 rounded-2xl border border-gray-200 bg-white px-4 py-12 text-center text-sm text-gray-500 sm:px-6 sm:py-16"
          role="status"
        >
          Loading service providers...
        </div>
      </>
    );
  }

  if (hasError) {
    return (
      <>
        <VendorListingToolbar initialCategory={category} />
        <div
          className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-10 text-center sm:px-6 sm:py-12"
          role="alert"
        >
          <p className="font-semibold text-amber-900">
            Service providers could not be loaded right now.
          </p>

          <p className="mt-2 text-sm text-amber-800">
            Please refresh the page or try again shortly.
          </p>
        </div>
      </>
    );
  }

  if (vendors.length === 0) {
    return (
      <>
        <VendorListingToolbar initialCategory={category} />
        <div className="mt-6 rounded-2xl border border-dashed border-gray-300 bg-white px-4 py-12 text-center sm:px-6 sm:py-16">
          <p className="text-base font-semibold text-[#0F172A]">
            No service providers available
          </p>

          <p className="mt-2 text-sm text-gray-500">
            No active service providers are currently available in
            this category.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <VendorListingToolbar initialCategory={category} />
      <div className="mt-6 grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
        {vendors.map((vendor) => (
          <div
            key={vendor.id}
            className="flex h-full justify-center sm:block"
          >
            <VendorCard vendor={vendor} />
          </div>
        ))}
      </div>
    </>
  );
}