
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  onClose: () => void;
}

const NeighborCard = ({ neighbor, onClose }: NeighborCardProps) => {
  return (
    <div className="absolute top-16 right-4 max-w-xs w-full">
      <Card className="shadow-lg animate-scale-in bg-background/90 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-medium">{neighbor.name.charAt(0)}</span>
            </div>
            <div>
              <h4 className="font-medium">{neighbor.name}</h4>
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin size={12} className="mr-1" />
                <span>à {neighbor.distance} km</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <Flag size={12} className="mr-1" />
                <span>{neighbor.country.name}</span>
              </div>
              <Button size="sm" className="mt-2 w-full" onClick={onClose}>
                Voir le profil
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NeighborCard;
