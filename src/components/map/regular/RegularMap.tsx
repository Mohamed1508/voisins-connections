
import React, { useRef, useState, useCallback } from "react";
import { GoogleMap, Circle } from "@react-google-maps/api";
import { useLanguage } from "@/context/LanguageContext";
import MapCenterUpdater from "../controls/MapCenterUpdater";
import MapSearch from "../controls/MapSearch";
import { kmToMeters } from "../utils/mapUtils";
import NeighborMarker from "../markers/NeighborMarker";
import EventMarker from "../markers/EventMarker";
import SpotMarker from "../markers/SpotMarker";
import GroupMarker from "../markers/GroupMarker";
import RideMarker from "../markers/RideMarker";
import { mapStyles } from "../leaflet/LeafletConfig";
import { MapViewProps } from "../types/MapViewTypes";

interface RegularMapProps extends Omit<MapViewProps, 'previewMode' | 'askLocation'> {
  userRealLocation: { lat: number; lng: number } | null;
  realNeighbors?: any[];
}

const mapContainerStyle = {
  height: "500px",
  width: "100%",
  borderRadius: "0.5rem"
};

const RegularMap: React.FC<RegularMapProps> = ({
  userLocation,
  userRealLocation,
  neighbors = [],
  events = [],
  spots = [],
  groups = [],
  rides = [],
  searchRadius = 2,
  onEventClick,
  onSpotClick,
  onGroupClick,
  onRideClick,
  withSearchBar = false,
  realNeighbors = []
}) => {
  const { translations } = useLanguage();
  const mapRef = useRef<google.maps.Map | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  
  const location = userRealLocation || userLocation;
  const mapCenter = { lat: location.lat, lng: location.lng };
  
  const onMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
  };

  const onPlaceSelected = (location: {lat: number, lng: number}) => {
    mapRef.current?.panTo(location);
  };

  const handleNeighborClick = useCallback((id: string) => {
    setSelectedMarker(selectedMarker === `neighbor-${id}` ? null : `neighbor-${id}`);
  }, [selectedMarker]);

  const handleEventClick = useCallback((event: any) => {
    if (onEventClick) onEventClick(event);
    setSelectedMarker(selectedMarker === `event-${event.id}` ? null : `event-${event.id}`);
  }, [onEventClick, selectedMarker]);

  const handleSpotClick = useCallback((spot: any) => {
    if (onSpotClick) onSpotClick(spot);
    setSelectedMarker(selectedMarker === `spot-${spot.id}` ? null : `spot-${spot.id}`);
  }, [onSpotClick, selectedMarker]);

  const handleGroupClick = useCallback((group: any) => {
    if (onGroupClick) onGroupClick(group);
    setSelectedMarker(selectedMarker === `group-${group.id}` ? null : `group-${group.id}`);
  }, [onGroupClick, selectedMarker]);

  const handleRideClick = useCallback((ride: any) => {
    if (onRideClick) onRideClick(ride);
    setSelectedMarker(selectedMarker === `ride-${ride.id}` ? null : `ride-${ride.id}`);
  }, [onRideClick, selectedMarker]);

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={mapCenter}
      zoom={13}
      onLoad={onMapLoad}
      options={{
        styles: mapStyles,
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false
      }}
    >
      {/* User location marker */}
      <NeighborMarker
        neighbor={{
          id: "user",
          name: translations.yourLocation || "Votre position",
          lat: location.lat,
          lng: location.lng
        }}
        selected={selectedMarker === "user-location"}
        onClick={() => setSelectedMarker(selectedMarker === "user-location" ? null : "user-location")}
        onClose={() => setSelectedMarker(null)}
      />

      {/* Search radius circle */}
      <Circle
        center={mapCenter}
        options={{
          fillColor: "#3b82f6",
          fillOpacity: 0.1,
          strokeColor: "#3b82f6",
          strokeWeight: 1,
          radius: kmToMeters(searchRadius)
        }}
      />

      {/* Event markers */}
      {events.map((event) => (
        <EventMarker 
          key={event.id} 
          event={event} 
          onClick={handleEventClick}
          selected={selectedMarker === `event-${event.id}`}
          onClose={() => setSelectedMarker(null)}
        />
      ))}

      {/* Neighbor markers */}
      {realNeighbors.length > 0 ? (
        realNeighbors.map((neighbor) => (
          <NeighborMarker 
            key={neighbor.id} 
            neighbor={neighbor} 
            detailed={true}
            selected={selectedMarker === `neighbor-${neighbor.id}`}
            onClick={() => handleNeighborClick(neighbor.id)}
            onClose={() => setSelectedMarker(null)}
          />
        ))
      ) : (
        neighbors.map((neighbor) => (
          <NeighborMarker 
            key={neighbor.id} 
            neighbor={neighbor} 
            detailed={false}
            selected={selectedMarker === `neighbor-${neighbor.id}`}
            onClick={() => handleNeighborClick(String(neighbor.id))}
            onClose={() => setSelectedMarker(null)}
          />
        ))
      )}

      {/* Spot markers */}
      {spots.map((spot) => (
        <SpotMarker 
          key={spot.id} 
          spot={spot} 
          onClick={handleSpotClick}
          selected={selectedMarker === `spot-${spot.id}`}
          onClose={() => setSelectedMarker(null)}
        />
      ))}

      {/* Group markers */}
      {groups.map((group) => (
        <GroupMarker 
          key={group.id} 
          group={group} 
          onClick={handleGroupClick}
          selected={selectedMarker === `group-${group.id}`}
          onClose={() => setSelectedMarker(null)}
        />
      ))}
      
      {/* Ride markers */}
      {rides.map((ride: any) => (
        <RideMarker 
          key={ride.id} 
          ride={{
            id: ride.id,
            name: ride.name,
            departure: ride.departure || "",
            arrival: ride.arrival || "",
            date: ride.date || "",
            time: ride.time || "",
            available_seats: ride.available_seats || 0,
            lat: ride.lat,
            lng: ride.lng
          }} 
          onClick={handleRideClick}
          selected={selectedMarker === `ride-${ride.id}`}
          onClose={() => setSelectedMarker(null)}
        />
      ))}
      
      {withSearchBar && <MapSearch onPlaceSelected={onPlaceSelected} />}
      {mapRef.current && <MapCenterUpdater center={[mapCenter.lat, mapCenter.lng]} mapRef={mapRef} />}
    </GoogleMap>
  );
};

export default RegularMap;
