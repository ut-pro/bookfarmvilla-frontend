const VIDEO_FILE_EXTENSION_PATTERN = /\.(mp4|webm|mov|m4v|ogg)(?:$|[?#])/i;

export function isVideoUrl(url: string): boolean {
  const normalizedUrl = url.trim();

  if (!normalizedUrl) {
    return false;
  }

  try {
    const parsedUrl = new URL(normalizedUrl);
    const pathWithSearch = `${parsedUrl.pathname}${parsedUrl.search}`;

    return (
      parsedUrl.pathname.toLowerCase().includes("/video/upload/") ||
      VIDEO_FILE_EXTENSION_PATTERN.test(pathWithSearch)
    );
  } catch {
    return VIDEO_FILE_EXTENSION_PATTERN.test(normalizedUrl);
  }
}

export function getVideoMimeType(url: string): string | undefined {
  const normalizedUrl = url.toLowerCase().split(/[?#]/)[0];

  if (normalizedUrl.endsWith(".webm")) {
    return "video/webm";
  }

  if (normalizedUrl.endsWith(".mov")) {
    return "video/quicktime";
  }

  if (normalizedUrl.endsWith(".ogg")) {
    return "video/ogg";
  }

  if (
    normalizedUrl.endsWith(".mp4") ||
    normalizedUrl.endsWith(".m4v") ||
    normalizedUrl.includes("/video/upload/")
  ) {
    return "video/mp4";
  }

  return undefined;
}
