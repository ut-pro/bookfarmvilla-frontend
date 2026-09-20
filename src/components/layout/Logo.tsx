import Image from "next/image";

interface LogoProps {
  className?: string;
  priority?: boolean;
}

export default function Logo({
  className = "",
  priority = false,
}: LogoProps) {
  return (
    <div
      className={`relative h-[52px] w-[44px] shrink-0 ${className}`}
    >
      <Image
        src="/logo/brand-logo-transparent.png"
        alt="BookFarmVilla logo"
        fill
        sizes="44px"
        className="object-contain"
        priority={priority}
      />
    </div>
  );
}