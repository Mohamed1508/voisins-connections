
import { MapPin, Flag, Globe, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface NeighborCardProps {
  neighbor: {
    id: number;
    name: string;
    distance?: number;
    country?: {
      code: string;
      name: string;
    };
    origin_country?: string;
    languages?: string[];
    interests?: string[];
    bio?: string;
  };
  onClose?: () => void;
  onClick?: () => void;
  detailed?: boolean;
}

const NeighborCard = ({ neighbor, onClose, onClick, detailed = false }: NeighborCardProps) => {
  if (!neighbor) return null;
  
  return (
    <div className={`text-sm ${detailed ? 'p-2' : ''}`}>
      <div className="flex items-start gap-2">
        <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-primary font-medium">{neighbor.name?.charAt(0) || '?'}</span>
        </div>
        <div className="flex-1">
          <h4 className="font-medium">{neighbor.name}</h4>
          
          {neighbor.distance !== undefined && (
            <div className="flex items-center text-xs text-muted-foreground">
              <MapPin size={10} className="mr-1" />
              <span>à {neighbor.distance} km</span>
            </div>
          )}
          
          {neighbor.country && (
            <div className="flex items-center text-xs text-muted-foreground mt-0.5">
              <Flag size={10} className="mr-1" />
              <span>{neighbor.country.name}</span>
            </div>
          )}
          
          {neighbor.origin_country && (
            <div className="flex items-center text-xs text-muted-foreground mt-0.5">
              <Flag size={10} className="mr-1" />
              <span>{neighbor.origin_country}</span>
            </div>
          )}
          
          {detailed && neighbor.languages && neighbor.languages.length > 0 && (
            <div className="mt-2">
              <div className="flex items-center text-xs font-medium mb-1">
                <Globe size={10} className="mr-1" />
                <span>Langues</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {neighbor.languages.map((lang, i) => (
                  <Badge key={i} variant="outline" className="text-xs py-0">{lang}</Badge>
                ))}
              </div>
            </div>
          )}
          
          {detailed && neighbor.interests && neighbor.interests.length > 0 && (
            <div className="mt-2">
              <div className="flex items-center text-xs font-medium mb-1">
                <Heart size={10} className="mr-1" />
                <span>Intérêts</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {neighbor.interests.map((interest, i) => (
                  <Badge key={i} variant="outline" className="text-xs py-0">{interest}</Badge>
                ))}
              </div>
            </div>
          )}
          
          {detailed && neighbor.bio && (
            <div className="mt-2 text-xs text-muted-foreground">
              <p>{neighbor.bio}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NeighborCard;
