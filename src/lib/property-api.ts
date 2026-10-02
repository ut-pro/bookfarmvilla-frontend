import type {
  PropertyApiResponse,
  PropertyCardData,
  PropertyPageResponse,
} from "@/types/property";

const PROPERTY_PLACEHOLDER = "/images/property-placeholder.svg";

function getBackendUrl(): string {
  const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!backendUrl) {
    throw new Error(
      "NEXT_PUBLIC_API_BASE_URL is missing. Add it to .env.local and restart the development server.",
    );
  }

  return backendUrl.replace(/\/$/, "");
}

function isSupportedImageUrl(imageUrl: string): boolean {
  try {
    const parsedUrl = new URL(imageUrl);

    // images.unsplash.com is already allowed in the current next.config.ts.
    // Add the real backend image host to next.config.ts before allowing it here.
    return parsedUrl.hostname === "images.unsplash.com";
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
    rating:
      typeof property.averageRating === "number"
        ? property.averageRating
        : undefined,
    guestCapacity: property.capacity ?? 0,
    hasPool,
    amenities,
    priceRange: property.priceRange?.trim() || undefined,
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

export async function getActiveProperties({
  type,
  city,
  minCapacity,
  keyword,
  page = 0,
  size = 100,
}: GetActivePropertiesOptions = {}): Promise<PropertyCardData[]> {
  const url = new URL("/api/properties", getBackendUrl());

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
  });

  if (!response.ok) {
    throw new Error(
      `Property API request failed with status ${response.status}.`,
    );
  }

  const data = (await response.json()) as PropertyPageResponse;

  if (!Array.isArray(data.content)) {
    throw new Error("Property API returned an invalid response.");
  }

  return data.content
    .filter(
      (property) =>
        property.status === "ACTIVE" &&
        (!type || property.type === type),
    )
    .map(mapPropertyToCard);
}
