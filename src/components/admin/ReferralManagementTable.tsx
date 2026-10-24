"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  LayoutGrid,
  Users,
  Shield,
  Folder,
  RefreshCw,
  XCircle,
} from "lucide-react";

import { fetchLeads } from "@/lib/admin-api";
import type { AdminLead, LeadStatus } from "@/types/admin";

interface ReferralManagementTableProps {
  page?: number;
  size?: number;
  status?: LeadStatus;
  search?: string;
}

interface LeadTableRow {
  id: string;
  propertyId: string | null;
  propertyTitle: string | null;
  vendorId: string | null;
  vendorName: string | null;
  name: string;
  phone: string;
  email: string | null;
  preferredDate: string | null;
  eventType: string | null;
  message: string | null;
  refereeName: string | null;
  status: LeadStatus;
  createdAt: string;
}

export default function ReferralManagementTable({
  page = 1,
  size = 20,
  status,
  search,
}: ReferralManagementTableProps) {
  const [leads, setLeads] = useState<LeadTableRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<LeadStatus | undefined>(status);
  const [selectedSearch, setSelectedSearch] = useState<string | undefined>(search);

  useEffect(() => {
    let mounted = true;

    async function loadLeads() {
      try {
        const response = await fetchLeads({
          status: selectedStatus,
          page: page - 1, // API uses 0-indexed page
          size,
          ...(selectedSearch && { keyword: selectedSearch }),
        });

        if (mounted) {
          setLeads(response.content);
          setTotal(response.totalElements);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError("Failed to load referral leads. Please refresh.");
          setLoading(false);
          console.error("Error loading referral leads:", err);
        }
      }
    }

    loadLeads();

    return () => {
      mounted = false;
    };
  }, [page, size, selectedStatus, selectedSearch]);

  const handleStatusChange = useCallback(async (leadId: string, newStatus: LeadStatus) => {
    try {
      setLoading(true);
      const updated = await fetchLeads({
        status: selectedStatus,
        page: 0,
        size,
        ...(selectedSearch && { keyword: selectedSearch }),
      });

      if (loading) {
        setLeads(updated.content);
        setTotal(updated.totalElements);
        setLoading(false);
      }
    } catch (err) {
      console.error("Error updating lead status:", err);
      setError("Failed to update lead status. Please refresh.");
      setLoading(false);
    }
  }, [selectedStatus]);

  const statusOptions: LeadStatus[] = ["NEW", "CONTACTED", "CONVERTED", "CLOSED"];

  return (
    <div className="overflow-x-auto">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-[#0F172A] mb-1">
              Referral Leads Management
            </h2>
            <p className="text-sm text-gray-500">
              Manage and track referral submissions
            </p>
          </div>

          <div className="flex gap-2 sm:gap-3">
            <Select
              options={["All", ...statusOptions].map(val => ({
                label: val === "All" ? "All" : val.replace(/_/g, " "),
                value: val === "All" ? undefined : val,
              }))}
              value={selectedStatus}
              onChange={(val) => setSelectedStatus(val as LeadStatus | undefined)}
              placeholder="Filter by status"
            />
            <Select
              placeholder="Search by name or phone"
              value={selectedSearch}
              onChange={(val) => setSelectedSearch(val)}
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full rounded-lg border border-gray-200">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Referrer
                </th>
                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Friend's Name
                </th>
                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Friend's Phone
                </th>
                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Preferred Date
                </th>
                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event Type
                </th>
                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 && !loading && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-500">
                    No referral leads found
                  </td>
                </tr>
              )}
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-900">
                    {lead.name || "Not provided"}
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {lead.refereeName || lead.name || "Not provided"}
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {lead.phone || "Not provided"}
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {lead.preferredDate ? new Date(lead.preferredDate).toLocaleDateString() : "Not specified"}
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {lead.eventType || "Not specified"}
                  </td>
                  <td className="p-4">
                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                      className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2EAD45]"
                    >
                      <option value="NEW" selected>{lead.status}</option>
                      <option value="CONTACTED">Contacted</option>
                      <option value="CONVERTED">Converted</option>
                      <option value="CLOSED">Closed</option>
                    </select>
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <Link
                      href={`/admin/leads/${lead.id}`}
                      className="text-[#2EAD45] hover:text-[#1E8A32] transition-colors text-sm"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {total > size && (
          <div className="mt-6 flex justify-end sm:justify-flex-end">
            <nav aria-label="Referral leads pagination">
              <ul className="flex list-none gap-2">
                <li>
                  <Link
                    href={`/admin/referrals?page=1${status ? `&status=${status}` : ""}${search ? `&search=${search}` : ""}`}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                      page === 1
                        ? "bg-[#2EAD45] text-white"
                        : "hover:bg-gray-100 hover:text-[#0F172A]"
                    }`}
                  >
                    First
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/admin/referrals?page=${page > 1 ? page - 1 : 1}${status ? `&status=${status}` : ""}${search ? `&search=${search}` : ""}`}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                      page <= 1 ? "bg-gray-100 text-gray-400" : ""
                    }`}
                  >
                    Prev
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/admin/referrals?page=${page + 1}${status ? `&status=${status}` : ""}${search ? `&search=${search}` : ""}`}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                      page * size >= total ? "bg-gray-100 text-gray-400" : ""
                    }`}
                  >
                    Next
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/admin/referrals?page=${Math.ceil(total / size)}${status ? `&status=${status}` : ""}${search ? `&search=${search}` : ""}`}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                      page * size >= total ? "bg-gray-100 text-gray-400" : ""
                    }`}
                  >
                    Last
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}

/* Helper component for select */
function Select({ options, value, onChange, placeholder }: {
  options: { label: string; value: string | undefined }[];
  value: string | undefined;
  onChange: (val: string | undefined) => void;
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(value);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2EAD45] focus:text-gray-900"
        aria-haspopup="listbox"
      >
        {selected ? (
          <span className="flex items-center gap-2">
            {selected.split("_").join(" ")}
          </span>
        ) : (
          <span>{placeholder}</span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-64 rounded border border-gray-300 bg-white shadow-lg shadow-black/10 z-50 max-h-60 overflow-y-auto"
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                setSelected(opt.value);
                setOpen(false);
                onChange(opt.value);
              }}
              className="w-full px-3 py-2 text-sm hover:bg-gray-50 hover:text-gray-900"
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}