const locationAliases: Array<[RegExp, string]> = [
  [/\b(?:gudgawn|gudgaon|gurgaon|gurugrm|gurugram)\b/gi, "Gurugram"],
  [/\b(?:noda|noidaa|noida)\b/gi, "Noida"],
  [/\b(?:sec|sector)\s*[-#]?\s*(\d+[a-z]?)\b/gi, "Sector $1"],
  [/\bbombay\b/gi, "Mumbai"],
  [/\bbangalore\b/gi, "Bengaluru"],
  [/\bmadras\b/gi, "Chennai"],
  [/\bcalcutta\b/gi, "Kolkata"],
];

export function normalizeAILocationText(value: string): string {
  return locationAliases.reduce(
    (normalized, [pattern, replacement]) =>
      normalized.replace(pattern, replacement),
    value,
  );
}

export function getCanonicalLocationSearch(value: string): string {
  const normalized = normalizeAILocationText(value).toLowerCase();
  if (/\bgreater\s+noida\b/.test(normalized)) return "greater noida";
  if (/\bnoida\b/.test(normalized)) return "noida";
  if (/\bgurugram\b/.test(normalized)) return "gurugram";
  if (/\bmumbai\b/.test(normalized)) return "mumbai";
  if (/\bbengaluru\b/.test(normalized)) return "bengaluru";
  if (/\bchennai\b/.test(normalized)) return "chennai";
  if (/\bkolkata\b/.test(normalized)) return "kolkata";
  return normalized.trim();
}

export function normalizeLocationForComparison(value: string): string {
  const normalized = getCanonicalLocationSearch(value);
  return normalized.replace(/\bsector\s+\d+[a-z]?\b/g, "").trim();
}
