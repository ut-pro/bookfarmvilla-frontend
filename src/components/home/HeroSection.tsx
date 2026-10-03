"use client";

import {
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  ChevronDown,
  MapPin,
  Search,
  Users,
} from "lucide-react";

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

const northIndianCities = [
  "Delhi",
  "Gurugram",
  "Noida",
  "Jaipur",
  "Chandigarh",
  "Lucknow",
  "Agra",
  "Dehradun",
  "Haridwar",
  "Rishikesh",
  "Shimla",
  "Manali",
  "Amritsar",
  "Ludhiana",
  "Jammu",
  "Srinagar",
];

const propertyTypeOptions = [
  { label: "All Properties", value: "" },
  { label: "Farmhouse", value: "FARMHOUSE" },
  { label: "Villa", value: "VILLA" },
  { label: "Wedding Lawn", value: "WEDDING_LAWN" },
];

const capacityOptions = [
  { label: "Any Capacity", value: "" },
  { label: "10+ Guests", value: "10" },
  { label: "20+ Guests", value: "20" },
  { label: "50+ Guests", value: "50" },
  { label: "100+ Guests", value: "100" },
  { label: "200+ Guests", value: "200" },
  { label: "300+ Guests", value: "300" },
  { label: "500+ Guests", value: "500" },
  { label: "750+ Guests", value: "750" },
  { label: "1000+ Guests", value: "1000" },
];

interface SearchDropdownProps {
  id: string;
  label: string;
  value: string;
  options: Array<{ label: string; value: string }>;
  icon: React.ReactNode;
  onChange: (value: string) => void;
}

function SearchDropdown({
  id,
  label,
  value,
  options,
  icon,
  onChange,
}: SearchDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption =
    options.find((option) => option.value === value) ?? options[0];

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      setIsOpen(false);
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setIsOpen(true);
      const optionButtons =
        event.currentTarget.querySelectorAll<HTMLButtonElement>(
          '[role="option"]',
        );
      const currentIndex = Array.from(optionButtons).indexOf(
        document.activeElement as HTMLButtonElement,
      );
      const nextIndex =
        event.key === "ArrowDown"
          ? Math.min(currentIndex + 1, options.length - 1)
          : Math.max(currentIndex - 1, 0);
      optionButtons[nextIndex]?.focus();
      return;
    }

    if (event.key === "Enter" && event.target === event.currentTarget) {
      event.preventDefault();
      setIsOpen((open) => !open);
    }
  };

  return (
    <div
      className={`relative flex min-w-0 flex-1 items-center gap-3 rounded-xl bg-white px-4 py-3 text-left ${
        isOpen ? "z-30" : ""
      }`}
      onBlur={(event) => {
        if (
          !(event.relatedTarget instanceof Node) ||
          !event.currentTarget.contains(event.relatedTarget)
        ) {
          setIsOpen(false);
        }
      }}
      onKeyDown={handleKeyDown}
    >
      {icon}
      <div className="min-w-0 flex-1">
        <span className="mb-0.5 block text-xs font-medium text-gray-400">
          {label}
        </span>
        <button
          id={id}
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={`${id}-options`}
          onClick={() => setIsOpen((open) => !open)}
          className="flex w-full items-center justify-between gap-2 bg-transparent text-left text-sm font-medium text-gray-800 outline-none"
        >
          <span className="truncate">{selectedOption.label}</span>
          <ChevronDown
            size={16}
            className={`shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </button>
      </div>
      {isOpen && (
        <ul
          id={`${id}-options`}
          role="listbox"
          aria-labelledby={id}
          className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 max-h-64 overflow-y-auto rounded-xl border border-gray-200 bg-white py-1 shadow-xl"
        >
          {options.map((option) => {
            const isSelected = option.value === value;

            return (
              <li key={option.value || "all"} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center px-4 py-3 text-left text-sm font-medium transition-colors ${
                    isSelected
                      ? "bg-[#F0FDF4] text-[#1E8A32]"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default function HeroSection() {
  const router = useRouter();

  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [minimumCapacity, setMinimumCapacity] = useState("");

  const [isLocationFocused, setIsLocationFocused] =
    useState(false);

  const [highlightedCityIndex, setHighlightedCityIndex] =
    useState(0);

  const normalizedLocationQuery = location
    .trim()
    .toLocaleLowerCase();

  const matchingCities = normalizedLocationQuery
    ? northIndianCities.filter((city) =>
        city.toLocaleLowerCase().includes(normalizedLocationQuery),
      )
    : northIndianCities;
  const citySuggestions = matchingCities.slice(
    0,
    normalizedLocationQuery ? 6 : 8,
  );

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
      className="relative flex min-h-screen items-center justify-center overflow-visible"
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
                  placeholder="Where do you want to go?"
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
                  className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 max-h-64 overflow-y-auto rounded-xl border border-gray-200 bg-white py-1 shadow-xl"
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
            <SearchDropdown
              id="hero-property-type"
              label="Property Type"
              value={propertyType}
              options={propertyTypeOptions}
              onChange={setPropertyType}
              icon={
                <Building2
                  size={20}
                  className="shrink-0 text-[#2EAD45]"
                  aria-hidden="true"
                />
              }
            />

            {/* Desktop divider */}
            <div className="my-2 hidden w-px bg-white/30 md:block" />

            {/* Guest capacity field */}
            <SearchDropdown
              id="hero-minimum-capacity"
              label="Minimum Capacity"
              value={minimumCapacity}
              options={capacityOptions}
              onChange={setMinimumCapacity}
              icon={
                <Users
                  size={20}
                  className="shrink-0 text-[#2EAD45]"
                  aria-hidden="true"
                />
              }
            />

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