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
  X,
} from "lucide-react";

interface DetailsImageGalleryProps {
  images: string[];
  title: string;
  badge?: string;
}

export default function DetailsImageGallery({
  images,
  title,
  badge,
}: DetailsImageGalleryProps) {
  const safeImages = images.filter(Boolean);

  const [openImageIndex, setOpenImageIndex] =
    useState<number | null>(null);

  const touchStartX = useRef<number | null>(null);

  const showPreviousImage = useCallback(() => {
    setOpenImageIndex((currentIndex) => {
      if (currentIndex === null) {
        return null;
      }

      return currentIndex === 0
        ? safeImages.length - 1
        : currentIndex - 1;
    });
  }, [safeImages.length]);

  const showNextImage = useCallback(() => {
    setOpenImageIndex((currentIndex) => {
      if (currentIndex === null) {
        return null;
      }

      return currentIndex === safeImages.length - 1
        ? 0
        : currentIndex + 1;
    });
  }, [safeImages.length]);

  const closeGallery = useCallback(() => {
    setOpenImageIndex(null);
  }, []);

  useEffect(() => {
    if (openImageIndex === null) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeGallery();
      }

      if (event.key === "ArrowLeft") {
        showPreviousImage();
      }

      if (event.key === "ArrowRight") {
        showNextImage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [
    closeGallery,
    openImageIndex,
    showNextImage,
    showPreviousImage,
  ]);

  const handleTouchStart = (
    event: TouchEvent<HTMLDivElement>,
  ) => {
    touchStartX.current =
      event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (
    event: TouchEvent<HTMLDivElement>,
  ) => {
    if (touchStartX.current === null) {
      return;
    }

    const touchEndX =
      event.changedTouches[0]?.clientX;

    if (typeof touchEndX !== "number") {
      touchStartX.current = null;
      return;
    }

    const difference =
      touchStartX.current - touchEndX;

    if (Math.abs(difference) >= 50) {
      if (difference > 0) {
        showNextImage();
      } else {
        showPreviousImage();
      }
    }

    touchStartX.current = null;
  };

  if (safeImages.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center bg-gray-100 text-sm text-gray-500 sm:h-96">
        No property images available
      </div>
    );
  }

  const openGallery = (index: number) => {
    setOpenImageIndex(index);
  };

  return (
    <>
      <div className="relative">
        {safeImages.length === 1 ? (
          <button
            type="button"
            onClick={() => openGallery(0)}
            className="relative block h-72 w-full overflow-hidden bg-gray-100 sm:h-96 lg:h-[520px]"
            aria-label={`View photos of ${title}`}
          >
            <Image
              src={safeImages[0]}
              alt={`${title} — image 1`}
              fill
              priority
              unoptimized
              sizes="(max-width: 1280px) 100vw, 1200px"
              className="object-cover transition-transform duration-500 hover:scale-[1.02]"
            />
          </button>
        ) : safeImages.length === 2 ? (
          <div className="grid h-72 grid-cols-2 gap-1 sm:h-96 lg:h-[520px]">
            {safeImages.map((imageUrl, index) => (
              <button
                key={`${imageUrl}-${index}`}
                type="button"
                onClick={() => openGallery(index)}
                className="relative overflow-hidden bg-gray-100"
                aria-label={`View image ${
                  index + 1
                } of ${title}`}
              >
                <Image
                  src={imageUrl}
                  alt={`${title} — image ${index + 1}`}
                  fill
                  priority={index === 0}
                  unoptimized
                  sizes="50vw"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
              </button>
            ))}
          </div>
        ) : (
          <div className="grid h-72 grid-cols-2 grid-rows-2 gap-1 sm:h-96 lg:h-[520px] lg:grid-cols-4">
            <button
              type="button"
              onClick={() => openGallery(0)}
              className="relative col-span-2 overflow-hidden bg-gray-100 lg:row-span-2"
              aria-label={`View image 1 of ${title}`}
            >
              <Image
                src={safeImages[0]}
                alt={`${title} — image 1`}
                fill
                priority
                unoptimized
                sizes="(max-width: 1023px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
            </button>

            <button
              type="button"
              onClick={() => openGallery(1)}
              className="relative overflow-hidden bg-gray-100 lg:col-span-2"
              aria-label={`View image 2 of ${title}`}
            >
              <Image
                src={safeImages[1]}
                alt={`${title} — image 2`}
                fill
                unoptimized
                sizes="(max-width: 1023px) 50vw, 50vw"
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
            </button>

            <button
              type="button"
              onClick={() => openGallery(2)}
              className="group relative overflow-hidden bg-gray-100 lg:col-span-2"
              aria-label={`View all ${safeImages.length} photos of ${title}`}
            >
              <Image
                src={safeImages[2]}
                alt={`${title} — image 3`}
                fill
                unoptimized
                sizes="(max-width: 1023px) 50vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />

              <span className="absolute inset-0 bg-black/35 transition-colors group-hover:bg-black/45" />

              <span className="absolute inset-0 flex items-center justify-center">
                <span className="inline-flex items-center gap-2 rounded-xl bg-white/95 px-4 py-2.5 text-sm font-semibold text-[#0F172A] shadow-lg">
                  <Images
                    size={17}
                    className="text-[#2EAD45]"
                    aria-hidden="true"
                  />
                  View all {safeImages.length} photos
                </span>
              </span>
            </button>
          </div>
        )}

        {badge && (
          <span className="pointer-events-none absolute left-5 top-5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-[#1E8A32] shadow-sm">
            {badge}
          </span>
        )}
      </div>

      {openImageIndex !== null && (
        <div
          className="fixed inset-0 z-[160] flex items-center justify-center bg-black/80 p-3 backdrop-blur-md sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeGallery();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${title} image gallery`}
            className="relative flex h-full w-full max-w-6xl items-center justify-center"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <button
              type="button"
              onClick={closeGallery}
              className="absolute right-0 top-0 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors hover:bg-white/25"
              aria-label="Close image gallery"
            >
              <X size={23} aria-hidden="true" />
            </button>

            <span className="absolute left-0 top-2 z-20 rounded-full bg-black/40 px-3 py-1.5 text-xs font-medium text-white">
              {openImageIndex + 1} / {safeImages.length}
            </span>

            <div className="relative h-[78vh] w-full">
              <Image
                key={safeImages[openImageIndex]}
                src={safeImages[openImageIndex]}
                alt={`${title} — image ${
                  openImageIndex + 1
                }`}
                fill
                priority
                unoptimized
                sizes="100vw"
                className="object-contain"
              />
            </div>

            {safeImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={showPreviousImage}
                  className="absolute left-0 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors hover:bg-white/25"
                  aria-label="Show previous image"
                >
                  <ChevronLeft
                    size={28}
                    aria-hidden="true"
                  />
                </button>

                <button
                  type="button"
                  onClick={showNextImage}
                  className="absolute right-0 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors hover:bg-white/25"
                  aria-label="Show next image"
                >
                  <ChevronRight
                    size={28}
                    aria-hidden="true"
                  />
                </button>

                <div className="absolute bottom-2 left-1/2 z-20 flex max-w-[80%] -translate-x-1/2 gap-2 overflow-x-auto rounded-full bg-black/40 px-3 py-2">
                  {safeImages.map((imageUrl, index) => (
                    <button
                      key={`${imageUrl}-dot-${index}`}
                      type="button"
                      onClick={() =>
                        setOpenImageIndex(index)
                      }
                      className={`h-2 rounded-full transition-all ${
                        openImageIndex === index
                          ? "w-7 bg-white"
                          : "w-2 bg-white/50 hover:bg-white/80"
                      }`}
                      aria-label={`Show image ${index + 1}`}
                      aria-current={
                        openImageIndex === index
                          ? "true"
                          : undefined
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