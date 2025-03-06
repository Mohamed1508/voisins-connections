
import React, { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { DefaultIcon, eventIcon, spotIcon, groupIcon, rideIcon } from "./leaflet/LeafletConfig";
import NeighborCard from "./NeighborCard";
import { useLanguage } from "@/context/LanguageContext";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  askLocation?: boolean;
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

// Location request component
const LocationRequest = ({ onLocationGranted }: { onLocationGranted: (position: {lat: number, lng: number}) => void }) => {
  const { toast } = useToast();
  const { translations } = useLanguage();
  
  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          onLocationGranted({ lat: latitude, lng: longitude });
          toast({
            title: translations.locationGranted || "Position partagée",
            description: translations.locationGrantedDesc || "Votre carte est maintenant centrée sur votre position.",
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({
            title: translations.locationDenied || "Accès à la position refusé",
            description: translations.locationDeniedDesc || "Nous ne pouvons pas vous montrer les voisins proches sans votre position.",
            variant: "destructive",
          });
        }
      );
    } else {
      toast({
        title: translations.locationNotSupported || "Géolocalisation non supportée",
        description: translations.locationNotSupportedDesc || "Votre navigateur ne supporte pas la géolocalisation.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="absolute inset-0 bg-black/50 z-[2000] flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md text-center">
        <h3 className="text-xl font-bold mb-2">{translations.shareLocation || "Partagez votre position"}</h3>
        <p className="mb-4 text-muted-foreground">
          {translations.shareLocationDesc || "Pour voir les voisins proches de vous, nous avons besoin de votre position."}
        </p>
        <button 
          onClick={requestLocation}
          className="bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
        >
          {translations.allowLocation || "Autoriser la géolocalisation"}
        </button>
      </div>
    </div>
  );
};

// Helper component to update map center
const MapCenterUpdater = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
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
  withSearchBar = false,
  askLocation = false
}) => {
  const [selectedNeighbor, setSelectedNeighbor] = useState<number | null>(null);
  const { translations } = useLanguage();
  const { user } = useAuth();
  const [mapCenter, setMapCenter] = useState<[number, number]>([userLocation.lat, userLocation.lng]);
  const [showLocationRequest, setShowLocationRequest] = useState(askLocation && !!user);
  const [realNeighbors, setRealNeighbors] = useState<any[]>([]);
  const mapRef = useRef<L.Map | null>(null);
  const [userRealLocation, setUserRealLocation] = useState<{lat: number, lng: number} | null>(null);
  const { toast } = useToast();

  const handleNeighborClick = (neighborId: number) => {
    setSelectedNeighbor(neighborId === selectedNeighbor ? null : neighborId);
  };

  // Update user location in database
  const updateUserLocation = async (position: {lat: number, lng: number}) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('users')
        .update({
          lat: position.lat,
          lng: position.lng
        })
        .eq('id', user.id);
        
      if (error) throw error;
    } catch (error) {
      console.error("Error updating user location:", error);
    }
  };

  // Handle location granted
  const handleLocationGranted = (position: {lat: number, lng: number}) => {
    setUserRealLocation(position);
    setMapCenter([position.lat, position.lng]);
    setShowLocationRequest(false);
    updateUserLocation(position);
    fetchNearbyUsers(position);
  };

  // Fetch nearby users from the database
  const fetchNearbyUsers = async (center: {lat: number, lng: number}) => {
    if (!user) return;
    
    try {
      // Calculate the bounding box for the search radius
      const R = 6371; // Earth's radius in km
      const lat = center.lat;
      const lng = center.lng;
      const radius = searchRadius; // in km
      
      // Convert radius to degrees (approximate)
      const latDelta = (radius / R) * (180 / Math.PI);
      const lngDelta = (radius / R) * (180 / Math.PI) / Math.cos(lat * Math.PI / 180);
      
      const latMin = lat - latDelta;
      const latMax = lat + latDelta;
      const lngMin = lng - lngDelta;
      const lngMax = lng + lngDelta;
      
      // Query users within the bounding box
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .not('id', 'eq', user.id) // Exclude the current user
        .gte('lat', latMin)
        .lte('lat', latMax)
        .gte('lng', lngMin)
        .lte('lng', lngMax);
        
      if (error) throw error;
      
      if (data) {
        // Calculate actual distance for each user
        const usersWithDistance = data.map(user => {
          const distance = calculateDistance(center.lat, center.lng, user.lat, user.lng);
          return {
            ...user,
            distance: parseFloat(distance.toFixed(1))
          };
        });
        
        // Filter by actual distance and sort by distance
        const nearbyUsers = usersWithDistance
          .filter(user => user.distance <= radius)
          .sort((a, b) => a.distance - b.distance);
          
        setRealNeighbors(nearbyUsers);
      }
    } catch (error) {
      console.error("Error fetching nearby users:", error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les voisins proches.",
        variant: "destructive",
      });
    }
  };

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in km
  };

  // If user is logged in, check for stored location and fetch nearby users
  useEffect(() => {
    if (user && !previewMode) {
      const checkUserLocation = async () => {
        try {
          const { data, error } = await supabase
            .from('users')
            .select('lat, lng')
            .eq('id', user.id)
            .single();
            
          if (error) throw error;
          
          if (data && data.lat && data.lng) {
            setUserRealLocation({ lat: data.lat, lng: data.lng });
            setMapCenter([data.lat, data.lng]);
            fetchNearbyUsers({ lat: data.lat, lng: data.lng });
            setShowLocationRequest(false);
          } else {
            setShowLocationRequest(askLocation);
          }
        } catch (error) {
          console.error("Error checking user location:", error);
          setShowLocationRequest(askLocation);
        }
      };
      
      checkUserLocation();
    }
  }, [user, previewMode, askLocation]);

  // If in preview mode, render a simplified map with mock data
  if (previewMode) {
    const parisPosition: [number, number] = [48.8566, 2.3522];
    
    return (
      <div className="relative w-full h-full">
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
              <NeighborCard 
                neighbor={{
                  id: 1,
                  name: "Mohamed",
                  distance: 0.2,
                  origin_country: "Maroc",
                  languages: ["français", "arabe"],
                  interests: ["cuisine", "jardinage"],
                  bio: "Bonjour! Je suis nouveau dans le quartier."
                }}
                detailed={true}
              />
            </Popup>
          </Marker>
          
          {/* Sample neighbor 2 */}
          <Marker position={[48.8606, 2.3376]} icon={DefaultIcon}>
            <Popup>
              <NeighborCard 
                neighbor={{
                  id: 2,
                  name: "Fatma",
                  distance: 1.2,
                  origin_country: "Tunisie",
                  languages: ["français", "arabe", "anglais"],
                  interests: ["sport", "lecture"],
                  bio: "Heureuse de rencontrer mes voisins!"
                }}
                detailed={true}
              />
            </Popup>
          </Marker>
          
          {/* Sample ride */}
          <Marker position={[48.8486, 2.3465]} icon={rideIcon}>
            <Popup>
              <div className="text-sm">
                <p className="font-bold">Trajet centre-ville</p>
                <p className="text-xs">Saint-Denis → Paris Centre</p>
                <p className="text-xs">15/03/2024 • 3 places</p>
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
        center={mapCenter}
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

        {/* Center updater */}
        <MapCenterUpdater center={mapCenter} />

        {/* User marker */}
        {userRealLocation ? (
          <Marker position={[userRealLocation.lat, userRealLocation.lng]}>
            <Popup>{translations.yourLocation || "Votre position"}</Popup>
          </Marker>
        ) : (
          <Marker position={[userLocation.lat, userLocation.lng]}>
            <Popup>{translations.yourLocation || "Votre position"}</Popup>
          </Marker>
        )}

        {/* Search radius circle */}
        <Circle
          center={userRealLocation ? [userRealLocation.lat, userRealLocation.lng] : [userLocation.lat, userLocation.lng]}
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
                <p className="text-xs text-gray-600">{translations.createdBy || "Créé par"}: {event.createdBy}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* If we have real neighbors from database, show them instead of mock data */}
        {realNeighbors.length > 0 ? (
          realNeighbors.map((neighbor) => (
            <Marker
              key={neighbor.id}
              position={[neighbor.lat, neighbor.lng]}
              icon={DefaultIcon}
            >
              <Popup className="neighbor-popup">
                <NeighborCard neighbor={{
                  id: neighbor.id,
                  name: neighbor.username || "Voisin",
                  distance: neighbor.distance,
                  origin_country: neighbor.origin_country,
                  languages: neighbor.languages,
                  interests: neighbor.interests,
                  bio: neighbor.bio
                }} detailed={true} />
              </Popup>
            </Marker>
          ))
        ) : (
          // Show mock neighbors if no real ones
          neighbors.map((neighbor) => (
            <Marker
              key={neighbor.id}
              position={[neighbor.lat, neighbor.lng]}
              icon={DefaultIcon}
            >
              <Popup>
                <NeighborCard neighbor={neighbor} />
              </Popup>
            </Marker>
          ))
        )}

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
                <p className="text-xs text-gray-600">{translations.createdBy || "Créé par"}: {spot.createdBy}</p>
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
                <p className="text-xs">{ride.date} • {ride.availableSeats} places</p>
                <p className="text-xs text-gray-600">{translations.createdBy || "Créé par"}: {ride.createdBy}</p>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {withSearchBar && <MapSearch />}
      </MapContainer>
      
      {showLocationRequest && (
        <LocationRequest onLocationGranted={handleLocationGranted} />
      )}
    </div>
  );
};

export default MapView;
