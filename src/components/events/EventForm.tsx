
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/LanguageContext";

export interface EventFormProps {
  onSubmit: (event: Event) => void;
  onCancel: () => void;
  userLocation: { lat: number; lng: number };
}

export interface Event {
  id?: number;
  name: string;
  date: string;
  time: string;
  lat: number;
  lng: number;
  description?: string;
  createdBy?: string;
}

const EventForm = ({ onSubmit, onCancel, userLocation }: EventFormProps) => {
  const [event, setEvent] = useState<Event>({
    name: "",
    date: "",
    time: "",
    description: "",
    lat: userLocation.lat,
    lng: userLocation.lng
  });
  
  const { toast } = useToast();
  const { translations } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!event.name || !event.date || !event.time) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }
    
    onSubmit(event);
    
    // Reset form after submission
    setEvent({
      name: "",
      date: "",
      time: "",
      description: "",
      lat: userLocation.lat,
      lng: userLocation.lng
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-4">{translations.createEvent || "Créer un nouvel événement"}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">{translations.eventName || "Nom de l'événement"}</label>
              <input 
                type="text" 
                required
                value={event.name}
                onChange={(e) => setEvent({...event, name: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">{translations.date || "Date"}</label>
                <input 
                  type="date" 
                  required
                  value={event.date}
                  onChange={(e) => setEvent({...event, date: e.target.value})}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{translations.time || "Heure"}</label>
                <input 
                  type="time" 
                  required
                  value={event.time}
                  onChange={(e) => setEvent({...event, time: e.target.value})}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">{translations.description || "Description"}</label>
              <textarea 
                value={event.description}
                onChange={(e) => setEvent({...event, description: e.target.value})}
                className="w-full p-2 border rounded min-h-[80px]"
              />
            </div>
            
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin size={16} className="mr-1" />
              <span>{translations.locationNote || "L'événement sera créé à votre position actuelle"}</span>
            </div>
            
            <div className="pt-2 flex justify-end gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
              >
                {translations.cancel || "Annuler"}
              </Button>
              <Button type="submit">
                {translations.createEvent || "Créer l'événement"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventForm;
