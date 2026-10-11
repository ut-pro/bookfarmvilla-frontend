import {
  CLOUDINARY_ALLOWED_VIDEO_TYPES,
  CLOUDINARY_ALLOWED_IMAGE_TYPES,
  CLOUDINARY_CONFIG,
  CLOUDINARY_MAX_IMAGE_SIZE_BYTES,
  CLOUDINARY_MAX_VIDEO_SIZE_BYTES,
} from "@/lib/cloudinary-config";

interface CloudinaryUploadResponse {
  secure_url?: string;
  error?: { message?: string };
}

type UploadResourceType = "image" | "video";

function getUploadResourceType(file: File): UploadResourceType {
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (
    CLOUDINARY_ALLOWED_IMAGE_TYPES.includes(
      file.type as (typeof CLOUDINARY_ALLOWED_IMAGE_TYPES)[number],
    ) ||
    (file.type === "" && ["jpg", "jpeg", "png", "webp"].includes(extension ?? ""))
  ) {
    return "image";
  }

  if (
    CLOUDINARY_ALLOWED_VIDEO_TYPES.includes(
      file.type as (typeof CLOUDINARY_ALLOWED_VIDEO_TYPES)[number],
    ) ||
    (file.type === "" && ["mp4", "webm", "mov"].includes(extension ?? ""))
  ) {
    return "video";
  }

  throw new Error("Choose a JPG, PNG, WebP, MP4, WebM, or MOV file.");
}

export function uploadMediaToCloudinary(
  file: File,
  onProgress: (percentage: number) => void,
): Promise<string> {
  const resourceType = getUploadResourceType(file);
  const maximumSize =
    resourceType === "image"
      ? CLOUDINARY_MAX_IMAGE_SIZE_BYTES
      : CLOUDINARY_MAX_VIDEO_SIZE_BYTES;
  if (file.size > maximumSize) {
    throw new Error(
      resourceType === "image"
        ? "Each image must be 10 MB or smaller."
        : "Each video must be 100 MB or smaller.",
    );
  }

  const { cloudName, uploadPreset } = CLOUDINARY_CONFIG;
  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary upload is not configured.");
  }

  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    request.open(
      "POST",
      `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/${resourceType}/upload`,
    );
    request.timeout = resourceType === "video" ? 600_000 : 120_000;
    request.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    });
    request.addEventListener("error", () => {
      reject(new Error("Network error while uploading the media file."));
    });
    request.addEventListener("timeout", () => {
      reject(new Error("Upload timed out. Please try again."));
    });
    request.addEventListener("load", () => {
      let response: CloudinaryUploadResponse;
      try {
        response = JSON.parse(request.responseText) as CloudinaryUploadResponse;
      } catch {
        reject(new Error("Cloudinary returned an invalid upload response."));
        return;
      }

      if (request.status < 200 || request.status >= 300) {
        reject(
          new Error(
            response.error?.message ??
              `Cloudinary upload failed with status ${request.status}.`,
          ),
        );
        return;
      }

      if (!response.secure_url) {
        reject(new Error("Cloudinary did not return a secure media URL."));
        return;
      }

      resolve(response.secure_url);
    });
    request.send(formData);
  });
}
