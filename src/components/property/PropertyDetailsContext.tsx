"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

import PropertyDetailsModal from "@/components/property/PropertyDetailsModal";
import type { PropertyCardData } from "@/types/property";

interface PropertyDetailsContextValue {
  openPropertyDetails: (property: PropertyCardData) => void;
  closePropertyDetails: () => void;
}

const PropertyDetailsContext = createContext<
  PropertyDetailsContextValue | undefined
>(undefined);

interface PropertyDetailsProviderProps {
  children: ReactNode;
}

export function PropertyDetailsProvider({
  children,
}: PropertyDetailsProviderProps) {
  const [selectedProperty, setSelectedProperty] =
    useState<PropertyCardData | null>(null);

  const openPropertyDetails = useCallback(
    (property: PropertyCardData) => {
      setSelectedProperty(property);
    },
    [],
  );

  const closePropertyDetails = useCallback(() => {
    setSelectedProperty(null);
  }, []);

  return (
    <PropertyDetailsContext.Provider
      value={{ openPropertyDetails, closePropertyDetails }}
    >
      {children}

      {selectedProperty && (
        <PropertyDetailsModal
          key={selectedProperty.id}
          property={selectedProperty}
          onClose={closePropertyDetails}
        />
      )}
    </PropertyDetailsContext.Provider>
  );
}

export function usePropertyDetails() {
  const context = useContext(PropertyDetailsContext);

  if (!context) {
    throw new Error(
      "usePropertyDetails must be used inside PropertyDetailsProvider",
    );
  }

  return context;
}
