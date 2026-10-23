"use client";

import { useEffect, useRef, useState } from "react";

import { getPropertyReviews } from "@/lib/public-api";
import Rating from "@/components/ui/Rating";
import type { PropertyReview } from "@/lib/public-api";

interface PropertyReviewsProps {
  propertyId: string;
}

const INITIAL_REVIEW_LIMIT = 5;

export default function PropertyReviews({ propertyId }: PropertyReviewsProps) {
  const [reviews, setReviews] = useState<PropertyReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadReviews() {
      try {
        const fetchedReviews = await getPropertyReviews(propertyId, controller.signal);
        setReviews(fetchedReviews);
        setHasError(false);
      } catch (error) {
        if (controller.signal.aborted) return;
        setHasError(true);
        console.error("Failed to load property reviews:", error);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
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
      controller.abort();
      observerRef.current?.disconnect();
    };
  }, [propertyId]);

  const handleRetry = () => {
    setLoading(true);
    setHasError(false);
    // Trigger reload by updating a key or calling loadReviews directly
    window.location.reload();
  };

  const displayedReviews = showAll ? reviews : reviews.slice(0, INITIAL_REVIEW_LIMIT);
  const hasMoreReviews = reviews.length > INITIAL_REVIEW_LIMIT;

  if (loading) {
    return (
      <section ref={sectionRef} aria-labelledby="property-reviews-heading" className="mt-10 sm:mt-12">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8" role="status">
          <h2 id="property-reviews-heading" className="text-xl font-bold text-[#0F172A] mb-6">
            Property Reviews
          </h2>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-32 bg-gray-200 rounded"></div>
                  <div className="h-4 w-20 bg-gray-200 rounded"></div>
                </div>
                <div className="mt-2 h-16 bg-gray-100 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (hasError) {
    return (
      <section ref={sectionRef} aria-labelledby="property-reviews-heading" className="mt-10 sm:mt-12">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 sm:p-8" role="alert">
          <h2 id="property-reviews-heading" className="text-xl font-bold text-[#0F172A] mb-4">
            Property Reviews
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
      <section ref={sectionRef} aria-labelledby="property-reviews-heading" className="mt-10 sm:mt-12">
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-6 sm:p-8 text-center">
          <h2 id="property-reviews-heading" className="text-xl font-bold text-[#0F172A] mb-2">
            Property Reviews
          </h2>
          <p className="text-sm text-gray-500">
            No reviews yet. Be the first to share your experience!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} aria-labelledby="property-reviews-heading" className="mt-10 sm:mt-12">
      <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8">
        <h2 id="property-reviews-heading" className="text-xl font-bold text-[#0F172A] mb-6">
          Property Reviews
        </h2>

        <div className="space-y-6">
          {displayedReviews.map((review) => (
            <article key={review.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-[#0F172A]">{review.reviewerName}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(review.createdAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <Rating rating={review.rating} />
              </div>
              {review.comment && (
                <p className="mt-3 text-sm leading-6 text-gray-600">{review.comment}</p>
              )}
            </article>
          ))}
        </div>

        {hasMoreReviews && !showAll && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setShowAll(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#2EAD45] bg-white px-5 py-2.5 text-sm font-semibold text-[#1E8A32] transition-colors hover:bg-[#2EAD45] hover:text-white"
            >
              Show More Reviews ({reviews.length - INITIAL_REVIEW_LIMIT} more)
            </button>
          </div>
        )}

        {hasMoreReviews && showAll && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setShowAll(false)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:border-gray-300 hover:bg-gray-50"
            >
              Show Less
            </button>
          </div>
        )}
      </div>
    </section>
  );
}