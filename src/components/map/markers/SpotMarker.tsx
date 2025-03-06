
import React from "react";
import { Marker, Popup } from "react-leaflet";
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
}

const SpotMarker: React.FC<SpotMarkerProps> = ({ spot, onClick }) => {
  const { translations } = useLanguage();
  
  return (
    <Marker
      key={spot.id}
      position={[spot.lat, spot.lng]}
      icon={spotIcon}
      eventHandlers={{
        click: () => onClick && onClick(spot),
      }}
    >
      <Popup>
        <div className="text-sm">
          <p className="font-bold">{spot.name}</p>
          <p className="text-xs text-gray-600">{translations.createdBy || "Créé par"}: {spot.createdBy}</p>
        </div>
      </Popup>
    </Marker>
  );
};

export default SpotMarker;
