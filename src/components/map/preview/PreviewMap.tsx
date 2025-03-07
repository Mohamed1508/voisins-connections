
import React, { useRef, useState } from "react";
import LeafletMap from "../LeafletMap";
import { DefaultIcon, ICON_SIZE } from "../leaflet/LeafletConfig";
import NeighborMarker from "../markers/NeighborMarker";
import RideMarker from "../markers/RideMarker";
import MapSearch from "../controls/MapSearch";
import AnimatedDemo from "./AnimatedDemo";
import { kmToMeters } from "../utils/mapUtils";
import { BaseMapProps } from "../types/MapViewTypes";
import PopupPortal from "../PopupPortal";

const parisPosition: [number, number] = [48.8566, 2.3522];

interface PreviewMapProps extends BaseMapProps {
  withSearchBar?: boolean;
}

const PreviewMap: React.FC<PreviewMapProps> = ({ withSearchBar = false }) => {
  const mapRef = useRef<any>(null);
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>(parisPosition);

  const onMapLoad = (map: any) => {
    mapRef.current = map;
  };

  const onPlaceSelected = (location: {lat: number, lng: number}) => {
    setMapCenter([location.lat, location.lng]);
    mapRef.current?.setView([location.lat, location.lng], 13);
  };

  const markers = [
    {
      id: "neighbor-1",
      type: 'user' as const,
      position: [48.8566, 2.3522] as [number, number],
      onClick: () => setSelectedMarker(selectedMarker === "neighbor-1" ? null : "neighbor-1")
    },
    {
      id: "neighbor-2",
      type: 'user' as const,
      position: [48.8606, 2.3376] as [number, number],
      onClick: () => setSelectedMarker(selectedMarker === "neighbor-2" ? null : "neighbor-2")
    },
    {
      id: "ride-1",
      type: 'ride' as const,
      position: [48.8486, 2.3465] as [number, number],
      onClick: () => setSelectedMarker(selectedMarker === "ride-1" ? null : "ride-1")
    }
  ];

  return (
    <>
      <LeafletMap
        center={mapCenter}
        markers={markers}
        circle={{
          center: parisPosition,
          radius: kmToMeters(0.5)
        }}
        onMapReady={onMapLoad}
      >
        {/* Popup contents via portal */}
        {selectedMarker === "neighbor-1" && (
          <PopupPortal markerId="neighbor-1">
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
              selected={true}
            />
          </PopupPortal>
        )}
        
        {selectedMarker === "neighbor-2" && (
          <PopupPortal markerId="neighbor-2">
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
              selected={true}
            />
          </PopupPortal>
        )}
        
        {selectedMarker === "ride-1" && (
          <PopupPortal markerId="ride-1">
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
              selected={true}
            />
          </PopupPortal>
        )}
      </LeafletMap>
      
      {withSearchBar && <MapSearch onPlaceSelected={onPlaceSelected} />}
      <AnimatedDemo />
    </>
  );
};

export default PreviewMap;
