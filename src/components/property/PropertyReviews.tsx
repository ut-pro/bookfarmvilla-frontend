"use client";

import { useEffect, useRef, useState } from "react";
import { Star } from "lucide-react";

import { getPropertyReviews } from "@/lib/public-api";
import Rating from "@/components/ui/Rating";
import ReviewerAvatar from "@/components/ui/ReviewerAvatar";
import type { PropertyReview } from "@/lib/public-api";

interface PropertyReviewsProps {
  propertyId: string;
}

const INITIAL_REVIEW_LIMIT = 5;

function formatReviewDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

function calculateAverageRating(reviews: PropertyReview[]): number {
  const validRatings = reviews.filter(
    (r) => typeof r.rating === "number" && Number.isFinite(r.rating)
  );
  if (validRatings.length === 0) return 0;
  const sum = validRatings.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / validRatings.length) * 10) / 10;
}

export default function PropertyReviews({ propertyId }: PropertyReviewsProps) {
  const [reviews, setReviews] = useState<PropertyReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const averageRating = calculateAverageRating(reviews);
  const totalReviews = reviews.length;
  const displayedReviews = showAll ? reviews : reviews.slice(0, INITIAL_REVIEW_LIMIT);
  const hasMoreReviews = reviews.length > INITIAL_REVIEW_LIMIT;

  useEffect(() => {
    const controller = new AbortController();
    let mounted = true;

    async function loadReviews() {
      try {
        const fetchedReviews = await getPropertyReviews(propertyId, controller.signal);
        if (mounted) {
          setReviews(fetchedReviews);
          setHasError(false);
          setLoading(false);
        }
      } catch (error) {
        if (controller.signal.aborted) return;
        if (mounted) {
          setHasError(true);
          setLoading(false);
          console.error("Failed to load property reviews:", error);
        }
      }
    }

    // Create intersection observer for lazy loading
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadReviews();
            observerRef.current?.disconnect();
          }
        });
      },
      { rootMargin: "100px" }
    );

    if (sectionRef.current) {
      observerRef.current.observe(sectionRef.current);
    }

    return () => {
      mounted = false;
      controller.abort();
      observerRef.current?.disconnect();
    };
  }, [propertyId]);

  const handleRetry = () => {
    setLoading(true);
    setHasError(false);
    window.location.reload();
  };

  if (loading) {
    return (
      <section ref={sectionRef} aria-labelledby="property-reviews-heading" className="mt-12 sm:mt-16">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8" role="status">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
            <div>
              <h2 id="property-reviews-heading" className="text-xl font-bold text-[#0F172A]">
                Guest Reviews
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                What our guests say about this property
              </p>
            </div>
            <div className="flex items-center gap-3 sm:ml-auto">
              <div className="flex items-center gap-2 text-amber-500">
                <Star size={24} className="fill-amber-400" aria-hidden="true" />
                <span className="text-2xl font-bold text-[#0F172A]">—</span>
                <span className="text-gray-400">/ 5</span>
              </div>
              <span className="text-sm text-gray-500">Based on — reviews</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse rounded-xl border border-gray-100 bg-white p-5">
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 shrink-0 rounded-full bg-gray-200" />
                  <div className="flex-1 min-w-0 space-y-3">
                    <div className="h-4 w-1/4 bg-gray-200 rounded" />
                    <div className="h-4 w-full bg-gray-200 rounded" />
                    <div className="h-4 w-3/4 bg-gray-200 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (hasError) {
    return (
      <section ref={sectionRef} aria-labelledby="property-reviews-heading" className="mt-12 sm:mt-16">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 sm:p-8" role="alert">
          <h2 id="property-reviews-heading" className="text-xl font-bold text-[#0F172A] mb-4">
            Guest Reviews
          </h2>
          <p className="font-semibold text-amber-900 mb-2">
            Reviews could not be loaded right now.
          </p>
          <p className="text-sm text-amber-800 mb-4">
            Please refresh the page or try again shortly.
          </p>
          <button
            onClick={handleRetry}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#2EAD45] bg-green-50 px-4 py-2 text-sm font-semibold text-[#1E8A32] transition-colors hover:bg-[#2EAD45] hover:text-white"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  if (reviews.length === 0) {
    return (
      <section ref={sectionRef} aria-labelledby="property-reviews-heading" className="mt-12 sm:mt-16">
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-6 sm:p-8 text-center">
          <h2 id="property-reviews-heading" className="text-xl font-bold text-[#0F172A] mb-2">
            Guest Reviews
          </h2>
          <p className="text-sm text-gray-500">
            No reviews yet. Be the first to share your experience!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} aria-labelledby="property-reviews-heading" className="mt-12 sm:mt-16">
      <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
          <div>
            <h2 id="property-reviews-heading" className="text-xl font-bold text-[#0F172A]">
              Guest Reviews
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              What our guests say about this property
            </p>
          </div>
          <div className="flex items-center gap-3 sm:ml-auto">
            <div className="flex items-center gap-2 text-amber-500">
              <Star size={24} className="fill-amber-400" aria-hidden="true" />
              <span className="text-2xl font-bold text-[#0F172A]">
                {averageRating > 0 ? averageRating.toFixed(1) : "—"}
              </span>
              <span className="text-gray-400">/ 5</span>
            </div>
            <span className="text-sm text-gray-500">
              Based on {totalReviews} review{totalReviews !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedReviews.map((review) => (
            <article
              key={review.id}
              className="rounded-xl border border-gray-100 bg-white p-5 transition-shadow hover:shadow-md"
            >
              <div className="flex items-start gap-3">
                <ReviewerAvatar
                  imageUrl={review.image_url ?? undefined}
                  reviewId={review.id}
                  reviewerName={review.reviewerName}
                  alt={`${review.reviewerName}'s avatar`}
                  size={44}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-[#0F172A] truncate">
                        {review.reviewerName || "Anonymous"}
                      </p>
                      {review.createdAt && (
                        <p className="mt-0.5 text-xs text-gray-400">
                          {formatReviewDate(review.createdAt)}
                        </p>
                      )}
                    </div>
                    <Rating rating={review.rating} />
                  </div>
                  {review.comment && (
                    <p className="mt-3 text-sm leading-6 text-gray-600 whitespace-pre-line">
                      {review.comment}
                    </p>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {hasMoreReviews && !showAll && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setShowAll(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#2EAD45] bg-white px-6 py-3 text-sm font-semibold text-[#1E8A32] transition-colors hover:bg-[#2EAD45] hover:text-white"
            >
              Show More Reviews ({reviews.length - INITIAL_REVIEW_LIMIT} more)
            </button>
          </div>
        )}

        {hasMoreReviews && showAll && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setShowAll(false)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-600 transition-colors hover:border-gray-300 hover:bg-gray-50"
            >
              Show Less
            </button>
          </div>
        )}
      </div>
    </section>
  );
}