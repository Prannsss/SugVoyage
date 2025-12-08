"use client";

import { useNotification } from "@/contexts/NotificationContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin, Star, X } from "lucide-react";
import { useRouter } from "next/navigation";

export function GlobalPlacesNotification() {
  const { isNotificationVisible, placesInRadius, hidePlacesNotification } = useNotification();
  const router = useRouter();

  const handleViewOnMap = () => {
    hidePlacesNotification();
    router.push('/geolocation');
  };

  const handleClose = () => {
    hidePlacesNotification();
  };

  if (!isNotificationVisible || placesInRadius.length === 0) {
    return null;
  }

  return (
    <Dialog open={isNotificationVisible} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-green-500" />
            Places Found Near You!
          </DialogTitle>
          <DialogDescription>
            We found {placesInRadius.length} place{placesInRadius.length !== 1 ? 's' : ''} within your selected radius.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 max-h-60 overflow-y-auto">
          {placesInRadius.map((place) => (
            <div key={place.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                <place.icon className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm truncate">{place.title}</h4>
                <p className="text-xs text-muted-foreground truncate">{place.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs">{place.rating}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">{place.distanceText}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            className="flex-1"
          >
            Dismiss
          </Button>
          <Button onClick={handleViewOnMap} className="flex-1">
            View on Map
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
