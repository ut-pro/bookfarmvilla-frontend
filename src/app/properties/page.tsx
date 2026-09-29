import Link from "next/link";

import CallbackModal from "@/components/callback/CallbackModal";
import { CallbackProvider } from "@/components/callback/CallbackContext";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import PropertyCard from "@/components/property/PropertyCard";
import { PropertyDetailsProvider } from "@/components/property/PropertyDetailsContext";
import { getActiveProperties } from "@/lib/property-api";
import type {
  PropertyCardData,
  PropertyType,
} from "@/types/property";

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
    title: "All Farmhouses",
    description:
      "Explore active farmhouses available on BookFarmVilla.",
  },
  VILLA: {
    title: "All Villas",
    description: "Explore active villas available on BookFarmVilla.",
  },
  WEDDING_LAWN: {
    title: "All Wedding Lawns",
    description:
      "Explore active wedding lawns available on BookFarmVilla.",
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

  let properties: PropertyCardData[] = [];
  let propertyLoadError = false;

  try {
    properties = await getActiveProperties({
      type: selectedType,
      city: selectedCity || undefined,
      minCapacity: selectedMinimumCapacity,
      size: 100,
    });
  } catch (error) {
    propertyLoadError = true;
    console.error("Unable to load property listing:", error);
  }

  const pageContent = selectedType
    ? propertyTypeDetails[selectedType]
    : {
        title: "All Properties",
        description:
          "Explore active farmhouses, villas and wedding lawns available on BookFarmVilla.",
      };

  const resultTitle = selectedCity
  ? `${pageContent.title} in ${selectedCity}`
  : pageContent.title;

  return (
    <CallbackProvider>
      <PropertyDetailsProvider>
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

            {propertyLoadError ? (
              <div
                className="rounded-2xl border border-amber-200 bg-amber-50 px-6 py-12 text-center"
                role="alert"
              >
                <p className="font-semibold text-amber-900">
                  Properties could not be loaded right now.
                </p>
                <p className="mt-2 text-sm text-amber-800">
                  Please refresh the page or try again shortly.
                </p>
              </div>
            ) : properties.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {properties.map((property) => (
                  <div
                    key={property.id}
                    className="flex justify-center md:block"
                  >
                    <PropertyCard property={property} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
                <p className="text-base font-semibold text-[#0F172A]">
                  No properties available
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  No active properties are currently available in this
                  category.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

        <Footer />
        <CallbackModal />
      </PropertyDetailsProvider>
    </CallbackProvider>
  );
}
