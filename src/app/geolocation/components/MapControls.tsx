import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Plus,
  Minus,
  LocateFixed,
  CircleDot,
  Search,
  X,
  ArrowLeft,
  Umbrella,
  Utensils,
  Landmark,
} from "lucide-react";
import { cn } from "@/lib/utils";

const filterCategories = [
  { id: "beaches", label: "Beaches", icon: Umbrella, color: "bg-cyan-500" },
  {
    id: "restaurants",
    label: "Restaurants",
    icon: Utensils,
    color: "bg-accent",
  },
  { id: "history", label: "History", icon: Landmark, color: "bg-amber-500" },
];

interface MapControlsProps {
  onBack: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  isSearchFocused: boolean;
  onSearchFocus: () => void;
  onSearchBlur: () => void;
  searchResults: any[];
  onSearchResultClick: (place: any) => void;
  activeFilters: string[];
  onToggleFilter: (filterId: string) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onLocateMe: () => void;
  isLocating: boolean;
  radius: number[];
  onRadiusChange: (value: number[]) => void;
  filteredPlacesCount: number;
}

export function MapControls({
  onBack,
  searchQuery,
  onSearchChange,
  isSearchFocused,
  onSearchFocus,
  onSearchBlur,
  searchResults,
  onSearchResultClick,
  activeFilters,
  onToggleFilter,
  onZoomIn,
  onZoomOut,
  onLocateMe,
  isLocating,
  radius,
  onRadiusChange,
  filteredPlacesCount,
}: MapControlsProps) {
  return (
    <>
      {/* Back Button */}
      <div className="absolute top-4 left-4 z-40">
        <Button
          variant="secondary"
          size="icon"
          onClick={onBack}
          className="rounded-full bg-card/95 backdrop-blur-md shadow-lg h-11 w-11"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      {/* Search Bar - Top */}
      <div className="absolute top-4 left-20 right-4 z-40">
        <div className="relative max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search places..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={onSearchFocus}
              onBlur={onSearchBlur}
              className="w-full pl-10 pr-10 h-11 rounded-full bg-card/95 backdrop-blur-md border-border shadow-lg"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full"
                aria-label="Clear search"
                title="Clear search"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>

          {/* Search Results Dropdown */}
          {isSearchFocused && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-card/95 backdrop-blur-md border border-border rounded-2xl shadow-lg overflow-hidden">
              {searchResults.map((place) => (
                <button
                  key={place.id}
                  onClick={() => onSearchResultClick(place)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-muted transition-colors text-left"
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                      place.iconBg
                    )}
                  >
                    <place.icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {place.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {place.distanceText}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Filter Chips - Below Search */}
      <div className="absolute top-20 left-4 right-4 z-20 flex gap-2 justify-center flex-wrap">
        {filterCategories.map((filter) => (
          <Button
            key={filter.id}
            variant={
              activeFilters.includes(filter.id) ? "default" : "secondary"
            }
            size="sm"
            onClick={() => onToggleFilter(filter.id)}
            className={cn(
              "rounded-full gap-2 transition-all duration-200 shadow-lg",
              activeFilters.includes(filter.id)
                ? `${filter.color} text-white hover:opacity-90`
                : "bg-card/95 backdrop-blur-md hover:bg-card"
            )}
          >
            <filter.icon className="h-4 w-4" />
            {filter.label}
          </Button>
        ))}
      </div>

      {/* Map Controls - Right side */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-40">
        <Button
          variant="secondary"
          size="icon"
          onClick={onZoomIn}
          className="rounded-xl bg-card/95 backdrop-blur-md shadow-lg h-10 w-10"
        >
          <Plus className="h-5 w-5" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={onZoomOut}
          className="rounded-xl bg-card/95 backdrop-blur-md shadow-lg h-10 w-10"
        >
          <Minus className="h-5 w-5" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={onLocateMe}
          disabled={isLocating}
          className="rounded-xl bg-card/95 backdrop-blur-md shadow-lg h-10 w-10 mt-2"
        >
          <LocateFixed
            className={cn("h-5 w-5", isLocating && "animate-pulse")}
          />
        </Button>
      </div>

      {/* Radius Adjuster - Bottom */}
      <div className="absolute bottom-24 md:bottom-8 left-4 right-4 z-40">
        <div className="bg-card/95 backdrop-blur-md border border-border rounded-2xl shadow-lg p-4 max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <CircleDot className="h-5 w-5 text-primary flex-shrink-0" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Search Radius</span>
                <span className="text-sm font-semibold text-primary">
                  {radius[0]} km
                </span>
              </div>
              <Slider
                value={radius}
                onValueChange={onRadiusChange}
                min={1}
                max={15}
                step={1}
                className="w-full"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            {filteredPlacesCount} places within radius
          </p>
        </div>
      </div>
    </>
  );
}
