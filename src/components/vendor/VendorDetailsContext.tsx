"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

import VendorDetailsModal from "@/components/vendor/VendorDetailsModal";
import type { VendorResponse } from "@/types/vendor";

interface VendorDetailsContextValue {
  openVendorDetails: (vendor: VendorResponse) => void;
  closeVendorDetails: () => void;
}

const VendorDetailsContext = createContext<
  VendorDetailsContextValue | undefined
>(undefined);

interface VendorDetailsProviderProps {
  children: ReactNode;
}

export function VendorDetailsProvider({
  children,
}: VendorDetailsProviderProps) {
  const [selectedVendor, setSelectedVendor] =
    useState<VendorResponse | null>(null);

  const openVendorDetails = useCallback(
    (vendor: VendorResponse) => {
      setSelectedVendor(vendor);
    },
    [],
  );

  const closeVendorDetails = useCallback(() => {
    setSelectedVendor(null);
  }, []);

  return (
    <VendorDetailsContext.Provider
      value={{
        openVendorDetails,
        closeVendorDetails,
      }}
    >
      {children}

      {selectedVendor && (
        <VendorDetailsModal
          key={selectedVendor.id}
          vendor={selectedVendor}
          onClose={closeVendorDetails}
        />
      )}
    </VendorDetailsContext.Provider>
  );
}

export function useVendorDetails() {
  const context = useContext(VendorDetailsContext);

  if (!context) {
    throw new Error(
      "useVendorDetails must be used inside VendorDetailsProvider",
    );
  }

  return context;
}