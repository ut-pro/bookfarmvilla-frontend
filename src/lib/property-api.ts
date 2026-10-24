import { API_BASE_URL } from "@/lib/api-config";
import { isVideoUrl } from "@/lib/media";

import type {
  PropertyApiResponse,
  PropertyCardData,
} from "@/types/property";

const PROPERTY_PLACEHOLDER = "/images/property-placeholder.svg";

function isSupportedMediaUrl(mediaUrl: string): boolean {
  try {
    const parsedUrl = new URL(mediaUrl);

    return parsedUrl.protocol === "https:" && parsedUrl.hostname.length > 0;
  } catch {
    return false;
  }
}

function getPropertyMediaUrls(
  property: PropertyApiResponse,
): string[] {
  const imageObjectUrls = [...(property.images ?? [])]
    .sort(
      (firstMedia, secondMedia) =>
        Number(secondMedia.isPrimary) - Number(firstMedia.isPrimary),
    )
    .map((media) => media.url?.trim())
    .filter((mediaUrl): mediaUrl is string => Boolean(mediaUrl));
  const cardImageUrls = (property.imageUrls ?? [])
    .map((mediaUrl) => mediaUrl?.trim())
    .filter((mediaUrl): mediaUrl is string => Boolean(mediaUrl));

  // Property list API uses PropertyCardResponse.imageUrls; detail APIs may use
  // PropertyResponse.images[].url. Support both actual backend response shapes.
  return [...imageObjectUrls, ...cardImageUrls].filter(isSupportedMediaUrl);
}

function mapPropertyToCard(
  property: PropertyApiResponse,
): PropertyCardData {
  const amenities = property.amenities ?? [];
  const hasPool = amenities.some((amenity) =>
    amenity.toLowerCase().includes("pool"),
  );

  const mediaUrls = getPropertyMediaUrls(property);
  const imageUrls = mediaUrls.filter((mediaUrl) => !isVideoUrl(mediaUrl));
  const videoUrls = mediaUrls.filter(isVideoUrl);
  const primaryImageUrl = imageUrls[0] ?? PROPERTY_PLACEHOLDER;

  return {
    id: property.id,
    slug: property.slug?.trim() || String(property.id),
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
    rating: [property.averageRating, property.rating].find(
      (value): value is number =>
        typeof value === "number" && Number.isFinite(value) && value > 0,
    ),
    reviewCount: [
      property.reviewCount,
      property.totalReviews,
      property.reviewsCount,
      property.numberOfReviews,
      property.ratingsCount,
    ].find(
      (count): count is number =>
        typeof count === "number" && Number.isFinite(count) && count >= 0,
    ),
    guestCapacity: property.capacity ?? 0,
    hasPool,
    amenities,
    startingPrice: property.startingPrice ?? undefined,
    endingPrice: property.endingPrice ?? undefined,
    imageUrl: primaryImageUrl,
    imageUrls:
      imageUrls.length > 0 ? imageUrls : [PROPERTY_PLACEHOLDER],
    videoUrls,
    mediaUrls,
    // List responses are already filtered by status=ACTIVE and omit status.
    status: property.status ?? "ACTIVE",
  };
}

interface GetActivePropertiesOptions {
  type?: PropertyCardData["type"];
  city?: string;
  minCapacity?: number;
  keyword?: string;
  sort?: string;
  page?: number;
  size?: number;
}

export async function getActiveProperties(
  {
    type,
    city,
    minCapacity,
    keyword,
    sort,
    page = 0,
    size = 100,
  }: GetActivePropertiesOptions = {},
  signal?: AbortSignal,
): Promise<PropertyCardData[]> {
  // Public property cards endpoint returns active properties by default.
  // It uses the v2 card DTO (imageUrls, averageRating, reviewCount).
  const url = new URL("/api/v2/properties/cards", API_BASE_URL);

  url.searchParams.set("page", String(page));
  url.searchParams.set("size", String(size));

  if (type) {
    url.searchParams.append("types", type);
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

  if (sort?.trim() && sort !== "relevance" && sort !== "distance_asc") {
    const sortMap: Record<string, { by: string; direction: string }> = {
      price_asc: { by: "startingPrice", direction: "asc" },
      price_desc: { by: "startingPrice", direction: "desc" },
      rating_desc: { by: "averageRating", direction: "desc" },
      newest: { by: "createdAt", direction: "desc" },
    };
    const mappedSort = sortMap[sort];
    if (mappedSort) {
      url.searchParams.set("sortBy", mappedSort.by);
      url.searchParams.set("sortDirection", mappedSort.direction);
    }
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
    "city" in data
  ) {
    properties = [data as PropertyApiResponse];
  } else {
    throw new Error("Property API returned an invalid response.");
  }

  return properties
    .filter(
      (property) =>
        // /api/v2/properties/cards returns active properties by default and
        // its card DTO normally omits status. Reject inactive rows if present.
        (property.status == null || property.status.toUpperCase() === "ACTIVE") &&
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

export async function getPropertyBySlug(
  propertySlug: string,
  signal?: AbortSignal,
): Promise<PropertyCardData | null> {
  const normalizedSlug = propertySlug.trim();

  if (!normalizedSlug) {
    return null;
  }

  const url = new URL(
    `/api/properties/${encodeURIComponent(normalizedSlug)}`,
    API_BASE_URL,
  );

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
    signal,
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      `Property detail request failed with status ${response.status}.`,
    );
  }

  const data: unknown = await response.json();

  if (
    typeof data !== "object" ||
    data === null ||
    !("id" in data) ||
    !("slug" in data) ||
    !("title" in data) ||
    !("city" in data) ||
    !("type" in data)
  ) {
    throw new Error(
      "Property detail API returned an invalid response.",
    );
  }

  const property = data as PropertyApiResponse;

  if (property.status !== undefined && property.status !== "ACTIVE") {
    return null;
  }

  return mapPropertyToCard(property);
}

