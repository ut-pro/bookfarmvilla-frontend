export function parseImageUrls(value: string): string[] {
  return Array.from(
    new Set(
      value
        .split(/[\s,]+/)
        .map((url) => url.trim())
        .filter(Boolean),
    ),
  );
}
