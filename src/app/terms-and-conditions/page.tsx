import type { Metadata } from "next";
import Link from "next/link";

import { FileText, Scale, ShieldCheck } from "lucide-react";

import { CallbackProvider } from "@/components/callback/CallbackContext";
import CallbackModal from "@/components/callback/CallbackModal";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "Terms & Conditions | BookFarmVilla",
  description:
    "Read the Terms & Conditions governing access to and use of the BookFarmVilla platform and related services.",
};

interface CancellationRow {
  cancellationTime: string;
  refund: string;
}

interface TermsSection {
  number: number;
  title: string;
  paragraphs: string[];
  list?: string[];
  table?: CancellationRow[];
  contentBreak?: number;
}

const termsSections: TermsSection[] = [
  {
    number: 1,
    title: "About BookFarmVilla",
    paragraphs: [
      "BookFarmVilla is an online platform that helps customers discover and enquire about venues and event-related services, including:",
      'BookFarmVilla facilitates communication between customers and participating venue owners and service providers ("Partners").',
    ],
    list: [
      "Farmhouses",
      "Villas",
      "Wedding Lawns",
      "Catering Services",
      "DJs & Entertainment",
      "Photographers",
      "Decoration Services",
      "Other event-related services",
    ],
  },
  {
    number: 2,
    title: "How BookFarmVilla Works",
    paragraphs: [
      "Customers can browse venues and services available on the platform and submit an enquiry based on their requirements.",
      "Submitting an enquiry does not automatically confirm a booking.",
      "A booking is confirmed only after the relevant Partner confirms availability, the booking details are agreed upon, and the required advance payment is successfully made through BookFarmVilla.",
    ],
  },
  {
    number: 3,
    title: "Venue & Service Listings",
    paragraphs: [
      "Partners provide information about their venues or services, which may include:",
      "BookFarmVilla makes reasonable efforts to display relevant and updated information. However, prices, availability, facilities, images and other details may change.",
      "Customers should confirm the final booking details before making the advance payment.",
    ],
    list: [
      "Property/service name",
      "Location",
      "Images",
      "Capacity",
      "Amenities",
      "Price or price range",
      "Available services",
      "Event types",
      "Availability",
    ],
  },
  {
    number: 4,
    title: "Booking & Advance Payment",
    paragraphs: [
      "To confirm a booking, the customer is required to pay 20% of the total booking amount as an advance through BookFarmVilla, unless a different amount is specifically communicated for a particular booking.",
      "The remaining 80% of the booking amount is payable directly to the respective venue/property, according to the agreed booking terms.",
      "Before making the advance payment, the customer will be informed of the applicable:",
      "Once the required advance payment has been successfully received and the booking has been confirmed, the customer will receive appropriate booking confirmation/details.",
    ],
    contentBreak: 3,
    list: [
      "Total booking amount",
      "Advance amount",
      "Remaining balance",
      "Booking date",
      "Included services",
      "Additional charges, if any",
      "Cancellation and refund conditions",
    ],
  },
  {
    number: 5,
    title: "Remaining Payment",
    paragraphs: [
      "The remaining 80% balance is generally payable directly to the respective venue/property.",
      "The Partner may specify when the remaining amount is payable, such as:",
      "Any additional services or charges requested by the customer at the venue may also be payable directly to the Partner.",
      "BookFarmVilla does not collect the remaining balance unless otherwise specifically stated.",
    ],
    list: [
      "On the event date",
      "At check-in",
      "Before the event",
      "According to an agreed payment schedule",
    ],
  },
  {
    number: 6,
    title: "Cancellation by Customer",
    paragraphs: [
      "If a customer needs to cancel a confirmed booking, the following standard cancellation policy will apply unless a different policy was specifically communicated and accepted at the time of booking:",
      "The applicable cancellation policy will be communicated to the customer before the advance payment is made.",
    ],
    table: [
      {
        cancellationTime: "15 or more days before event date",
        refund: "100% refund",
      },
      {
        cancellationTime: "7–14 days before event date",
        refund: "50% refund",
      },
      {
        cancellationTime: "Less than 7 days before event date",
        refund: "No refund",
      },
      {
        cancellationTime: "No-show / failure to attend",
        refund: "No refund",
      },
    ],
  },
  {
    number: 7,
    title: "Refunds",
    paragraphs: [
      "Where a refund is applicable, BookFarmVilla will process the refundable advance amount to the original payment method.",
      "Refunds will generally be processed within 7–10 business days after the cancellation and refund have been approved.",
      "The actual time taken for the amount to appear in the customer's account may vary depending on the bank or payment service provider.",
      "Any amount paid directly to the Partner is subject to the Partner's applicable cancellation and refund terms.",
    ],
  },
  {
    number: 8,
    title: "Cancellation by Venue or Partner",
    paragraphs: [
      "If a confirmed booking is cancelled by the venue or Partner for reasons attributable to the Partner, BookFarmVilla may assist the customer with:",
      "The customer's refund entitlement will be determined according to the applicable booking terms and circumstances of the cancellation.",
      "BookFarmVilla does not guarantee availability of an alternative venue or service.",
    ],
    list: [
      "Processing the eligible refund of the advance payment",
      "Exploring an alternative venue/service, subject to availability",
    ],
  },
  {
    number: 9,
    title: "Changes to a Booking",
    paragraphs: [
      "Any request to change a confirmed booking, including:",
      "will be subject to availability and approval by the respective Partner.",
      "Any additional charges resulting from such changes will be communicated before they are accepted.",
    ],
    list: [
      "Event date",
      "Number of guests",
      "Duration",
      "Venue",
      "Services",
      "Catering",
      "Decoration",
      "Other requirements",
    ],
  },
  {
    number: 10,
    title: "Pricing",
    paragraphs: [
      "Prices displayed on BookFarmVilla may be indicative or based on information provided by Partners.",
      "The final booking price may depend on:",
      "The final price will be confirmed before the customer makes the advance payment.",
    ],
    list: [
      "Event date",
      "Number of guests",
      "Duration",
      "Selected services",
      "Catering requirements",
      "Decoration requirements",
      "Additional facilities",
      "Applicable taxes",
      "Other requirements",
    ],
  },
  {
    number: 11,
    title: "Partner Responsibilities",
    paragraphs: [
      "Partners are responsible for providing accurate information regarding their venue or services.",
      "Partners are responsible for:",
    ],
    list: [
      "Maintaining accurate listing information",
      "Communicating correct pricing",
      "Providing accurate availability",
      "Honouring confirmed bookings",
      "Providing the services agreed with the customer",
      "Communicating applicable cancellation terms",
      "Informing customers about additional charges",
      "Complying with applicable laws and regulations",
    ],
  },
  {
    number: 12,
    title: "Customer Responsibilities",
    paragraphs: ["Customers agree to:"],
    list: [
      "Provide accurate information",
      "Provide valid contact details",
      "Provide genuine event requirements",
      "Review booking details before making payment",
      "Review the applicable cancellation policy",
      "Pay the remaining balance to the Partner as agreed",
      "Follow the rules and policies of the venue/property",
      "Do not misuse the BookFarmVilla platform",
    ],
  },
  {
    number: 13,
    title: "Availability",
    paragraphs: [
      "Availability displayed on BookFarmVilla may be based on information provided by Partners and/or connected availability calendars.",
      "Availability may change before a booking is confirmed.",
      "A customer should rely on the booking confirmation provided after the Partner has confirmed the availability and the required advance has been received.",
    ],
  },
  {
    number: 14,
    title: "BookFarmVilla's Role",
    paragraphs: [
      "BookFarmVilla operates as a platform that facilitates venue and service discovery, customer enquiries, booking coordination and advance payment collection.",
      "BookFarmVilla does not necessarily own, operate or directly provide every venue or service listed on the platform.",
      "The actual venue or event service is provided by the respective Partner.",
    ],
  },
  {
    number: 15,
    title: "Third-Party Partners",
    paragraphs: [
      "Customers understand that venues and event services listed on BookFarmVilla may be operated by independent third-party Partners.",
      "The Partner is responsible for delivering the venue or services agreed with the customer.",
      "BookFarmVilla may assist customers and Partners with communication and booking-related support where appropriate.",
    ],
  },
  {
    number: 16,
    title: "Additional Services",
    paragraphs: [
      "If a customer requests additional services after the booking has been confirmed, such as additional catering, decoration, extended hours or other facilities, such services may involve additional charges.",
      "The applicable charges will be communicated by the Partner before the additional service is provided.",
    ],
  },
  {
    number: 17,
    title: "Intellectual Property",
    paragraphs: [
      "The BookFarmVilla name, logo, website design, graphics, text, software and other original platform materials are owned by or licensed to BookFarmVilla unless otherwise stated.",
      "Users and Partners must not copy, reproduce, modify, distribute or commercially exploit BookFarmVilla's proprietary content without prior permission.",
    ],
  },
  {
    number: 18,
    title: "Partner Content",
    paragraphs: [
      "Partners are responsible for ensuring that they have the necessary rights and permissions to use any images, videos, logos, descriptions or other content submitted to BookFarmVilla.",
      "By submitting such content, Partners permit BookFarmVilla to display and use the content for listing, platform operation and promotional purposes, subject to the applicable agreement between BookFarmVilla and the Partner.",
    ],
  },
  {
    number: 19,
    title: "Prohibited Activities",
    paragraphs: ["Users and Partners must not:"],
    list: [
      "Provide false or misleading information",
      "Use the platform for unlawful purposes",
      "Attempt unauthorised access to the platform",
      "Upload malicious software",
      "Misuse customer or Partner information",
      "Impersonate another individual or business",
      "Conduct fraudulent activities through the platform",
      "Scrape or commercially misuse BookFarmVilla data without permission",
    ],
  },
  {
    number: 20,
    title: "Platform Availability",
    paragraphs: [
      "BookFarmVilla aims to maintain a reliable platform but does not guarantee that the website will always be available, uninterrupted or completely error-free.",
      "Temporary interruptions may occur because of maintenance, technical problems, internet/network failures, third-party services or circumstances beyond our reasonable control.",
    ],
  },
  {
    number: 21,
    title: "Limitation of Liability",
    paragraphs: [
      "BookFarmVilla acts as a platform facilitating interactions and bookings between customers and Partners.",
      "To the extent permitted by applicable law, BookFarmVilla is not responsible for losses arising solely from the independent acts, omissions, representations, services, cancellations or additional charges of a Partner.",
      "Nothing in these Terms is intended to exclude or restrict any consumer rights or remedies that cannot legally be excluded or restricted.",
    ],
  },
  {
    number: 22,
    title: "Force Majeure",
    paragraphs: [
      "BookFarmVilla will not be responsible for delays or inability to provide platform services caused by circumstances beyond its reasonable control, including natural disasters, government actions, technical failures, network outages, strikes, epidemics, war or other extraordinary circumstances.",
    ],
  },
  {
    number: 23,
    title: "Suspension or Termination",
    paragraphs: [
      "BookFarmVilla may suspend, restrict or terminate access to the platform where a user or Partner:",
    ],
    list: [
      "Violates these Terms",
      "Provides fraudulent or misleading information",
      "Misuses the platform",
      "Engages in unlawful activities",
      "Creates security or operational risks",
    ],
  },
  {
    number: 24,
    title: "Privacy",
    paragraphs: [
      "Your use of BookFarmVilla is also subject to our Privacy Policy, which explains how your personal information is collected, used and handled.",
    ],
  },
  {
    number: 25,
    title: "Grievance & Customer Support",
    paragraphs: [
      "Customers may contact BookFarmVilla for platform-related questions, booking assistance or complaints.",
      "BookFarmVilla will maintain an appropriate grievance redressal mechanism in accordance with applicable law.",
    ],
    contentBreak: 2,
    list: [
      "Customer Support: [Official Email]",
      "Grievance Officer: [Name]",
      "Grievance Email: [Official Email]",
      "Contact Number: [Official Phone Number]",
      "Business Address: [Official Address]",
    ],
  },
  {
    number: 26,
    title: "Changes to These Terms",
    paragraphs: [
      "BookFarmVilla may update these Terms & Conditions from time to time.",
      'Any revised version will be published on this page with an updated "Last Updated" date.',
      "Continued use of the platform after changes are published constitutes acceptance of the updated Terms, subject to applicable law.",
    ],
  },
  {
    number: 27,
    title: "Governing Law",
    paragraphs: [
      "These Terms & Conditions shall be governed by and interpreted in accordance with the laws applicable in India, subject to applicable consumer protection and other mandatory legal rights.",
    ],
  },
];

function TermsList({ items }: { items: string[] }) {
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

function CancellationTable({ rows }: { rows: CancellationRow[] }) {
  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-left">
          <thead className="bg-[#0F172A] text-white">
            <tr>
              <th className="px-5 py-4 text-sm font-semibold">
                Cancellation Time
              </th>
              <th className="px-5 py-4 text-sm font-semibold">
                Refund of 20% Advance
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((row) => (
              <tr key={row.cancellationTime} className="bg-white">
                <td className="px-5 py-4 text-sm text-[#64748B]">
                  {row.cancellationTime}
                </td>
                <td className="px-5 py-4 text-sm font-semibold text-[#0F172A]">
                  {row.refund}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function TermsAndConditionsPage() {
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
                <span className="text-white/60">Terms & Conditions</span>
              </div>

              <div className="mt-8 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/10 backdrop-blur-sm">
                <Scale
                  size={28}
                  className="text-[#4CAF50]"
                  aria-hidden="true"
                />
              </div>

              <h1 className="mt-6 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                Terms & Conditions
              </h1>

              <p className="mt-5 max-w-3xl text-base leading-8 text-white/70 md:text-lg">
                These Terms & Conditions govern your access to and use of the
                BookFarmVilla website, platform and related services.
              </p>

              <div className="mt-7 inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-green-200 backdrop-blur-sm">
                Last Updated: September 27, 2026
              </div>
            </div>
          </div>
        </section>

        {/* Terms document */}
        <section className="bg-[#F8FAFC] py-16 md:py-20">
          <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-10 px-6 lg:grid-cols-[300px_minmax(0,1fr)] lg:px-12">
            {/* Desktop table of contents */}
            <aside className="hidden lg:block">
              <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <FileText
                    size={18}
                    className="text-[#2EAD45]"
                    aria-hidden="true"
                  />
                  <p className="text-sm font-semibold text-[#0F172A]">
                    On this page
                  </p>
                </div>

                <nav aria-label="Terms and Conditions sections">
                  <ol className="space-y-1">
                    {termsSections.map((section) => (
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

            <article className="min-w-0 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8 md:p-12">
              <div className="rounded-2xl border border-green-100 bg-[#DCFCE7]/40 p-5">
                <div className="flex items-start gap-3">
                  <ShieldCheck
                    size={22}
                    className="mt-1 shrink-0 text-[#1E8A32]"
                    aria-hidden="true"
                  />
                  <div className="space-y-3 leading-7 text-[#166534]">
                    <p>
                      Welcome to BookFarmVilla. These Terms & Conditions govern
                      your access to and use of the BookFarmVilla website,
                      platform and related services.
                    </p>
                    <p>
                      By accessing or using BookFarmVilla, you agree to these
                      Terms & Conditions. If you do not agree with any part of
                      these terms, please do not use the platform.
                    </p>
                  </div>
                </div>
              </div>

              {termsSections.map((section) => (
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
                      .slice(0, section.contentBreak ?? 1)
                      .map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                  </div>

                  {section.list && <TermsList items={section.list} />}
                  {section.table && <CancellationTable rows={section.table} />}

                  {section.paragraphs.length >
                    (section.contentBreak ?? 1) && (
                    <div className="mt-5 space-y-4 leading-8 text-[#64748B]">
                      {section.paragraphs
                        .slice(section.contentBreak ?? 1)
                        .map((paragraph) => (
                          <p key={paragraph}>{paragraph}</p>
                        ))}
                    </div>
                  )}

                  {section.number === 24 && (
                    <Link
                      href="/privacy-policy"
                      className="mt-5 inline-flex rounded-xl bg-[#DCFCE7] px-5 py-2.5 text-sm font-semibold text-[#1E8A32] transition-colors hover:bg-[#2EAD45] hover:text-white"
                    >
                      Read Privacy Policy
                    </Link>
                  )}
                </section>
              ))}
            </article>
          </div>
        </section>
      </main>

      <Footer />
      <CallbackModal />
    </CallbackProvider>
  );
}
