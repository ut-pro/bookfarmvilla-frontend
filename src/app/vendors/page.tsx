import Link from "next/link";
import type { Metadata } from "next";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import JsonLd from "@/components/seo/JsonLd";
import {
  getSeoVendors,
  getVendorSocialImage,
} from "@/lib/seo-listings";
import VendorListingResults from "@/components/vendor/VendorListingResults";
import type {
  VendorCategoryFilter,
} from "@/types/vendor";

const SITE_URL = "https://www.bookfarmvilla.com";

interface VendorsPageProps {
  searchParams: Promise<{
    category?: string | string[];
  }>;
}

export async function generateMetadata({
  searchParams,
}: VendorsPageProps): Promise<Metadata> {
  const { category } = await searchParams;
  const selectedCategory = getValidCategory(category);
  const pageContent = selectedCategory
    ? categoryDetails[selectedCategory]
    : generalVendorDetails;
  const canonical = selectedCategory
    ? `/vendors?category=${selectedCategory}`
    : "/vendors";
  const vendors = await getSeoVendors(selectedCategory);
  const socialImage = getVendorSocialImage(vendors);
  const title = `${pageContent.title} | BookFarmVilla`;

  return {
    title,
    description: pageContent.description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      title,
      description: pageContent.description,
      url: `${SITE_URL}${canonical}`,
      images: [{ url: socialImage, alt: pageContent.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: pageContent.description,
      images: [socialImage],
    },
  };
}

const generalVendorDetails = {
  title: "Event Vendors & Services",
  description:
    "Find trusted vendors for weddings, parties and celebrations. Explore caterers, photographers, DJs, decorators and services in your city on BookFarmVilla.",
};

const categoryDetails: Record<
  VendorCategoryFilter,
  {
    title: string;
    description: string;
  }
> = {
  CATERER: {
    title: "Wedding & Event Caterers",
    description:
      "Discover wedding and event caterers. Compare service details, locations, images and ratings, then enquire with BookFarmVilla online for your next event.",
  },
  PHOTOGRAPHER: {
    title: "Wedding & Event Photographers",
    description:
      "Find wedding and event photographers for your celebration. Compare services, locations, images and ratings, then enquire with BookFarmVilla near you today.",
  },
  DJ: {
    title: "Wedding & Event DJs",
    description:
      "Find DJs and entertainment for weddings, parties and celebrations. Compare service details, locations, images and ratings, then enquire with BookFarmVilla.",
  },
  DECORATOR: {
    title: "Wedding & Event Decorators",
    description:
      "Discover wedding and event decorators for ceremonies, receptions and parties. Compare provider details, locations and images, then enquire with BookFarmVilla.",
  },
  OTHER_SERVICES: {
    title: "Makeup Artists & Event Services",
    description:
      "Explore makeup artists and other event services for weddings and celebrations. Compare provider details, locations and images, then enquire with BookFarmVilla.",
  },
};

const categoryLinks: Array<{
  category: VendorCategoryFilter;
  label: string;
}> = [
  {
    category: "CATERER",
    label: "Catering",
  },
  {
    category: "PHOTOGRAPHER",
    label: "Photography",
  },
  {
    category: "DJ",
    label: "DJ & Entertainment",
  },
  {
    category: "DECORATOR",
    label: "Decoration",
  },
  {
    category: "OTHER_SERVICES",
    label: "Other Event Services",
  },
];

function getValidCategory(
  value: string | string[] | undefined,
): VendorCategoryFilter | undefined {
  const normalizedValue = Array.isArray(value)
    ? value[0]
    : value;

  if (
    normalizedValue === "CATERER" ||
    normalizedValue === "PHOTOGRAPHER" ||
    normalizedValue === "DJ" ||
    normalizedValue === "DECORATOR" ||
    normalizedValue === "OTHER_SERVICES"
  ) {
    return normalizedValue;
  }

  return undefined;
}

export default async function VendorsPage({
  searchParams,
}: VendorsPageProps) {
  const resolvedSearchParams = await searchParams;

  const selectedCategory = getValidCategory(
    resolvedSearchParams.category,
  );

  const pageContent = selectedCategory
    ? categoryDetails[selectedCategory]
    : generalVendorDetails;
  const vendors = await getSeoVendors(selectedCategory);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: pageContent.title,
          itemListElement: vendors.map((vendor, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@type": "LocalBusiness",
              name: vendor.name,
              description:
                vendor.description?.trim() ||
                `${vendor.name} provides event services in ${vendor.city}.`,
              address: {
                "@type": "PostalAddress",
                addressLocality: vendor.city,
              },
              ...(vendor.priceRange
                ? { priceRange: vendor.priceRange }
                : {}),
              ...(vendor.images?.length
                ? {
                    image: vendor.images
                      .map((image) => image.url?.trim())
                      .filter(Boolean),
                  }
                : {}),
            },
          })),
        }}
      />
      <Header />

      <main className="min-h-screen bg-[#F8FAFC] pb-12 pt-24 sm:pb-16 sm:pt-28 lg:pb-20">
        <section aria-labelledby="vendors-page-heading">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12">
            <div className="mb-7 sm:mb-8">
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-[#2EAD45] sm:mb-2 sm:text-sm">
                Vendors & Services
              </p>

              <h1
                id="vendors-page-heading"
                className="font-bold leading-tight text-[#0F172A]"
                style={{
                  fontSize: "clamp(30px, 4vw, 48px)",
                }}
              >
                {pageContent.title}
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
                {pageContent.description}
              </p>
            </div>

            <nav
              className="scrollbar-hide -mx-4 mb-8 flex snap-x gap-2.5 overflow-x-auto px-4 pb-2 scroll-px-4 sm:-mx-6 sm:mb-10 sm:gap-3 sm:px-6 sm:scroll-px-6 lg:mx-0 lg:px-0"
              aria-label="Filter service providers by category"
            >
              <Link
                href="/vendors"
                scroll={false}
                aria-current={!selectedCategory ? "page" : undefined}
                className={`min-h-11 shrink-0 snap-start rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors sm:px-5 ${
                  !selectedCategory
                    ? "border-[#2EAD45] bg-[#2EAD45] text-white"
                    : "border-gray-200 bg-white text-gray-600 hover:border-[#2EAD45] hover:text-[#1E8A32]"
                }`}
              >
                All Services
              </Link>

              {categoryLinks.map((item) => {
                const isActive =
                  selectedCategory === item.category;

                return (
                  <Link
                    key={item.category}
                    href={`/vendors?category=${item.category}`}
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
            </nav>

            <VendorListingResults
              category={selectedCategory}
            />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
