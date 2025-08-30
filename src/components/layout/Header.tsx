
'use client';

import { useState, useEffect } from 'react';
import { Logo } from '@/components/Logo';
import { cn } from '@/lib/utils';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    // Set initial state after mount
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
        "fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-sm border-b md:hidden transition-all duration-300",
        isScrolled ? 'h-14' : 'h-20'
      )}>
      <div className="flex h-full items-center justify-center px-4">
        <div className={cn(
            "transition-all duration-300",
            isScrolled ? 'scale-100' : 'scale-100'
        )}>
          <Logo showText={!isScrolled} />
        </div>
      </div>
    </header>
  );
}
