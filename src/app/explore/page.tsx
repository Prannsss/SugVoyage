"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Search,
  MapPin,
  Users,
  Star,
  ChevronRight,
  CalendarDays,
  Cloud,
  Car,
  Clock,
  Filter,
  Navigation,
  Thermometer,
  Wind,
  Droplets,
  Sun,
  Moon,
  RefreshCw,
  TrendingUp,
  Zap,
  Heart,
  Share2,
  Bookmark,
  MoreVertical,
  Sparkles,
  Globe,
  Coffee,
  ShoppingBag,
  Utensils,
  Mountain,
  Palette,
} from "lucide-react";
import { categories } from "@/lib/places";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

type CategoryName = keyof typeof categories;

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

// Enhanced featured destinations with more data
const featuredDestinations = [
  {
    id: 1,
    title: "Island Hopping in Mactan",
    description: "Discover pristine beaches & vibrant marine life",
    image: "https://picsum.photos/600/400?random=100",
    hint: "beach island tropical",
    category: "Adventure",
    rating: 4.8,
    duration: "Full day",
    price: "$$",
    tags: ["Beach", "Boat Tour", "Snorkeling"],
  },
  {
    id: 2,
    title: "Kawasan Falls Adventure",
    description: "Experience the turquoise cascades of Cebu",
    image: "https://picsum.photos/600/400?random=101",
    hint: "waterfall nature jungle",
    category: "Nature",
    rating: 4.9,
    duration: "Half day",
    price: "$",
    tags: ["Waterfall", "Canyoneering", "Swimming"],
  },
  {
    id: 3,
    title: "Historic Downtown Cebu",
    description: "Walk through centuries of Philippine history",
    image: "https://picsum.photos/600/400?random=102",
    hint: "historic downtown city",
    category: "Culture",
    rating: 4.5,
    duration: "3-4 hours",
    price: "$$",
    tags: ["History", "Heritage", "Walking Tour"],
  },
  {
    id: 4,
    title: "Osmeña Peak Sunrise",
    description: "Panoramic views from Cebu's highest point",
    image: "https://picsum.photos/600/400?random=103",
    hint: "mountain sunrise landscape",
    category: "Adventure",
    rating: 4.7,
    duration: "Half day",
    price: "$",
    tags: ["Hiking", "Sunrise", "Photography"],
  },
];

// Enhanced weather data
const currentWeather = {
  temperature: 29,
  feelsLike: 32,
  condition: "Partly Cloudy",
  icon: "⛅",
  humidity: 65,
  windSpeed: 12,
  uvIndex: 7,
  sunrise: "5:45 AM",
  sunset: "5:45 PM",
  hourly: [
    { time: "Now", temp: 29, icon: "⛅" },
    { time: "1PM", temp: 30, icon: "☀️" },
    { time: "2PM", temp: 31, icon: "☀️" },
    { time: "3PM", temp: 30, icon: "⛅" },
    { time: "4PM", temp: 29, icon: "⛅" },
    { time: "5PM", temp: 28, icon: "🌤️" },
  ],
};

// Enhanced traffic data
const currentTraffic = {
  status: "Moderate",
  travelTime: "25-35 min",
  delay: "+8 min",
  routes: [
    { name: "Via Jones Ave", time: "25 min", status: "light" },
    { name: "Via Escario", time: "35 min", status: "moderate" },
    { name: "Via Mango", time: "45 min", status: "heavy" },
  ],
  hotspots: ["IT Park", "Ayala Center", "Colon Street"],
};

// Enhanced nearby points of interest
const nearbyPlaces = [
  {
    id: 1,
    title: "House of Lechon",
    distance: "0.8 km away",
    rating: 4.5,
    reviews: 1287,
    image: "https://picsum.photos/100/100?random=200",
    hint: "restaurant food filipino",
    category: "Restaurant",
    price: "$$",
    tags: ["Local", "Popular", "Filipino"],
    open: true,
  },
  {
    id: 2,
    title: "Abaca Baking Company",
    distance: "1.2 km away",
    rating: 4.9,
    reviews: 892,
    image: "https://picsum.photos/100/100?random=201",
    hint: "cafe bakery breakfast",
    category: "Cafe",
    price: "$$$",
    tags: ["Artisan", "Breakfast", "Coffee"],
    open: true,
  },
  {
    id: 3,
    title: "SM City Cebu",
    distance: "2.1 km away",
    rating: 4.3,
    reviews: 2156,
    image: "https://picsum.photos/100/100?random=202",
    hint: "shopping mall retail",
    category: "Shopping",
    price: "$$",
    tags: ["Mall", "Shopping", "Entertainment"],
    open: true,
  },
  {
    id: 4,
    title: "Taoist Temple",
    distance: "3.5 km away",
    rating: 4.6,
    reviews: 543,
    image: "https://picsum.photos/100/100?random=203",
    hint: "temple religious architecture",
    category: "Culture",
    price: "$",
    tags: ["Historic", "Religious", "Architecture"],
    open: false,
  },
];

// Quick filter categories
const quickFilters = [
  { id: "all", label: "All", icon: Globe },
  { id: "food", label: "Food", icon: Utensils },
  { id: "adventure", label: "Adventure", icon: Mountain },
  { id: "culture", label: "Culture", icon: Palette },
  { id: "shopping", label: "Shopping", icon: ShoppingBag },
  { id: "cafe", label: "Cafe", icon: Coffee },
];

// Trending now items
const trendingNow = [
  {
    id: 1,
    title: "Cebu Safari Adventure",
    trend: "+245% interest",
    image: "https://picsum.photos/300/200?random=300",
    hint: "safari wildlife animals",
  },
  {
    id: 2,
    title: "Sirao Flower Garden",
    trend: "+180% interest",
    image: "https://picsum.photos/300/200?random=301",
    hint: "flower garden colorful",
  },
  {
    id: 3,
    title: "Cebu Ocean Park",
    trend: "+156% interest",
    image: "https://picsum.photos/300/200?random=302",
    hint: "aquarium marine life",
  },
];

export default function ExplorePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<string>("Downtown Cebu");

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredDestinations.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Get "Just For You" recommendations
  const justForYou = useMemo(() => {
    const allItems = Object.entries(categories).flatMap(([category, items]) =>
      items.slice(0, 3).map((item) => ({ ...item, category }))
    );
    return allItems.slice(0, 8);
  }, []);

  // Filter items based on search and active filter
  const filteredItems = useMemo(() => {
    if (!searchTerm) return null;

    const allItems = Object.entries(categories).flatMap(([category, items]) =>
      items.map((item) => ({ ...item, category }))
    );

    let filtered = allItems.filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (activeFilter !== "all") {
      filtered = filtered.filter((item) =>
        item.category.toLowerCase().includes(activeFilter.toLowerCase())
      );
    }

    return filtered;
  }, [searchTerm, activeFilter]);

  // Get filtered just for you items
  const filteredJustForYou = useMemo(() => {
    if (activeFilter === "all") return justForYou;
    return justForYou.filter((item) =>
      item.category.toLowerCase().includes(activeFilter.toLowerCase())
    );
  }, [justForYou, activeFilter]);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleShare = (title: string) => {
    navigator
      .share?.({
        title: `Check out ${title} on Cebu Explorer`,
        text: `I found this amazing place on Cebu Explorer: ${title}`,
        url: window.location.href,
      })
      .catch(() => {
        // Fallback copy to clipboard
        navigator.clipboard.writeText(`${title} - ${window.location.href}`);
      });
  };

  return (
    <div className="flex flex-col gap-4 md:gap-6 px-3 md:px-6 pt-20 md:pt-8 pb-24 md:pb-8 mx-auto">
      {/* Header with greeting and location */}
      <header className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="h-4 w-4 text-primary md:h-5 md:w-5" />
            <span className="text-sm md:text-base text-muted-foreground truncate">
              {userLocation}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 ml-1"
              onClick={handleRefresh}
            >
              <RefreshCw className={cn("h-3 w-3", loading && "animate-spin")} />
            </Button>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-headline">
            Hello, Explorer
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Discover amazing places in Cebu
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full hidden md:flex"
            onClick={handleRefresh}
          >
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </Button>
          <Avatar className="h-10 w-10 md:h-12 md:w-12 border-2 border-primary">
            <AvatarImage
              src="https://picsum.photos/100/100?random=avatar"
              alt="User"
            />
            <AvatarFallback className="bg-primary text-primary-foreground">
              JD
            </AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Search Bar with Filters */}
      <div className="space-y-3 md:space-y-4">
        <div className="relative">
          <div className="relative bg-card border border-border rounded-2xl md:rounded-3xl shadow-sm hover:shadow-md transition-shadow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search destinations, restaurants, activities..."
              className="pl-12 pr-24 md:pr-28 py-5 md:py-6 border-0 bg-transparent text-base placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 rounded-2xl md:rounded-3xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                title="Filter results"
              >
                <Filter className="h-4 w-4 hidden md:block" />
              </Button>
              <Select defaultValue="relevance">
                <SelectTrigger className="w-24 md:w-28 h-8 border-0 bg-transparent shadow-none focus:ring-0">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="rating">Top Rated</SelectItem>
                  <SelectItem value="distance">Nearest</SelectItem>
                  <SelectItem value="trending">Trending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Quick Filters */}
        <ScrollArea className="w-full">
          <div className="flex gap-2 pb-2">
            {quickFilters.map((filter) => (
              <Button
                key={filter.id}
                variant={activeFilter === filter.id ? "default" : "outline"}
                size="sm"
                className={cn(
                  "rounded-full px-4 flex items-center gap-2 whitespace-nowrap",
                  activeFilter === filter.id && "shadow-sm"
                )}
                onClick={() => setActiveFilter(filter.id)}
              >
                <filter.icon className="h-3 w-3 md:h-4 md:w-4" />
                <span className="text-xs md:text-sm">{filter.label}</span>
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Search Results */}
      {filteredItems && filteredItems.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg md:text-xl font-semibold font-headline">
              Search Results ({filteredItems.length})
            </h2>
            <Button variant="ghost" size="sm" className="text-primary">
              Clear filters
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredItems.map((item) => (
              <Link
                key={item.title}
                href={`/explore/${slugify(item.title)}`}
                className="group"
              >
                <Card className="overflow-hidden rounded-xl md:rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 h-full">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      data-ai-hint={item.hint}
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge
                        variant="secondary"
                        className="bg-accent/90 text-accent-foreground text-xs font-medium uppercase tracking-wider backdrop-blur-sm"
                      >
                        {item.category}
                      </Badge>
                    </div>
                    <div className="absolute top-3 right-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/30"
                        onClick={(e) => {
                          e.preventDefault();
                          handleShare(item.title);
                        }}
                      >
                        <Share2 className="h-4 w-4 text-white" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-3 md:p-4">
                    <h3 className="font-semibold font-headline text-sm md:text-base line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-xs md:text-sm text-muted-foreground mt-1 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 md:h-4 md:w-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs md:text-sm font-medium">
                          4.5
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        15 min away
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Main Content (when no search) */}
      {!filteredItems && (
        <>
          {/* Featured Destination Carousel */}
          <section className="relative">
            <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-lg">
              <div className="relative aspect-[4/3] md:aspect-[21/9]">
                <Image
                  src={featuredDestinations[currentSlide].image}
                  alt={featuredDestinations[currentSlide].title}
                  fill
                  className="object-cover"
                  data-ai-hint={featuredDestinations[currentSlide].hint}
                  priority
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-primary/90 backdrop-blur-sm">
                      {featuredDestinations[currentSlide].category}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="bg-white/20 backdrop-blur-sm"
                    >
                      {featuredDestinations[currentSlide].duration}
                    </Badge>
                  </div>
                  <h2 className="text-xl md:text-3xl font-bold font-headline mb-2">
                    {featuredDestinations[currentSlide].title}
                  </h2>
                  <p className="text-white/90 text-sm md:text-base mb-4">
                    {featuredDestinations[currentSlide].description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Button size="sm" className="rounded-full">
                        Explore Now
                      </Button>
                      <div className="hidden md:flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full bg-white/20 backdrop-blur-sm"
                        >
                          <Bookmark className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full bg-white/20 backdrop-blur-sm"
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 md:h-5 md:w-5 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm md:text-base font-semibold">
                        {featuredDestinations[currentSlide].rating}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Carousel dots */}
                <div className="absolute bottom-4 right-4 flex gap-2">
                  {featuredDestinations.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={cn(
                        "w-2 h-2 rounded-full transition-all duration-300",
                        currentSlide === index
                          ? "bg-white w-6"
                          : "bg-white/50 hover:bg-white/75"
                      )}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>

                {/* Navigation arrows (desktop) */}
                <div className="hidden md:block">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30"
                    onClick={() =>
                      setCurrentSlide((prev) =>
                        prev === 0 ? featuredDestinations.length - 1 : prev - 1
                      )
                    }
                  >
                    <ChevronRight className="h-5 w-5 rotate-180" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30"
                    onClick={() =>
                      setCurrentSlide(
                        (prev) => (prev + 1) % featuredDestinations.length
                      )
                    }
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Small thumbnails (desktop) */}
            <div className="hidden md:grid grid-cols-4 gap-4 mt-4">
              {featuredDestinations.map((dest, index) => (
                <button
                  key={dest.id}
                  onClick={() => setCurrentSlide(index)}
                  className={cn(
                    "relative aspect-[3/2] rounded-xl overflow-hidden transition-all duration-300",
                    currentSlide === index
                      ? "ring-2 ring-primary ring-offset-2"
                      : "opacity-70 hover:opacity-100"
                  )}
                >
                  <Image
                    src={dest.image}
                    alt={dest.title}
                    fill
                    className="object-cover"
                    sizes="25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-xs font-semibold text-white line-clamp-1">
                      {dest.title}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Quick Actions Grid */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg md:text-xl font-semibold">
                Quick Actions
              </h2>
            </div>

            {/* Minimalistic Grid */}
            <div className="grid grid-cols-4 md:grid-cols-8 gap-3 md:gap-4">
              {[
                {
                  icon: MapPin,
                  label: "Map",
                  href: "/geolocation",
                  description: "Find places near you",
                },
                {
                  icon: CalendarDays,
                  label: "Plan",
                  href: "/itinerary",
                  description: "Create your trip",
                },
                {
                  icon: Users,
                  label: "Community",
                  href: "/feed",
                  description: "See what's trending",
                },
                {
                  icon: Navigation,
                  label: "Navigate",
                  href: "/navigation",
                  description: "Get directions",
                },
                {
                  icon: Heart,
                  label: "Saved",
                  href: "/favorites",
                  description: "Your favorites",
                },
                {
                  icon: Sparkles,
                  label: "For You",
                  href: "/recommendations",
                  description: "Personalized picks",
                },
                {
                  icon: TrendingUp,
                  label: "Trending",
                  href: "/trending",
                  description: "Popular now",
                },
                {
                  icon: Zap,
                  label: "Events",
                  href: "/events",
                  description: "Upcoming events",
                },
              ].map((action, index) => (
                <Link
                  key={index}
                  href={action.href}
                  className="group flex flex-col items-center"
                >
                  {/* Simple Icon Circle */}
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center border bg-background group-hover:bg-accent transition-colors">
                    <action.icon className="h-6 w-6 text-foreground group-hover:text-primary" />
                  </div>

                  {/* Label */}
                  <span className="mt-2 text-xs md:text-sm font-medium text-center group-hover:text-primary transition-colors line-clamp-1">
                    {action.label}
                  </span>

                  {/* Description (Desktop only) */}
                  <span className="hidden md:block text-xs text-muted-foreground text-center mt-1 line-clamp-1">
                    {action.description}
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* Weather & Traffic Cards - Enhanced */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {/* Weather Card - Enhanced */}
            <Card className="rounded-2xl md:rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold font-headline">
                      Weather
                    </h3>
                    <p className="text-sm text-muted-foreground">Cebu City</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                    >
                      <Sun className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                    >
                      <Moon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {/* Current Weather */}
                  <div className="col-span-2 md:col-span-1 flex items-center gap-4 p-4 bg-primary/5 rounded-xl">
                    <div className="text-4xl md:text-5xl">
                      {currentWeather.icon}
                    </div>
                    <div>
                      <div className="text-3xl md:text-4xl font-bold">
                        {currentWeather.temperature}°C
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Feels like {currentWeather.feelsLike}°C
                      </div>
                      <div className="text-sm font-medium">
                        {currentWeather.condition}
                      </div>
                    </div>
                  </div>

                  {/* Weather Details */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {
                        icon: Thermometer,
                        label: "Feels Like",
                        value: `${currentWeather.feelsLike}°C`,
                      },
                      {
                        icon: Droplets,
                        label: "Humidity",
                        value: `${currentWeather.humidity}%`,
                      },
                      {
                        icon: Wind,
                        label: "Wind",
                        value: `${currentWeather.windSpeed} km/h`,
                      },
                      {
                        icon: Sun,
                        label: "UV Index",
                        value: currentWeather.uvIndex,
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
                      >
                        <item.icon className="h-4 w-4 text-primary" />
                        <div>
                          <div className="text-xs text-muted-foreground">
                            {item.label}
                          </div>
                          <div className="font-semibold">{item.value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hourly Forecast */}
                <div className="mt-6">
                  <h4 className="text-sm font-semibold mb-3">
                    Hourly Forecast
                  </h4>
                  <ScrollArea className="w-full">
                    <div className="flex gap-4 pb-2">
                      {currentWeather.hourly.map((hour, index) => (
                        <div
                          key={index}
                          className="flex flex-col items-center min-w-[60px]"
                        >
                          <div className="text-sm font-medium">{hour.time}</div>
                          <div className="text-2xl my-2">{hour.icon}</div>
                          <div className="text-lg font-semibold">
                            {hour.temp}°
                          </div>
                        </div>
                      ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </div>
              </CardContent>
            </Card>

            {/* Traffic Card - Enhanced */}
            <Card className="rounded-2xl md:rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold font-headline">
                      Traffic Status
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Live updates
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="rounded-full">
                    <Navigation className="h-4 w-4 mr-2" />
                    Navigate
                  </Button>
                </div>

                {/* Traffic Overview */}
                <div className="flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-950/20 rounded-xl mb-4">
                  <div>
                    <div className="text-2xl md:text-3xl font-bold text-foreground">
                      {currentTraffic.status}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {currentTraffic.travelTime}
                      </span>
                      <span className="text-xs text-amber-600 font-medium">
                        {currentTraffic.delay}
                      </span>
                    </div>
                  </div>
                  {/* Traffic Light Visual */}
                  <div className="flex flex-col gap-1">
                    <div
                      className={cn(
                        "w-12 h-4 rounded-full",
                        currentTraffic.status === "Light"
                          ? "bg-green-500"
                          : currentTraffic.status === "Moderate"
                          ? "bg-amber-500"
                          : "bg-red-500"
                      )}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Light</span>
                      <span>Moderate</span>
                      <span>Heavy</span>
                    </div>
                  </div>
                </div>

                {/* Route Options */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold">Best Routes</h4>
                  {currentTraffic.routes.map((route, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-2 h-2 rounded-full",
                            route.status === "light"
                              ? "bg-green-500"
                              : route.status === "moderate"
                              ? "bg-amber-500"
                              : "bg-red-500"
                          )}
                        />
                        <div>
                          <div className="font-medium">{route.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {route.time}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-full"
                      >
                        Go
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Traffic Hotspots */}
                <div className="mt-4">
                  <h4 className="text-sm font-semibold mb-2">
                    Current Hotspots
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {currentTraffic.hotspots.map((spot, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="px-3 py-1"
                      >
                        <Car className="h-3 w-3 mr-1" />
                        {spot}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Just For You Section with Filter */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-lg md:text-xl font-semibold font-headline">
                  Just For You
                </h2>
                <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href="/recommendations"
                  className="text-sm text-primary hover:underline hidden md:flex items-center gap-1"
                >
                  See all <ChevronRight className="h-4 w-4" />
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Refresh recommendations</DropdownMenuItem>
                    <DropdownMenuItem>Adjust preferences</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <ScrollArea className="w-full">
              <div className="flex gap-3 md:gap-4 pb-4">
                {filteredJustForYou.map((item) => (
                  <Link
                    key={item.title}
                    href={`/explore/${slugify(item.title)}`}
                    className="group flex-shrink-0 w-[140px] md:w-[180px] lg:w-[200px]"
                  >
                    <Card className="overflow-hidden rounded-xl md:rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 h-full">
                      <div className="relative aspect-square">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                          data-ai-hint={item.hint}
                          sizes="(max-width: 768px) 140px, (max-width: 1024px) 180px, 200px"
                        />
                        <div className="absolute top-2 left-2">
                          <Badge
                            variant="secondary"
                            className="bg-accent/90 text-accent-foreground text-[10px] md:text-xs font-medium uppercase tracking-wider backdrop-blur-sm"
                          >
                            {item.category}
                          </Badge>
                        </div>
                        <div className="absolute top-2 right-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/30"
                          >
                            <Heart className="h-3 w-3 text-white" />
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-3">
                        <h3 className="font-semibold text-sm md:text-base font-headline line-clamp-1 mb-1">
                          {item.title}
                        </h3>
                        <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
                          {item.description}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 md:h-4 md:w-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-xs md:text-sm font-medium">
                              4.5
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            $ - $$
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </section>

          {/* Trending Now Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h2 className="text-lg md:text-xl font-semibold font-headline">
                  Trending Now
                </h2>
              </div>
              <span className="text-xs md:text-sm text-muted-foreground">
                Updated today
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {trendingNow.map((item) => (
                <Link
                  key={item.id}
                  href={`/explore/${slugify(item.title)}`}
                  className="group"
                >
                  <Card className="overflow-hidden rounded-xl md:rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300">
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint={item.hint}
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <Badge className="mb-2 bg-primary/90 backdrop-blur-sm">
                          {item.trend}
                        </Badge>
                        <h3 className="text-lg font-bold text-white font-headline">
                          {item.title}
                        </h3>
                      </div>
                      <div className="absolute top-3 right-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/30"
                        >
                          <Share2 className="h-4 w-4 text-white" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </section>

          {/* Nearby Points of Interest */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg md:text-xl font-semibold font-headline">
                Nearby Points of Interest
              </h2>
              <Link
                href="/nearby"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                View map <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {nearbyPlaces.map((place) => (
                <Link
                  key={place.id}
                  href={`/explore/${slugify(place.title)}`}
                  className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl md:rounded-2xl bg-card hover:bg-muted/50 transition-colors group border"
                >
                  <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden flex-shrink-0">
                    <Image
                      src={place.image}
                      alt={place.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      data-ai-hint={place.hint}
                      sizes="(max-width: 768px) 64px, 80px"
                    />
                    <div className="absolute top-1 left-1">
                      <Badge className="text-[8px] md:text-xs px-1.5 py-0.5">
                        {place.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold font-headline text-base md:text-lg">
                          {place.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {place.distance} • {place.price}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <div
                          className={cn(
                            "w-2 h-2 rounded-full",
                            place.open ? "bg-green-500" : "bg-red-500"
                          )}
                        />
                        <span className="text-xs text-muted-foreground">
                          {place.open ? "Open" : "Closed"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 md:h-4 md:w-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-sm md:text-base font-medium">
                            {place.rating}
                          </span>
                          <span className="text-xs text-muted-foreground hidden md:inline">
                            ({place.reviews} reviews)
                          </span>
                        </div>
                        <div className="hidden md:flex gap-1">
                          {place.tags.map((tag, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Bottom CTA */}
          <div className=" mt-6 md:mt-8">
            <Card className="rounded-2xl md:rounded-3xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground overflow-hidden">
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold font-headline">
                      Need travel inspiration?
                    </h3>
                    <p className="mt-2 opacity-90">
                      Get personalized itinerary recommendations based on your
                      interests
                    </p>
                  </div>
                  <Button
                    size="lg"
                    variant="secondary"
                    className="rounded-full bg-white text-primary hover:bg-white/90"
                  >
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generate Itinerary
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
