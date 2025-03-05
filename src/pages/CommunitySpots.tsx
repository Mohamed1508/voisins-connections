
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { MapPin, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import { DefaultIcon } from "@/components/map/leaflet/LeafletConfig";
import MapController from "@/components/map/MapController";
import { userLocation } from "@/components/map/data/mockData";

interface CommunitySpot {
  id: string;
  name: string;
  description: string;
  lat: number;
  lng: number;
  origin_related: string;
  created_by: string;
  created_at: string;
  creator_username?: string;
}

const CommunitySpots = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [spots, setSpots] = useState<CommunitySpot[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSpot, setNewSpot] = useState({
    name: "",
    description: "",
    origin_related: "",
    lat: userLocation.lat,
    lng: userLocation.lng
  });
  const [mapCenter, setMapCenter] = useState<[number, number]>([userLocation.lat, userLocation.lng]);
  const [zoom, setZoom] = useState(13);
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    fetchSpots();
  }, []);
  
  const fetchSpots = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('community_spots')
        .select(`
          *,
          users:created_by(username)
        `)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Transform the data to match the CommunitySpot interface
      const transformedSpots = data.map((spot: any) => ({
        ...spot,
        creator_username: spot.users?.username
      }));
      
      setSpots(transformedSpots);
    } catch (error: any) {
      console.error("Error fetching spots:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les spots communautaires.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour ajouter un spot.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setSubmitting(true);
      
      const { data, error } = await supabase
        .from('community_spots')
        .insert({
          name: newSpot.name,
          description: newSpot.description,
          origin_related: newSpot.origin_related,
          lat: newSpot.lat,
          lng: newSpot.lng,
          created_by: user.id
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // Get the username of the creator
      const { data: userData } = await supabase
        .from('users')
        .select('username')
        .eq('id', user.id)
        .single();
      
      // Add the new spot to the state
      setSpots(prev => [{
        ...data,
        creator_username: userData?.username
      }, ...prev]);
      
      setIsAddModalOpen(false);
      resetForm();
      
      toast({
        title: "Spot ajouté",
        description: "Votre spot communautaire a été ajouté avec succès.",
      });
    } catch (error: any) {
      console.error("Error adding spot:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le spot communautaire.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleDelete = async (spotId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('community_spots')
        .delete()
        .eq('id', spotId)
        .eq('created_by', user.id);
        
      if (error) throw error;
      
      // Remove the deleted spot from the state
      setSpots(prev => prev.filter(spot => spot.id !== spotId));
      
      toast({
        title: "Spot supprimé",
        description: "Le spot a été supprimé avec succès.",
      });
    } catch (error: any) {
      console.error("Error deleting spot:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le spot.",
        variant: "destructive",
      });
    }
  };
  
  const resetForm = () => {
    setNewSpot({
      name: "",
      description: "",
      origin_related: "",
      lat: userLocation.lat,
      lng: userLocation.lng
    });
  };
  
  const handleOpenModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };
  
  return (
    <>
      <Header />
      <div className="container mx-auto p-4 max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Spots Communautaires</h1>
          <Button onClick={handleOpenModal}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un spot
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-lg overflow-hidden shadow-md h-[500px]">
            <MapContainer 
              style={{ height: "100%", width: "100%" }}
              center={mapCenter}
              zoom={zoom}
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
              
              {/* Marqueurs des spots communautaires */}
              {spots.map((spot) => (
                <Marker 
                  key={spot.id}
                  position={[spot.lat, spot.lng]}
                  icon={DefaultIcon}
                >
                  <Popup>
                    <div className="p-1">
                      <h3 className="font-bold">{spot.name}</h3>
                      {spot.origin_related && (
                        <p className="text-xs mt-1">Origine: {spot.origin_related}</p>
                      )}
                      <p className="text-xs mt-1">Par: {spot.creator_username || "Utilisateur"}</p>
                      <p className="text-xs mt-1">{spot.description}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Liste des spots</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-center py-4 text-muted-foreground">Chargement...</p>
                ) : spots.length === 0 ? (
                  <p className="text-center py-4 text-muted-foreground">Aucun spot communautaire pour le moment</p>
                ) : (
                  <div className="space-y-4">
                    {spots.map((spot) => (
                      <div 
                        key={spot.id} 
                        className="border rounded-lg p-3 relative"
                        onClick={() => setMapCenter([spot.lat, spot.lng])}
                      >
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold">{spot.name}</h3>
                          {user && spot.created_by === user.id && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6 text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(spot.id);
                              }}
                            >
                              <Trash2 size={16} />
                            </Button>
                          )}
                        </div>
                        {spot.origin_related && (
                          <p className="text-sm text-muted-foreground">
                            Origine: {spot.origin_related}
                          </p>
                        )}
                        <p className="text-sm line-clamp-2">{spot.description}</p>
                        <div className="flex items-center text-xs text-muted-foreground mt-2">
                          <MapPin className="h-3 w-3 mr-1" />
                          {spot.lat.toFixed(4)}, {spot.lng.toFixed(4)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Ajouté par {spot.creator_username || "Utilisateur"} le {new Date(spot.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Modal d'ajout de spot */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Ajouter un spot communautaire</DialogTitle>
              <DialogDescription>
                Partagez un lieu intéressant avec votre communauté
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nom du spot</Label>
                  <Input
                    id="name"
                    value={newSpot.name}
                    onChange={(e) => setNewSpot({ ...newSpot, name: e.target.value })}
                    placeholder="Ex: Café Méditerranéen"
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newSpot.description}
                    onChange={(e) => setNewSpot({ ...newSpot, description: e.target.value })}
                    placeholder="Décrivez ce spot..."
                    rows={3}
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="origin">Origine associée (optionnel)</Label>
                  <Input
                    id="origin"
                    value={newSpot.origin_related}
                    onChange={(e) => setNewSpot({ ...newSpot, origin_related: e.target.value })}
                    placeholder="Ex: Maghreb, Sénégal, Asie..."
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="lat">Latitude</Label>
                    <Input
                      id="lat"
                      type="number"
                      step="0.000001"
                      value={newSpot.lat}
                      onChange={(e) => setNewSpot({ ...newSpot, lat: parseFloat(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="lng">Longitude</Label>
                    <Input
                      id="lng"
                      type="number"
                      step="0.000001"
                      value={newSpot.lng}
                      onChange={(e) => setNewSpot({ ...newSpot, lng: parseFloat(e.target.value) })}
                      required
                    />
                  </div>
                </div>
                
                <p className="text-xs text-muted-foreground">
                  Note: Utilisez les coordonnées de votre position actuelle ou ajustez-les manuellement.
                </p>
              </div>
              
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsAddModalOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Ajout en cours..." : "Ajouter le spot"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default CommunitySpots;
