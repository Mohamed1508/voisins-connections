
import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { DefaultIcon, eventIcon, spotIcon, groupIcon } from "./leaflet/LeafletConfig";
import NeighborCard from "./NeighborCard";
import { useLanguage } from "@/context/LanguageContext";

// Définir le rayon de recherche en km
const DEFAULT_RADIUS = 2;

// Convertir le rayon en mètres
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
  searchRadius?: number;
  onEventClick?: (event: any) => void;
  onSpotClick?: (spot: any) => void;
  onGroupClick?: (group: any) => void;
  previewMode?: boolean;
}

const MapView: React.FC<MapViewProps> = ({
  userLocation,
  neighbors,
  events,
  spots = [],
  groups = [],
  searchRadius = DEFAULT_RADIUS,
  onEventClick,
  onSpotClick,
  onGroupClick,
  previewMode = false
}) => {
  const [selectedNeighbor, setSelectedNeighbor] = useState<number | null>(null);
  const { translations } = useLanguage();

  const handleNeighborClick = (neighborId: number) => {
    setSelectedNeighbor(neighborId === selectedNeighbor ? null : neighborId);
  };

  // If in preview mode, render a simplified map with mock data
  if (previewMode) {
    return (
      <MapContainer
        center={[48.8566, 2.3522]} // Paris
        zoom={13}
        style={{ height: "100%", width: "100%", borderRadius: "0.5rem" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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
      </MapContainer>
    );
  }

  return (
    <MapContainer
      center={[userLocation.lat, userLocation.lng]}
      zoom={13}
      style={{ height: "500px", width: "100%", borderRadius: "0.5rem" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Marqueur pour l'utilisateur */}
      <Marker position={[userLocation.lat, userLocation.lng]}>
        <Popup>{translations.yourLocation || "Your location"}</Popup>
      </Marker>

      {/* Cercle pour le rayon de recherche */}
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

      {/* Marqueurs pour les événements */}
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

      {/* Marqueurs pour les voisins */}
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

      {/* Marqueurs pour les lieux communautaires */}
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

      {/* Marqueurs pour les groupes */}
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
    </MapContainer>
  );
};

export default MapView;
