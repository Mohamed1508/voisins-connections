
import React from "react";
import { Marker, InfoWindow } from "@react-google-maps/api";
import { rideIcon } from "../leaflet/LeafletConfig";
import { formatDate } from "../utils/mapUtils";

interface RideMarkerProps {
  ride: {
    id: string;
    name: string;
    date: string;
    time: string;
    departure: string;
    arrival: string;
    available_seats: number;
    lat: number;
    lng: number;
  };
  onClick?: (ride: any) => void;
  selected?: boolean;
  onClose?: () => void;
}

const RideMarker: React.FC<RideMarkerProps> = ({ ride, onClick, selected, onClose }) => {
  return (
    <Marker
      key={ride.id}
      position={{ lat: ride.lat, lng: ride.lng }}
      icon={rideIcon}
      onClick={() => onClick && onClick(ride)}
    >
      {selected && (
        <InfoWindow onCloseClick={onClose}>
          <div className="text-sm">
            <p className="font-bold">{ride.name}</p>
            <p className="text-xs">{ride.departure} → {ride.arrival}</p>
            <p className="text-xs">{formatDate(ride.date)} • {ride.available_seats} places</p>
          </div>
        </InfoWindow>
      )}
    </Marker>
  );
};

export default RideMarker;
