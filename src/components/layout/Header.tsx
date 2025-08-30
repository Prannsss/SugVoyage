
'use client';

import { useState, useEffect } from 'react';
import { Logo } from '@/components/Logo';
import { cn } from '@/lib/utils';
import { useThrottle } from '@/hooks/use-throttle';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const handleScroll = useThrottle(() => {
    setIsScrolled(window.scrollY > 20);
  }, 16); // ~60fps

  useEffect(() => {
    setIsMounted(true);
    
    // Set initial state after mount
    if (typeof window !== 'undefined') {
      setIsScrolled(window.scrollY > 20);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  if (!isMounted) {
    return (
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-sm border-b md:hidden h-20">
        <div className="flex h-full items-center justify-center px-4" suppressHydrationWarning>
          <Logo showText={true} />
        </div>
      </header>
    );
  }

  return (
    <header className={cn(
        "fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-sm border-b md:hidden transition-all duration-300",
        isScrolled ? 'h-14' : 'h-20'
      )}>
      <div className="flex h-full items-center justify-center px-4" suppressHydrationWarning>
        <div className={cn(
            "transition-all duration-300",
            isScrolled ? 'scale-100' : 'scale-100'
        )} suppressHydrationWarning>
          <Logo showText={!isScrolled} />
        </div>
      </div>
    </header>
  );
}
