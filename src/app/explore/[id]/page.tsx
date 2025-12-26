"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getSpotsById, getSpots } from "@/services/spotService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Map, Milestone } from "lucide-react";
import { M3Loader } from "@/components/ui/m3-loader";

// Simple slugify function
const slugify = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");
};

export default function PlaceDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  console.log("PlaceDetailsPage - ID from params:", id);

  const [spot, setSpot] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSpot = async () => {
      try {
        setIsLoading(true);

        // First try to fetch by ID
        try {
          console.log("Trying to fetch by ID:", id);
          const response = await getSpotsById(id);
          if (response.success) {
            console.log("Successfully fetched by ID");
            setSpot(response.data);
            return;
          }
        } catch (idError) {
          console.log("ID fetch failed, trying as slug");
        }

        // If ID fetch fails, try fetching all spots and find by slugified name
        console.log("Fetching all spots to find by name");
        const allSpotsResponse = await getSpots();
        if (allSpotsResponse.success) {
          const foundSpot = allSpotsResponse.data.find(
            (s: any) => slugify(s.name) === id
          );
          if (foundSpot) {
            console.log("Found spot by slugified name");
            setSpot(foundSpot);
          } else {
            setError("Spot not found");
          }
        } else {
          setError("Failed to fetch spots");
        }
      } catch (err) {
        console.error("Error fetching spot:", err);
        setError("Failed to fetch spot");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchSpot();
    }
  }, [id]);

  if (error || (!isLoading && !spot)) {
    return (
      <div className="text-center py-20 px-8 md:px-12 pt-20 md:pt-8 pb-24 md:pb-8">
        <h1 className="text-2xl font-bold">Place not found</h1>
        <p className="text-muted-foreground">
          Sorry, we couldn't find the place you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pt-20 md:pt-8 pb-24 md:pb-8">
      {isLoading && (
        <div className="flex flex-col items-center justify-center gap-4 text-center rounded-lg p-8">
          <M3Loader size="lg" />
          <h3 className="text-xl font-semibold">Loading Details...</h3>
          <p className="text-muted-foreground">Fetching spot details...</p>
        </div>
      )}

      {!isLoading && spot && (
        <>
          <header className="relative h-96 w-full px-8 md:px-12">
            <Image
              src={spot.image_url || "https://picsum.photos/800/600?random=300"}
              alt={spot.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
            <div className="absolute bottom-8 left-0 right-0 px-8 md:px-12">
              <h1 className="text-4xl font-bold tracking-tighter font-headline sm:text-5xl md:text-6xl text-foreground">
                {spot.name}
              </h1>
              <Badge variant="secondary" className="mt-2 text-base">
                {spot.location || "Cebu"}
              </Badge>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 px-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none">
                  <p>{spot.description || "No description available."}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Milestone className="h-6 w-6 text-primary" />
                    How to Get There
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none space-y-4">
                  <p>
                    Located at coordinates: {spot.latitude}, {spot.longitude}
                  </p>
                  <Button asChild>
                    <Link
                      href={`https://www.google.com/maps?q=${spot.latitude},${spot.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Map className="mr-2 h-4 w-4" />
                      Open in Google Maps
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6 mt-6 md:mt-0 pl-0 md:pl-6">
              <Card>
                <CardHeader>
                  <CardTitle>Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Category</span>
                    <Badge variant="outline">{spot.category}</Badge>
                  </div>
                  {spot.rating > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Rating</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-medium">
                          {spot.rating}
                        </span>
                        {spot.reviews > 0 && (
                          <span className="text-xs text-muted-foreground">
                            ({spot.reviews} reviews)
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  {spot.price && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Price Range</span>
                      <span className="text-sm">{spot.price}</span>
                    </div>
                  )}
                  {spot.activities && spot.activities.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-sm font-medium">Activities</span>
                      <div className="flex flex-wrap gap-1">
                        {spot.activities.map(
                          (activity: string, index: number) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs"
                            >
                              {activity}
                            </Badge>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
