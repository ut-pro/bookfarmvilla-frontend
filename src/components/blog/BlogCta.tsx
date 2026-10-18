"use client";

import Link from "next/link";

import { useCallbackModal } from "@/components/callback/CallbackContext";

export default function BlogCta() {
  const { openGeneralCallback } = useCallbackModal();

  return (
    <section
      className="rounded-3xl bg-[#EAF8ED] px-5 py-10 text-center sm:px-8 sm:py-12 lg:px-12"
      aria-labelledby="blog-cta-heading"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1E8A32]">
        Plan Your Celebration
      </p>

      <h2
        id="blog-cta-heading"
        className="mx-auto mt-3 max-w-2xl text-2xl font-bold leading-tight text-[#0F172A] sm:text-3xl"
      >
        Looking for the perfect venue for your next event?
      </h2>

      <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">
        Explore handpicked farmhouses, villas and wedding
        lawns across Delhi NCR, or speak with the
        BookFarmVilla team for assistance.
      </p>

      <div className="mt-7 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
        <Link
          href="/properties"
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#2EAD45] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1E8A32] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2EAD45] focus-visible:ring-offset-2"
        >
          Browse Properties
        </Link>

        <button
          type="button"
          onClick={openGeneralCallback}
          className="inline-flex min-h-12 items-center justify-center rounded-full border-2 border-[#2EAD45] bg-white px-6 py-3 text-sm font-semibold text-[#1E8A32] transition-colors hover:bg-[#2EAD45] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2EAD45] focus-visible:ring-offset-2"
        >
          Talk to Our Team
        </button>
      </div>
    </section>
  );
}