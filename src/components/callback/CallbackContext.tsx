"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

import type { PropertyCardData } from "@/types/property";
import type { VendorResponse } from "@/types/vendor";

interface CallbackContextValue {
  isOpen: boolean;
  selectedProperty: PropertyCardData | null;
  selectedVendor: VendorResponse | null;
  openGeneralCallback: () => void;
  openPropertyCallback: (property: PropertyCardData) => void;
  openVendorCallback: (vendor: VendorResponse) => void;
  closeCallback: () => void;
}

const CallbackContext = createContext<
  CallbackContextValue | undefined
>(undefined);

interface CallbackProviderProps {
  children: ReactNode;
}

export function CallbackProvider({
  children,
}: CallbackProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] =
    useState<PropertyCardData | null>(null);
  const [selectedVendor, setSelectedVendor] =
  useState<VendorResponse | null>(null);

  const openGeneralCallback = () => {
    setSelectedProperty(null);
    setSelectedVendor(null);
    setIsOpen(true);
  };

  const openPropertyCallback = (
    property: PropertyCardData,
  ) => {  
    setSelectedVendor(null);
    setSelectedProperty(property);
    setIsOpen(true);
  };

  const openVendorCallback = (vendor: VendorResponse) => {
    setSelectedProperty(null);
    setSelectedVendor(vendor);
    setIsOpen(true);
  };

  const closeCallback = () => {
    setIsOpen(false);
  };

  return (
    <CallbackContext.Provider
      value={{
        isOpen,
        selectedProperty,
        selectedVendor,
        openGeneralCallback,
        openPropertyCallback,
        openVendorCallback,
        closeCallback,
      }}
    >
      {children}
    </CallbackContext.Provider>
  );
}

export function useCallbackModal() {
  const context = useContext(CallbackContext);

  if (!context) {
    throw new Error(
      "useCallbackModal must be used inside CallbackProvider",
    );
  }

  return context;
}