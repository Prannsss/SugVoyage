"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Camera,
  Home,
  MapPin,
  BookOpen,
  User,
  CalendarDays,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useMemo, useEffect, useState } from "react";

const navItems = [
  { href: "/explore", label: "Explore", icon: Home },
  { href: "/geolocation", label: "Map", icon: MapPin },
  { href: "/itinerary", label: "Itinerary", icon: CalendarDays },
  { href: "/scan", label: "Scan", icon: Camera },
  { href: "/feed", label: "Feed", icon: BookOpen },
  { href: "/profile/alex_doe", label: "Profile", icon: User },
] as const;

export default function BottomNav() {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  // Ensure component only renders active states on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Memoize active states to prevent recalculation on every render
  const navItemsWithActive = useMemo(
    () =>
      navItems.map((item) => ({
        ...item,
        isActive:
          isClient &&
          ((item.href === "/" && pathname === "/") ||
            (item.href !== "/" && pathname.startsWith(item.href))),
      })),
    [pathname, isClient]
  );

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
      suppressHydrationWarning
    >
      <div className="bg-background/90 backdrop-blur-md border-t border-border/20 shadow-lg px-2 py-2">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {navItemsWithActive.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              className={cn(
                "flex flex-col items-center justify-center transition-all duration-200 ease-out w-full",
                "hover:scale-105 active:scale-95"
              )}
            >
              <div
                className={cn(
                  "p-2 rounded-xl transition-all duration-200 ease-out flex flex-col items-center",
                  item.isActive
                    ? "bg-primary/20 shadow-sm"
                    : "bg-transparent hover:bg-primary/10"
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 transition-colors duration-200 mb-1",
                    item.isActive ? "text-primary" : "text-muted-foreground"
                  )}
                />
                <span
                  className={cn(
                    "text-[10px] font-medium transition-colors duration-200",
                    item.isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
