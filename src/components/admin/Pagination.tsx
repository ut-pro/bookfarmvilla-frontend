interface PaginationProps {
  pageNumber: number; // 0-indexed, matches backend
  totalPages: number;
  totalElements: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  pageNumber,
  totalPages,
  totalElements,
  pageSize,
  onPageChange,
}: PaginationProps) {
  if (totalElements === 0) return null;

  const from = pageNumber * pageSize + 1;
  const to = Math.min((pageNumber + 1) * pageSize, totalElements);

  return (
    <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4 text-sm text-gray-500">
      <span>
        Showing {from} to {to} of {totalElements} entries
      </span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(pageNumber - 1)}
          disabled={pageNumber === 0}
          className="rounded-lg border border-gray-200 px-2.5 py-1.5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          ‹
        </button>
        {Array.from({ length: totalPages }, (_, i) => i)
          .filter((i) => Math.abs(i - pageNumber) <= 2 || i === 0 || i === totalPages - 1)
          .map((i, idx, arr) => (
            <span key={i} className="flex items-center">
              {idx > 0 && arr[idx - 1] !== i - 1 && <span className="px-1">…</span>}
              <button
                type="button"
                onClick={() => onPageChange(i)}
                className={`min-w-[32px] rounded-lg px-2.5 py-1.5 ${
                  i === pageNumber
                    ? "bg-violet-600 text-white"
                    : "border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {i + 1}
              </button>
            </span>
          ))}
        <button
          type="button"
          onClick={() => onPageChange(pageNumber + 1)}
          disabled={pageNumber >= totalPages - 1}
          className="rounded-lg border border-gray-200 px-2.5 py-1.5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          ›
        </button>
      </div>
    </div>
  );
}
