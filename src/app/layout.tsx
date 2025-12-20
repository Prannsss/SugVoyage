// app/layout.tsx (or your main layout)
"use client";

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
import { UserPreferencesProvider } from "@/contexts/UserPreferencesContext";
import UserPreference from "@/components/UserPreference";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";
import { useAuth } from "@/contexts/AuthContext";
import SplashScreen from "@/components/SplashScreen"; // Keep this import
import { useEffect, useState } from "react"; // Add this import

// This wrapper component handles the splash/preferences flow
function AppContent({ children }: { children: React.ReactNode }) {
  const { user } = useAuth(); // Check auth status
  const {
    showPreferences,
    completePreferences,
    skipPreferences,
    showSplashScreen,
    setShowSplashScreen,
  } = useUserPreferences();
  const [isSplashActive, setIsSplashActive] = useState(false);

  // Handle splash screen logic
  useEffect(() => {
    if (user && showSplashScreen) {
      setIsSplashActive(true);

      // Auto-hide splash screen after 2 seconds
      const timer = setTimeout(() => {
        setIsSplashActive(false);
        setShowSplashScreen(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [user, showSplashScreen, setShowSplashScreen]);

  // If user is not authenticated, just show the children (login/signup pages)
  if (!user) {
    console.log("User not authenticated, showing direct content");
    return children;
  }

  // User IS authenticated - show splash screen first if active
  if (isSplashActive) {
    console.log("Showing splash screen");
    return <SplashScreen onLoadingComplete={() => setIsSplashActive(false)} />;
  }

  // Show preferences FIRST (if not completed)
  if (showPreferences) {
    console.log("Showing preferences");
    return (
      <div className="fixed inset-0 z-[9999] bg-white md:bg-black md:bg-opacity-50 flex items-center justify-center">
        {/* Mobile: Full screen */}
        <div className="md:hidden w-full h-full overflow-auto bg-white">
          <UserPreference
            onComplete={completePreferences}
            onSkip={skipPreferences}
            isFullScreen={true}
          />
        </div>

        {/* Desktop: Modal */}
        <div className="hidden md:block bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden relative">
          <UserPreference
            onComplete={completePreferences}
            onSkip={skipPreferences}
            isFullScreen={false}
          />
          <div className="absolute top-4 right-4">
            <button
              onClick={skipPreferences}
              className="text-gray-500 hover:text-gray-700 text-sm font-medium px-3 py-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Skip for now
            </button>
          </div>
          <div className="p-6 border-t border-gray-100">
            <button
              onClick={completePreferences}
              className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Save Preferences & Continue to App
            </button>
            <p className="text-center text-gray-500 text-sm mt-3">
              Setting preferences helps us personalize your Cebu travel
              experience
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show main app content after splash screen is done
  console.log("Showing main app content");
  return (
    <SidebarProvider>
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
    </SidebarProvider>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
        <AuthProvider>
          <UserPreferencesProvider>
            <AppContent>{children}</AppContent>
          </UserPreferencesProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
