import type { Testimonial } from "@/types/testimonial";

/*
 * Development-only placeholder testimonials.
 * Replace these with genuine, approved reviews before production launch.
 */
export const mockTestimonials: Testimonial[] = [
  {
    id: "testimonial-1",
    name: "Rohan Mehta",
    location: "Mumbai",
    rating: 5,
    review:
      "The BookFarmVilla team helped us shortlist a clean and spacious farmhouse for our corporate retreat. The callback support made it much easier to understand the property details before finalising our plan.",
    avatarUrl:
      "https://images.unsplash.com/photo-1598966739654-5e9a252d8c32?w=160&h=160&fit=crop&auto=format",
    event: "Corporate Retreat",
    propertyName: "PartyPatch Guitar Waves",
  },
  {
    id: "testimonial-2",
    name: "Priya Sharma",
    location: "Pune",
    rating: 5,
    review:
      "We were looking for a venue for our daughter's wedding, and the team guided us through the available options. The venue information and expert assistance helped our family make a confident choice.",
    avatarUrl:
      "https://images.unsplash.com/photo-1749700332031-cf99864959ea?w=160&h=160&fit=crop&auto=format",
    event: "Wedding Ceremony",
    propertyName: "The Grand Palace",
  },
  {
    id: "testimonial-3",
    name: "Ananya Kapoor",
    location: "Delhi",
    rating: 5,
    review:
      "Finding a private villa for our weekend getaway was simple and convenient. We could compare the capacity, amenities and location before speaking with the team for additional details.",
    avatarUrl:
      "https://images.unsplash.com/photo-1778550579010-cb0d00cd94e6?w=160&h=160&fit=crop&auto=format",
    event: "Weekend Getaway",
    propertyName: "Veluk Elite Villa",
  }
];