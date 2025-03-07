
import React from "react";
import { Marker, InfoWindow } from "@react-google-maps/api";
import { DefaultIcon } from "../leaflet/LeafletConfig";
import NeighborCard from "../NeighborCard";

interface NeighborMarkerProps {
  neighbor: {
    id: number | string;
    name?: string;
    username?: string;
    lat: number;
    lng: number;
    distance?: number;
    country?: {
      code: string;
      name: string;
    };
    origin_country?: string;
    languages?: string[];
    interests?: string[];
    bio?: string;
  };
  detailed?: boolean;
  selected?: boolean;
  onClick?: () => void;
  onClose?: () => void;
}

const NeighborMarker: React.FC<NeighborMarkerProps> = ({ 
  neighbor, 
  detailed = false,
  selected = false,
  onClick,
  onClose
}) => {
  return (
    <Marker
      key={String(neighbor.id)}
      position={{ lat: neighbor.lat, lng: neighbor.lng }}
      icon={DefaultIcon}
      onClick={onClick}
    >
      {selected && (
        <InfoWindow onCloseClick={onClose}>
          <NeighborCard 
            neighbor={{
              id: typeof neighbor.id === 'string' ? parseInt(neighbor.id, 10) : neighbor.id,
              name: neighbor.username || neighbor.name || "Voisin",
              distance: neighbor.distance,
              origin_country: neighbor.origin_country,
              languages: neighbor.languages,
              interests: neighbor.interests,
              bio: neighbor.bio,
              country: neighbor.country
            }} 
            detailed={detailed} 
          />
        </InfoWindow>
      )}
    </Marker>
  );
};

export default NeighborMarker;
