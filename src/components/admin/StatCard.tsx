import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  accent: string; // tailwind bg class for the icon chip, e.g. "bg-violet-100 text-violet-600"
  loading?: boolean;
}

export default function StatCard({ label, value, icon: Icon, accent, loading }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {loading ? "…" : value}
          </p>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${accent}`}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}
