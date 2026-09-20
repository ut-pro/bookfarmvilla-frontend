import { ArrowRight, CheckCircle2 } from "lucide-react";

const partnerBenefits = [
  "Reach More Guests",
  "Dedicated Onboarding",
  "Listing Assistance",
  "Expert Coordination",
];

const onboardingSteps = [
  {
    number: "01",
    label: "Share Your Details",
  },
  {
    number: "02",
    label: "Property Review",
  },
  {
    number: "03",
    label: "Listing Setup",
  },
  {
    number: "04",
    label: "Receive Enquiries",
  },
];

export default function PartnerSection() {
  return (
    <section
      id="partner"
      className="scroll-mt-20 bg-[#F8FAFC] py-20"
      aria-labelledby="partner-heading"
    >
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <div
          className="relative overflow-hidden rounded-3xl p-8 sm:p-10 md:p-16"
          style={{
            background:
              "linear-gradient(135deg, #1E8A32 0%, #2EAD45 50%, #4CAF50 100%)",
          }}
        >
          {/* Decorative background circles */}
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/10" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10" />
          <div className="absolute right-1/4 top-1/2 h-32 w-32 -translate-y-1/2 rounded-full bg-white/5" />

          {/* Section content */}
          <div className="relative flex flex-col items-center justify-between gap-12 lg:flex-row">
            {/* Left content */}
            <div className="flex-1 text-center lg:text-left">
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-green-200">
                Property Owners
              </p>

              <h2
                id="partner-heading"
                className="mb-6 font-bold leading-tight text-white"
                style={{
                  fontSize: "clamp(28px, 3vw, 42px)",
                }}
              >
                Showcase Your Property On
                <br className="hidden sm:block" />
                {" "}BookFarmVilla
              </h2>

              <p className="mb-8 max-w-xl text-base leading-relaxed text-green-100 md:text-lg">
                Own a farmhouse, villa or wedding venue? Connect with our
                team to discuss your property and start the listing review
                process.
              </p>

              {/* Partner benefits */}
              <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {partnerBenefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="flex items-center justify-center gap-2 lg:justify-start"
                  >
                    <CheckCircle2
                      size={18}
                      className="shrink-0 text-green-200"
                      aria-hidden="true"
                    />

                    <span className="text-sm font-medium text-white">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>

              {/* Future partner enquiry CTA */}
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-bold text-[#2EAD45] shadow-xl shadow-green-900/20 transition-colors hover:bg-green-50"
              >
                Talk to Our Team

                <ArrowRight size={18} aria-hidden="true" />
              </a>
            </div>

            {/* Onboarding process */}
            <div className="grid w-full shrink-0 grid-cols-2 gap-3 sm:gap-4 lg:w-auto">
              {onboardingSteps.map((step) => (
                <article
                  key={step.number}
                  className="rounded-2xl border border-white/20 bg-white/20 p-4 text-center backdrop-blur-sm sm:p-5 lg:w-44"
                >
                  <p className="text-2xl font-bold text-white">
                    {step.number}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-green-100">
                    {step.label}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}