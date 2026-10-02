"use client";

import { useCallback, useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import Pagination from "@/components/admin/Pagination";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { fetchPartners, deletePartner, AdminApiError } from "@/lib/admin-api";
import type { AdminPartner } from "@/types/admin";

export default function PartnersPage() {
  const [partners, setPartners] = useState<AdminPartner[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminPartner | null>(null);
  const [deleting, setDeleting] = useState(false);

  const pageSize = 10;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchPartners({ page, size: pageSize });
      setPartners(result.content);
      setTotalPages(result.totalPages);
      setTotalElements(result.totalElements);
    } catch (err) {
      setError(err instanceof AdminApiError ? err.message : "Could not load partner requests.");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deletePartner(deleteTarget.id);
      setDeleteTarget(null);
      await load();
    } catch (err) {
      setError(err instanceof AdminApiError ? err.message : "Could not delete this request.");
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <AdminHeader title="Partner Requests" />

      <main className="p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Partner Requests</h2>
          <p className="text-sm text-gray-500">Business enquiries from people wanting to list with us</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
          {error && (
            <div className="m-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                  <th className="px-6 py-3">Business Name</th>
                  <th className="px-6 py-3">Full Name</th>
                  <th className="px-6 py-3">Business Type</th>
                  <th className="px-6 py-3">City</th>
                  <th className="px-6 py-3">Location</th>
                  <th className="px-6 py-3">Phone</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={9} className="px-6 py-8 text-center text-gray-400">Loading…</td></tr>
                ) : partners.length === 0 ? (
                  <tr><td colSpan={9} className="px-6 py-8 text-center text-gray-400">No partner requests yet.</td></tr>
                ) : (
                  partners.map((partner) => (
                    <tr key={partner.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="px-6 py-3 font-medium text-gray-900">{partner.businessName}</td>
                      <td className="px-6 py-3 text-gray-600">{partner.fullName}</td>
                      <td className="px-6 py-3 text-gray-600">{partner.businessType}</td>
                      <td className="px-6 py-3 text-gray-600">{partner.city}</td>
                      <td className="max-w-[180px] truncate px-6 py-3 text-gray-600">{partner.location}</td>
                      <td className="px-6 py-3 text-gray-600">{partner.phoneNumber}</td>
                      <td className="px-6 py-3"><StatusBadge status={partner.status} /></td>
                      <td className="px-6 py-3 text-gray-600">{new Date(partner.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-3">
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(partner)}
                          className="rounded-lg border border-gray-200 p-1.5 text-red-500 hover:bg-red-50"
                          aria-label="Delete"
                        >
                          <Trash2 size={15} />
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

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Partner Request?"
        message={`Are you sure you want to delete the request from "${deleteTarget?.businessName}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </>
  );
}
