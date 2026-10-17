"use client";

import {
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

import {
  isAuthenticated,
  subscribeToAdminAuthChanges,
} from "@/lib/admin-api";

/**
 * Wraps every page under /admin (except /admin/login) via the
 * (dashboard) route group's layout. Checks the JWT in localStorage;
 * if it's missing or expired, redirects to the login page before
 * rendering anything protected.
 */
export default function AdminAuthGuard({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();

  const authenticated = useSyncExternalStore(
    subscribeToAdminAuthChanges,
    isAuthenticated,
    () => false,
  );

  useEffect(() => {
    if (!authenticated) {
      router.replace("/admin/login");
    }
  }, [authenticated, router]);

  if (!authenticated) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-400">
          Loading…
        </p>
      </div>
    );
  }

  return <>{children}</>;
}