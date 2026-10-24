import Link from "next/link";
import { ArrowRight, Gift, Handshake, Sparkles, Users } from "lucide-react";
import type { ReferralBannerData } from "@/types/referral";

interface ReferralBannerProps {
  data: ReferralBannerData;
  variant?: "homepage" | "listing" | "detail";
}

export default function ReferralBanner({ data, variant = "homepage" }: ReferralBannerProps) {
  const { ctaText, ctaHref } = data;
  const isDetail = variant === "detail";

  return (
    <section
      aria-labelledby="referral-banner-heading"
      className={`relative isolate mx-auto w-full overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-br from-[#F0FBF3] via-white to-[#E7F8EC] text-[#102743] shadow-[0_12px_34px_rgba(16,39,67,0.06)] ${isDetail ? "max-w-6xl" : "max-w-[1440px]"}`}
    >
      <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full border border-emerald-200/70" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-5 -top-9 h-44 w-44 rounded-full border border-emerald-200/70" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-0 right-1/3 h-24 w-24 rounded-full bg-emerald-100/40 blur-2xl" />

      <div className={`relative grid items-center gap-7 ${isDetail ? "px-5 py-7 sm:px-8 lg:grid-cols-[1fr_auto] lg:gap-10 lg:px-10" : "px-5 py-7 sm:px-8 lg:grid-cols-[1.2fr_1fr_auto] lg:gap-8 lg:px-10 lg:py-9"}`}>
        <div className="min-w-0">
          <div className="mb-3 inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.17em] text-[#16843A] sm:text-[11px]">
            <Sparkles size={14} aria-hidden="true" /> BookFarmVilla Referral Program
          </div>
          <h2 id="referral-banner-heading" className="max-w-2xl text-2xl font-extrabold leading-tight tracking-tight text-[#102743] sm:text-3xl lg:text-[34px]">
            Refer a Customer. <span className="text-[#159447]">Earn 2%.</span>
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
            You share the lead. Our team handles the booking.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-slate-600 sm:text-sm">
            <Gift size={16} className="text-[#159447]" aria-hidden="true" /> Simple referrals <span className="text-emerald-400">·</span> No booking hassle
          </div>
        </div>

        {!isDetail && (
          <div className="hidden items-center justify-center gap-3 lg:flex" aria-label="How the referral program works">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#159447] shadow-sm ring-1 ring-emerald-100"><Users size={20} aria-hidden="true" /></div>
            <div className="h-px w-6 bg-emerald-200" />
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#159447] shadow-sm ring-1 ring-emerald-100"><Handshake size={20} aria-hidden="true" /></div>
            <div className="h-px w-6 bg-emerald-200" />
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#159447] shadow-sm ring-1 ring-emerald-100"><Gift size={20} aria-hidden="true" /></div>
          </div>
        )}

        <div className="flex flex-col items-start gap-3 lg:items-end">
          <Link
            href={ctaHref || "/referral"}
            className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#159447] px-5 py-3 text-sm font-bold text-white shadow-[0_7px_16px_rgba(21,148,71,0.18)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#117B3A] hover:shadow-[0_10px_22px_rgba(21,148,71,0.24)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#159447] focus-visible:ring-offset-2 sm:w-auto sm:min-w-[220px]"
          >
            {ctaText || "Join the Referral Program"}
            <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
          <span className="text-xs text-slate-500">Eligible bookings · Terms apply</span>
        </div>
      </div>
    </section>
  );
}
