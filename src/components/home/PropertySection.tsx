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
}

export default function PropertySection({
  id,
  title,
  subtitle,
  properties,
  viewAllLabel,
  viewAllHref,
  backgroundClassName = "bg-white",
}: PropertySectionProps) {
  return (
    <section
      id={id}
      className={`scroll-mt-20 py-20 ${backgroundClassName}`}
      aria-labelledby={`${id}-heading`}
    >
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        {/* Section heading */}
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#2EAD45]">
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
        {properties.length > 0 ? (
          <div className="scrollbar-hide flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 md:grid md:snap-none md:grid-cols-2 md:overflow-visible lg:grid-cols-3 xl:grid-cols-4">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
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