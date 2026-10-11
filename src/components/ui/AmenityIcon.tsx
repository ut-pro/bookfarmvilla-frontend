import {
  Bath,
  BedDouble,
  Car,
  CookingPot,
  Flame,
  Gamepad2,
  Music,
  PawPrint,
  ShieldCheck,
  Snowflake,
  Sparkles,
  Trees,
  UtensilsCrossed,
  Waves,
  Wifi,
  Zap,
} from "lucide-react";

interface AmenityIconProps {
  amenity: string;
  size?: number;
  className?: string;
}

type AmenityIconName =
  | "pool"
  | "wifi"
  | "ac"
  | "bed"
  | "garden"
  | "parking"
  | "power"
  | "security"
  | "kitchen"
  | "food"
  | "music"
  | "games"
  | "bath"
  | "fire"
  | "pet"
  | "default";

function getAmenityIconName(
  amenity: string,
): AmenityIconName {
  const normalizedAmenity = amenity
    .trim()
    .toLowerCase();

  if (
    normalizedAmenity.includes("pool") ||
    normalizedAmenity.includes("swimming")
  ) {
    return "pool";
  }

  if (
    normalizedAmenity.includes("wi-fi") ||
    normalizedAmenity.includes("wifi") ||
    normalizedAmenity.includes("internet")
  ) {
    return "wifi";
  }

  if (
    normalizedAmenity.includes("air conditioning") ||
    normalizedAmenity.includes("air conditioner") ||
    normalizedAmenity === "ac" ||
    normalizedAmenity === "a/c"
  ) {
    return "ac";
  }

  if (
    normalizedAmenity.includes("bedroom") ||
    normalizedAmenity.includes("bed")
  ) {
    return "bed";
  }

  if (
    normalizedAmenity.includes("garden") ||
    normalizedAmenity.includes("lawn") ||
    normalizedAmenity.includes("outdoor")
  ) {
    return "garden";
  }

  if (
    normalizedAmenity.includes("parking") ||
    normalizedAmenity.includes("car park")
  ) {
    return "parking";
  }

  if (
    normalizedAmenity.includes("power backup") ||
    normalizedAmenity.includes("generator") ||
    normalizedAmenity.includes("electricity")
  ) {
    return "power";
  }

  if (
    normalizedAmenity.includes("security") ||
    normalizedAmenity.includes("cctv") ||
    normalizedAmenity.includes("guard")
  ) {
    return "security";
  }

  if (
    normalizedAmenity.includes("kitchen") ||
    normalizedAmenity.includes("cooking")
  ) {
    return "kitchen";
  }

  if (
    normalizedAmenity.includes("food") ||
    normalizedAmenity.includes("catering")
  ) {
    return "food";
  }

  if (
    normalizedAmenity.includes("music") ||
    normalizedAmenity.includes("dj")
  ) {
    return "music";
  }

  if (
    normalizedAmenity.includes("game") ||
    normalizedAmenity.includes("gaming")
  ) {
    return "games";
  }

  if (
    normalizedAmenity.includes("bathroom") ||
    normalizedAmenity.includes("bath")
  ) {
    return "bath";
  }

  if (
    normalizedAmenity.includes("bonfire") ||
    normalizedAmenity.includes("fire")
  ) {
    return "fire";
  }

  if (
    normalizedAmenity.includes("pet")
  ) {
    return "pet";
  }

  return "default";
}

export default function AmenityIcon({
  amenity,
  size = 18,
  className,
}: AmenityIconProps) {
  const iconName = getAmenityIconName(amenity);

  const iconProps = {
    size,
    className,
    "aria-hidden": true as const,
  };

  switch (iconName) {
    case "pool":
      return <Waves {...iconProps} />;

    case "wifi":
      return <Wifi {...iconProps} />;

    case "ac":
      return <Snowflake {...iconProps} />;

    case "bed":
      return <BedDouble {...iconProps} />;

    case "garden":
      return <Trees {...iconProps} />;

    case "parking":
      return <Car {...iconProps} />;

    case "power":
      return <Zap {...iconProps} />;

    case "security":
      return <ShieldCheck {...iconProps} />;

    case "kitchen":
      return <CookingPot {...iconProps} />;

    case "food":
      return <UtensilsCrossed {...iconProps} />;

    case "music":
      return <Music {...iconProps} />;

    case "games":
      return <Gamepad2 {...iconProps} />;

    case "bath":
      return <Bath {...iconProps} />;

    case "fire":
      return <Flame {...iconProps} />;

    case "pet":
      return <PawPrint {...iconProps} />;

    default:
      return <Sparkles {...iconProps} />;
  }
}