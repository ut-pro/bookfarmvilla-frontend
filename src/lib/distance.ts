export interface Coordinates {
  latitude: number;
  longitude: number;
}

interface OptionalCoordinates {
  latitude?: number | null;
  longitude?: number | null;
}

export function calculateDistanceInKm(
  from: Coordinates,
  to: OptionalCoordinates,
): number | undefined {
  if (
    !Number.isFinite(from.latitude) ||
    !Number.isFinite(from.longitude) ||
    typeof to.latitude !== "number" ||
    typeof to.longitude !== "number" ||
    !Number.isFinite(to.latitude) ||
    !Number.isFinite(to.longitude)
  ) {
    return undefined;
  }

  const radians = (degrees: number) =>
    (degrees * Math.PI) / 180;

  const latitudeDifference = radians(
    to.latitude - from.latitude,
  );

  const longitudeDifference = radians(
    to.longitude - from.longitude,
  );

  const haversine =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos(radians(from.latitude)) *
      Math.cos(radians(to.latitude)) *
      Math.sin(longitudeDifference / 2) ** 2;

  return (
    6371 *
    2 *
    Math.atan2(
      Math.sqrt(haversine),
      Math.sqrt(1 - haversine),
    )
  );
}