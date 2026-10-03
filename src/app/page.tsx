import CallbackModal from "@/components/callback/CallbackModal";
import { CallbackProvider } from "@/components/callback/CallbackContext";
import CategorySection from "@/components/home/CategorySection";
import HomePropertySections from "@/components/home/HomePropertySections";
import HeroSection from "@/components/home/HeroSection";
import PartnerSection from "@/components/home/PartnerSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import TrustFeatures from "@/components/home/TrustFeatures";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { PropertyDetailsProvider } from "@/components/property/PropertyDetailsContext";

export default function Home() {
  return (
    <CallbackProvider>
      <PropertyDetailsProvider>
        <Header />

        <main>
        <HeroSection />
        <TrustFeatures />
        <CategorySection />
        <HomePropertySections />

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
