"use client"; // Add this at the top since we're using state

import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import ConditionalHeader from "@/components/layout/ConditionalHeader";
import ConditionalBottomNav from "@/components/layout/ConditionalBottomNav";
import ConditionalMain from "@/components/layout/ConditionalMain";
import ConditionalDesktopNav from "@/components/layout/ConditionalDesktopNav";
import { SidebarProvider } from "@/components/ui/sidebar";
import { PinGuardProvider } from "@/components/auth/PinGuardProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { GlobalPlacesNotification } from "@/components/GlobalPlacesNotification";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { useState, useEffect } from "react";
import SplashScreen from "@/components/SplashScreen";

// Note: Since we're using "use client", we can't export metadata from this file.
// You'll need to move metadata to a separate layout or use next/headers

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="apple-touch-icon"
          href="/apple-touch-icon.png"
          sizes="180x180"
        />
        <link rel="dns-prefetch" href="https://placehold.co" />
        <link rel="dns-prefetch" href="https://picsum.photos" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        <SplashScreen onLoadingComplete={handleLoadingComplete} />

        {/* Only render main app after splash screen */}
        {!isLoading && (
          <SidebarProvider>
            <AuthProvider>
              <NotificationProvider>
                <PinGuardProvider>
                  <div className="relative flex min-h-screen w-full flex-col">
                    <ConditionalDesktopNav />
                    <ConditionalMain>
                      <ConditionalHeader />
                      {children}
                    </ConditionalMain>
                    <ConditionalBottomNav />
                  </div>
                  <GlobalPlacesNotification />
                </PinGuardProvider>
              </NotificationProvider>
            </AuthProvider>
          </SidebarProvider>
        )}
        <Toaster />
      </body>
    </html>
  );
}
