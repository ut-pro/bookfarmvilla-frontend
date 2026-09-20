import type { PropertyType } from "@/types/property";

export interface PropertyCategory {
  title: string;
  type: PropertyType;
  image: string;
  tags: string[];
  cta: string;
  sectionHref: string;
  overlayClassName: string;
}

export const propertyCategories: PropertyCategory[] = [
  {
    title: "Farmhouses",
    type: "FARMHOUSE",
    image:
      "https://images.unsplash.com/photo-1694184888784-87f9ec509468?w=900&h=630&fit=crop&auto=format",
    tags: [
      "Pool Parties",
      "Family Outings",
      "Corporate Events",
      "Weekend Getaways",
    ],
    cta: "Explore Farmhouses",
    sectionHref: "#farmhouses",
    overlayClassName:
      "from-green-950/90 via-green-900/40 to-transparent",
  },
  {
    title: "Villas",
    type: "VILLA",
    image:
      "https://images.unsplash.com/photo-1596178067639-5c6e68aea6dc?w=900&h=630&fit=crop&auto=format",
    tags: [
      "Private Pools",
      "Luxury Stays",
      "Couple Getaways",
      "Weekend Trips",
    ],
    cta: "Explore Villas",
    sectionHref: "#villas",
    overlayClassName:
      "from-blue-950/90 via-blue-900/40 to-transparent",
  },
  {
    title: "Wedding Lawns",
    type: "WEDDING_LAWN",
    image:
      "https://images.unsplash.com/photo-1762216444919-043cf813e4de?w=900&h=630&fit=crop&auto=format",
    tags: [
      "Weddings",
      "Engagements",
      "Receptions",
      "Other Events",
    ],
    cta: "Explore Wedding Lawns",
    sectionHref: "#wedding-lawns",
    overlayClassName:
      "from-rose-950/90 via-rose-900/40 to-transparent",
  },
];