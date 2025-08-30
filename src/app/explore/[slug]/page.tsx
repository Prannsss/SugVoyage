
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { findPlaceBySlug } from '@/lib/places';
import { getPlaceDetails, type GetPlaceDetailsOutput } from '@/ai/flows/get-place-details';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, UserCircle, Loader2, Map, Milestone, ExternalLink } from 'lucide-react';

export default function PlaceDetailsPage() {
  const params = useParams();
  const slug = params.slug as string;
  const place = findPlaceBySlug(slug);

  const [details, setDetails] = useState<GetPlaceDetailsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (place) {
      setIsLoading(true);
      getPlaceDetails({ placeName: place.title })
        .then(setDetails)
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [place]);

  if (!place) {
    return (
      <div className="text-center py-20 px-4 md:px-6 pt-24 md:pt-12">
        <h1 className="text-2xl font-bold">Place not found</h1>
        <p className="text-muted-foreground">Sorry, we couldn't find the place you're looking for.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 px-4 md:px-6 pt-20 md:pt-8">
      <header className="relative h-96 w-full -mt-8">
        <Image
          src={place.image}
          alt={place.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute bottom-8 left-0 right-0 px-4 md:px-6">
            <h1 className="text-4xl font-bold tracking-tighter font-headline sm:text-5xl md:text-6xl text-foreground">
                {place.title}
            </h1>
            <Badge variant="secondary" className="mt-2 text-base">Cebu</Badge>
        </div>
      </header>

      {isLoading && (
        <div className="flex flex-col items-center justify-center gap-4 text-center rounded-lg p-8">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <h3 className="text-xl font-semibold">Loading Details...</h3>
            <p className="text-muted-foreground">Fetching history and reviews for {place.title}.</p>
        </div>
      )}

      {details && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>History & Significance</CardTitle>
                    </CardHeader>
                    <CardContent className="prose dark:prose-invert max-w-none">
                        <p>{details.history}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Milestone className="h-6 w-6 text-primary"/>
                            How to Get There
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="prose dark:prose-invert max-w-none space-y-4">
                        <p>{details.directions}</p>
                        <Button asChild>
                            <Link href={details.mapLink} target="_blank" rel="noopener noreferrer">
                                <Map className="mr-2 h-4 w-4" />
                                Open in Google Maps
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Visitor Reviews</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {details.reviews.map((review, index) => (
                            <div key={index} className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <UserCircle className="h-6 w-6 text-muted-foreground"/>
                                    <span className="font-semibold">{review.author}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-5 w-5 ${i < review.rating ? 'text-accent fill-accent' : 'text-muted-foreground/50'}`}
                                        />
                                    ))}
                                </div>
                                <p className="text-sm text-foreground/80">{review.comment}</p>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
      )}
    </div>
  );
}
