
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { MapPin, Locate, Search, ZoomIn, ZoomOut } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface MapViewProps {
  className?: string;
}

// Simuler la localisation de l'utilisateur
const userLocation = {
  lat: 48.8566,
  lng: 2.3522, // Paris
};

// Simuler les voisins
const neighbors = [
  { id: 1, name: "Marie D.", lat: 48.8576, lng: 2.3532, distance: 0.2 },
  { id: 2, name: "Thomas L.", lat: 48.8580, lng: 2.3492, distance: 0.3 },
  { id: 3, name: "Sarah K.", lat: 48.8546, lng: 2.3502, distance: 0.4 },
  { id: 4, name: "Ahmed B.", lat: 48.8596, lng: 2.3572, distance: 0.5 },
  { id: 5, name: "Julie M.", lat: 48.8536, lng: 2.3482, distance: 0.7 },
];

const MapView = ({ className = "" }: MapViewProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [radius, setRadius] = useState(1);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [selectedNeighbor, setSelectedNeighbor] = useState<typeof neighbors[0] | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Simulation d'une carte qui charge
    const timer = setTimeout(() => {
      setIsMapLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleLocate = () => {
    toast({
      title: "Localisation activée",
      description: "Votre position a été mise à jour.",
    });
  };

  const handleZoomIn = () => {
    // Simulation de zoom in
  };

  const handleZoomOut = () => {
    // Simulation de zoom out
  };

  const handleNeighborClick = (neighbor: typeof neighbors[0]) => {
    setSelectedNeighbor(neighbor);
  };

  return (
    <div className={`relative w-full rounded-xl overflow-hidden ${className}`}>
      {/* Map container */}
      <div 
        ref={mapRef} 
        className={`w-full h-full min-h-[300px] bg-gray-200 transition-opacity duration-500 ${isMapLoaded ? 'opacity-100' : 'opacity-40'}`}
      >
        {/* Placeholder pour simuler la carte */}
        {!isMapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}
        
        {isMapLoaded && (
          <>
            {/* Simuler un fond de carte avec un dégradé */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100"></div>
            
            {/* Simuler des routes */}
            <div className="absolute inset-0">
              <div className="absolute left-1/4 top-1/2 w-1/2 h-0.5 bg-gray-300 transform -rotate-45"></div>
              <div className="absolute left-1/4 top-1/3 w-1/2 h-0.5 bg-gray-300"></div>
              <div className="absolute left-1/2 top-1/4 w-0.5 h-1/2 bg-gray-300"></div>
              <div className="absolute left-1/3 top-1/4 w-1/3 h-0.5 bg-gray-300 transform rotate-45"></div>
            </div>
            
            {/* Point de l'utilisateur */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                <div className="absolute -inset-4 rounded-full bg-primary/20 animate-pulse-slow"></div>
                <div className="absolute -inset-2 rounded-full bg-primary/30"></div>
                <div className="w-4 h-4 bg-primary rounded-full border-2 border-white shadow-lg"></div>
              </div>
            </div>
            
            {/* Cercle de rayon */}
            <div 
              className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/40 bg-primary/5"
              style={{ 
                width: `${radius * 40}%`, 
                height: `${radius * 40}%`,
                transition: 'all 0.3s ease-out'
              }}
            ></div>
            
            {/* Points des voisins */}
            {neighbors.map((neighbor) => (
              <div 
                key={neighbor.id}
                className={`absolute cursor-pointer transition-all duration-300 transform ${
                  selectedNeighbor?.id === neighbor.id ? 'scale-125' : 'scale-100'
                }`}
                style={{ 
                  left: `calc(50% + ${(neighbor.lng - userLocation.lng) * 100}px)`, 
                  top: `calc(50% + ${(neighbor.lat - userLocation.lat) * -100}px)`,
                }}
                onClick={() => handleNeighborClick(neighbor)}
              >
                <div className="w-3 h-3 bg-accent-foreground rounded-full border border-background shadow-md"></div>
              </div>
            ))}
          </>
        )}
      </div>
      
      {/* Controls */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
        <Card className="w-1/2 shadow-lg bg-background/90 backdrop-blur-sm">
          <CardContent className="p-2">
            <div className="relative">
              <Search className="absolute left-2 top-2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher une adresse..."
                className="pl-8 pr-4 py-1 w-full rounded-md text-sm border border-border bg-background"
              />
            </div>
          </CardContent>
        </Card>
        
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="bg-background/90 backdrop-blur-sm shadow-lg" onClick={handleLocate}>
            <Locate size={18} />
          </Button>
          <Button variant="outline" size="icon" className="bg-background/90 backdrop-blur-sm shadow-lg" onClick={handleZoomIn}>
            <ZoomIn size={18} />
          </Button>
          <Button variant="outline" size="icon" className="bg-background/90 backdrop-blur-sm shadow-lg" onClick={handleZoomOut}>
            <ZoomOut size={18} />
          </Button>
        </div>
      </div>
      
      {/* Radius control */}
      <div className="absolute bottom-4 left-4 right-4">
        <Card className="shadow-lg bg-background/90 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Rayon de recherche</span>
                <span className="text-sm font-medium">{radius} km</span>
              </div>
              <Slider
                value={[radius]}
                min={0.5}
                max={10}
                step={0.5}
                onValueChange={(value) => setRadius(value[0])}
              />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Selected neighbor card */}
      {selectedNeighbor && (
        <div className="absolute top-16 right-4 max-w-xs w-full">
          <Card className="shadow-lg animate-scale-in bg-background/90 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-medium">{selectedNeighbor.name.charAt(0)}</span>
                </div>
                <div>
                  <h4 className="font-medium">{selectedNeighbor.name}</h4>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin size={12} className="mr-1" />
                    <span>à {selectedNeighbor.distance} km</span>
                  </div>
                  <Button size="sm" className="mt-2 w-full" onClick={() => setSelectedNeighbor(null)}>
                    Voir le profil
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MapView;
