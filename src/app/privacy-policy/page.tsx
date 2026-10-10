import type { Metadata } from "next";
import Link from "next/link";

import {
  Cookie,
  Database,
  ExternalLink,
  LockKeyhole,
  RefreshCw,
  Settings,
  Share2,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "Privacy Policy | BookFarmVilla",
  description:
    "Read the BookFarmVilla Privacy Policy to understand how information is collected, used, stored, shared, and protected.",
  alternates: {
    canonical: "/privacy-policy",
  },
};

interface PolicyNavigationItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

const policyNavigation: PolicyNavigationItem[] = [
  {
    id: "information-we-collect",
    label: "Information We Collect",
    icon: Database,
  },
  {
    id: "how-we-use-information",
    label: "How We Use Information",
    icon: Settings,
  },
  {
    id: "sharing-of-information",
    label: "Sharing of Information",
    icon: Share2,
  },
  {
    id: "cookies",
    label: "Cookies and Technologies",
    icon: Cookie,
  },
  {
    id: "data-security",
    label: "Data Security",
    icon: LockKeyhole,
  },
  {
    id: "third-party-websites",
    label: "Third-Party Websites",
    icon: ExternalLink,
  },
  {
    id: "policy-changes",
    label: "Changes to This Policy",
    icon: RefreshCw,
  },
];

const userProvidedInformation = [
  "Name",
  "Email address",
  "Mobile number",
  "City or location",
  "Event date",
  "Number of guests",
  "Venue or service requirements",
  "Enquiry details",
  "Booking-related information",
  "Any other information voluntarily provided by you",
];

const informationUses = [
  "Respond to your enquiries and requests",
  "Help you discover suitable venues and event services",
  "Connect you with relevant venue partners and service providers",
  "Process booking-related requests",
  "Provide customer support",
  "Improve our website and services",
  "Communicate important service-related information",
  "Prevent fraud, misuse, and unauthorized activities",
  "Comply with applicable laws and regulations",
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />

      <main>
        {/* Page hero */}
        <section className="relative overflow-hidden bg-[#0F172A] pb-20 pt-36 text-white">
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "36px 36px",
            }}
          />
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#2EAD45]/15 blur-3xl" />
          <div className="absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-[#4CAF50]/10 blur-3xl" />

          <div className="relative mx-auto max-w-[1440px] px-6 lg:px-12">
            <div className="max-w-3xl">
              <Link
                href="/"
                className="text-sm font-medium text-green-300 transition-colors hover:text-white"
              >
                Home
              </Link>
              <span className="mx-2 text-white/30">/</span>
              <span className="text-sm text-white/60">Privacy Policy</span>

              <div className="mt-8 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/10 backdrop-blur-sm">
                <ShieldCheck
                  size={28}
                  className="text-[#4CAF50]"
                  aria-hidden="true"
                />
              </div>

              <h1 className="mt-6 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                Privacy Policy
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-8 text-white/70 md:text-lg">
                This Privacy Policy explains how information is collected,
                used, stored, and disclosed when you use BookFarmVilla.
              </p>

              <div className="mt-7 inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-green-200 backdrop-blur-sm">
                Last Updated: September 27, 2026
              </div>
            </div>
          </div>
        </section>

        {/* Policy content */}
        <section className="bg-[#F8FAFC] py-16 md:py-20">
          <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-10 px-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-12">
            {/* Desktop table of contents */}
            <aside className="hidden lg:block">
              <div className="sticky top-28 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <p className="mb-4 text-sm font-semibold text-[#0F172A]">
                  On this page
                </p>

                <nav aria-label="Privacy Policy sections">
                  <ul className="space-y-1">
                    {policyNavigation.map((item) => {
                      const Icon = item.icon;

                      return (
                        <li key={item.id}>
                          <a
                            href={`#${item.id}`}
                            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#64748B] transition-colors hover:bg-[#DCFCE7] hover:text-[#1E8A32]"
                          >
                            <Icon
                              size={16}
                              className="shrink-0"
                              aria-hidden="true"
                            />
                            {item.label}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              </div>
            </aside>

            {/* Main legal document */}
            <article className="min-w-0 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8 md:p-12">
              <div className="space-y-5 text-base leading-8 text-[#64748B]">
                <p>
                  BookFarmVilla respects the privacy of its users and is
                  committed to protecting the personal information shared with
                  us. This Privacy Policy explains how information is
                  collected, used, stored, and disclosed when you use the
                  BookFarmVilla website, platform, and related services.
                </p>

                <p>
                  By accessing or using BookFarmVilla, you consent to the
                  collection and use of information in accordance with this
                  Privacy Policy.
                </p>
              </div>

              <div className="my-10 h-px bg-gray-100" />

              {/* Information We Collect */}
              <section
                id="information-we-collect"
                className="scroll-mt-28"
                aria-labelledby="information-we-collect-heading"
              >
                <h2
                  id="information-we-collect-heading"
                  className="text-2xl font-semibold text-[#0F172A] md:text-3xl"
                >
                  Information We Collect
                </h2>

                <p className="mt-5 leading-8 text-[#64748B]">
                  The information collected by BookFarmVilla may include:
                </p>

                <h3 className="mt-8 text-lg font-semibold text-[#0F172A]">
                  a) Information provided by users
                </h3>

                <p className="mt-4 leading-8 text-[#64748B]">
                  When you submit an enquiry, contact us, request a callback,
                  interact with a venue or service provider, or use other
                  features of our platform, we may collect information such as:
                </p>

                <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {userProvidedInformation.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 rounded-xl bg-[#F8FAFC] px-4 py-3 text-sm text-[#64748B]"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2EAD45]" />
                      {item}
                    </li>
                  ))}
                </ul>

                <h3 className="mt-10 text-lg font-semibold text-[#0F172A]">
                  b) Information collected automatically
                </h3>

                <p className="mt-4 leading-8 text-[#64748B]">
                  When you visit our website, our systems may automatically
                  collect certain technical information, which may include your
                  IP address, browser type, device information, operating
                  system, pages visited, and general website usage information.
                </p>

                <p className="mt-4 leading-8 text-[#64748B]">
                  This information may be used to improve website
                  functionality, understand user behaviour, maintain security,
                  and improve our services.
                </p>
              </section>

              <div className="my-10 h-px bg-gray-100" />

              {/* How We Use Information */}
              <section
                id="how-we-use-information"
                className="scroll-mt-28"
                aria-labelledby="how-we-use-information-heading"
              >
                <h2
                  id="how-we-use-information-heading"
                  className="text-2xl font-semibold text-[#0F172A] md:text-3xl"
                >
                  How We Use Your Information
                </h2>

                <p className="mt-5 leading-8 text-[#64748B]">
                  The information collected by BookFarmVilla may be used to:
                </p>

                <ul className="mt-5 space-y-3">
                  {informationUses.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-[#64748B]"
                    >
                      <span className="mt-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#DCFCE7] text-xs font-bold text-[#1E8A32]">
                        ✓
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <div className="my-10 h-px bg-gray-100" />

              {/* Sharing of Information */}
              <section
                id="sharing-of-information"
                className="scroll-mt-28"
                aria-labelledby="sharing-of-information-heading"
              >
                <h2
                  id="sharing-of-information-heading"
                  className="text-2xl font-semibold text-[#0F172A] md:text-3xl"
                >
                  Sharing of Information
                </h2>

                <div className="mt-5 rounded-2xl border border-green-100 bg-[#DCFCE7]/50 p-5">
                  <p className="font-semibold text-[#166534]">
                    BookFarmVilla does not sell your personal information.
                  </p>
                </div>

                <div className="mt-5 space-y-4 leading-8 text-[#64748B]">
                  <p>
                    We may share information with relevant venue owners,
                    operators, photographers, DJs, caterers, decorators,
                    technology providers, payment providers, or other service
                    partners when reasonably necessary to provide the services
                    or respond to your enquiry.
                  </p>

                  <p>
                    We may also disclose information where required or
                    permitted by applicable law, including when requested by a
                    court, government authority, or law-enforcement agency.
                  </p>

                  <p>
                    Where information is shared with service providers working
                    on our behalf, we take reasonable steps to ensure that such
                    information is handled appropriately and securely.
                  </p>
                </div>
              </section>

              <div className="my-10 h-px bg-gray-100" />

              {/* Cookies */}
              <section
                id="cookies"
                className="scroll-mt-28"
                aria-labelledby="cookies-heading"
              >
                <h2
                  id="cookies-heading"
                  className="text-2xl font-semibold text-[#0F172A] md:text-3xl"
                >
                  Cookies and Similar Technologies
                </h2>

                <div className="mt-5 space-y-4 leading-8 text-[#64748B]">
                  <p>
                    BookFarmVilla may use cookies and similar technologies to
                    improve website functionality, understand website traffic,
                    remember preferences, and improve user experience.
                  </p>

                  <p>
                    Third-party services used on our website may also use
                    cookies or similar technologies according to their
                    respective policies.
                  </p>
                </div>
              </section>

              <div className="my-10 h-px bg-gray-100" />

              {/* Data Security */}
              <section
                id="data-security"
                className="scroll-mt-28"
                aria-labelledby="data-security-heading"
              >
                <h2
                  id="data-security-heading"
                  className="text-2xl font-semibold text-[#0F172A] md:text-3xl"
                >
                  Data Security
                </h2>

                <div className="mt-5 space-y-4 leading-8 text-[#64748B]">
                  <p>
                    We take reasonable measures to protect the information
                    collected through our platform against unauthorized access,
                    misuse, alteration, disclosure, or loss.
                  </p>

                  <p>
                    However, no method of transmission over the Internet or
                    electronic storage can be guaranteed to be completely
                    secure. Therefore, we cannot guarantee absolute security of
                    information transmitted to or through our website.
                  </p>
                </div>
              </section>

              <div className="my-10 h-px bg-gray-100" />

              {/* Third-Party Websites */}
              <section
                id="third-party-websites"
                className="scroll-mt-28"
                aria-labelledby="third-party-websites-heading"
              >
                <h2
                  id="third-party-websites-heading"
                  className="text-2xl font-semibold text-[#0F172A] md:text-3xl"
                >
                  Third-Party Websites
                </h2>

                <div className="mt-5 space-y-4 leading-8 text-[#64748B]">
                  <p>
                    BookFarmVilla may contain links to third-party websites,
                    platforms, or services. We are not responsible for the
                    privacy practices or content of independent third parties.
                  </p>

                  <p>
                    Users are encouraged to review the privacy policies of
                    third-party websites before providing them with personal
                    information.
                  </p>
                </div>
              </section>

              <div className="my-10 h-px bg-gray-100" />

              {/* Changes to policy */}
              <section
                id="policy-changes"
                className="scroll-mt-28"
                aria-labelledby="policy-changes-heading"
              >
                <h2
                  id="policy-changes-heading"
                  className="text-2xl font-semibold text-[#0F172A] md:text-3xl"
                >
                  Changes to This Privacy Policy
                </h2>

                <div className="mt-5 space-y-4 leading-8 text-[#64748B]">
                  <p>
                    BookFarmVilla may update this Privacy Policy from time to
                    time to reflect changes in our services, technology,
                    business practices, or applicable legal requirements.
                  </p>

                  <p>
                    Any changes will be published on this page with the updated
                    Last Updated date.
                  </p>
                </div>
              </section>
            </article>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
