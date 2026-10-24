const DEFAULT_API_BASE_URL = "https://book-farm-villa-be.onrender.com";
const configuredApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();

function isLocalOrInvalidApiUrl(value: string): boolean {
  try {
    const parsedUrl = new URL(value);
    const isHttpProtocol = parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
    const isLocalHost = ["localhost", "127.0.0.1", "::1"].includes(
      parsedUrl.hostname.toLowerCase(),
    );

    return !isHttpProtocol || isLocalHost;
  } catch {
    return true;
  }
}

// Public frontend requests must always use the deployed API. A stale local
// .env value must never cause browser requests to target localhost:3000/8080.
export const API_BASE_URL = (
  !configuredApiBaseUrl || isLocalOrInvalidApiUrl(configuredApiBaseUrl)
    ? DEFAULT_API_BASE_URL
    : configuredApiBaseUrl
).replace(/\/+$/, "");
