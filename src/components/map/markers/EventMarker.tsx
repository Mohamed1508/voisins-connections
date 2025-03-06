
import React from "react";
import { Marker, Popup } from "react-leaflet";
import { eventIcon } from "../leaflet/LeafletConfig";
import { useLanguage } from "@/context/LanguageContext";

interface EventMarkerProps {
  event: {
    id: number;
    name: string;
    date: string;
    time: string;
    lat: number;
    lng: number;
    createdBy: string;
  };
  onClick?: (event: any) => void;
}

const EventMarker: React.FC<EventMarkerProps> = ({ event, onClick }) => {
  const { translations } = useLanguage();
  
  return (
    <Marker
      key={event.id}
      position={[event.lat, event.lng]}
      icon={eventIcon}
      eventHandlers={{
        click: () => onClick && onClick(event),
      }}
    >
      <Popup>
        <div className="text-sm">
          <p className="font-bold">{event.name}</p>
          <p>
            {event.date} • {event.time}
          </p>
          <p className="text-xs text-gray-600">{translations.createdBy || "Créé par"}: {event.createdBy}</p>
        </div>
      </Popup>
    </Marker>
  );
};

export default EventMarker;
