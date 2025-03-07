import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MapPin, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import { spotIcon } from "@/components/map/leaflet/LeafletConfig";
import Header from "@/components/layout/Header";

interface Spot {
  id: string;
  name: string;
  description: string | null;
  lat: number;
  lng: number;
  created_by: string;
}

interface SpotMapProps {
  spots: Spot[];
  selectedSpot: Spot | null;
  onSpotClick: (spot: Spot | null) => void;
}

interface CommunitySpotsProps {
  spots: Spot[];
  creatorUsernames: { [key: string]: string };
  selectedSpot: Spot | null;
  onSpotClick: (spot: Spot | null) => void;
}

const CommunitySpots = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [spots, setSpots] = useState<Spot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
  const [creatorUsernames, setCreatorUsernames] = useState<{ [key: string]: string }>({});
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchCommunitySpots();
  }, []);

  const fetchCommunitySpots = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('community_spots')
        .select('*');

      if (error) throw error;

      if (data) {
        setSpots(data);
        // Fetch usernames for each spot
        const usernames: { [key: string]: string } = {};
        for (const spot of data) {
          const username = await getCreatorUsername(spot.created_by);
          usernames[spot.created_by] = username;
        }
        setCreatorUsernames(usernames);
      }
    } catch (error: any) {
      console.error("Error fetching community spots:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les lieux communautaires.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getCreatorUsername = async (userId: string) => {
    const { data } = await supabase
      .from('users')
      .select('username')
      .eq('id', userId)
      .single();

    return data?.username || 'Utilisateur';
  };

  const handleSpotClick = (spot: Spot | null) => {
    setSelectedSpot(spot);
  };

  const filteredSpots = spots.filter(spot =>
    spot.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <>
        <Header />
        <div className="container mx-auto p-4 max-w-3xl">
          <div className="flex justify-center items-center h-48">
            <p>Chargement des lieux communautaires...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container mx-auto p-4 max-w-3xl">
        <div className="mb-4">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au tableau de bord
          </Link>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">Lieux communautaires</CardTitle>
            <CardDescription>
              Découvrez les lieux préférés de vos voisins
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Input
                type="text"
                placeholder="Rechercher un lieu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <CommunitySpotsList
              spots={filteredSpots}
              creatorUsernames={creatorUsernames}
              selectedSpot={selectedSpot}
              onSpotClick={handleSpotClick}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
};

interface CommunitySpotsListProps {
  spots: Spot[];
  creatorUsernames: { [key: string]: string };
  selectedSpot: Spot | null;
  onSpotClick: (spot: Spot | null) => void;
}

const CommunitySpotsList = ({ spots, creatorUsernames, selectedSpot, onSpotClick }: CommunitySpotsListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <ul className="space-y-2">
          {spots.map(spot => (
            <li key={spot.id}>
              <Button
                variant="ghost"
                className={`w-full justify-start ${selectedSpot?.id === spot.id ? 'bg-secondary hover:bg-secondary/80' : ''}`}
                onClick={() => onSpotClick(spot)}
              >
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4" />
                  <span>{spot.name}</span>
                </div>
              </Button>
            </li>
          ))}
        </ul>
      </div>

      {selectedSpot && (
        <SpotDetails
          spot={selectedSpot}
          creatorUsername={creatorUsernames[selectedSpot.created_by] || 'Utilisateur'}
        />
      )}
    </div>
  );
};

interface SpotDetailsProps {
  spot: Spot;
  creatorUsername: string;
}

const SpotDetails = ({ spot, creatorUsername }: SpotDetailsProps) => {
  return (
    <Card className="bg-muted">
      <CardHeader>
        <CardTitle>{spot.name}</CardTitle>
        <CardDescription>
          Créé par {creatorUsername}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm">
        {spot.description ? (
          <p className="text-muted-foreground">{spot.description}</p>
        ) : (
          <p className="text-muted-foreground">Aucune description fournie.</p>
        )}
        <SpotMap spots={[spot]} selectedSpot={spot} onSpotClick={() => { }} />
      </CardContent>
    </Card>
  );
};

// Replace the MapContainer component with GoogleMap
const SpotMap = ({ spots, selectedSpot, onSpotClick }: SpotMapProps) => {
  const mapContainerStyle = {
    height: "300px",
    width: "100%"
  };
  
  const center = selectedSpot 
    ? { lat: selectedSpot.lat, lng: selectedSpot.lng }
    : { lat: 48.8566, lng: 2.3522 }; // Paris by default
  
  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={13}
      options={{
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false
      }}
    >
      {spots.map(spot => (
        <Marker
          key={spot.id}
          position={{ lat: spot.lat, lng: spot.lng }}
          icon={spotIcon}
          onClick={() => onSpotClick(spot)}
        >
          {selectedSpot && selectedSpot.id === spot.id && (
            <InfoWindow onCloseClick={() => onSpotClick(null)}>
              <div className="text-sm">
                <p className="font-bold">{spot.name}</p>
                {spot.description && <p className="text-xs">{spot.description}</p>}
              </div>
            </InfoWindow>
          )}
        </Marker>
      ))}
    </GoogleMap>
  );
};

export default CommunitySpots;
