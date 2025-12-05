'use client';

import * as React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/Logo';
import { ArrowRight } from 'lucide-react';
import { M3LoadingOverlay } from '@/components/ui/m3-loader';

const slides = [
  {
    id: 1,
    image: '/assets/airial.png',
    title: 'Welcome to SugVoyage',
    description: 'Your AI-powered guide to discovering the wonders of Cebu',
  },
  {
    id: 2,
    image: '/assets/heritage.png',
    title: 'Explore Hidden Gems',
    description: 'Uncover breathtaking destinations and local treasures across the island',
  },
  {
    id: 3,
    image: '/assets/whale.png',
    title: 'Capture Memories',
    description: 'Document your journey and share experiences with fellow travelers',
  },
  {
    id: 4,
    image: '/assets/sea.png',
    title: 'Start Your Adventure',
    description: "Cebu's most exclusive destinations await you",
  },
];

export default function OnboardingPage() {
  const [current, setCurrent] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();

  const handleNext = () => {
    if (current === slides.length - 1) {
      router.push('/signup');
    } else {
      setCurrent(prev => prev + 1);
    }
  };

  const handleSkip = () => {
    router.push('/login');
  };

  const handleSignIn = () => {
    setIsLoading(true);
    // Simulate a brief loading state before navigating
    setTimeout(() => {
      router.push('/explore');
    }, 800);
  };

  // Material 3 Expressive Loading Overlay
  if (isLoading) {
    return <M3LoadingOverlay message="Loading..." />;
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* Background Images with crossfade */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 ease-in-out",
            current === index ? "opacity-100" : "opacity-0"
          )}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            sizes="100vw"
            className="object-cover"
            priority={index === 0}
          />
          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />
        </div>
      ))}

      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20">
        <Logo />
        {current < slides.length - 1 && (
          <Button 
            variant="ghost" 
            onClick={handleSkip}
            className="text-white/80 hover:text-white hover:bg-white/10 rounded-full px-6"
          >
            Skip
          </Button>
        )}
      </div>

      {/* Text Content - Centered on screen */}
      <div className="absolute inset-0 flex items-center justify-center p-6 z-10 pointer-events-none">
        <div className="text-center max-w-lg">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight font-headline leading-tight mb-4">
            {slides[current]?.title}
          </h1>
          <p className="text-lg md:text-xl text-white/90 leading-relaxed">
            {slides[current]?.description}
          </p>
        </div>
      </div>

      {/* Bottom Section - Dots and Buttons */}
      <div className="absolute bottom-0 left-0 right-0 p-6 pb-12 z-10">
        <div className="max-w-lg mx-auto w-full space-y-6">
          {/* Progress Dots */}
          <div className="flex justify-center gap-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={cn(
                  "h-2 rounded-full transition-all duration-500 ease-out",
                  current === index 
                    ? "w-10 bg-white shadow-lg shadow-white/30" 
                    : "w-2 bg-white/40 hover:bg-white/60"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Button 
              onClick={handleNext} 
              size="lg" 
              className={cn(
                "w-full h-14 text-lg font-semibold rounded-full",
                "bg-white text-black hover:bg-white/90 shadow-xl",
                "transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]",
                "flex items-center justify-center gap-2"
              )}
            >
              {current === slides.length - 1 ? (
                <>
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </>
              ) : (
                'Next'
              )}
            </Button>

            {current === slides.length - 1 && (
              <p className="text-center text-sm text-white/80">
                Already have an account?{' '}
                <button 
                  onClick={handleSignIn}
                  className="text-white hover:underline font-semibold"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
