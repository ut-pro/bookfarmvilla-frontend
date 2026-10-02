const colorMap: Record<string, string> = {
  // Listing status
  ACTIVE: "bg-green-100 text-green-700",
  INACTIVE: "bg-gray-100 text-gray-500",
  // Lead status
  NEW: "bg-orange-100 text-orange-700",
  CONTACTED: "bg-green-100 text-green-700",
  CONVERTED: "bg-violet-100 text-violet-700",
  CLOSED: "bg-gray-100 text-gray-500",
  // Partner status
  PENDING: "bg-orange-100 text-orange-700",
  OPEN: "bg-blue-100 text-blue-700",
  ACCEPTED: "bg-green-100 text-green-700",
  DECLINED: "bg-red-100 text-red-700",
  // Booking status
  CONFIRMED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  COMPLETED: "bg-violet-100 text-violet-700",
  // Payment status
  PAID: "bg-green-100 text-green-700",
  UNPAID: "bg-orange-100 text-orange-700",
  REFUNDED: "bg-violet-100 text-violet-700",
};

const labelMap: Record<string, string> = {
  CONTACTED: "Replied",
};

export default function StatusBadge({ status }: { status: string }) {
  const classes = colorMap[status] ?? "bg-gray-100 text-gray-600";
  const label = labelMap[status] ?? status.charAt(0) + status.slice(1).toLowerCase();

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${classes}`}>
      {label}
    </span>
  );
}
