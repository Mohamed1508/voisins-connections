
import React, { useRef } from "react";
import { MapContainer, TileLayer, Circle, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useLanguage } from "@/context/LanguageContext";
import MapCenterUpdater from "../controls/MapCenterUpdater";
import MapSearch from "../controls/MapSearch";
import { kmToMeters } from "../utils/mapUtils";
import NeighborMarker from "../markers/NeighborMarker";
import EventMarker from "../markers/EventMarker";
import SpotMarker from "../markers/SpotMarker";
import GroupMarker from "../markers/GroupMarker";
import RideMarker from "../markers/RideMarker";
import { MapViewProps } from "../types/MapViewTypes";

interface RegularMapProps extends Omit<MapViewProps, 'previewMode' | 'askLocation'> {
  userRealLocation: { lat: number; lng: number } | null;
}

const RegularMap: React.FC<RegularMapProps> = ({
  userLocation,
  userRealLocation,
  neighbors,
  events,
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
  const mapRef = useRef<L.Map | null>(null);
  const mapCenter: [number, number] = userRealLocation 
    ? [userRealLocation.lat, userRealLocation.lng] 
    : [userLocation.lat, userLocation.lng];

  return (
    <MapContainer
      center={mapCenter}
      zoom={13}
      style={{ height: "500px", width: "100%", borderRadius: "0.5rem" }}
      whenCreated={(map: L.Map) => {
        mapRef.current = map;
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapCenterUpdater center={mapCenter} />

      {userRealLocation ? (
        <Marker position={[userRealLocation.lat, userRealLocation.lng]}>
          <Popup>{translations.yourLocation || "Votre position"}</Popup>
        </Marker>
      ) : (
        <Marker position={[userLocation.lat, userLocation.lng]}>
          <Popup>{translations.yourLocation || "Votre position"}</Popup>
        </Marker>
      )}

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

      {events.map((event) => (
        <EventMarker key={event.id} event={event} onClick={onEventClick} />
      ))}

      {realNeighbors && realNeighbors.length > 0 ? (
        realNeighbors.map((neighbor) => (
          <NeighborMarker 
            key={neighbor.id} 
            neighbor={neighbor} 
            detailed={true} 
          />
        ))
      ) : (
        neighbors.map((neighbor) => (
          <NeighborMarker 
            key={neighbor.id} 
            neighbor={neighbor} 
            detailed={false} 
          />
        ))
      )}

      {spots.map((spot) => (
        <SpotMarker key={spot.id} spot={spot} onClick={onSpotClick} />
      ))}

      {groups.map((group) => (
        <GroupMarker key={group.id} group={group} onClick={onGroupClick} />
      ))}
      
      {rides.map((ride) => (
        <RideMarker key={ride.id} ride={ride} onClick={onRideClick} />
      ))}
      
      {withSearchBar && <MapSearch />}
    </MapContainer>
  );
};

export default RegularMap;
