import type { Metadata } from "next";
import Link from "next/link";

import {
  BadgeCheck,
  BarChart3,
  Cookie,
  CreditCard,
  Megaphone,
  Puzzle,
  RefreshCw,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  type LucideIcon,
} from "lucide-react";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "Cookie Policy | BookFarmVilla",
  description:
    "Learn how BookFarmVilla may use cookies and similar technologies, the types of cookies involved, and how you can manage your preferences.",
};

interface PolicyNavigationItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface CookieType {
  icon: LucideIcon;
  title: string;
  description: string;
  details?: string[];
  colorClassName: string;
}

const policyNavigation: PolicyNavigationItem[] = [
  {
    id: "what-are-cookies",
    label: "What Are Cookies?",
    icon: Cookie,
  },
  {
    id: "how-we-use-cookies",
    label: "How We Use Cookies",
    icon: Settings,
  },
  {
    id: "types-of-cookies",
    label: "Types of Cookies",
    icon: Puzzle,
  },
  {
    id: "third-party-cookies",
    label: "Third-Party Cookies",
    icon: ShieldCheck,
  },
  {
    id: "cookies-and-payments",
    label: "Cookies and Payments",
    icon: CreditCard,
  },
  {
    id: "managing-cookies",
    label: "Managing Cookies",
    icon: SlidersHorizontal,
  },
  {
    id: "cookie-consent",
    label: "Cookie Consent",
    icon: BadgeCheck,
  },
  {
    id: "policy-changes",
    label: "Changes to This Policy",
    icon: RefreshCw,
  },
];

const cookieUses = [
  "Keep the website functioning properly",
  "Remember necessary website preferences",
  "Improve website performance",
  "Understand how visitors use the website",
  "Analyse website traffic and usage patterns",
  "Improve our services and user experience",
  "Detect and prevent security issues",
  "Support enquiry and booking-related functionality",
  "Support relevant marketing and communication activities, where applicable",
];

const cookieTypes: CookieType[] = [
  {
    icon: ShieldCheck,
    title: "Essential Cookies",
    description:
      "These cookies may be necessary for essential website functionality, security, enquiry forms, payment processing, and other technical functions required for the website to operate properly.",
    colorClassName: "bg-green-50 text-[#1E8A32]",
  },
  {
    icon: Settings,
    title: "Functional Cookies",
    description:
      "These cookies may help remember certain website preferences and settings to provide a smoother browsing experience.",
    colorClassName: "bg-blue-50 text-blue-600",
  },
  {
    icon: BarChart3,
    title: "Analytics Cookies",
    description:
      "These cookies may help us understand how visitors interact with BookFarmVilla, including:",
    details: [
      "Pages visited",
      "Time spent on the website",
      "General website usage",
      "Browser and device information",
      "Traffic sources",
    ],
    colorClassName: "bg-purple-50 text-purple-600",
  },
  {
    icon: Megaphone,
    title: "Marketing Cookies",
    description:
      "Where applicable, BookFarmVilla may use marketing or advertising technologies to understand interactions with our website and provide more relevant communications or advertising.",
    details: [
      "Such technologies may be provided by third-party service providers.",
    ],
    colorClassName: "bg-amber-50 text-amber-600",
  },
];

const browserCookieControls = [
  "View stored cookies",
  "Delete existing cookies",
  "Block certain cookies",
  "Block all cookies",
  "Receive notifications when cookies are being used",
];

export default function CookiePolicyPage() {
  return (
    <>
      <Header />

      <main>
        {/* Hero */}
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
              <div className="text-sm">
                <Link
                  href="/"
                  className="font-medium text-green-300 transition-colors hover:text-white"
                >
                  Home
                </Link>
                <span className="mx-2 text-white/30">/</span>
                <span className="text-white/60">Cookie Policy</span>
              </div>

              <div className="mt-8 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/10 backdrop-blur-sm">
                <Cookie
                  size={28}
                  className="text-[#4CAF50]"
                  aria-hidden="true"
                />
              </div>

              <h1 className="mt-6 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                Cookie Policy
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-8 text-white/70 md:text-lg">
                This Cookie Policy explains what cookies are, how
                BookFarmVilla may use them, and how you can manage your cookie
                preferences.
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
                <div className="mb-4 flex items-center gap-2">
                  <Cookie
                    size={18}
                    className="text-[#2EAD45]"
                    aria-hidden="true"
                  />
                  <p className="text-sm font-semibold text-[#0F172A]">
                    On this page
                  </p>
                </div>

                <nav aria-label="Cookie Policy sections">
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

            {/* Main document */}
            <article className="min-w-0 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8 md:p-12">
              <div className="space-y-5 text-base leading-8 text-[#64748B]">
                <p>
                  BookFarmVilla (&quot;BookFarmVilla&quot;, &quot;we&quot;,
                  &quot;us&quot;, or &quot;our&quot;) uses cookies and similar
                  technologies on its website to provide a better, secure, and
                  efficient browsing experience.
                </p>

                <p>
                  This Cookie Policy explains what cookies are, how
                  BookFarmVilla may use them, and how you can manage your cookie
                  preferences.
                </p>
              </div>

              <div className="my-10 h-px bg-gray-100" />

              {/* 1. What Are Cookies? */}
              <section
                id="what-are-cookies"
                className="scroll-mt-28"
                aria-labelledby="what-are-cookies-heading"
              >
                <h2
                  id="what-are-cookies-heading"
                  className="text-2xl font-semibold text-[#0F172A] md:text-3xl"
                >
                  1. What Are Cookies?
                </h2>

                <p className="mt-5 leading-8 text-[#64748B]">
                  Cookies are small text files stored on your device when you
                  visit a website. They help websites remember certain
                  information, understand how visitors interact with the
                  website, and improve website functionality.
                </p>

                <div className="mt-6 rounded-2xl border border-green-100 bg-[#DCFCE7]/50 p-5">
                  <p className="font-semibold leading-7 text-[#166534]">
                    BookFarmVilla does not currently require users to create an
                    account or register on the website to browse venues or
                    submit enquiries.
                  </p>
                </div>
              </section>

              <div className="my-10 h-px bg-gray-100" />

              {/* 2. How We Use Cookies */}
              <section
                id="how-we-use-cookies"
                className="scroll-mt-28"
                aria-labelledby="how-we-use-cookies-heading"
              >
                <h2
                  id="how-we-use-cookies-heading"
                  className="text-2xl font-semibold text-[#0F172A] md:text-3xl"
                >
                  2. How We Use Cookies
                </h2>

                <p className="mt-5 leading-8 text-[#64748B]">
                  BookFarmVilla may use cookies and similar technologies to:
                </p>

                <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {cookieUses.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 rounded-xl bg-[#F8FAFC] px-4 py-3 text-sm leading-6 text-[#64748B]"
                    >
                      <span className="mt-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#DCFCE7] text-xs font-bold text-[#1E8A32]">
                        ✓
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              <div className="my-10 h-px bg-gray-100" />

              {/* 3. Types of Cookies */}
              <section
                id="types-of-cookies"
                className="scroll-mt-28"
                aria-labelledby="types-of-cookies-heading"
              >
                <h2
                  id="types-of-cookies-heading"
                  className="text-2xl font-semibold text-[#0F172A] md:text-3xl"
                >
                  3. Types of Cookies We May Use
                </h2>

                <div className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-2">
                  {cookieTypes.map((cookieType) => {
                    const Icon = cookieType.icon;

                    return (
                      <article
                        key={cookieType.title}
                        className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
                      >
                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-xl ${cookieType.colorClassName}`}
                        >
                          <Icon size={21} aria-hidden="true" />
                        </div>

                        <h3 className="mt-5 text-lg font-semibold text-[#0F172A]">
                          {cookieType.title}
                        </h3>

                        <p className="mt-3 text-sm leading-7 text-[#64748B]">
                          {cookieType.description}
                        </p>

                        {cookieType.details && (
                          <ul className="mt-4 space-y-2">
                            {cookieType.details.map((detail) => (
                              <li
                                key={detail}
                                className="flex items-start gap-2 text-sm leading-6 text-[#64748B]"
                              >
                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2EAD45]" />
                                {detail}
                              </li>
                            ))}
                          </ul>
                        )}
                      </article>
                    );
                  })}
                </div>

                <p className="mt-6 leading-8 text-[#64748B]">
                  This information helps us understand website performance and
                  improve the user experience.
                </p>
              </section>

              <div className="my-10 h-px bg-gray-100" />

              {/* 4. Third-Party Cookies */}
              <section
                id="third-party-cookies"
                className="scroll-mt-28"
                aria-labelledby="third-party-cookies-heading"
              >
                <h2
                  id="third-party-cookies-heading"
                  className="text-2xl font-semibold text-[#0F172A] md:text-3xl"
                >
                  4. Third-Party Cookies
                </h2>

                <div className="mt-5 space-y-4 leading-8 text-[#64748B]">
                  <p>
                    Some cookies may be placed by third-party services used by
                    BookFarmVilla, including analytics, payment, security,
                    advertising, or other technology providers.
                  </p>

                  <p>
                    These third parties may process information in accordance
                    with their own privacy policies and terms.
                  </p>

                  <p>
                    BookFarmVilla does not control the cookie practices of
                    third-party websites or services.
                  </p>
                </div>
              </section>

              <div className="my-10 h-px bg-gray-100" />

              {/* 5. Cookies and Payments */}
              <section
                id="cookies-and-payments"
                className="scroll-mt-28"
                aria-labelledby="cookies-and-payments-heading"
              >
                <h2
                  id="cookies-and-payments-heading"
                  className="text-2xl font-semibold text-[#0F172A] md:text-3xl"
                >
                  5. Cookies and Payments
                </h2>

                <div className="mt-5 space-y-4 leading-8 text-[#64748B]">
                  <p>
                    When a customer makes an advance payment through
                    BookFarmVilla, cookies or similar technologies may be used
                    by BookFarmVilla or its payment service provider to
                    maintain the payment process, support transaction security,
                    and help process the payment.
                  </p>

                  <p>
                    Payment-related information is handled in accordance with
                    our{" "}
                    <Link
                      href="/privacy-policy"
                      className="font-semibold text-[#1E8A32] underline decoration-green-200 underline-offset-4 transition-colors hover:text-[#2EAD45]"
                    >
                      Privacy Policy
                    </Link>{" "}
                    and applicable payment service provider terms.
                  </p>
                </div>
              </section>

              <div className="my-10 h-px bg-gray-100" />

              {/* 6. Managing Cookies */}
              <section
                id="managing-cookies"
                className="scroll-mt-28"
                aria-labelledby="managing-cookies-heading"
              >
                <h2
                  id="managing-cookies-heading"
                  className="text-2xl font-semibold text-[#0F172A] md:text-3xl"
                >
                  6. Managing Cookies
                </h2>

                <p className="mt-5 leading-8 text-[#64748B]">
                  You can manage or disable cookies through your browser
                  settings.
                </p>

                <p className="mt-4 leading-8 text-[#64748B]">
                  Most browsers allow you to:
                </p>

                <ul className="mt-5 space-y-3">
                  {browserCookieControls.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-[#64748B]"
                    >
                      <span className="mt-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#DCFCE7] text-xs font-bold text-[#1E8A32]">
                        ✓
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>

                <p className="mt-5 leading-8 text-[#64748B]">
                  Please note that disabling certain cookies may affect the
                  functionality of some features of BookFarmVilla.
                </p>
              </section>

              <div className="my-10 h-px bg-gray-100" />

              {/* 7. Cookie Consent */}
              <section
                id="cookie-consent"
                className="scroll-mt-28"
                aria-labelledby="cookie-consent-heading"
              >
                <h2
                  id="cookie-consent-heading"
                  className="text-2xl font-semibold text-[#0F172A] md:text-3xl"
                >
                  7. Cookie Consent
                </h2>

                <div className="mt-5 space-y-4 leading-8 text-[#64748B]">
                  <p>
                    Where required by applicable law, BookFarmVilla may request
                    your consent before using non-essential cookies.
                  </p>

                  <p>
                    Where cookie preference controls are provided, you may
                    change or withdraw your preferences through those controls.
                  </p>
                </div>
              </section>

              <div className="my-10 h-px bg-gray-100" />

              {/* 8. Changes */}
              <section
                id="policy-changes"
                className="scroll-mt-28"
                aria-labelledby="policy-changes-heading"
              >
                <h2
                  id="policy-changes-heading"
                  className="text-2xl font-semibold text-[#0F172A] md:text-3xl"
                >
                  8. Changes to This Cookie Policy
                </h2>

                <div className="mt-5 space-y-4 leading-8 text-[#64748B]">
                  <p>
                    BookFarmVilla may update this Cookie Policy from time to
                    time to reflect changes in our website, technology,
                    services, or applicable legal requirements.
                  </p>

                  <p>
                    Any updated version will be published on this page with a
                    revised &quot;Last Updated&quot; date.
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
