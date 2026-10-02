"use client";

import { useCallback, useEffect, useState } from "react";
import { Eye } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import Pagination from "@/components/admin/Pagination";
import { fetchLeads, updateLeadStatus, AdminApiError } from "@/lib/admin-api";
import type { AdminLead, LeadStatus } from "@/types/admin";

const tabs: { label: string; value: LeadStatus | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "New", value: "NEW" },
  { label: "Replied", value: "CONTACTED" },
  { label: "Converted", value: "CONVERTED" },
  { label: "Closed", value: "CLOSED" },
];

export default function EnquiriesPage() {
  const [activeTab, setActiveTab] = useState<LeadStatus | "ALL">("ALL");
  const [leads, setLeads] = useState<AdminLead[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewing, setViewing] = useState<AdminLead | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const pageSize = 10;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchLeads({
        status: activeTab === "ALL" ? undefined : activeTab,
        page,
        size: pageSize,
      });
      setLeads(result.content);
      setTotalPages(result.totalPages);
      setTotalElements(result.totalElements);
    } catch (err) {
      setError(err instanceof AdminApiError ? err.message : "Could not load enquiries.");
    } finally {
      setLoading(false);
    }
  }, [activeTab, page]);

  useEffect(() => {
    load();
  }, [load]);

  const handleStatusChange = async (status: LeadStatus) => {
    if (!viewing) return;
    setUpdatingStatus(true);
    try {
      const updated = await updateLeadStatus(viewing.id, status);
      setViewing(updated);
      await load();
    } catch (err) {
      setError(err instanceof AdminApiError ? err.message : "Could not update status.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <>
      <AdminHeader title="Enquiries" />

      <main className="p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Enquiries</h2>
          <p className="text-sm text-gray-500">Manage customer enquiries and leads</p>
        </div>

        <div className="mb-4 inline-flex rounded-xl border border-gray-100 bg-white p-1 shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => {
                setPage(0);
                setActiveTab(tab.value);
              }}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.value
                  ? "bg-violet-600 text-white"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
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
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Phone</th>
                  <th className="px-6 py-3">Listing</th>
                  <th className="px-6 py-3">Message</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-400">Loading…</td></tr>
                ) : leads.length === 0 ? (
                  <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-400">No enquiries found.</td></tr>
                ) : (
                  leads.map((lead) => (
                    <tr key={lead.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="px-6 py-3 font-medium text-gray-900">{lead.name}</td>
                      <td className="px-6 py-3 text-gray-600">{lead.phone}</td>
                      <td className="px-6 py-3 text-gray-600">{lead.propertyTitle ?? lead.vendorName ?? "—"}</td>
                      <td className="max-w-[220px] truncate px-6 py-3 text-gray-600">{lead.message ?? "—"}</td>
                      <td className="px-6 py-3 text-gray-600">{new Date(lead.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-3"><StatusBadge status={lead.status} /></td>
                      <td className="px-6 py-3">
                        <button
                          type="button"
                          onClick={() => setViewing(lead)}
                          className="rounded-lg border border-gray-200 p-1.5 text-gray-500 hover:bg-gray-50"
                          aria-label="View"
                        >
                          <Eye size={15} />
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

      {viewing && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Enquiry from {viewing.name}</h3>
              <button type="button" onClick={() => setViewing(null)} className="text-gray-400 hover:text-gray-700">✕</button>
            </div>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-gray-500">Phone</dt><dd>{viewing.phone}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Email</dt><dd>{viewing.email ?? "—"}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Listing</dt><dd>{viewing.propertyTitle ?? viewing.vendorName ?? "—"}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Event Type</dt><dd>{viewing.eventType ?? "—"}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Preferred Date</dt><dd>{viewing.preferredDate ?? "—"}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Received</dt><dd>{new Date(viewing.createdAt).toLocaleString()}</dd></div>
              {viewing.message && (
                <div className="pt-2">
                  <dt className="mb-1 text-gray-500">Message</dt>
                  <dd className="text-gray-700">{viewing.message}</dd>
                </div>
              )}
            </dl>

            <div className="mt-5 border-t border-gray-100 pt-4">
              <label className="mb-1.5 block text-sm font-semibold text-gray-700">Update Status</label>
              <select
                value={viewing.status}
                disabled={updatingStatus}
                onChange={(e) => handleStatusChange(e.target.value as LeadStatus)}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-500"
              >
                <option value="NEW">New</option>
                <option value="CONTACTED">Replied</option>
                <option value="CONVERTED">Converted</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
