"use client";

import { useEffect, useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { AdminApiError, fetchProperties, fetchVendors } from "@/lib/admin-api";
import type { AdminProperty, AdminReview, AdminReviewPayload, AdminVendor } from "@/types/admin";

interface ReviewFormModalProps {
  open: boolean;
  initial: AdminReview | null;
  onClose: () => void;
  onSubmit: (payload: AdminReviewPayload) => Promise<void>;
}

type ReviewTargetKind = "property" | "vendor";

interface ReviewTarget {
  id: string;
  label: string;
}

function mapProperty(property: AdminProperty): ReviewTarget {
  return { id: property.id, label: `${property.title} · ${property.city}` };
}

function mapVendor(vendor: AdminVendor): ReviewTarget {
  return { id: vendor.id, label: `${vendor.name} · ${vendor.city}` };
}

export default function ReviewFormModal(props: ReviewFormModalProps) {
  if (!props.open) return null;

  return (
    <ReviewFormModalContent
      key={props.initial?.id ?? "new-review"}
      {...props}
    />
  );
}

function ReviewFormModalContent({
  initial,
  onClose,
  onSubmit,
}: ReviewFormModalProps) {
  const initialTargetKind: ReviewTargetKind = initial?.vendorId
    ? "vendor"
    : "property";
  const initialTargetId = initial?.vendorId ?? initial?.propertyId ?? "";
  const initialTargetLabel = initial?.vendorId
    ? initial.vendorName ?? initial.vendorId
    : initial?.propertyTitle ?? initialTargetId;

  const [reviewerName, setReviewerName] = useState(
    () => initial?.reviewerName ?? "",
  );
  const [rating, setRating] = useState(
    () => String(initial?.rating ?? 5),
  );
  const [targetKind, setTargetKind] = useState<ReviewTargetKind>(
    initialTargetKind,
  );
  const [targetQuery, setTargetQuery] = useState(initialTargetLabel);
  const [selectedTarget, setSelectedTarget] = useState<ReviewTarget | null>(
    () =>
      initialTargetId
        ? { id: initialTargetId, label: initialTargetLabel }
        : null,
  );
  const [targetOptions, setTargetOptions] = useState<ReviewTarget[]>([]);
  const [targetMenuOpen, setTargetMenuOpen] = useState(false);
  const [targetLoading, setTargetLoading] = useState(false);
  const [targetError, setTargetError] = useState<string | null>(null);
  const [comment, setComment] = useState(() => initial?.comment ?? "");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const timer = window.setTimeout(async () => {
      setTargetLoading(true);
      setTargetError(null);
      try {
        if (targetKind === "property") {
          const result = await fetchProperties({
            keyword: targetQuery.trim() || undefined,
            page: 0,
            size: 10,
          });
          if (!cancelled) setTargetOptions(result.content.map(mapProperty));
        } else {
          const result = await fetchVendors({
            keyword: targetQuery.trim() || undefined,
            page: 0,
            size: 10,
          });
          if (!cancelled) setTargetOptions(result.content.map(mapVendor));
        }
      } catch (loadError) {
        if (!cancelled) {
          setTargetError(
            loadError instanceof Error ? loadError.message : "Could not load review targets.",
          );
        }
      } finally {
        if (!cancelled) setTargetLoading(false);
      }
    }, 250);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [targetKind, targetQuery]);


  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setFieldErrors({});
    if (!selectedTarget) {
      setError(`Choose a ${targetKind} from the search results.`);
      return;
    }
    setSaving(true);
    try {
      await onSubmit({
        reviewerName: reviewerName.trim(),
        rating: Number(rating),
        propertyId: targetKind === "property" ? selectedTarget.id : undefined,
        vendorId: targetKind === "vendor" ? selectedTarget.id : undefined,
        comment: comment.trim() || undefined,
      });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Could not save this review.");
      if (submitError instanceof AdminApiError) {
        setFieldErrors(submitError.fieldErrors ?? {});
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
          <h3 className="text-lg font-bold text-gray-900">{initial ? "Edit Review" : "Add Review"}</h3>
          <button type="button" onClick={onClose} disabled={saving} aria-label="Close" className="text-gray-400 hover:text-gray-700 disabled:opacity-50"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700" htmlFor="reviewerName">Reviewer name *</label>
            <input id="reviewerName" required value={reviewerName} onChange={(event) => setReviewerName(event.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-500" />
            {fieldErrors.reviewerName && <p className="mt-1 text-sm text-red-600">{fieldErrors.reviewerName}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700" htmlFor="reviewRating">Rating *</label>
            <select id="reviewRating" required value={rating} onChange={(event) => setRating(event.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-500">
              {[5, 4, 3, 2, 1].map((value) => <option key={value} value={value}>{value} {value === 1 ? "star" : "stars"}</option>)}
            </select>
            {fieldErrors.rating && <p className="mt-1 text-sm text-red-600">{fieldErrors.rating}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700" htmlFor="reviewTargetKind">Review target *</label>
            <select id="reviewTargetKind" value={targetKind} onChange={(event) => {
              setTargetKind(event.target.value as ReviewTargetKind);
              setSelectedTarget(null);
              setTargetQuery("");
              setTargetOptions([]);
              setTargetMenuOpen(false);
            }} className="mb-2 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-500">
              <option value="property">Property</option>
              <option value="vendor">Vendor</option>
            </select>
            <div className="relative">
              <input
                value={targetQuery}
                onFocus={() => setTargetMenuOpen(true)}
                onChange={(event) => {
                  setTargetQuery(event.target.value);
                  setSelectedTarget(null);
                  setTargetOptions([]);
                  setTargetMenuOpen(true);
                }}
                placeholder={`Choose or search ${targetKind} by name…`}
                aria-label={`Choose or search ${targetKind} by name`}
                aria-expanded={targetMenuOpen && !selectedTarget}
                aria-controls="review-target-options"
                role="combobox"
                aria-autocomplete="list"
                required={!selectedTarget}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-500"
              />
              {targetMenuOpen && !selectedTarget && (
                <ul
                  id="review-target-options"
                  role="listbox"
                  className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white py-1 shadow-lg"
                >
                  {targetLoading ? (
                    <li className="px-4 py-2.5 text-sm text-gray-400">Loading…</li>
                  ) : targetOptions.length ? (
                    targetOptions.map((target) => (
                      <li key={target.id} role="option" aria-selected={false}>
                        <button
                          type="button"
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => {
                            setSelectedTarget(target);
                            setTargetQuery(target.label);
                            setTargetMenuOpen(false);
                          }}
                          className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-violet-50"
                        >
                          {target.label}
                        </button>
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-2.5 text-sm text-gray-400">
                      {targetQuery.trim() ? `No ${targetKind}s found.` : `No ${targetKind}s available.`}
                    </li>
                  )}
                </ul>
              )}
            </div>
            {targetError && <p role="alert" className="mt-1 text-sm text-red-600">{targetError}</p>}
            {fieldErrors.propertyId && <p className="mt-1 text-sm text-red-600">{fieldErrors.propertyId}</p>}
            {fieldErrors.vendorId && <p className="mt-1 text-sm text-red-600">{fieldErrors.vendorId}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700" htmlFor="reviewComment">Comment</label>
            <textarea id="reviewComment" rows={4} value={comment} onChange={(event) => setComment(event.target.value)} className="w-full resize-y rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-500" />
            {fieldErrors.comment && <p className="mt-1 text-sm text-red-600">{fieldErrors.comment}</p>}
          </div>
          {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}
          {Object.entries(fieldErrors).filter(([key]) => !["reviewerName", "rating", "propertyId", "vendorId", "comment"].includes(key)).map(([key, message]) => (
            <p key={key} className="text-sm text-red-600">{key}: {message}</p>
          ))}
          <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
            <button type="button" onClick={onClose} disabled={saving} className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={saving || targetLoading} className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60">{saving ? "Saving…" : initial ? "Save Changes" : "Add Review"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

