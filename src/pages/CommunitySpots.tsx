
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MainLayout from "@/components/layout/MainLayout";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { spotIcon } from "@/components/map/leaflet/LeafletConfig";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SpotFormData {
  name: string;
  description: string;
  originRelated: string;
}

const CommunitySpots = () => {
  const { translations } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<SpotFormData>({
    name: "",
    description: "",
    originRelated: "",
  });
  const [spots, setSpots] = useState<any[]>([]);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number}>({
    lat: 48.8566,
    lng: 2.3522, // Paris par défaut
  });
  const [loading, setLoading] = useState(false);

  // Récupérer la localisation de l'utilisateur
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    }
  }, []);

  // Récupérer les spots depuis Supabase
  useEffect(() => {
    const fetchSpots = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("community_spots")
          .select(`
            *,
            users (username)
          `);
          
        if (error) throw error;
        
        // Transformer les données pour inclure un attribut createdBy
        const spotsWithCreator = data.map(spot => ({
          ...spot,
          createdBy: spot.users?.username || "Unknown user"
        }));
        
        setSpots(spotsWithCreator);
      } catch (error: any) {
        console.error("Error fetching spots:", error.message);
        toast({
          title: "Error",
          description: `Failed to load community spots: ${error.message}`,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSpots();
  }, [toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to create a community spot.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      
      const newSpot = {
        name: formData.name,
        description: formData.description,
        origin_related: formData.originRelated,
        lat: userLocation.lat,
        lng: userLocation.lng,
        created_by: user.id,
      };
      
      const { data, error } = await supabase
        .from("community_spots")
        .insert(newSpot)
        .select(`
          *,
          users (username)
        `)
        .single();
        
      if (error) throw error;
      
      const spotWithCreator = {
        ...data,
        createdBy: data.users?.username || "Unknown user"
      };
      
      setSpots(prev => [...prev, spotWithCreator]);
      
      toast({
        title: "Spot created",
        description: "Your community spot has been created successfully!",
      });
      
      // Réinitialiser le formulaire
      setFormData({
        name: "",
        description: "",
        originRelated: "",
      });
      setShowForm(false);
    } catch (error: any) {
      console.error("Error creating spot:", error.message);
      toast({
        title: "Error",
        description: `Failed to create community spot: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{translations.communitySpots}</h1>
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? translations.cancel : translations.createSpot}
          </Button>
        </div>

        {showForm && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {translations.spotName} *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {translations.spotDescription}
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    rows={3}
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {translations.spotOriginRelated}
                  </label>
                  <input
                    type="text"
                    name="originRelated"
                    value={formData.originRelated}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    placeholder="e.g. Morocco, Algeria, France..."
                    disabled={loading}
                  />
                </div>
                <div className="text-xs text-gray-500">
                  {translations.locationNote}
                </div>
                <div className="pt-2 flex justify-end">
                  <Button type="submit" disabled={loading}>
                    {loading ? "Creating..." : translations.createSpot}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{translations.communitySpots}</CardTitle>
            </CardHeader>
            <CardContent>
              <MapContainer
                style={{ height: "500px", width: "100%" }}
                center={[userLocation.lat, userLocation.lng]}
                zoom={13}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                
                {/* Marqueur pour l'utilisateur */}
                <Marker position={[userLocation.lat, userLocation.lng]}>
                  <Popup>{translations.yourLocation}</Popup>
                </Marker>
                
                {/* Marqueurs pour les spots communautaires */}
                {spots.map((spot) => (
                  <Marker
                    key={spot.id}
                    position={[spot.lat, spot.lng]}
                    icon={spotIcon}
                  >
                    <Popup>
                      <div className="text-sm">
                        <p className="font-bold">{spot.name}</p>
                        {spot.description && <p>{spot.description}</p>}
                        {spot.origin_related && (
                          <p className="text-xs">
                            {translations.spotOriginRelated}: {spot.origin_related}
                          </p>
                        )}
                        <p className="text-xs text-gray-600">
                          {translations.createdBy}: {spot.createdBy}
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {spots.map((spot) => (
              <Card key={spot.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold">{spot.name}</h3>
                  {spot.description && <p className="text-sm mt-2">{spot.description}</p>}
                  {spot.origin_related && (
                    <p className="text-xs mt-2">
                      {translations.spotOriginRelated}: {spot.origin_related}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    {translations.createdBy}: {spot.createdBy}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CommunitySpots;
