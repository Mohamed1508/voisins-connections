
import React, { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { DefaultIcon, eventIcon, spotIcon, groupIcon, rideIcon } from "./leaflet/LeafletConfig";
import NeighborCard from "./NeighborCard";
import { useLanguage } from "@/context/LanguageContext";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

// Default radius in km
const DEFAULT_RADIUS = 2;

// Convert km to meters
const kmToMeters = (km: number) => km * 1000;

interface MapViewProps {
  userLocation: { lat: number; lng: number };
  neighbors: Array<{
    id: number;
    name: string;
    lat: number;
    lng: number;
    distance: number;
    country: { code: string; name: string };
  }>;
  events: Array<{
    id: number;
    name: string;
    date: string;
    time: string;
    lat: number;
    lng: number;
    createdBy: string;
  }>;
  spots?: Array<{
    id: string;
    name: string;
    lat: number;
    lng: number;
    createdBy: string;
  }>;
  groups?: Array<{
    id: string;
    name: string;
    lat: number;
    lng: number;
    description?: string;
  }>;
  rides?: Array<{
    id: string;
    name: string;
    departure: string;
    arrival: string;
    date: string;
    availableSeats: number;
    lat: number;
    lng: number;
    createdBy: string;
  }>;
  searchRadius?: number;
  onEventClick?: (event: any) => void;
  onSpotClick?: (spot: any) => void;
  onGroupClick?: (group: any) => void;
  onRideClick?: (ride: any) => void;
  previewMode?: boolean;
  withSearchBar?: boolean;
}

// Search component for the map
const MapSearch = () => {
  const [search, setSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const map = useMap();
  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(search)}`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        map.flyTo([parseFloat(lat), parseFloat(lon)], 13);
      }
    } catch (error) {
      console.error("Error searching location:", error);
    } finally {
      setIsSearching(false);
    }
  };
  
  return (
    <div className="absolute top-2 left-2 right-2 z-[1000] bg-white rounded-md shadow-md">
      <form onSubmit={handleSearch} className="flex items-center p-2">
        <Input
          type="text"
          placeholder="Search location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
        <button 
          type="submit" 
          className="ml-2 bg-primary text-white p-2 rounded-md"
          disabled={isSearching}
        >
          <Search size={18} />
        </button>
      </form>
    </div>
  );
};

// Animated conversation demo component
const AnimatedDemo = () => {
  const [showMohamed, setShowMohamed] = useState(false);
  const [showFatma, setShowFatma] = useState(false);
  const [showMessage1, setShowMessage1] = useState(false);
  const [showMessage2, setShowMessage2] = useState(false);
  
  useEffect(() => {
    const timer1 = setTimeout(() => setShowMohamed(true), 1000);
    const timer2 = setTimeout(() => setShowFatma(true), 2000);
    const timer3 = setTimeout(() => setShowMessage1(true), 3000);
    const timer4 = setTimeout(() => setShowMessage2(true), 5000);
    
    // Reset animation after completion
    const resetTimer = setTimeout(() => {
      setShowMohamed(false);
      setShowFatma(false);
      setShowMessage1(false);
      setShowMessage2(false);
      // Restart animation
      setTimeout(() => {
        setShowMohamed(true);
        setTimeout(() => setShowFatma(true), 1000);
        setTimeout(() => setShowMessage1(true), 2000);
        setTimeout(() => setShowMessage2(true), 4000);
      }, 1000);
    }, 10000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(resetTimer);
    };
  }, []);
  
  return (
    <>
      {showMohamed && (
        <div className="absolute left-[30%] top-[40%] z-[1001] transition-opacity duration-500 ease-in-out opacity-100">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white border-2 border-white">
            <span>M</span>
          </div>
          {showMessage1 && (
            <div className="absolute left-12 top-0 bg-white p-2 rounded-lg shadow-md text-sm animate-fade-in max-w-[120px]">
              Bonjour mon voisin!
            </div>
          )}
        </div>
      )}
      
      {showFatma && (
        <div className="absolute right-[30%] top-[60%] z-[1001] transition-opacity duration-500 ease-in-out opacity-100">
          <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center text-white border-2 border-white">
            <span>F</span>
          </div>
          {showMessage2 && (
            <div className="absolute right-12 top-0 bg-white p-2 rounded-lg shadow-md text-sm animate-fade-in max-w-[120px]">
              Ça va?
            </div>
          )}
        </div>
      )}
    </>
  );
};

const MapView: React.FC<MapViewProps> = ({
  userLocation,
  neighbors,
  events,
  spots = [],
  groups = [],
  rides = [],
  searchRadius = DEFAULT_RADIUS,
  onEventClick,
  onSpotClick,
  onGroupClick,
  onRideClick,
  previewMode = false,
  withSearchBar = false
}) => {
  const [selectedNeighbor, setSelectedNeighbor] = useState<number | null>(null);
  const { translations } = useLanguage();
  const mapRef = useRef<L.Map | null>(null);

  const handleNeighborClick = (neighborId: number) => {
    setSelectedNeighbor(neighborId === selectedNeighbor ? null : neighborId);
  };

  // If in preview mode, render a simplified map with mock data
  if (previewMode) {
    const parisPosition: [number, number] = [48.8566, 2.3522];
    
    return (
      <div className="relative">
        <MapContainer
          center={parisPosition}
          zoom={13}
          style={{ height: "100%", width: "100%", borderRadius: "0.5rem" }}
          whenCreated={(map) => {
            mapRef.current = map;
          }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {/* Demo circle for neighbors range */}
          <Circle
            center={parisPosition}
            pathOptions={{
              fillColor: "#3b82f6",
              fillOpacity: 0.1,
              color: "#3b82f6",
              weight: 1,
            }}
            radius={500}
          />
          
          {/* Sample neighbor */}
          <Marker position={[48.8566, 2.3522]} icon={DefaultIcon}>
            <Popup>
              <div className="text-sm">
                <p className="font-bold">Alice</p>
                <p>2.1 km</p>
              </div>
            </Popup>
          </Marker>
          
          {/* Sample event */}
          <Marker position={[48.8606, 2.3376]} icon={eventIcon}>
            <Popup>
              <div className="text-sm">
                <p className="font-bold">Community Meetup</p>
                <p>Tomorrow • 18:00</p>
              </div>
            </Popup>
          </Marker>
          
          {/* Sample group */}
          <Marker position={[48.8526, 2.3395]} icon={groupIcon}>
            <Popup>
              <div className="text-sm">
                <p className="font-bold">Neighborhood Watch</p>
                <p className="text-xs">Local safety group</p>
              </div>
            </Popup>
          </Marker>
          
          {/* Sample ride */}
          <Marker position={[48.8486, 2.3465]} icon={rideIcon}>
            <Popup>
              <div className="text-sm">
                <p className="font-bold">Carpooling to City Center</p>
                <p className="text-xs">3 seats available</p>
              </div>
            </Popup>
          </Marker>
          
          {withSearchBar && <MapSearch />}
          <AnimatedDemo />
        </MapContainer>
      </div>
    );
  }

  return (
    <div className="relative">
      <MapContainer
        center={[userLocation.lat, userLocation.lng]}
        zoom={13}
        style={{ height: "500px", width: "100%", borderRadius: "0.5rem" }}
        whenCreated={(map) => {
          mapRef.current = map;
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* User marker */}
        <Marker position={[userLocation.lat, userLocation.lng]}>
          <Popup>{translations.yourLocation || "Your location"}</Popup>
        </Marker>

        {/* Search radius circle */}
        <Circle
          center={[userLocation.lat, userLocation.lng]}
          pathOptions={{
            fillColor: "#3b82f6",
            fillOpacity: 0.1,
            color: "#3b82f6",
            weight: 1,
          }}
          radius={kmToMeters(searchRadius)}
        />

        {/* Event markers */}
        {events.map((event) => (
          <Marker
            key={event.id}
            position={[event.lat, event.lng]}
            icon={eventIcon}
            eventHandlers={{
              click: () => onEventClick && onEventClick(event),
            }}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-bold">{event.name}</p>
                <p>
                  {event.date} • {event.time}
                </p>
                <p className="text-xs text-gray-600">{translations.createdBy || "Created by"}: {event.createdBy}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Neighbor markers */}
        {neighbors.map((neighbor) => (
          <Marker
            key={neighbor.id}
            position={[neighbor.lat, neighbor.lng]}
            icon={DefaultIcon}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-bold">{neighbor.name}</p>
                <p>{neighbor.distance} km</p>
                <p className="text-xs">{neighbor.country.name}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Community spot markers */}
        {spots.map((spot) => (
          <Marker
            key={spot.id}
            position={[spot.lat, spot.lng]}
            icon={spotIcon}
            eventHandlers={{
              click: () => onSpotClick && onSpotClick(spot),
            }}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-bold">{spot.name}</p>
                <p className="text-xs text-gray-600">{translations.createdBy || "Created by"}: {spot.createdBy}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Group markers */}
        {groups.map((group) => (
          <Marker
            key={group.id}
            position={[group.lat, group.lng]}
            icon={groupIcon}
            eventHandlers={{
              click: () => onGroupClick && onGroupClick(group),
            }}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-bold">{group.name}</p>
                {group.description && <p className="text-xs">{group.description}</p>}
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* Ride markers */}
        {rides.map((ride) => (
          <Marker
            key={ride.id}
            position={[ride.lat, ride.lng]}
            icon={rideIcon}
            eventHandlers={{
              click: () => onRideClick && onRideClick(ride),
            }}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-bold">{ride.name}</p>
                <p className="text-xs">{ride.departure} → {ride.arrival}</p>
                <p className="text-xs">{ride.date} • {ride.availableSeats} seats</p>
                <p className="text-xs text-gray-600">{translations.createdBy || "Created by"}: {ride.createdBy}</p>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {withSearchBar && <MapSearch />}
      </MapContainer>
    </div>
  );
};

export default MapView;
