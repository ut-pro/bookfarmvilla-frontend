"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Building2, MapPin, Search, Users } from "lucide-react";

const heroStatistics = [
  {
    value: "500+",
    label: "Farmhouses",
  },
  {
    value: "200+",
    label: "Villas",
  },
  {
    value: "100+",
    label: "Wedding Lawns",
  },
];

export default function HeroSection() {
  const router = useRouter();

  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [minimumCapacity, setMinimumCapacity] = useState("");

  const handleSearch = (
  event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const searchParams = new URLSearchParams();

    const normalizedLocation = location.trim();

    if (normalizedLocation) {
      searchParams.set("city", normalizedLocation);
    }

    if (propertyType) {
      searchParams.set("type", propertyType);
    }

    if (minimumCapacity) {
      searchParams.set(
        "minCapacity",
        minimumCapacity,
      );
    }

    const queryString = searchParams.toString();

    router.push(
      queryString
        ? `/properties?${queryString}`
        : "/properties",
    );
  };

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1767950470198-c9cd97f8ed87?w=1440&h=900&fit=crop&auto=format')",
        }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

      {/* Hero content */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-col items-center px-6 pb-20 pt-32 text-center lg:px-12">
        {/* Small badge */}
        <div className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium text-white backdrop-blur-sm sm:mb-8 sm:text-sm">
          <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-[#2EAD45]" />

          {/* Short text for mobile */}
          <span className="whitespace-nowrap sm:hidden">
            Premium Venue Discovery
          </span>

          {/* Complete text for tablet and desktop */}
          <span className="hidden sm:inline">
            Premium Farmhouse & Villa Discovery Platform
          </span>
        </div>

        {/* Main heading */}
        <h1
          className="mb-6 max-w-4xl font-bold leading-tight text-white"
          style={{
            fontSize: "clamp(36px, 5vw, 64px)",
          }}
        >
          Find The Perfect{" "}
          <span className="text-[#4CAF50]">Farmhouse, Villa</span>
          <br className="hidden sm:block" />
          {" "}& Wedding Venue
        </h1>

        {/* Description */}
        <p className="mb-12 max-w-2xl text-base leading-relaxed text-white/80 md:text-xl">
          Discover unforgettable experiences with BookFarmVilla and connect
          with our experts to find the perfect venue for your occasion.
        </p>

        {/* Platform statistics */}
        <div className="mb-12 flex gap-8 md:gap-16">
          {heroStatistics.map((statistic) => (
            <div key={statistic.label} className="text-center">
              <p className="text-3xl font-bold text-white md:text-4xl">
                {statistic.value}
              </p>

              <p className="mt-1 text-xs text-white/70 md:text-base">
                {statistic.label}
              </p>
            </div>
          ))}
        </div>

        {/* Search form outer container */}
        <form
          onSubmit={handleSearch}
          className="w-full max-w-5xl rounded-2xl border border-white/20 bg-white/10 p-2 shadow-2xl backdrop-blur-xl"
        >
          <div className="flex flex-col items-stretch gap-2 md:flex-row md:gap-1">
            {/* Location field */}
            <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl bg-white px-4 py-3 text-left">
              <MapPin
                size={20}
                className="shrink-0 text-[#2EAD45]"
                aria-hidden="true"
              />

              <label className="min-w-0 flex-1">
                <span className="mb-0.5 block text-xs font-medium text-gray-400">
                  Location
                </span>

                <input
                  type="text"
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="Where do you want to go?"
                  className="w-full bg-transparent text-sm font-medium text-gray-800 outline-none placeholder:text-gray-400"
                />
              </label>
            </div>

            {/* Desktop divider */}
            <div className="my-2 hidden w-px bg-white/30 md:block" />

            {/* Property type field */}
            <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl bg-white px-4 py-3 text-left">
              <Building2
                size={20}
                className="shrink-0 text-[#2EAD45]"
                aria-hidden="true"
              />

              <label className="min-w-0 flex-1">
                <span className="mb-0.5 block text-xs font-medium text-gray-400">
                  Property Type
                </span>

                <select
                  value={propertyType}
                  onChange={(event) => setPropertyType(event.target.value)}
                  className="w-full cursor-pointer bg-transparent text-sm font-medium text-gray-800 outline-none"
                >
                  <option value="">All Properties</option>
                  <option value="FARMHOUSE">Farmhouse</option>
                  <option value="VILLA">Villa</option>
                  <option value="WEDDING_LAWN">Wedding Lawn</option>
                </select>
              </label>
            </div>

            {/* Desktop divider */}
            <div className="my-2 hidden w-px bg-white/30 md:block" />

            {/* Guest capacity field */}
            <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl bg-white px-4 py-3 text-left">
              <Users
                size={20}
                className="shrink-0 text-[#2EAD45]"
                aria-hidden="true"
              />

              <label className="min-w-0 flex-1">
                <span className="mb-0.5 block text-xs font-medium text-gray-400">
                  Minimum Capacity
                </span>

                <select
                  value={minimumCapacity}
                  onChange={(event) => setMinimumCapacity(event.target.value)}
                  className="w-full cursor-pointer bg-transparent text-sm font-medium text-gray-800 outline-none"
                >
                  <option value="">Any Capacity</option>
                  <option value="50">50+ Guests</option>
                  <option value="100">100+ Guests</option>
                  <option value="200">200+ Guests</option>
                  <option value="300">300+ Guests</option>
                  <option value="500">500+ Guests</option>
                  <option value="750">750+ Guests</option>
                  <option value="1000">1000+ Guests</option>
                </select>
              </label>
            </div>

            {/* Search button */}
            <button
              type="submit"
              className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#2EAD45] px-8 py-4 font-semibold text-white shadow-lg shadow-green-500/30 transition-colors hover:bg-[#1E8A32] md:py-3"
            >
              <Search size={20} aria-hidden="true" />
              <span>Search</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}