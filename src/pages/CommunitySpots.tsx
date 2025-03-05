
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/Header";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogTrigger, 
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { useLanguage } from "@/context/LanguageContext";
import { Tables } from "@/integrations/supabase/types";
import { DefaultIcon, spotIcon } from "@/components/map/leaflet/LeafletConfig";
import { PlusCircle, Pin, Globe } from "lucide-react";

type CommunitySpot = Tables<'community_spots'>;

// Composant pour contrôler la carte
function MapController({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  
  return null;
}

const CommunitySpots = () => {
  const [spots, setSpots] = useState<CommunitySpot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newSpot, setNewSpot] = useState({
    name: "",
    description: "",
    origin_related: "",
    lat: 0,
    lng: 0
  });
  const [mapCenter, setMapCenter] = useState<[number, number]>([48.8566, 2.3522]); // Paris par défaut
  const [zoom, setZoom] = useState(13);
  
  const { toast } = useToast();
  const { user } = useAuth();
  const { translations } = useLanguage();

  // Charger les lieux communautaires
  useEffect(() => {
    const fetchSpots = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('community_spots')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        if (data) {
          setSpots(data);
          
          // Si au moins un lieu existe, centrer la carte sur le premier
          if (data.length > 0) {
            setMapCenter([data[0].lat, data[0].lng]);
          }
        }
      } catch (error: any) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les lieux: " + error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSpots();
  }, [toast]);
  
  // Gérer la création d'un nouveau lieu
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Non autorisé",
        description: "Vous devez être connecté pour créer un lieu",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('community_spots')
        .insert({
          name: newSpot.name,
          description: newSpot.description,
          origin_related: newSpot.origin_related || null,
          lat: newSpot.lat,
          lng: newSpot.lng,
          created_by: user.id
        })
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Lieu créé avec succès",
        description: "Votre lieu a été ajouté à la carte",
      });
      
      if (data && data[0]) {
        setSpots([data[0], ...spots]);
        setIsDialogOpen(false);
        setNewSpot({
          name: "",
          description: "",
          origin_related: "",
          lat: 0,
          lng: 0
        });
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de créer le lieu: " + error.message,
        variant: "destructive",
      });
    }
  };
  
  // Utiliser la géolocalisation pour le nouveau lieu
  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setNewSpot({
            ...newSpot,
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          toast({
            title: "Position détectée",
            description: "Votre position actuelle sera utilisée pour le lieu",
          });
        },
        () => {
          toast({
            title: "Erreur de géolocalisation",
            description: "Impossible d'obtenir votre position",
            variant: "destructive",
          });
        }
      );
    } else {
      toast({
        title: "Géolocalisation non supportée",
        description: "Votre navigateur ne supporte pas la géolocalisation",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="container mx-auto p-4 flex-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Lieux communautaires</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Ajouter un lieu
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Créer un nouveau lieu communautaire</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nom du lieu</label>
                  <Input 
                    value={newSpot.name}
                    onChange={(e) => setNewSpot({...newSpot, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <Textarea 
                    value={newSpot.description}
                    onChange={(e) => setNewSpot({...newSpot, description: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Lié à quelle origine/culture ?</label>
                  <Input 
                    value={newSpot.origin_related || ""}
                    onChange={(e) => setNewSpot({...newSpot, origin_related: e.target.value})}
                    placeholder="Optionnel"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Latitude</label>
                    <Input 
                      type="number" 
                      step="any"
                      value={newSpot.lat || ""}
                      onChange={(e) => setNewSpot({...newSpot, lat: parseFloat(e.target.value)})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Longitude</label>
                    <Input 
                      type="number" 
                      step="any"
                      value={newSpot.lng || ""}
                      onChange={(e) => setNewSpot({...newSpot, lng: parseFloat(e.target.value)})}
                      required
                    />
                  </div>
                </div>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleUseCurrentLocation}
                  className="w-full"
                >
                  <Pin className="mr-2 h-4 w-4" />
                  Utiliser ma position actuelle
                </Button>
                <DialogFooter>
                  <Button type="submit">Créer le lieu</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Carte des lieux */}
        <div className="h-[500px] rounded-xl overflow-hidden shadow-md mb-8">
          <MapContainer 
            style={{ height: "100%", width: "100%" }}
            center={mapCenter}
            zoom={zoom}
            key={`map-${mapCenter.join(',')}-${zoom}`}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            <MapController center={mapCenter} zoom={zoom} />
            
            {/* Markers pour les lieux */}
            {spots.map((spot) => (
              <Marker 
                key={spot.id}
                position={[spot.lat, spot.lng]}
                icon={spotIcon}
              >
                <Popup>
                  <div className="p-1">
                    <h3 className="font-bold">{spot.name}</h3>
                    <p className="text-sm mt-1">{spot.description}</p>
                    {spot.origin_related && (
                      <p className="text-xs mt-1 flex items-center">
                        <Globe size={12} className="mr-1" />
                        Lié à: {spot.origin_related}
                      </p>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
        
        {/* Liste des lieux */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            <p>Chargement des lieux...</p>
          ) : spots.length > 0 ? (
            spots.map((spot) => (
              <div 
                key={spot.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                onClick={() => {
                  setMapCenter([spot.lat, spot.lng]);
                  setZoom(15);
                }}
              >
                <h3 className="font-bold text-lg">{spot.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{spot.description}</p>
                {spot.origin_related && (
                  <p className="text-xs flex items-center mt-2">
                    <Globe size={12} className="mr-1" />
                    {spot.origin_related}
                  </p>
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMapCenter([spot.lat, spot.lng]);
                    setZoom(15);
                  }}
                >
                  <Pin className="h-3 w-3 mr-1" />
                  Voir sur la carte
                </Button>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center p-8">
              <p>Aucun lieu communautaire n'a encore été ajouté.</p>
              <p className="text-muted-foreground mt-2">Soyez le premier à partager un lieu !</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunitySpots;
