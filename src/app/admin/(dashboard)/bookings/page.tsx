"use client";

import { useCallback, useEffect, useState } from "react";
import { Download, Pencil, Plus, Search } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import Pagination from "@/components/admin/Pagination";
import BookingFormModal from "@/components/admin/BookingFormModal";
import { fetchBookings, createBooking, updateBooking, AdminApiError } from "@/lib/admin-api";
import type {
  AdminBooking,
  AdminBookingPayload,
  BookingStatus,
  PaymentStatus,
  PropertyType,
} from "@/types/admin";

const typeLabels: Record<PropertyType, string> = {
  FARMHOUSE: "Farmhouse",
  VILLA: "Villa",
  WEDDING_LAWN: "Wedding Lawn",
};

function exportToCsv(bookings: AdminBooking[]) {
  const header = [
    "Booking ID",
    "Customer",
    "Property ID",
    "Listing Type",
    "Date",
    "Amount",
    "Advance Amount",
    "Commission Percentage",
    "Commission Amount",
    "Status",
    "Payment",
  ];
  const rows = bookings.map((b) => [
    b.id,
    b.customerName,
    b.propertyId ?? "",
    typeLabels[b.listingType],
    b.bookingDate,
    b.amount.toString(),
    (b.advanceAmount ?? 0).toString(),
    (b.commissionPercentage ?? 0).toString(),
    (b.commissionAmount ?? 0).toString(),
    b.status,
    b.paymentStatus,
  ]);
  const csv = [header, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "bookings.csv";
  link.click();
  URL.revokeObjectURL(url);
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [typeFilter, setTypeFilter] = useState<PropertyType | "">("");
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "">("");
  const [paymentFilter, setPaymentFilter] = useState<PaymentStatus | "">("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminBooking | null>(null);

  const pageSize = 10;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchBookings({
        keyword: keyword || undefined,
        listingType: typeFilter || undefined,
        status: statusFilter || undefined,
        paymentStatus: paymentFilter || undefined,
        page,
        size: pageSize,
      });
      setBookings(result.content);
      setTotalPages(result.totalPages);
      setTotalElements(result.totalElements);
    } catch (err) {
      setError(err instanceof AdminApiError ? err.message : "Could not load bookings.");
    } finally {
      setLoading(false);
    }
  }, [keyword, typeFilter, statusFilter, paymentFilter, page]);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreateOrUpdate = async (payload: AdminBookingPayload) => {
    if (editing) {
      await updateBooking(editing.id, payload);
    } else {
      await createBooking(payload);
    }
    setFormOpen(false);
    setEditing(null);
    await load();
  };

  return (
    <>
      <AdminHeader title="Bookings" />

      <main className="min-w-0 p-4 sm:p-6 lg:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Bookings</h2>
            <p className="text-sm text-gray-500">Manage all booking transactions</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
            className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700"
          >
            <Plus size={16} /> Add Booking
          </button>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex flex-wrap items-center gap-3 border-b border-gray-100 p-4">
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={keyword}
                onChange={(e) => { setPage(0); setKeyword(e.target.value); }}
                placeholder="Search bookings..."
                className="w-full rounded-xl border border-gray-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-violet-400"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => { setPage(0); setTypeFilter(e.target.value as PropertyType | ""); }}
              className="rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-violet-400"
            >
              <option value="">All Types</option>
              <option value="FARMHOUSE">Farmhouse</option>
              <option value="VILLA">Villa</option>
              <option value="WEDDING_LAWN">Wedding Lawn</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => { setPage(0); setStatusFilter(e.target.value as BookingStatus | ""); }}
              className="rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-violet-400"
            >
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="COMPLETED">Completed</option>
            </select>

            <select
              value={paymentFilter}
              onChange={(e) => { setPage(0); setPaymentFilter(e.target.value as PaymentStatus | ""); }}
              className="rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-violet-400"
            >
              <option value="">All Payment</option>
              <option value="UNPAID">Unpaid</option>
              <option value="PAID">Paid</option>
              <option value="REFUNDED">Refunded</option>
            </select>

            <button
              type="button"
              onClick={() => exportToCsv(bookings)}
              className="ml-auto flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"
            >
              <Download size={15} /> Export
            </button>
          </div>

          {error && (
            <div className="m-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="p-4 sm:p-5">
            {loading ? (
              <div className="py-10 text-center text-sm text-gray-400">Loading bookings…</div>
            ) : bookings.length === 0 ? (
              <div className="py-10 text-center text-sm text-gray-400">No bookings found.</div>
            ) : (
              <div className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-2">
                {bookings.map((booking) => (
                  <article
                    key={booking.id}
                    className="min-w-0 rounded-2xl border border-gray-100 bg-white p-4 transition hover:border-violet-100 hover:shadow-sm sm:p-5"
                  >
                    <div className="flex min-w-0 items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate font-semibold text-gray-900">{booking.customerName}</h3>
                        {booking.customerPhone && (
                          <p className="mt-0.5 text-sm text-gray-500">{booking.customerPhone}</p>
                        )}
                        <p className="mt-2 text-sm text-gray-600">
                          {typeLabels[booking.listingType]}
                          <span className="mx-2 text-gray-300">•</span>
                          {booking.bookingDate}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => { setEditing(booking); setFormOpen(true); }}
                        className="shrink-0 rounded-lg border border-gray-200 p-2 text-violet-600 hover:bg-violet-50"
                        aria-label={`Edit booking for ${booking.customerName}`}
                      >
                        <Pencil size={15} />
                      </button>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                      <div className="rounded-xl bg-gray-50 px-3 py-2.5">
                        <p className="text-xs text-gray-500">Total</p>
                        <p className="mt-1 truncate text-sm font-semibold text-gray-900">
                          ₹{booking.amount.toLocaleString("en-IN")}
                        </p>
                      </div>
                      <div className="rounded-xl bg-gray-50 px-3 py-2.5">
                        <p className="text-xs text-gray-500">Advance</p>
                        <p className="mt-1 truncate text-sm font-semibold text-gray-900">
                          ₹{(booking.advanceAmount ?? 0).toLocaleString("en-IN")}
                        </p>
                      </div>
                      <div className="col-span-2 rounded-xl bg-violet-50 px-3 py-2.5 sm:col-span-1">
                        <p className="text-xs text-violet-700">Commission</p>
                        <p className="mt-1 truncate text-sm font-semibold text-violet-900">
                          ₹{(booking.commissionAmount ?? 0).toLocaleString("en-IN")}
                          <span className="ml-1 text-xs font-medium text-violet-700">
                            ({(booking.commissionPercentage ?? 0).toLocaleString("en-IN")}%)
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex min-w-0 flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-3">
                      <p className="min-w-0 max-w-full truncate text-xs text-gray-500" title={booking.propertyId ?? undefined}>
                        Property ID: <span className="font-medium text-gray-700">{booking.propertyId ?? "—"}</span>
                      </p>
                      <div className="flex shrink-0 items-center gap-2">
                        <StatusBadge status={booking.status} />
                        <StatusBadge status={booking.paymentStatus} />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          <Pagination
            pageNumber={page}
            totalPages={totalPages}
            totalElements={totalElements}
            pageSize={pageSize}
            onPageChange={setPage}
          />
        </div>
      </main>

      <BookingFormModal
        open={formOpen}
        initial={editing}
        onClose={() => { setFormOpen(false); setEditing(null); }}
        onSubmit={handleCreateOrUpdate}
      />
    </>
  );
}
