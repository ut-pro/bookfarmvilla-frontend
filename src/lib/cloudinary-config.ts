// These are public unsigned-upload settings, not credentials. Never add the
// Cloudinary API secret or a signed-upload signature to frontend code.
export const CLOUDINARY_CONFIG = {
  cloudName: "yxfyom6f",
  uploadPreset: "bookfarmvilla_unsigned",
};

export const CLOUDINARY_ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const CLOUDINARY_MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;
