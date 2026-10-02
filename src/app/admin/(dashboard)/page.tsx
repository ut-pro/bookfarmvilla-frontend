"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Home,
  Castle,
  Flower2,
  UserCircle2,
  CalendarDays,
  MessageSquare,
  Handshake,
  LayoutGrid,
  Plus,
} from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import StatCard from "@/components/admin/StatCard";
import {
  fetchProperties,
  fetchVendors,
  fetchBookings,
  fetchLeads,
  fetchPartners,
} from "@/lib/admin-api";

interface Counts {
  totalListings: number;
  farmhouses: number;
  villas: number;
  weddingLawns: number;
  vendors: number;
  bookings: number;
  enquiries: number;
  partnerRequests: number;
}

export default function AdminDashboardPage() {
  const [counts, setCounts] = useState<Counts | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Every count below comes from an API that already exists for its own
    // section (properties/vendors/bookings/leads/partners) - page size 1 is
    // enough since we only need each response's totalElements, not its content.
    async function loadCounts() {
      try {
        const [all, farmhouses, villas, weddingLawns, vendors, bookings, enquiries, partners] =
          await Promise.all([
            fetchProperties({ page: 0, size: 1 }),
            fetchProperties({ type: "FARMHOUSE", page: 0, size: 1 }),
            fetchProperties({ type: "VILLA", page: 0, size: 1 }),
            fetchProperties({ type: "WEDDING_LAWN", page: 0, size: 1 }),
            fetchVendors({ page: 0, size: 1 }),
            fetchBookings({ page: 0, size: 1 }),
            fetchLeads({ page: 0, size: 1 }),
            fetchPartners({ page: 0, size: 1 }),
          ]);

        setCounts({
          totalListings: all.totalElements,
          farmhouses: farmhouses.totalElements,
          villas: villas.totalElements,
          weddingLawns: weddingLawns.totalElements,
          vendors: vendors.totalElements,
          bookings: bookings.totalElements,
          enquiries: enquiries.totalElements,
          partnerRequests: partners.totalElements,
        });
      } catch {
        setError("Could not load dashboard counts. Please refresh.");
      }
    }
    loadCounts();
  }, []);

  return (
    <>
      <AdminHeader title="Dashboard" />

      <main className="p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-sm text-gray-500">Welcome back! Here&apos;s what&apos;s happening on your platform.</p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Listings"
            value={counts?.totalListings ?? 0}
            loading={!counts}
            icon={LayoutGrid}
            accent="bg-violet-100 text-violet-600"
          />
          <StatCard
            label="Total Farmhouses"
            value={counts?.farmhouses ?? 0}
            loading={!counts}
            icon={Home}
            accent="bg-orange-100 text-orange-600"
          />
          <StatCard
            label="Total Villas"
            value={counts?.villas ?? 0}
            loading={!counts}
            icon={Castle}
            accent="bg-pink-100 text-pink-600"
          />
          <StatCard
            label="Total Wedding Lawns"
            value={counts?.weddingLawns ?? 0}
            loading={!counts}
            icon={Flower2}
            accent="bg-green-100 text-green-600"
          />
          <StatCard
            label="Total Vendors"
            value={counts?.vendors ?? 0}
            loading={!counts}
            icon={UserCircle2}
            accent="bg-blue-100 text-blue-600"
          />
          <StatCard
            label="Total Bookings"
            value={counts?.bookings ?? 0}
            loading={!counts}
            icon={CalendarDays}
            accent="bg-indigo-100 text-indigo-600"
          />
          <StatCard
            label="Total Enquiries"
            value={counts?.enquiries ?? 0}
            loading={!counts}
            icon={MessageSquare}
            accent="bg-yellow-100 text-yellow-600"
          />
          <StatCard
            label="Partner Requests"
            value={counts?.partnerRequests ?? 0}
            loading={!counts}
            icon={Handshake}
            accent="bg-rose-100 text-rose-600"
          />
        </div>

        <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-base font-bold text-gray-900">Quick Actions</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/admin/farmhouses?new=1"
              className="flex items-center gap-2 rounded-xl border border-violet-100 bg-violet-50 px-4 py-3 text-sm font-semibold text-violet-700 hover:bg-violet-100"
            >
              <Plus size={16} /> Add Farmhouse
            </Link>
            <Link
              href="/admin/villas?new=1"
              className="flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-100"
            >
              <Plus size={16} /> Add Villa
            </Link>
            <Link
              href="/admin/wedding-lawns?new=1"
              className="flex items-center gap-2 rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700 hover:bg-green-100"
            >
              <Plus size={16} /> Add Wedding Lawn
            </Link>
            <Link
              href="/admin/vendors?new=1"
              className="flex items-center gap-2 rounded-xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-700 hover:bg-orange-100"
            >
              <Plus size={16} /> Add Vendor
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
