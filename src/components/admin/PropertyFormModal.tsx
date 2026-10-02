"use client";

import { useEffect, useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { fetchAmenities, AdminApiError } from "@/lib/admin-api";
import type {
  AdminAmenity,
  AdminProperty,
  AdminPropertyPayload,
  ListingStatus,
  PropertyType,
} from "@/types/admin";

interface PropertyFormModalProps {
  open: boolean;
  propertyType: PropertyType;
  typeLabel: string;
  initial: AdminProperty | null; // null = create mode
  onClose: () => void;
  onSubmit: (payload: AdminPropertyPayload) => Promise<void>;
}

export default function PropertyFormModal({
  open,
  propertyType,
  typeLabel,
  initial,
  onClose,
  onSubmit,
}: PropertyFormModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [startingPrice, setStartingPrice] = useState("");
  const [endingPrice, setEndingPrice] = useState("");
  const [capacity, setCapacity] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [status, setStatus] = useState<ListingStatus>("ACTIVE");
  const [amenityIds, setAmenityIds] = useState<string[]>([]);
  const [imageUrlsText, setImageUrlsText] = useState("");

  const [amenities, setAmenities] = useState<AdminAmenity[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    fetchAmenities().then(setAmenities).catch(() => setAmenities([]));
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (initial) {
      setTitle(initial.title);
      setDescription(initial.description ?? "");
      setAddress(initial.address ?? "");
      setCity(initial.city);
      setLatitude(initial.latitude?.toString() ?? "");
      setLongitude(initial.longitude?.toString() ?? "");
      setStartingPrice(initial.startingPrice?.toString() ?? "");
      setEndingPrice(initial.endingPrice?.toString() ?? "");
      setCapacity(initial.capacity?.toString() ?? "");
      setContactPhone(initial.contactPhone);
      setStatus(initial.status);
      setImageUrlsText(initial.images.map((img) => img.url).join("\n"));
      // Map amenity names back to ids using the loaded amenity list once available.
    } else {
      setTitle("");
      setDescription("");
      setAddress("");
      setCity("");
      setLatitude("");
      setLongitude("");
      setStartingPrice("");
      setEndingPrice("");
      setCapacity("");
      setContactPhone("");
      setStatus("ACTIVE");
      setAmenityIds([]);
      setImageUrlsText("");
    }
    setError(null);
  }, [open, initial]);

  // Amenities arrive as names on AdminProperty but as ids in the form - reconcile once both are loaded.
  useEffect(() => {
    if (initial && amenities.length > 0) {
      const matchedIds = amenities
        .filter((a) => initial.amenities.includes(a.name))
        .map((a) => a.id);
      setAmenityIds(matchedIds);
    }
  }, [initial, amenities]);

  if (!open) return null;

  const toggleAmenity = (id: string) => {
    setAmenityIds((current) =>
      current.includes(id) ? current.filter((a) => a !== id) : [...current, id]
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSaving(true);

    const imageUrls = imageUrlsText
      .split("\n")
      .map((url) => url.trim())
      .filter(Boolean);

    const payload: AdminPropertyPayload = {
      title: title.trim(),
      description: description.trim() || undefined,
      type: propertyType,
      address: address.trim() || undefined,
      city: city.trim(),
      latitude: latitude.trim() ? Number(latitude) : null,
      longitude: longitude.trim() ? Number(longitude) : null,
      startingPrice: startingPrice.trim() ? Number(startingPrice) : null,
      endingPrice: endingPrice.trim() ? Number(endingPrice) : null,
      capacity: capacity.trim() ? Number(capacity) : null,
      contactPhone: contactPhone.trim(),
      status,
      amenityIds,
      imageUrls,
    };

    try {
      await onSubmit(payload);
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
          <h3 className="text-lg font-bold text-gray-900">
            {initial ? `Edit ${typeLabel}` : `Add ${typeLabel}`}
          </h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">Title *</label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-500"
              placeholder={`e.g. Green Valley ${typeLabel}`}
            />
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
              <label className="mb-1 block text-sm font-semibold text-gray-700">City *</label>
              <input
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Address</label>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Latitude</label>
              <input
                type="number"
                step="any"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="28.6139"
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Longitude</label>
              <input
                type="number"
                step="any"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="77.2090"
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Starting Price (₹)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={startingPrice}
                onChange={(e) => setStartingPrice(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Ending Price (₹)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={endingPrice}
                onChange={(e) => setEndingPrice(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Capacity</label>
              <input
                type="number"
                min="1"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">Contact Phone *</label>
            <input
              required
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-500"
            />
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

          {amenities.length > 0 && (
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">Amenities</label>
              <div className="flex flex-wrap gap-2">
                {amenities.map((amenity) => (
                  <button
                    type="button"
                    key={amenity.id}
                    onClick={() => toggleAmenity(amenity.id)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                      amenityIds.includes(amenity.id)
                        ? "border-violet-500 bg-violet-50 text-violet-700"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {amenity.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">
              Image URLs <span className="font-normal text-gray-400">(one per line)</span>
            </label>
            <textarea
              value={imageUrlsText}
              onChange={(e) => setImageUrlsText(e.target.value)}
              rows={3}
              placeholder={"https://example.com/photo1.jpg\nhttps://example.com/photo2.jpg"}
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
              {saving ? "Saving…" : initial ? "Save Changes" : "Add " + typeLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
