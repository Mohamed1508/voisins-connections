
import React, { useState } from "react";
import { useMap } from "react-leaflet";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const MapSearch: React.FC = () => {
  const [search, setSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const map = useMap();
  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(search)}`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        map.flyTo([parseFloat(lat), parseFloat(lon)], 13);
      }
    } catch (error) {
      console.error("Error searching location:", error);
    } finally {
      setIsSearching(false);
    }
  };
  
  return (
    <div className="absolute top-2 left-2 right-2 z-[1000] bg-white rounded-md shadow-md">
      <form onSubmit={handleSearch} className="flex items-center p-2">
        <Input
          type="text"
          placeholder="Search location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
        <button 
          type="submit" 
          className="ml-2 bg-primary text-white p-2 rounded-md"
          disabled={isSearching}
        >
          <Search size={18} />
        </button>
      </form>
    </div>
  );
};

export default MapSearch;
