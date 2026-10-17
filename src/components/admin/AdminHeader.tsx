"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  ChevronDown,
  Handshake,
  LogOut,
  MessageSquare,
  Search,
} from "lucide-react";
import {
  fetchBookings,
  fetchLeads,
  fetchPartners,
  fetchProperties,
  fetchVendors,
  getStoredUser,
  logout,
} from "@/lib/admin-api";
import type { AdminLead, AdminPartner } from "@/types/admin";

interface AdminHeaderProps {
  title: string;
}

interface AdminSearchResult {
  id: string;
  title: string;
  detail: string;
  category: string;
  href: string;
}

interface AdminNotification {
  id: string;
  title: string;
  detail: string;
  href: string;
  createdAt: string;
  read: boolean;
}

const NOTIFICATIONS_KEY = "bfv_admin_notifications";
const KNOWN_NOTIFICATIONS_KEY = "bfv_admin_known_notifications";

function readCachedNotifications(): AdminNotification[] {
  try {
    const value: unknown = JSON.parse(
      window.localStorage.getItem(NOTIFICATIONS_KEY) ?? "[]",
    );
    if (!Array.isArray(value)) return [];
    return value.filter(
      (item): item is AdminNotification =>
        typeof item?.id === "string" &&
        typeof item?.title === "string" &&
        typeof item?.detail === "string" &&
        typeof item?.href === "string" &&
        typeof item?.createdAt === "string" &&
        typeof item?.read === "boolean",
    );
  } catch {
    return [];
  }
}

function readKnownNotificationIds(): string[] {
  try {
    const value: unknown = JSON.parse(
      window.localStorage.getItem(KNOWN_NOTIFICATIONS_KEY) ?? "[]",
    );
    return Array.isArray(value)
      ? value.filter((id): id is string => typeof id === "string")
      : [];
  } catch {
    return [];
  }
}

function includesSearchTerm(values: Array<string | null | undefined>, term: string) {
  return values.some((value) => value?.toLowerCase().includes(term));
}

export default function AdminHeader({ title }: AdminHeaderProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<AdminSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [notificationError, setNotificationError] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const knownNotificationIdsRef = useRef<Set<string>>(new Set());
  const notificationBaselineLoadedRef = useRef(false);
  const recentLeadsRef = useRef<AdminLead[] | null>(null);
  const recentPartnersRef = useRef<AdminPartner[] | null>(null);
  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications],
  );

  useEffect(() => {
    // Browser storage is only available after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(getStoredUser());
    knownNotificationIdsRef.current = new Set(readKnownNotificationIds());
    notificationBaselineLoadedRef.current =
      window.localStorage.getItem(KNOWN_NOTIFICATIONS_KEY) !== null;
    setNotifications(readCachedNotifications());
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (menuRef.current && !menuRef.current.contains(target)) {
        setMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(target)) {
        setSearchOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(target)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    let active = true;
    let polling = false;

    const refreshNotifications = async () => {
      if (polling) return;
      polling = true;
      try {
        const [leadPage, partnerPage] = await Promise.all([
          fetchLeads({
            status: "NEW",
            page: 0,
            size: 20,
            sortBy: "createdAt",
            sortDirection: "desc",
          }),
          fetchPartners({ status: "PENDING", page: 0, size: 20 }),
        ]);
        if (!active) return;

        const records: AdminNotification[] = [
          ...leadPage.content.map((lead) => ({
            id: `lead:${lead.id}`,
            title: `New enquiry from ${lead.name}`,
            detail: lead.propertyTitle ?? lead.vendorName ?? "Customer enquiry",
            href: `/admin/enquiries?search=${encodeURIComponent(lead.name)}`,
            createdAt: lead.createdAt,
            read: false,
          })),
          ...partnerPage.content.map((partner) => ({
            id: `partner:${partner.id}`,
            title: `New partner request from ${partner.businessName}`,
            detail: `${partner.fullName} · ${partner.city}`,
            href: `/admin/partners?search=${encodeURIComponent(partner.businessName)}`,
            createdAt: partner.createdAt,
            read: false,
          })),
        ];
        const currentIds = records.map((record) => record.id);

        const newRecords = notificationBaselineLoadedRef.current
          ? records.filter(
              (record) => !knownNotificationIdsRef.current.has(record.id),
            )
          : records;
        newRecords.sort(
          (first, second) =>
            new Date(second.createdAt).getTime() -
            new Date(first.createdAt).getTime(),
        );
        notificationBaselineLoadedRef.current = true;
        currentIds.forEach((id) => knownNotificationIdsRef.current.add(id));
        knownNotificationIdsRef.current = new Set(
          [...knownNotificationIdsRef.current].slice(-500),
        );
        window.localStorage.setItem(
          KNOWN_NOTIFICATIONS_KEY,
          JSON.stringify([...knownNotificationIdsRef.current].slice(-500)),
        );
        if (newRecords.length > 0) {
          setNotifications((current) => {
            const merged = [
              ...newRecords,
              ...current.filter(
                (notification) =>
                  !newRecords.some((record) => record.id === notification.id),
              ),
            ].slice(0, 100);
            window.localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(merged));
            return merged;
          });
        }
        setNotificationError(null);
      } catch (error) {
        if (active) {
          console.error("Unable to refresh admin notifications:", error);
          setNotificationError(
            error instanceof Error
              ? error.message
              : "Notifications could not be refreshed.",
          );
        }
      } finally {
        polling = false;
      }
    };

    void refreshNotifications();
    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        void refreshNotifications();
      }
    }, 60_000);
    const handleFocus = () => void refreshNotifications();
    window.addEventListener("focus", handleFocus);
    return () => {
      active = false;
      window.clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  useEffect(() => {
    window.localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    const trimmedQuery = query.trim();
    if (trimmedQuery.length < 2) {
      return;
    }

    let active = true;
    const timeout = window.setTimeout(async () => {
      setSearching(true);
      setSearchError(null);
      const term = trimmedQuery.toLowerCase();
      try {
        const [properties, vendors, bookings] = await Promise.all([
          fetchProperties({ keyword: trimmedQuery, page: 0, size: 5 }),
          fetchVendors({ keyword: trimmedQuery, page: 0, size: 5 }),
          fetchBookings({ keyword: trimmedQuery, page: 0, size: 5 }),
        ]);
        let leads = recentLeadsRef.current;
        let partners = recentPartnersRef.current;
        if (!leads || !partners) {
          const [leadPage, partnerPage] = await Promise.all([
            fetchLeads({
              page: 0,
              size: 100,
              sortBy: "createdAt",
              sortDirection: "desc",
            }),
            fetchPartners({ page: 0, size: 100 }),
          ]);
          recentLeadsRef.current = leadPage.content;
          recentPartnersRef.current = partnerPage.content;
          leads = leadPage.content;
          partners = partnerPage.content;
        }
        if (!active) return;

        const results: AdminSearchResult[] = [
          ...properties.content.map((property) => ({
            id: `property:${property.id}`,
            title: property.title,
            detail: [property.city, property.status].filter(Boolean).join(" · "),
            category: "Property",
            href: `/admin/${property.type === "FARMHOUSE" ? "farmhouses" : property.type === "VILLA" ? "villas" : property.type === "WEDDING_LAWN" ? "wedding-lawns" : "airbnb"}?search=${encodeURIComponent(trimmedQuery)}`,
          })).slice(0, 3),
          ...vendors.content.map((vendor) => ({
            id: `vendor:${vendor.id}`,
            title: vendor.name,
            detail: [vendor.city, vendor.status].filter(Boolean).join(" · "),
            category: "Vendor",
            href: `/admin/vendors?search=${encodeURIComponent(trimmedQuery)}`,
          })).slice(0, 3),
          ...bookings.content.map((booking) => ({
            id: `booking:${booking.id}`,
            title: booking.customerName,
            detail: [booking.propertyTitle ?? typeLabelsForSearch(booking.listingType), booking.status].join(" · "),
            category: "Booking",
            href: `/admin/bookings?search=${encodeURIComponent(trimmedQuery)}`,
          })).slice(0, 3),
          ...(leads ?? [])
            .filter((lead) =>
              includesSearchTerm(
                [
                  lead.name,
                  lead.phone,
                  lead.email,
                  lead.propertyTitle,
                  lead.originalPropertyName,
                  lead.vendorName,
                  lead.eventType,
                  lead.message,
                  lead.status,
                ],
                term,
              ),
            )
            .slice(0, 3)
            .map((lead) => ({
              id: `enquiry:${lead.id}`,
              title: lead.name,
              detail: [lead.propertyTitle ?? lead.vendorName ?? "Enquiry", lead.status].join(" · "),
              category: "Enquiry",
              href: `/admin/enquiries?search=${encodeURIComponent(trimmedQuery)}`,
            })),
          ...(partners ?? [])
            .filter((partner) =>
              includesSearchTerm(
                [
                  partner.businessName,
                  partner.fullName,
                  partner.businessType,
                  partner.city,
                  partner.location,
                  partner.phoneNumber,
                  partner.status,
                ],
                term,
              ),
            )
            .slice(0, 3)
            .map((partner) => ({
              id: `partner:${partner.id}`,
              title: partner.businessName,
              detail: [partner.fullName, partner.city, partner.status].join(" · "),
              category: "Partner",
              href: `/admin/partners?search=${encodeURIComponent(trimmedQuery)}`,
            })),
        ];
        setSearchResults(results);
      } catch (error) {
        if (active) {
          console.error("Unable to search admin records:", error);
          setSearchError(
            error instanceof Error
              ? error.message
              : "Search could not be completed. Please try again.",
          );
          setSearchResults([]);
        }
      } finally {
        if (active) setSearching(false);
      }
    }, 300);

    return () => {
      active = false;
      window.clearTimeout(timeout);
    };
  }, [query]);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : user?.email?.slice(0, 1).toUpperCase() ?? "AD";

  const openSearchResult = (result: AdminSearchResult) => {
    setSearchOpen(false);
    setQuery("");
    router.push(result.href);
  };

  const markAllNotificationsRead = () => {
    setNotifications((current) =>
      current.map((notification) => ({ ...notification, read: true })),
    );
  };

  const openNotification = (notification: AdminNotification) => {
    setNotifications((current) =>
      current.map((item) =>
        item.id === notification.id ? { ...item, read: true } : item,
      ),
    );
    setNotificationsOpen(false);
    router.push(notification.href);
  };

  return (
    <header
      aria-label={`${title} page controls`}
      className="flex min-h-[64px] items-center justify-end border-b border-gray-100 bg-white px-4 py-3 sm:px-8"
    >
      <div className="flex min-w-0 items-center gap-2 sm:gap-4">
        <div className="relative" ref={searchRef}>
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="search"
            value={query}
            onFocus={() => setSearchOpen(true)}
            onChange={(event) => {
              const nextQuery = event.target.value;
              setQuery(nextQuery);
              setSearchResults([]);
              setSearchError(null);
              setSearching(nextQuery.trim().length >= 2);
              setSearchOpen(true);
            }}
            onKeyDown={(event) => {
              if (event.key === "Escape") setSearchOpen(false);
              if (event.key === "Enter" && searchResults[0]) {
                openSearchResult(searchResults[0]);
              }
            }}
            placeholder="Search admin..."
            aria-label="Search properties, vendors, bookings, enquiries and partners"
            className="w-40 rounded-xl border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-violet-400 sm:w-64"
          />
          {searchOpen && query.trim().length >= 2 && (
            <div className="absolute right-0 top-full z-30 mt-2 max-h-[min(70vh,28rem)] w-[min(24rem,calc(100vw-2rem))] overflow-y-auto rounded-xl border border-gray-100 bg-white py-2 shadow-xl">
              {searching ? (
                <p className="px-4 py-3 text-sm text-gray-500">Searching admin records…</p>
              ) : searchError ? (
                <p className="px-4 py-3 text-sm text-red-600">{searchError}</p>
              ) : searchResults.length === 0 ? (
                <p className="px-4 py-3 text-sm text-gray-500">No matching records found.</p>
              ) : (
                searchResults.map((result) => (
                  <button
                    key={result.id}
                    type="button"
                    onClick={() => openSearchResult(result)}
                    className="block w-full px-4 py-2.5 text-left hover:bg-violet-50"
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span className="truncate text-sm font-semibold text-gray-900">
                        {result.title}
                      </span>
                      <span className="shrink-0 text-[11px] font-medium text-violet-600">
                        {result.category}
                      </span>
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-gray-500">
                      {result.detail}
                    </span>
                  </button>
                ))
              )}
              <p className="border-t border-gray-100 px-4 pt-2 text-[11px] text-gray-400">
                Search covers the latest 100 enquiries and partner requests.
              </p>
            </div>
          )}
        </div>

        <div className="relative" ref={notificationsRef}>
          <button
            type="button"
            onClick={() => {
              setNotificationsOpen((open) => !open);
              setSearchOpen(false);
            }}
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100"
            aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
            aria-expanded={notificationsOpen}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>
          {notificationsOpen && (
            <div className="absolute right-0 top-full z-30 mt-2 w-[min(22rem,calc(100vw-2rem))] rounded-xl border border-gray-100 bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                <h2 className="text-sm font-bold text-gray-900">Notifications</h2>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllNotificationsRead}
                    className="text-xs font-medium text-violet-600 hover:text-violet-700"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              {notificationError && (
                <p className="border-b border-red-100 bg-red-50 px-4 py-2 text-xs text-red-600">
                  Could not refresh: {notificationError}
                </p>
              )}
              {notifications.length === 0 ? (
                <p className="px-4 py-5 text-center text-sm text-gray-500">
                  No new enquiries or partner requests.
                </p>
              ) : (
                <div className="max-h-80 overflow-y-auto py-1">
                  {notifications.map((notification) => (
                    <button
                      key={notification.id}
                      type="button"
                      onClick={() => openNotification(notification)}
                      className={`flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-violet-50 ${
                        notification.read ? "" : "bg-violet-50/50"
                      }`}
                    >
                      <span className="mt-0.5 rounded-lg bg-violet-100 p-2 text-violet-600">
                        {notification.id.startsWith("lead:") ? (
                          <MessageSquare size={15} />
                        ) : (
                          <Handshake size={15} />
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-gray-900">
                          {notification.title}
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-gray-500">
                          {notification.detail}
                        </span>
                        <span className="mt-1 block text-[11px] text-gray-400">
                          {new Date(notification.createdAt).toLocaleString()}
                        </span>
                      </span>
                      {!notification.read && (
                        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-violet-600" />
                      )}
                    </button>
                  ))}
                </div>
              )}
              <div className="grid grid-cols-2 border-t border-gray-100 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => {
                    setNotificationsOpen(false);
                    router.push("/admin/enquiries");
                  }}
                  className="flex items-center justify-center gap-1.5 px-2 py-3 text-gray-600 hover:bg-gray-50"
                >
                  <MessageSquare size={13} /> Enquiries
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNotificationsOpen(false);
                    router.push("/admin/partners");
                  }}
                  className="flex items-center justify-center gap-1.5 border-l border-gray-100 px-2 py-3 text-gray-600 hover:bg-gray-50"
                >
                  <Handshake size={13} /> Partners
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex max-w-[min(15rem,45vw)] items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-gray-50"
            aria-expanded={menuOpen}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-600 text-sm font-semibold text-white">
              {initials}
            </div>
            <span className="hidden max-w-40 truncate text-left text-sm font-semibold text-gray-900 sm:block">
              {user?.email ?? "Admin account"}
            </span>
            <ChevronDown size={14} className="shrink-0 text-gray-400" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full z-20 mt-2 w-56 rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
              <div className="border-b border-gray-50 px-4 py-2">
                <p className="truncate text-xs text-gray-500">
                  {user?.email ?? "Signed-in admin"}
                </p>
              </div>
              <button
                type="button"
                onClick={logout}
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut size={14} />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
      <span className="sr-only">
        {title} admin tools: global search and notifications
      </span>
    </header>
  );
}

function typeLabelsForSearch(type: string): string {
  switch (type) {
    case "FARMHOUSE":
      return "Farmhouse";
    case "VILLA":
      return "Villa";
    case "WEDDING_LAWN":
      return "Wedding Lawn";
    case "AIRBNB":
      return "Airbnb";
    default:
      return "Booking";
  }
}
