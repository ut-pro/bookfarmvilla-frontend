import type { Metadata } from "next";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import ReferralPolicySection from "@/components/referral/ReferralPolicySection";

export const metadata: Metadata = {
  title: "Referral Program Terms & Conditions | BookFarmVilla",
  description:
    "Read the complete terms and conditions for the BookFarmVilla referral program. Understand how referrals work, eligibility criteria, rewards, and more.",
  alternates: {
    canonical: "/referral/terms",
  },
};

export default function ReferralTermsPage() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#F8FAFC] pb-12 pt-24 sm:pb-16 sm:pt-28 lg:pb-20">
        <div className="mx-auto max-w-[1100px] px-6 lg:px-12">
          <div className="text-center mb-12 sm:mb-16">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#2EAD45]">
              Referral Program
            </p>
            <h1 className="text-3xl font-bold text-[#0F172A] md:text-4xl lg:text-5xl">
              Terms & Conditions
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-base leading-7 text-gray-600 sm:text-lg">
              Please read these terms carefully before participating in our referral program.
            </p>
          </div>

          <ReferralPolicySection />
        </div>
      </main>

      <Footer />
    </>
  );
}