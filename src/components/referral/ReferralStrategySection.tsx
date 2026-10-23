"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle, Gift, Users, Star, Shield } from "lucide-react";

import { getReferralStrategy } from "@/lib/public-api";
import type { ReferralStrategySectionData, ReferralStep, ReferralBenefit } from "@/types/referral";

const STEP_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Gift,
  Users,
  Star,
  Shield,
  CheckCircle,
};

const BENEFIT_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Gift,
  Users,
  Star,
  Shield,
  CheckCircle,
};

interface ReferralStrategySectionProps {
  variant?: "property" | "vendor";
}

export default function ReferralStrategySection({ variant = "property" }: ReferralStrategySectionProps) {
  const [strategyData, setStrategyData] = useState<ReferralStrategySectionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadStrategy() {
      try {
        const data = await getReferralStrategy();
        if (mounted) {
          setStrategyData(data);
          setHasError(false);
        }
      } catch (error) {
        if (mounted) {
          setHasError(true);
          console.error("Failed to load referral strategy:", error);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadStrategy();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <section aria-labelledby="referral-strategy-heading" className="mt-12 sm:mt-16" role="status">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="text-center animate-pulse">
            <div className="h-6 w-48 bg-gray-200 rounded mx-auto mb-4" />
            <div className="h-4 w-64 bg-gray-200 rounded mx-auto mb-8" />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-2xl border border-gray-100 bg-white p-6">
                  <div className="h-12 w-12 bg-gray-200 rounded-xl mb-4" />
                  <div className="h-5 w-3/4 bg-gray-200 rounded mb-2" />
                  <div className="h-4 w-full bg-gray-200 rounded" />
                </div>
              ))}
            </div>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="rounded-2xl border border-gray-100 bg-white p-6">
                  <div className="h-12 w-12 bg-gray-200 rounded-xl mb-4" />
                  <div className="h-5 w-1/2 bg-gray-200 rounded mb-2" />
                  <div className="h-4 w-full bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (hasError || !strategyData) {
    return null;
  }

  const { title, subtitle, steps, benefits, ctaText, ctaHref } = strategyData;

  return (
    <section aria-labelledby="referral-strategy-heading" className="mt-12 sm:mt-16">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#2EAD45]">
            Referral Program
          </p>
          <h2 id="referral-strategy-heading" className="text-3xl font-bold text-[#0F172A] md:text-4xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-4 max-w-2xl mx-auto text-base leading-7 text-gray-600">
              {subtitle}
            </p>
          )}
        </div>

        {/* How It Works - Steps */}
        <div className="mb-12 sm:mb-16">
          <h3 className="sr-only">How It Works</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step: ReferralStep) => {
              const Icon = STEP_ICONS[step.icon] || CheckCircle;
              return (
                <article
                  key={step.step}
                  className="relative rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="absolute right-4 top-4 text-4xl font-bold text-[#F1F5F9]">
                    0{step.step}
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#DCFCE7]">
                    <Icon size={24} className="text-[#2EAD45]" aria-hidden="true" />
                  </div>
                  <h4 className="mt-5 font-semibold text-[#0F172A]">
                    {step.title}
                  </h4>
                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    {step.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-12 sm:mb-16">
          <h3 className="sr-only">Benefits</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {benefits.map((benefit: ReferralBenefit, index: number) => {
              const Icon = BENEFIT_ICONS[benefit.icon] || Gift;
              return (
                <article
                  key={index}
                  className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#DCFCE7]">
                    <Icon size={24} className="text-[#2EAD45]" aria-hidden="true" />
                  </div>
                  <h4 className="mt-5 font-semibold text-[#0F172A]">
                    {benefit.title}
                  </h4>
                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    {benefit.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href={ctaHref}
            className="inline-flex items-center gap-2 rounded-xl bg-[#2EAD45] px-7 py-3.5 font-semibold text-white transition-colors hover:bg-[#1E8A32]"
          >
            {ctaText}
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}