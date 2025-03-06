
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/LanguageContext";

interface LocationRequestProps {
  onLocationGranted: (position: {lat: number, lng: number}) => void;
}

const LocationRequest: React.FC<LocationRequestProps> = ({ onLocationGranted }) => {
  const { toast } = useToast();
  const { translations } = useLanguage();
  
  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          onLocationGranted({ lat: latitude, lng: longitude });
          toast({
            title: translations.locationGranted || "Position partagée",
            description: translations.locationGrantedDesc || "Votre carte est maintenant centrée sur votre position.",
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({
            title: translations.locationDenied || "Accès à la position refusé",
            description: translations.locationDeniedDesc || "Nous ne pouvons pas vous montrer les voisins proches sans votre position.",
            variant: "destructive",
          });
        }
      );
    } else {
      toast({
        title: translations.locationNotSupported || "Géolocalisation non supportée",
        description: translations.locationNotSupportedDesc || "Votre navigateur ne supporte pas la géolocalisation.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="absolute inset-0 bg-black/50 z-[2000] flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md text-center">
        <h3 className="text-xl font-bold mb-2">{translations.shareLocation || "Partagez votre position"}</h3>
        <p className="mb-4 text-muted-foreground">
          {translations.shareLocationDesc || "Pour voir les voisins proches de vous, nous avons besoin de votre position."}
        </p>
        <button 
          onClick={requestLocation}
          className="bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
        >
          {translations.allowLocation || "Autoriser la géolocalisation"}
        </button>
      </div>
    </div>
  );
};

export default LocationRequest;
