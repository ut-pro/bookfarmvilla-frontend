"use client";

import { useEffect, useState } from "react";
import { ArrowRight, FileText, Shield, Handshake } from "lucide-react";

import { getReferralPolicy } from "@/lib/public-api";
import type { ReferralPolicyData } from "@/types/referral";

export default function ReferralPolicySection() {
  const [policyData, setPolicyData] = useState<ReferralPolicyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadPolicy() {
      try {
        const data = await getReferralPolicy();
        if (mounted) {
          setPolicyData(data);
          setHasError(false);
        }
      } catch (error) {
        if (mounted) {
          setHasError(true);
          console.error("Failed to load referral policy:", error);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadPolicy();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <section aria-labelledby="referral-policy-heading" className="bg-white py-12 sm:py-16 lg:py-20" role="status">
        <div className="mx-auto max-w-[1100px] px-6 text-center lg:px-12 animate-pulse">
          <div className="h-6 w-48 bg-gray-200 rounded mx-auto mb-4" />
          <div className="h-8 w-64 bg-gray-200 rounded mx-auto mb-8" />
          <div className="space-y-6 max-w-3xl mx-auto text-left">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="h-6 w-1/3 bg-gray-200 rounded" />
                <div className="h-4 w-full bg-gray-200 rounded" />
                <div className="h-4 w-5/6 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (hasError || !policyData) {
    return null;
  }

  const { title, sections } = policyData;

  return (
    <section aria-labelledby="referral-policy-heading" className="bg-white py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-[1100px] px-6 lg:px-12">
        <div className="text-center mb-12 sm:mb-16">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#2EAD45]">
            Referral Program
          </p>
          <h2 id="referral-policy-heading" className="text-3xl font-semibold text-[#0F172A] md:text-4xl">
            {title}
          </h2>
        </div>

        <div className="space-y-10">
          {sections.map((section, index) => (
            <article key={index} className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
              <h3 className="flex items-center gap-3 text-xl font-semibold text-[#0F172A]">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#DCFCE7] text-[#2EAD45]">
                  <FileText size={20} aria-hidden="true" />
                </span>
                {section.heading}
              </h3>
              <div className="mt-4 prose prose-sm text-gray-600 max-w-none">
                <p className="leading-7 whitespace-pre-line">{section.content}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Questions about our referral program?
          </p>
          <a
            href="/#contact"
            className="mt-3 inline-flex items-center gap-2 rounded-xl border border-[#2EAD45] bg-white px-6 py-2.5 text-sm font-semibold text-[#1E8A32] transition-colors hover:bg-[#2EAD45] hover:text-white"
          >
            Contact Us
            <ArrowRight size={16} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}