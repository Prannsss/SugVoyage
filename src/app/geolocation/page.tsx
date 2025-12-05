'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
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
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

// Category filters
const filterCategories = [
  { id: 'beaches', label: 'Beaches', icon: Umbrella, color: 'bg-cyan-500' },
  { id: 'restaurants', label: 'Restaurants', icon: Utensils, color: 'bg-accent' },
  { id: 'history', label: 'History', icon: Landmark, color: 'bg-amber-500' },
];

// Map markers/places data with distance from center
const mapPlaces = [
  {
    id: 1,
    title: "Magellan's Cross",
    description: 'A Christian cross planted by Portuguese and Spanish explorers as ordered by Ferdinand Magellan upon arriving in Cebu.',
    distance: 2.5,
    distanceText: '2.5 km away',
    rating: 4.7,
    image: 'https://picsum.photos/400/300?random=300',
    hint: 'historic landmark',
    category: 'history',
    position: { top: 35, left: 48 },
    icon: Landmark,
    iconBg: 'bg-primary',
  },
  {
    id: 2,
    title: 'Lantaw Floating Restaurant',
    description: 'Famous seafood restaurant with stunning views of the Mactan Channel. Known for fresh catch and Filipino cuisine.',
    distance: 4.2,
    distanceText: '4.2 km away',
    rating: 4.5,
    image: 'https://picsum.photos/400/300?random=301',
    hint: 'restaurant seafood',
    category: 'restaurants',
    position: { top: 30, left: 62 },
    icon: Utensils,
    iconBg: 'bg-accent',
  },
  {
    id: 3,
    title: 'Mactan Beach Resort',
    description: 'Beautiful white sand beach with crystal clear waters. Perfect for swimming, snorkeling, and water activities.',
    distance: 8.1,
    distanceText: '8.1 km away',
    rating: 4.8,
    image: 'https://picsum.photos/400/300?random=302',
    hint: 'beach resort',
    category: 'beaches',
    position: { top: 25, left: 70 },
    icon: Umbrella,
    iconBg: 'bg-cyan-500',
  },
  {
    id: 4,
    title: 'House of Lechon',
    description: 'The best place to try authentic Cebu lechon (roasted pig). A must-visit for food lovers.',
    distance: 1.2,
    distanceText: '1.2 km away',
    rating: 4.6,
    image: 'https://picsum.photos/400/300?random=303',
    hint: 'filipino food',
    category: 'restaurants',
    position: { top: 52, left: 45 },
    icon: Utensils,
    iconBg: 'bg-accent',
  },
  {
    id: 5,
    title: 'Fort San Pedro',
    description: 'The oldest and smallest fort in the Philippines, built by Spanish conquistador Miguel López de Legazpi.',
    distance: 3.0,
    distanceText: '3.0 km away',
    rating: 4.4,
    image: 'https://picsum.photos/400/300?random=304',
    hint: 'historic fort',
    category: 'history',
    position: { top: 58, left: 52 },
    icon: Landmark,
    iconBg: 'bg-primary',
  },
  {
    id: 6,
    title: 'Shangri-La Beach',
    description: 'Luxurious beachfront resort with pristine white sand and world-class amenities.',
    distance: 12,
    distanceText: '12 km away',
    rating: 4.9,
    image: 'https://picsum.photos/400/300?random=305',
    hint: 'luxury beach',
    category: 'beaches',
    position: { top: 20, left: 75 },
    icon: Umbrella,
    iconBg: 'bg-cyan-500',
  },
  {
    id: 7,
    title: 'Zubuchon',
    description: 'Award-winning lechon restaurant, voted as having the best pig in the world by Anthony Bourdain.',
    distance: 5.5,
    distanceText: '5.5 km away',
    rating: 4.8,
    image: 'https://picsum.photos/400/300?random=306',
    hint: 'lechon restaurant',
    category: 'restaurants',
    position: { top: 40, left: 38 },
    icon: Utensils,
    iconBg: 'bg-accent',
  },
];

type MapPlace = typeof mapPlaces[0];

export default function GeolocationPage() {
  const [activeFilters, setActiveFilters] = useState<string[]>(['beaches', 'restaurants', 'history']);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<MapPlace | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [radius, setRadius] = useState([5]); // Default 5km radius
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Refs for dynamic styling
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const radiusCircleRef = useRef<HTMLDivElement>(null);
  const markerRefs = useRef<Map<number, HTMLButtonElement>>(new Map());

  // Get user's current location
  const handleLocateMe = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setIsLocating(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLocating(false);
        }
      );
    }
  };

  // Toggle filter
  const toggleFilter = (filterId: string) => {
    setActiveFilters(prev => 
      prev.includes(filterId)
        ? prev.filter(f => f !== filterId)
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
    return mapPlaces.filter(place => {
      const matchesFilter = activeFilters.includes(place.category);
      const withinRadius = place.distance <= radius[0];
      const matchesSearch = searchQuery === '' || 
        place.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && withinRadius && matchesSearch;
    });
  }, [activeFilters, radius, searchQuery]);

  // Search results for dropdown
  const searchResults = useMemo(() => {
    if (searchQuery.length < 2) return [];
    return mapPlaces.filter(place =>
      place.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.description.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5);
  }, [searchQuery]);

  // Calculate circle radius in pixels based on slider value and zoom
  const circleRadius = useMemo(() => {
    // Base radius that scales with the slider (5km = ~120px at zoom 1)
    return (radius[0] / 5) * 120 * zoomLevel;
  }, [radius, zoomLevel]);

  // Apply dynamic styles via refs to avoid inline styles
  useEffect(() => {
    if (mapContainerRef.current) {
      mapContainerRef.current.style.transform = `scale(${zoomLevel})`;
    }
  }, [zoomLevel]);

  useEffect(() => {
    if (radiusCircleRef.current) {
      const size = `${circleRadius * 2}px`;
      radiusCircleRef.current.style.width = size;
      radiusCircleRef.current.style.height = size;
    }
  }, [circleRadius]);

  useEffect(() => {
    filteredPlaces.forEach((place) => {
      const marker = markerRefs.current.get(place.id);
      if (marker) {
        marker.style.top = `${place.position.top}%`;
        marker.style.left = `${place.position.left}%`;
      }
    });
  }, [filteredPlaces]);

  // Zoom controls
  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev * 1.2, 3));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev / 1.2, 0.5));

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#e8e4d8]">
      {/* Map Container - Full screen, no scroll */}
      <div 
        ref={mapContainerRef}
        className="absolute inset-0 overflow-hidden origin-center transition-transform duration-300 ease-out"
      >
        {/* Stylized map background */}
        <svg viewBox="0 0 400 600" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
          {/* Water */}
          <rect fill="#a8d5e5" width="400" height="600" />
          
          {/* Land mass (Cebu-like shape) */}
          <path 
            fill="#e8e4d8" 
            d="M150,50 Q200,30 250,50 Q280,100 290,200 Q300,300 280,400 Q260,500 200,580 Q140,550 120,450 Q100,350 110,250 Q120,150 150,50 Z"
          />
          
          {/* Roads */}
          <path stroke="#ffffff" strokeWidth="3" fill="none" d="M180,100 L200,200 Q210,300 200,400 L190,500" />
          <path stroke="#ffffff" strokeWidth="2" fill="none" d="M150,200 L250,220" />
          <path stroke="#ffffff" strokeWidth="2" fill="none" d="M140,350 L260,340" />
          <path stroke="#ffffff" strokeWidth="1.5" fill="none" d="M170,280 L230,290" />
          <path stroke="#ffffff" strokeWidth="1.5" fill="none" d="M180,320 L220,310" />
          
          {/* City labels */}
          <text x="200" y="300" fontSize="10" fill="#333" textAnchor="middle" fontWeight="bold">Cebu City</text>
          <text x="280" y="250" fontSize="8" fill="#333" textAnchor="middle">Mandaue</text>
          <text x="150" y="200" fontSize="7" fill="#666" textAnchor="middle">LAHUG</text>
          <text x="250" y="280" fontSize="7" fill="#666" textAnchor="middle">MABOLO</text>
          <text x="180" y="350" fontSize="7" fill="#666" textAnchor="middle">LABANGON</text>
          <text x="130" y="400" fontSize="7" fill="#666" textAnchor="middle">MAMBALING</text>
          <text x="100" y="450" fontSize="8" fill="#333" textAnchor="middle">NUSTAR</text>
          <text x="240" y="180" fontSize="7" fill="#666" textAnchor="middle">BUSAY</text>
          <text x="300" y="200" fontSize="7" fill="#666" textAnchor="middle">TALAMBAN</text>
        </svg>
      </div>

      {/* Circular Radius Overlay - centered on map */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div 
          ref={radiusCircleRef}
          className="rounded-full border-4 border-primary/50 bg-primary/10 transition-all duration-300"
        />
        {/* Center point */}
        <div className="absolute w-4 h-4 bg-primary rounded-full border-2 border-white shadow-lg z-10">
          <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-30" />
        </div>
      </div>

      {/* Clickable Map markers - only show if within radius */}
      {filteredPlaces.map((place) => (
        <button
          key={place.id}
          ref={(el) => {
            if (el) {
              markerRefs.current.set(place.id, el);
              el.style.top = `${place.position.top}%`;
              el.style.left = `${place.position.left}%`;
            }
          }}
          onClick={() => handleMarkerClick(place)}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full z-20"
          aria-label={`View ${place.title}`}
        >
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 border-white",
            place.iconBg
          )}>
            <place.icon className="h-5 w-5 text-white" />
          </div>
        </button>
      ))}

      {/* User location marker */}
      {userLocation && (
        <div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="relative">
            <div className="w-5 h-5 bg-blue-500 rounded-full border-2 border-white shadow-lg" />
            <div className="absolute inset-0 w-5 h-5 bg-blue-500 rounded-full animate-ping opacity-50" />
          </div>
        </div>
      )}

      {/* Search Bar - Top */}
      <div className="absolute top-4 left-4 right-4 z-30">
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
                onClick={() => setSearchQuery('')}
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
                    setSearchQuery('');
                  }}
                  className="w-full flex items-center gap-3 p-3 hover:bg-muted transition-colors text-left"
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                    place.iconBg
                  )}>
                    <place.icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{place.title}</p>
                    <p className="text-xs text-muted-foreground">{place.distanceText}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Filter Chips - Below Search */}
      <div className="absolute top-20 left-4 right-4 z-30 flex gap-2 justify-center flex-wrap">
        {filterCategories.map((filter) => (
          <Button
            key={filter.id}
            variant={activeFilters.includes(filter.id) ? "default" : "secondary"}
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
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-30">
        <Button
          variant="secondary"
          size="icon"
          onClick={handleZoomIn}
          className="rounded-xl bg-card/95 backdrop-blur-md shadow-lg h-10 w-10"
        >
          <Plus className="h-5 w-5" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={handleZoomOut}
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
          <LocateFixed className={cn("h-5 w-5", isLocating && "animate-pulse")} />
        </Button>
      </div>

      {/* Radius Adjuster - Bottom */}
      <div className="absolute bottom-24 md:bottom-8 left-4 right-4 z-30">
        <div className="bg-card/95 backdrop-blur-md border border-border rounded-2xl shadow-lg p-4 max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <CircleDot className="h-5 w-5 text-primary flex-shrink-0" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Search Radius</span>
                <span className="text-sm font-semibold text-primary">{radius[0]} km</span>
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
        <SheetContent side="bottom" className="rounded-t-3xl h-auto max-h-[70vh] pb-8">
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
                  <h2 className="text-xl font-bold text-white font-headline">{selectedPlace.title}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-white text-sm">{selectedPlace.rating}</span>
                    </div>
                    <span className="text-white/70 text-sm">•</span>
                    <span className="text-white/70 text-sm">{selectedPlace.distanceText}</span>
                  </div>
                </div>
              </div>

              {/* Place Description */}
              <p className="text-muted-foreground mb-6">{selectedPlace.description}</p>

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
