"use client";

import { useEffect, useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { AdminApiError } from "@/lib/admin-api";
import type { AdminVendor, AdminVendorPayload, ListingStatus, VendorCategory } from "@/types/admin";

interface VendorFormModalProps {
  open: boolean;
  initial: AdminVendor | null;
  onClose: () => void;
  onSubmit: (payload: AdminVendorPayload) => Promise<void>;
}

const categories: { value: VendorCategory; label: string }[] = [
  { value: "CATERER", label: "Caterer" },
  { value: "DECORATOR", label: "Decorator" },
  { value: "PHOTOGRAPHER", label: "Photographer" },
  { value: "MAKEUP_ARTIST", label: "Makeup Artist" },
  { value: "DJ", label: "DJ" },
  { value: "OTHER", label: "Other" },
];

export default function VendorFormModal({ open, initial, onClose, onSubmit }: VendorFormModalProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<VendorCategory>("CATERER");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [status, setStatus] = useState<ListingStatus>("ACTIVE");
  const [imageUrlsText, setImageUrlsText] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (initial) {
      setName(initial.name);
      setCategory(initial.category);
      setDescription(initial.description ?? "");
      setCity(initial.city);
      setPriceRange(initial.priceRange ?? "");
      setContactPhone(initial.contactPhone);
      setStatus(initial.status);
      setImageUrlsText(initial.images.map((img) => img.url).join("\n"));
    } else {
      setName("");
      setCategory("CATERER");
      setDescription("");
      setCity("");
      setPriceRange("");
      setContactPhone("");
      setStatus("ACTIVE");
      setImageUrlsText("");
    }
    setError(null);
  }, [open, initial]);

  if (!open) return null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSaving(true);

    const imageUrls = imageUrlsText.split("\n").map((u) => u.trim()).filter(Boolean);

    try {
      await onSubmit({
        name: name.trim(),
        category,
        description: description.trim() || undefined,
        city: city.trim(),
        priceRange: priceRange.trim() || undefined,
        contactPhone: contactPhone.trim(),
        status,
        imageUrls,
      });
    } catch (err) {
      setError(err instanceof AdminApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
          <h3 className="text-lg font-bold text-gray-900">{initial ? "Edit Vendor" : "Add Vendor"}</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">Name *</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as VendorCategory)}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-500"
              >
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">City *</label>
              <input
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Price Range</label>
              <input
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                placeholder="₹20,000 - ₹50,000"
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Contact Phone *</label>
              <input
                required
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ListingStatus)}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-500"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">
              Image URLs <span className="font-normal text-gray-400">(one per line)</span>
            </label>
            <textarea
              value={imageUrlsText}
              onChange={(e) => setImageUrlsText(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-500"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
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
              {saving ? "Saving…" : initial ? "Save Changes" : "Add Vendor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
