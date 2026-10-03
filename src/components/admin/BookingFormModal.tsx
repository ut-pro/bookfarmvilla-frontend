"use client";

import { useEffect, useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { AdminApiError } from "@/lib/admin-api";
import type {
  AdminBooking,
  AdminBookingPayload,
  BookingStatus,
  PaymentStatus,
  PropertyType,
} from "@/types/admin";

interface BookingFormModalProps {
  open: boolean;
  initial: AdminBooking | null;
  onClose: () => void;
  onSubmit: (payload: AdminBookingPayload) => Promise<void>;
}

export default function BookingFormModal({ open, initial, onClose, onSubmit }: BookingFormModalProps) {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [propertyId, setPropertyId] = useState("");
  const [listingType, setListingType] = useState<PropertyType>("FARMHOUSE");
  const [bookingDate, setBookingDate] = useState("");
  const [amount, setAmount] = useState("");
  const [advanceAmount, setAdvanceAmount] = useState("");
  const [commissionPercentage, setCommissionPercentage] = useState("");
  const [commissionAmount, setCommissionAmount] = useState("");
  const [status, setStatus] = useState<BookingStatus>("PENDING");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("UNPAID");

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (initial) {
      setCustomerName(initial.customerName);
      setCustomerPhone(initial.customerPhone ?? "");
      setPropertyId(initial.propertyId ?? "");
      setListingType(initial.listingType);
      setBookingDate(initial.bookingDate);
      setAmount(initial.amount.toString());
      setAdvanceAmount((initial.advanceAmount ?? 0).toString());
      setCommissionPercentage(
        (initial.commissionPercentage ?? 100).toString(),
      );
      setCommissionAmount(
        (initial.commissionAmount ??
          initial.amount * (initial.commissionPercentage ?? 100) / 100
        ).toString(),
      );
      setStatus(initial.status);
      setPaymentStatus(initial.paymentStatus);
    } else {
      setCustomerName("");
      setCustomerPhone("");
      setPropertyId("");
      setListingType("FARMHOUSE");
      setBookingDate("");
      setAmount("");
      setAdvanceAmount("");
      setCommissionPercentage("100");
      setCommissionAmount("");
      setStatus("PENDING");
      setPaymentStatus("UNPAID");
    }
    setError(null);
  }, [open, initial]);

  if (!open) return null;

  const calculateCommissionAmount = (total: string, percentage: string) => {
    const totalAmount = Number(total);
    const commissionRate = Number(percentage);
    if (!Number.isFinite(totalAmount) || !Number.isFinite(commissionRate)) {
      return "";
    }
    return ((totalAmount * commissionRate) / 100).toFixed(2);
  };

  const calculateCommissionPercentage = (total: string, value: string) => {
    const totalAmount = Number(total);
    const commission = Number(value);
    if (
      !Number.isFinite(totalAmount) ||
      totalAmount <= 0 ||
      !Number.isFinite(commission)
    ) {
      return totalAmount === 0 && commission === 0 ? "0" : "";
    }
    return ((commission / totalAmount) * 100).toFixed(2);
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
    setCommissionAmount(
      calculateCommissionAmount(value, commissionPercentage),
    );
  };

  const handleCommissionPercentageChange = (value: string) => {
    setCommissionPercentage(value);
    setCommissionAmount(calculateCommissionAmount(amount, value));
  };

  const handleCommissionAmountChange = (value: string) => {
    setCommissionAmount(value);
    setCommissionPercentage(calculateCommissionPercentage(amount, value));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSaving(true);

    try {
      await onSubmit({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim() || undefined,
        propertyId: propertyId.trim(),
        listingType,
        bookingDate,
        amount: Number(amount),
        advanceAmount: advanceAmount.trim() ? Number(advanceAmount) : 0,
        commissionPercentage: Number(commissionPercentage),
        commissionAmount: Number(commissionAmount),
        status,
        paymentStatus,
      });
    } catch (err) {
      setError(err instanceof AdminApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 p-3 sm:p-6">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-form-title"
        className="flex max-h-[calc(100dvh-1.5rem)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl sm:max-h-[calc(100dvh-3rem)]"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-gray-100 bg-white px-5 py-4 sm:px-7">
          <h3 id="booking-form-title" className="text-lg font-bold text-gray-900">{initial ? "Edit Booking" : "Add Booking"}</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="min-h-0 space-y-6 overflow-y-auto px-5 py-5 sm:px-7">
          <section className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900">Customer & property</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">Customer Name *</label>
                <input
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full min-w-0 rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">Customer Phone</label>
                <input
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full min-w-0 rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">Property ID *</label>
                <input
                  required
                  value={propertyId}
                  onChange={(e) => setPropertyId(e.target.value)}
                  className="w-full min-w-0 rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">Listing Type *</label>
                <select
                  value={listingType}
                  onChange={(e) => setListingType(e.target.value as PropertyType)}
                  className="w-full min-w-0 rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-500"
                >
                  <option value="FARMHOUSE">Farmhouse</option>
                  <option value="VILLA">Villa</option>
                  <option value="WEDDING_LAWN">Wedding Lawn</option>
                </select>
              </div>
            </div>
          </section>

          <section className="space-y-4 border-t border-gray-100 pt-5">
            <h4 className="text-sm font-semibold text-gray-900">Booking & payment</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">Booking Date *</label>
                <input
                  required
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full min-w-0 rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">Total Amount (₹) *</label>
                <input
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  className="w-full min-w-0 rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">Advance Amount (₹)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={advanceAmount}
                  onChange={(e) => setAdvanceAmount(e.target.value)}
                  className="w-full min-w-0 rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-500"
                />
              </div>
            </div>

            <div className="rounded-2xl bg-violet-50/70 p-4">
              <div className="mb-3">
                <h5 className="text-sm font-semibold text-gray-900">Commission</h5>
                <p className="mt-0.5 text-xs text-gray-500">Update either value; the other is calculated from the total.</p>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-700">Commission (%)</label>
                  <input
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    value={commissionPercentage}
                    onChange={(e) => handleCommissionPercentageChange(e.target.value)}
                    className="w-full min-w-0 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-700">Commission Amount (₹)</label>
                  <input
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    value={commissionAmount}
                    onChange={(e) => handleCommissionAmountChange(e.target.value)}
                    className="w-full min-w-0 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-violet-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as BookingStatus)}
                  className="w-full min-w-0 rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-500"
                >
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="CANCELLED">Cancelled</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">Payment</label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
                  className="w-full min-w-0 rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-500"
                >
                  <option value="UNPAID">Unpaid</option>
                  <option value="PAID">Paid</option>
                  <option value="REFUNDED">Refunded</option>
                </select>
              </div>
            </div>
          </section>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
            >
              {saving ? "Saving…" : initial ? "Save Changes" : "Add Booking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
