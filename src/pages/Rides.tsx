
import React, { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useLanguage } from "@/context/LanguageContext";
import { GoogleMap } from "@react-google-maps/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Car, Calendar, MapPin, Users, Clock, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import RideForm from "@/components/rides/RideForm";
import { spotIcon, rideIcon, mapStyles } from "@/components/map/leaflet/LeafletConfig";
import { Link } from "react-router-dom";
import RideMarker from "@/components/map/markers/RideMarker";
import GoogleMapProvider from "@/components/map/GoogleMapProvider";
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
  const [mapRef, setMapRef] = useState<google.maps.Map | null>(null);

  useEffect(() => {
    fetchRides();
  }, [user]);

  const fetchRides = async () => {
    try {
      setLoading(true);
      
      // Fetch all rides
      const { data: allRides, error } = await supabase
        .from('rides')
        .select('*, users:created_by(username, avatar_url)')
        .order('date', { ascending: true });
      
      if (error) throw error;
      
      // If user is logged in, fetch their rides
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

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (showForm && e.latLng) {
      setPosition({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleRideClick = (ride: any) => {
    setSelectedRide(selectedRide === ride.id ? null : ride.id);
  };

  const onMapLoad = (map: google.maps.Map) => {
    setMapRef(map);
  };

  const RideCard = ({ ride }: { ride: any }) => (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Car className="h-5 w-5 text-primary" />
              {ride.name}
            </CardTitle>
            <CardDescription className="flex items-center mt-1">
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(ride.date)}
              </span>
              <span className="mx-2">•</span>
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {ride.time}
              </span>
            </CardDescription>
          </div>
          <div className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-medium flex items-center">
            <Users className="h-4 w-4 mr-1" />
            {ride.available_seats} {ride.available_seats === 1 ? 'seat' : 'seats'}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
          <span className="font-medium">{ride.departure}</span>
          <ArrowRight className="h-3 w-3 mx-2" />
          <span className="font-medium">{ride.arrival}</span>
        </div>
        
        <div className="flex items-center mt-3 text-xs text-muted-foreground">
          <span>
            {translations.createdBy}: {ride.users?.username || "Anonymous"}
          </span>
        </div>
      </CardContent>
    </Card>
  );

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
          {/* Map */}
          <div className="lg:col-span-3 relative rounded-lg overflow-hidden shadow-md h-[500px]">
            <GoogleMapProvider>
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={position}
                zoom={13}
                onClick={handleMapClick}
                onLoad={onMapLoad}
                options={{
                  styles: mapStyles,
                  zoomControl: true,
                  streetViewControl: false,
                  mapTypeControl: false
                }}
              >
                {/* Ride markers */}
                {rides.map((ride) => (
                  <RideMarker 
                    key={ride.id} 
                    ride={ride}
                    onClick={handleRideClick}
                    selected={selectedRide === ride.id}
                    onClose={() => setSelectedRide(null)}
                  />
                ))}
                
                {/* Position marker when creating a ride */}
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
              </GoogleMap>
            </GoogleMapProvider>
            
            {showForm && (
              <div className="absolute bottom-0 left-0 right-0 bg-background/90 backdrop-blur-sm">
                <RideForm 
                  onCancel={() => setShowForm(false)} 
                  position={position}
                />
              </div>
            )}
          </div>
          
          {/* Rides list */}
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
