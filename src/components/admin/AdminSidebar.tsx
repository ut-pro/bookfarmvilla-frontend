"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Home,
  Castle,
  Flower2,
  Building2,
  UserCircle2,
  CalendarDays,
  MessageSquare,
  Handshake,
  Star,
  FileText,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutGrid, exact: true },
  { href: "/admin/farmhouses", label: "Farmhouses", icon: Home },
  { href: "/admin/villas", label: "Villas", icon: Castle },
  { href: "/admin/wedding-lawns", label: "Wedding Lawns", icon: Flower2 },
  { href: "/admin/airbnb", label: "Airbnb", icon: Building2 },
  { href: "/admin/vendors", label: "Vendors", icon: UserCircle2 },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarDays },
  { href: "/admin/enquiries", label: "Enquiries", icon: MessageSquare },
  { href: "/admin/partners", label: "Partner Requests", icon: Handshake },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/blog", label: "Blog", icon: FileText },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col bg-[#0f0b24] text-white">
      <Link
        href="/admin"
        aria-label="BookFarmVilla admin home"
        className="flex h-[72px] shrink-0 items-center gap-2.5 px-4"
      >
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white">
          <Image
            src="/logo/brand-logo-transparent.png"
            alt=""
            width={30}
            height={30}
            priority
          />
        </span>
        <span className="whitespace-nowrap text-[15px] font-bold tracking-tight">
          BookFarmVilla
        </span>
      </Link>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname?.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-violet-600 text-white"
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={18} aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
