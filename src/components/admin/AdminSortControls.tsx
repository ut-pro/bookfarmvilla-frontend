"use client";

import type { SortDirection } from "@/types/admin";

interface AdminSortControlsProps<T extends string> {
  options: { label: string; value: T }[];
  sortBy: T | "";
  sortDirection: SortDirection;
  onChange: (sortBy: T | "", sortDirection: SortDirection) => void;
}

export default function AdminSortControls<T extends string>({
  options,
  sortBy,
  sortDirection,
  onChange,
}: AdminSortControlsProps<T>) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <label htmlFor="admin-sort-by" className="text-sm font-medium text-gray-600">
        Sort by
      </label>
      <select
        id="admin-sort-by"
        value={sortBy}
        onChange={(event) =>
          onChange(event.target.value as T | "", sortDirection)
        }
        className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-400"
      >
        <option value="">Default order</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <label htmlFor="admin-sort-direction" className="sr-only">
        Sort direction
      </label>
      <select
        id="admin-sort-direction"
        value={sortDirection}
        disabled={!sortBy}
        onChange={(event) =>
          onChange(sortBy, event.target.value as SortDirection)
        }
        className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>
  );
}
