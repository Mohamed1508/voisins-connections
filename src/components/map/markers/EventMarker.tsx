
import React from "react";
import { Marker, InfoWindow } from "@react-google-maps/api";
import { eventIcon } from "../leaflet/LeafletConfig";
import { formatDate } from "../utils/mapUtils";

interface EventMarkerProps {
  event: {
    id: number;
    name: string;
    date: string;
    time: string;
    lat: number;
    lng: number;
    createdBy?: string;
  };
  onClick?: (event: any) => void;
  selected?: boolean;
  onClose?: () => void;
}

const EventMarker: React.FC<EventMarkerProps> = ({ event, onClick, selected, onClose }) => {
  return (
    <Marker
      key={event.id}
      position={{ lat: event.lat, lng: event.lng }}
      icon={eventIcon}
      onClick={() => onClick && onClick(event)}
    >
      {selected && (
        <InfoWindow onCloseClick={onClose}>
          <div className="text-sm">
            <p className="font-bold">{event.name}</p>
            <p className="text-xs">{formatDate(event.date)} • {event.time}</p>
            {event.createdBy && <p className="text-xs text-gray-600">Par {event.createdBy}</p>}
          </div>
        </InfoWindow>
      )}
    </Marker>
  );
};

export default EventMarker;
