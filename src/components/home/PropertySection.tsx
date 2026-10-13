import { ArrowRight } from "lucide-react";

import PropertyCard from "@/components/property/PropertyCard";
import type { PropertyCardData } from "@/types/property";

interface PropertySectionProps {
  id: string;
  title: string;
  subtitle: string;
  properties: PropertyCardData[];
  viewAllLabel: string;
  viewAllHref: string;
  backgroundClassName?: string;
  isLoading?: boolean;
}

export default function PropertySection({
  id,
  title,
  subtitle,
  properties,
  viewAllLabel,
  viewAllHref,
  backgroundClassName = "bg-white",
  isLoading = false,
}: PropertySectionProps) {
  return (
    <section
      id={id}
      className={`scroll-mt-16 py-12 sm:scroll-mt-20 sm:py-16 lg:py-20 ${backgroundClassName}`}
      aria-labelledby={`${id}-heading`}
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Section heading */}
        <div className="mb-7 flex items-end justify-between gap-4 sm:mb-10 sm:gap-6">
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-[#2EAD45] sm:mb-2 sm:text-sm">
              {subtitle}
            </p>

            <h2
              id={`${id}-heading`}
              className="font-semibold leading-tight text-[#0F172A]"
              style={{
                fontSize: "clamp(24px, 3vw, 36px)",
              }}
            >
              {title}
            </h2>
          </div>

          {/* Desktop View All link */}
          <a
            href={viewAllHref}
            className="hidden items-center gap-2 text-sm font-semibold text-[#2EAD45] transition-all hover:gap-3 hover:text-[#1E8A32] md:flex"
          >
            {viewAllLabel}
            <ArrowRight size={16} aria-hidden="true" />
          </a>
        </div>

        {/* Property cards */}
        {isLoading ? (
          <div
            className="rounded-2xl border border-gray-200 bg-white px-6 py-12 text-center sm:py-16 text-sm text-gray-500"
            role="status"
          >
            Loading properties...
          </div>
        ) : properties.length > 0 ? (
          <div className="scrollbar-hide -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 scroll-px-4 sm:-mx-6 sm:gap-5 sm:px-6 sm:scroll-px-6 md:mx-0 md:grid md:snap-none md:grid-cols-2 md:overflow-visible md:px-0 lg:grid-cols-3 xl:grid-cols-4">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                displayMode="carousel"
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center sm:py-16">
            <p className="text-base font-semibold text-[#0F172A]">
              No properties available
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Please check again later for new listings.
            </p>
          </div>
        )}

        {/* Mobile View All link */}
        <div className="mt-6 flex justify-center md:hidden">
          <a
            href={viewAllHref}
            className="flex items-center gap-2 rounded-full border border-[#2EAD45] px-5 py-2.5 text-sm font-semibold text-[#2EAD45] transition-colors hover:bg-[#2EAD45] hover:text-white"
          >
            {viewAllLabel}
            <ArrowRight size={16} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
