"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Edit3, Star, Trash2 } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import Pagination from "@/components/admin/Pagination";
import ReviewFormModal from "@/components/admin/ReviewFormModal";
import {
  AdminApiError,
  createReview,
  deleteReview,
  fetchReviews,
  updateReview,
} from "@/lib/admin-api";
import type { AdminReview, AdminReviewPayload, PageResponse } from "@/types/admin";

const PAGE_SIZE = 10;

export default function ReviewsPage() {
  const [result, setResult] = useState<PageResponse<AdminReview> | null>(null);
  const [page, setPage] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<AdminReview | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminReview | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setResult(await fetchReviews({ keyword: keyword || undefined, page, size: PAGE_SIZE }));
    } catch (loadError) {
      setError(loadError instanceof AdminApiError ? loadError.message : "Could not load reviews.");
    } finally {
      setLoading(false);
    }
  }, [keyword, page]);

  useEffect(() => {
    // Reload the API-backed review page when its search or page changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const handleSave = async (payload: AdminReviewPayload) => {
    setSaving(true);
    setError(null);
    try {
      if (editTarget) {
        await updateReview(editTarget.id, payload);
        setSuccess("Review updated.");
      } else {
        await createReview(payload);
        setSuccess("Review created.");
      }
      setFormOpen(false);
      setEditTarget(null);
      await load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setError(null);
    try {
      await deleteReview(deleteTarget.id);
      setDeleteTarget(null);
      setSuccess("Review deleted.");
      if (result && result.content.length === 1 && page > 0) {
        setPage((current) => current - 1);
      } else {
        await load();
      }
    } catch (deleteError) {
      setError(deleteError instanceof AdminApiError ? deleteError.message : "Could not delete this review.");
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPage(0);
    setKeyword(searchInput.trim());
    setSuccess(null);
  };

  return (
    <>
      <AdminHeader title="Reviews" />
      <main className="p-8">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
            <p className="text-sm text-gray-500">Search, create, edit and delete property or vendor reviews.</p>
          </div>
          <button type="button" onClick={() => { setEditTarget(null); setFormOpen(true); }} className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700">Add Review</button>
        </div>

        {error && <div role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}
        {success && <div role="status" className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{success}</div>}

        <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <form onSubmit={submitSearch} className="flex flex-wrap items-end gap-3 border-b border-gray-100 px-5 py-4">
            <label className="min-w-64 flex-1 text-sm font-medium text-gray-700">
              Search reviews
              <input value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder="Reviewer, comment, property or vendor…" className="mt-1 block w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-violet-500" />
            </label>
            <button type="submit" className="rounded-xl border border-violet-200 px-4 py-2.5 text-sm font-semibold text-violet-700 hover:bg-violet-50">Search</button>
            {keyword && <button type="button" onClick={() => { setSearchInput(""); setKeyword(""); setPage(0); }} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50">Clear</button>}
          </form>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                  <th className="px-5 py-3">Reviewer</th>
                  <th className="px-5 py-3">Rating</th>
                  <th className="px-5 py-3">Comment</th>
                  <th className="px-5 py-3">Property / Vendor</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="px-5 py-10 text-center text-gray-400">Loading reviews…</td></tr>
                ) : !result?.content.length ? (
                  <tr><td colSpan={6} className="px-5 py-10 text-center text-gray-400">No reviews found.</td></tr>
                ) : result.content.map((review) => (
                  <tr key={review.id} className="border-b border-gray-50 align-top hover:bg-gray-50/50">
                    <td className="px-5 py-3 font-medium text-gray-900">{review.reviewerName}</td>
                    <td className="px-5 py-3"><span className="inline-flex items-center gap-1 font-semibold text-amber-600"><Star size={14} fill="currentColor" />{review.rating}/5</span></td>
                    <td className="max-w-sm whitespace-pre-wrap px-5 py-3 text-gray-600">{review.comment || "—"}</td>
                    <td className="px-5 py-3 text-gray-600">
                      {review.propertyId && <div>{review.propertyTitle ?? "Property"} <span className="text-xs text-gray-400">({review.propertyId})</span></div>}
                      {review.vendorId && <div>{review.vendorName ?? "Vendor"} <span className="text-xs text-gray-400">({review.vendorId})</span></div>}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3 text-gray-500">{review.createdAt ? new Date(review.createdAt).toLocaleDateString() : "—"}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => { setEditTarget(review); setFormOpen(true); }} aria-label={`Edit review by ${review.reviewerName}`} className="rounded-lg border border-gray-200 p-1.5 text-violet-700 hover:bg-violet-50"><Edit3 size={15} /></button>
                        <button type="button" onClick={() => setDeleteTarget(review)} aria-label={`Delete review by ${review.reviewerName}`} className="rounded-lg border border-gray-200 p-1.5 text-red-500 hover:bg-red-50"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {result && !loading && (
            <Pagination pageNumber={result.pageNumber} totalPages={result.totalPages} totalElements={result.totalElements} pageSize={result.pageSize} onPageChange={setPage} />
          )}
        </section>
      </main>
      <ReviewFormModal
        open={formOpen}
        initial={editTarget}
        onClose={() => { setFormOpen(false); setEditTarget(null); }}
        onSubmit={handleSave}
      />
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Review?"
        message={`Are you sure you want to delete the review by "${deleteTarget?.reviewerName}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
      {saving && <span className="sr-only" role="status">Saving review…</span>}
    </>
  );
}
