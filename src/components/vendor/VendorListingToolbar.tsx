"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { Search, Filter, X, ChevronDown, SlidersHorizontal, MapPin } from "lucide-react";

import type { VendorCategoryFilter } from "@/types/vendor";

interface VendorListingToolbarProps {
  initialCategory?: VendorCategoryFilter;
}

const VENDOR_CITY_OPTIONS = [
  "Delhi",
  "Noida",
  "Gurugram",
  "Greater Noida",
  "Faridabad",
  "Ghaziabad",
];

const VENDOR_SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "rating_desc", label: "Highest Rated" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" },
];

export default function VendorListingToolbar({
  initialCategory,
}: VendorListingToolbarProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [category, setCategory] = useState<VendorCategoryFilter | undefined>(initialCategory);
  const [city, setCity] = useState<string>("");
  const [sort, setSort] = useState<string>("relevance");
  const [keyword, setKeyword] = useState<string>("");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Initialize from URL on mount
  useEffect(() => {
    const urlCategory = searchParams.get("category");
    const urlCity = searchParams.get("city");
    const urlSort = searchParams.get("sort");
    const urlKeyword = searchParams.get("keyword");

    // Validate category against known VendorCategoryFilter values
    if (urlCategory && ["CATERER", "PHOTOGRAPHER", "MAKEUP_ARTIST", "DJ", "DECORATOR", "OTHER_SERVICES"].includes(urlCategory)) {
      setCategory(urlCategory as VendorCategoryFilter);
    }
    if (urlCity) setCity(urlCity);
    if (urlSort) setSort(urlSort);
    if (urlKeyword) setKeyword(urlKeyword);
  }, [searchParams]);

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

  const handleCategoryChange = (newCategory: string | undefined) => {
    const validatedCategory = newCategory && ["CATERER", "PHOTOGRAPHER", "MAKEUP_ARTIST", "DJ", "DECORATOR", "OTHER_SERVICES"].includes(newCategory)
      ? newCategory as VendorCategoryFilter
      : undefined;
    setCategory(validatedCategory);
    updateUrl({ category: validatedCategory });
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
    const timeoutId = setTimeout(() => {
      updateUrl({ keyword: newKeyword || undefined });
    }, 300);
    return () => clearTimeout(timeoutId);
  };

  const handleClearFilters = () => {
    setCategory(undefined);
    setCity("");
    setSort("relevance");
    setKeyword("");
    updateUrl({ category: undefined, city: undefined, sort: undefined, keyword: undefined });
  };

  const hasActiveFilters = Boolean(category || city || keyword);

  return (
    <div className="space-y-4 sm:space-y-0 sm:flex sm:items-end sm:justify-between sm:gap-4">
      {/* Search Input */}
      <div className="relative flex-1 max-w-xs sm:max-w-md">
        <label htmlFor="vendor-search" className="sr-only">
          Search vendors
        </label>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden="true" />
        <input
          id="vendor-search"
          type="search"
          value={keyword}
          onChange={(e) => handleKeywordChange(e.target.value)}
          placeholder="Search by name, service..."
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
        {/* Category Filter */}
        <div className="relative">
          <label htmlFor="vendor-category" className="sr-only">
            Service category
          </label>
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden="true" />
          <select
            id="vendor-category"
            value={category || ""}
            onChange={(e) => handleCategoryChange(e.target.value || undefined)}
            className="h-11 pl-10 pr-10 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 appearance-none cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-[#2EAD45] focus:border-transparent"
          >
            <option value="">All Services</option>
            <option value="CATERER">Catering</option>
            <option value="PHOTOGRAPHER">Photography</option>
            <option value="MAKEUP_ARTIST">Makeup & Styling</option>
            <option value="DJ">DJ & Entertainment</option>
            <option value="DECORATOR">Decoration</option>
            <option value="OTHER_SERVICES">Other Event Services</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" aria-hidden="true" />
        </div>

        {/* City Filter */}
        <div className="relative">
          <label htmlFor="vendor-city" className="sr-only">
            City
          </label>
          <MapPin size={5} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
          <select
            id="vendor-city"
            value={city}
            onChange={(e) => handleCityChange(e.target.value)}
            className="h-11 pl-10 pr-10 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 appearance-none cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-[#2EAD45] focus:border-transparent"
          >
            <option value="">All Cities</option>
            {VENDOR_CITY_OPTIONS.map((cityOption) => (
              <option key={cityOption} value={cityOption}>
                {cityOption}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" aria-hidden="true" />
        </div>

        {/* Sort Filter */}
        <div className="relative">
          <label htmlFor="vendor-sort" className="sr-only">
            Sort by
          </label>
          <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden="true" />
          <select
            id="vendor-sort"
            value={sort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="h-11 pl-10 pr-10 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 appearance-none cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-[#2EAD45] focus:border-transparent"
          >
            {VENDOR_SORT_OPTIONS.map((option) => (
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
              {(category ? 1 : 0) + (city ? 1 : 0) + (keyword ? 1 : 0)}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}