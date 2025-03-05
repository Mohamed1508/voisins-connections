
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, MapPin, User, Info } from "lucide-react";
import Header from "@/components/layout/Header";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import MapController from "@/components/map/MapController";

type CommunitySpot = {
  id: string;
  name: string;
  description: string | null;
  lat: number;
  lng: number;
  origin_related: string | null;
  created_by: string;
  created_at: string;
  creator_name?: string;
};

const CommunitySpots = () => {
  const [spots, setSpots] = useState<CommunitySpot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newSpot, setNewSpot] = useState({
    name: "",
    description: "",
    origin_related: "",
    lat: 48.8566,
    lng: 2.3522,
  });
  const [mapCenter, setMapCenter] = useState<[number, number]>([48.8566, 2.3522]);
  const [zoom, setZoom] = useState(10);
  const [selectedSpot, setSelectedSpot] = useState<CommunitySpot | null>(null);
  
  const { toast } = useToast();
  const { translations } = useLanguage();
  const { user } = useAuth();

  const fetchSpots = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("community_spots")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch creator usernames
      if (data) {
        const spotsWithCreatorNames = await Promise.all(
          data.map(async (spot) => {
            const { data: userData } = await supabase
              .from("users")
              .select("username")
              .eq("id", spot.created_by)
              .single();

            return {
              ...spot,
              creator_name: userData?.username || "Utilisateur inconnu",
            };
          })
        );
        setSpots(spotsWithCreatorNames);
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching community spots:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les spots communautaires.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSpots();
  }, []);

  const handleAddSpot = async () => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour ajouter un spot.",
        variant: "destructive",
      });
      return;
    }

    if (!newSpot.name) {
      toast({
        title: "Erreur",
        description: "Veuillez donner un nom à votre spot.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from("community_spots").insert([
        {
          name: newSpot.name,
          description: newSpot.description || null,
          lat: newSpot.lat,
          lng: newSpot.lng,
          origin_related: newSpot.origin_related || null,
          created_by: user.id,
        },
      ]);

      if (error) throw error;

      toast({
        title: "Spot ajouté",
        description: "Votre spot communautaire a été ajouté avec succès.",
      });

      setShowAddDialog(false);
      setNewSpot({
        name: "",
        description: "",
        origin_related: "",
        lat: 48.8566,
        lng: 2.3522,
      });
      
      fetchSpots();
    } catch (error) {
      console.error("Error adding community spot:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le spot communautaire.",
        variant: "destructive",
      });
    }
  };

  const handleSpotClick = (spot: CommunitySpot) => {
    setSelectedSpot(spot);
    setMapCenter([spot.lat, spot.lng]);
    setZoom(15);
  };

  const handleMapClick = (e: any) => {
    if (showAddDialog) {
      setNewSpot({
        ...newSpot,
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container mx-auto p-4 flex-1">
        <h1 className="text-3xl font-bold mb-6">Spots Communautaires</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Carte des spots */}
          <div className="lg:col-span-2 rounded-lg overflow-hidden shadow-md h-[500px]">
            <MapContainer 
              style={{ height: "100%", width: "100%" }}
              center={mapCenter}
              zoom={zoom}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              
              <MapController center={mapCenter} zoom={zoom} />

              {/* Marqueurs pour tous les spots */}
              {spots.map((spot) => (
                <Marker 
                  key={spot.id}
                  position={[spot.lat, spot.lng]}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-bold text-base">{spot.name}</h3>
                      {spot.description && (
                        <p className="text-sm mt-1">{spot.description}</p>
                      )}
                      <p className="text-xs mt-2 text-muted-foreground">
                        Par {spot.creator_name}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {/* Liste des spots et actions */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle>Liste des spots</CardTitle>
                  <Button 
                    onClick={() => setShowAddDialog(true)}
                    className="flex items-center gap-1"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Ajouter
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="max-h-[380px] overflow-y-auto">
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : spots.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Aucun spot communautaire pour le moment.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {spots.map((spot) => (
                      <Card 
                        key={spot.id} 
                        className="p-3 cursor-pointer hover:bg-secondary/40 transition-colors"
                        onClick={() => handleSpotClick(spot)}
                      >
                        <div className="flex items-start gap-3">
                          <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <div>
                            <h3 className="font-medium">{spot.name}</h3>
                            {spot.origin_related && (
                              <p className="text-xs text-muted-foreground">
                                Origine: {spot.origin_related}
                              </p>
                            )}
                            <p className="text-xs flex items-center gap-1 mt-1">
                              <User className="h-3 w-3" /> 
                              {spot.creator_name}
                            </p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            
            {selectedSpot && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{selectedSpot.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedSpot.description && (
                      <p className="text-sm">{selectedSpot.description}</p>
                    )}
                    {selectedSpot.origin_related && (
                      <div className="flex items-center gap-2 text-sm">
                        <Info className="h-4 w-4 text-muted-foreground" />
                        <span>Lié à: {selectedSpot.origin_related}</span>
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground">
                      Ajouté par {selectedSpot.creator_name} le{" "}
                      {new Date(selectedSpot.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Boîte de dialogue pour ajouter un spot */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ajouter un spot communautaire</DialogTitle>
            <DialogDescription>
              Partagez un lieu important pour votre communauté
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du spot</Label>
              <Input
                id="name"
                value={newSpot.name}
                onChange={(e) => setNewSpot({ ...newSpot, name: e.target.value })}
                placeholder="ex: Restaurant Le Couscous"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (optionnelle)</Label>
              <Textarea
                id="description"
                value={newSpot.description}
                onChange={(e) => setNewSpot({ ...newSpot, description: e.target.value })}
                placeholder="Décrivez ce lieu..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="origin">Origine liée (optionnelle)</Label>
              <Input
                id="origin"
                value={newSpot.origin_related}
                onChange={(e) => setNewSpot({ ...newSpot, origin_related: e.target.value })}
                placeholder="ex: Algérie, Maroc..."
              />
            </div>
            <div className="space-y-2">
              <Label>Coordonnées</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Input
                    value={newSpot.lat}
                    onChange={(e) => setNewSpot({ ...newSpot, lat: parseFloat(e.target.value) })}
                    type="number"
                    step="0.000001"
                    placeholder="Latitude"
                  />
                </div>
                <div>
                  <Input
                    value={newSpot.lng}
                    onChange={(e) => setNewSpot({ ...newSpot, lng: parseFloat(e.target.value) })}
                    type="number"
                    step="0.000001"
                    placeholder="Longitude"
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Vous pouvez également cliquer sur la carte pour définir la position
              </p>
            </div>
            <Button onClick={handleAddSpot} className="w-full">
              Ajouter ce spot
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CommunitySpots;
