"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
} from "lucide-react";
import { categories } from "@/lib/places";
import { cn } from "@/lib/utils";

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

// Featured destinations carousel data
const featuredDestinations = [
  {
    title: "Island Hopping in Mactan",
    description: "Discover pristine beaches & vibrant marine life.",
    image: "https://picsum.photos/600/400?random=100",
    hint: "beach island",
  },
  {
    title: "Kawasan Falls Adventure",
    description: "Experience the turquoise cascades of Cebu.",
    image: "https://picsum.photos/600/400?random=101",
    hint: "waterfall nature",
  },
  {
    title: "Historic Downtown Cebu",
    description: "Walk through centuries of Philippine history.",
    image: "https://picsum.photos/600/400?random=102",
    hint: "historic downtown",
  },
];

// Current weather data (static)
const currentWeather = {
  temperature: 29,
  condition: "Partly Cloudy",
  icon: "⛅",
};

// Current traffic data (static)
const currentTraffic = {
  status: "Moderate",
  travelTime: "25-35 min",
};

// Nearby points of interest
const nearbyPlaces = [
  {
    title: "House of Lechon",
    distance: "0.8 km away",
    rating: 4.5,
    image: "https://picsum.photos/100/100?random=200",
    hint: "restaurant food",
  },
  {
    title: "Abaca Baking Company",
    distance: "1.2 km away",
    rating: 4.9,
    image: "https://picsum.photos/100/100?random=201",
    hint: "cafe bakery",
  },
  {
    title: "SM City Cebu",
    distance: "2.1 km away",
    rating: 4.3,
    image: "https://picsum.photos/100/100?random=202",
    hint: "shopping mall",
  },
];

export default function ExplorePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);

  // Get "Just For You" recommendations
  const justForYou = useMemo(() => {
    const allItems = Object.entries(categories).flatMap(([category, items]) =>
      items.slice(0, 2).map((item) => ({ ...item, category }))
    );
    return allItems.slice(0, 6);
  }, []);

  // Filter items based on search
  const filteredItems = useMemo(() => {
    if (!searchTerm) return null;
    const allItems = Object.entries(categories).flatMap(([category, items]) =>
      items.map((item) => ({ ...item, category }))
    );
    return allItems.filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="flex flex-col gap-6 px-4 md:px-6 pt-20 md:pt-8 pb-24 md:pb-8 max-w-full overflow-hidden">
      {/* Header with greeting */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-headline sm:text-3xl">
            Hello, Explorer
          </h1>
        </div>
        <Avatar className="h-10 w-10 border-2 border-primary">
          <AvatarImage
            src="https://picsum.photos/100/100?random=avatar"
            alt="User"
          />
          <AvatarFallback className="bg-primary text-primary-foreground">
            JD
          </AvatarFallback>
        </Avatar>
      </header>

      {/* Search Bar */}
      <div className="relative">
        <div className="relative bg-card border border-border rounded-2xl shadow-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search destinations in Cebu"
            className="pl-12 pr-4 py-6 border-0 bg-transparent text-base placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 rounded-2xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Search Results */}
      {filteredItems && filteredItems.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold font-headline">
            Search Results
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
              <Link
                key={item.title}
                href={`/explore/${slugify(item.title)}`}
                className="group"
              >
                <Card className="overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      data-ai-hint={item.hint}
                    />
                    <div className="absolute top-3 left-3">
                      <Badge
                        variant="secondary"
                        className="bg-accent text-accent-foreground text-xs font-medium uppercase tracking-wider"
                      >
                        {item.category}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold font-headline">
                      {item.title}
                    </h3>
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
          <div className="relative">
            <Card className="overflow-hidden rounded-3xl shadow-lg">
              <div className="relative aspect-[4/3] md:aspect-[16/9]">
                <Image
                  src={featuredDestinations[currentSlide].image}
                  alt={featuredDestinations[currentSlide].title}
                  fill
                  className="object-cover"
                  data-ai-hint={featuredDestinations[currentSlide].hint}
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <h2 className="text-2xl font-bold font-headline mb-2">
                    {featuredDestinations[currentSlide].title}
                  </h2>
                  <p className="text-white/80 text-sm">
                    {featuredDestinations[currentSlide].description}
                  </p>
                </div>
                {/* Carousel dots */}
                <div className="absolute bottom-6 right-6 flex gap-2">
                  {featuredDestinations.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      title={`Go to slide ${index + 1}`}
                      aria-label={`Go to slide ${index + 1}`}
                      className={cn(
                        "w-2 h-2 rounded-full transition-all duration-300",
                        currentSlide === index ? "bg-white w-6" : "bg-white/50"
                      )}
                    />
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="flex justify-center gap-6 md:gap-8">
            <Link
              href="/geolocation"
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MapPin className="h-6 w-6 md:h-7 md:w-7 text-primary" />
              </div>
              <span className="text-xs md:text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                Map
              </span>
            </Link>
            <Link
              href="/itinerary"
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <CalendarDays className="h-6 w-6 md:h-7 md:w-7 text-primary" />
              </div>
              <span className="text-xs md:text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                Itinerary
              </span>
            </Link>
            <Link
              href="/feed"
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Users className="h-6 w-6 md:h-7 md:w-7 text-primary" />
              </div>
              <span className="text-xs md:text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                Community
              </span>
            </Link>
          </div>

          {/* Weather & Traffic - Simple Version */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            {/* Weather Card */}
            <Card className="rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="rounded-xl bg-blue-50 p-2 sm:p-3 flex-shrink-0">
                    <div className="relative">
                      <Cloud className="h-6 w-6 sm:h-7 sm:w-7 text-blue-600" />
                      <span className="absolute -top-1 -right-1 text-lg">
                        {currentWeather.icon}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                      Current Weather
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl sm:text-2xl font-bold text-gray-900">
                        {currentWeather.temperature}°C
                      </span>
                      <span className="text-sm text-blue-600 hidden sm:inline">
                        {currentWeather.condition}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-muted-foreground sm:hidden">
                        {currentWeather.condition}
                      </p>
                      <div className="text-xs text-blue-500 font-medium px-2 py-1 bg-blue-50 rounded-full hidden sm:inline-block">
                        Pleasant
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Traffic Card */}
            <Card className="rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="rounded-xl bg-amber-50 p-2 sm:p-3 flex-shrink-0">
                    <Car className="h-6 w-6 sm:h-7 sm:w-7 text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                      Traffic Status
                    </p>
                    <div className="flex items-center gap-2 sm:gap-3 mb-1">
                      <span className="text-xl sm:text-2xl font-bold text-gray-900">
                        {currentTraffic.status}
                      </span>
                      {/* Traffic Level Indicator */}
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={cn(
                              "w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full",
                              level <= 3
                                ? "bg-emerald-400"
                                : level === 4
                                ? "bg-amber-400"
                                : "bg-red-400"
                            )}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{currentTraffic.travelTime}</span>
                      </div>
                      <div className="text-xs text-amber-600 font-medium px-2 py-1 bg-amber-50 rounded-full hidden sm:inline-block">
                        Live
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Just For You Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold font-headline">
                Just For You
              </h2>
              <Link
                href="#"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                See all <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <ScrollArea className="w-full">
              <div className="flex gap-4 pb-4">
                {justForYou.map((item) => (
                  <Link
                    key={item.title}
                    href={`/explore/${slugify(item.title)}`}
                    className="group flex-shrink-0 w-[160px] md:w-[200px]"
                  >
                    <Card className="overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
                      <div className="relative aspect-square">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          data-ai-hint={item.hint}
                        />
                        <div className="absolute top-2 left-2">
                          <Badge
                            variant="secondary"
                            className="bg-accent/90 text-accent-foreground text-[10px] font-medium uppercase tracking-wider"
                          >
                            {item.category.replace(
                              "People's Choice",
                              "Popular"
                            )}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-3">
                        <h3 className="font-semibold text-sm font-headline line-clamp-1">
                          {item.title}
                        </h3>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </section>

          {/* Nearby Points of Interest */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold font-headline">
              Nearby Points of Interest
            </h2>
            <div className="space-y-3">
              {nearbyPlaces.map((place) => (
                <Link
                  key={place.title}
                  href={`/explore/${slugify(place.title)}`}
                  className="flex items-center gap-4 p-3 rounded-2xl bg-card hover:bg-muted/50 transition-colors group"
                >
                  <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden flex-shrink-0">
                    <Image
                      src={place.image}
                      alt={place.title}
                      fill
                      className="object-cover"
                      data-ai-hint={place.hint}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold font-headline text-sm md:text-base">
                      {place.title}
                    </h3>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      {place.distance}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-3 w-3 md:h-4 md:w-4 text-accent fill-accent" />
                      <span className="text-xs md:text-sm font-medium">
                        {place.rating}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </Link>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
