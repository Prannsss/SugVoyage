"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  X,
  Landmark,
  Umbrella,
  Utensils,
  LocateFixed,
} from "lucide-react";
import { getSpots } from "@/services/spotService";
// @ts-ignore
import "maplibre-gl/dist/maplibre-gl.css";
import { MapComponent } from "./components/MapComponent";
import { MapControls } from "./components/MapControls";
import { PlaceDetailsSheet } from "./components/PlaceDetailsSheet";

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
  // ... rest of the mapPlaces array
];

interface MapPlace {
  id: string | number;
  title: string;
  description: string;
  distance: number;
  distanceText: string;
  rating: number;
  image: string;
  image_url?: string;
  hint: string;
  category: string;
  position: { lat: number; lng: number };
  icon: any;
  iconBg: string;
  featured?: boolean;
  price?: string;
  location?: string;
  reviews?: number;
  days?: string;
  activities?: string[];
  geofence?: boolean;
  ml_validated?: boolean;
  source?: string;
  scraped_at?: string;
  type?: string;
}

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
  const [spots, setSpots] = useState<MapPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const MAPTILER_API_KEY = process.env.NEXT_PUBLIC_MAPTILER_API_KEY || "";
  const [viewport, setViewport] = useState({
    latitude: 10.3157, // Cebu City latitude
    longitude: 123.8854, // Cebu City longitude
    zoom: 12, // Zoom level to show Cebu island
  });

  // Refs for dynamic styling
  const mapRef = useRef<any>(null);

  // Fetch spots on component mount
  useEffect(() => {
    const fetchSpots = async () => {
      try {
        setLoading(true);
        const response = await getSpots();
        if (response.success) {
          // Transform backend data to match MapPlace structure
          const transformedSpots: MapPlace[] = response.data.map(
            (spot: any) => {
              // Map category to icon and color
              let icon = Landmark;
              let iconBg = "bg-primary";
              if (spot.category.toLowerCase().includes("beach")) {
                icon = Umbrella;
                iconBg = "bg-cyan-500";
              } else if (spot.category.toLowerCase().includes("restaurant")) {
                icon = Utensils;
                iconBg = "bg-accent";
              }

              return {
                id: spot._id,
                title: spot.name,
                description: spot.description || "No description available",
                distance: 0, // Will be calculated based on user location
                distanceText: "Distance not calculated",
                rating: spot.rating || 0,
                image:
                  spot.image_url || "https://picsum.photos/400/300?random=300",
                hint: spot.category,
                category: spot.category.toLowerCase().includes("beach")
                  ? "beaches"
                  : spot.category.toLowerCase().includes("restaurant")
                  ? "restaurants"
                  : "history",
                position: { lat: spot.latitude, lng: spot.longitude },
                icon,
                iconBg,
              };
            }
          );
          setSpots(transformedSpots);
        } else {
          setError(response.message || "Failed to fetch spots");
        }
      } catch (err) {
        console.error("Error fetching spots:", err);
        setError("Failed to fetch spots");
      } finally {
        setLoading(false);
      }
    };

    fetchSpots();
  }, []);

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
            heading: heading || undefined,
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
    return spots.filter((place) => {
      const matchesFilter = activeFilters.includes(place.category);
      const withinRadius = place.distance <= radius[0];
      const matchesSearch =
        searchQuery === "" ||
        place.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && withinRadius && matchesSearch;
    });
  }, [spots, activeFilters, radius, searchQuery]);

  // Search results for dropdown
  const searchResults = useMemo(() => {
    if (searchQuery.length < 2) return [];
    return spots
      .filter(
        (place) =>
          place.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          place.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 5);
  }, [spots, searchQuery]);

  // Handle search result click
  const handleSearchResultClick = (place: MapPlace) => {
    handleMarkerClick(place);
    setSearchQuery("");
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#e8e4d8]">
      <MapComponent
        viewport={viewport}
        onViewportChange={setViewport}
        filteredPlaces={filteredPlaces}
        selectedPlace={selectedPlace}
        onMarkerClick={handleMarkerClick}
        onPopupClose={() => setSelectedPlace(null)}
        userLocation={userLocation}
        MAPTILER_API_KEY={MAPTILER_API_KEY}
      />

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

      <MapControls
        onBack={() => window.history.back()}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isSearchFocused={isSearchFocused}
        onSearchFocus={() => setIsSearchFocused(true)}
        onSearchBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
        searchResults={searchResults}
        onSearchResultClick={handleSearchResultClick}
        activeFilters={activeFilters}
        onToggleFilter={toggleFilter}
        onZoomIn={() => setZoomLevel((prev) => Math.min(prev + 1, 18))}
        onZoomOut={() => setZoomLevel((prev) => Math.max(prev - 1, 1))}
        onLocateMe={handleLocateMe}
        isLocating={isLocating}
        radius={radius}
        onRadiusChange={setRadius}
        filteredPlacesCount={filteredPlaces.length}
      />

      <PlaceDetailsSheet
        isSheetOpen={isSheetOpen}
        onSheetOpenChange={setIsSheetOpen}
        selectedPlace={selectedPlace}
      />
    </div>
  );
}
