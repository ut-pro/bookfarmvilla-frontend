import {
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa6";

import type { IconType } from "react-icons";

import Logo from "@/components/layout/Logo";
import { siteConfig } from "@/data/site";

interface FooterLink {
  label: string;
  href: string;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

interface SocialItem {
  label: string;
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
        label: "Become a Partner",
        href: "#partner",
      },
      {
        label: "Contact",
        href: "#contact",
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
        label: "Blogs",
        href: "/blogs",
      },
      {
        label: "Careers",
        href: "/careers",
      },
      {
        label: "Staff Login",
        href: "/staff/login",
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

const socialItems: SocialItem[] = [
  {
    label: "Instagram",
    icon: FaInstagram,
  },
  {
    label: "Facebook",
    icon: FaFacebookF,
  },
  {
    label: "LinkedIn",
    icon: FaLinkedinIn,
  },
  {
    label: "YouTube",
    icon: FaYoutube,
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      id="contact"
      className="scroll-mt-20 bg-[#0F172A] text-white"
    >
      <div className="mx-auto max-w-360 px-6 pb-8 pt-16 lg:px-12">
        {/* Main footer content */}
        <div className="mb-12 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand and contact information */}
          <div className="md:col-span-2 lg:col-span-2">
            <a
              href="#home"
              className="inline-flex items-center gap-3"
              aria-label="Go to BookFarmVilla homepage"
            >
              <Logo />

              <div>
                <p className="text-lg font-bold leading-tight text-white">
                  {siteConfig.name}
                </p>

                <p className="text-[10px] font-medium uppercase tracking-widest text-green-400">
                  Farmhouses · Villas · Wedding Lawns
                </p>
              </div>
            </a>

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

                <span>{siteConfig.contact.phone}</span>
              </div>

              <div className="flex items-center gap-2">
                <Mail
                  size={15}
                  className="shrink-0 text-[#2EAD45]"
                  aria-hidden="true"
                />

                <span>{siteConfig.contact.email}</span>
              </div>
            </address>

            {/* Social media placeholders */}
            <div>
              <p className="mb-3 text-xs text-gray-500">
                Social links coming soon
              </p>

              <div className="flex gap-3">
                {socialItems.map((socialItem) => {
                  const Icon = socialItem.icon;

                  return (
                    <span
                      key={socialItem.label}
                      className="flex h-9 w-9 cursor-not-allowed items-center justify-center rounded-lg bg-white/5 text-gray-500"
                      title={`${socialItem.label} link coming soon`}
                      aria-label={`${socialItem.label} link coming soon`}
                      aria-disabled="true"
                    >
                      <Icon size={16} aria-hidden="true" />
                    </span>
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
                    <a
                      href={link.href}
                      className="text-sm text-gray-400 transition-colors hover:text-[#4CAF50]"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom footer */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-center sm:flex-row sm:text-left">
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