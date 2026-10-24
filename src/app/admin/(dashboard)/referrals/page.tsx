"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Download, Eye } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import Pagination from "@/components/admin/Pagination";
import { fetchReferrals, updateReferral, AdminApiError } from "@/lib/admin-api";
import type { AdminReferral, ReferralStatus } from "@/types/admin";

const tabs: { label: string; value: ReferralStatus | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "New", value: "NEW" },
  { label: "Contacted", value: "CONTACTED" },
  { label: "Converted", value: "CONVERTED" },
  { label: "Cancelled", value: "CANCELLED" },
];

function exportToCsv(referrals: AdminReferral[]) {
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
  const rows = referrals.map((lead) => [
    lead.id,
    lead.referrerName,
    lead.referrerPhone,
    lead.referrerEmail ?? "",
    lead.refereeName ?? "",
    lead.refereePhone ?? "",
    lead.refereeEmail ?? "",
    lead.propertyType ?? "",
    "",
    lead.eventDate ?? "",
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
  const [activeTab, setActiveTab] = useState<ReferralStatus | "ALL">("ALL");
  const [referrals, setReferrals] = useState<AdminReferral[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewing, setViewing] = useState<AdminReferral | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const globalSearch = searchParams.get("search") ?? "";

  const pageSize = 10;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchReferrals({
        status: activeTab === "ALL" ? undefined : activeTab,
        keyword: globalSearch || undefined,
        page,
        size: pageSize,
      });
      setReferrals(result.content);
      setTotalPages(result.totalPages);
      setTotalElements(result.totalElements);
    } catch (err) {
      setError(err instanceof AdminApiError ? err.message : "Could not load referrals.");
    } finally {
      setLoading(false);
    }
  }, [activeTab, globalSearch, page]);

  useEffect(() => {
    load();
  }, [load]);

  const visibleReferrals = referrals;

  const handleStatusChange = async (status: ReferralStatus) => {
    if (!viewing) return;
    setUpdatingStatus(true);
    try {
      const updated = await updateReferral(viewing.id, { status });
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

      <main className="w-full min-w-0 max-w-full overflow-x-hidden p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Referral Leads</h2>
          <p className="text-sm text-gray-500">Manage and track referral submissions</p>
          {globalSearch && (
            <p className="mt-2 text-sm text-violet-700">
              Global search: <strong>{globalSearch}</strong> · filtered referrals
              <Link href="/admin/referrals" className="ml-2 underline">Clear</Link>
            </p>
          )}
        </div>

        <div className="mb-4 flex min-w-0 flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
          <div className="inline-flex w-full max-w-full flex-nowrap overflow-x-auto rounded-xl border border-gray-100 bg-white p-1 shadow-sm sm:w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => {
                  setPage(0);
                  setActiveTab(tab.value);
                }}
                className={`shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition-colors sm:px-4 ${
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
            onClick={() => exportToCsv(visibleReferrals)}
            disabled={loading || visibleReferrals.length === 0}
            className="flex shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto"
          >
            <Download size={15} /> Export
          </button>
        </div>

        <div className="min-w-0 max-w-full rounded-2xl border border-gray-100 bg-white shadow-sm">
          {error && (
            <div className="m-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="w-full min-w-0 max-w-full overflow-x-auto overscroll-x-contain">
            <table className="w-full min-w-[1050px] text-sm">
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
                ) : visibleReferrals.length === 0 ? (
                  <tr><td colSpan={10} className="px-6 py-8 text-center text-gray-400">No referrals found.</td></tr>
                ) : (
                  visibleReferrals.map((lead) => (
                    <tr key={lead.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="px-6 py-3 font-medium text-gray-900">{lead.referrerName}</td>
                      <td className="px-6 py-3 text-gray-600">{lead.referrerPhone}</td>
                      <td className="px-6 py-3 text-gray-600">{lead.refereeName ?? "—"}</td>
                      <td className="px-6 py-3 text-gray-600">{lead.refereePhone ?? "—"}</td>
                      <td className="px-6 py-3 text-gray-600">{lead.propertyType ?? "—"}</td>
                      <td className="px-6 py-3 text-gray-600">{"—"}</td>
                      <td className="px-6 py-3 text-gray-600">{lead.eventDate ?? "—"}</td>
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
        <div className="fixed inset-0 z-[150] flex items-center justify-center overflow-y-auto bg-black/50 p-3 sm:p-4">
          <div className="my-auto max-h-[90dvh] w-full min-w-0 max-w-lg overflow-y-auto rounded-2xl bg-white p-4 shadow-xl sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Referral from {viewing.referrerName}</h3>
              <button type="button" onClick={() => setViewing(null)} className="text-gray-400 hover:text-gray-700">✕</button>
            </div>

            <dl className="space-y-2 text-sm">
              <div className="flex min-w-0 items-start justify-between gap-4"><dt className="shrink-0 text-gray-500">Referral ID</dt><dd className="min-w-0 break-words text-right">{viewing.id}</dd></div>
              <div className="flex min-w-0 items-start justify-between gap-4"><dt className="shrink-0 text-gray-500">Referrer Name</dt><dd className="min-w-0 break-words text-right">{viewing.referrerName}</dd></div>
              <div className="flex min-w-0 items-start justify-between gap-4"><dt className="shrink-0 text-gray-500">Referrer Phone</dt><dd className="min-w-0 break-words text-right">{viewing.referrerPhone}</dd></div>
              <div className="flex min-w-0 items-start justify-between gap-4"><dt className="shrink-0 text-gray-500">Referrer Email</dt><dd className="min-w-0 break-words text-right">{viewing.referrerEmail ?? "—"}</dd></div>
              <div className="flex min-w-0 items-start justify-between gap-4"><dt className="shrink-0 text-gray-500">Friend's Name</dt><dd className="min-w-0 break-words text-right">{viewing.refereeName ?? "—"}</dd></div>
              <div className="flex min-w-0 items-start justify-between gap-4"><dt className="shrink-0 text-gray-500">Friend's Phone</dt><dd className="min-w-0 break-words text-right">{viewing.refereePhone ?? "—"}</dd></div>
              <div className="flex min-w-0 items-start justify-between gap-4"><dt className="shrink-0 text-gray-500">Friend's Email</dt><dd className="min-w-0 break-words text-right">{viewing.refereeEmail ?? "—"}</dd></div>
              <div className="flex min-w-0 items-start justify-between gap-4"><dt className="shrink-0 text-gray-500">Property Type</dt><dd className="min-w-0 break-words text-right">{viewing.propertyType ?? "—"}</dd></div>
              <div className="flex min-w-0 items-start justify-between gap-4"><dt className="shrink-0 text-gray-500">Event Type</dt><dd>{"—"}</dd></div>
              <div className="flex min-w-0 items-start justify-between gap-4"><dt className="shrink-0 text-gray-500">Preferred Date</dt><dd className="min-w-0 break-words text-right">{viewing.eventDate ?? "—"}</dd></div>
              <div className="flex min-w-0 items-start justify-between gap-4"><dt className="shrink-0 text-gray-500">Received</dt><dd>{new Date(viewing.createdAt).toLocaleString()}</dd></div>
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
                onChange={(e) => handleStatusChange(e.target.value as ReferralStatus)}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-500"
              >
                <option value="NEW">New</option>
                <option value="CONTACTED">Contacted</option>
                <option value="CONVERTED">Converted</option>
                <option value="CANCELLED">Cancelled</option>
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