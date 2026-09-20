import type {
  PropertyCardData,
  PropertyType,
} from "@/types/property";

export const mockProperties: PropertyCardData[] = [
  // Farmhouses
  {
    id: "farmhouse-1",
    name: "PartyPatch Guitar Waves",
    type: "FARMHOUSE",
    location: "Karjat, Maharashtra",
    rating: 4.9,
    reviewCount: 128,
    guestCapacity: 30,
    bedrooms: 6,
    hasPool: true,
    startingPrice: 18000,
    priceSuffix: "/night",
    imageUrl:
      "https://images.unsplash.com/photo-1694184888784-87f9ec509468?w=800&h=520&fit=crop&auto=format",
    badge: "Top Rated",
    status: "ACTIVE",
  },
  {
    id: "farmhouse-2",
    name: "Green View Farm",
    type: "FARMHOUSE",
    location: "Lonavala, Maharashtra",
    rating: 4.8,
    reviewCount: 94,
    guestCapacity: 20,
    bedrooms: 4,
    hasPool: true,
    startingPrice: 14500,
    priceSuffix: "/night",
    imageUrl:
      "https://images.unsplash.com/photo-1766777020943-36ee19fb8cf6?w=800&h=520&fit=crop&auto=format",
    status: "ACTIVE",
  },
  {
    id: "farmhouse-3",
    name: "Whispering Palms",
    type: "FARMHOUSE",
    location: "Alibag, Maharashtra",
    rating: 4.7,
    reviewCount: 76,
    guestCapacity: 25,
    bedrooms: 5,
    hasPool: true,
    startingPrice: 22000,
    priceSuffix: "/night",
    imageUrl:
      "https://images.unsplash.com/photo-1767622947473-3e119f12c534?w=800&h=520&fit=crop&auto=format",
    badge: "Trending",
    status: "ACTIVE",
  },
  {
    id: "farmhouse-4",
    name: "Hilltop Farmhouse",
    type: "FARMHOUSE",
    location: "Igatpuri, Maharashtra",
    rating: 4.6,
    reviewCount: 61,
    guestCapacity: 15,
    bedrooms: 3,
    hasPool: false,
    startingPrice: 11000,
    priceSuffix: "/night",
    imageUrl:
      "https://images.unsplash.com/photo-1760648998657-bf3e8e8a380f?w=800&h=520&fit=crop&auto=format",
    status: "ACTIVE",
  },

  // Villas
  {
    id: "villa-1",
    name: "Veluk Elite Villa",
    type: "VILLA",
    location: "Goa, India",
    rating: 5,
    reviewCount: 203,
    guestCapacity: 10,
    bedrooms: 5,
    hasPool: true,
    startingPrice: 45000,
    priceSuffix: "/night",
    imageUrl:
      "https://images.unsplash.com/photo-1596178067639-5c6e68aea6dc?w=800&h=520&fit=crop&auto=format",
    badge: "Luxury",
    status: "ACTIVE",
  },
  {
    id: "villa-2",
    name: "Dream Paradise Villa",
    type: "VILLA",
    location: "Udaipur, Rajasthan",
    rating: 4.9,
    reviewCount: 157,
    guestCapacity: 8,
    bedrooms: 4,
    hasPool: true,
    startingPrice: 38000,
    priceSuffix: "/night",
    imageUrl:
      "https://images.unsplash.com/photo-1509600110300-21b9d5fedeb7?w=800&h=520&fit=crop&auto=format",
    status: "ACTIVE",
  },
  {
    id: "villa-3",
    name: "Skyline Villa",
    type: "VILLA",
    location: "Munnar, Kerala",
    rating: 4.8,
    reviewCount: 112,
    guestCapacity: 6,
    bedrooms: 3,
    hasPool: false,
    startingPrice: 28000,
    priceSuffix: "/night",
    imageUrl:
      "https://images.unsplash.com/photo-1615722440048-da4ccf6de048?w=800&h=520&fit=crop&auto=format",
    badge: "New",
    status: "ACTIVE",
  },
  {
    id: "villa-4",
    name: "Palm Paradise Villa",
    type: "VILLA",
    location: "Alleppey, Kerala",
    rating: 4.7,
    reviewCount: 89,
    guestCapacity: 12,
    bedrooms: 6,
    hasPool: true,
    startingPrice: 52000,
    priceSuffix: "/night",
    imageUrl:
      "https://images.unsplash.com/photo-1543489822-c49534f3271f?w=800&h=520&fit=crop&auto=format",
    status: "ACTIVE",
  },
  {
    id: "villa-5",
    name: "Riverfront Villa",
    type: "VILLA",
    location: "Rishikesh, Uttarakhand",
    rating: 4.9,
    reviewCount: 174,
    guestCapacity: 14,
    bedrooms: 7,
    hasPool: true,
    startingPrice: 62000,
    priceSuffix: "/night",
    imageUrl:
      "https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=800&h=520&fit=crop&auto=format",
    status: "ACTIVE",
  },

  // Wedding lawns
  {
    id: "wedding-lawn-1",
    name: "Royal Green Lawn",
    type: "WEDDING_LAWN",
    location: "Jaipur, Rajasthan",
    rating: 4.9,
    reviewCount: 321,
    guestCapacity: 500,
    bedrooms: 10,
    hasPool: false,
    startingPrice: 85000,
    priceSuffix: "/event",
    imageUrl:
      "https://images.unsplash.com/photo-1762216444919-043cf813e4de?w=800&h=520&fit=crop&auto=format",
    badge: "Premium",
    status: "ACTIVE",
  },
  {
    id: "wedding-lawn-2",
    name: "The Grand Palace",
    type: "WEDDING_LAWN",
    location: "Udaipur, Rajasthan",
    rating: 5,
    reviewCount: 289,
    guestCapacity: 800,
    bedrooms: 20,
    hasPool: false,
    startingPrice: 150000,
    priceSuffix: "/event",
    imageUrl:
      "https://images.unsplash.com/photo-1779633203712-bf43c894f275?w=800&h=520&fit=crop&auto=format",
    status: "ACTIVE",
  },
  {
    id: "wedding-lawn-3",
    name: "Maple Wedding Lawn",
    type: "WEDDING_LAWN",
    location: "Pune, Maharashtra",
    rating: 4.8,
    reviewCount: 198,
    guestCapacity: 300,
    bedrooms: 8,
    hasPool: true,
    startingPrice: 65000,
    priceSuffix: "/event",
    imageUrl:
      "https://images.unsplash.com/photo-1770824906466-6254ca2cdc14?w=800&h=520&fit=crop&auto=format",
    status: "ACTIVE",
  },
  {
    id: "wedding-lawn-4",
    name: "Dreams Celebration",
    type: "WEDDING_LAWN",
    location: "Delhi NCR",
    rating: 4.7,
    reviewCount: 176,
    guestCapacity: 400,
    bedrooms: 12,
    hasPool: false,
    startingPrice: 95000,
    priceSuffix: "/event",
    imageUrl:
      "https://images.unsplash.com/photo-1778245609282-b254efa0dd3d?w=800&h=520&fit=crop&auto=format",
    badge: "Popular",
    status: "ACTIVE",
  },
  {
    id: "wedding-lawn-5",
    name: "Rohit Tamata House",
    type: "WEDDING_LAWN",
    location: "Agra, Uttar Pradesh",
    rating: 4.9,
    reviewCount: 243,
    guestCapacity: 600,
    bedrooms: 15,
    hasPool: false,
    startingPrice: 120000,
    priceSuffix: "/event",
    imageUrl:
      "https://images.unsplash.com/photo-1776758542186-ff02c8043967?w=800&h=520&fit=crop&auto=format",
    status: "ACTIVE",
  },
];

export function getPropertiesByType(
  propertyType: PropertyType,
): PropertyCardData[] {
  return mockProperties.filter(
    (property) =>
      property.type === propertyType &&
      property.status === "ACTIVE",
  );
}

export const farmhouseProperties =
  getPropertiesByType("FARMHOUSE");

export const villaProperties =
  getPropertiesByType("VILLA");

export const weddingLawnProperties =
  getPropertiesByType("WEDDING_LAWN");