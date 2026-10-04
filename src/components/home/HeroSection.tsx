"use client";

import {
  useEffect,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { useRouter } from "next/navigation";
import { Building2, MapPin, Search, ChevronDown, Users } from "lucide-react";
import { getActivePropertyCities } from "@/lib/property-api";

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

  const [availableCities, setAvailableCities] =
    useState<string[]>([]);

  const [isLocationFocused, setIsLocationFocused] =
    useState(false);

  const [highlightedCityIndex, setHighlightedCityIndex] =
    useState(0);

  useEffect(() => {
    const controller = new AbortController();

    getActivePropertyCities(controller.signal)
      .then((cities) => {
        console.log("Loaded city suggestions:", cities);

        if (!controller.signal.aborted) {
          setAvailableCities(cities);
        }
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return;
        }

        console.error(
          "Unable to load city suggestions:",
          error,
        );
      });

    return () => controller.abort();
  }, []);

  const normalizedLocationQuery = location
    .trim()
    .toLocaleLowerCase();

  const citySuggestions =
    normalizedLocationQuery.length >= 2
      ? availableCities
          .filter((city) => {
            const normalizedCity = city.toLocaleLowerCase();

            return normalizedCity
              .split(/[\s,./()-]+/)
              .some((word) =>
                word.startsWith(normalizedLocationQuery),
              );
          })
          .slice(0, 6)
      : [];

  const showCitySuggestions =
    isLocationFocused && citySuggestions.length > 0;

  const activeCityIndex = Math.min(
    highlightedCityIndex,
    Math.max(citySuggestions.length - 1, 0),
  );

  const selectCity = (city: string) => {
    setLocation(city);
    setHighlightedCityIndex(0);
    setIsLocationFocused(false);
  };

  const handleLocationKeyDown = (
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (!showCitySuggestions) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();

      setHighlightedCityIndex((currentIndex) =>
        Math.min(
          currentIndex + 1,
          citySuggestions.length - 1,
        ),
      );
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      setHighlightedCityIndex((currentIndex) =>
        Math.max(currentIndex - 1, 0),
      );
    }

    if (event.key === "Enter") {
      event.preventDefault();

      const selectedCity =
        citySuggestions[activeCityIndex];

      if (selectedCity) {
        selectCity(selectedCity);
      }
    }

    if (event.key === "Escape") {
      setIsLocationFocused(false);
    }
  };

  const handleSearch = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setIsLocationFocused(false);

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
            <div
              className="relative z-20 flex min-w-0 flex-1 items-center gap-3 rounded-xl bg-white px-4 py-3 text-left"
              onFocus={() => setIsLocationFocused(true)}
              onBlur={(event) => {
                const nextFocusedElement = event.relatedTarget;

                if (
                  !(nextFocusedElement instanceof Node) ||
                  !event.currentTarget.contains(nextFocusedElement)
                ) {
                  setIsLocationFocused(false);
                }
              }}
            >
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
                  onChange={(event) => {
                    setLocation(event.target.value);
                    setHighlightedCityIndex(0);
                    setIsLocationFocused(true);
                  }}
                  onKeyDown={handleLocationKeyDown}
                  placeholder="Search your preferred city"
                  autoComplete="off"
                  role="combobox"
                  aria-autocomplete="list"
                  aria-expanded={showCitySuggestions}
                  aria-controls="hero-city-suggestions"
                  aria-activedescendant={
                    showCitySuggestions
                      ? `hero-city-option-${activeCityIndex}`
                      : undefined
                  }
                  className="w-full bg-transparent text-sm font-medium text-gray-800 outline-none placeholder:text-gray-400"
                />
              </label>
              {showCitySuggestions && (
                <ul
                  id="hero-city-suggestions"
                  role="listbox"
                  aria-label="Available cities"
                  className="absolute left-0 right-0 top-[calc(100%+0.5rem)] overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-xl"
                >
                  {citySuggestions.map((city, index) => {
                    const isActive = index === activeCityIndex;

                    return (
                      <li key={city}>
                        <button
                          id={`hero-city-option-${index}`}
                          type="button"
                          role="option"
                          aria-selected={isActive}
                          onClick={() => selectCity(city)}
                          className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium transition-colors ${
                            isActive
                              ? "bg-[#F0FDF4] text-[#1E8A32]"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <MapPin
                            size={15}
                            className="shrink-0 text-[#2EAD45]"
                            aria-hidden="true"
                          />

                          <span>{city}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
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