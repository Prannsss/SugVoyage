"use client";

import { useState, useEffect } from "react";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";
import { useThrottle } from "@/hooks/use-throttle";
import { Menu, X, Settings, LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleScroll = useThrottle(() => {
    setIsScrolled(window.scrollY > 20);
  }, 16); // ~60fps

  useEffect(() => {
    setIsMounted(true);

    // Set initial state after mount
    if (typeof window !== "undefined") {
      setIsScrolled(window.scrollY > 20);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleLogout = () => {
    // Add your logout logic here
    console.log("Logging out...");
    // Example: clear auth tokens, redirect to login, etc.
    router.push("/login");
  };

  const handleSettings = () => {
    router.push("/settings");
  };

  const handleProfile = () => {
    router.push("/profile");
  };

  if (!isMounted) {
    return (
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-sm border-b md:hidden h-20">
        <div
          className="flex h-full items-center justify-between px-4"
          suppressHydrationWarning
        >
          <Logo showText={true} />
          <div className="w-10 h-10" /> {/* Spacer for burger menu */}
        </div>
      </header>
    );
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-sm border-b md:hidden transition-all duration-300",
        isScrolled ? "h-14" : "h-20"
      )}
    >
      <div
        className="flex h-full items-center justify-between px-4"
        suppressHydrationWarning
      >
        {/* Logo */}
        <div
          className={cn(
            "transition-all duration-300",
            isScrolled ? "scale-100" : "scale-100"
          )}
          suppressHydrationWarning
        >
          <Logo showText={!isScrolled} />
        </div>

        {/* Burger Menu */}
        <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full hover:bg-gray-100"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem
              onClick={handleProfile}
              className="cursor-pointer"
            >
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleSettings}
              className="cursor-pointer"
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer text-red-600"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
