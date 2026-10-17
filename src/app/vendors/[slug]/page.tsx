import Link from "next/link";
import {
  notFound,
  permanentRedirect,
} from "next/navigation";
import { ArrowLeft } from "lucide-react";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import VendorDetailsPageContent from "@/components/vendor/VendorDetailsPageContent";
import { getVendorBySlug } from "@/lib/public-api";

interface VendorDetailsPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function VendorDetailsPage({
  params,
}: VendorDetailsPageProps) {
  const { slug } = await params;
  const vendor = await getVendorBySlug(slug);

  if (!vendor) {
    notFound();
  }

  const canonicalSlug = vendor.slug?.trim();

  if (canonicalSlug && slug !== canonicalSlug) {
    permanentRedirect(
      `/vendors/${encodeURIComponent(canonicalSlug)}`,
    );
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#F8FAFC] pb-12 pt-24 sm:pb-16 sm:pt-28 lg:pb-20">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 xl:px-12">
          <Link
            href="/vendors"
            className="mb-5 inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-semibold text-[#1E8A32] transition-colors hover:text-[#0F172A] sm:mb-6"
          >
            <ArrowLeft size={17} aria-hidden="true" />
            Back to Vendors & Services
          </Link>

          <VendorDetailsPageContent vendor={vendor} />
        </div>
      </main>

      <Footer />
    </>
  );
}
