"use client";

import { Suspense } from "react";
import PropertyManager from "@/components/admin/PropertyManager";

export default function WeddingLawnsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-gray-400">Loading…</div>}>
      <PropertyManager
        propertyType="WEDDING_LAWN"
        typeLabel="Wedding Lawn"
        typeLabelPlural="Wedding Lawns"
      />
    </Suspense>
  );
}
