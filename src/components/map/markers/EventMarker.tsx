
import React from "react";
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
  // The actual marker implementation is handled in the LeafletMap component
  // This component is used to render the content of the popup
  
  if (!selected) return null;

  return (
    <div className="text-sm">
      <p className="font-bold">{event.name}</p>
      <p className="text-xs">{formatDate(event.date)} • {event.time}</p>
      {event.createdBy && <p className="text-xs text-gray-600">Par {event.createdBy}</p>}
    </div>
  );
};

export default EventMarker;
