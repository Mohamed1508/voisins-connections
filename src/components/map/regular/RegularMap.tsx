
import React, { useRef, useState, useCallback } from "react";
import LeafletMap from "../LeafletMap";
import { useLanguage } from "@/context/LanguageContext";
import MapSearch from "../controls/MapSearch";
import { kmToMeters } from "../utils/mapUtils";
import NeighborMarker from "../markers/NeighborMarker";
import EventMarker from "../markers/EventMarker";
import SpotMarker from "../markers/SpotMarker";
import GroupMarker from "../markers/GroupMarker";
import RideMarker from "../markers/RideMarker";
import PopupPortal from "../PopupPortal";
import { MapViewProps } from "../types/MapViewTypes";

interface RegularMapProps extends Omit<MapViewProps, 'previewMode' | 'askLocation'> {
  userRealLocation: { lat: number; lng: number } | null;
  realNeighbors?: any[];
}

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
  const mapRef = useRef<any>(null);
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  
  const location = userRealLocation || userLocation;
  const mapCenter: [number, number] = [location.lat, location.lng];
  
  const onMapLoad = (map: any) => {
    mapRef.current = map;
  };

  const onPlaceSelected = (location: {lat: number, lng: number}) => {
    mapRef.current?.setView([location.lat, location.lng], 13);
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

  // Prepare markers for LeafletMap
  const markers = [
    // User location marker
    {
      id: "user-location",
      type: 'user' as const,
      position: [location.lat, location.lng] as [number, number],
      onClick: () => setSelectedMarker(selectedMarker === "user-location" ? null : "user-location")
    },
    
    // Event markers
    ...events.map(event => ({
      id: `event-${event.id}`,
      type: 'event' as const,
      position: [event.lat, event.lng] as [number, number],
      onClick: () => handleEventClick(event)
    })),
    
    // Neighbor markers
    ...(realNeighbors.length > 0 ? realNeighbors : neighbors).map(neighbor => ({
      id: `neighbor-${neighbor.id}`,
      type: 'user' as const,
      position: [neighbor.lat, neighbor.lng] as [number, number],
      onClick: () => handleNeighborClick(String(neighbor.id))
    })),
    
    // Spot markers
    ...spots.map(spot => ({
      id: `spot-${spot.id}`,
      type: 'spot' as const,
      position: [spot.lat, spot.lng] as [number, number],
      onClick: () => handleSpotClick(spot)
    })),
    
    // Group markers
    ...groups.map(group => ({
      id: `group-${group.id}`,
      type: 'group' as const,
      position: [group.lat, group.lng] as [number, number],
      onClick: () => handleGroupClick(group)
    })),
    
    // Ride markers
    ...rides.map(ride => ({
      id: `ride-${ride.id}`,
      type: 'ride' as const,
      position: [ride.lat, ride.lng] as [number, number],
      onClick: () => handleRideClick(ride)
    }))
  ];

  return (
    <>
      <LeafletMap
        center={mapCenter}
        markers={markers}
        circle={{
          center: mapCenter,
          radius: kmToMeters(searchRadius)
        }}
        onMapReady={onMapLoad}
        style={{ height: '500px', width: '100%', borderRadius: '0.5rem' }}
      >
        {/* Popup contents via portal */}
        {selectedMarker === "user-location" && (
          <PopupPortal markerId="user-location">
            <div className="text-sm">
              <p className="font-bold">{translations.yourLocation || "Votre position"}</p>
            </div>
          </PopupPortal>
        )}
        
        {/* Event popups */}
        {events.map(event => (
          selectedMarker === `event-${event.id}` && (
            <PopupPortal key={`event-popup-${event.id}`} markerId={`event-${event.id}`}>
              <EventMarker 
                event={event}
                selected={true}
              />
            </PopupPortal>
          )
        ))}
        
        {/* Neighbor popups */}
        {(realNeighbors.length > 0 ? realNeighbors : neighbors).map(neighbor => (
          selectedMarker === `neighbor-${neighbor.id}` && (
            <PopupPortal key={`neighbor-popup-${neighbor.id}`} markerId={`neighbor-${neighbor.id}`}>
              <NeighborMarker 
                neighbor={neighbor}
                detailed={realNeighbors.length > 0}
                selected={true}
              />
            </PopupPortal>
          )
        ))}
        
        {/* Spot popups */}
        {spots.map(spot => (
          selectedMarker === `spot-${spot.id}` && (
            <PopupPortal key={`spot-popup-${spot.id}`} markerId={`spot-${spot.id}`}>
              <SpotMarker 
                spot={spot}
                selected={true}
              />
            </PopupPortal>
          )
        ))}
        
        {/* Group popups */}
        {groups.map(group => (
          selectedMarker === `group-${group.id}` && (
            <PopupPortal key={`group-popup-${group.id}`} markerId={`group-${group.id}`}>
              <GroupMarker 
                group={group}
                selected={true}
              />
            </PopupPortal>
          )
        ))}
        
        {/* Ride popups */}
        {rides.map(ride => (
          selectedMarker === `ride-${ride.id}` && (
            <PopupPortal key={`ride-popup-${ride.id}`} markerId={`ride-${ride.id}`}>
              <RideMarker 
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
                selected={true}
              />
            </PopupPortal>
          )
        ))}
      </LeafletMap>
      
      {withSearchBar && <MapSearch onPlaceSelected={onPlaceSelected} />}
    </>
  );
};

export default RegularMap;
