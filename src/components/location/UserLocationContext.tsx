"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { Coordinates } from "@/lib/distance";

export type LocationPermissionState =
  | "checking"
  | "prompt"
  | "granted"
  | "denied"
  | "unsupported";

interface UserLocationContextValue {
  location: Coordinates | null;
  locationError: string | null;
  permissionStatus: LocationPermissionState;
  requestLocation: () => Promise<Coordinates | null>;
}

const UserLocationContext = createContext<
  UserLocationContextValue | undefined
>(undefined);

interface UserLocationProviderProps {
  children: ReactNode;
}

export function UserLocationProvider({
  children,
}: UserLocationProviderProps) {
  const [location, setLocation] =
    useState<Coordinates | null>(null);

  const [locationError, setLocationError] =
    useState<string | null>(null);

  const [permissionStatus, setPermissionStatus] = 
    useState<LocationPermissionState>("checking");

  const requestLocation = useCallback(
    (): Promise<Coordinates | null> => {
        if (!navigator.geolocation) {
            setPermissionStatus("unsupported");
            setLocationError(
                "Your browser does not support location access.",
            );

            return Promise.resolve(null);
        }

        return new Promise((resolve) => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const coordinates: Coordinates = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    };

                    setLocation(coordinates);
                    setLocationError(null);
                    setPermissionStatus("granted");
                    resolve(coordinates);
                },
                (error) => {
                    if (error.code === 1) {
                        setPermissionStatus("denied");
                        setLocationError(
                            "Location access is blocked. Please enable it in your browser settings.",
                        );
                    } else {
                        setLocationError(
                            "We could not determine your location. Please try again.",
                        );
                    }

                    resolve(null);
                },
                {
                    enableHighAccuracy: false,
                    timeout: 8000,
                    maximumAge: 300000,
                },
            );
        });
    },
    [],
  );

  useEffect(() => {
    let isActive = true;
    let permissionQuery: PermissionStatus | null = null;

    async function initializeLocation() {
        await Promise.resolve();

        if (!navigator.geolocation) {
        if (isActive) {
            setPermissionStatus("unsupported");
        }

        return;
        }

        if (!navigator.permissions) {
        if (isActive) {
            setPermissionStatus("prompt");
        }

        return;
        }

        try {
        permissionQuery =
            await navigator.permissions.query({
            name: "geolocation",
            });

        if (!isActive) {
            return;
        }

        setPermissionStatus(permissionQuery.state);

        if (permissionQuery.state === "granted") {
            void requestLocation();
        }

        permissionQuery.onchange = () => {
            if (!isActive || !permissionQuery) {
            return;
            }

            setPermissionStatus(permissionQuery.state);

            if (permissionQuery.state === "granted") {
            void requestLocation();
            }

            if (permissionQuery.state === "denied") {
            setLocation(null);
            }
        };
        } catch {
        if (isActive) {
            setPermissionStatus("prompt");
        }
        }
    }

    void initializeLocation();

    return () => {
        isActive = false;

        if (permissionQuery) {
        permissionQuery.onchange = null;
        }
    };
  }, [requestLocation]);

  return (
    <UserLocationContext.Provider
      value={{
        location,
        locationError,
        permissionStatus,
        requestLocation,
      }}
    >
      {children}
    </UserLocationContext.Provider>
  );
}

export function useUserLocation() {
  const context = useContext(UserLocationContext);

  if (!context) {
    throw new Error(
      "useUserLocation must be used inside UserLocationProvider",
    );
  }

  return context;
}