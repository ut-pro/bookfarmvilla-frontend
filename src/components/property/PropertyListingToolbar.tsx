"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { Search, Filter, X, ChevronDown, SlidersHorizontal, Users, MapPin } from "lucide-react";

import type { PropertyType } from "@/types/property";

interface PropertyListingToolbarProps {
  initialType?: PropertyType;
  initialCity?: string;
  initialSort?: string;
  initialKeyword?: string;
  userLocation?: { lat: number; lng: number } | null;
  onRequestLocation?: () => void;
}

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating_desc", label: "Highest Rated" },
  { value: "distance_asc", label: "Distance: Nearest First" },
];

const CITY_OPTIONS = [
  "Delhi",
  "Gurugram",
  "Noida",
];

export default function PropertyListingToolbar({
  initialType,
  initialCity,
  initialSort,
  initialKeyword,
  userLocation,
  onRequestLocation,
}: PropertyListingToolbarProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [type, setType] = useState<PropertyType | undefined>(initialType);
  const [city, setCity] = useState<string>(initialCity || "");
  const [sort, setSort] = useState<string>(initialSort || "relevance");
  const [keyword, setKeyword] = useState<string>(initialKeyword || "");
  const [showFilters, setShowFilters] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [hasLocation, setHasLocation] = useState(false);

  // Initialize from URL on mount
  useEffect(() => {
    const urlType = searchParams.get("type");
    const urlCity = searchParams.get("city");
    const urlSort = searchParams.get("sort");
    const urlKeyword = searchParams.get("keyword");

    // Validate type against known PropertyType values
    if (urlType && ["FARMHOUSE", "VILLA", "WEDDING_LAWN", "AIRBNB"].includes(urlType)) {
      setType(urlType as PropertyType);
    }
    if (urlCity && ["Delhi", "Gurugram", "Noida"].includes(urlCity)) setCity(urlCity);
    else if (urlCity) setCity("");
    if (urlSort) setSort(urlSort);
    if (urlKeyword) setKeyword(urlKeyword);
  }, [searchParams]);

  // Sync prop hasLocation to local state
  useEffect(() => {
    if (hasLocation) {
      setHasLocation(true);
    }
  }, [hasLocation]);

  // Helper to update URL
  const updateUrl = useCallback(
    (params: Record<string, string | undefined>) => {
      const newParams = new URLSearchParams(searchParams.toString());

      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          newParams.set(key, value);
        } else {
          newParams.delete(key);
        }
      });

      router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const handleTypeChange = (newType: string | undefined) => {
    const validatedType = newType && ["FARMHOUSE", "VILLA", "WEDDING_LAWN", "AIRBNB"].includes(newType)
      ? newType as PropertyType
      : undefined;
    setType(validatedType);
    updateUrl({ type: validatedType });
  };

  const handleCityChange = (newCity: string) => {
    setCity(newCity);
    updateUrl({ city: newCity || undefined });
  };

  const handleSortChange = (newSort: string) => {
    setSort(newSort);
    updateUrl({ sort: newSort !== "relevance" ? newSort : undefined });
  };

  const handleKeywordChange = (newKeyword: string) => {
    setKeyword(newKeyword);
    // Debounce keyword search
    const timeoutId = setTimeout(() => {
      updateUrl({ keyword: newKeyword || undefined });
    }, 300);
    return () => clearTimeout(timeoutId);
  };

  const handleClearFilters = () => {
    setType(undefined);
    setCity("");
    setSort("relevance");
    setKeyword("");
    updateUrl({ type: undefined, city: undefined, sort: undefined, keyword: undefined });
  };

  const hasActiveFilters = Boolean(type || city || keyword);

  // Request location permission when user selects distance sort
  const requestLocationAndSort = () => {
    if (sort === "distance_asc") {
      if (!navigator.geolocation) {
        setSort("relevance");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setHasLocation(true);
        },
        () => {
          // User denied or error - fall back to relevance
          setSort("relevance");
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    }
  };

  // Only show distance sort option if we have location or user explicitly selected it
  const showDistanceSort = userLocation || sort === "distance_asc";

  const effectiveSortOptions = SORT_OPTIONS.filter(option =>
    option.value !== "distance_asc" || showDistanceSort
  );

  return (
    <div className="space-y-4 sm:space-y-0 sm:flex sm:items-end sm:justify-between sm:gap-4">
      {/* Search Input */}
      <div className="relative flex-1 max-w-xs sm:max-w-md">
        <label htmlFor="property-search" className="sr-only">
          Search properties
        </label>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden="true" />
        <input
          id="property-search"
          type="search"
          value={keyword}
          onChange={(e) => handleKeywordChange(e.target.value)}
          placeholder="Search by name, location..."
          className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-[#2EAD45] focus:border-transparent"
          autoComplete="off"
        />
        {keyword && (
          <button
            onClick={() => handleKeywordChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <X size={18} aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Desktop Filters */}
      <div className="hidden sm:flex sm:items-center sm:gap-3">
        {/* Type Filter */}
        <div className="relative">
          <label htmlFor="property-type" className="sr-only">
            Property type
          </label>
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden="true" />
          <select
            id="property-type"
            value={type || ""}
            onChange={(e) => handleTypeChange(e.target.value || undefined)}
            className="h-11 pl-10 pr-10 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 appearance-none cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-[#2EAD45] focus:border-transparent"
          >
            <option value="">All Types</option>
            <option value="FARMHOUSE">Farmhouses</option>
            <option value="VILLA">Villas</option>
            <option value="WEDDING_LAWN">Wedding Lawns</option>
            <option value="AIRBNB">Holiday Homes</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" aria-hidden="true" />
        </div>

        {/* City Filter */}
        <div className="relative">
          <label htmlFor="property-city" className="sr-only">
            City
          </label>
          <MapPin size={5} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
          <select
            id="property-city"
            value={city}
            onChange={(e) => handleCityChange(e.target.value)}
            className="h-11 pl-10 pr-10 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 appearance-none cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-[#2EAD45] focus:border-transparent"
          >
            <option value="">All Cities</option>
            {CITY_OPTIONS.map((cityOption) => (
              <option key={cityOption} value={cityOption}>
                {cityOption}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" aria-hidden="true" />
        </div>

        {/* Sort Filter */}
        <div className="relative">
          <label htmlFor="property-sort" className="sr-only">
            Sort by
          </label>
          <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden="true" />
          <select
            id="property-sort"
            value={sort}
            onChange={(e) => {
              const newSort = e.target.value;
              handleSortChange(newSort);
              if (newSort === "distance_asc") {
                requestLocationAndSort();
              }
            }}
            className="h-11 pl-10 pr-10 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 appearance-none cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-[#2EAD45] focus:border-transparent"
          >
            {effectiveSortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" aria-hidden="true" />
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 transition-colors hover:border-[#2EAD45] hover:text-[#1E8A32] hover:bg-green-50"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Mobile Filter Button */}
      <div className="sm:hidden">
        <button
          onClick={() => setIsMobileFilterOpen(true)}
          className="w-full h-11 rounded-xl border border-gray-200 bg-white flex items-center justify-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:border-[#2EAD45] hover:text-[#1E8A32] hover:bg-green-50"
        >
          <SlidersHorizontal size={18} aria-hidden="true" />
          Filters
          {hasActiveFilters && (
            <span className="rounded-full bg-[#2EAD45] px-2 py-0.5 text-xs font-semibold text-white">
              {(type ? 1 : 0) + (city ? 1 : 0) + (keyword ? 1 : 0)}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}