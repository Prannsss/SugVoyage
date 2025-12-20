import Map, {
  Marker,
  Popup,
  GeolocateControl,
  Source,
  Layer,
} from "react-map-gl/maplibre";
import { Navigation as NavigationIcon, Star, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface MapComponentProps {
  viewport: any;
  onViewportChange: (viewport: any) => void;
  allPlaces: any[];
  selectedPlace: any;
  onMarkerClick: (place: any) => void;
  onPopupClose: () => void;
  userLocation: { lat: number; lng: number; heading?: number } | null;
  radius: number;
  MAPTILER_API_KEY: string;
}

export function MapComponent({
  viewport,
  onViewportChange,
  allPlaces,
  selectedPlace,
  onMarkerClick,
  onPopupClose,
  userLocation,
  radius,
  MAPTILER_API_KEY,
}: MapComponentProps) {
  return (
    <Map
      {...viewport}
      onMove={(evt) => onViewportChange(evt.viewState)}
      style={{ width: "100%", height: "100%" }}
      mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${MAPTILER_API_KEY}`}
    >
      <GeolocateControl
        position="top-right"
        positionOptions={{ enableHighAccuracy: true }}
        trackUserLocation={true}
        showUserLocation={true}
      />

      {allPlaces.map((place) => (
        <Marker
          key={place.id}
          latitude={place.position.lat}
          longitude={place.position.lng}
          anchor="bottom"
        >
          <button
            onClick={() => onMarkerClick(place)}
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110",
              place.isInRadius ? "bg-green-500" : "bg-red-500", // Changed to consistent red for location markers
              "shadow-lg border-2 border-white"
            )}
            aria-label={place.title}
          >
            <MapPin className="h-5 w-5 text-white" />
          </button>
        </Marker>
      ))}

      {/* Radius circle around user location */}
      {userLocation && (
        <Source
          id="radius-circle"
          type="geojson"
          data={{
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: [userLocation.lng, userLocation.lat],
                },
                properties: {},
              },
            ],
          }}
        >
          <Layer
            id="radius-circle-layer"
            type="circle"
            paint={{
              "circle-radius": radius * 100, // Approximate pixels per km
              "circle-color": "rgba(59, 130, 246, 0.2)", // Blue with opacity
              "circle-stroke-color": "rgba(59, 130, 246, 0.5)",
              "circle-stroke-width": 2,
            }}
          />
        </Source>
      )}

      {/* User's current location marker with arrow */}
      {userLocation && (
        <>
          <Marker
            latitude={userLocation.lat}
            longitude={userLocation.lng}
            anchor="center"
          >
            <div className="relative">
              {/* Arrow showing user's heading */}
              {userLocation.heading && (
                <div
                  className="absolute -top-6 -left-3 z-10"
                  style={{
                    transform: `rotate(${userLocation.heading}deg)`,
                    transformOrigin: "center",
                  }}
                >
                  <NavigationIcon className="h-6 w-6 text-blue-600 fill-blue-600" />
                </div>
              )}
              {/* User location dot */}
              <div className="w-6 h-6 bg-blue-500 rounded-full border-3 border-white shadow-lg relative">
                {/* Inner pulse effect */}
                <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-70" />
              </div>
            </div>
          </Marker>
        </>
      )}

      {selectedPlace && (
        <Popup
          latitude={selectedPlace.position.lat}
          longitude={selectedPlace.position.lng}
          closeButton={true}
          closeOnClick={false}
          onClose={onPopupClose}
          anchor="top"
          className="z-50"
        >
          <div className="p-2">
            <h3 className="font-bold text-sm">{selectedPlace.title}</h3>
            <p className="text-xs text-muted-foreground">
              {selectedPlace.distanceText}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
              <span className="text-xs">{selectedPlace.rating}</span>
            </div>
          </div>
        </Popup>
      )}
    </Map>
  );
}
