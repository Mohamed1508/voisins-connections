
import React from "react";
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
  // The actual marker implementation is handled in the LeafletMap component
  // This component is used to render the content of the popup
  
  if (!selected) return null;
  
  return (
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
  );
};

export default NeighborMarker;
