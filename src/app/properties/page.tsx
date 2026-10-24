import Link from "next/link";
import type { Metadata } from "next";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import JsonLd from "@/components/seo/JsonLd";
import {
  getPropertySocialImage,
  getSeoProperties,
} from "@/lib/seo-listings";
import PropertyListingResults from "@/components/property/PropertyListingResults";
import ReferralBannerWrapper from "@/components/referral/ReferralBannerWrapper";
import FAQAccordion from "@/components/ui/FAQAccordion";
import { propertyListingFAQs } from "@/data/faq";
import type {
  PropertyType,
} from "@/types/property";

const SITE_URL = "https://www.bookfarmvilla.com";

interface PropertiesPageProps {
  searchParams: Promise<{
    type?: string | string[];
    city?: string | string[];
    sort?: string | string[];
    keyword?: string | string[];
  }>;
}

const propertyTypeDetails: Record<
  PropertyType,
  { title: string; description: string }
> = {
  FARMHOUSE: {
    title: "Farmhouses",
    description:
      "Find farmhouses for rent and booking with guest capacity, amenities, location and pricing details, ideal for parties, family celebrations and private events.",
  },
  VILLA: {
    title: "Villas for Rent",
    description:
      "Discover villas for rent and booking with guest capacity, amenities, location and pricing details for private stays, parties, family celebrations and events.",
  },
  WEDDING_LAWN: {
    title: "Wedding Lawns & Venues",
    description:
      "Explore wedding lawns and venues for ceremonies, receptions and celebrations, with capacity, amenities, location and pricing details to help plan your event.",
  },
  AIRBNB: {
    title: "Holiday Homes",
    description:
      "Explore holiday homes for rent, with venue details, guest capacity, amenities, locations and pricing to help plan your next stay.",
  },
};

const propertyTypeLinks: Array<{
  type: PropertyType;
  label: string;
}> = [
  { type: "FARMHOUSE", label: "Farmhouses" },
  { type: "VILLA", label: "Villas" },
  { type: "WEDDING_LAWN", label: "Wedding Lawns" },
  { type: "AIRBNB", label: "Holiday Homes" },
];

function getPropertyPageContent(type: PropertyType | undefined, city: string) {
  const base = type ? propertyTypeDetails[type] : {
    title: "Properties for Rent",
    description: "Browse farmhouses, villas and wedding lawns for rent, with venue details, guest capacity, amenities, locations and pricing to help plan your next event.",
  };
  if (!city) return base;
  const title = `${type === "FARMHOUSE" ? "Farmhouses" : base.title} in ${city}`;
  const category = type === "FARMHOUSE" ? "farmhouses" : type === "VILLA" ? "villas" : type === "WEDDING_LAWN" ? "wedding lawns and venues" : type === "AIRBNB" ? "holiday homes and homestays" : "farmhouses, villas and wedding lawns";
  const description = type === "FARMHOUSE"
    ? `Discover farmhouses for rent in ${city} with guest capacity, amenities and pricing for parties, family celebrations and private events.`
    : type === "VILLA"
      ? `Find villas for rent in ${city} for private stays, parties, family celebrations and weekend getaways, with amenities and pricing details.`
      : type === "WEDDING_LAWN"
        ? `Explore wedding lawns and venues in ${city} for ceremonies, receptions and celebrations, with capacity, amenities and pricing details.`
        : type === "AIRBNB"
          ? `Discover holiday homes and homestays in ${city} for comfortable stays, family trips and weekend getaways, with amenities and pricing details.`
          : `Browse ${category} in ${city} with guest capacity, amenities, locations and pricing for parties, weddings, family celebrations and private events.`;
  return { title, description };
}

function getValidPropertyType(
  value: string | string[] | undefined,
): PropertyType | undefined {
  const normalizedValue = Array.isArray(value) ? value[0] : value;

  if (
    normalizedValue === "FARMHOUSE" ||
    normalizedValue === "VILLA" ||
    normalizedValue === "WEDDING_LAWN" ||
    normalizedValue === "AIRBNB"
  ) {
    return normalizedValue;
  }

  return undefined;
}

export async function generateMetadata({
  searchParams,
}: PropertiesPageProps): Promise<Metadata> {
  const { type, city } = await searchParams;
  const selectedType = getValidPropertyType(type);
  const selectedCity = getSingleSearchParam(city).trim();

  const pageContent = getPropertyPageContent(selectedType, selectedCity);

      const canonicalParams = new URLSearchParams();

  if (selectedType) {
    canonicalParams.set("type", selectedType);
  }

  if (selectedCity) {
    canonicalParams.set("city", selectedCity);
  }

  const canonicalQuery = canonicalParams.toString();

  const canonical = canonicalQuery
    ? `/properties?${canonicalQuery}`
    : "/properties";

  const properties = await getSeoProperties(
    selectedType,
    selectedCity || undefined,
  );

  const socialImage = getPropertySocialImage(properties);

  const metadataTitle = `${pageContent.title} | BookFarmVilla`;
  const metadataDescription = pageContent.description;

  return {
    title: metadataTitle,
    description: metadataDescription,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      title: metadataTitle,
      description: metadataDescription,
      url: `${SITE_URL}${canonical}`,
      images: [{ url: socialImage, alt: pageContent.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: metadataTitle,
      description: metadataDescription,
      images: [socialImage],
    },
  };
}

function getSingleSearchParam(
  value: string | string[] | undefined,
): string {
  return Array.isArray(value)
    ? value[0] ?? ""
    : value ?? "";
}

export default async function PropertiesPage({
  searchParams,
}: PropertiesPageProps) {
  const resolvedSearchParams = await searchParams;
  const selectedType = getValidPropertyType(
    resolvedSearchParams.type,
  );
  const selectedCity = getSingleSearchParam(
    resolvedSearchParams.city,
  ).trim();

  const pageContent = getPropertyPageContent(selectedType, selectedCity);

  const resultTitle = pageContent.title;
  const properties = await getSeoProperties(
    selectedType,
    selectedCity || undefined,
  );

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: pageContent.title,
          itemListElement: properties.map((property, index) => {
            const item: Record<string, unknown> = {
              "@type": "Place",
              name: property.name,
              description:
                property.description ??
                `${property.name} is a ${property.type
                  .toLowerCase()
                  .replace("_", " ")} in ${property.city ?? property.location}.`,
              address: {
                "@type": "PostalAddress",
                addressLocality: property.city ?? property.location,
                ...(property.location !== property.city
                  ? { streetAddress: property.location }
                  : {}),
              },
              additionalProperty: [
                ...(property.guestCapacity > 0
                  ? [
                      {
                        "@type": "PropertyValue",
                        name: "Guest capacity",
                        value: property.guestCapacity,
                      },
                    ]
                  : []),
                ...(property.amenities ?? []).map((amenity) => ({
                  "@type": "PropertyValue",
                  name: "Amenity",
                  value: amenity,
                })),
              ],
            };

            if (
              property.imageUrl !==
              "/images/property-placeholder.svg"
            ) {
              item.image = property.imageUrl;
            }

            return {
              "@type": "ListItem",
              position: index + 1,
              item,
            };
          }),
        }}
      />
      <Header />

      <main className="min-h-screen bg-[#F8FAFC] pb-12 pt-24 sm:pb-16 sm:pt-28 lg:pb-20">
        <section aria-labelledby="properties-page-heading">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12">
            <div className="mb-7 sm:mb-8">
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-[#2EAD45] sm:mb-2 sm:text-sm">
                Browse Properties
              </p>

              <h1
                id="properties-page-heading"
                className="font-bold leading-tight text-[#0F172A]"
                style={{ fontSize: "clamp(30px, 4vw, 48px)" }}
              >
                {resultTitle}
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
                {pageContent.description}
              </p>
            </div>

            <nav
              className="scrollbar-hide -mx-4 mb-8 flex snap-x gap-2.5 overflow-x-auto px-4 pb-2 scroll-px-4 sm:-mx-6 sm:mb-10 sm:gap-3 sm:px-6 sm:scroll-px-6 lg:mx-0 lg:px-0"
              aria-label="Filter properties by type"
            >
              <Link
                href="/properties"
                scroll={false}
                aria-current={!selectedType ? "page" : undefined}
                className={`min-h-11 shrink-0 snap-start rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors sm:px-5 ${
                  !selectedType
                    ? "border-[#2EAD45] bg-[#2EAD45] text-white"
                    : "border-gray-200 bg-white text-gray-600 hover:border-[#2EAD45] hover:text-[#1E8A32]"
                }`}
              >
                All Properties
              </Link>

              {propertyTypeLinks.map((item) => {
                const isActive = selectedType === item.type;

                return (
                  <Link
                    key={item.type}
                    href={`/properties?type=${item.type}${selectedCity ? `&city=${encodeURIComponent(selectedCity)}` : ""}`}
                    scroll={false}
                    aria-current={isActive ? "page" : undefined}
                    className={`min-h-11 shrink-0 snap-start rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors sm:px-5 ${
                      isActive
                        ? "border-[#2EAD45] bg-[#2EAD45] text-white"
                        : "border-gray-200 bg-white text-gray-600 hover:border-[#2EAD45] hover:text-[#1E8A32]"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <Link
                href="/vendors"
                scroll={false}
                className="min-h-11 shrink-0 snap-start rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:border-[#2EAD45] hover:text-[#1E8A32] sm:px-5"
              >
                Vendors
              </Link>
            </nav>

            <PropertyListingResults
              type={selectedType}
              city={selectedCity || undefined}
              sort={getSingleSearchParam(resolvedSearchParams.sort) || undefined}
              keyword={getSingleSearchParam(resolvedSearchParams.keyword) || undefined}
              initialProperties={properties}
            />
            <div className="mt-12 sm:mt-16">
              <ReferralBannerWrapper variant="listing" />
            </div>
            <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12 mt-16">
              <FAQAccordion items={propertyListingFAQs} title="Frequently Asked Questions" />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

