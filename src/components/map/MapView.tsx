
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Circle, Popup, useMap } from "react-leaflet";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/LanguageContext";
import { Flag, Calendar } from "lucide-react";
import { DefaultIcon, eventIcon } from "./leaflet/LeafletConfig";
import { userLocation, neighbors, events } from "./data/mockData";
import MapController from "./MapController";
import MapControls from "./MapControls";
import CountrySearch from "./CountrySearch";
import RadiusFilter from "./RadiusFilter";
import NeighborCard from "./NeighborCard";
import EventForm from "./EventForm";

interface MapViewProps {
  className?: string;
  previewMode?: boolean;
}

const MapView = ({ className = "", previewMode = false }: MapViewProps) => {
  const [radius, setRadius] = useState(1);
  const [mapCenter, setMapCenter] = useState<[number, number]>([userLocation.lat, userLocation.lng]);
  const [zoom, setZoom] = useState(13);
  const [selectedNeighbor, setSelectedNeighbor] = useState<typeof neighbors[0] | null>(null);
  const [countryFilter, setCountryFilter] = useState<string | null>(null);
  const [showEvents, setShowEvents] = useState(true);
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState({ name: "", date: "", time: "", lat: 0, lng: 0 });
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

  const handleAddEvent = () => {
    setNewEvent({
      ...newEvent,
      lat: userLocation.lat,
      lng: userLocation.lng
    });
    setShowEventForm(true);
  };

  const handleSubmitEvent = (eventData: { name: string; date: string; time: string; lat: number; lng: number }) => {
    toast({
      title: "Événement créé",
      description: `Votre événement "${eventData.name}" a été ajouté à la carte.`,
    });
    // Here we would normally save to Supabase
    setShowEventForm(false);
    setNewEvent({ name: "", date: "", time: "", lat: 0, lng: 0 });
  };

  // Filter neighbors by country if filter is active
  const filteredNeighbors = countryFilter 
    ? neighbors.filter(n => n.country.code === countryFilter)
    : neighbors;

  return (
    <div className={`relative w-full rounded-xl overflow-hidden ${className}`}>
      {/* Carte Leaflet */}
      <div className="w-full h-full min-h-[300px]">
        <MapContainer 
          style={{ height: "100%", width: "100%", borderRadius: "0.75rem" }}
          center={mapCenter}
          zoom={zoom}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          <MapController center={mapCenter} zoom={zoom} />
          
          {/* Position de l'utilisateur */}
          <Marker position={[userLocation.lat, userLocation.lng]}>
            <Popup>Votre position</Popup>
          </Marker>
          
          {/* Cercle de rayon */}
          <Circle 
            center={[userLocation.lat, userLocation.lng]} 
            pathOptions={{ fillColor: 'blue', fillOpacity: 0.1, color: 'blue', weight: 1 }}
            radius={radius * 1000}
          />
          
          {/* Marqueurs des voisins */}
          {filteredNeighbors.map((neighbor) => (
            <Marker 
              key={neighbor.id}
              position={[neighbor.lat, neighbor.lng]}
              eventHandlers={{
                click: () => handleNeighborClick(neighbor),
              }}
            >
              <Popup>
                <div className="p-1">
                  <h3 className="font-bold">{neighbor.name}</h3>
                  <p className="text-sm">
                    <span className="inline-flex items-center gap-1">
                      <Flag size={12} className="text-muted-foreground" />
                      {neighbor.country.name}
                    </span>
                  </p>
                  <p className="text-xs mt-1">à {neighbor.distance} km</p>
                </div>
              </Popup>
            </Marker>
          ))}
          
          {/* Marqueurs des événements */}
          {showEvents && events.map((event) => (
            <Marker 
              key={`event-${event.id}`}
              position={[event.lat, event.lng]}
            >
              <Popup>
                <div className="p-1">
                  <h3 className="font-bold">{event.name}</h3>
                  <p className="text-xs mt-1">
                    <Calendar size={12} className="inline mr-1" />
                    {event.date} à {event.time}
                  </p>
                  <p className="text-xs mt-1">Organisé par: {event.createdBy}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      
      {/* UI Components */}
      <CountrySearch onSearch={handleCountrySearch} />
      <MapControls 
        onLocate={handleLocate}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
      />
      <RadiusFilter 
        radius={radius}
        onRadiusChange={setRadius}
        countryFilter={countryFilter}
        onCountryFilterChange={setCountryFilter}
        neighbors={neighbors}
        showEvents={showEvents}
        onShowEventsChange={setShowEvents}
        onAddEvent={handleAddEvent}
      />
      
      {/* Selected neighbor card */}
      {selectedNeighbor && (
        <NeighborCard 
          neighbor={selectedNeighbor} 
          onClose={() => setSelectedNeighbor(null)} 
        />
      )}
      
      {/* Event Form Dialog */}
      {showEventForm && (
        <EventForm 
          onClose={() => setShowEventForm(false)}
          onSubmit={handleSubmitEvent}
          defaultLocation={userLocation}
        />
      )}
    </div>
  );
};

export default MapView;
