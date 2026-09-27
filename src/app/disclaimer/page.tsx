import type { Metadata } from "next";
import Link from "next/link";

import {
  AlertTriangle,
  FileWarning,
  Info,
  Scale,
  ShieldCheck,
} from "lucide-react";

import { CallbackProvider } from "@/components/callback/CallbackContext";
import CallbackModal from "@/components/callback/CallbackModal";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "Platform Disclaimer | BookFarmVilla",
  description:
    "Read the BookFarmVilla Platform Disclaimer covering listings, availability, pricing, bookings, Partners, and third-party services.",
};

interface DisclaimerSection {
  number: number;
  title: string;
  paragraphs: string[];
  list?: string[];
  contentBreak?: number;
}

const disclaimerSections: DisclaimerSection[] = [
  {
    number: 1,
    title: "Our Role",
    paragraphs: [
      "BookFarmVilla acts as a platform and booking facilitator connecting customers with participating venue owners and service providers.",
      "BookFarmVilla does not own or operate every venue or directly provide every service listed on the platform. The actual venue or service is provided by the respective Partner.",
    ],
  },
  {
    number: 2,
    title: "Information on the Platform",
    paragraphs: [
      "Information displayed on BookFarmVilla may include:",
      "We make reasonable efforts to keep the information on our platform accurate and updated. However, information provided by Partners may change from time to time.",
      "Customers should confirm important booking details before making a payment.",
    ],
    list: [
      "Venue and service details",
      "Images and videos",
      "Location and address",
      "Capacity",
      "Amenities and facilities",
      "Pricing or price ranges",
      "Available services",
      "Availability information",
    ],
  },
  {
    number: 3,
    title: "Availability",
    paragraphs: [
      "Availability displayed on BookFarmVilla is provided for enquiry and booking purposes and may change based on bookings made through other channels or updates from Partners.",
      "Displaying a venue or service as available does not by itself guarantee availability.",
      "A booking is considered confirmed only after the relevant Partner confirms the booking and the required booking payment is successfully completed.",
    ],
  },
  {
    number: 4,
    title: "Pricing",
    paragraphs: [
      "Prices displayed on BookFarmVilla may be indicative, starting prices or price ranges.",
      "The final booking amount may vary depending on:",
      "The applicable final price will be communicated before the booking is confirmed.",
    ],
    contentBreak: 2,
    list: [
      "Event date",
      "Number of guests",
      "Duration",
      "Selected services",
      "Catering",
      "Decorations",
      "Additional facilities",
      "Taxes or other applicable charges",
      "Specific customer requirements",
    ],
  },
  {
    number: 5,
    title: "Advance Payment & Booking",
    paragraphs: [
      "BookFarmVilla may facilitate and collect an advance payment from customers for eligible bookings.",
      "The applicable advance amount, total booking value, remaining balance and other payment terms will be communicated to the customer before the booking is confirmed.",
      "Where applicable, the remaining balance may be payable directly to the respective venue or service Partner according to the agreed booking terms.",
      "Customers should review the applicable cancellation and refund policy before making any advance payment.",
    ],
  },
  {
    number: 6,
    title: "Cancellation & Refunds",
    paragraphs: [
      "Cancellation and refund conditions may vary depending on the booking and applicable Partner terms.",
      "The applicable cancellation and refund policy will be communicated to the customer before the booking is confirmed.",
      "Where BookFarmVilla has collected an advance payment, any eligible refund will be processed according to the applicable cancellation and refund policy.",
      "Any amount paid directly to a Partner will be subject to the terms agreed between the customer and the Partner.",
    ],
  },
  {
    number: 7,
    title: "Partner Responsibility",
    paragraphs: [
      "Partners are independently responsible for their venues and services.",
      "Partners are responsible for:",
    ],
    contentBreak: 2,
    list: [
      "Providing accurate information",
      "Maintaining availability information",
      "Providing the agreed venue or services",
      "Honouring confirmed bookings",
      "Communicating applicable rules and charges",
      "Delivering the services agreed with the customer",
    ],
  },
  {
    number: 8,
    title: "Customer Responsibility",
    paragraphs: [
      "Customers are responsible for reviewing and confirming important booking details before making payment, including:",
    ],
    list: [
      "Event date and timing",
      "Venue capacity",
      "Amenities",
      "Services included",
      "Total booking amount",
      "Advance amount",
      "Remaining balance",
      "Cancellation and refund terms",
      "Additional charges, if applicable",
      "Venue-specific rules",
    ],
  },
  {
    number: 9,
    title: "Images & Descriptions",
    paragraphs: [
      "Images, videos and descriptions displayed on BookFarmVilla may be provided by Partners or other authorised sources.",
      "The actual appearance, decoration, facilities or services may vary depending on the event, booking package and other circumstances.",
      "Customers may request clarification regarding any specific feature before confirming a booking.",
    ],
  },
  {
    number: 10,
    title: "Third-Party Services",
    paragraphs: [
      "BookFarmVilla may use third-party services such as payment gateways, hosting providers, analytics services, communication tools and other technology providers.",
      "The use of such services may be subject to their respective terms and policies.",
    ],
  },
  {
    number: 11,
    title: "Platform Availability",
    paragraphs: [
      "We aim to keep BookFarmVilla available and functional; however, we do not guarantee uninterrupted or completely error-free operation.",
      "Temporary interruptions may occur due to maintenance, technical issues, network problems, third-party services or circumstances beyond our reasonable control.",
    ],
  },
  {
    number: 12,
    title: "Limitation of Responsibility",
    paragraphs: [
      "BookFarmVilla facilitates venue and service discovery, enquiries, communication and applicable booking processes between customers and independent Partners.",
      "To the extent permitted by applicable law, BookFarmVilla is not responsible for matters arising solely from the independent acts, omissions, representations or services of a Partner.",
      "Nothing in this Disclaimer is intended to exclude or restrict any consumer rights or remedies that cannot legally be excluded or restricted.",
    ],
  },
  {
    number: 13,
    title: "Changes to Platform Information",
    paragraphs: [
      "BookFarmVilla may update, modify, suspend or remove listings, information, services or website features from time to time.",
      "We may also correct errors or inaccuracies when identified.",
    ],
  },
];

function DisclaimerList({ items }: { items: string[] }) {
  return (
    <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-start gap-3 rounded-xl bg-[#F8FAFC] px-4 py-3 text-sm leading-6 text-[#64748B]"
        >
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2EAD45]" />
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function PlatformDisclaimerPage() {
  return (
    <CallbackProvider>
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
            <div className="max-w-4xl">
              <div className="text-sm">
                <Link
                  href="/"
                  className="font-medium text-green-300 transition-colors hover:text-white"
                >
                  Home
                </Link>
                <span className="mx-2 text-white/30">/</span>
                <span className="text-white/60">Platform Disclaimer</span>
              </div>

              <div className="mt-8 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/10 backdrop-blur-sm">
                <FileWarning
                  size={28}
                  className="text-[#4CAF50]"
                  aria-hidden="true"
                />
              </div>

              <h1 className="mt-6 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                Platform Disclaimer
              </h1>

              <p className="mt-5 max-w-3xl text-base leading-8 text-white/70 md:text-lg">
                Important information about BookFarmVilla&apos;s role,
                listings, availability, pricing, bookings, Partners, and
                third-party services.
              </p>

              <div className="mt-7 inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-green-200 backdrop-blur-sm">
                Last Updated: September 27, 2026
              </div>
            </div>
          </div>
        </section>

        {/* Disclaimer document */}
        <section className="bg-[#F8FAFC] py-16 md:py-20">
          <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-10 px-6 lg:grid-cols-[300px_minmax(0,1fr)] lg:px-12">
            {/* Desktop contents */}
            <aside className="hidden lg:block">
              <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <Info
                    size={18}
                    className="text-[#2EAD45]"
                    aria-hidden="true"
                  />
                  <p className="text-sm font-semibold text-[#0F172A]">
                    On this page
                  </p>
                </div>

                <nav aria-label="Platform Disclaimer sections">
                  <ol className="space-y-1">
                    {disclaimerSections.map((section) => (
                      <li key={section.number}>
                        <a
                          href={`#section-${section.number}`}
                          className="flex items-start gap-2 rounded-lg px-3 py-2 text-xs leading-5 text-[#64748B] transition-colors hover:bg-[#DCFCE7] hover:text-[#1E8A32]"
                        >
                          <span className="font-semibold">
                            {section.number}.
                          </span>
                          {section.title}
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              </div>
            </aside>

            {/* Main content */}
            <article className="min-w-0 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8 md:p-12">
              <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5">
                <div className="flex items-start gap-3">
                  <AlertTriangle
                    size={22}
                    className="mt-1 shrink-0 text-amber-600"
                    aria-hidden="true"
                  />
                  <div className="space-y-3 leading-7 text-amber-900">
                    <p>
                      BookFarmVilla is an online platform that helps customers
                      discover and enquire about Farmhouses, Villas, Wedding
                      Lawns and event-related services, including Catering, DJs
                      & Entertainment, Photography and Decorations.
                    </p>
                    <p>
                      BookFarmVilla works with independent venue owners and
                      service providers to help customers find suitable options
                      for their events.
                    </p>
                  </div>
                </div>
              </div>

              {disclaimerSections.map((section) => {
                const contentBreak = section.contentBreak ?? 1;

                return (
                  <section
                    key={section.number}
                    id={`section-${section.number}`}
                    className="scroll-mt-28 border-b border-gray-100 py-10 first:pt-10 last:border-b-0 last:pb-0"
                    aria-labelledby={`section-${section.number}-heading`}
                  >
                    <div className="flex items-start gap-4">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#DCFCE7] text-sm font-bold text-[#1E8A32]">
                        {section.number}
                      </span>
                      <h2
                        id={`section-${section.number}-heading`}
                        className="pt-0.5 text-2xl font-semibold leading-tight text-[#0F172A] md:text-3xl"
                      >
                        {section.title}
                      </h2>
                    </div>

                    <div className="mt-5 space-y-4 leading-8 text-[#64748B]">
                      {section.paragraphs
                        .slice(0, contentBreak)
                        .map((paragraph) => (
                          <p key={paragraph}>{paragraph}</p>
                        ))}
                    </div>

                    {section.list && <DisclaimerList items={section.list} />}

                    {section.paragraphs.length > contentBreak && (
                      <div className="mt-5 space-y-4 leading-8 text-[#64748B]">
                        {section.paragraphs
                          .slice(contentBreak)
                          .map((paragraph) => (
                            <p key={paragraph}>{paragraph}</p>
                          ))}
                      </div>
                    )}
                  </section>
                );
              })}

              <div className="mt-10 rounded-2xl border border-green-100 bg-[#DCFCE7]/40 p-5">
                <div className="flex items-start gap-3">
                  <Scale
                    size={21}
                    className="mt-1 shrink-0 text-[#1E8A32]"
                    aria-hidden="true"
                  />
                  <p className="leading-7 text-[#166534]">
                    Nothing in this Disclaimer is intended to exclude or
                    restrict any consumer rights or remedies that cannot
                    legally be excluded or restricted.
                  </p>
                </div>
              </div>
            </article>
          </div>
        </section>
      </main>

      <Footer />
      <CallbackModal />
    </CallbackProvider>
  );
}
