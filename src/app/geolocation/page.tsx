"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Map, {
  Marker,
  Popup,
  NavigationControl,
  FullscreenControl,
  GeolocateControl,
} from "react-map-gl/maplibre";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Umbrella,
  Utensils,
  Landmark,
  Plus,
  Minus,
  LocateFixed,
  Star,
  Navigation,
  CircleDot,
  Search,
  X,
  ArrowLeft,
  Navigation as NavigationIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import "maplibre-gl/dist/maplibre-gl.css";

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

// Category filters
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

// Map markers/places data with distance from center (Cebu City)
const mapPlaces = [
  {
    id: 1,
    title: "Magellan's Cross",
    description:
      "A Christian cross planted by Portuguese and Spanish explorers as ordered by Ferdinand Magellan upon arriving in Cebu.",
    distance: 2.5,
    distanceText: "2.5 km away",
    rating: 4.7,
    image: "https://picsum.photos/400/300?random=300",
    hint: "historic landmark",
    category: "history",
    position: { lat: 10.2928, lng: 123.9021 },
    icon: Landmark,
    iconBg: "bg-primary",
  },
  {
    id: 2,
    title: "Lantaw Floating Restaurant",
    description:
      "Famous seafood restaurant with stunning views of the Mactan Channel. Known for fresh catch and Filipino cuisine.",
    distance: 4.2,
    distanceText: "4.2 km away",
    rating: 4.5,
    image: "https://picsum.photos/400/300?random=301",
    hint: "restaurant seafood",
    category: "restaurants",
    position: { lat: 10.2839, lng: 123.9333 },
    icon: Utensils,
    iconBg: "bg-accent",
  },
  {
    id: 3,
    title: "Mactan Beach Resort",
    description:
      "Beautiful white sand beach with crystal clear waters. Perfect for swimming, snorkeling, and water activities.",
    distance: 8.1,
    distanceText: "8.1 km away",
    rating: 4.8,
    image: "https://picsum.photos/400/300?random=302",
    hint: "beach resort",
    category: "beaches",
    position: { lat: 10.2625, lng: 123.9919 },
    icon: Umbrella,
    iconBg: "bg-cyan-500",
  },
  {
    id: 4,
    title: "House of Lechon",
    description:
      "The best place to try authentic Cebu lechon (roasted pig). A must-visit for food lovers.",
    distance: 1.2,
    distanceText: "1.2 km away",
    rating: 4.6,
    image: "https://picsum.photos/400/300?random=303",
    hint: "filipino food",
    category: "restaurants",
    position: { lat: 10.3088, lng: 123.9076 },
    icon: Utensils,
    iconBg: "bg-accent",
  },
  {
    id: 5,
    title: "Fort San Pedro",
    description:
      "The oldest and smallest fort in the Philippines, built by Spanish conquistador Miguel López de Legazpi.",
    distance: 3.0,
    distanceText: "3.0 km away",
    rating: 4.4,
    image: "https://picsum.photos/400/300?random=304",
    hint: "historic fort",
    category: "history",
    position: { lat: 10.2925, lng: 123.9048 },
    icon: Landmark,
    iconBg: "bg-primary",
  },
  {
    id: 6,
    title: "Shangri-La Beach",
    description:
      "Luxurious beachfront resort with pristine white sand and world-class amenities.",
    distance: 12,
    distanceText: "12 km away",
    rating: 4.9,
    image: "https://picsum.photos/400/300?random=305",
    hint: "luxury beach",
    category: "beaches",
    position: { lat: 10.2789, lng: 124.0183 },
    icon: Umbrella,
    iconBg: "bg-cyan-500",
  },
  {
    id: 7,
    title: "Zubuchon",
    description:
      "Award-winning lechon restaurant, voted as having the best pig in the world by Anthony Bourdain.",
    distance: 5.5,
    distanceText: "5.5 km away",
    rating: 4.8,
    image: "https://picsum.photos/400/300?random=306",
    hint: "lechon restaurant",
    category: "restaurants",
    position: { lat: 10.3197, lng: 123.9052 },
    icon: Utensils,
    iconBg: "bg-accent",
  },
];

type MapPlace = (typeof mapPlaces)[0];

export default function GeolocationPage() {
  const [activeFilters, setActiveFilters] = useState<string[]>([
    "beaches",
    "restaurants",
    "history",
  ]);
  const [zoomLevel, setZoomLevel] = useState(13);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
    heading?: number;
  } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<MapPlace | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [radius, setRadius] = useState([5]); // Default 5km radius
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const MAPTILER_API_KEY = process.env.NEXT_PUBLIC_MAPTILER_API_KEY || "";
  const [viewport, setViewport] = useState({
    latitude: 10.3157, // Cebu City latitude
    longitude: 123.8854, // Cebu City longitude
    zoom: 12, // Zoom level to show Cebu island
  });

  // Refs for dynamic styling
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Ask for location permission on component mount
  useEffect(() => {
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        if (result.state === "prompt") {
          setShowLocationPrompt(true);
        } else if (result.state === "granted") {
          handleGetUserLocation();
        }
      });
    }
  }, []);

  // Get user's current location with heading
  const handleGetUserLocation = () => {
    setIsLocating(true);
    setShowLocationPrompt(false);

    if ("geolocation" in navigator) {
      const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, heading } = position.coords;
          setUserLocation({
            lat: latitude,
            lng: longitude,
            heading: heading,
          });

          // Fly to user's location
          setViewport((prev) => ({
            ...prev,
            latitude,
            longitude,
            zoom: 15,
          }));
          setIsLocating(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLocating(false);
          alert(
            "Unable to get your location. Please enable location services in your browser settings."
          );
        },
        options
      );
    } else {
      alert("Geolocation is not supported by your browser.");
      setIsLocating(false);
    }
  };

  const handleLocateMe = () => {
    handleGetUserLocation();
  };

  // Toggle filter
  const toggleFilter = (filterId: string) => {
    setActiveFilters((prev) =>
      prev.includes(filterId)
        ? prev.filter((f) => f !== filterId)
        : [...prev, filterId]
    );
  };

  // Handle marker click
  const handleMarkerClick = (place: MapPlace) => {
    setSelectedPlace(place);
    setIsSheetOpen(true);
  };

  // Filter places based on active filters, radius, AND search query
  const filteredPlaces = useMemo(() => {
    return mapPlaces.filter((place) => {
      const matchesFilter = activeFilters.includes(place.category);
      const withinRadius = place.distance <= radius[0];
      const matchesSearch =
        searchQuery === "" ||
        place.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && withinRadius && matchesSearch;
    });
  }, [activeFilters, radius, searchQuery]);

  // Search results for dropdown
  const searchResults = useMemo(() => {
    if (searchQuery.length < 2) return [];
    return mapPlaces
      .filter(
        (place) =>
          place.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          place.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 5);
  }, [searchQuery]);

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#e8e4d8]">
      <Map
        ref={mapContainerRef}
        {...viewport}
        onMove={(evt) => setViewport(evt.viewState)}
        style={{ width: "100%", height: "100%" }}
        mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${MAPTILER_API_KEY}`}
      >
        <GeolocateControl
          position="top-right"
          positionOptions={{ enableHighAccuracy: true }}
          trackUserLocation={true}
          showUserLocation={true}
        />

        {filteredPlaces.map((place) => (
          <Marker
            key={place.id}
            latitude={place.position.lat}
            longitude={place.position.lng}
            anchor="bottom"
          >
            <button
              onClick={() => handleMarkerClick(place)}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110",
                place.iconBg,
                "shadow-lg border-2 border-white"
              )}
              aria-label={place.title}
            >
              <place.icon className="h-5 w-5 text-white" />
            </button>
          </Marker>
        ))}

        {/* User's current location marker with arrow */}
        {userLocation && (
          <>
            <Marker
              latitude={userLocation.lat}
              longitude={userLocation.lng}
              anchor="center"
            >
              <div className="relative">
                {/* Arrow showing user's heading */}
                {userLocation.heading && (
                  <div
                    className="absolute -top-6 -left-3 z-10"
                    style={{
                      transform: `rotate(${userLocation.heading}deg)`,
                      transformOrigin: "center",
                    }}
                  >
                    <NavigationIcon className="h-6 w-6 text-blue-600 fill-blue-600" />
                  </div>
                )}
                {/* User location dot */}
                <div className="w-6 h-6 bg-blue-500 rounded-full border-3 border-white shadow-lg relative">
                  {/* Inner pulse effect */}
                  <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-70" />
                </div>
              </div>
            </Marker>
          </>
        )}

        {selectedPlace && (
          <Popup
            latitude={selectedPlace.position.lat}
            longitude={selectedPlace.position.lng}
            closeButton={true}
            closeOnClick={false}
            onClose={() => setSelectedPlace(null)}
            anchor="top"
            className="z-50"
          >
            <div className="p-2">
              <h3 className="font-bold text-sm">{selectedPlace.title}</h3>
              <p className="text-xs text-muted-foreground">
                {selectedPlace.distanceText}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                <span className="text-xs">{selectedPlace.rating}</span>
              </div>
            </div>
          </Popup>
        )}
      </Map>

      {/* Location Permission Prompt */}
      {showLocationPrompt && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-card/95 backdrop-blur-md border border-border rounded-2xl shadow-2xl p-6 max-w-md mx-4">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <LocateFixed className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Enable Location</h3>
                <p className="text-muted-foreground mt-2">
                  Allow access to your location to see nearby places and get
                  personalized recommendations.
                </p>
              </div>
              <div className="flex gap-3 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowLocationPrompt(false)}
                  className="flex-1"
                >
                  Not Now
                </Button>
                <Button onClick={handleGetUserLocation} className="flex-1">
                  Allow Location
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Back Button */}
      <div className="absolute top-4 left-4 z-40">
        <Button
          variant="secondary"
          size="icon"
          onClick={() => window.history.back()}
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
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              className="w-full pl-10 pr-10 h-11 rounded-full bg-card/95 backdrop-blur-md border-border shadow-lg"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
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
                  onClick={() => {
                    handleMarkerClick(place);
                    setSearchQuery("");
                  }}
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
      <div className="absolute top-20 left-4 right-4 z-40 flex gap-2 justify-center flex-wrap">
        {filterCategories.map((filter) => (
          <Button
            key={filter.id}
            variant={
              activeFilters.includes(filter.id) ? "default" : "secondary"
            }
            size="sm"
            onClick={() => toggleFilter(filter.id)}
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
          onClick={() => setZoomLevel((prev) => Math.min(prev + 1, 18))}
          className="rounded-xl bg-card/95 backdrop-blur-md shadow-lg h-10 w-10"
        >
          <Plus className="h-5 w-5" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={() => setZoomLevel((prev) => Math.max(prev - 1, 1))}
          className="rounded-xl bg-card/95 backdrop-blur-md shadow-lg h-10 w-10"
        >
          <Minus className="h-5 w-5" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={handleLocateMe}
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
                onValueChange={setRadius}
                min={1}
                max={15}
                step={1}
                className="w-full"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            {filteredPlaces.length} places within radius
          </p>
        </div>
      </div>

      {/* Place Details Sheet (Slide-up Modal) */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent
          side="bottom"
          className="rounded-t-3xl h-auto max-h-[70vh] pb-8 z-50"
        >
          {selectedPlace && (
            <>
              <SheetHeader className="sr-only">
                <SheetTitle>{selectedPlace.title}</SheetTitle>
              </SheetHeader>

              <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-4" />

              {/* Place Image */}
              <div className="relative h-48 w-full rounded-2xl overflow-hidden mb-4">
                <Image
                  src={selectedPlace.image}
                  alt={selectedPlace.title}
                  fill
                  className="object-cover"
                  data-ai-hint={selectedPlace.hint}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h2 className="text-xl font-bold text-white font-headline">
                    {selectedPlace.title}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-white text-sm">
                        {selectedPlace.rating}
                      </span>
                    </div>
                    <span className="text-white/70 text-sm">•</span>
                    <span className="text-white/70 text-sm">
                      {selectedPlace.distanceText}
                    </span>
                  </div>
                </div>
              </div>

              {/* Place Description */}
              <p className="text-muted-foreground mb-6">
                {selectedPlace.description}
              </p>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button asChild className="flex-1">
                  <Link href={`/explore/${slugify(selectedPlace.title)}`}>
                    View Details
                  </Link>
                </Button>
                <Button variant="outline" className="gap-2">
                  <Navigation className="h-4 w-4" />
                  Directions
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
