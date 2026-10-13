"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import {
  LocateFixed,
  X,
} from "lucide-react";

import { useUserLocation } from "@/components/location/UserLocationContext";

const PROMPT_DELAY = 7000;

function isLocationRelevantPage(
  pathname: string,
): boolean {
  return (
    pathname === "/" ||
    pathname.startsWith("/properties") ||
    pathname.startsWith("/vendors")
  );
}

export default function LocationPermissionPrompt() {
  const pathname = usePathname();

  const {
    location,
    permissionStatus,
    requestLocation,
  } = useUserLocation();

  const [visibleForPath, setVisibleForPath] =
    useState<string | null>(null);

  const [hiddenForPath, setHiddenForPath] =
    useState<string | null>(null);

  const [isRequesting, setIsRequesting] =
    useState(false);

  const allowButtonRef =
    useRef<HTMLButtonElement>(null);

  const canRequestLocation =
    permissionStatus === "prompt" ||
    permissionStatus === "denied";

  useEffect(() => {
    if (
      !isLocationRelevantPage(pathname) ||
      location ||
      !canRequestLocation ||
      hiddenForPath === pathname
    ) {
      return;
    }

    let timer = 0;

    const schedulePrompt = (delay: number) => {
    timer = window.setTimeout(() => {
        const hasOpenModal = document.querySelector(
        '[role="dialog"][aria-modal="true"]',
        );

        if (hasOpenModal) {
        schedulePrompt(3000);
        return;
        }

        setVisibleForPath(pathname);
    }, delay);
    };

    schedulePrompt(PROMPT_DELAY);

    return () => window.clearTimeout(timer);
  }, [
    canRequestLocation,
    hiddenForPath,
    location,
    pathname,
  ]);

  const isVisible =
    visibleForPath === pathname &&
    hiddenForPath !== pathname &&
    !location;

  const hideForCurrentPage = () => {
    setVisibleForPath(null);
    setHiddenForPath(pathname);
  };

  const handleAllowLocation = async () => {
    setIsRequesting(true);

    try {
      await requestLocation();
    } finally {
      setIsRequesting(false);
      hideForCurrentPage();
    }
  };

  useEffect(() => {
    if (!isVisible) {
        return;
    }

    const previousOverflow =
        document.body.style.overflow;

    document.body.style.overflow = "hidden";
    allowButtonRef.current?.focus();

    const handleEscape = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
            setVisibleForPath(null);
            setHiddenForPath(pathname);
        }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
        document.body.style.overflow =
        previousOverflow;

        window.removeEventListener(
            "keydown",
            handleEscape,
        );
    };
  }, [isVisible, pathname]);

  if (!isVisible) {
    return null;
  }

  const isDenied = permissionStatus === "denied";

  return (
    <div
        className="fixed inset-0 z-[140] flex h-[100dvh] items-center justify-center bg-black/50 p-3 backdrop-blur-sm sm:p-4"
        onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
                hideForCurrentPage();
            }
        }}
    >
        <aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="location-prompt-title"
            aria-describedby="location-prompt-description"
            className="relative max-h-[calc(100dvh-1.5rem)] w-full max-w-md overflow-y-auto overscroll-contain rounded-3xl border border-gray-100 bg-white p-5 shadow-2xl sm:p-7"
        >
        <button
            type="button"
            onClick={hideForCurrentPage}
            className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-[#0F172A] sm:right-4 sm:top-4"
            aria-label="Dismiss location request"
        >
            <X size={18} aria-hidden="true" />
        </button>

        <div className="flex items-start gap-3 pr-10 sm:gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#DCFCE7] sm:h-14 sm:w-14">
            <LocateFixed
                size={25}
                className="text-[#2EAD45]"
                aria-hidden="true"
            />
            </div>

            <div>
            <h2
                id="location-prompt-title"
                className="text-lg font-bold text-[#0F172A]"
            >
                {isDenied
                    ? "Enable location access"
                    : "Find venues near you"}
            </h2>

            <p
                id="location-prompt-description"
                className="mt-2 text-sm leading-6 text-gray-500"
            >
                {isDenied
                    ? "Location access is blocked. Enable it from your browser settings to see distances."
                    : "Allow location access to see how far properties and service providers are from you."}
            </p>
            </div>
        </div>

        <div className="mt-5 rounded-xl bg-[#F8FAFC] px-4 py-3">
            <p className="text-xs leading-5 text-gray-500">
            Your location is only used to calculate distance
            from listings. It is not displayed publicly.
            </p>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
                type="button"
                onClick={hideForCurrentPage}
                disabled={isRequesting}
                className="min-h-11 w-full rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-60 sm:w-auto"
            >
            Not now
            </button>

            <button
                ref={allowButtonRef}
                type="button"
                onClick={() => {
                    void handleAllowLocation();
                }}
                disabled={isRequesting}
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#2EAD45] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1E8A32] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
            <LocateFixed
                size={16}
                aria-hidden="true"
            />

            {isRequesting
                ? "Checking..."
                : isDenied
                ? "Try Again"
                : "Allow Location"}
            </button>
        </div>
        </aside>
    </div>
  );
}
