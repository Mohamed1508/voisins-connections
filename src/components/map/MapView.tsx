
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import GoogleMapProvider from "./GoogleMapProvider";
import PreviewMap from "./preview/PreviewMap";
import RegularMap from "./regular/RegularMap";
import LocationRequest from "./controls/LocationRequest";
import { calculateDistance } from "./utils/mapUtils";
import { MapViewProps } from "./types/MapViewTypes";

// Default radius in km
const DEFAULT_RADIUS = 2;

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
  const [userRealLocation, setUserRealLocation] = useState<{lat: number, lng: number} | null>(null);
  const [showLocationRequest, setShowLocationRequest] = useState(askLocation && !!user);
  const [realNeighbors, setRealNeighbors] = useState<any[]>([]);
  const { toast } = useToast();

  const handleNeighborClick = (neighborId: number) => {
    setSelectedNeighbor(neighborId === selectedNeighbor ? null : neighborId);
  };

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

  const handleLocationGranted = (position: {lat: number, lng: number}) => {
    setUserRealLocation(position);
    setShowLocationRequest(false);
    updateUserLocation(position);
    fetchNearbyUsers(position);
  };

  const fetchNearbyUsers = async (center: {lat: number, lng: number}) => {
    if (!user) return;
    
    try {
      const R = 6371; // Earth's radius in km
      const lat = center.lat;
      const lng = center.lng;
      const radius = searchRadius; // in km
      
      const latDelta = (radius / R) * (180 / Math.PI);
      const lngDelta = (radius / R) * (180 / Math.PI) / Math.cos(lat * Math.PI / 180);
      
      const latMin = lat - latDelta;
      const latMax = lat + latDelta;
      const lngMin = lng - lngDelta;
      const lngMax = lng + lngDelta;
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .not('id', 'eq', user.id)
        .gte('lat', latMin)
        .lte('lat', latMax)
        .gte('lng', lngMin)
        .lte('lng', lngMax);
        
      if (error) throw error;
      
      if (data) {
        const usersWithDistance = data.map(user => {
          const distance = calculateDistance(center.lat, center.lng, user.lat, user.lng);
          return {
            ...user,
            distance: parseFloat(distance.toFixed(1))
          };
        });
        
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

  if (previewMode) {
    return (
      <div className="relative w-full h-full">
        <GoogleMapProvider fallback={
          <div className="w-full h-full bg-secondary/20 flex items-center justify-center rounded-xl">
            <div className="text-center p-4">
              <p className="font-medium mb-2">Chargement de la carte...</p>
              <p className="text-sm text-muted-foreground">Découvrez votre voisinage</p>
            </div>
          </div>
        }>
          <PreviewMap withSearchBar={withSearchBar} />
        </GoogleMapProvider>
      </div>
    );
  }

  return (
    <div className="relative">
      <GoogleMapProvider fallback={
        <div className="w-full h-[500px] bg-secondary/20 flex items-center justify-center rounded-xl">
          <div className="text-center p-4">
            <p className="font-medium mb-2">Chargement de la carte...</p>
            <p className="text-sm text-muted-foreground">Découvrez votre voisinage</p>
          </div>
        </div>
      }>
        <RegularMap 
          userLocation={userLocation}
          userRealLocation={userRealLocation}
          neighbors={neighbors}
          events={events}
          spots={spots}
          groups={groups}
          rides={rides}
          searchRadius={searchRadius}
          onEventClick={onEventClick}
          onSpotClick={onSpotClick}
          onGroupClick={onGroupClick}
          onRideClick={onRideClick}
          withSearchBar={withSearchBar}
          realNeighbors={realNeighbors}
        />
      </GoogleMapProvider>
      
      {showLocationRequest && (
        <LocationRequest onLocationGranted={handleLocationGranted} />
      )}
    </div>
  );
};

export default MapView;
