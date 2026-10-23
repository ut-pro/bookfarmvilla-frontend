"use client";

import Link from "next/link";
import { ArrowRight, Gift, Users } from "lucide-react";

import type { ReferralBannerData } from "@/types/referral";

interface ReferralBannerProps {
  data: ReferralBannerData;
  variant?: "homepage" | "listing" | "detail";
}

export default function ReferralBanner({
  data,
  variant = "homepage",
}: ReferralBannerProps) {
  const { headline, subtext, ctaText, ctaHref, backgroundColor, textColor, accentColor } = data;

  const bannerStyle: React.CSSProperties = {
    backgroundColor: backgroundColor || "#1E8A32",
    color: textColor || "#FFFFFF",
  };

  const ctaStyle: React.CSSProperties = {
    backgroundColor: accentColor || "#F59E0B",
    color: "#0F172A",
  };

  const iconColor = textColor || "#FFFFFF";

  return (
    <section
      aria-labelledby="referral-banner-heading"
      className="relative overflow-hidden"
      style={bannerStyle}
    >
      {/* Decorative background pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
        aria-hidden="true"
      />

      {/* Floating decorative elements */}
      <div className="absolute top-4 right-4 opacity-20" aria-hidden="true">
        <Gift size={64} style={{ color: iconColor }} />
      </div>
      <div className="absolute bottom-4 left-4 opacity-20" aria-hidden="true">
        <Users size={64} style={{ color: iconColor }} />
      </div>

      <div className="relative mx-auto max-w-[1440px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8 xl:px-12">
        <div className="flex flex-col items-center text-center gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <div className="flex flex-col gap-2 sm:max-w-2xl">
            <h2
              id="referral-banner-heading"
              className="text-xl font-bold leading-tight sm:text-2xl"
              style={{ color: textColor || "#FFFFFF" }}
            >
              {headline}
            </h2>
            <p className="text-sm leading-6 opacity-90 sm:text-base" style={{ color: textColor || "#FFFFFF" }}>
              {subtext}
            </p>
          </div>

          <Link
            href={ctaHref}
            className="inline-flex items-center gap-2 shrink-0 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 sm:px-6 sm:py-3"
            style={ctaStyle}
            aria-label={ctaText}
          >
            {ctaText}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}