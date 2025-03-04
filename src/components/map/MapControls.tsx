
import { Button } from "@/components/ui/button";
import { Locate, ZoomIn, ZoomOut } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface MapControlsProps {
  onLocate: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

const MapControls = ({ onLocate, onZoomIn, onZoomOut }: MapControlsProps) => {
  return (
    <div className="absolute top-4 right-4 flex gap-2">
      <Button variant="outline" size="icon" className="bg-background/90 backdrop-blur-sm shadow-lg" onClick={onLocate}>
        <Locate size={18} />
      </Button>
      <Button variant="outline" size="icon" className="bg-background/90 backdrop-blur-sm shadow-lg" onClick={onZoomIn}>
        <ZoomIn size={18} />
      </Button>
      <Button variant="outline" size="icon" className="bg-background/90 backdrop-blur-sm shadow-lg" onClick={onZoomOut}>
        <ZoomOut size={18} />
      </Button>
    </div>
  );
};

export default MapControls;
