"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit3, Plus, Trash2 } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import Pagination from "@/components/admin/Pagination";
import StatusBadge from "@/components/admin/StatusBadge";
import {
  AdminApiError,
  deleteAdminBlogPost,
  fetchAdminBlogPosts,
  updateAdminBlogPostStatus,
} from "@/lib/admin-api";
import type { AdminBlogPostSummary, BlogPostStatus, PageResponse } from "@/types/admin";

const PAGE_SIZE = 10;

export default function AdminBlogPage() {
  const router = useRouter();
  const [result, setResult] = useState<PageResponse<AdminBlogPostSummary> | null>(null);
  const [page, setPage] = useState(0);
  const [status, setStatus] = useState<BlogPostStatus | "">("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminBlogPostSummary | null>(null);
  const [editingStatusPostId, setEditingStatusPostId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setResult(await fetchAdminBlogPosts({ page, size: PAGE_SIZE, status: status || undefined }));
    } catch (loadError) {
      setError(loadError instanceof AdminApiError ? loadError.message : "Could not load blog posts.");
    } finally {
      setLoading(false);
    }
  }, [page, status]);

  useEffect(() => {
    // Reload when the status filter or page changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const changeStatus = async (post: AdminBlogPostSummary, nextStatus: BlogPostStatus) => {
    setActionLoading(true);
    setError(null);
    try {
      await updateAdminBlogPostStatus(post.id, nextStatus);
      await load();
    } catch (statusError) {
      setError(statusError instanceof AdminApiError ? statusError.message : "Could not update this post status.");
    } finally {
      setActionLoading(false);
    }
  };

  const removePost = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    setError(null);
    try {
      await deleteAdminBlogPost(deleteTarget.id);
      setDeleteTarget(null);
      if (result && result.content.length === 1 && page > 0) {
        setPage((current) => current - 1);
      } else {
        await load();
      }
    } catch (deleteError) {
      setError(deleteError instanceof AdminApiError ? deleteError.message : "Could not delete this post.");
      setDeleteTarget(null);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <AdminHeader title="Blog" />
      <main className="p-8">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Blog</h2>
            <p className="text-sm text-gray-500">Create, update, publish and archive blog posts.</p>
          </div>
          <Link href="/admin/blog/new" className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700"><Plus size={16} /> New post</Link>
        </div>

        {error && <div role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

        <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-6 py-4">
            <h3 className="font-bold text-gray-900">Blog posts</h3>
            <label className="text-sm text-gray-600">
              Status
              <select value={status} onChange={(event) => { setPage(0); setStatus(event.target.value as BlogPostStatus | ""); }} className="ml-2 rounded-lg border border-gray-200 px-3 py-2 outline-none focus:border-violet-500">
                <option value="">All statuses</option>
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </label>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                  <th className="px-6 py-3">Title</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Published</th>
                  <th className="px-6 py-3">Author</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-400">Loading blog posts…</td></tr>
                ) : !result?.content.length ? (
                  <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-400">No blog posts found.</td></tr>
                ) : result.content.map((post) => (
                  <tr key={post.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-6 py-3">
                      <Link href={`/admin/blog/${encodeURIComponent(post.id)}`} className="font-semibold text-gray-900 hover:text-violet-700">{post.title}</Link>
                      {post.excerpt && <p className="mt-1 max-w-xl truncate text-xs text-gray-500">{post.excerpt}</p>}
                    </td>
                    <td className="px-6 py-3">
                      {editingStatusPostId === post.id ? (
                        <select
                          aria-label={`Change status for ${post.title}`}
                          value={post.status}
                          autoFocus
                          disabled={actionLoading}
                          onBlur={() => setEditingStatusPostId(null)}
                          onKeyDown={(event) => {
                            if (event.key === "Escape") setEditingStatusPostId(null);
                          }}
                          onChange={(event) => {
                            const nextStatus = event.target.value as BlogPostStatus;
                            setEditingStatusPostId(null);
                            if (nextStatus !== post.status) void changeStatus(post, nextStatus);
                          }}
                          className={`inline-flex rounded-full border-0 px-3 py-1 text-xs font-semibold outline-none ring-1 ring-inset focus:ring-2 disabled:opacity-50 ${
                            post.status === "PUBLISHED"
                              ? "bg-green-100 text-green-700 ring-green-200 focus:ring-green-400"
                              : post.status === "ARCHIVED"
                                ? "bg-orange-100 text-orange-700 ring-orange-200 focus:ring-orange-400"
                                : "bg-gray-100 text-gray-600 ring-gray-200 focus:ring-gray-400"
                          }`}
                        >
                          <option value="DRAFT">Draft</option>
                          <option value="PUBLISHED">Published</option>
                          <option value="ARCHIVED">Archived</option>
                        </select>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setEditingStatusPostId(post.id)}
                          disabled={actionLoading}
                          aria-label={`Edit status for ${post.title}`}
                          className="rounded-full outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 disabled:opacity-50"
                        >
                          <StatusBadge status={post.status} />
                        </button>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 text-gray-600">{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "—"}</td>
                    <td className="px-6 py-3 text-gray-600">{post.authorName}</td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => router.push(`/admin/blog/${encodeURIComponent(post.id)}`)} disabled={actionLoading} aria-label={`Edit ${post.title}`} className="rounded-lg border border-gray-200 p-1.5 text-violet-700 hover:bg-violet-50 disabled:opacity-50"><Edit3 size={15} /></button>
                        <button type="button" onClick={() => setDeleteTarget(post)} disabled={actionLoading} aria-label={`Delete ${post.title}`} className="rounded-lg border border-gray-200 p-1.5 text-red-500 hover:bg-red-50 disabled:opacity-50"><Trash2 size={15} /></button>
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
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Blog Post?"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This cannot be undone.`}
        onConfirm={removePost}
        onCancel={() => setDeleteTarget(null)}
        loading={deleteLoading}
      />
    </>
  );
}
