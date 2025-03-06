
import React from "react";
import { Marker, Popup } from "react-leaflet";
import { rideIcon } from "../leaflet/LeafletConfig";
import { useLanguage } from "@/context/LanguageContext";

interface RideMarkerProps {
  ride: {
    id: string;
    name: string;
    departure: string;
    arrival: string;
    date: string;
    availableSeats: number;
    lat: number;
    lng: number;
    createdBy: string;
  };
  onClick?: (ride: any) => void;
}

const RideMarker: React.FC<RideMarkerProps> = ({ ride, onClick }) => {
  const { translations } = useLanguage();
  
  return (
    <Marker
      key={ride.id}
      position={[ride.lat, ride.lng]}
      icon={rideIcon}
      eventHandlers={{
        click: () => onClick && onClick(ride),
      }}
    >
      <Popup>
        <div className="text-sm">
          <p className="font-bold">{ride.name}</p>
          <p className="text-xs">{ride.departure} → {ride.arrival}</p>
          <p className="text-xs">{ride.date} • {ride.availableSeats} places</p>
          <p className="text-xs text-gray-600">{translations.createdBy || "Créé par"}: {ride.createdBy}</p>
        </div>
      </Popup>
    </Marker>
  );
};

export default RideMarker;
