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
import type {
  PropertyType,
} from "@/types/property";

const SITE_URL = "https://www.bookfarmvilla.com";

interface PropertiesPageProps {
  searchParams: Promise<{
    type?: string | string[];
    city?: string | string[];
    minCapacity?: string | string[];
  }>;
}

const propertyTypeDetails: Record<
  PropertyType,
  { title: string; description: string }
> = {
  FARMHOUSE: {
    title: "Farmhouses for Rent",
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
};

const propertyTypeLinks: Array<{
  type: PropertyType;
  label: string;
}> = [
  { type: "FARMHOUSE", label: "Farmhouses" },
  { type: "VILLA", label: "Villas" },
  { type: "WEDDING_LAWN", label: "Wedding Lawns" },
];

function getValidPropertyType(
  value: string | string[] | undefined,
): PropertyType | undefined {
  const normalizedValue = Array.isArray(value) ? value[0] : value;

  if (
    normalizedValue === "FARMHOUSE" ||
    normalizedValue === "VILLA" ||
    normalizedValue === "WEDDING_LAWN"
  ) {
    return normalizedValue;
  }

  return undefined;
}

export async function generateMetadata({
  searchParams,
}: PropertiesPageProps): Promise<Metadata> {
  const { type, city, minCapacity } = await searchParams;
  const selectedType = getValidPropertyType(type);
  const pageContent = selectedType
    ? propertyTypeDetails[selectedType]
    : {
        title: "Properties for Rent",
        description:
          "Browse farmhouses, villas and wedding lawns for rent, with venue details, guest capacity, amenities, locations and pricing to help plan your next event.",
      };
  const canonical = selectedType
    ? `/properties?type=${selectedType}`
    : "/properties";
  const properties = await getSeoProperties(
    selectedType,
    getSingleSearchParam(city).trim() || undefined,
    getValidMinimumCapacity(minCapacity),
  );
  const socialImage = getPropertySocialImage(properties);

  return {
    title: selectedType
      ? `${pageContent.title} | BookFarmVilla`
      : `Properties for Rent | BookFarmVilla`,
    description: pageContent.description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      title: selectedType
        ? `${pageContent.title} | BookFarmVilla`
        : `Properties for Rent | BookFarmVilla`,
      description: pageContent.description,
      url: `${SITE_URL}${canonical}`,
      images: [{ url: socialImage, alt: pageContent.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: selectedType
        ? `${pageContent.title} | BookFarmVilla`
        : `Properties for Rent | BookFarmVilla`,
      description: pageContent.description,
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

function getValidMinimumCapacity(
  value: string | string[] | undefined,
): number | undefined {
  const normalizedValue =
    getSingleSearchParam(value);

  const parsedValue = Number(normalizedValue);

  if (
    !Number.isFinite(parsedValue) ||
    parsedValue <= 0
  ) {
    return undefined;
  }

  return parsedValue;
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

  const selectedMinimumCapacity =
    getValidMinimumCapacity(
      resolvedSearchParams.minCapacity,
    );

  const pageContent = selectedType
    ? propertyTypeDetails[selectedType]
    : {
        title: "Properties for Rent",
        description:
          "Browse farmhouses, villas and wedding lawns for rent, with venue details, guest capacity, amenities, locations and pricing to help plan your next event.",
      };

  const resultTitle = selectedCity
    ? `${pageContent.title} in ${selectedCity}`
    : pageContent.title;
  const properties = await getSeoProperties(
    selectedType,
    selectedCity || undefined,
    selectedMinimumCapacity,
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

      <main className="min-h-screen bg-[#F8FAFC] pb-20 pt-28">
        <section aria-labelledby="properties-page-heading">
          <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
            <div className="mb-8">
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#2EAD45]">
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

              {selectedMinimumCapacity && (
                <p className="mt-2 text-sm font-medium text-[#1E8A32]">
                  Showing venues for at least{" "}
                  {selectedMinimumCapacity} guests
                </p>
              )}
            </div>

            <nav
              className="mb-10 flex gap-3 overflow-x-auto pb-2"
              aria-label="Filter properties by type"
            >
              <Link
                href="/properties"
                className={`shrink-0 rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors ${
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
                    href={`/properties?type=${item.type}`}
                    className={`shrink-0 rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors ${
                      isActive
                        ? "border-[#2EAD45] bg-[#2EAD45] text-white"
                        : "border-gray-200 bg-white text-gray-600 hover:border-[#2EAD45] hover:text-[#1E8A32]"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <PropertyListingResults
              type={selectedType}
              city={selectedCity || undefined}
              minCapacity={selectedMinimumCapacity}
            />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
