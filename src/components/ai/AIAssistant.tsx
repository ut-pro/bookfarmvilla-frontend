"use client";
import { API_BASE_URL } from "@/lib/api-config";

import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import {
  ArrowDown,
  Bot,
  LocateFixed,
  MapPin,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import AIPropertyCard, { AIProperty } from "./AIPropertyCard";
import { getActiveProperties } from "@/lib/property-api";
import { useUserLocation } from "@/components/location/UserLocationContext";
import { calculateDistanceInKm } from "@/lib/distance";
import AIVendorCard from "@/components/ai/AIVendorCard";
import type { PropertyType } from "@/types/property";
import type { VendorCategory, VendorResponse } from "@/types/vendor";
import { submitLead, PublicApiError, type SubmitLeadPayload } from "@/lib/public-api";
import { siteConfig } from "@/data/site";
import {
  getCanonicalLocationSearch,
  normalizeAILocationText,
  normalizeLocationForComparison,
} from "@/lib/ai-location";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  recommendations?: {
    properties: AIProperty[];
    vendors: VendorResponse[];
  };
};

interface BookingLeadState {
  step: "target" | "details" | "retry";
  name?: string;
  phone?: string;
  propertyId?: string;
  vendorId?: string;
  listingName?: string;
  bookingMessage: string;
  eventType?: string;
  preferredDate?: string;
}

type ApiResponse = {
  message: string;
  properties: AIProperty[];
  vendors: unknown[];
  requirements?: {
    location?: string | null;
    guests?: number | null;
    budget?: number | null;
    propertyType?: string | null;
    amenities?: string[];
  };
  locationSupported?: boolean;
  locationMessage?: string | null;
};

const quickActions = [
  "Pool farmhouse in Gurugram",
  "Villa in Delhi",
  "Wedding lawn in Noida",
  "Villa in Gurugram",
  "Properties near me",
];

function isBookingIntent(message: string): boolean {
  return /\b(book|booking|reserve|reservation|want to go ahead|confirm this|book\s+(?:it|this|that)|book\s+(?:kr|kar)|kr\s+do|kar\s+do|kardo|krdo|book\s+krna|book\s+karna|book\s+kar\s+do|book\s+kr\s+do)\b/i.test(
    message,
  );
}

function isCasualChatMessage(message: string): boolean {
  return /^(?:hi|hello|hey|hii+|helo+|good morning|good afternoon|good evening|how are you|thanks|thank you)[!.?,\s]*$/i.test(
    message.trim(),
  );
}

function isMorePropertiesRequest(message: string): boolean {
  return /\b(?:kuch\s+(?:aur|or)|aur\s+(?:properties|property|options|dikhao)|or\s+(?:properties|options|dikhao)|show\s+(?:me\s+)?(?:more|other|different)|more\s+(?:properties|options|places)|other\s+(?:properties|options|places)|different\s+(?:properties|options|ones)|any\s+(?:other|more)|something else|anything else|did(?:n['’]t| not) like (?:these|those|it|this)|do not like (?:this|these|those|it)|not like (?:this|these|those|it)|not liked (?:these|those|properties|this)|don['’]t like (?:this|these|those|it)|didn['’]t like (?:this|these|those|it)|not interested in (?:this|these|those|it)|pasand nahi|pasand nahin|achha nahi|accha nahi|ye nahi|yeh nahi|same properties again|kuch naye|aur dikhao|dikha+o+)\b/i.test(
    message,
  );
}

function isPropertyDetailQuestion(message: string): boolean {
  return /\b(?:tell me more|tell me about|more about|details about|show details|explain|what does .* (?:offer|have)|does it have|is there|what about the (?:price|pool|amenities|capacity)|iske?\s+(?:baare|bare)\s+(?:mein|me)|iske?\s+(?:baare|bare)|iske?\s+baaremein|is(?:ke|ki|ko)\s+(?:baare|bare)|isko\s+(?:detail|describe)|thoda\s+aur\s+batao|aur\s+detail)\b/i.test(
    message,
  );
}

function isPositivePropertyInterest(message: string): boolean {
  if (isMorePropertiesRequest(message)) return false;
  return /\b(?:i like (?:this|that|it)|i liked (?:this|that|it)|this is (?:good|nice|great)|looks? good|like this one|choose this|this one|book (?:it|this|that)|want to book|yeh? (?:pasand|acha|accha|theek)|pasand aaya|pasand hai|accha hai|acha hai|book\s+(?:kr|kar)|book\s+krna|book\s+karna|kr\s+do|kar\s+do|kardo|krdo)\b/i.test(
    message,
  );
}

function isGuestCountReply(message: string): boolean {
  return /^\s*(?:(?:yes|yeah|yep|sure|okay|ok|haan|han|ha|bilkul)[,\s]+)?(?:(?:about|around|for)\s+)?\d{1,3}\s*(?:guests?|people|persons?|pax)?[.!]?\s*$/i.test(
    message,
  );
}

function isAffirmativeReply(message: string): boolean {
  return /^\s*(?:yes|yeah|yep|sure|okay|ok|haan|han|ha|bilkul|please do|go ahead)\b[!.?,\s]*$/i.test(
    message,
  );
}

function isPropertyEnquiryPrompt(message: string): boolean {
  return /\b(?:book(?:ing)?\s+enquir(?:y|ies)|book)\b[\s\S]{0,120}\b(?:guest|people|persons?)\b|\b(?:guest|people|persons?)\b[\s\S]{0,120}\b(?:book(?:ing)?\s+enquir(?:y|ies)|book)\b/i.test(
    message,
  );
}

function isNamedPropertyReference(
  message: string,
  properties: AIProperty[],
): boolean {
  const normalized = normalizeAILocationText(message).toLowerCase();
  return (
    properties.some((property) =>
      normalized.includes(property.title.toLowerCase()),
    ) ||
    /\b(?:farm ?house|villa|wedding lawn)\s*[\w-]*\d+\b/i.test(normalized)
  );
}

function prefersHindi(message: string): boolean {
  return /\b(?:mujhe|chahiye|dikhao|dikha|kuch|aur|nahi|nahin|pasand|kaunsa|kaisi|hai|hain|mera|meri|aapke|liye|karo|krna|karna|bhejo|bataye|batao|kr|kya|acha|accha|sahi|kitna|kitne)\b/i.test(
    message,
  );
}

function formatAssistantMessage(content: string): ReactNode {
  const renderInline = (text: string, keyPrefix: string) =>
    text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={`${keyPrefix}-${index}`}>
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });

  return content.split("\n").map((line, index) => {
    const point = line.match(/^(?:[-•]|\d+[.)])\s+(.*)$/);
    if (point) {
      return (
        <p key={index} className="my-1 pl-1">
          <span className="mr-1 text-[#2EAD45]">•</span>
          {renderInline(point[1], `line-${index}`)}
        </p>
      );
    }
    return (
      <p key={index} className={line ? "my-0.5" : "h-2"}>
        {renderInline(line, `line-${index}`)}
      </p>
    );
  });
}

function findBookingTarget(
  message: string,
  properties: AIProperty[],
  vendors: VendorResponse[],
): Pick<BookingLeadState, "propertyId" | "vendorId" | "listingName"> {
  const normalizedMessage = normalizeAILocationText(message).toLowerCase();
  const namedListings = [
    ...properties.map((property) => ({
      kind: "property" as const,
      id: property.id,
      name: property.title,
    })),
    ...vendors.map((vendor) => ({
      kind: "vendor" as const,
      id: vendor.id,
      name: vendor.name,
    })),
  ];
  const namedMatches = namedListings.filter((listing) =>
    normalizedMessage.includes(listing.name.toLowerCase()),
  );
  if (namedMatches.length === 1) {
    const [listing] = namedMatches;
    return listing.kind === "property"
      ? { propertyId: listing.id, listingName: listing.name }
      : { vendorId: listing.id, listingName: listing.name };
  }
  if (namedMatches.length > 1) {
    return {};
  }

  const ordinalMatch = normalizedMessage.match(
    /\b(?:the\s+)?(first|second|third|fourth|1st|2nd|3rd|4th)(?:\s+(?:one|property|listing|option))?\b/,
  );
  const ordinalIndex = ordinalMatch
    ? Math.floor(
        ["first", "1st", "second", "2nd", "third", "3rd", "fourth", "4th"].indexOf(
          ordinalMatch[1],
        ) / 2,
      )
    : -1;
  if (ordinalIndex >= 0) {
    const listing = namedListings[ordinalIndex];
    if (listing) {
      return listing.kind === "property"
        ? { propertyId: listing.id, listingName: listing.name }
        : { vendorId: listing.id, listingName: listing.name };
    }
  }

  const numberedMatches = namedListings.filter((listing) => {
    const titleNumbers = listing.name.match(/\d+/g) ?? [];
    return titleNumbers.some((number) =>
      new RegExp(`\\b${number}\\b`).test(normalizedMessage),
    );
  });
  if (numberedMatches.length === 1) {
    const [listing] = numberedMatches;
    return listing.kind === "property"
      ? { propertyId: listing.id, listingName: listing.name }
      : { vendorId: listing.id, listingName: listing.name };
  }
  if (numberedMatches.length > 1) {
    return {};
  }

  if (
    /\b(it|this|that|this one|that one|this property|that property|ye|yeh|yahi|isko|isey)\b/i.test(
      message,
    )
  ) {
    if (properties.length === 1) {
      return {
        propertyId: properties[0].id,
        listingName: properties[0].title,
      };
    }
    if (vendors.length === 1) {
      return { vendorId: vendors[0].id, listingName: vendors[0].name };
    }
  }

  return {};
}

function getBookingDetails(message: string): Pick<
  BookingLeadState,
  "eventType" | "preferredDate"
> {
  const eventTypes = [
    "birthday",
    "wedding",
    "engagement",
    "anniversary",
    "corporate event",
    "family gathering",
    "party",
  ];
  const eventType = eventTypes.find((type) =>
    new RegExp(`\\b${type}\\b`, "i").test(message),
  );
  const dateMatch = message.match(/\b(\d{4}-\d{2}-\d{2})\b/);

  return {
    eventType,
    preferredDate: dateMatch?.[1],
  };
}

function isValidPhoneNumber(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return digits.length === 10;
}

function parseBookingContactDetails(message: string): Pick<
  BookingLeadState,
  "name" | "phone" | "eventType" | "preferredDate"
> {
  const phone = (message.match(/(?:\+?\d[\d\s().-]*\d)/g) ?? []).find(
    (candidate) => isValidPhoneNumber(candidate),
  );
  const details = getBookingDetails(message);
  const remainingText = message
    .replace(phone ?? "", " ")
    .replace(/\b(?:name|phone|mobile|contact|number|event|date)\b\s*[:=-]?/gi, " ")
    .replace(/\b(?:birthday|wedding|engagement|anniversary|corporate event|family gathering|party)\b/gi, " ")
    .replace(/\b\d{4}-\d{2}-\d{2}\b/g, " ")
    .replace(/[,;|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const name = /[a-zA-Z]/.test(remainingText)
    ? remainingText
    : undefined;

  return {
    name: name && name.length >= 2 ? name : undefined,
    phone: phone?.trim(),
    ...details,
  };
}

function parseBudget(message: string): number | null {
  const normalizedMessage = message.toLowerCase().replace(/,/g, "");
  const match = normalizedMessage.match(
    /(?:under|below|less than|within|budget(?:\s+is)?|under\s+₹|₹)\s*₹?\s*(\d+(?:\.\d+)?)\s*(k|thousand)?|(\d+(?:\.\d+)?)\s*(k|thousand)\b/,
  );
  if (!match) return null;

  const amount = Number(match[1] ?? match[3]);
  const multiplier = match[2] ?? match[4];
  return Number.isFinite(amount) ? amount * (multiplier ? 1000 : 1) : null;
}

function toAIProperty(
  property: Awaited<ReturnType<typeof getActiveProperties>>[number],
): AIProperty {
  return {
    id: property.id,
    slug: property.slug,
    title: property.name,
    description: property.description,
    type: property.type,
    address: property.location,
    city: property.city,
    startingPrice: property.startingPrice,
    endingPrice: property.endingPrice,
    capacity: property.guestCapacity,
    latitude: property.latitude,
    longitude: property.longitude,
    amenities: property.amenities,
    averageRating: property.rating,
    images:
      property.imageUrls?.map((url, index) => ({
        id: `${property.id}-${index}`,
        url,
        isPrimary: index === 0,
      })) ?? [],
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function toVendorResponse(value: unknown): VendorResponse | null {
  if (!isRecord(value)) return null;

  const name =
    typeof value.name === "string"
      ? value.name
      : typeof value.title === "string"
        ? value.title
        : null;
  const id = typeof value.id === "string" ? value.id : null;
  const slug = typeof value.slug === "string" ? value.slug.trim() || null : null;
  const city = typeof value.city === "string" ? value.city : "";
  const rawCategory =
    typeof value.category === "string"
      ? value.category.toUpperCase()
      : typeof value.serviceType === "string"
        ? value.serviceType.toUpperCase()
        : "OTHER";
  const categories: VendorCategory[] = [
    "CATERER",
    "DECORATOR",
    "PHOTOGRAPHER",
    "MAKEUP_ARTIST",
    "DJ",
    "OTHER",
  ];
  const category = categories.includes(rawCategory as VendorCategory)
    ? (rawCategory as VendorCategory)
    : "OTHER";
  const contactPhone =
    typeof value.contactPhone === "string"
      ? value.contactPhone
      : typeof value.phone === "string"
        ? value.phone
        : "";

  if (!id || !name) return null;

  const images = Array.isArray(value.images)
    ? value.images.flatMap((image, index) => {
        if (!isRecord(image) || typeof image.url !== "string") return [];
        return [{
          id: typeof image.id === "string" ? image.id : `${id}-${index}`,
          url: image.url,
          isPrimary: image.isPrimary === true || image.primary === true,
        }];
      })
    : [];

  return {
    id,
    slug,
    name,
    category,
    description:
      typeof value.description === "string" ? value.description : null,
    city,
    priceRange:
      typeof value.priceRange === "string" ? value.priceRange : null,
    contactPhone,
    status: "ACTIVE",
    images,
    averageRating:
      typeof value.averageRating === "number" ? value.averageRating : null,
  };
}

export default function AIAssistant() {
  const pathname = usePathname();
  const {
    location,
    locationError,
    requestLocation,
  } = useUserLocation();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi! 👋 I’m Booksy. Tell me your city or area (for example, Sector 135, Noida), venue type, guest count, budget, and any must-have amenities. I’ll suggest verified listings and help send a booking enquiry.",
    },
  ]);
  const [properties, setProperties] = useState<AIProperty[]>([]);
  const [vendors, setVendors] = useState<VendorResponse[]>([]);
  const [budget, setBudget] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [locationMessage, setLocationMessage] = useState<string | null>(null);
  const [bookingLead, setBookingLead] = useState<BookingLeadState | null>(null);
  const pendingPropertyEnquiryRef = useRef<
    Pick<BookingLeadState, "propertyId" | "listingName"> | null
  >(null);
  const shownPropertyIdsRef = useRef<Set<string>>(new Set());
  
  const chatScrollRef =
   useRef<HTMLDivElement>(null);



  const [showScrollToLatest, setShowScrollToLatest] =
   useState(false);

  const canSend = useMemo(
    () => input.trim().length > 0 && !loading,
    [input, loading],
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const mobileMediaQuery = window.matchMedia("(max-width: 639px)");

    const updatePageScrollLock = () => {
      document.body.style.overflow = mobileMediaQuery.matches
        ? "hidden"
        : previousOverflow;
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    updatePageScrollLock();

    mobileMediaQuery.addEventListener(
      "change",
      updatePageScrollLock,
    );

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;

      mobileMediaQuery.removeEventListener(
        "change",
        updatePageScrollLock,
      );

      window.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const updateScrollToLatestVisibility =
    useCallback(() => {
      const scrollContainer = chatScrollRef.current;

      if (!scrollContainer) {
        return;
      }

      const distanceFromBottom =
        scrollContainer.scrollHeight -
        scrollContainer.scrollTop -
        scrollContainer.clientHeight;

      setShowScrollToLatest(
        distanceFromBottom > 120,
      );
    }, []);

  const scrollToLatest = useCallback(() => {
    const scrollContainer = chatScrollRef.current;
    if (!scrollContainer) return;

    scrollContainer.scrollTo({
      top: scrollContainer.scrollHeight,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const animationFrame =
      window.requestAnimationFrame(() => {
        scrollToLatest();
        updateScrollToLatestVisibility();
      });

    return () =>
      window.cancelAnimationFrame(animationFrame);
  }, [
    messages,
    open,
    scrollToLatest,
    updateScrollToLatestVisibility,
  ]);

  const sendMessage = async (messageOverride?: string, locationOverride?: { latitude: number; longitude: number } | null) => {
    const message = (messageOverride ?? input).trim();
    if (!message || loading) return;



    const nextMessages = [...messages, { role: "user" as const, content: message }];
    setMessages(nextMessages);
    setInput("");

    if (bookingLead) {
      if (/\b(cancel|stop|never mind)\b/i.test(message)) {
        setBookingLead(null);
        setMessages((current) => [
          ...current,
          { role: "assistant", content: "No problem. I’ve cancelled the booking enquiry." },
        ]);
        return;
      }

      if (bookingLead.step === "target") {
        const target = findBookingTarget(message, properties, vendors);
        if (!target.propertyId && !target.vendorId) {
          setMessages((current) => [
            ...current,
            {
              role: "assistant",
              content:
                "I couldn’t identify one listing from that. Please enter its name or number (for example, “Farmhouse 1319”), or say “cancel” to stop.",
            },
          ]);
          return;
        }

        setBookingLead({ ...bookingLead, ...target, step: "details" });
        setMessages((current) => [
          ...current,
          {
            role: "assistant",
            content: `Let’s send an enquiry for **${target.listingName}**.\n\nPlease share:\n• **Your name**\n• **Your 10-digit phone number**\n\nExample: Sachin, 9876543210`,
          },
        ]);
        return;
      }

      if (bookingLead.step === "details" || bookingLead.step === "retry") {
        if (bookingLead.step === "retry" && !/\bretry\b/i.test(message)) {
          setMessages((current) => [
            ...current,
            { role: "assistant", content: "Your enquiry wasn’t sent yet. Type “retry” to try again, or “cancel” to stop." },
          ]);
          return;
        }

        const parsedDetails =
          bookingLead.step === "retry"
            ? {}
            : parseBookingContactDetails(message);
        const completedBooking = {
          ...bookingLead,
          name: parsedDetails.name ?? bookingLead.name,
          phone: parsedDetails.phone ?? bookingLead.phone,
          eventType: parsedDetails.eventType ?? bookingLead.eventType,
          preferredDate:
            parsedDetails.preferredDate ?? bookingLead.preferredDate,
          step: "details" as const,
        };
        if (!completedBooking.name || !completedBooking.phone) {
          setBookingLead(completedBooking);
          if (
            !completedBooking.phone &&
            /\d/.test(message) &&
            !/[a-z]/i.test(message)
          ) {
            setMessages((current) => [
              ...current,
              {
                role: "assistant",
                content:
                  "Please share your phone number as **10 digits only**.\n\nExample: **9876543210**",
              },
            ]);
            return;
          }
          const missingDetail = !completedBooking.name
            ? "name"
            : "phone number";
          setMessages((current) => [
            ...current,
            {
              role: "assistant",
              content:
                missingDetail === "name"
                  ? "Please share your **name**."
                  : `Thanks, **${completedBooking.name}**.\n\nPlease share your **10-digit phone number**.\n\nExample: **9876543210**`,
            },
          ]);
          return;
        }

        if (!isValidPhoneNumber(completedBooking.phone)) {
          setBookingLead(completedBooking);
          setMessages((current) => [
            ...current,
            {
              role: "assistant",
              content: "Please share a valid phone number with **exactly 10 digits**.\n\nExample: **9876543210**",
            },
          ]);
          return;
        }

        if (bookingLead.step === "details" &&
          Boolean(completedBooking.propertyId) === Boolean(completedBooking.vendorId)) {
          setBookingLead({ ...completedBooking, step: "target" });
          setMessages((current) => [
            ...current,
            {
              role: "assistant",
              content:
                "Before I submit the enquiry, please tell me which property or vendor you want to contact (name or listing number).",
            },
          ]);
          return;
        }

        setLoading(true);
        try {
          const payload: SubmitLeadPayload = {
            propertyId: completedBooking.propertyId,
            vendorId: completedBooking.vendorId,
            name: completedBooking.name,
            phone: completedBooking.phone,
            eventType: completedBooking.eventType,
            preferredDate: completedBooking.preferredDate,
            message: completedBooking.bookingMessage,
          };
          await submitLead(payload);
          setBookingLead(null);
          setMessages((current) => [
            ...current,
            {
              role: "assistant",
              content: `Thanks, ${completedBooking.name}. Your booking enquiry${completedBooking.listingName ? ` for ${completedBooking.listingName}` : ""} has been sent to our team. They’ll contact you at ${completedBooking.phone}.`,
            },
          ]);
        } catch (error) {
          setBookingLead({ ...completedBooking, step: "retry" });
          setMessages((current) => [
            ...current,
            {
              role: "assistant",
              content:
                error instanceof PublicApiError
                  ? `I couldn’t submit your enquiry: ${error.message} Type “retry” to try again.`
                  : "I couldn’t submit your enquiry right now. Type “retry” to try again.",
            },
          ]);
        } finally {
          setLoading(false);
        }
        return;
      }
    }

    const pendingPropertyEnquiry = pendingPropertyEnquiryRef.current;
    if (
      pendingPropertyEnquiry &&
      (isGuestCountReply(message) || isAffirmativeReply(message))
    ) {
      if (!isGuestCountReply(message)) {
        setMessages((current) => [
          ...current,
          {
            role: "assistant",
            content: `Sure — how many guests should I include for **${pendingPropertyEnquiry.listingName}**?`,
          },
        ]);
        return;
      }

      pendingPropertyEnquiryRef.current = null;
      setBookingLead({
        step: "details",
        ...pendingPropertyEnquiry,
        bookingMessage: `Guest count: ${normalizeAILocationText(message)}`,
      });
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: `Great, I’ll include **${normalizeAILocationText(message)}** for **${pendingPropertyEnquiry.listingName}**.\n\nTo send the enquiry, please share:\n• **Your name**\n• **Your 10-digit phone number**\n\nExample: Sachin, 9876543210`,
        },
      ]);
      return;
    }

    if (isBookingIntent(message) || isPositivePropertyInterest(message)) {
      pendingPropertyEnquiryRef.current = null;
      const bookingContext = [
        ...messages
          .filter((entry) => entry.role === "user")
          .map((entry) => entry.content),
        message,
      ].join(" ");
      let target = findBookingTarget(bookingContext, properties, vendors);
      const listingQuery = bookingContext.match(
        /\b(?:farm ?house|villa|wedding lawn)\s+[\w-]+(?:\s*\([^)]*\))?/i,
      )?.[0];
      if (!target.propertyId && !target.vendorId && listingQuery) {
        try {
          const resolvedProperties = await getActiveProperties({
            keyword: listingQuery,
            city: properties.find((property) => property.city)?.city ?? undefined,
            size: 100,
          });
          const resolvedAIProperties = resolvedProperties.map((property) => ({
            ...toAIProperty(property),
            contactPhone: siteConfig.contact.phone,
          }));
          target = findBookingTarget(
            bookingContext,
            [...properties, ...resolvedAIProperties],
            vendors,
          );
          if (target.propertyId) {
            setProperties((current) => {
              const existingIds = new Set(current.map((property) => property.id));
              return [
                ...current,
                ...resolvedAIProperties.filter(
                  (property) => !existingIds.has(property.id),
                ),
              ];
            });
          }
        } catch (error) {
          console.error("Unable to resolve the selected property:", error);
        }
      }
      const details = getBookingDetails(bookingContext);
      const nextStep = target.propertyId || target.vendorId ? "details" : "target";
      setBookingLead({
        step: nextStep,
        ...target,
        ...details,
        bookingMessage: normalizeAILocationText(message),
      });
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            nextStep === "details"
              ? `Let’s send an enquiry for **${target.listingName}**.\n\nPlease share:\n• **Your name**\n• **Your 10-digit phone number**\n\nExample: Sachin, 9876543210`
              : "Which property or vendor would you like to enquire about? Please enter its name or listing number.",
        },
      ]);
      return;
    }

    setLoading(true);
    const normalizedMessage = normalizeAILocationText(message);
    const replyInHindi = prefersHindi(message);
    try {
      let coords = locationOverride ?? location;
      if (/near me|mere paas|mere pass|aas paas|nearby|around me/i.test(normalizedMessage) && !coords) {
        coords = await requestLocation();
      }

      const messageIsDetailFollowUp = isPropertyDetailQuestion(message);
      const displayedPropertyContext = messageIsDetailFollowUp
        ? properties
            .map((property) => {
              const price =
                property.startingPrice != null
                  ? `${property.startingPrice}${property.endingPrice != null ? `-${property.endingPrice}` : ""}`
                  : "not listed";
              const amenities = property.amenities?.join(", ") || "not listed";
              return `${property.title} | ${property.city ?? property.address ?? "location not listed"} | price ${price} | capacity ${property.capacity ?? "not listed"} | amenities ${amenities}`;
            })
            .join("\n")
        : "";
      const messageForAI = [
        `User's latest message: ${normalizedMessage}`,
        displayedPropertyContext
          ? `Properties already shown in this conversation:\n${displayedPropertyContext}`
          : "",
        `Use recent conversation context and reply in ${replyInHindi ? "the user's Hindi/Hinglish style" : "English"}. Answer what the user asked directly in short, useful bullet points when giving property details. Do not restart a property search or repeat recommendations unless the user asks for more options.`,
      ]
        .filter(Boolean)
        .join("\n\n");

      const response = await fetch(`${API_BASE_URL}/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageForAI,
          history: nextMessages
            .slice(0, -1)
            .slice(-20)
            .map((entry) => ({ ...entry, content: normalizeAILocationText(entry.content) })),
          latitude: coords?.latitude ?? null,
          longitude: coords?.longitude ?? null,
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("AI is getting many requests right now. Please try again in a moment.");
        }
        throw new Error("AI assistant is temporarily unavailable.");
      }

      const data: ApiResponse = await response.json();
      const responseProperties = Array.isArray(data.properties)
        ? data.properties
        : [];
      const propertiesWithOfficialContact = responseProperties.map((property) => ({
        ...property,
        contactPhone: siteConfig.contact.phone,
      }));
      const responseVendors = Array.isArray(data.vendors) ? data.vendors : [];
      const normalizedVendors = responseVendors.flatMap((vendor) => {
        const normalizedVendor = toVendorResponse(vendor);
        return normalizedVendor ? [normalizedVendor] : [];
      });
      const requestedBudget =
        parseBudget(message) ?? data.requirements?.budget ?? budget;
      const morePropertiesRequested = isMorePropertiesRequest(message);
      const normalizedSearchMessage = normalizeAILocationText(message);
      const isPropertyDetailFollowUp =
        messageIsDetailFollowUp ||
        (isNamedPropertyReference(message, properties) &&
          !isMorePropertiesRequest(message) &&
          !isBookingIntent(message) &&
          !isPositivePropertyInterest(message)) ||
        (properties.some((property) =>
          normalizedSearchMessage
            .toLowerCase()
            .includes(property.title.toLowerCase()),
        ) &&
          /\b(?:tell|more|details|price|pool|amenities|capacity|available|availability)\b/i.test(
            normalizedSearchMessage,
          ));
      const isPropertySearch =
        morePropertiesRequested ||
        /\b(farm ?house|farmhose|villa|wedding lawn|lawn|venue|property|stay|room|pool|guest|party|booking|near me|nearby|noida|gurugram|gurgaon|gurugrm|gudgawn|jaipur|delhi|mumbai|bengaluru|bangalore|pune|hyderabad|chennai|kolkata)\b/i.test(
          normalizedSearchMessage,
        ) ||
        properties.some((property) =>
          normalizedSearchMessage.toLowerCase().includes(property.title.toLowerCase()),
        ) ||
        (properties.length > 0 &&
          /\b(?:this|that|it|price|details|capacity|availability)\b/i.test(
            normalizedSearchMessage,
          ));
      const showRecommendations =
        !isCasualChatMessage(message) &&
        !isPropertyDetailFollowUp &&
        isPropertySearch;

      const showVendorRecommendations =
        !isCasualChatMessage(message) &&
        !isPropertyDetailFollowUp &&
        normalizedVendors.length > 0;

      const shouldShowRecommendations =
        showRecommendations ||
        showVendorRecommendations;

      if (shouldShowRecommendations) {
        setVendors(normalizedVendors);
        setBudget(requestedBudget);
      }
      let assistantMessage = data.message;
      for (const property of responseProperties) {
        const phoneDigits = property.contactPhone?.replace(/\D/g, "");
        if (phoneDigits && phoneDigits.length >= 10) {
          const listingPhonePattern = new RegExp(
            `(?<!\\d)\\+?${phoneDigits.split("").join("[\\s().-]*")}(?!\\d)`,
            "g",
          );
          assistantMessage = assistantMessage.replace(
            listingPhonePattern,
            siteConfig.contact.phone,
          );
        }
      }
      if (isPropertyEnquiryPrompt(assistantMessage)) {
        const enquiryProperties = [
          ...new Map(
            [...properties, ...propertiesWithOfficialContact].map((property) => [
              property.id,
              property,
            ]),
          ).values(),
        ];
        let enquiryTarget = findBookingTarget(
          `${normalizedMessage}\n${assistantMessage}`,
          enquiryProperties,
          normalizedVendors,
        );
        const listingQuery = normalizedMessage.match(
          /\b(?:farm ?house|villa|wedding lawn)\s+[\w-]+(?:\s*\([^)]*\))?/i,
        )?.[0];
        if (!enquiryTarget.propertyId && listingQuery) {
          try {
            const resolvedProperties = await getActiveProperties({
              keyword: listingQuery,
              size: 100,
            });
            const resolvedAIProperties = resolvedProperties.map((property) => ({
              ...toAIProperty(property),
              contactPhone: siteConfig.contact.phone,
            }));
            enquiryTarget = findBookingTarget(
              `${normalizedMessage}\n${assistantMessage}`,
              [
                ...new Map(
                  [...enquiryProperties, ...resolvedAIProperties].map(
                    (property) => [property.id, property],
                  ),
                ).values(),
              ],
              normalizedVendors,
            );
          } catch (error) {
            console.error(
              "Unable to resolve property for booking follow-up:",
              error,
            );
          }
        }
        pendingPropertyEnquiryRef.current = enquiryTarget.propertyId
          ? {
              propertyId: enquiryTarget.propertyId,
              listingName: enquiryTarget.listingName,
            }
          : null;
      } else {
        pendingPropertyEnquiryRef.current = null;
      }

      const directMatches = propertiesWithOfficialContact.filter((property) => {
        if (requestedBudget === null) return true;
        const startingPrice = Number(property.startingPrice);
        return Number.isFinite(startingPrice) && startingPrice < requestedBudget;
      });
      const knownCityNames = [
        "greater noida",
        "noida",
        "gurugram",
        "gurgaon",
        "delhi",
        "jaipur",
        "mumbai",
        "bengaluru",
        "bangalore",
        "pune",
        "hyderabad",
        "chennai",
        "kolkata",
      ];
      const matchedCity = knownCityNames.find((city) =>
        new RegExp(`\\b${city}\\b`, "i").test(normalizeAILocationText(message)),
      );
      const locationQuery = data.requirements?.location?.trim()
        ? getCanonicalLocationSearch(data.requirements.location)
        : matchedCity
          ? getCanonicalLocationSearch(matchedCity)
          : properties.find((property) => property.city)?.city ?? "";
      const propertyType = data.requirements?.propertyType;
      const type: PropertyType | undefined =
        propertyType === "FARMHOUSE" ||
        propertyType === "VILLA" ||
        propertyType === "WEDDING_LAWN"
          ? propertyType
          : propertiesWithOfficialContact[0]?.type === "FARMHOUSE" ||
              propertiesWithOfficialContact[0]?.type === "VILLA" ||
              propertiesWithOfficialContact[0]?.type === "WEDDING_LAWN"
            ? propertiesWithOfficialContact[0].type
          : properties[0]?.type === "FARMHOUSE" ||
              properties[0]?.type === "VILLA" ||
              properties[0]?.type === "WEDDING_LAWN"
            ? properties[0].type
            : undefined;
      if (showRecommendations && !morePropertiesRequested) {
        shownPropertyIdsRef.current.clear();
      }

      const alreadyShownIds = shownPropertyIdsRef.current;

      const recommendations: AIProperty[] = showRecommendations
        ? directMatches.filter(
            (property) => !alreadyShownIds.has(property.id),
          )
        : [];

      if (
        showRecommendations &&
        responseVendors.length === 0 &&
        (recommendations.length < 3 || morePropertiesRequested)
      ) {
        try {
          const activeProperties = await getActiveProperties({
            type,
            city: locationQuery || undefined,
            size: 100,
          });
          const cityQuery = normalizeLocationForComparison(locationQuery);
          const additionalProperties = activeProperties
            .map(toAIProperty)
            .filter((property) => {
              if (alreadyShownIds.has(property.id)) return false;
              const city = normalizeLocationForComparison(property.city ?? "");
              const address = normalizeLocationForComparison(property.address ?? "");
              const matchesCity =
                !cityQuery || city.includes(cityQuery) || address.includes(cityQuery);
              const startingPrice = Number(property.startingPrice);
              const matchesBudget =
                requestedBudget === null ||
                (Number.isFinite(startingPrice) && startingPrice <= requestedBudget);
              return matchesCity && matchesBudget;
            });

          const uniqueIds = new Set(recommendations.map((property) => property.id));
          for (const property of additionalProperties) {
            if (!uniqueIds.has(property.id)) {
              recommendations.push({
                ...property,
                contactPhone: siteConfig.contact.phone,
              });
              uniqueIds.add(property.id);
            }
            if (recommendations.length >= (morePropertiesRequested ? 100 : 3)) {
              break;
            }
          }
        } catch (error) {
          console.error("Unable to load additional property suggestions:", error);
        }
      }

      const sortedRecommendations = location
        ? recommendations
            .map((property) => ({
              property,
              distance: calculateDistanceInKm(location, property),
            }))
            .sort((first, second) => {
              if (first.distance === undefined && second.distance === undefined) {
                return 0;
              }
              if (first.distance === undefined) return 1;
              if (second.distance === undefined) return -1;
              return first.distance - second.distance;
            })
            .map(({ property }) => property)
        : recommendations;
      const propertyCards = sortedRecommendations.slice(0, 3);
      const vendorCards = normalizedVendors.slice(0, 2);
      if (showRecommendations) {
        setProperties(propertyCards);
      }
      if (propertyCards.length > 0) {
        const propertyKind =
          data.requirements?.propertyType === "FARMHOUSE"
            ? "farmhouse"
            : data.requirements?.propertyType === "VILLA"
              ? "villa"
              : data.requirements?.propertyType === "WEDDING_LAWN"
                ? "wedding lawn"
                  : propertyCards[0].type === "FARMHOUSE"
                    ? "farmhouse"
                    : propertyCards[0].type === "VILLA"
                      ? "villa"
                      : propertyCards[0].type === "WEDDING_LAWN"
                        ? "wedding lawn"
                        : "property";
        const cityLabel =
          propertyCards.find((property) => property.city)?.city ??
          locationQuery;
        assistantMessage = replyInHindi
          ? `Aapke liye **${propertyCards.length} ${propertyKind} options${cityLabel ? ` ${cityLabel} mein` : ""}** mile hain 😊\n\nKoi pasand aaya? **Uska naam bhejein**—main booking enquiry mein help karungi.`
          : `I found **${propertyCards.length} ${propertyKind} options${cityLabel ? ` in ${cityLabel}` : ""}** for you 😊\n\nSee one you like? **Send me its name** and I’ll help with the booking enquiry.`;
      } else if (morePropertiesRequested && showRecommendations) {
        assistantMessage = replyInHindi
          ? "In details ke saath mujhe aur different options nahi mile. **Location ya budget** change karke try karein?"
          : "I couldn’t find more different options with those details. Want to try another **location** or **budget**?";
      } else if (vendorCards.length > 0) {
        assistantMessage = replyInHindi
          ? `Aapki requirement ke liye **${vendorCards.length} options** mile hain 😊\n\nKoi pasand aaye? **Vendor ka naam bhejein**—main enquiry mein help karungi.`
          : `I found **${vendorCards.length} options** for you 😊\n\nInterested in one? **Send me the vendor’s name** and I’ll help with an enquiry.`;
      }
      propertyCards.forEach((property) => alreadyShownIds.add(property.id));

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: assistantMessage,
          recommendations: shouldShowRecommendations
            ? {
                properties: propertyCards,
                vendors: vendorCards,
              }
            : undefined,
        },
      ]);

      setLocationMessage(
        data.locationMessage ?? null,
      );
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            error instanceof Error
              ? error.message
              : "Sorry, I could not process that request.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void sendMessage();
  };

  // The public AI assistant widget has no place in the independent admin panel.
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      {/* Floating Ask AI launcher */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-4 right-4 z-[70] flex min-h-12 items-center gap-2 rounded-full bg-[#2EAD45] px-4 py-2.5 text-sm font-semibold text-white shadow-xl shadow-green-900/20 transition-all hover:-translate-y-0.5 hover:bg-[#1E8A32] sm:bottom-6 sm:right-6 sm:py-3"
          aria-label="Open Booksy assistant"
        >
          <span className="grid h-8 w-8 place-items-center rounded-full bg-white/15">
            <Sparkles size={17} />
          </span>
          <span>Ask AI</span>
        </button>
      )}

      {/* Chat */}
      {open && (
        <>
          {/* Mobile-only blurred backdrop */}
          <div
            className="fixed inset-0 z-[75] bg-black/25 backdrop-blur-[3px] sm:hidden"
            aria-hidden="true"
          />

          <section
            className="fixed inset-x-0 bottom-0 z-[80] flex h-[calc(100dvh-0.5rem)] max-h-[760px] flex-col overflow-hidden rounded-t-3xl border border-gray-200 bg-white shadow-2xl sm:inset-x-auto sm:bottom-6 sm:right-6 sm:h-[min(680px,calc(100dvh-3rem))] sm:w-[410px] sm:rounded-3xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="booksy-chat-title"
          >
            <header className="flex shrink-0 items-center justify-between bg-[#2EAD45] px-4 py-3 text-white sm:py-3.5">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-white/15">
                  <Bot size={21} />
                </div>
                <div>
                  <p id="booksy-chat-title" className="text-sm font-bold">Booksy</p>
                  <p className="text-[11px] text-white/80">Verified property assistant</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-white/10"
                aria-label="Close AI chat"
              >
                <X size={19} />
              </button>
            </header>

            <div className="flex min-h-0 flex-1 flex-col">
              <div className="relative min-h-0 flex-1">
                <div
                  ref={chatScrollRef}
                  onScroll={updateScrollToLatestVisibility}
                  className="scrollbar-hide h-full overscroll-contain space-y-3 overflow-y-auto bg-[#F8FAFC] p-3 sm:p-3.5"
                >
                  {messages.map((message, index) => (
                    <div
                      key={`${message.role}-${index}`}
                      data-message-index={index}
                      className={`flex flex-col ${message.role === "user" ? "items-end" : "items-start"}`}
                    >
                      <div
                        className={`max-w-[92%] break-words rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed sm:max-w-[88%] ${
                          message.role === "user"
                            ? "rounded-br-md bg-[#2EAD45] text-white"
                            : "rounded-bl-md border border-gray-100 bg-white text-[#0F172A] shadow-sm"
                        }`}
                        style={{ whiteSpace: "pre-line" }}
                      >
                        {message.role === "assistant"
                          ? formatAssistantMessage(message.content)
                          : message.content}
                      </div>
                      {message.recommendations?.properties.length ? (
                        <div className="mt-2 w-full min-w-0 max-w-full space-y-2.5 sm:max-w-[94%]">
                          {message.recommendations.properties.map((property) => (
                            <AIPropertyCard
                              key={property.id}
                              property={property}
                              distanceKm={
                                location
                                  ? calculateDistanceInKm(location, property)
                                  : undefined
                              }
                            />
                          ))}
                        </div>
                      ) : null}
                      {message.recommendations?.vendors.length ? (
                        <div className="mt-2 w-full min-w-0 max-w-full space-y-2.5 sm:max-w-[94%]">
                          {message.recommendations.vendors.map((vendor) => (
                            <AIVendorCard key={vendor.id} vendor={vendor} />
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ))}

                  {loading && (
                    <div className="flex justify-start">
                      <div className="rounded-2xl rounded-bl-md bg-white px-4 py-3 text-xs text-gray-500 shadow-sm">
                        AI is checking verified listings…
                      </div>
                    </div>
                  )}

                </div>

                {showScrollToLatest && (
                  <button
                    type="button"
                    onClick={scrollToLatest}
                    className="absolute bottom-3 left-1/2 z-20 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full border border-green-600 bg-[#2EAD45] text-white shadow-lg shadow-green-900/25 transition-all hover:scale-105 hover:bg-[#1E8A32] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2EAD45] focus-visible:ring-offset-2 sm:bottom-4"
                    aria-label="Scroll to latest message"
                  >
                    <ArrowDown
                      size={19}
                      aria-hidden="true"
                    />
                  </button>
                )}
              </div>

              {(locationError || locationMessage) && (
                <div className="border-t border-amber-100 bg-amber-50 px-3 py-2 text-[11px] leading-relaxed text-amber-800">
                  <div className="flex items-start gap-2">
                    <MapPin size={14} className="mt-0.5 shrink-0" />
                    <span>
                      {locationError || locationMessage}
                    </span>
                  </div>
                </div>
              )}

              <div className="shrink-0 border-t border-gray-100 bg-white p-3">
                {/* Quick actions */}
                <div className="mb-1.5 flex h-9 min-w-0 items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {quickActions.map((action) => (
                    <button
                      key={action}
                      type="button"
                      onClick={() => {
                        if (action === "Farmhouse near me") {
                          void (async () => {
                            const coords = await requestLocation();

                            if (coords) {
                              void sendMessage(
                                "Farmhouses near me",
                                coords,
                              );
                            }
                          })();

                          return;
                        }

                        void sendMessage(action);
                      }}
                      className="flex h-8 shrink-0 items-center whitespace-nowrap rounded-full border border-gray-200 bg-white px-2.5 text-[10px] font-medium leading-none text-gray-600 transition-colors hover:border-[#2EAD45] hover:text-[#1E8A32]"
                    >
                      {action}
                    </button>
                  ))}
                </div>

                {/* Message input */}
                <form
                  onSubmit={submit}
                  className="flex items-center gap-2"
                >
                  <button
                    type="button"
                    onClick={() => {
                      void requestLocation();
                    }}
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition-colors hover:border-[#2EAD45] hover:text-[#2EAD45]"
                    aria-label="Use my location"
                    title="Use my location"
                  >
                    <LocateFixed size={17} aria-hidden="true" />
                  </button>

                  <div className="flex h-12 min-w-0 flex-1 items-center rounded-2xl border border-gray-200 bg-gray-50 px-3 transition-colors focus-within:border-[#2EAD45] focus-within:ring-2 focus-within:ring-green-100">
                    <input
                      type="text"
                      value={input}
                      onChange={(event) =>
                        setInput(event.target.value)
                      }
                      onKeyDown={(event) => {
                        if (
                          event.key === "Enter" &&
                          !event.nativeEvent.isComposing
                        ) {
                          event.preventDefault();
                          void sendMessage();
                        }
                      }}
                      placeholder="Try: Pool farmhouse in Gurugram..."
                      className="h-full min-w-0 flex-1 bg-transparent text-sm leading-5 text-[#0F172A] outline-none placeholder:text-gray-400"
                      maxLength={1200}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!canSend}
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#2EAD45] text-white transition-colors hover:bg-[#1E8A32] disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Send message"
                  >
                    <Send size={17} aria-hidden="true" />
                  </button>
                </form>

                <p className="mt-2 text-center text-[9px] leading-3 text-gray-400">
                  Suggestions are based on verified BookFarmVilla listing data.
                </p>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
}

