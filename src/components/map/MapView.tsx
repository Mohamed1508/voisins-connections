
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { MapPin, Locate, Search, ZoomIn, ZoomOut } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { MapContainer, TileLayer, Marker, Circle, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useLanguage } from "@/context/LanguageContext";
import L from "leaflet";

// Fix for default icon issues in Leaflet with webpack
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

// Fix Leaflet default icon issue
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapViewProps {
  className?: string;
  previewMode?: boolean;
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

// Composant pour contrôler la carte
const MapController = ({ center, zoom }: { center: [number, number], zoom: number }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  
  return null;
};

// Composant pour rechercher un pays
const CountrySearch = ({ onSearch }: { onSearch: (country: string) => void }) => {
  const [query, setQuery] = useState("");
  const { translations } = useLanguage();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <Search className="absolute left-2 top-2 h-4 w-4 text-muted-foreground" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={translations.searchAddress}
        className="pl-8 pr-4 py-1 w-full rounded-md text-sm border border-border bg-background"
      />
    </form>
  );
};

const MapView = ({ className = "", previewMode = false }: MapViewProps) => {
  const [radius, setRadius] = useState(1);
  const [mapCenter, setMapCenter] = useState<[number, number]>([userLocation.lat, userLocation.lng]);
  const [zoom, setZoom] = useState(13);
  const [selectedNeighbor, setSelectedNeighbor] = useState<typeof neighbors[0] | null>(null);
  const { toast } = useToast();
  const { translations } = useLanguage();

  const handleLocate = () => {
    setMapCenter([userLocation.lat, userLocation.lng]);
    setZoom(13);
    toast({
      title: "Localisation activée",
      description: "Votre position a été mise à jour.",
    });
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 1, 18));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 1, 3));
  };

  const handleNeighborClick = (neighbor: typeof neighbors[0]) => {
    setSelectedNeighbor(neighbor);
  };

  const handleCountrySearch = async (countryName: string) => {
    try {
      // Utiliser l'API nominatim de OpenStreetMap pour geocoder le pays
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?country=${encodeURIComponent(
          countryName
        )}&format=json&limit=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setMapCenter([parseFloat(lat), parseFloat(lon)]);
        setZoom(6); // Zoom approprié pour un pays
        toast({
          title: "Pays trouvé",
          description: `Affichage de: ${countryName}`,
        });
      } else {
        toast({
          title: "Pays non trouvé",
          description: "Essayez un autre nom de pays",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de rechercher le pays",
        variant: "destructive",
      });
    }
  };

  return (
    <div className={`relative w-full rounded-xl overflow-hidden ${className}`}>
      {/* Carte Leaflet */}
      <div className="w-full h-full min-h-[300px]">
        <MapContainer
          center={mapCenter}
          zoom={zoom}
          style={{ height: "100%", width: "100%", borderRadius: "0.75rem" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapController center={mapCenter} zoom={zoom} />
          
          {/* Position de l'utilisateur */}
          <Marker position={[userLocation.lat, userLocation.lng]}>
            <Popup>Votre position</Popup>
          </Marker>
          
          {/* Cercle de rayon */}
          <Circle 
            center={[userLocation.lat, userLocation.lng]} 
            radius={radius * 1000}
            pathOptions={{ fillColor: 'blue', fillOpacity: 0.1, color: 'blue', weight: 1 }}
          />
          
          {/* Marqueurs des voisins */}
          {neighbors.map((neighbor) => (
            <Marker 
              key={neighbor.id}
              position={[neighbor.lat, neighbor.lng]}
              eventHandlers={{
                click: () => handleNeighborClick(neighbor),
              }}
            >
              <Popup>{neighbor.name}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      
      {/* Controls */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
        <Card className="w-1/2 shadow-lg bg-background/90 backdrop-blur-sm">
          <CardContent className="p-2">
            <CountrySearch onSearch={handleCountrySearch} />
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
                <span className="text-sm font-medium">{translations.searchRadius}</span>
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
