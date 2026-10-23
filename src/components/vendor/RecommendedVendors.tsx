"use client";

import { useEffect, useRef } from "react";

import Link from "next/link";
import type { VendorCategory, VendorResponse } from "@/types/vendor";

interface RecommendedVendorsProps {
  vendors: VendorResponse[];
}

const MAX_VENDORS = 6;

const categoryLabels: Record<VendorCategory, string> = {
  CATERER: "Catering",
  PHOTOGRAPHER: "Photography",
  DJ: "DJ & Entertainment",
  DECORATOR: "Decoration",
  MAKEUP_ARTIST: "Makeup & Styling",
  OTHER: "Other Event Services",
};

export default function RecommendedVendors({ vendors: propVendors }: RecommendedVendorsProps) {
  const vendors = propVendors.slice(0, MAX_VENDORS);
  const sectionRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Create intersection observer for lazy loading
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
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
      observerRef.current?.disconnect();
    };
  }, []);

  if (vendors.length === 0) {
    return null; // Hide section on no vendors
  }

  return (
    <section ref={sectionRef} aria-labelledby="recommended-vendors-heading" className="mt-10 sm:mt-12">
      <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8">
        <h2 id="recommended-vendors-heading" className="text-xl font-bold text-[#0F172A] mb-6">
          Recommended Vendors
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {vendors.map((vendor) => {
            const categoryLabel = categoryLabels[vendor.category] || "Other Services";
            const vendorCategoryFilter = vendor.category === "OTHER" ? "OTHER_SERVICES" : vendor.category;

            return (
              <div key={vendor.id} className="flex h-full justify-center">
                <article className="group relative flex h-full w-full min-w-0 max-w-[420px] flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl sm:max-w-none">
                  <Link
                    href={`/vendors?category=${vendorCategoryFilter}`}
                    className="absolute inset-0 z-10 cursor-pointer rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2EAD45] focus-visible:ring-inset"
                    aria-label={`View all ${categoryLabel} vendors`}
                  />
                  <div className="relative h-44 shrink-0 overflow-hidden bg-[#F0FDF4] sm:h-[200px]">
                    <span className="absolute left-3 top-3 rounded-full bg-[#2EAD45] px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
                      {categoryLabel}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-3.5 sm:p-4">
                    <div className="mb-1 flex items-start justify-between gap-2">
                      <h3 className="line-clamp-1 text-base font-semibold leading-tight text-[#0F172A]" title={vendor.name}>
                        {vendor.name}
                      </h3>

                      {typeof vendor.averageRating === "number" && Number.isFinite(vendor.averageRating) && (
                        <span
                          className="flex shrink-0 items-center gap-1 text-xs font-semibold text-[#0F172A]"
                          aria-label={`${vendor.averageRating.toFixed(1)} out of 5 rating`}
                        >
                          <svg width={13} height={13} className="fill-amber-400 text-amber-400" aria-hidden="true" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                          {vendor.averageRating?.toFixed(1)}
                        </span>
                      )}
                    </div>

                    <div className="mb-3 flex items-center gap-1 text-xs text-gray-500">
                      <svg width={12} height={12} className="shrink-0" aria-hidden="true" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <span className="line-clamp-1">{vendor.city}</span>
                    </div>

                    <p className="mb-4 line-clamp-2 min-h-10 break-words text-xs leading-5 text-gray-600">
                      {vendor.description?.trim() || "Professional event services available for your celebration."}
                    </p>

                    <div className="mt-auto border-t border-gray-100 pt-3">
                      <div className="relative z-20 mt-3 flex items-center gap-2">
                        <a
                          href={`/vendors?category=${vendorCategoryFilter}`}
                          className="flex h-10 flex-1 items-center justify-center whitespace-nowrap rounded-lg bg-[#DCFCE7] px-3 text-xs font-semibold text-[#1E8A32] transition-colors hover:bg-[#2EAD45] hover:text-white"
                          aria-label={`View all ${categoryLabel} vendors`}
                        >
                          View {categoryLabel} Vendors
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