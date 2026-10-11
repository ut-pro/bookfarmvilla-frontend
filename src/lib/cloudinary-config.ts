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

export const CLOUDINARY_ALLOWED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
] as const;

export const CLOUDINARY_MAX_VIDEO_SIZE_BYTES = 100 * 1024 * 1024;
