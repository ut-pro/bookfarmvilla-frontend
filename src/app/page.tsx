import CategorySection from "@/components/home/CategorySection";
import HomePropertySections from "@/components/home/HomePropertySections";
import HeroSection from "@/components/home/HeroSection";
import PartnerSection from "@/components/home/PartnerSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import TrustFeatures from "@/components/home/TrustFeatures";
import VendorServicesSection from "@/components/home/VendorServicesSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

export const revalidate = 300;

export default function Home() {
  return (
    <>
      <Header />

      <main>
        <HeroSection />
        <TrustFeatures />
        <CategorySection />
        <HomePropertySections />
        <VendorServicesSection />
        <WhyChooseUs />
        <PartnerSection />
        <TestimonialsSection />
      </main>

      <Footer />
    </>
  );
}
