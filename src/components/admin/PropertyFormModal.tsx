"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  BedDouble,
  Check,
  ChevronDown,
  Dumbbell,
  Flame,
  Gamepad2,
  Plus,
  ShieldCheck,
  Sparkles,
  Trees,
  Utensils,
  Waves,
  Wifi,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { fetchAmenities, AdminApiError } from "@/lib/admin-api";
import type {
  AdminAmenity,
  AdminProperty,
  AdminPropertyPayload,
  ListingStatus,
  PropertyType,
} from "@/types/admin";

const commonAmenities: Array<{ name: string; icon: LucideIcon }> = [
  { name: "Swimming Pool", icon: Waves },
  { name: "Wi-Fi", icon: Wifi },
  { name: "Air Conditioning", icon: Sparkles },
  { name: "Parking", icon: ShieldCheck },
  { name: "Power Backup", icon: Zap },
  { name: "Kitchen", icon: Utensils },
  { name: "Dining Area", icon: Utensils },
  { name: "Garden", icon: Trees },
  { name: "Lawn", icon: Trees },
  { name: "Barbecue", icon: Flame },
  { name: "Bonfire", icon: Flame },
  { name: "Indoor Games", icon: Gamepad2 },
  { name: "Outdoor Games", icon: Dumbbell },
  { name: "Gym", icon: Dumbbell },
  { name: "Bedrooms", icon: BedDouble },
  { name: "Security", icon: ShieldCheck },
];

function getAmenityIcon(name: string): LucideIcon {
  const amenity = commonAmenities.find(
    (option) => option.name.toLowerCase() === name.toLowerCase(),
  );
  return amenity?.icon ?? Sparkles;
}

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
  const [selectedAmenityNames, setSelectedAmenityNames] = useState<string[]>([]);
  const [customAmenity, setCustomAmenity] = useState("");
  const [isAmenityDropdownOpen, setIsAmenityDropdownOpen] = useState(false);
  const [imageUrlsText, setImageUrlsText] = useState("");

  const [amenities, setAmenities] = useState<AdminAmenity[]>([]);
  const [amenityLoadError, setAmenityLoadError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    fetchAmenities()
      .then((loadedAmenities) => {
        setAmenities(loadedAmenities);
        setAmenityLoadError(null);
      })
      .catch((loadError: unknown) => {
        setAmenityLoadError(
          loadError instanceof Error
            ? loadError.message
            : "Could not load saved amenity options.",
        );
      });
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
      setSelectedAmenityNames(initial.amenities);
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
      setSelectedAmenityNames([]);
      setCustomAmenity("");
      setImageUrlsText("");
    }
    setError(null);
  }, [open, initial]);

  if (!open) return null;

  const availableAmenityNames = Array.from(
    new Set([
      ...commonAmenities.map((amenity) => amenity.name),
      ...amenities.map((amenity) => amenity.name),
    ]),
  );
  const toggleAmenity = (name: string) => {
    setSelectedAmenityNames((current) =>
      current.includes(name)
        ? current.filter((selectedName) => selectedName !== name)
        : [...current, name],
    );
  };

  const addCustomAmenity = () => {
    const name = customAmenity.trim();
    if (!name) return;

    const matchingAmenity = availableAmenityNames.find(
      (amenity) => amenity.toLowerCase() === name.toLowerCase(),
    );
    const normalizedName = matchingAmenity ?? name;
    setSelectedAmenityNames((current) =>
      current.some(
        (selectedName) =>
          selectedName.toLowerCase() === normalizedName.toLowerCase(),
      )
        ? current
        : [...current, normalizedName],
    );
    setCustomAmenity("");
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
      amenityIds: amenities
        .filter((amenity) => selectedAmenityNames.includes(amenity.name))
        .map((amenity) => amenity.id),
      amenities: selectedAmenityNames,
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

          <div>
            <label
              htmlFor="property-amenity-search"
              className="mb-1.5 block text-sm font-semibold text-gray-700"
            >
              Amenities
            </label>
            <div className="relative">
              <button
                type="button"
                aria-expanded={isAmenityDropdownOpen}
                aria-controls="property-amenity-options"
                onClick={() =>
                  setIsAmenityDropdownOpen((isOpen) => !isOpen)
                }
                className="flex w-full items-center justify-between rounded-xl border border-gray-200 px-4 py-3 text-left text-sm text-gray-600 outline-none transition-colors hover:border-violet-300 focus:border-violet-500"
              >
                <span>
                  {selectedAmenityNames.length
                    ? `${selectedAmenityNames.length} selected`
                    : "Select amenities"}
                </span>
                <ChevronDown
                  size={17}
                  className={`transition-transform ${isAmenityDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isAmenityDropdownOpen && (
                <div
                  id="property-amenity-options"
                  className="absolute inset-x-0 top-[calc(100%+0.5rem)] z-30 rounded-2xl border border-gray-200 bg-white p-4 shadow-2xl"
                >
                  <div className="max-h-48 space-y-1 overflow-y-auto">
                    {availableAmenityNames.map((name) => {
                      const Icon = getAmenityIcon(name);
                      const isSelected = selectedAmenityNames.includes(name);
                      return (
                        <button
                          key={name}
                          type="button"
                          onClick={() => toggleAmenity(name)}
                          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                            isSelected
                              ? "bg-violet-50 font-medium text-violet-700"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <span
                            className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${
                              isSelected
                                ? "bg-white text-violet-600"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            <Icon size={16} />
                          </span>
                          <span className="flex-1">{name}</span>
                          {isSelected && <Check size={16} />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-3 flex gap-2 border-t border-gray-100 pt-3">
                    <input
                      value={customAmenity}
                      onChange={(event) =>
                        setCustomAmenity(event.target.value)
                      }
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          addCustomAmenity();
                        }
                      }}
                      placeholder="Add a custom amenity"
                      className="min-w-0 flex-1 rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                    />
                    <button
                      type="button"
                      onClick={addCustomAmenity}
                      disabled={!customAmenity.trim()}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Plus size={15} />
                      Add
                    </button>
                  </div>
                </div>
              )}
            </div>

            {amenityLoadError && (
              <p className="mt-2 text-xs text-amber-700" role="status">
                Saved amenity options could not be loaded. Common and custom
                amenities are still available.
              </p>
            )}

            {selectedAmenityNames.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedAmenityNames.map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => toggleAmenity(name)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-700"
                    aria-label={`Remove ${name}`}
                  >
                    {name}
                    <X size={13} />
                  </button>
                ))}
              </div>
            )}
          </div>

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
