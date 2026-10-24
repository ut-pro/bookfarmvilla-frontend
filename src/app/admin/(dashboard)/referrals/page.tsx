"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Download, Eye, Users } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import Pagination from "@/components/admin/Pagination";
import AdminSortControls from "@/components/admin/AdminSortControls";
import { fetchLeads, updateLeadStatus, AdminApiError } from "@/lib/admin-api";
import type { AdminLead, LeadSortBy, LeadStatus, SortDirection } from "@/types/admin";

const tabs: { label: string; value: LeadStatus | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "New", value: "NEW" },
  { label: "Contacted", value: "CONTACTED" },
  { label: "Converted", value: "CONVERTED" },
  { label: "Closed", value: "CLOSED" },
];

function exportToCsv(leads: AdminLead[]) {
  const header = [
    "Referral ID",
    "Referrer Name",
    "Referrer Phone",
    "Referrer Email",
    "Friend's Name",
    "Friend's Phone",
    "Friend's Email",
    "Property Type",
    "Event Type",
    "Preferred Date",
    "Message",
    "Received",
    "Status",
  ];
  const rows = leads.map((lead) => [
    lead.id,
    lead.name,
    lead.phone,
    lead.email ?? "",
    lead.refereeName ?? "",
    lead.refereePhone ?? "",
    lead.refereeEmail ?? "",
    lead.propertyType ?? "",
    lead.eventType ?? "",
    lead.preferredDate ?? "",
    lead.message ?? "",
    lead.createdAt,
    lead.status,
  ]);
  const escapeCsvCell = (value: string) =>
    `"${value.replace(/"/g, '""')}"`;
  const csv = [header, ...rows]
    .map((row) => row.map(escapeCsvCell).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "referrals.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function ReferralsPageContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<LeadStatus | "ALL">("ALL");
  const [leads, setLeads] = useState<AdminLead[]>([]);
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState<{
    sortBy: LeadSortBy | "";
    sortDirection: SortDirection;
  }>({ sortBy: "", sortDirection: "asc" });
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewing, setViewing] = useState<AdminLead | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const globalSearch = searchParams.get("search") ?? "";

  const pageSize = 10;
  const searchPageSize = 100;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchLeads({
        status: activeTab === "ALL" ? undefined : activeTab,
        page: globalSearch ? 0 : page,
        size: globalSearch ? searchPageSize : pageSize,
        sortBy: sort.sortBy || undefined,
        sortDirection: sort.sortBy ? sort.sortDirection : undefined,
      });
      setLeads(result.content);
      setTotalPages(result.totalPages);
      setTotalElements(result.totalElements);
    } catch (err) {
      setError(err instanceof AdminApiError ? err.message : "Could not load referrals.");
    } finally {
      setLoading(false);
    }
  }, [activeTab, globalSearch, page, sort]);

  useEffect(() => {
    load();
  }, [load]);

  const visibleLeads = globalSearch
    ? leads.filter((lead) =>
        [
          lead.name,
          lead.phone,
          lead.email,
          lead.refereeName,
          lead.refereePhone,
          lead.refereeEmail,
          lead.propertyType,
          lead.eventType,
          lead.message,
          lead.status,
        ].some((value) => value?.toLowerCase().includes(globalSearch.toLowerCase())),
      )
    : leads;

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
      <AdminHeader title="Referrals" />

      <main className="p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Referral Leads</h2>
          <p className="text-sm text-gray-500">Manage and track referral submissions</p>
          {globalSearch && (
            <p className="mt-2 text-sm text-violet-700">
              Global search: <strong>{globalSearch}</strong> · latest 100 referrals
              <Link href="/admin/referrals" className="ml-2 underline">Clear</Link>
            </p>
          )}
        </div>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex max-w-full overflow-x-auto rounded-xl border border-gray-100 bg-white p-1 shadow-sm">
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
          <button
            type="button"
            onClick={() => exportToCsv(visibleLeads)}
            disabled={loading || visibleLeads.length === 0}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download size={15} /> Export
          </button>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex justify-end border-b border-gray-100 p-4">
            <AdminSortControls<LeadSortBy>
              options={[
                { label: "Referrer Name", value: "name" },
                { label: "Friend's Name", value: "refereeName" },
                { label: "Date received", value: "createdAt" },
                { label: "Status", value: "status" },
              ]}
              sortBy={sort.sortBy}
              sortDirection={sort.sortDirection}
              onChange={(sortBy, sortDirection) => {
                setPage(0);
                setSort({ sortBy, sortDirection });
              }}
            />
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
                  <th className="px-6 py-3">Referrer</th>
                  <th className="px-6 py-3">Phone</th>
                  <th className="px-6 py-3">Friend's Name</th>
                  <th className="px-6 py-3">Friend's Phone</th>
                  <th className="px-6 py-3">Property Type</th>
                  <th className="px-6 py-3">Event Type</th>
                  <th className="px-6 py-3">Preferred Date</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={10} className="px-6 py-8 text-center text-gray-400">Loading…</td></tr>
                ) : visibleLeads.length === 0 ? (
                  <tr><td colSpan={10} className="px-6 py-8 text-center text-gray-400">No referrals found.</td></tr>
                ) : (
                  visibleLeads.map((lead) => (
                    <tr key={lead.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="px-6 py-3 font-medium text-gray-900">{lead.name}</td>
                      <td className="px-6 py-3 text-gray-600">{lead.phone}</td>
                      <td className="px-6 py-3 text-gray-600">{lead.refereeName ?? "—"}</td>
                      <td className="px-6 py-3 text-gray-600">{lead.refereePhone ?? "—"}</td>
                      <td className="px-6 py-3 text-gray-600">{lead.propertyType ?? "—"}</td>
                      <td className="px-6 py-3 text-gray-600">{lead.eventType ?? "—"}</td>
                      <td className="px-6 py-3 text-gray-600">{lead.preferredDate ?? "—"}</td>
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

          {!globalSearch && (
            <Pagination
              pageNumber={page}
              totalPages={totalPages}
              totalElements={totalElements}
              pageSize={pageSize}
              onPageChange={setPage}
            />
          )}
        </div>
      </main>

      {viewing && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Referral from {viewing.name}</h3>
              <button type="button" onClick={() => setViewing(null)} className="text-gray-400 hover:text-gray-700">✕</button>
            </div>

            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-gray-500">Referral ID</dt><dd>{viewing.id}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Referrer Name</dt><dd>{viewing.name}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Referrer Phone</dt><dd>{viewing.phone}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Referrer Email</dt><dd>{viewing.email ?? "—"}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Friend's Name</dt><dd>{viewing.refereeName ?? "—"}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Friend's Phone</dt><dd>{viewing.refereePhone ?? "—"}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Friend's Email</dt><dd>{viewing.refereeEmail ?? "—"}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Property Type</dt><dd>{viewing.propertyType ?? "—"}</dd></div>
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
                <option value="CONTACTED">Contacted</option>
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

export default function ReferralsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-gray-400">Loading…</div>}>
      <ReferralsPageContent />
    </Suspense>
  );
}