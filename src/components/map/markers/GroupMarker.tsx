
import React from "react";

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
  // The actual marker implementation is handled in the LeafletMap component
  // This component is used to render the content of the popup
  
  if (!selected) return null;

  return (
    <div className="text-sm">
      <p className="font-bold">{group.name}</p>
      {group.description && <p className="text-xs">{group.description}</p>}
    </div>
  );
};

export default GroupMarker;
