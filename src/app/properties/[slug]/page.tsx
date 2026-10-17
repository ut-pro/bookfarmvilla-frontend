import Link from "next/link";
import {
  notFound,
  permanentRedirect,
} from "next/navigation";
import { ArrowLeft } from "lucide-react";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import PropertyDetailsPageContent from "@/components/property/PropertyDetailsPageContent";
import { getPropertyBySlug } from "@/lib/property-api";

interface PropertyDetailsPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function PropertyDetailsPage({
  params,
}: PropertyDetailsPageProps) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  const canonicalSlug = property.slug?.trim();

  if (canonicalSlug && slug !== canonicalSlug) {
    permanentRedirect(
      `/properties/${encodeURIComponent(canonicalSlug)}`,
    );
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#F8FAFC] pb-12 pt-24 sm:pb-16 sm:pt-28 lg:pb-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 xl:px-12">
          <Link
            href="/properties"
            className="mb-5 inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-semibold text-[#1E8A32] transition-colors hover:text-[#0F172A] sm:mb-6"
          >
            <ArrowLeft size={17} aria-hidden="true" />
            Back to Properties
          </Link>

          <PropertyDetailsPageContent property={property} />
        </div>
      </main>

      <Footer />
    </>
  );
}
