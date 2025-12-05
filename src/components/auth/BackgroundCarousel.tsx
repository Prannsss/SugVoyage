'use client';

import * as React from 'react';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';

// Using all assets from /public/assets
const slides = [
  '/assets/airial.png',
  '/assets/boat.png',
  '/assets/city.png',
  '/assets/heritage.png',
  '/assets/magellan.png',
  '/assets/sea.png',
  '/assets/whale.png',
];

export function BackgroundCarousel() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    const intervalId = setInterval(() => {
      const nextIndex = (currentIndex + 1) % slides.length;
      setCurrentIndex(nextIndex);
    }, 2000); // Change slide every 2 seconds

    return () => clearInterval(intervalId);
  }, [api, currentIndex]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden -z-10 bg-black">
      {/* Static background images with crossfade */}
      {slides.map((src, index) => (
        <div
          key={src} 
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={src}
            alt="Background"
            fill
            sizes="100vw"
            className="object-cover"
            priority={index === 0}
          />
        </div>
      ))}
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />
    </div>
  );
}