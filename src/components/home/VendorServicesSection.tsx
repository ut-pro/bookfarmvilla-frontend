import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  Camera,
  Music2,
  Sparkles,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";

import { getActiveVendors } from "@/lib/public-api";
import type {
  VendorCategory,
  VendorCategoryFilter,
} from "@/types/vendor";

interface ServiceCardData {
  title: string;
  description: string;
  category: VendorCategoryFilter;
  count: number | null;
  icon: LucideIcon;
}

async function getActiveVendorCount(
  category: VendorCategory,
): Promise<number | null> {
  try {
    const response = await getActiveVendors({
      category,
      page: 0,
      size: 1,
    });

    return response.totalElements;
  } catch (error) {
    console.error(
      `Unable to load active vendor count for ${category}:`,
      error,
    );

    return null;
  }
}

function getCountLabel(count: number | null): string {
  if (count === null) {
    return "Count currently unavailable";
  }

  return `${count} active ${
    count === 1 ? "provider" : "providers"
  }`;
}

export default async function VendorServicesSection() {
  const [
    cateringCount,
    photographyCount,
    djCount,
    decorationCount,
    makeupArtistCount,
    otherCount,
  ] = await Promise.all([
    getActiveVendorCount("CATERER"),
    getActiveVendorCount("PHOTOGRAPHER"),
    getActiveVendorCount("DJ"),
    getActiveVendorCount("DECORATOR"),
    getActiveVendorCount("MAKEUP_ARTIST"),
    getActiveVendorCount("OTHER"),
  ]);

  const otherServicesCount =
    makeupArtistCount === null || otherCount === null
      ? null
      : makeupArtistCount + otherCount;

  const serviceCards: ServiceCardData[] = [
    {
      title: "Catering",
      description:
        "Discover catering professionals for weddings, parties and special occasions.",
      category: "CATERER",
      count: cateringCount,
      icon: UtensilsCrossed,
    },
    {
      title: "Photography",
      description:
        "Find photographers to capture every important moment of your event.",
      category: "PHOTOGRAPHER",
      count: photographyCount,
      icon: Camera,
    },
    {
      title: "DJ & Entertainment",
      description:
        "Explore DJs and entertainment professionals for memorable celebrations.",
      category: "DJ",
      count: djCount,
      icon: Music2,
    },
    {
      title: "Decoration",
      description:
        "Find decorators for venue styling, themes and event transformations.",
      category: "DECORATOR",
      count: decorationCount,
      icon: Sparkles,
    },
    {
      title: "Other Event Services",
      description:
        "Explore makeup artists and other professionals for your event requirements.",
      category: "OTHER_SERVICES",
      count: otherServicesCount,
      icon: BriefcaseBusiness,
    },
  ];

  return (
    <section
      id="vendors-services"
      className="scroll-mt-20 bg-[#F8FAFC] py-20"
      aria-labelledby="vendor-services-heading"
    >
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#2EAD45]">
              EVERYTHING ELSE, SORTED
            </p>

            <h2
              id="vendor-services-heading"
              className="font-semibold leading-tight text-[#0F172A]"
              style={{
                fontSize: "clamp(24px, 3vw, 36px)",
              }}
            >
              Vendors & Services
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
              Explore active service providers for catering,
              photography, entertainment, decoration and other event
              requirements.
            </p>
          </div>

          <Link
            href="/vendors"
            className="hidden shrink-0 items-center gap-2 text-sm font-semibold text-[#2EAD45] transition-all hover:gap-3 hover:text-[#1E8A32] md:flex"
          >
            View All Services
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>

        <div className="scrollbar-hide flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 md:grid md:snap-none md:grid-cols-2 md:overflow-visible lg:grid-cols-3 xl:grid-cols-5">
          {serviceCards.map((service) => {
            const Icon = service.icon;

            return (
              <article
                key={service.category}
                className="group flex min-h-[280px] w-[300px] flex-shrink-0 snap-start flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#BBF7D0] hover:shadow-xl md:w-auto"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#DCFCE7]">
                  <Icon
                    size={25}
                    className="text-[#2EAD45]"
                    aria-hidden="true"
                  />
                </div>

                <h3 className="mt-5 text-xl font-bold text-[#0F172A]">
                  {service.title}
                </h3>

                <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-[#1E8A32]">
                  {getCountLabel(service.count)}
                </p>

                <p className="mt-3 flex-1 text-sm leading-6 text-gray-500">
                  {service.description}
                </p>

                <Link
                  href={`/vendors?category=${service.category}`}
                  className="mt-6 flex w-fit items-center gap-2 text-sm font-semibold text-[#1E8A32] transition-colors hover:text-[#0F172A]"
                  aria-label={`View all ${service.title} providers`}
                >
                  View All

                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              </article>
            );
          })}
        </div>

        <div className="mt-6 flex justify-center md:hidden">
          <Link
            href="/vendors"
            className="flex items-center gap-2 rounded-full border border-[#2EAD45] px-5 py-2.5 text-sm font-semibold text-[#2EAD45] transition-colors hover:bg-[#2EAD45] hover:text-white"
          >
            View All Services
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}