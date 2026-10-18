"use client";

import {
  useCallback,
  useEffect,
  useState,
  type MouseEvent,
} from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Menu, X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

import Logo from "@/components/layout/Logo";

import { buildWhatsAppUrl } from "@/lib/whatsapp";

const navigationItems = [
  {
    label: "Farmhouses",
    href: "/#farmhouses",
  },
  {
    label: "Villas",
    href: "/#villas",
  },
  {
    label: "Wedding Lawns",
    href: "/#wedding-lawns",
  },
  {
    label: "Vendors",
    href: "/#vendors-services",
  },
  {
    label: "Blogs",
    href: "/blogs",
  },
];

const whatsappMessage = `Hi BookFarmVilla team, I need assistance in finding a suitable venue.

Event type:
Preferred location:
Event date:
Expected guests:

Please help me with available options.`;

const whatsappUrl = buildWhatsAppUrl(whatsappMessage);

export default function Header() {
  const pathname = usePathname();

  const [isScrolled, setIsScrolled] = useState(false);

  const [isMobileMenuOpen, setIsMobileMenuOpen] =
    useState(false);

  const useSolidHeader = isScrolled || pathname !== "/";

  useEffect(() => {
    if (window.location.hash) {
      return;
    }

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [pathname]);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const handleBrandClick = (
    event: MouseEvent<HTMLAnchorElement>,
  ) => {
    closeMobileMenu();

    const isModifiedClick =
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey;

    if (
      pathname !== "/" ||
      isModifiedClick ||
      event.button !== 0
    ) {
      return;
    }

    event.preventDefault();

    if (window.location.hash) {
      window.history.replaceState(
        window.history.state,
        "",
        window.location.pathname +
          window.location.search,
      );
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Detect page scroll for Header color change
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll,
      );
    };
  }, []);

  // Stop background scrolling when mobile menu is open
  useEffect(() => {
    if (!isMobileMenuOpen) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMobileMenu();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, [isMobileMenuOpen, closeMobileMenu]);

  return (
    <>
      {/* 
       * This backdrop is outside Header so that it always
       * covers and blurs the complete browser viewport.
       */}
      {isMobileMenuOpen && (
        <button
          type="button"
          onClick={closeMobileMenu}
          className="fixed inset-0 z-40 cursor-default bg-black/45 backdrop-blur-md xl:hidden"
          aria-label="Close navigation menu"
        />
      )}

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          useSolidHeader
            ? "bg-white/95 shadow-lg shadow-black/5 backdrop-blur-md"
            : "bg-transparent"
        }`}
      >
        {/* Main Header bar */}
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex h-16 items-center justify-between sm:h-20">
            {/* Logo */}
            <Link
              href="/"
              scroll
              onClick={handleBrandClick}
              className="group flex min-w-0 items-center gap-2 sm:gap-3"
              aria-label="BookFarmVilla homepage"
            >
              <Logo priority />

              <div className="flex min-w-0 flex-col leading-tight">
                <span
                  className={`block truncate text-lg font-bold tracking-tight transition-colors sm:text-xl ${
                    useSolidHeader
                      ? "text-[#0F172A]"
                      : "text-white"
                  }`}
                >
                  BookFarmVilla
                </span>

                <span
                  className={`block whitespace-nowrap text-[7px] font-semibold uppercase tracking-[0.04em] transition-colors min-[360px]:text-[8px] min-[400px]:tracking-[0.08em] sm:text-[10px] sm:font-medium sm:tracking-widest ${
                    useSolidHeader
                      ? "text-[#2EAD45]"
                      : "text-green-300"
                  }`}
                >
                  Farmhouses · Villas · Wedding Lawns
                </span>
              </div>
            </Link>

            {/* Desktop navigation */}
            <nav
              className="hidden items-center gap-6 xl:flex 2xl:gap-8"
              aria-label="Main navigation"
            >
              {navigationItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-[#2EAD45] ${
                    useSolidHeader
                      ? "text-[#0F172A]"
                      : "text-white/90"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Desktop action buttons */}
            <div className="hidden items-center gap-3 xl:flex">
              <Link
                href="/#partner"
                className={`rounded-full border-2 px-5 py-2.5 text-sm font-semibold transition-all ${
                  useSolidHeader
                    ? "border-[#2EAD45] text-[#2EAD45] hover:bg-[#2EAD45] hover:text-white"
                    : "border-white text-white hover:bg-white hover:text-[#2EAD45]"
                }`}
              >
                Become a Partner
              </Link>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2EAD45] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-green-500/25 transition-colors hover:bg-[#1E8A32]"
                aria-label="Get event assistance on WhatsApp"
              >
                <FaWhatsapp
                  size={18}
                  aria-hidden="true"
                />

                <span>Get Event Assistance</span>
              </a>
            </div>

            {/* Mobile hamburger button */}
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(
                  (currentValue) => !currentValue,
                );
              }}
              className={`flex h-11 w-11 items-center justify-center rounded-xl transition-colors xl:hidden ${
                useSolidHeader
                  ? "text-[#0F172A]"
                  : "text-white"
              }`}
              aria-label={
                isMobileMenuOpen
                  ? "Close navigation menu"
                  : "Open navigation menu"
              }
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X size={24} />
              ) : (
                <Menu size={24} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile navigation panel */}
        {isMobileMenuOpen && (
          <div className="relative z-50 border-t border-gray-100 bg-white shadow-2xl xl:hidden">
            <nav
              className="flex max-h-[calc(100dvh-4rem)] flex-col gap-4 overflow-y-auto px-4 py-5 sm:px-6"
              aria-label="Mobile navigation"
            >
              {navigationItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className="rounded-lg px-1 py-2 text-sm font-medium text-[#0F172A] transition-colors hover:text-[#2EAD45]"
                >
                  {item.label}
                </Link>
              ))}

              <div className="flex flex-col gap-3 border-t border-gray-100 pt-5">
                <Link
                  href="/#partner"
                  onClick={closeMobileMenu}
                  className="rounded-full border-2 border-[#2EAD45] px-5 py-3 text-center text-sm font-semibold text-[#2EAD45] transition-colors hover:bg-[#2EAD45] hover:text-white"
                >
                  Become a Partner
                </Link>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMobileMenu}
                  className="rounded-full bg-[#2EAD45] px-5 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-[#1E8A32]"
                  aria-label="Get event assistance on WhatsApp"
                >
                  Get Event Assistance
                </a>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
