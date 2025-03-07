import React, { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Car, Calendar, MapPin, Users, Clock, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import RideForm from "@/components/rides/RideForm";
import { spotIcon, rideIcon } from "@/components/map/leaflet/LeafletConfig";
import { Link } from "react-router-dom";
import RideMarker from "@/components/map/markers/RideMarker";
import LeafletProvider from "@/components/map/LeafletProvider";
import LeafletMap from "@/components/map/LeafletMap";
import SpotMarker from "@/components/map/markers/SpotMarker";

const mapContainerStyle = {
  height: "100%",
  width: "100%"
};

const Rides = () => {
  const { translations } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [rides, setRides] = useState<any[]>([]);
  const [myRides, setMyRides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [position, setPosition] = useState({ lat: 48.8566, lng: 2.3522 });
  const [selectedRide, setSelectedRide] = useState<string | null>(null);

  useEffect(() => {
    fetchRides();
  }, [user]);

  const fetchRides = async () => {
    try {
      setLoading(true);
      
      const { data: allRides, error } = await supabase
        .from('rides')
        .select('*, users:created_by(username, avatar_url)')
        .order('date', { ascending: true });
      
      if (error) throw error;
      
      if (user) {
        const { data: userRides, error: userError } = await supabase
          .from('rides')
          .select('*, users:created_by(username, avatar_url)')
          .eq('created_by', user.id)
          .order('date', { ascending: true });
        
        if (userError) throw userError;
        setMyRides(userRides || []);
      }
      
      setRides(allRides || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load rides",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMapClick = (e: any) => {
    if (showForm && e.latlng) {
      setPosition({ lat: e.latlng.lat, lng: e.latlng.lng });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleRideClick = (ride: any) => {
    setSelectedRide(selectedRide === ride.id ? null : ride.id);
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-6 max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold flex items-center">
            <Car className="mr-2 h-6 w-6 text-primary" />
            {translations.carpooling}
          </h1>
          
          {user && (
            <Button onClick={() => setShowForm(!showForm)}>
              {showForm ? translations.cancel : translations.createRide}
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 relative rounded-lg overflow-hidden shadow-md h-[500px]">
            <LeafletProvider>
              <LeafletMap
                center={[position.lat, position.lng]}
                zoom={13}
                onClick={handleMapClick}
                markers={rides.map((ride) => ({
                  id: ride.id,
                  type: 'ride' as const,
                  position: [ride.lat, ride.lng] as [number, number],
                  onClick: () => handleRideClick(ride)
                }))}
                onMapReady={(map) => {/* Handle map ready */}}
              >
                {showForm && (
                  <SpotMarker 
                    spot={{
                      id: 'new-ride',
                      name: translations.locationNote || "Position sélectionnée",
                      lat: position.lat,
                      lng: position.lng,
                      createdBy: ''
                    }}
                    selected={true}
                  />
                )}
              </LeafletMap>
            </LeafletProvider>
            
            {showForm && (
              <div className="absolute bottom-0 left-0 right-0 bg-background/90 backdrop-blur-sm">
                <RideForm 
                  onCancel={() => setShowForm(false)} 
                  position={position}
                />
              </div>
            )}
          </div>
          
          <div className="lg:col-span-2">
            {user ? (
              <Tabs defaultValue="all">
                <TabsList className="w-full mb-4">
                  <TabsTrigger value="all" className="flex-1">{translations.rides}</TabsTrigger>
                  <TabsTrigger value="my" className="flex-1">{translations.myGroups}</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all">
                  {loading ? (
                    <div className="text-center py-8">Loading rides...</div>
                  ) : rides.length > 0 ? (
                    <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2">
                      {rides.map((ride) => (
                        <RideCard key={ride.id} ride={ride} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No rides available
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="my">
                  {loading ? (
                    <div className="text-center py-8">Loading your rides...</div>
                  ) : myRides.length > 0 ? (
                    <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2">
                      {myRides.map((ride) => (
                        <RideCard key={ride.id} ride={ride} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      You haven't created any rides yet
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            ) : (
              <div className="bg-muted/50 rounded-lg p-6 text-center">
                <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">Login to create rides</h3>
                <p className="text-muted-foreground mb-4">
                  Sign in to create and manage your carpooling rides
                </p>
                <div className="flex gap-4 justify-center">
                  <Button asChild variant="default">
                    <Link to="/login">{translations.login}</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/signup">{translations.signUp}</Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Rides;
