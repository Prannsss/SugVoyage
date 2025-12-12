// contexts/UserPreferencesContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import { useRouter } from "next/navigation";

interface UserPreferencesContextType {
  preferencesCompleted: boolean;
  showPreferences: boolean;
  showSplashScreen: boolean;
  completePreferences: () => void;
  skipPreferences: () => void;
  setShowSplashScreen: (show: boolean) => void;
}

const UserPreferencesContext = createContext<
  UserPreferencesContextType | undefined
>(undefined);

export const UserPreferencesProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { user } = useAuth();
  const router = useRouter();
  const [preferencesCompleted, setPreferencesCompleted] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [showSplashScreen, setShowSplashScreen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Only initialize if user is authenticated
    if (user) {
      console.log("User is authenticated, checking preferences...");

      // Check localStorage for existing preferences
      const hasCompletedPreferences = localStorage.getItem(
        "userPreferencesCompleted"
      );
      const hasUserPreferences = localStorage.getItem("userPreferences");

      if (hasCompletedPreferences === "true") {
        console.log("Preferences already completed");
        setPreferencesCompleted(true);
        setShowPreferences(false);

        // Only show splash screen if we're going to a main app page (not preferences-results)
        const currentPath = window.location.pathname;
        if (currentPath !== "/preferences-results") {
          setShowSplashScreen(true);
        }
      } else {
        console.log("New user, showing preferences first");
        // New user - show preferences first
        setShowPreferences(true);
        setShowSplashScreen(false);
      }
    } else {
      console.log("User not authenticated, hiding preferences/splash");
      // User not authenticated - hide everything
      setShowPreferences(false);
      setShowSplashScreen(false);
      setPreferencesCompleted(false);
    }

    setIsInitialized(true);
  }, [user]);

  const completePreferences = () => {
    console.log("Completing preferences");
    localStorage.setItem("userPreferencesCompleted", "true");

    // Get actual preferences from the component (we'll need to pass these)
    const userPrefs =
      localStorage.getItem("userPreferences") ||
      JSON.stringify({
        interests: [],
        travelTypes: [],
        budget: "",
        suggestions: "",
      });

    localStorage.setItem("userPreferences", userPrefs);
    setPreferencesCompleted(true);
    setShowPreferences(false);
    // Show splash screen before redirecting
    setShowSplashScreen(true);

    // Small delay to show splash screen, then redirect
    setTimeout(() => {
      router.push("/preferences-results");
    }, 500);
  };

  const skipPreferences = () => {
    console.log("Skipping preferences");
    localStorage.setItem("userPreferencesCompleted", "true");
    localStorage.setItem(
      "userPreferences",
      JSON.stringify({
        interests: [],
        travelTypes: [],
        budget: "",
        suggestions: "",
      })
    );
    setPreferencesCompleted(true);
    setShowPreferences(false);
    // Show splash screen before redirecting
    setShowSplashScreen(true);

    // Small delay to show splash screen, then redirect
    setTimeout(() => {
      router.push("/preferences-results");
    }, 500);
  };

  // Don't render children until context is initialized
  if (!isInitialized) {
    return null;
  }

  return (
    <UserPreferencesContext.Provider
      value={{
        preferencesCompleted,
        showPreferences,
        showSplashScreen,
        completePreferences,
        skipPreferences,
        setShowSplashScreen,
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
};

export const useUserPreferences = () => {
  const context = useContext(UserPreferencesContext);
  if (context === undefined) {
    throw new Error(
      "useUserPreferences must be used within a UserPreferencesProvider"
    );
  }
  return context;
};
