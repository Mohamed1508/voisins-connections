
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface EventFormProps {
  onClose: () => void;
  onSubmit: (event: { name: string; date: string; time: string; lat: number; lng: number }) => void;
  defaultLocation: { lat: number; lng: number };
}

const EventForm = ({ onClose, onSubmit, defaultLocation }: EventFormProps) => {
  const [newEvent, setNewEvent] = useState({ 
    name: "", 
    date: "", 
    time: "", 
    lat: defaultLocation.lat, 
    lng: defaultLocation.lng 
  });
  
  const { translations } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(newEvent);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-4">{translations.createEvent}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">{translations.eventName}</label>
              <input 
                type="text" 
                required
                value={newEvent.name}
                onChange={(e) => setNewEvent({...newEvent, name: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">{translations.date}</label>
                <input 
                  type="date" 
                  required
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{translations.time}</label>
                <input 
                  type="time" 
                  required
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            <div className="text-xs text-muted-foreground">{translations.locationNote}</div>
            <div className="pt-2 flex justify-end gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
              >
                {translations.cancel}
              </Button>
              <Button type="submit">
                {translations.createEvent}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventForm;
