"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface Place {
  id: string | number;
  title: string;
  description: string;
  rating: number;
  distanceText: string;
  icon: any;
  category: string;
}

interface NotificationContextType {
  showPlacesNotification: (places: Place[]) => void;
  hidePlacesNotification: () => void;
  isNotificationVisible: boolean;
  placesInRadius: Place[];
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const [placesInRadius, setPlacesInRadius] = useState<Place[]>([]);

  const showPlacesNotification = (places: Place[]) => {
    setPlacesInRadius(places);
    setIsNotificationVisible(true);
  };

  const hidePlacesNotification = () => {
    setIsNotificationVisible(false);
    setPlacesInRadius([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        showPlacesNotification,
        hidePlacesNotification,
        isNotificationVisible,
        placesInRadius,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
}
