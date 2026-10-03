import Link from "next/link";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import VendorListingResults from "@/components/vendor/VendorListingResults";
import type {
  VendorCategoryFilter,
} from "@/types/vendor";

interface VendorsPageProps {
  searchParams: Promise<{
    category?: string | string[];
  }>;
}

const categoryDetails: Record<
  VendorCategoryFilter,
  {
    title: string;
    description: string;
  }
> = {
  CATERER: {
    title: "Catering Services",
    description:
      "Explore active catering service providers available on BookFarmVilla.",
  },
  PHOTOGRAPHER: {
    title: "Photography Services",
    description:
      "Explore active photographers available for weddings and events.",
  },
  DJ: {
    title: "DJ & Entertainment Services",
    description:
      "Explore active DJs and entertainment service providers for your event.",
  },
  DECORATOR: {
    title: "Decoration Services",
    description:
      "Explore active decoration service providers for weddings and events.",
  },
  OTHER_SERVICES: {
    title: "Other Event Services",
    description:
      "Explore active makeup artists and other event service providers.",
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
    : {
        title: "Event Vendors & Services",
        description:
          "Explore active event service providers available on BookFarmVilla.",
      };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#F8FAFC] pb-20 pt-28">
        <section aria-labelledby="vendors-page-heading">
          <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
            <div className="mb-8">
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#2EAD45]">
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
              className="mb-10 flex gap-3 overflow-x-auto pb-2"
              aria-label="Filter service providers by category"
            >
              <Link
                href="/vendors"
                className={`shrink-0 rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors ${
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