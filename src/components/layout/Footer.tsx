"use client";

import {
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import {
  FaInstagram,
  FaYoutube,
} from "react-icons/fa6";

import Link from "next/link";

import type { IconType } from "react-icons";

import Logo from "@/components/layout/Logo";
import { siteConfig } from "@/data/site";
import { useCallbackModal } from "@/components/callback/CallbackContext";

interface FooterLink {
  label: string;
  href: string;
  openInNewTab?: boolean;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

interface SocialItem {
  label: string;
  href: string;
  icon: IconType;
}

const footerColumns: FooterColumn[] = [
  {
    title: "Explore",
    links: [
      {
        label: "Farmhouses",
        href: "/properties?type=FARMHOUSE",
      },
      {
        label: "Villas",
        href: "/properties?type=VILLA",
      },
      {
        label: "Wedding Lawns",
        href: "/properties?type=WEDDING_LAWN",
      },
      {
        label: "Holiday Homes",
        href: "/properties?type=AIRBNB",
      },
      {
        label: "Vendors",
        href: "/vendors",
      },
      {
        label: "Blogs",
        href: "/blogs",
      },
      {
        label: "Become a Partner",
        href: "/#partner",
      },
      {
        label: "Contact",
        href: "/#contact",
      },
    ],
  },
  {
    title: "Company",
    links: [
      {
        label: "About Us",
        href: "/about",
      },
      {
        label: "Referral Program",
        href: "/referral",
      },
      {
        label: "Careers",
        href: "/careers",
      },
      {
        label: "Staff Login",
        href: "/admin/login",
        openInNewTab: true,
      },
    ],
  },
  {
    title: "Legal",
    links: [
      {
        label: "Privacy Policy",
        href: "/privacy-policy",
      },
      {
        label: "Terms & Conditions",
        href: "/terms-and-conditions",
      },
      {
        label: "Cookie Policy",
        href: "/cookie-policy",
      },
      {
        label: "Platform Disclaimer",
        href: "/disclaimer",
      },
    ],
  },
];

const popularSearches: FooterLink[] = [
  {
    label: "Farmhouses in Delhi",
    href: "/properties?type=FARMHOUSE&city=Delhi",
  },
  {
    label: "Farmhouses in Noida",
    href: "/properties?type=FARMHOUSE&city=Noida",
  },
  {
    label: "Farmhouses in Gurugram",
    href: "/properties?type=FARMHOUSE&city=Gurugram",
  },
  {
    label: "Farmhouses in Greater Noida",
    href: "/properties?type=FARMHOUSE&city=Greater%20Noida",
  },
  {
    label: "Farmhouses in Faridabad",
    href: "/properties?type=FARMHOUSE&city=Faridabad",
  },
  {
    label: "Farmhouses in Ghaziabad",
    href: "/properties?type=FARMHOUSE&city=Ghaziabad",
  },
  {
    label: "Villas in Delhi",
    href: "/properties?type=VILLA&city=Delhi",
  },
  {
    label: "Villas in Noida",
    href: "/properties?type=VILLA&city=Noida",
  },
  {
    label: "Villas in Gurugram",
    href: "/properties?type=VILLA&city=Gurugram",
  },
  {
    label: "Villas in Greater Noida",
    href: "/properties?type=VILLA&city=Greater%20Noida",
  },
  {
    label: "Villas in Faridabad",
    href: "/properties?type=VILLA&city=Faridabad",
  },
  {
    label: "Villas in Ghaziabad",
    href: "/properties?type=VILLA&city=Ghaziabad",
  },
  {
    label: "Wedding Lawns in Delhi",
    href: "/properties?type=WEDDING_LAWN&city=Delhi",
  },
  {
    label: "Wedding Lawns in Noida",
    href: "/properties?type=WEDDING_LAWN&city=Noida",
  },
  {
    label: "Wedding Lawns in Gurugram",
    href: "/properties?type=WEDDING_LAWN&city=Gurugram",
  },
  {
    label: "Wedding Lawns in Greater Noida",
    href: "/properties?type=WEDDING_LAWN&city=Greater%20Noida",
  },
  {
    label: "Wedding Lawns in Faridabad",
    href: "/properties?type=WEDDING_LAWN&city=Faridabad",
  },
  {
    label: "Wedding Lawns in Ghaziabad",
    href: "/properties?type=WEDDING_LAWN&city=Ghaziabad",
  },
  {
    label: "Holiday Homes in Delhi",
    href: "/properties?type=AIRBNB&city=Delhi",
  },
  {
    label: "Holiday Homes in Noida",
    href: "/properties?type=AIRBNB&city=Noida",
  },
  {
    label: "Holiday Homes in Gurugram",
    href: "/properties?type=AIRBNB&city=Gurugram",
  },
  {
    label: "Holiday Homes in Greater Noida",
    href: "/properties?type=AIRBNB&city=Greater%20Noida",
  },
  {
    label: "Holiday Homes in Faridabad",
    href: "/properties?type=AIRBNB&city=Faridabad",
  },
  {
    label: "Holiday Homes in Ghaziabad",
    href: "/properties?type=AIRBNB&city=Ghaziabad",
  },
  {
    label: "Wedding Caterers in Delhi",
    href: "/vendors?category=CATERER&city=Delhi",
  },
  {
    label: "Wedding Photographers in Delhi",
    href: "/vendors?category=PHOTOGRAPHER&city=Delhi",
  },
  {
    label: "Makeup Artists in Delhi",
    href: "/vendors?category=MAKEUP_ARTIST&city=Delhi",
  },
  {
    label: "DJs in Delhi",
    href: "/vendors?category=DJ&city=Delhi",
  },
  {
    label: "Event Decorators in Delhi",
    href: "/vendors?category=DECORATOR&city=Delhi",
  },
  {
    label: "Vendors in Faridabad",
    href: "/vendors?city=Faridabad",
  },
  {
    label: "Vendors in Ghaziabad",
    href: "/vendors?city=Ghaziabad",
  },
  {
    label: "Party Planners in Delhi NCR",
    href: "/vendors",
  },
  {
    label: "Event Venues near me",
    href: "/properties",
  },
  {
    label: "Venue & Celebration Guides",
    href: "/blogs",
  },
];

const socialItems: SocialItem[] = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/bookfarmvilla?obrf=Znl5cjF4MHNsdXhx",
    icon: FaInstagram,
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@bookfarmvilla?si=uSO_wv2eLRfCyWvI",
    icon: FaYoutube,
  },
];

export default function Footer() {
  const { openGeneralCallback } = useCallbackModal();
  const currentYear = new Date().getFullYear();

  const phoneHref = `tel:${siteConfig.contact.phone.replace(
    /[^\d+]/g,
    "",
  )}`;

  const emailHref = `mailto:${siteConfig.contact.email}`;

  return (
    <footer
      id="contact"
      className="scroll-mt-20 bg-[#0F172A] text-white"
    >
      <div className="mx-auto max-w-[1440px] px-4 pb-6 pt-12 sm:px-6 sm:pb-8 sm:pt-16 lg:px-8 xl:px-12">
        {/* Main footer content */}
        <div className="mb-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-8 md:mb-12 md:grid-cols-2 lg:grid-cols-5 lg:gap-10">
          {/* Brand and contact information */}
          <div className="col-span-2 md:col-span-2 lg:col-span-2">
            <Link
              href="/"
              className="inline-flex max-w-full items-center gap-3"
              aria-label="Go to BookFarmVilla homepage"
            >
              <Logo />

              <div>
                <p className="text-lg font-bold leading-tight text-white">
                  {siteConfig.name}
                </p>

                <p className="text-[8px] font-medium uppercase tracking-[0.14em] text-green-400 sm:text-[10px] sm:tracking-widest">
                  Farmhouses · Villas · Wedding Lawns
                </p>
              </div>
            </Link>

            <p className="mb-6 mt-5 max-w-sm text-sm leading-relaxed text-gray-400">
              {siteConfig.description}
            </p>

            {/* Placeholder warning */}
            {siteConfig.contact.isPlaceholder && (
              <p className="mb-3 text-xs font-medium text-amber-300">
                Development contact placeholders — replace before launch
              </p>
            )}

            {/* Contact details */}
            <address className="mb-6 flex flex-col gap-3 text-sm not-italic text-gray-400">
              <div className="flex items-start gap-2">
                <MapPin
                  size={15}
                  className="mt-0.5 shrink-0 text-[#2EAD45]"
                  aria-hidden="true"
                />

                <span>{siteConfig.contact.location}</span>
              </div>

              <div className="flex items-center gap-2">
                <Phone
                  size={15}
                  className="shrink-0 text-[#2EAD45]"
                  aria-hidden="true"
                />

                <a
                  href={phoneHref}
                  className="transition-colors hover:text-[#4CAF50] focus:outline-none focus-visible:text-[#4CAF50]"
                  aria-label={`Call ${siteConfig.contact.phone}`}
                >
                  {siteConfig.contact.phone}
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Mail
                  size={15}
                  className="shrink-0 text-[#2EAD45]"
                  aria-hidden="true"
                />

                <a
                  href={emailHref}
                  className="break-all transition-colors hover:text-[#4CAF50] focus:outline-none focus-visible:text-[#4CAF50]"
                  aria-label={`Email ${siteConfig.contact.email}`}
                >
                  {siteConfig.contact.email}
                </a>
              </div>
            </address>

            {/* Social media links */}
            <div>
              <p className="mb-3 text-xs text-gray-500">
                Follow us
              </p>

              <div className="flex flex-wrap gap-3">
                {socialItems.map((socialItem) => {
                  const Icon = socialItem.icon;

                  return (
                    <a
                      key={socialItem.label}
                      href={socialItem.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-11 w-11 items-center justify-center rounded-lg bg-white/5 text-gray-400 transition-colors hover:bg-[#2EAD45] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4CAF50] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F172A]"
                      title={`Follow BookFarmVilla on ${socialItem.label}`}
                      aria-label={`Follow BookFarmVilla on ${socialItem.label} — opens in a new tab`}
                    >
                      <Icon size={16} aria-hidden="true" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer navigation columns */}
          {footerColumns.map((column) => (
            <nav
              key={column.title}
              aria-label={`${column.title} footer navigation`}
            >
              <h2 className="mb-5 text-sm font-semibold text-white">
                {column.title}
              </h2>

              <ul className="flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      target={link.openInNewTab ? "_blank" : undefined}
                      rel={
                        link.openInNewTab
                          ? "noopener noreferrer"
                          : undefined
                      }
                      onClick={
                        link.label === "Contact"
                          ? (event) => {
                              event.preventDefault();
                              openGeneralCallback();
                            }
                          : undefined
                      }
                      className="inline-flex min-h-9 items-center text-sm text-gray-400 transition-colors hover:text-[#4CAF50] focus:outline-none focus-visible:text-[#4CAF50]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* SEO-friendly popular searches */}
        <section
          className="mb-8 border-t border-white/10 pt-8"
          aria-labelledby="footer-popular-searches"
        >
          <h2
            id="footer-popular-searches"
            className="text-sm font-semibold text-white"
          >
            Popular Searches
          </h2>

          <p className="mt-3 max-w-4xl text-sm leading-6 text-gray-400">
            Discover farmhouses, villas and wedding lawns across Delhi NCR
            for birthday parties, pool parties, private celebrations, family
            gatherings and weddings. Connect with caterers, photographers,
            makeup artists, DJs and event decorators, or explore our venue
            and celebration guides.
          </p>

          <nav
            className="mt-5"
            aria-label="Popular venue, vendor and Blog searches in Delhi NCR"
          >
            <ul className="flex flex-wrap gap-x-2 gap-y-2.5">
              {popularSearches.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-9 items-center rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-gray-300 transition-colors hover:border-[#2EAD45] hover:bg-[#2EAD45]/10 hover:text-green-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4CAF50]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </section>

        {/* Bottom footer */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-center sm:flex-row sm:gap-4 sm:pt-8 sm:text-left">
          <p className="text-xs text-gray-500">
            © {currentYear} {siteConfig.name}. All rights reserved.
          </p>

          <p className="text-xs text-gray-500">
            Venue discovery and expert-assisted enquiries
          </p>
        </div>
      </div>
    </footer>
  );
}
