"use client";

import { useEffect, useState } from "react";

import { getReferralBanner } from "@/lib/public-api";
import ReferralBanner from "./ReferralBanner";
import type { ReferralBannerData } from "@/types/referral";

interface ReferralBannerWrapperProps {
  variant?: "homepage" | "listing" | "detail";
}

export default function ReferralBannerWrapper({
  variant = "homepage",
}: ReferralBannerWrapperProps) {
  const [bannerData, setBannerData] = useState<ReferralBannerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadBanner() {
      try {
        const data = await getReferralBanner();
        if (mounted) {
          setBannerData(data);
          setHasError(false);
        }
      } catch (error) {
        if (mounted) {
          setHasError(true);
          console.error("Failed to load referral banner:", error);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadBanner();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <section
        aria-labelledby="referral-banner-heading"
        className="bg-[#1E8A32] py-8 sm:py-10"
        role="status"
      >
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex flex-col items-center text-center gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <div className="flex flex-col gap-2 sm:max-w-2xl animate-pulse">
              <div className="h-7 w-3/4 bg-white/30 rounded" />
              <div className="h-5 w-1/2 bg-white/20 rounded" />
            </div>
            <div className="h-11 w-32 shrink-0 rounded-xl bg-white/30 animate-pulse" />
          </div>
        </div>
      </section>
    );
  }

  if (hasError || !bannerData) {
    return null;
  }

  return <ReferralBanner data={bannerData} variant={variant} />;
}