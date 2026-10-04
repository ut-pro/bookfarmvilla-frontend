import { API_BASE_URL } from "@/lib/api-config";

import type {
  PropertyApiResponse,
  PropertyCardData,
} from "@/types/property";

const PROPERTY_PLACEHOLDER = "/images/property-placeholder.svg";

function isSupportedImageUrl(imageUrl: string): boolean {
  try {
    const parsedUrl = new URL(imageUrl);

    return parsedUrl.protocol === "https:" && parsedUrl.hostname.length > 0;
  } catch {
    return false;
  }
}

function getPropertyImageUrls(
  property: PropertyApiResponse,
): string[] {
  const sortedImages = [...(property.images ?? [])].sort(
    (firstImage, secondImage) =>
      Number(secondImage.isPrimary) - Number(firstImage.isPrimary),
  );

  const supportedUrls = sortedImages
    .map((image) => image.url)
    .filter(isSupportedImageUrl);

  return supportedUrls.length > 0
    ? supportedUrls
    : [PROPERTY_PLACEHOLDER];
}

function mapPropertyToCard(
  property: PropertyApiResponse,
): PropertyCardData {
  const amenities = property.amenities ?? [];
  const hasPool = amenities.some((amenity) =>
    amenity.toLowerCase().includes("pool"),
  );

  const imageUrls = getPropertyImageUrls(property);

  return {
    id: property.id,
    name: property.title,
    type: property.type,
    description: property.description?.trim() || undefined,
    location: property.address?.trim() || property.city,
    city: property.city,
    latitude:
      typeof property.latitude === "number" &&
      Number.isFinite(property.latitude)
        ? property.latitude
        : null,

    longitude:
      typeof property.longitude === "number" &&
      Number.isFinite(property.longitude)
        ? property.longitude
        : null,
    rating:
      typeof property.averageRating === "number"
        ? property.averageRating
        : undefined,
    guestCapacity: property.capacity ?? 0,
    hasPool,
    amenities,
    startingPrice: property.startingPrice ?? undefined,
    endingPrice: property.endingPrice ?? undefined,
    imageUrl: imageUrls[0],
    imageUrls,
    status: property.status,
  };
}

interface GetActivePropertiesOptions {
  type?: PropertyCardData["type"];
  city?: string;
  minCapacity?: number;
  keyword?: string;
  page?: number;
  size?: number;
}

export async function getActiveProperties(
  {
    type,
    city,
    minCapacity,
    keyword,
    page = 0,
    size = 100,
  }: GetActivePropertiesOptions = {},
  signal?: AbortSignal,
): Promise<PropertyCardData[]> {
  const url = new URL("/api/properties", API_BASE_URL);

  url.searchParams.set("status", "ACTIVE");
  url.searchParams.set("page", String(page));
  url.searchParams.set("size", String(size));

  if (type) {
    url.searchParams.set("type", type);
  }

  if (city?.trim()) {
    url.searchParams.set("city", city.trim());
  }

  if (
    typeof minCapacity === "number" &&
    Number.isFinite(minCapacity) &&
    minCapacity > 0
  ) {
    url.searchParams.set(
      "minCapacity",
      String(minCapacity),
    );
  }

  if (keyword?.trim()) {
    url.searchParams.set(
      "keyword",
      keyword.trim(),
    );
  }

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
    signal,
  });

  if (!response.ok) {
    throw new Error(
      `Property API request failed with status ${response.status}.`,
    );
  }

  const data: unknown = await response.json();
  let properties: PropertyApiResponse[];

  if (Array.isArray(data)) {
    properties = data as PropertyApiResponse[];
  } else if (
    typeof data === "object" &&
    data !== null &&
    "content" in data &&
    Array.isArray(data.content)
  ) {
    properties = data.content as PropertyApiResponse[];
  } else if (
    typeof data === "object" &&
    data !== null &&
    "id" in data &&
    "title" in data &&
    "city" in data &&
    "images" in data
  ) {
    properties = [data as PropertyApiResponse];
  } else {
    throw new Error("Property API returned an invalid response.");
  }

  return properties
    .filter(
      (property) =>
        property.status === "ACTIVE" &&
        (!type || property.type === type),
    )
    .map(mapPropertyToCard);
}

export async function getActivePropertyCities(
  signal?: AbortSignal,
): Promise<string[]> {
  const cities = new Set<string>();
  const pageSize = 100;
  const maximumPages = 20;

  for (let page = 0; page < maximumPages; page += 1) {
    const properties = await getActiveProperties(
      {
        page,
        size: pageSize,
      },
      signal,
    );

    properties.forEach((property) => {
      const city = property.city?.trim();

      if (city) {
        cities.add(city);
      }
    });

    if (properties.length < pageSize) {
      break;
    }
  }

  return Array.from(cities).sort((firstCity, secondCity) =>
    firstCity.localeCompare(secondCity),
  );
}
