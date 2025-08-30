
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Camera, Home, Map, BookOpen, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Explore', icon: Home },
  { href: '/itinerary', label: 'Itinerary', icon: Map },
  { href: '/scan', label: 'Scan', icon: Camera },
  { href: '/feed', label: 'Feed', icon: BookOpen },
  { href: '/profile/alex_doe', label: 'Profile', icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 md:hidden">
      <div className="bg-background/90 backdrop-blur-md border border-border/20 rounded-full shadow-lg px-6 py-3">
        <div className="flex items-center justify-center space-x-8">
          {navItems.map((item) => {
            const isActive = (item.href === '/' && pathname === '/') || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label={item.label}
                className={cn(
                  'flex items-center justify-center transition-all duration-300 ease-out',
                  'hover:scale-110 active:scale-95'
                )}
              >
                <div className={cn(
                    "p-3 rounded-full transition-all duration-300 ease-out",
                    isActive 
                      ? 'bg-primary/25 shadow-md scale-110' 
                      : 'bg-transparent hover:bg-primary/10'
                )}>
                  <item.icon className={cn(
                    "h-5 w-5 transition-colors duration-200",
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  )} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
