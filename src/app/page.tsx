import CallbackModal from "@/components/callback/CallbackModal";
import { CallbackProvider } from "@/components/callback/CallbackContext";
import CategorySection from "@/components/home/CategorySection";
import HeroSection from "@/components/home/HeroSection";
import PartnerSection from "@/components/home/PartnerSection";
import PropertySection from "@/components/home/PropertySection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import TrustFeatures from "@/components/home/TrustFeatures";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { PropertyDetailsProvider } from "@/components/property/PropertyDetailsContext";
import { getActiveProperties } from "@/lib/property-api";
import type { PropertyCardData } from "@/types/property";

export default async function Home() {
  let farmhouseProperties: PropertyCardData[] = [];
  let villaProperties: PropertyCardData[] = [];
  let weddingLawnProperties: PropertyCardData[] = [];
  let propertyLoadError = false;

  try {
    [
      farmhouseProperties,
      villaProperties,
      weddingLawnProperties,
    ] = await Promise.all([
      getActiveProperties({ type: "FARMHOUSE", size: 4 }),
      getActiveProperties({ type: "VILLA", size: 4 }),
      getActiveProperties({ type: "WEDDING_LAWN", size: 4 }),
    ]);
  } catch (error) {
    propertyLoadError = true;
    console.error("Unable to load homepage properties:", error);
  }

  return (
    <CallbackProvider>
      <PropertyDetailsProvider>
        <Header />

        <main>
        <HeroSection />
        <TrustFeatures />
        <CategorySection />

        {propertyLoadError && (
          <div
            className="mx-auto mt-10 max-w-[1344px] px-6 lg:px-12"
            role="alert"
          >
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
              Properties could not be loaded right now. Please refresh the
              page or try again shortly.
            </div>
          </div>
        )}

        <PropertySection
          id="farmhouses"
          subtitle="Trending Near You"
          title="Popular Farmhouses"
          properties={farmhouseProperties}
          viewAllLabel="View All Farmhouses"
          viewAllHref="/properties?type=FARMHOUSE"
          backgroundClassName="bg-white"
        />

        <PropertySection
          id="villas"
          subtitle="Handpicked Collection"
          title="Luxury Villas"
          properties={villaProperties}
          viewAllLabel="View All Villas"
          viewAllHref="/properties?type=VILLA"
          backgroundClassName="bg-[#F8FAFC]"
        />

        <PropertySection
          id="wedding-lawns"
          subtitle="Your Dream Venue Awaits"
          title="Wedding Lawns"
          properties={weddingLawnProperties}
          viewAllLabel="View All Wedding Lawns"
          viewAllHref="/properties?type=WEDDING_LAWN"
          backgroundClassName="bg-white"
        />

        <WhyChooseUs />
        <PartnerSection />
        <TestimonialsSection />
      </main>

        <Footer />
        <CallbackModal />
      </PropertyDetailsProvider>
    </CallbackProvider>
  );
}
