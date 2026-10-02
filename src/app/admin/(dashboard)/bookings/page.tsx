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
  const header = ["Booking ID", "Customer", "Listing Type", "Date", "Amount", "Status", "Payment"];
  const rows = bookings.map((b) => [
    b.id,
    b.customerName,
    typeLabels[b.listingType],
    b.bookingDate,
    b.amount.toString(),
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

      <main className="p-8">
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

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                  <th className="px-6 py-3">Customer Name</th>
                  <th className="px-6 py-3">Listing Type</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Payment</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-400">Loading…</td></tr>
                ) : bookings.length === 0 ? (
                  <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-400">No bookings found.</td></tr>
                ) : (
                  bookings.map((booking) => (
                    <tr key={booking.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="px-6 py-3 font-medium text-gray-900">{booking.customerName}</td>
                      <td className="px-6 py-3 text-gray-600">{typeLabels[booking.listingType]}</td>
                      <td className="px-6 py-3 text-gray-600">{booking.bookingDate}</td>
                      <td className="px-6 py-3 text-gray-600">₹{booking.amount.toLocaleString("en-IN")}</td>
                      <td className="px-6 py-3"><StatusBadge status={booking.status} /></td>
                      <td className="px-6 py-3"><StatusBadge status={booking.paymentStatus} /></td>
                      <td className="px-6 py-3">
                        <button
                          type="button"
                          onClick={() => { setEditing(booking); setFormOpen(true); }}
                          className="rounded-lg border border-gray-200 p-1.5 text-violet-600 hover:bg-violet-50"
                          aria-label="Edit"
                        >
                          <Pencil size={15} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
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
