
import React, { useRef } from "react";
import { MapContainer, TileLayer, Circle, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { DefaultIcon, rideIcon } from "../leaflet/LeafletConfig";
import NeighborCard from "../NeighborCard";
import MapSearch from "../controls/MapSearch";
import AnimatedDemo from "./AnimatedDemo";
import { kmToMeters } from "../utils/mapUtils";
import { BaseMapProps } from "../types/MapViewTypes";

const parisPosition: [number, number] = [48.8566, 2.3522];

interface PreviewMapProps extends BaseMapProps {}

const PreviewMap: React.FC<PreviewMapProps> = ({ withSearchBar = false }) => {
  const mapRef = useRef<L.Map | null>(null);

  return (
    <MapContainer 
      center={parisPosition} 
      zoom={13} 
      style={{ height: "100%", width: "100%", borderRadius: "0.5rem" }}
      whenCreated={(map: L.Map) => {
        mapRef.current = map;
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <Circle
        center={parisPosition}
        pathOptions={{
          fillColor: "#3b82f6",
          fillOpacity: 0.1,
          color: "#3b82f6",
          weight: 1,
        }}
        radius={kmToMeters(0.5)}
      />
      
      <Marker 
        position={[48.8566, 2.3522]} 
        icon={DefaultIcon}
      >
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
      
      <Marker 
        position={[48.8606, 2.3376]} 
        icon={DefaultIcon}
      >
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
      
      <Marker 
        position={[48.8486, 2.3465]} 
        icon={rideIcon}
      >
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
  );
};

export default PreviewMap;
