import { Star } from "lucide-react";

interface RatingProps {
  rating: number;
  reviewCount?: number;
}

function formatRating(rating: number): string {
  // Integer ratings should display with one decimal place (e.g., 4.0)
  // Fractional ratings should remain as-is (e.g., 4.5)
  if (Number.isInteger(rating)) {
    return `${rating}.0`;
  }
  return rating.toFixed(1);
}

export default function Rating({
  rating,
  reviewCount,
}: RatingProps) {
  const formattedRating = formatRating(rating);
  const accessibleLabel =
    typeof reviewCount === "number"
      ? `${formattedRating} out of 5 stars from ${reviewCount} reviews`
      : `${formattedRating} out of 5 stars`;

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
        {formattedRating}
      </span>

      {typeof reviewCount === "number" && (
        <span className="text-xs text-gray-400">
          ({reviewCount})
        </span>
      )}
    </div>
  );
}
