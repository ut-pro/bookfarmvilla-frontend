"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { LoaderCircle, Trash2, Upload } from "lucide-react";
import { uploadMediaToCloudinary } from "@/lib/cloudinary";
import { parseImageUrls } from "@/lib/image-urls";

interface ImageUrlFieldProps {
  value: string[];
  onChange: (urls: string[]) => void;
  onUploadingChange: (uploading: boolean) => void;
}

export default function ImageUrlField({
  value,
  onChange,
  onUploadingChange,
}: ImageUrlFieldProps) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFiles = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.currentTarget.files ?? []);
    if (files.length === 0) return;

    setUploading(true);
    onUploadingChange(true);
    setUploadError(null);
    const errors: string[] = [];
    let currentUrls = [...value];

    try {
      for (const [index, file] of files.entries()) {
        setUploadProgress(
          `Uploading ${index + 1} of ${files.length}: ${file.name} (0%)`,
        );
        try {
          const url = await uploadMediaToCloudinary(file, (percentage) => {
            setUploadProgress(
              `Uploading ${index + 1} of ${files.length}: ${file.name} (${percentage}%)`,
            );
          });
          currentUrls = Array.from(new Set([...currentUrls, url]));
          onChange(currentUrls);
        } catch (error) {
          errors.push(
            `${file.name}: ${
              error instanceof Error ? error.message : "Upload failed."
            }`,
          );
        }
      }

      if (errors.length > 0) {
        setUploadError(errors.join(" "));
      }
    } finally {
      setUploading(false);
      onUploadingChange(false);
      setUploadProgress("");
      if (fileInput.current) fileInput.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <label
          htmlFor="admin-image-urls"
          className="mb-1 block text-sm font-semibold text-gray-700"
        >
          Image URLs
        </label>
        <textarea
          id="admin-image-urls"
          value={value.join("\n")}
          onChange={(event) => onChange(parseImageUrls(event.target.value))}
          disabled={uploading}
          rows={3}
          placeholder="Paste links separated by spaces, commas, or new lines"
          className="w-full resize-none rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-500"
        />
        <p className="mt-1 text-xs text-gray-500">
          You can paste multiple links or upload images and videos below.
        </p>
      </div>

      <input
        ref={fileInput}
        type="file"
        accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime,.jpg,.jpeg,.png,.webp,.mp4,.webm,.mov"
        multiple
        className="hidden"
        onChange={handleFiles}
        disabled={uploading}
      />
      <button
        type="button"
        onClick={() => fileInput.current?.click()}
        disabled={uploading}
        className="inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-4 py-2.5 text-sm font-semibold text-violet-700 hover:bg-violet-100 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {uploading ? (
          <LoaderCircle size={16} className="animate-spin" />
        ) : (
          <Upload size={16} />
        )}
        {uploading ? uploadProgress : "Upload images or videos to Cloudinary"}
      </button>

      {uploadError && (
        <p className="text-sm text-red-600" role="alert">
          {uploadError}
        </p>
      )}

      {value.length > 0 && (
        <ul className="space-y-2">
          {value.map((url) => (
            <li
              key={url}
              className="flex min-w-0 items-center gap-2 rounded-lg border border-gray-100 px-3 py-2"
            >
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="min-w-0 flex-1 truncate text-sm text-violet-700 hover:underline"
                title={url}
              >
                {url}
              </a>
              <button
                type="button"
                onClick={() => onChange(value.filter((imageUrl) => imageUrl !== url))}
                disabled={uploading}
                className="rounded-lg p-1.5 text-red-500 hover:bg-red-50 disabled:opacity-50"
                aria-label="Remove image URL"
              >
                <Trash2 size={15} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
