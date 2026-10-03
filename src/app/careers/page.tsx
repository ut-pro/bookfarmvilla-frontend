import type { Metadata } from "next";
import Link from "next/link";

import {
  ArrowRight,
  Award,
  Briefcase,
  CheckCircle2,
  Handshake,
  Laptop,
  Lightbulb,
  Rocket,
  Settings,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "Careers at BookFarmVilla | Build, Learn & Grow With Us",
  description:
    "Explore remote unpaid internship and volunteer opportunities with BookFarmVilla in partner acquisition, lead generation, business development, and operations.",
};

interface Opportunity {
  icon: LucideIcon;
  title: string;
  description: string;
  colorClassName: string;
}

const opportunities: Opportunity[] = [
  {
    icon: Handshake,
    title: "Venue & Partner Acquisition",
    description:
      "Contacting Farmhouses and Villas, introducing BookFarmVilla, helping interested venues get listed and assisting with the onboarding process.",
    colorClassName: "bg-green-50 text-[#1E8A32]",
  },
  {
    icon: Users,
    title: "Customer Lead Generation",
    description:
      "Researching potential customers who are planning parties or events, connecting with them and introducing them to BookFarmVilla.",
    colorClassName: "bg-blue-50 text-blue-600",
  },
  {
    icon: Settings,
    title: "Business Development & Operations",
    description:
      "Supporting day-to-day business activities, partner communication and other growth-related work.",
    colorClassName: "bg-purple-50 text-purple-600",
  },
];

const learningPoints = [
  "How an early-stage startup works",
  "Business development and lead generation",
  "Customer and partner communication",
  "Creative and innovative problem-solving",
  "Decision-making and ownership",
  "How to take an idea and contribute towards building a business",
];

const idealCandidateTraits = [
  "Self-motivated",
  "Willing to learn",
  "Good at communication",
  "Responsible and consistent",
  "Creative and curious",
  "Comfortable working independently",
  "Interested in startups and business",
  "Willing to take initiative",
];

export default function CareersPage() {
  return (
    <>
      <Header />

      <main>
        {/* Hero */}
        <section className="relative flex min-h-[72vh] items-center overflow-hidden bg-[#0F172A] pb-20 pt-36 text-white">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1600&h=1000&fit=crop&auto=format')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A] via-[#0F172A]/95 to-[#0F172A]/70" />
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "36px 36px",
            }}
          />
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#2EAD45]/20 blur-3xl" />

          <div className="relative mx-auto w-full max-w-[1440px] px-6 lg:px-12">
            <div className="max-w-4xl">
              <div className="text-sm">
                <Link
                  href="/"
                  className="font-medium text-green-300 transition-colors hover:text-white"
                >
                  Home
                </Link>
                <span className="mx-2 text-white/30">/</span>
                <span className="text-white/60">Careers</span>
              </div>

              <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-green-200 backdrop-blur-sm">
                <Rocket size={17} aria-hidden="true" />
                Join Our Startup Journey
              </div>

              <h1 className="mt-6 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                Careers at BookFarmVilla
              </h1>

              <h2 className="mt-4 text-2xl font-semibold text-[#4CAF50] sm:text-3xl">
                Build, Learn & Grow With Us
              </h2>

              <div className="mt-6 max-w-3xl space-y-4 text-base leading-8 text-white/75 md:text-lg">
                <p>
                  BookFarmVilla is an early-stage startup building a platform
                  that helps customers discover Farmhouses, Villas, Wedding
                  Lawns and event services.
                </p>
                <p>
                  We are looking for motivated people who want to gain
                  practical experience, take responsibility and be part of our
                  startup journey.
                </p>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#opportunities"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2EAD45] px-7 py-3.5 font-semibold text-white transition-colors hover:bg-[#1E8A32]"
                >
                  View Opportunities
                  <ArrowRight size={18} aria-hidden="true" />
                </a>
                <Link
                  href="/#contact"
                  className="rounded-xl border border-white/40 bg-white/10 px-7 py-3.5 text-center font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-[#0F172A]"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Opportunities */}
        <section
          id="opportunities"
          className="scroll-mt-20 bg-white py-20"
          aria-labelledby="opportunities-heading"
        >
          <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
            <div className="mb-14 text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#2EAD45]">
                Opportunities With Us
              </p>
              <h2
                id="opportunities-heading"
                className="text-3xl font-semibold text-[#0F172A] md:text-4xl"
              >
                Learn by Working on Real Startup Challenges
              </h2>
              <p className="mx-auto mt-4 max-w-2xl leading-7 text-[#64748B]">
                Currently, we are open to unpaid internship and volunteer
                opportunities in areas such as:
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {opportunities.map((opportunity) => {
                const Icon = opportunity.icon;

                return (
                  <article
                    key={opportunity.title}
                    className="group rounded-3xl border border-gray-100 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div
                      className={`flex h-13 w-13 items-center justify-center rounded-2xl ${opportunity.colorClassName}`}
                    >
                      <Icon size={25} aria-hidden="true" />
                    </div>

                    <h3 className="mt-6 text-xl font-semibold text-[#0F172A]">
                      {opportunity.title}
                    </h3>

                    <p className="mt-4 text-sm leading-7 text-[#64748B]">
                      {opportunity.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* What You Can Expect */}
        <section className="bg-[#F8FAFC] py-20">
          <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-10 px-6 lg:grid-cols-2 lg:px-12">
            <div className="rounded-3xl bg-[#0F172A] p-8 text-white md:p-10">
              <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-[#2EAD45]/20">
                <Laptop
                  size={25}
                  className="text-[#4CAF50]"
                  aria-hidden="true"
                />
              </div>

              <p className="mt-8 text-sm font-semibold uppercase tracking-widest text-[#4CAF50]">
                What You Can Expect
              </p>

              <h2 className="mt-3 text-3xl font-semibold">
                A Fully Remote Opportunity
              </h2>

              <p className="mt-5 leading-8 text-gray-400">
                This is a fully remote opportunity where you will work using
                your own device.
              </p>

              <div className="mt-7 rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-start gap-3">
                  <Lightbulb
                    size={22}
                    className="mt-1 shrink-0 text-amber-400"
                    aria-hidden="true"
                  />
                  <p className="leading-7 text-gray-300">
                    You will work close to real business activities and learn
                    how ideas, communication and execution come together in an
                    early-stage startup.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-[#2EAD45]">
                Practical Learning
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-[#0F172A] md:text-4xl">
                What You Will Get an Opportunity to Learn
              </h2>

              <ul className="mt-7 space-y-4">
                {learningPoints.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white px-5 py-4 shadow-sm"
                  >
                    <CheckCircle2
                      size={20}
                      className="mt-0.5 shrink-0 text-[#2EAD45]"
                      aria-hidden="true"
                    />
                    <span className="leading-7 text-[#64748B]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mx-auto mt-10 max-w-[1440px] px-6 lg:px-12">
            <div className="rounded-2xl border border-green-100 bg-[#DCFCE7]/40 p-6 text-center">
              <p className="mx-auto max-w-4xl leading-8 text-[#166534]">
                We encourage people to think independently, bring new ideas
                and take ownership of their work. You will have the freedom to
                approach your work in your own way while keeping the team
                updated about your progress and results.
              </p>
            </div>
          </div>
        </section>

        {/* Compensation */}
        <section className="bg-white py-20">
          <div className="mx-auto max-w-[1100px] px-6 lg:px-12">
            <div className="rounded-3xl border border-amber-100 bg-amber-50 p-8 md:p-10">
              <div className="flex flex-col gap-6 md:flex-row md:items-start">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                  <Award size={27} aria-hidden="true" />
                </div>

                <div>
                  <p className="text-sm font-semibold uppercase tracking-widest text-amber-700">
                    Compensation & Recognition
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold text-[#0F172A]">
                    Important Opportunity Information
                  </h2>

                  <div className="mt-6 space-y-4 leading-8 text-[#64748B]">
                    <p>
                      These opportunities are currently unpaid, as
                      BookFarmVilla is an early-stage startup with limited
                      resources.
                    </p>
                    <p className="font-semibold text-[#0F172A]">
                      There is no fixed salary or stipend.
                    </p>
                    <p>
                      After successful completion of the internship,
                      participants may be considered for a performance-based
                      bonus of up to ₹8,000, depending on their contribution
                      and overall performance. Where a bonus is not applicable,
                      recognition such as gifts or a certificate may be
                      provided.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Future Opportunities */}
        <section className="bg-[#F8FAFC] py-20">
          <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-10 px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-12">
            <div className="flex min-h-[320px] items-center justify-center rounded-3xl bg-gradient-to-br from-[#1E8A32] via-[#2EAD45] to-[#4CAF50] p-8 text-center text-white">
              <div>
                <TrendingUp
                  size={52}
                  className="mx-auto text-green-100"
                  aria-hidden="true"
                />
                <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-green-100">
                  Future Opportunities
                </p>
                <h2 className="mt-3 text-3xl font-bold">
                  Grow as BookFarmVilla Grows
                </h2>
              </div>
            </div>

            <div className="space-y-5 leading-8 text-[#64748B]">
              <p>
                We are not currently offering these opportunities as full-time
                paid positions.
              </p>
              <p>
                However, individuals who demonstrate strong performance,
                commitment and the ability to contribute to the business may
                have opportunities to take on greater responsibilities or
                explore long-term roles with BookFarmVilla as the company
                grows.
              </p>
              <p>
                As the business develops, there may also be opportunities for
                individuals who wish to continue contributing with us in a
                larger role or as a potential business partner, subject to
                future business requirements and a separate agreement.
              </p>
            </div>
          </div>
        </section>

        {/* Who We Look For */}
        <section className="bg-white py-20">
          <div className="mx-auto max-w-[1200px] px-6 text-center lg:px-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#2EAD45]">
              Who We Look For
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-[#0F172A] md:text-4xl">
              Qualities We Value
            </h2>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {idealCandidateTraits.map((trait) => (
                <div
                  key={trait}
                  className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-[#F8FAFC] px-5 py-4 text-left"
                >
                  <CheckCircle2
                    size={19}
                    className="shrink-0 text-[#2EAD45]"
                    aria-hidden="true"
                  />
                  <span className="font-medium text-[#0F172A]">{trait}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-[#F8FAFC] py-20">
          <div className="mx-auto max-w-[1200px] px-6 lg:px-12">
            <div className="rounded-3xl bg-[#0F172A] px-6 py-14 text-center text-white md:px-12">
              <Briefcase
                size={38}
                className="mx-auto text-[#4CAF50]"
                aria-hidden="true"
              />

              <p className="mx-auto mt-6 max-w-4xl text-2xl font-semibold leading-relaxed md:text-3xl">
                At BookFarmVilla, we believe that you don&apos;t always need
                experience to create an impact — you need the willingness to
                learn, take ownership and contribute.
              </p>

              <Link
                href="/#contact"
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-[#2EAD45] px-8 py-4 font-semibold text-white transition-colors hover:bg-[#1E8A32]"
              >
                Contact Us About Opportunities
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
