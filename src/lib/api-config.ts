const DEFAULT_API_BASE_URL = "https://api.bookfarmvilla.com";
const configuredApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
const isProductionBuild = process.env.NODE_ENV === "production";
const configuredUrlIsLocalhost = (() => {
  if (!configuredApiBaseUrl) return false;
  try {
    const hostname = new URL(configuredApiBaseUrl).hostname;
    return ["localhost", "127.0.0.1", "::1"].includes(hostname);
  } catch {
    return false;
  }
})();

// Production must always call the public backend, never the developer's local machine.
export const API_BASE_URL = (
  isProductionBuild && configuredUrlIsLocalhost
    ? DEFAULT_API_BASE_URL
    : configuredApiBaseUrl || DEFAULT_API_BASE_URL
).replace(/\/+$/, "");
