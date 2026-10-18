import { cache } from "react";

import { getActiveProperties } from "@/lib/property-api";
import { getActiveVendors } from "@/lib/public-api";
import type { PropertyCardData, PropertyType } from "@/types/property";
import type {
  VendorCategoryFilter,
  VendorResponse,
} from "@/types/vendor";

export const getSeoProperties = cache(
  async (
    type?: PropertyType,
    city?: string,
    minCapacity?: number,
  ): Promise<PropertyCardData[]> => {
    try {
      return await getActiveProperties({
        type,
        city,
        minCapacity,
        size: 100,
      });
    } catch (error) {
      console.error("Unable to load property SEO data:", error);
      return [];
    }
  },
);

export const getSeoVendors = cache(
  async (
    category?: VendorCategoryFilter,
  ): Promise<VendorResponse[]> => {
    try {
      const apiCategory =
        category === "OTHER_SERVICES"
          ? "OTHER"
          : category;

      const response = await getActiveVendors({
        category: apiCategory,
        size: 100,
      });

      return response.content;
    } catch (error) {
      console.error(
        "Unable to load vendor SEO data:",
        error,
      );

      return [];
    }
  },
);

export function getPropertySocialImage(
  properties: PropertyCardData[],
): string {
  return (
    properties.find(
      (property) =>
        property.imageUrl !== "/images/property-placeholder.svg",
    )?.imageUrl ?? "/logo/brand-logo-transparent.png"
  );
}

export function getVendorSocialImage(
  vendors: VendorResponse[],
): string {
  return (
    vendors
      .flatMap((vendor) => vendor.images ?? [])
      .find((image) => {
        if (!image.url?.trim()) {
          return false;
        }

        try {
          return ["https:", "http:"].includes(
            new URL(image.url).protocol,
          );
        } catch {
          return false;
        }
      })?.url ??
    "/logo/brand-logo-transparent.png"
  );
}
