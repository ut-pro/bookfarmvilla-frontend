import { Star } from "lucide-react";

interface RatingProps {
  rating: number;
  reviewCount?: number;
}

export default function Rating({
  rating,
  reviewCount,
}: RatingProps) {
  const accessibleLabel =
    typeof reviewCount === "number"
      ? `${rating} out of 5 stars from ${reviewCount} reviews`
      : `${rating} out of 5 stars`;

  return (
    <div
      className="flex shrink-0 items-center gap-1"
      aria-label={accessibleLabel}
    >
      <Star
        size={13}
        className="fill-amber-400 text-amber-400"
        aria-hidden="true"
      />

      <span className="text-sm font-semibold text-[#0F172A]">
        {rating}
      </span>

      {typeof reviewCount === "number" && (
        <span className="text-xs text-gray-400">
          ({reviewCount})
        </span>
      )}
    </div>
  );
}
