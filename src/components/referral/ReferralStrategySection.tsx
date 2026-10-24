"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle, Gift, Users, Star, Shield } from "lucide-react";
import { getReferralStrategy } from "@/lib/public-api";
import type { ReferralStrategySectionData, ReferralStep, ReferralBenefit } from "@/types/referral";

const STEP_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = { Gift, Users, Star, Shield, CheckCircle };
const BENEFIT_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = { Gift, Users, Star, Shield, CheckCircle };
const STATIC_STRATEGY_DATA: ReferralStrategySectionData = {
  title: "Know someone planning an event?",
  subtitle: "Refer them to BookFarmVilla and earn 2% on an eligible booking.",
  steps: [
    { step: 1, title: "Refer", description: "Share the customer's contact details with their consent.", icon: "Gift" },
    { step: 2, title: "We handle it", description: "Our team follows up and manages the booking process.", icon: "Users" },
    { step: 3, title: "Earn 2%", description: "Receive the applicable reward under the referral policy.", icon: "Star" },
  ],
  benefits: [
    { title: "Simple Process", description: "Just share contact details — we handle the rest.", icon: "Gift" },
    { title: "Trusted Network", description: "Your referrals connect with verified venues and vendors.", icon: "Shield" },
    { title: "Rewards on eligible bookings", description: "Applicable rewards follow the referral policy.", icon: "Star" },
  ],
  ctaText: "Refer a Customer",
  ctaHref: "/referral",
};

interface ReferralStrategySectionProps { variant?: "property" | "vendor"; }

export default function ReferralStrategySection({ variant = "property" }: ReferralStrategySectionProps) {
  // Render useful content immediately; the optional API only enriches the static fallback.
  const [strategyData, setStrategyData] = useState<ReferralStrategySectionData>(STATIC_STRATEGY_DATA);

  useEffect(() => {
    let active = true;
    getReferralStrategy().then((data) => {
      if (active && data) setStrategyData({ ...STATIC_STRATEGY_DATA, ...data });
    }).catch(() => {
      // Keep the useful static section visible when the optional endpoint is unavailable.
    });
    return () => { active = false; };
  }, []);

  const { title, subtitle, steps, benefits, ctaText, ctaHref } = strategyData;

  return (
    <section aria-labelledby="referral-strategy-heading" className="mx-auto mt-10 w-full max-w-6xl sm:mt-14">
      <div className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-br from-[#F0FBF3] via-white to-[#E7F8EC] px-5 py-7 shadow-[0_10px_30px_rgba(16,39,67,0.045)] sm:px-8 sm:py-8 lg:px-10">
        <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-14 h-48 w-48 rounded-full border border-emerald-200/70" />
        <div className="relative grid gap-7 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-10">
          <div>
            <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#159447]">BookFarmVilla Referral Program</p>
            <h2 id="referral-strategy-heading" className="max-w-2xl text-2xl font-extrabold leading-tight tracking-tight text-[#102743] sm:text-3xl">{title}</h2>
            {subtitle && <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">{subtitle}</p>}
            <div className="mt-6 grid gap-4 sm:grid-cols-3 sm:gap-5">
              {steps.slice(0, 3).map((step: ReferralStep, index) => {
                const Icon = STEP_ICONS[step.icon] || CheckCircle;
                return <div key={step.step} className="flex gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#159447] shadow-sm ring-1 ring-emerald-100"><Icon size={19} aria-hidden="true" /></span>
                  <div><p className="text-sm font-bold text-[#102743]">{step.step}. {step.title}</p><p className="mt-1 text-xs leading-5 text-slate-600 sm:text-sm">{step.description}</p></div>
                </div>;
              })}
            </div>
          </div>
          <div className="flex flex-col items-start gap-3 lg:items-end lg:pl-3">
            <Link href={ctaHref || "/referral"} className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#159447] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#117B3A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#159447] focus-visible:ring-offset-2 sm:w-auto sm:min-w-[190px]">
              {ctaText || "Refer a Customer"}<ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
            <span className="text-xs text-slate-500">Eligible bookings · Terms apply</span>
          </div>
        </div>
      </div>
      {benefits.length > 0 && <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {benefits.slice(0, 3).map((benefit: ReferralBenefit, index) => {
          const Icon = BENEFIT_ICONS[benefit.icon] || Gift;
          return <article key={`${benefit.title}-${index}`} className="flex gap-3 rounded-2xl border border-slate-100 bg-white p-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[#159447]"><Icon size={18} aria-hidden="true" /></span>
            <div><h3 className="text-sm font-bold text-[#102743]">{benefit.title}</h3><p className="mt-1 text-xs leading-5 text-slate-600">{benefit.description}</p></div>
          </article>;
        })}
      </div>}
    </section>
  );
}
