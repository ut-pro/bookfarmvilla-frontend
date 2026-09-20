import CategorySection from "@/components/home/CategorySection";
import HeroSection from "@/components/home/HeroSection";
import PartnerSection from "@/components/home/PartnerSection";
import PropertySection from "@/components/home/PropertySection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import TrustFeatures from "@/components/home/TrustFeatures";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { CallbackProvider } from "@/components/callback/CallbackContext";
import CallbackModal from "@/components/callback/CallbackModal";

import {
  farmhouseProperties,
  villaProperties,
  weddingLawnProperties,
} from "@/data/properties";

export default function Home() {
  return (
    <CallbackProvider>
      <Header />

      <main>
        <HeroSection />
        <TrustFeatures />
        <CategorySection />

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
    </ CallbackProvider>
  );
}