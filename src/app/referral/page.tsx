import type { Metadata } from "next";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import ReferralForm from "@/components/referral/ReferralForm";

export const metadata: Metadata = {
  title: "Referral Program | BookFarmVilla",
  description:
    "Refer your friends to BookFarmVilla and earn rewards when they book a venue. Our referral program makes it easy to share great venues with friends and get rewarded.",
  alternates: {
    canonical: "/referral",
  },
};

export default function ReferralPage() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#F8FAFC] pb-12 pt-24 sm:pb-16 sm:pt-28 lg:pb-20">
        <div className="mx-auto max-w-[720px] px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="text-center mb-10 sm:mb-12">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#2EAD45]">
              Referral Program
            </p>
            <h1 className="text-3xl font-bold text-[#0F172A] md:text-4xl lg:text-5xl">
              Refer a Friend, Earn Rewards
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-base leading-7 text-gray-600 sm:text-lg">
              Know someone planning an event? Refer them to BookFarmVilla and when they book,
              you both benefit! Share the joy of finding the perfect venue.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
            <ReferralForm />
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="rounded-2xl bg-[#F0FDF4] p-6 text-center border border-green-100">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#2EAD45] text-white">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </div>
              <h3 className="mt-4 font-semibold text-[#0F172A]">Easy to Share</h3>
              <p className="mt-2 text-sm text-gray-600">
                Simple referral form - just fill in your details and your friend's contact info.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 text-center border border-gray-100 shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#2EAD45] text-white">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="mt-4 font-semibold text-[#0F172A]">Secure Process</h3>
              <p className="mt-2 text-sm text-gray-600">
                Your information is protected and only used to connect your friend with our team.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 text-center border border-gray-100 shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#2EAD45] text-white">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mt-4 font-semibold text-[#0F172A]">Rewards for Both</h3>
              <p className="mt-2 text-sm text-gray-600">
                When your friend books through us, you both receive special benefits.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}