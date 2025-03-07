
import React from "react";
import { Marker, InfoWindow } from "@react-google-maps/api";
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
  selected?: boolean;
  onClose?: () => void;
}

const GroupMarker: React.FC<GroupMarkerProps> = ({ group, onClick, selected, onClose }) => {
  return (
    <Marker
      key={group.id}
      position={{ lat: group.lat, lng: group.lng }}
      icon={groupIcon}
      onClick={() => onClick && onClick(group)}
    >
      {selected && (
        <InfoWindow onCloseClick={onClose}>
          <div className="text-sm">
            <p className="font-bold">{group.name}</p>
            {group.description && <p className="text-xs">{group.description}</p>}
          </div>
        </InfoWindow>
      )}
    </Marker>
  );
};

export default GroupMarker;
