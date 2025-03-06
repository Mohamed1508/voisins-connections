
import React from "react";
import { Marker, Popup } from "react-leaflet";
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
}

const NeighborMarker: React.FC<NeighborMarkerProps> = ({ neighbor, detailed = false }) => {
  return (
    <Marker
      key={neighbor.id}
      position={[neighbor.lat, neighbor.lng]}
      icon={DefaultIcon}
    >
      <Popup className="neighbor-popup">
        <NeighborCard 
          neighbor={{
            id: neighbor.id,
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
      </Popup>
    </Marker>
  );
};

export default NeighborMarker;
