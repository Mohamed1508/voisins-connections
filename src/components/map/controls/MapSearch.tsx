
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface MapSearchProps {
  onPlaceSelected: (location: { lat: number, lng: number }) => void;
}

const MapSearch: React.FC<MapSearchProps> = ({ onPlaceSelected }) => {
  const [searchValue, setSearchValue] = useState("");
  const { translations } = useLanguage();
  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchValue.trim()) return;
    
    try {
      // Use OpenStreetMap's Nominatim API for geocoding
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchValue)}`);
      const data = await response.json();
      
      if (data && data.length > 0) {
        const location = {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        };
        onPlaceSelected(location);
      }
    } catch (error) {
      console.error("Error searching location:", error);
    }
  };
  
  return (
    <form 
      onSubmit={handleSearch}
      className="absolute top-4 left-0 right-0 mx-auto w-[90%] max-w-md z-10 bg-white rounded-md shadow-md flex items-center"
    >
      <Input
        type="text"
        placeholder={translations.searchPlaceholder || "Rechercher un lieu..."}
        className="flex-grow border-none rounded-r-none focus-visible:ring-0"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      <Button 
        type="submit" 
        variant="ghost" 
        className="rounded-l-none"
      >
        <Search className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default MapSearch;
