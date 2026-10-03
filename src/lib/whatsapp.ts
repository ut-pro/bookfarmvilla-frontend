const DEFAULT_WHATSAPP_NUMBER =
  "918766367427";

export const WHATSAPP_NUMBER = (
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim() ||
  DEFAULT_WHATSAPP_NUMBER
).replace(/\D/g, "");

export function buildWhatsAppUrl(
  message: string,
): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    message,
  )}`;
}