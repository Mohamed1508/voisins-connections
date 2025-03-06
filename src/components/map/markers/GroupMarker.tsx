
import React from "react";
import { Marker, Popup } from "react-leaflet";
import { groupIcon } from "../leaflet/LeafletConfig";

interface GroupMarkerProps {
  group: {
    id: string;
    name: string;
    lat: number;
    lng: number;
    description?: string;
  };
  onClick?: (group: any) => void;
}

const GroupMarker: React.FC<GroupMarkerProps> = ({ group, onClick }) => {
  return (
    <Marker
      key={group.id}
      position={[group.lat, group.lng]}
      icon={groupIcon}
      eventHandlers={{
        click: () => onClick && onClick(group),
      }}
    >
      <Popup>
        <div className="text-sm">
          <p className="font-bold">{group.name}</p>
          {group.description && <p className="text-xs">{group.description}</p>}
        </div>
      </Popup>
    </Marker>
  );
};

export default GroupMarker;
