"use client";

import { useState } from "react";
import { Eye, MapPin, MessageCircle, Users, Waves } from "lucide-react";
import { formatIndianCurrency } from "@/lib/formatters";

export interface AIProperty {
  id: string;
  title: string;
  description?: string | null;
  type?: string | null;
  address?: string | null;
  city?: string | null;
  priceRange?: string | null;
  capacity?: number | null;
  contactPhone?: string | null;
  amenities?: string[];
  averageRating?: number | null;
  images?: { id: string; url: string; primary: boolean }[];
}

interface Props {
  property: AIProperty;
}

function whatsappUrl(phone?: string | null) {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : null;
}

export default function AIPropertyCard({ property }: Props) {
  const [showDetails, setShowDetails] = useState(false);

  const image = property.images?.find((item) => item.primary)?.url
    ?? property.images?.[0]?.url;

  const hasPool = property.amenities?.some((a) =>
    a.toLowerCase().includes("pool"),
  );

  const whatsapp = whatsappUrl(property.contactPhone);

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="relative h-36 overflow-hidden bg-gray-100">
        {image ? (
          <img
            src={image}
            alt={`${property.title} in ${property.city ?? "India"}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            No verified image
          </div>
        )}

        {property.type && (
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold text-[#1E8A32] shadow">
            {property.type.replaceAll("_", " ")}
          </span>
        )}
      </div>

      <div className="p-3.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-sm font-bold text-[#0F172A]">
            {property.title}
          </h3>

          {typeof property.averageRating === "number" && property.averageRating > 0 && (
            <span className="shrink-0 text-xs font-semibold text-amber-600">
              ★ {property.averageRating.toFixed(1)}
            </span>
          )}
        </div>

        {property.city && (
          <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
            <MapPin size={12} />
            <span className="line-clamp-1">{property.city}</span>
          </p>
        )}

        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5 text-[11px] text-gray-600">
          {typeof property.capacity === "number" && (
            <span className="flex items-center gap-1">
              <Users size={12} className="text-[#2EAD45]" />
              {property.capacity} guests
            </span>
          )}

          {hasPool && (
            <span className="flex items-center gap-1 text-blue-500">
              <Waves size={12} />
              Pool
            </span>
          )}

          {property.amenities?.slice(0, 3).map((amenity) => (
            <span key={amenity} className="rounded-full bg-gray-50 px-2 py-1">
              {amenity}
            </span>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between gap-2 border-t border-gray-100 pt-3">
          <span className="line-clamp-1 text-sm font-bold text-[#0F172A]">
            {property.priceRange || "Price on request"}
          </span>

          <div className="flex gap-1.5">
            {whatsapp && (
              <a
                href={whatsapp}
                target="_blank"
                rel="noreferrer"
                aria-label={`WhatsApp ${property.title}`}
                className="rounded-lg bg-green-50 p-2 text-[#1E8A32] hover:bg-[#2EAD45] hover:text-white"
              >
                <MessageCircle size={15} />
              </a>
            )}

            <button
              type="button"
              onClick={() => setShowDetails((current) => !current)}
              className="flex items-center gap-1 rounded-lg bg-[#2EAD45] px-3 py-2 text-[11px] font-semibold text-white hover:bg-[#1E8A32]"
            >
              <Eye size={13} />
              {showDetails ? "Hide" : "View"}
            </button>
          </div>
        </div>

        {showDetails && (
          <div className="mt-3 rounded-xl bg-gray-50 p-3 text-[11px] leading-relaxed text-gray-600">
            {property.address && (
              <p><strong className="text-gray-800">Address:</strong> {property.address}</p>
            )}
            {property.description && (
              <p className="mt-1 line-clamp-4">{property.description}</p>
            )}
            {!property.address && !property.description && (
              <p>No additional verified details are available.</p>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
