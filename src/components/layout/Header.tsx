"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import { Menu, X } from "lucide-react";

import { useCallbackModal } from "@/components/callback/CallbackContext";
import Logo from "@/components/layout/Logo";

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
    label: "About Us",
    href: "/about",
  },
  {
    label: "Contact",
    href: "/#contact",
  },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  const [isMobileMenuOpen, setIsMobileMenuOpen] =
    useState(false);

  const { openGeneralCallback } = useCallbackModal();

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

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
          className="fixed inset-0 z-40 cursor-default bg-black/45 backdrop-blur-md lg:hidden"
          aria-label="Close navigation menu"
        />
      )}

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 shadow-lg shadow-black/5 backdrop-blur-md"
            : "bg-transparent"
        }`}
      >
        {/* Main Header bar */}
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              onClick={closeMobileMenu}
              className="group flex items-center gap-3"
              aria-label="BookFarmVilla homepage"
            >
              <Logo priority />

              <div className="flex flex-col leading-tight">
                <span
                  className={`text-xl font-bold tracking-tight transition-colors ${
                    isScrolled
                      ? "text-[#0F172A]"
                      : "text-white"
                  }`}
                >
                  BookFarmVilla
                </span>

                <span
                  className={`text-[10px] font-medium uppercase tracking-widest transition-colors ${
                    isScrolled
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
              className="hidden items-center gap-8 lg:flex"
              aria-label="Main navigation"
            >
              {navigationItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-[#2EAD45] ${
                    isScrolled
                      ? "text-[#0F172A]"
                      : "text-white/90"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Desktop action buttons */}
            <div className="hidden items-center gap-3 lg:flex">
              <Link
                href="/#partner"
                className={`rounded-full border-2 px-5 py-2.5 text-sm font-semibold transition-all ${
                  isScrolled
                    ? "border-[#2EAD45] text-[#2EAD45] hover:bg-[#2EAD45] hover:text-white"
                    : "border-white text-white hover:bg-white hover:text-[#2EAD45]"
                }`}
              >
                Become a Partner
              </Link>

              <button
                type="button"
                onClick={openGeneralCallback}
                className="rounded-full bg-[#2EAD45] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-green-500/25 transition-colors hover:bg-[#1E8A32]"
              >
                Get Event Assistance
              </button>
            </div>

            {/* Mobile hamburger button */}
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(
                  (currentValue) => !currentValue,
                );
              }}
              className={`rounded-lg p-2 transition-colors lg:hidden ${
                isScrolled
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
          <div className="relative z-50 border-t border-gray-100 bg-white shadow-2xl lg:hidden">
            <nav
              className="flex flex-col gap-4 px-6 py-5"
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
                <a
                  href="#partner"
                  onClick={closeMobileMenu}
                  className="rounded-full border-2 border-[#2EAD45] px-5 py-3 text-center text-sm font-semibold text-[#2EAD45] transition-colors hover:bg-[#2EAD45] hover:text-white"
                >
                  Become a Partner
                </a>

                <button
                  type="button"
                  onClick={() => {
                    closeMobileMenu();
                    openGeneralCallback();
                  }}
                  className="rounded-full bg-[#2EAD45] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1E8A32]"
                >
                  Get Event Assistance
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}