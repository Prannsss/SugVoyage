
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
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur-sm md:hidden rounded-t-2xl">
      <div className="grid h-16 grid-cols-5">
        {navItems.map((item) => {
          const isActive = (item.href === '/' && pathname === '/') || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              className={cn(
                'flex flex-col items-center justify-center text-sm font-medium transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary'
              )}
            >
              <div className={cn(
                  "p-2 rounded-full transition-colors duration-200",
                  isActive ? 'bg-primary/10' : 'bg-transparent'
              )}>
                <item.icon className="h-6 w-6" />
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
