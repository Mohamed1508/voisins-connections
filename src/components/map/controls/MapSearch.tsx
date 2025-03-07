
import React, { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Autocomplete } from "@react-google-maps/api";

interface MapSearchProps {
  onPlaceSelected?: (location: {lat: number, lng: number}) => void;
}

const MapSearch: React.FC<MapSearchProps> = ({ onPlaceSelected }) => {
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  
  const onLoad = (autocompleteInstance: google.maps.places.Autocomplete) => {
    setAutocomplete(autocompleteInstance);
  };

  const onPlaceChange = () => {
    if (autocomplete !== null && onPlaceSelected) {
      const place = autocomplete.getPlace();
      if (place.geometry?.location) {
        onPlaceSelected({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        });
      }
    }
  };
  
  return (
    <div className="absolute top-2 left-2 right-2 z-[1000] bg-white rounded-md shadow-md">
      <div className="flex items-center p-2">
        <Autocomplete
          onLoad={onLoad}
          onPlaceChanged={onPlaceChange}
          restrictions={{ country: 'fr' }}
        >
          <div className="flex items-center w-full">
            <Input
              type="text"
              placeholder="Rechercher un lieu..."
              className="flex-1"
            />
            <div className="ml-2 bg-primary text-white p-2 rounded-md">
              <Search size={18} />
            </div>
          </div>
        </Autocomplete>
      </div>
    </div>
  );
};

export default MapSearch;
