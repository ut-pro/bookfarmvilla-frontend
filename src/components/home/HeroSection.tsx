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
    value: "50+",
    label: "Farmhouses",
  },
  {
    value: "20+",
    label: "Villas",
  },
  {
    value: "10+",
    label: "Wedding Lawns",
  },
];

const propertyTypeOptions = [
  { value: "", label: "All Properties" },
  { value: "FARMHOUSE", label: "Farmhouse" },
  { value: "VILLA", label: "Villa" },
  { value: "WEDDING_LAWN", label: "Wedding Lawn" },
];

const capacityOptions = [
  { value: "", label: "Any Capacity" },
  { value: "50", label: "50+ Guests" },
  { value: "100", label: "100+ Guests" },
  { value: "200", label: "200+ Guests" },
  { value: "300", label: "300+ Guests" },
  { value: "500", label: "500+ Guests" },
  { value: "750", label: "750+ Guests" },
  { value: "1000", label: "1000+ Guests" },
];

export default function HeroSection() {
  const router = useRouter();

  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [minimumCapacity, setMinimumCapacity] = useState("");
  const [isPropertyTypeOpen, setIsPropertyTypeOpen] = useState(false);
  const [isCapacityOpen, setIsCapacityOpen] = useState(false);

  const selectedPropertyTypeLabel =
    propertyTypeOptions.find(
      (option) => option.value === propertyType,
    )?.label ?? "All Properties";

  const selectedCapacityLabel =
    capacityOptions.find(
      (option) => option.value === minimumCapacity,
    )?.label ?? "Any Capacity";

  const visiblePropertyTypeOptions =
    propertyTypeOptions.filter(
      (option) => option.value !== propertyType,
    );

  const visibleCapacityOptions =
    capacityOptions.filter(
      (option) => option.value !== minimumCapacity,
    );

  const [availableCities, setAvailableCities] =
    useState<string[]>([]);

  const [highlightedPropertyTypeIndex, setHighlightedPropertyTypeIndex] =
    useState(0);

  const [highlightedCapacityIndex, setHighlightedCapacityIndex] =
    useState(0);

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
    setIsPropertyTypeOpen(false);
    setIsCapacityOpen(false);
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

  const handlePropertyTypeKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
  ) => {
  if (
    !isPropertyTypeOpen &&
    (event.key === "ArrowDown" ||
      event.key === "ArrowUp")
  ) {
    event.preventDefault();
    setIsPropertyTypeOpen(true);
    setIsCapacityOpen(false);
    setIsLocationFocused(false);
    setHighlightedPropertyTypeIndex(0);
    return;
  }

  if (!isPropertyTypeOpen) {
    return;
  }

  if (event.key === "ArrowDown") {
    event.preventDefault();

    setHighlightedPropertyTypeIndex((current) =>
      Math.min(
        current + 1,
        visiblePropertyTypeOptions.length - 1,
      ),
    );
  }

  if (event.key === "ArrowUp") {
    event.preventDefault();

    setHighlightedPropertyTypeIndex((current) =>
      Math.max(current - 1, 0),
    );
  }

  if (event.key === "Enter") {
    event.preventDefault();

    const selectedOption =
      visiblePropertyTypeOptions[
        highlightedPropertyTypeIndex
      ];

    if (selectedOption) {
      setPropertyType(selectedOption.value);
      setIsPropertyTypeOpen(false);
      setHighlightedPropertyTypeIndex(0);
    }
  }

  if (event.key === "Escape") {
    event.preventDefault();
    setIsPropertyTypeOpen(false);
    setHighlightedPropertyTypeIndex(0);
  }
};

const handleCapacityKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
  ) => {
    if (
      !isCapacityOpen &&
      (event.key === "ArrowDown" ||
        event.key === "ArrowUp")
    ) {
      event.preventDefault();
      setIsCapacityOpen(true);
      setIsPropertyTypeOpen(false);
      setIsLocationFocused(false);
      setHighlightedCapacityIndex(0);
      return;
    }

    if (!isCapacityOpen) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();

      setHighlightedCapacityIndex((current) =>
        Math.min(
          current + 1,
          visibleCapacityOptions.length - 1,
        ),
      );
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      setHighlightedCapacityIndex((current) =>
        Math.max(current - 1, 0),
      );
    }

    if (event.key === "Enter") {
      event.preventDefault();

      const selectedOption =
        visibleCapacityOptions[
          highlightedCapacityIndex
        ];

      if (selectedOption) {
        setMinimumCapacity(selectedOption.value);
        setIsCapacityOpen(false);
        setHighlightedCapacityIndex(0);
      }
    }

    if (event.key === "Escape") {
      event.preventDefault();
      setIsCapacityOpen(false);
      setHighlightedCapacityIndex(0);
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
      className="relative flex min-h-[100svh] items-center justify-center"
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
      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-col items-center px-4 pb-12 pt-24 text-center sm:px-6 sm:pb-16 sm:pt-28 lg:px-12 lg:pb-20 lg:pt-32">
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
            fontSize: "clamp(30px, 8vw, 64px)",
          }}
        >
          Find The Perfect Farmhouse, Villa & Wedding Lawn
        </h1>

        {/* Description */}
        <p className="mb-8 max-w-2xl text-sm leading-relaxed text-white/80 sm:mb-10 sm:text-base md:text-lg lg:mb-12 lg:text-xl">
          Discover farmhouses, villas and wedding venues for your next event. Explore properties on BookFarmVilla and connect with our experts for assistance.
        </p>

        {/* Platform statistics */}
        <div className="mb-8 grid w-full max-w-xl grid-cols-3 gap-2 sm:mb-10 sm:gap-6 lg:mb-12 lg:gap-12">
          {heroStatistics.map((statistic) => (
            <div key={statistic.label} className="text-center">
              <p className="text-2xl font-bold text-white sm:text-3xl md:text-4xl">
                {statistic.value}
              </p>

              <p className="mt-1 text-[10px] leading-4 text-white/70 sm:text-xs md:text-base">
                {statistic.label}
              </p>
            </div>
          ))}
        </div>

        {/* Search form outer container */}
        <form
          onSubmit={handleSearch}
          className="relative z-40 w-full max-w-5xl rounded-2xl border border-white/20 bg-white/10 p-2 shadow-2xl backdrop-blur-xl"
        >
          <div className="flex flex-col items-stretch gap-2 lg:flex-row lg:gap-1">
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
                  className="w-full bg-transparent text-sm font-medium text-gray-800 outline-none placeholder:text-gray-800 placeholder:opacity-100"
                />
              </label>
              {showCitySuggestions && (
                <ul
                  id="hero-city-suggestions"
                  role="listbox"
                  aria-label="Available cities"
                  className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 max-h-60 overflow-y-auto rounded-xl border border-gray-200 bg-white py-1 shadow-xl"
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
            <div className="my-2 hidden w-px bg-white/30 lg:block" />

            {/* Property type field */}
            <div
              className={`relative flex min-w-0 flex-1 items-center gap-3 rounded-xl bg-white px-4 py-3 text-left ${
                isPropertyTypeOpen ? "z-30" : "z-10"
              }`}
              onBlur={(event) => {
                const nextFocusedElement = event.relatedTarget;

                if (
                  !(nextFocusedElement instanceof Node) ||
                  !event.currentTarget.contains(nextFocusedElement)
                ) {
                  setIsPropertyTypeOpen(false);
                }
              }}
            >
              <Building2
                size={20}
                className="shrink-0 text-[#2EAD45]"
                aria-hidden="true"
              />

              <div className="min-w-0 flex-1">
                <span className="mb-0.5 block text-xs font-medium text-gray-400">
                  Property Type
                </span>

                <button
                  type="button"
                  role="combobox"
                  onClick={() => {
                    setIsPropertyTypeOpen((current) => !current);
                    setIsCapacityOpen(false);
                    setIsLocationFocused(false);
                    setHighlightedPropertyTypeIndex(0);
                  }}
                  onKeyDown={handlePropertyTypeKeyDown}
                  className="flex w-full items-center justify-between gap-2 bg-transparent text-left text-sm font-medium text-gray-800 outline-none"
                  aria-haspopup="listbox"
                  aria-expanded={isPropertyTypeOpen}
                  aria-controls="hero-property-type-options"
                  aria-activedescendant={
                    isPropertyTypeOpen
                      ? `hero-property-type-option-${highlightedPropertyTypeIndex}`
                      : undefined
                  }
                >
                  <span className="truncate">
                    {selectedPropertyTypeLabel}
                  </span>

                  <ChevronDown
                    size={16}
                    className={`shrink-0 transition-transform ${
                      isPropertyTypeOpen ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  />
                </button>
              </div>

              {isPropertyTypeOpen && (
                <ul
                  id="hero-property-type-options"
                  role="listbox"
                  aria-label="Select property type"
                  className="absolute left-0 right-0 top-[calc(100%+0.5rem)] overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-xl"
                >
                  {visiblePropertyTypeOptions.map(
                    (option, index) => {
                      const isActive =
                        index === highlightedPropertyTypeIndex;

                      return (
                        <li key={option.value || "all-properties"}>
                          <button
                            id={`hero-property-type-option-${index}`}
                            type="button"
                            role="option"
                            aria-selected={false}
                            onMouseEnter={() =>
                              setHighlightedPropertyTypeIndex(index)
                            }
                            onClick={() => {
                              setPropertyType(option.value);
                              setIsPropertyTypeOpen(false);
                              setHighlightedPropertyTypeIndex(0);
                            }}
                            className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium transition-colors ${
                              isActive
                                ? "bg-[#F0FDF4] text-[#1E8A32]"
                                : "text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            <Building2
                              size={15}
                              className="shrink-0 text-[#2EAD45]"
                              aria-hidden="true"
                            />

                            <span>{option.label}</span>
                          </button>
                        </li>
                      );
                    },
                  )}
                </ul>
              )}
            </div>

            {/* Desktop divider */}
            <div className="my-2 hidden w-px bg-white/30 lg:block" />

            {/* Guest capacity field */}
            <div
              className={`relative flex min-w-0 flex-1 items-center gap-3 rounded-xl bg-white px-4 py-3 text-left ${
                isCapacityOpen ? "z-30" : "z-10"
              }`}
              onBlur={(event) => {
                const nextFocusedElement = event.relatedTarget;

                if (
                  !(nextFocusedElement instanceof Node) ||
                  !event.currentTarget.contains(nextFocusedElement)
                ) {
                  setIsCapacityOpen(false);
                }
              }}
            >
              <Users
                size={20}
                className="shrink-0 text-[#2EAD45]"
                aria-hidden="true"
              />

              <div className="min-w-0 flex-1">
                <span className="mb-0.5 block text-xs font-medium text-gray-400">
                  Minimum Capacity
                </span>

                <button
                  type="button"
                  role="combobox"
                  onClick={() => {
                    setIsCapacityOpen((current) => !current);
                    setIsPropertyTypeOpen(false);
                    setIsLocationFocused(false);
                    setHighlightedCapacityIndex(0);
                  }}
                  onKeyDown={handleCapacityKeyDown}
                  className="flex w-full items-center justify-between gap-2 bg-transparent text-left text-sm font-medium text-gray-800 outline-none"
                  aria-haspopup="listbox"
                  aria-expanded={isCapacityOpen}
                  aria-controls="hero-capacity-options"
                  aria-activedescendant={
                    isCapacityOpen
                      ? `hero-capacity-option-${highlightedCapacityIndex}`
                      : undefined
                  }
                >
                  <span className="truncate">
                    {selectedCapacityLabel}
                  </span>

                  <ChevronDown
                    size={16}
                    className={`shrink-0 transition-transform ${
                      isCapacityOpen ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  />
                </button>
              </div>

              {isCapacityOpen && (
                <ul
                  id="hero-capacity-options"
                  role="listbox"
                  aria-label="Select minimum capacity"
                  className="absolute left-0 right-0 top-[calc(100%+0.5rem)] max-h-64 overflow-y-auto rounded-xl border border-gray-200 bg-white py-1 shadow-xl"
                >
                  {visibleCapacityOptions.map((option, index) => {
                    const isActive =
                      index === highlightedCapacityIndex;

                    return (
                      <li key={option.value || "any-capacity"}>
                        <button
                          id={`hero-capacity-option-${index}`}
                          type="button"
                          role="option"
                          aria-selected={false}
                          onMouseEnter={() =>
                            setHighlightedCapacityIndex(index)
                          }
                          onClick={() => {
                            setMinimumCapacity(option.value);
                            setIsCapacityOpen(false);
                            setHighlightedCapacityIndex(0);
                          }}
                          className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-medium transition-colors ${
                            isActive
                              ? "bg-[#F0FDF4] text-[#1E8A32]"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <Users
                            size={15}
                            className="shrink-0 text-[#2EAD45]"
                            aria-hidden="true"
                          />

                          <span>{option.label}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Search button */}
            <button
              type="submit"
              className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#2EAD45] px-8 py-4 font-semibold text-white shadow-lg shadow-green-500/30 transition-colors hover:bg-[#1E8A32] lg:py-3"
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