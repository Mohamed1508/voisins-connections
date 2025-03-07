
import React from "react";
import { useLanguage } from "@/context/LanguageContext";

interface SpotMarkerProps {
  spot: {
    id: string;
    name: string;
    lat: number;
    lng: number;
    createdBy: string;
  };
  onClick?: (spot: any) => void;
  selected?: boolean;
  onClose?: () => void;
}

const SpotMarker: React.FC<SpotMarkerProps> = ({ spot, onClick, selected, onClose }) => {
  const { translations } = useLanguage();
  
  // The actual marker implementation is handled in the LeafletMap component
  // This component is used to render the content of the popup
  
  if (!selected) return null;

  return (
    <div className="text-sm">
      <p className="font-bold">{spot.name}</p>
      <p className="text-xs text-gray-600">{translations.created_by || "Créé par"}: {spot.createdBy}</p>
    </div>
  );
};

export default SpotMarker;
