
import { MapPin, Flag } from "lucide-react";

interface NeighborCardProps {
  neighbor: {
    id: number;
    name: string;
    distance: number;
    country: {
      code: string;
      name: string;
    };
  };
  onClose?: () => void;
  onClick?: () => void;
}

const NeighborCard = ({ neighbor, onClose, onClick }: NeighborCardProps) => {
  return (
    <div className="text-sm">
      <div className="flex items-start gap-2">
        <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-primary font-medium">{neighbor.name.charAt(0)}</span>
        </div>
        <div>
          <h4 className="font-medium">{neighbor.name}</h4>
          <div className="flex items-center text-xs text-muted-foreground">
            <MapPin size={10} className="mr-1" />
            <span>à {neighbor.distance} km</span>
          </div>
          <div className="flex items-center text-xs text-muted-foreground mt-0.5">
            <Flag size={10} className="mr-1" />
            <span>{neighbor.country.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NeighborCard;
