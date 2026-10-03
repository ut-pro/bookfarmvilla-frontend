const DEFAULT_API_BASE_URL =
  "https://book-farm-villa-be.onrender.com";

export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL?.trim() ||
  DEFAULT_API_BASE_URL
).replace(/\/+$/, "");