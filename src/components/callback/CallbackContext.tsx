"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

import type { PropertyCardData } from "@/types/property";

interface CallbackContextValue {
  isOpen: boolean;
  selectedProperty: PropertyCardData | null;
  openGeneralCallback: () => void;
  openPropertyCallback: (property: PropertyCardData) => void;
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

  const openGeneralCallback = () => {
    setSelectedProperty(null);
    setIsOpen(true);
  };

  const openPropertyCallback = (
    property: PropertyCardData,
  ) => {
    setSelectedProperty(property);
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
        openGeneralCallback,
        openPropertyCallback,
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