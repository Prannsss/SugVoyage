import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  Navigation,
  CalendarDays,
  Tag,
  BadgeCheck,
  Clock,
  Heart,
  Share2,
  Bookmark,
  Flag,
  MapPin,
} from "lucide-react";

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

interface PlaceDetailsSheetProps {
  isSheetOpen: boolean;
  onSheetOpenChange: (open: boolean) => void;
  selectedPlace: any;
}

export function PlaceDetailsSheet({
  isSheetOpen,
  onSheetOpenChange,
  selectedPlace,
}: PlaceDetailsSheetProps) {
  return (
    <Sheet open={isSheetOpen} onOpenChange={onSheetOpenChange}>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl h-[85vh] pb-8 z-50 sm:max-w-md sm:mx-auto md:hidden"
      >
        {selectedPlace && (
          <>
            <SheetHeader className="sr-only">
              <SheetTitle>{selectedPlace.title}</SheetTitle>
            </SheetHeader>

            {/* Mobile drag handle */}
            <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-4" />

            <div className="flex flex-col h-full">
              {/* Place Image with gradient overlay */}
              <div className="relative h-48 w-full rounded-2xl overflow-hidden mb-4 flex-shrink-0">
                <Image
                  src={selectedPlace.image_url || selectedPlace.image}
                  alt={selectedPlace.title}
                  fill
                  className="object-cover"
                  data-ai-hint={selectedPlace.hint}
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Featured badge */}
                {selectedPlace.featured && (
                  <div className="absolute top-3 left-3">
                    <div className="bg-gradient-to-r from-accent to-accent/80 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">
                      Featured
                    </div>
                  </div>
                )}

                {/* Price indicator */}
                {selectedPlace.price && (
                  <div className="absolute top-12 left-3">
                    <div className="bg-black/60 backdrop-blur-sm text-white text-sm font-bold px-3 py-1 rounded-full">
                      {selectedPlace.price}
                    </div>
                  </div>
                )}

                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-white font-headline line-clamp-1">
                        {selectedPlace.title}
                      </h2>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="h-3 w-3 text-white/80 flex-shrink-0" />
                        <span className="text-white/80 text-sm truncate">
                          {selectedPlace.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-white text-sm font-semibold">
                        {selectedPlace.rating}
                      </span>
                      <span className="text-white/70 text-sm">
                        ({selectedPlace.reviews || 0} reviews)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-1">
                {/* Quick stats */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {selectedPlace.distance && (
                    <div className="bg-muted/50 rounded-xl p-3 text-center">
                      <Navigation className="h-4 w-4 text-primary mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground">Distance</p>
                      <p className="text-sm font-semibold">
                        {selectedPlace.distance}
                      </p>
                    </div>
                  )}

                  {selectedPlace.days && (
                    <div className="bg-muted/50 rounded-xl p-3 text-center">
                      <CalendarDays className="h-4 w-4 text-primary mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground">Duration</p>
                      <p className="text-sm font-semibold">
                        {selectedPlace.days}
                      </p>
                    </div>
                  )}

                  <div className="bg-muted/50 rounded-xl p-3 text-center">
                    <Tag className="h-4 w-4 text-primary mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">Category</p>
                    <p className="text-sm font-semibold capitalize">
                      {selectedPlace.category?.replace("_", " ") ||
                        selectedPlace.type}
                    </p>
                  </div>
                </div>

                {/* Activities section */}
                {selectedPlace.activities &&
                  selectedPlace.activities.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold mb-2">Activities</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedPlace.activities
                          .slice(0, 4)
                          .map((activity: string, index: number) => (
                            <div
                              key={index}
                              className="px-3 py-1.5 bg-primary/10 text-primary text-xs font-medium rounded-full"
                            >
                              {activity}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {selectedPlace.description || "No description available."}
                  </p>
                </div>

                {/* Additional info */}
                <div className="space-y-3 mb-6">
                  {selectedPlace.geofence && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-sm text-muted-foreground">
                        Within geofence area
                      </span>
                    </div>
                  )}

                  {selectedPlace.ml_validated && (
                    <div className="flex items-center gap-2">
                      <BadgeCheck className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-muted-foreground">
                        ML validated location
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {selectedPlace.source === "scraped"
                        ? `Scraped ${
                            selectedPlace.scraped_at
                              ? new Date(
                                  selectedPlace.scraped_at
                                ).toLocaleDateString()
                              : "Unknown date"
                          }`
                        : "Manual entry"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons - Sticky at bottom on mobile */}
              <div className="pt-4 border-t flex-shrink-0">
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
                  <Button variant="outline" size="icon">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </SheetContent>

      {/* Desktop Side Panel */}
      <SheetContent
        side="right"
        className="hidden md:flex w-[420px] max-w-full border-l rounded-l-3xl z-50"
      >
        {selectedPlace && (
          <div className="flex flex-col h-full w-full">
            <SheetHeader>
              <div className="flex items-center justify-between w-full pr-2">
                <SheetTitle className="text-lg font-headline">
                  {selectedPlace.title}
                </SheetTitle>
              </div>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto pr-4">
              {/* Place Image */}
              <div className="relative h-56 w-full rounded-xl overflow-hidden my-4">
                <Image
                  src={selectedPlace.image_url || selectedPlace.image}
                  alt={selectedPlace.title}
                  fill
                  className="object-cover"
                  data-ai-hint={selectedPlace.hint}
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Featured badge */}
                {selectedPlace.featured && (
                  <div className="absolute top-3 left-3">
                    <div className="bg-gradient-to-r from-accent to-accent/80 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">
                      Featured
                    </div>
                  </div>
                )}

                {/* Price indicator */}
                {selectedPlace.price && (
                  <div className="absolute top-3 right-3">
                    <div className="bg-black/60 backdrop-blur-sm text-white text-sm font-bold px-3 py-1 rounded-full">
                      {selectedPlace.price}
                    </div>
                  </div>
                )}

                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="h-3 w-3 text-white/90" />
                    <span className="text-white/90 text-sm">
                      {selectedPlace.location}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-white font-semibold">
                      {selectedPlace.rating}
                    </span>
                    <span className="text-white/70 text-sm">
                      ({selectedPlace.reviews || 0} reviews)
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-2 mb-6">
                {selectedPlace.distance && (
                  <div className="bg-muted/50 rounded-xl p-3 text-center">
                    <Navigation className="h-4 w-4 text-primary mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">Distance</p>
                    <p className="text-sm font-semibold">
                      {selectedPlace.distance}
                    </p>
                  </div>
                )}

                {selectedPlace.days && (
                  <div className="bg-muted/50 rounded-xl p-3 text-center">
                    <CalendarDays className="h-4 w-4 text-primary mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">Duration</p>
                    <p className="text-sm font-semibold">
                      {selectedPlace.days}
                    </p>
                  </div>
                )}

                <div className="bg-muted/50 rounded-xl p-3 text-center">
                  <Tag className="h-4 w-4 text-primary mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">Category</p>
                  <p className="text-sm font-semibold capitalize">
                    {selectedPlace.category?.replace("_", " ") ||
                      selectedPlace.type}
                  </p>
                </div>
              </div>

              {/* Activities */}
              {selectedPlace.activities &&
                selectedPlace.activities.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold mb-2">Activities</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedPlace.activities.map(
                        (activity: string, index: number) => (
                          <div
                            key={index}
                            className="px-3 py-1.5 bg-primary/10 text-primary text-xs font-medium rounded-full"
                          >
                            {activity}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {selectedPlace.description || "No description available."}
                </p>
              </div>

              {/* Additional info */}
              <div className="space-y-3 mb-8">
                {selectedPlace.geofence && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-sm text-muted-foreground">
                      Within geofence area
                    </span>
                  </div>
                )}

                {selectedPlace.ml_validated && (
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-muted-foreground">
                      ML validated location
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {selectedPlace.source === "scraped"
                      ? `Scraped ${
                          selectedPlace.scraped_at
                            ? new Date(
                                selectedPlace.scraped_at
                              ).toLocaleDateString()
                            : "Unknown date"
                        }`
                      : "Manual entry"}
                  </span>
                </div>
              </div>
            </div>

            {/* Desktop Action Buttons */}
            <div className="border-t pt-4 flex-shrink-0">
              <div className="grid grid-cols-2 gap-3 mb-3">
                <Button asChild className="w-full">
                  <Link href={`/explore/${slugify(selectedPlace.title)}`}>
                    View Full Details
                  </Link>
                </Button>
                <Button variant="outline" className="gap-2 w-full">
                  <Navigation className="h-4 w-4" />
                  Get Directions
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Bookmark className="h-4 w-4" />
                  Save
                </Button>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Heart className="h-4 w-4" />
                  Like
                </Button>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Flag className="h-4 w-4" />
                  Report
                </Button>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
