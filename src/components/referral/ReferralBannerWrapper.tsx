"use client";

import { useEffect, useState } from "react";

import { getReferralBanner } from "@/lib/public-api";
import ReferralBanner from "./ReferralBanner";
import type { ReferralBannerData } from "@/types/referral";

interface ReferralBannerWrapperProps {
  variant?: "homepage" | "listing" | "detail";
}

// Static fallback data for when the API is unavailable
const STATIC_BANNER_DATA: ReferralBannerData = {
  headline: "REFER A CUSTOMER. EARN 2%",
  subtext: "You share the customer's contact details. Our team handles the enquiry and booking. Simple referrals · No booking hassle",
  ctaText: "Join the Referral Program →",
  ctaHref: "/referral",
  backgroundColor: "#1E8A32",
  textColor: "#FFFFFF",
  accentColor: "#F59E0B",
};

export default function ReferralBannerWrapper({
  variant = "homepage",
}: ReferralBannerWrapperProps) {
  const [bannerData, setBannerData] = useState<ReferralBannerData>(STATIC_BANNER_DATA);

  useEffect(() => {
    let mounted = true;

    async function loadBanner() {
      try {
        const data = await getReferralBanner();
        if (mounted && data) {
          setBannerData(data);

        }
      } catch {
        // Keep the static banner visible when the optional API is unavailable.
      }
    }

    loadBanner();

    return () => {
      mounted = false;
    };
  }, []);


  return <ReferralBanner data={bannerData} variant={variant} />;
}