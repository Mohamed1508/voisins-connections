
import React from "react";
import { Marker, InfoWindow } from "@react-google-maps/api";
import { spotIcon } from "../leaflet/LeafletConfig";
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
  
  return (
    <Marker
      key={spot.id}
      position={{ lat: spot.lat, lng: spot.lng }}
      icon={spotIcon}
      onClick={() => onClick && onClick(spot)}
    >
      {selected && (
        <InfoWindow onCloseClick={onClose}>
          <div className="text-sm">
            <p className="font-bold">{spot.name}</p>
            <p className="text-xs text-gray-600">{translations.created_by || "Créé par"}: {spot.createdBy}</p>
          </div>
        </InfoWindow>
      )}
    </Marker>
  );
};

export default SpotMarker;
