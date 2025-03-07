
import React, { useRef, useState } from "react";
import { GoogleMap, Circle } from "@react-google-maps/api";
import { DefaultIcon, mapStyles } from "../leaflet/LeafletConfig";
import NeighborMarker from "../markers/NeighborMarker";
import RideMarker from "../markers/RideMarker";
import MapSearch from "../controls/MapSearch";
import AnimatedDemo from "./AnimatedDemo";
import { kmToMeters } from "../utils/mapUtils";
import { BaseMapProps } from "../types/MapViewTypes";

const parisPosition = { lat: 48.8566, lng: 2.3522 };
const mapContainerStyle = {
  height: "100%",
  width: "100%",
  borderRadius: "0.5rem"
};

interface PreviewMapProps extends BaseMapProps {
  withSearchBar?: boolean;
}

const PreviewMap: React.FC<PreviewMapProps> = ({ withSearchBar = false }) => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState(parisPosition);

  const onMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
  };

  const onPlaceSelected = (location: {lat: number, lng: number}) => {
    setMapCenter(location);
    mapRef.current?.panTo(location);
  };

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={mapCenter}
      zoom={13}
      onLoad={onMapLoad}
      options={{
        styles: mapStyles,
        disableDefaultUI: true,
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false
      }}
    >
      <Circle
        center={parisPosition}
        options={{
          fillColor: "#3b82f6",
          fillOpacity: 0.1,
          strokeColor: "#3b82f6",
          strokeWeight: 1,
          radius: kmToMeters(0.5)
        }}
      />
      
      <NeighborMarker 
        neighbor={{
          id: 1,
          name: "Mohamed",
          lat: 48.8566, 
          lng: 2.3522,
          distance: 0.2,
          origin_country: "Maroc",
          languages: ["français", "arabe"],
          interests: ["cuisine", "jardinage"],
          bio: "Bonjour! Je suis nouveau dans le quartier."
        }}
        detailed={true}
        selected={selectedMarker === "neighbor-1"}
        onClick={() => setSelectedMarker(selectedMarker === "neighbor-1" ? null : "neighbor-1")}
        onClose={() => setSelectedMarker(null)}
      />
      
      <NeighborMarker 
        neighbor={{
          id: 2,
          name: "Fatma",
          lat: 48.8606, 
          lng: 2.3376,
          distance: 1.2,
          origin_country: "Tunisie",
          languages: ["français", "arabe", "anglais", "espagnol"],
          interests: ["sport", "lecture"],
          bio: "Heureuse de rencontrer mes voisins!"
        }}
        detailed={true}
        selected={selectedMarker === "neighbor-2"}
        onClick={() => setSelectedMarker(selectedMarker === "neighbor-2" ? null : "neighbor-2")}
        onClose={() => setSelectedMarker(null)}
      />
      
      <RideMarker 
        ride={{
          id: "1",
          name: "Trajet centre-ville",
          departure: "Saint-Denis",
          arrival: "Paris Centre",
          date: "2024-03-15",
          time: "09:00",
          available_seats: 3,
          lat: 48.8486,
          lng: 2.3465
        }}
        selected={selectedMarker === "ride-1"}
        onClick={() => setSelectedMarker(selectedMarker === "ride-1" ? null : "ride-1")}
        onClose={() => setSelectedMarker(null)}
      />
      
      {withSearchBar && <MapSearch onPlaceSelected={onPlaceSelected} />}
      <AnimatedDemo />
    </GoogleMap>
  );
};

export default PreviewMap;
