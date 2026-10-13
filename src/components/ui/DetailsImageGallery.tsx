"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type TouchEvent,
} from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Images,
  Play,
  X,
} from "lucide-react";

import { getVideoMimeType, isVideoUrl } from "@/lib/media";

interface DetailsImageGalleryProps {
  mediaUrls: string[];
  title: string;
  badge?: string;
}

interface MediaPreviewProps {
  url: string;
  title: string;
  index: number;
  priority?: boolean;
  sizes: string;
}

function MediaPreview({
  url,
  title,
  index,
  priority = false,
  sizes,
}: MediaPreviewProps) {
  if (isVideoUrl(url)) {
    return (
      <>
        <video
          src={url}
          muted
          playsInline
          preload="metadata"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          aria-label={`${title} — video ${index + 1}`}
        />
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/15">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black/60 text-white shadow-lg backdrop-blur-sm">
            <Play size={21} className="ml-0.5 fill-white" aria-hidden="true" />
          </span>
        </span>
      </>
    );
  }

  return (
    <Image
      src={url}
      alt={`${title} — image ${index + 1}`}
      fill
      priority={priority}
      unoptimized
      sizes={sizes}
      className="object-cover transition-transform duration-500 group-hover:scale-105"
    />
  );
}

export default function DetailsImageGallery({
  mediaUrls,
  title,
  badge,
}: DetailsImageGalleryProps) {
  const safeMediaUrls = mediaUrls.map((url) => url.trim()).filter(Boolean);
  const [openMediaIndex, setOpenMediaIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  const showPreviousMedia = useCallback(() => {
    setOpenMediaIndex((currentIndex) => {
      if (currentIndex === null || safeMediaUrls.length === 0) {
        return null;
      }

      return currentIndex === 0
        ? safeMediaUrls.length - 1
        : currentIndex - 1;
    });
  }, [safeMediaUrls.length]);

  const showNextMedia = useCallback(() => {
    setOpenMediaIndex((currentIndex) => {
      if (currentIndex === null || safeMediaUrls.length === 0) {
        return null;
      }

      return currentIndex === safeMediaUrls.length - 1
        ? 0
        : currentIndex + 1;
    });
  }, [safeMediaUrls.length]);

  const closeGallery = useCallback(() => {
    setOpenMediaIndex(null);
  }, []);

  useEffect(() => {
    if (openMediaIndex === null) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeGallery();
      } else if (event.key === "ArrowLeft") {
        showPreviousMedia();
      } else if (event.key === "ArrowRight") {
        showNextMedia();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    closeGallery,
    openMediaIndex,
    showNextMedia,
    showPreviousMedia,
  ]);

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) {
      return;
    }

    const touchEndX = event.changedTouches[0]?.clientX;

    if (typeof touchEndX !== "number") {
      touchStartX.current = null;
      return;
    }

    const difference = touchStartX.current - touchEndX;

    if (Math.abs(difference) >= 50) {
      if (difference > 0) {
        showNextMedia();
      } else {
        showPreviousMedia();
      }
    }

    touchStartX.current = null;
  };

  if (safeMediaUrls.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center bg-gray-100 px-4 text-center text-sm text-gray-500 sm:h-96">
        No property media available
      </div>
    );
  }

  const openGallery = (index: number) => {
    setOpenMediaIndex(index);
  };

  const renderMediaButton = (
    mediaUrl: string,
    index: number,
    className: string,
    sizes: string,
    priority = false,
  ) => (
    <button
      key={`${mediaUrl}-${index}`}
      type="button"
      onClick={() => openGallery(index)}
      className={`group relative overflow-hidden bg-gray-100 ${className}`}
      aria-label={`View ${
        isVideoUrl(mediaUrl) ? "video" : "image"
      } ${index + 1} of ${title}`}
    >
      <MediaPreview
        url={mediaUrl}
        title={title}
        index={index}
        priority={priority}
        sizes={sizes}
      />
    </button>
  );

  return (
    <>
      <div className="relative">
        {safeMediaUrls.length === 1 ? (
          <div className="h-64 sm:h-96 lg:h-[520px]">
            {renderMediaButton(
              safeMediaUrls[0],
              0,
              "h-full w-full",
              "(max-width: 1280px) 100vw, 1200px",
              !isVideoUrl(safeMediaUrls[0]),
            )}
          </div>
        ) : safeMediaUrls.length === 2 ? (
          <div className="grid h-64 grid-cols-2 gap-1 sm:h-96 lg:h-[520px]">
            {safeMediaUrls.map((mediaUrl, index) =>
              renderMediaButton(
                mediaUrl,
                index,
                "h-full w-full",
                "50vw",
                index === 0 && !isVideoUrl(mediaUrl),
              ),
            )}
          </div>
        ) : (
          <div className="grid h-72 grid-cols-2 grid-rows-2 gap-1 sm:h-96 lg:h-[520px] lg:grid-cols-4">
            {renderMediaButton(
              safeMediaUrls[0],
              0,
              "col-span-2 row-span-1 lg:row-span-2",
              "(max-width: 1023px) 100vw, 50vw",
              !isVideoUrl(safeMediaUrls[0]),
            )}

            {renderMediaButton(
              safeMediaUrls[1],
              1,
              "lg:col-span-2",
              "(max-width: 1023px) 50vw, 50vw",
            )}

            <button
              type="button"
              onClick={() => openGallery(2)}
              className="group relative overflow-hidden bg-gray-100 lg:col-span-2"
              aria-label={`View all ${safeMediaUrls.length} photos and videos of ${title}`}
            >
              <MediaPreview
                url={safeMediaUrls[2]}
                title={title}
                index={2}
                sizes="(max-width: 1023px) 50vw, 50vw"
              />

              <span className="absolute inset-0 bg-black/40 transition-colors group-hover:bg-black/50" />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="inline-flex max-w-[calc(100%-1rem)] items-center gap-1.5 rounded-xl bg-white/95 px-3 py-2 text-xs font-semibold text-[#0F172A] shadow-lg sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm">
                  <Images
                    size={17}
                    className="shrink-0 text-[#2EAD45]"
                    aria-hidden="true"
                  />
                  <span className="whitespace-nowrap">
                    View {safeMediaUrls.length} media
                  </span>
                </span>
              </span>
            </button>
          </div>
        )}

        {badge && (
          <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-[#1E8A32] shadow-sm sm:left-5 sm:top-5">
            {badge}
          </span>
        )}
      </div>

      {openMediaIndex !== null && (
        <div
          className="fixed inset-0 z-[160] flex h-[100dvh] items-center justify-center bg-black/85 p-2 backdrop-blur-md sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeGallery();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${title} media gallery`}
            className="relative flex h-full max-h-full w-full max-w-6xl items-center justify-center"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <button
              type="button"
              onClick={closeGallery}
              className="absolute right-1 top-1 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm transition-colors hover:bg-black/65 sm:right-0 sm:top-0"
              aria-label="Close media gallery"
            >
              <X size={23} aria-hidden="true" />
            </button>

            <span className="absolute left-1 top-2 z-30 rounded-full bg-black/45 px-3 py-1.5 text-xs font-medium text-white sm:left-0">
              {openMediaIndex + 1} / {safeMediaUrls.length}
            </span>

            <div className="relative flex h-[calc(100dvh-5rem)] w-full items-center justify-center sm:h-[82dvh]">
              {isVideoUrl(safeMediaUrls[openMediaIndex]) ? (
                <video
                  key={safeMediaUrls[openMediaIndex]}
                  controls
                  autoPlay
                  playsInline
                  preload="metadata"
                  className="max-h-full max-w-full rounded-lg bg-black object-contain"
                  aria-label={`${title} — video ${openMediaIndex + 1}`}
                >
                  <source
                    src={safeMediaUrls[openMediaIndex]}
                    type={getVideoMimeType(safeMediaUrls[openMediaIndex])}
                  />
                  Your browser does not support video playback.
                </video>
              ) : (
                <Image
                  key={safeMediaUrls[openMediaIndex]}
                  src={safeMediaUrls[openMediaIndex]}
                  alt={`${title} — image ${openMediaIndex + 1}`}
                  fill
                  priority
                  unoptimized
                  sizes="100vw"
                  className="object-contain"
                />
              )}
            </div>

            {safeMediaUrls.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={showPreviousMedia}
                  className="absolute left-1 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm transition-colors hover:bg-black/65 sm:left-0 sm:h-12 sm:w-12"
                  aria-label="Show previous media"
                >
                  <ChevronLeft size={28} aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={showNextMedia}
                  className="absolute right-1 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm transition-colors hover:bg-black/65 sm:right-0 sm:h-12 sm:w-12"
                  aria-label="Show next media"
                >
                  <ChevronRight size={28} aria-hidden="true" />
                </button>

                <div className="scrollbar-hide absolute bottom-2 left-1/2 z-30 flex max-w-[80%] -translate-x-1/2 gap-2 overflow-x-auto rounded-full bg-black/45 px-3 py-2">
                  {safeMediaUrls.map((mediaUrl, index) => (
                    <button
                      key={`${mediaUrl}-dot-${index}`}
                      type="button"
                      onClick={() => setOpenMediaIndex(index)}
                      className={`h-2 rounded-full transition-all ${
                        openMediaIndex === index
                          ? "w-7 bg-white"
                          : "w-2 bg-white/50 hover:bg-white/80"
                      }`}
                      aria-label={`Show media ${index + 1}`}
                      aria-current={
                        openMediaIndex === index ? "true" : undefined
                      }
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
