import type { Metadata } from "next";

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
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "BookFarmVilla | Farmhouses, Villas & Wedding Lawns for Rent",
  description:
    "BookFarmVilla helps you find and book farmhouses, villas and wedding lawns for parties, celebrations and events, with useful venue details and enquiry support.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "BookFarmVilla | Farmhouses, Villas & Wedding Lawns for Rent",
    description:
      "BookFarmVilla helps you find and book farmhouses, villas and wedding lawns for parties, celebrations and events, with useful venue details and enquiry support.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1767950470198-c9cd97f8ed87?w=1440&h=900&fit=crop&auto=format",
        alt: "Wedding venue featured on BookFarmVilla",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BookFarmVilla | Farmhouses, Villas & Wedding Lawns for Rent",
    description:
      "BookFarmVilla helps you find and book farmhouses, villas and wedding lawns for parties, celebrations and events, with useful venue details and enquiry support.",
    images: [
      "https://images.unsplash.com/photo-1767950470198-c9cd97f8ed87?w=1440&h=900&fit=crop&auto=format",
    ],
  },
};

export const revalidate = 300;

export default function Home() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "BookFarmVilla",
          url: "https://www.bookfarmvilla.com",
          logo: "https://www.bookfarmvilla.com/logo/brand-logo-transparent.png",
          description:
            "BookFarmVilla helps people discover and enquire about farmhouses, villas, wedding lawns and event services.",
        }}
      />
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
