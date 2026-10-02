"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Eye, Pencil, Plus, Search, Trash2 } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import Pagination from "@/components/admin/Pagination";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import PropertyFormModal from "@/components/admin/PropertyFormModal";
import {
  fetchProperties,
  createProperty,
  updateProperty,
  deleteProperty,
  AdminApiError,
} from "@/lib/admin-api";
import type { AdminProperty, AdminPropertyPayload, PropertyType } from "@/types/admin";

interface PropertyManagerProps {
  propertyType: PropertyType;
  typeLabel: string; // "Farmhouse", "Villa", "Wedding Lawn"
  typeLabelPlural: string; // "Farmhouses", "Villas", "Wedding Lawns"
}

function formatPrice(property: AdminProperty): string {
  if (property.startingPrice == null && property.endingPrice == null) return "—";
  if (property.startingPrice != null && property.endingPrice != null) {
    return `₹${property.startingPrice.toLocaleString("en-IN")} - ₹${property.endingPrice.toLocaleString("en-IN")}`;
  }
  const only = property.startingPrice ?? property.endingPrice;
  return `₹${only!.toLocaleString("en-IN")}`;
}

export default function PropertyManager({ propertyType, typeLabel, typeLabelPlural }: PropertyManagerProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [properties, setProperties] = useState<AdminProperty[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminProperty | null>(null);
  const [viewing, setViewing] = useState<AdminProperty | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminProperty | null>(null);
  const [deleting, setDeleting] = useState(false);

  const pageSize = 10;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchProperties({
        type: propertyType,
        keyword: keyword || undefined,
        page,
        size: pageSize,
      });
      setProperties(result.content);
      setTotalPages(result.totalPages);
      setTotalElements(result.totalElements);
    } catch (err) {
      setError(err instanceof AdminApiError ? err.message : "Could not load listings.");
    } finally {
      setLoading(false);
    }
  }, [propertyType, keyword, page]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (searchParams.get("new") === "1") {
      setEditing(null);
      setFormOpen(true);
      router.replace(window.location.pathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreateOrUpdate = async (payload: AdminPropertyPayload) => {
    if (editing) {
      await updateProperty(editing.id, payload);
    } else {
      await createProperty(payload);
    }
    setFormOpen(false);
    setEditing(null);
    await load();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteProperty(deleteTarget.id);
      setDeleteTarget(null);
      await load();
    } catch (err) {
      setError(err instanceof AdminApiError ? err.message : "Could not delete this listing.");
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <AdminHeader title={typeLabelPlural} />

      <main className="p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{typeLabelPlural}</h2>
            <p className="text-sm text-gray-500">Manage your {typeLabelPlural.toLowerCase()} listings</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
            className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700"
          >
            <Plus size={16} /> Add {typeLabel}
          </button>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-gray-100 p-4">
            <div className="relative flex-1 max-w-xs">
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={keyword}
                onChange={(e) => {
                  setPage(0);
                  setKeyword(e.target.value);
                }}
                placeholder={`Search ${typeLabelPlural.toLowerCase()}...`}
                className="w-full rounded-xl border border-gray-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-violet-400"
              />
            </div>
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
                  <th className="px-6 py-3">Title</th>
                  <th className="px-6 py-3">City</th>
                  <th className="px-6 py-3">Price</th>
                  <th className="px-6 py-3">Capacity</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                      Loading…
                    </td>
                  </tr>
                ) : properties.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                      No {typeLabelPlural.toLowerCase()} found.
                    </td>
                  </tr>
                ) : (
                  properties.map((property) => (
                    <tr key={property.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="px-6 py-3 font-medium text-gray-900">{property.title}</td>
                      <td className="px-6 py-3 text-gray-600">{property.city}</td>
                      <td className="px-6 py-3 text-gray-600">{formatPrice(property)}</td>
                      <td className="px-6 py-3 text-gray-600">{property.capacity ?? "—"}</td>
                      <td className="px-6 py-3">
                        <StatusBadge status={property.status} />
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setViewing(property)}
                            className="rounded-lg border border-gray-200 p-1.5 text-gray-500 hover:bg-gray-50"
                            aria-label="View"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditing(property);
                              setFormOpen(true);
                            }}
                            className="rounded-lg border border-gray-200 p-1.5 text-violet-600 hover:bg-violet-50"
                            aria-label="Edit"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(property)}
                            className="rounded-lg border border-gray-200 p-1.5 text-red-500 hover:bg-red-50"
                            aria-label="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
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

      <PropertyFormModal
        open={formOpen}
        propertyType={propertyType}
        typeLabel={typeLabel}
        initial={editing}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onSubmit={handleCreateOrUpdate}
      />

      {viewing && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">{viewing.title}</h3>
              <button type="button" onClick={() => setViewing(null)} className="text-gray-400 hover:text-gray-700">
                ✕
              </button>
            </div>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-gray-500">City</dt><dd>{viewing.city}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Address</dt><dd>{viewing.address ?? "—"}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Price</dt><dd>{formatPrice(viewing)}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Capacity</dt><dd>{viewing.capacity ?? "—"}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Phone</dt><dd>{viewing.contactPhone}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Coordinates</dt><dd>{viewing.latitude && viewing.longitude ? `${viewing.latitude}, ${viewing.longitude}` : "—"}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Amenities</dt><dd>{viewing.amenities.join(", ") || "—"}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Status</dt><dd><StatusBadge status={viewing.status} /></dd></div>
              {viewing.description && (
                <div className="pt-2">
                  <dt className="mb-1 text-gray-500">Description</dt>
                  <dd className="text-gray-700">{viewing.description}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title={`Delete ${typeLabel}?`}
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </>
  );
}
