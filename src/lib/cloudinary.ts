import {
  CLOUDINARY_ALLOWED_IMAGE_TYPES,
  CLOUDINARY_CONFIG,
  CLOUDINARY_MAX_IMAGE_SIZE_BYTES,
} from "@/lib/cloudinary-config";

interface CloudinaryUploadResponse {
  secure_url?: string;
  error?: { message?: string };
}

export function validateCloudinaryImage(file: File): void {
  if (
    !CLOUDINARY_ALLOWED_IMAGE_TYPES.includes(
      file.type as (typeof CLOUDINARY_ALLOWED_IMAGE_TYPES)[number],
    )
  ) {
    throw new Error("Choose a JPG, PNG, or WebP image.");
  }

  if (file.size > CLOUDINARY_MAX_IMAGE_SIZE_BYTES) {
    throw new Error("Each image must be 10 MB or smaller.");
  }
}

export function uploadImageToCloudinary(
  file: File,
  onProgress: (percentage: number) => void,
): Promise<string> {
  validateCloudinaryImage(file);

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
      `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`,
    );
    request.timeout = 120_000;
    request.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    });
    request.addEventListener("error", () => {
      reject(new Error("Network error while uploading the image."));
    });
    request.addEventListener("timeout", () => {
      reject(new Error("Image upload timed out. Please try again."));
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
        reject(new Error("Cloudinary did not return a secure image URL."));
        return;
      }

      resolve(response.secure_url);
    });
    request.send(formData);
  });
}
