"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/admin-api";

/**
 * Wraps every page under /admin (except /admin/login) via the
 * (dashboard) route group's layout. Checks the JWT in localStorage on mount;
 * if it's missing or expired, redirects to the login page before rendering
 * anything protected.
 */
export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/admin/login");
      return;
    }
    setChecked(true);
  }, [router]);

  if (!checked) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-400">Loading…</p>
      </div>
    );
  }

  return <>{children}</>;
}
