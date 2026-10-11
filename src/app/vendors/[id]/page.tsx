import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import VendorDetailsPageContent from "@/components/vendor/VendorDetailsPageContent";
import { getVendorById } from "@/lib/public-api";

interface VendorDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function VendorDetailsPage({
  params,
}: VendorDetailsPageProps) {
  const { id } = await params;
  const vendor = await getVendorById(id);

  if (!vendor) {
    notFound();
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#F8FAFC] pb-20 pt-28">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-12">
          <Link
            href="/vendors"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#1E8A32] transition-colors hover:text-[#0F172A]"
          >
            <ArrowLeft
              size={17}
              aria-hidden="true"
            />
            Back to Vendors & Services
          </Link>

          <VendorDetailsPageContent
            vendor={vendor}
          />
        </div>
      </main>

      <Footer />
    </>
  );
}