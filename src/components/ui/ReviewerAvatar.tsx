"use client";

import { useState } from "react";
import Image from "next/image";

const DEFAULT_AVATARS = [
  "/images/avatars/avatar-1.svg",
  "/images/avatars/avatar-2.svg",
  "/images/avatars/avatar-3.svg",
  "/images/avatars/avatar-4.svg",
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

interface ReviewerAvatarProps {
  imageUrl?: string | null;
  reviewId?: string;
  reviewerName?: string;
  alt?: string;
  size?: number;
}

export default function ReviewerAvatar({
  imageUrl,
  reviewId,
  reviewerName,
  alt = "Reviewer avatar",
  size = 48,
}: ReviewerAvatarProps) {
  const [showFallback, setShowFallback] = useState(false);

  // Determine which avatar to use
  const identifier = reviewId || reviewerName || "default";
  const fallbackIndex = hashString(identifier) % DEFAULT_AVATARS.length;
  const fallbackAvatar = DEFAULT_AVATARS[fallbackIndex];

  const handleError = () => {
    if (!showFallback && imageUrl?.trim()) {
      setShowFallback(true);
    }
  };

  return (
    <div className="relative shrink-0 overflow-hidden rounded-full bg-gray-100" style={{ width: size, height: size }} aria-hidden="true">
      {!showFallback && imageUrl?.trim() ? (
        <Image
          src={imageUrl}
          alt={alt}
          width={size}
          height={size}
          className="object-cover transition-opacity duration-200"
          onError={handleError}
          unoptimized
        />
      ) : (
        <Image
          src={fallbackAvatar}
          alt={alt}
          width={size}
          height={size}
          className="object-cover"
          unoptimized
        />
      )}
    </div>
  );
}