
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

interface RadiusFilterProps {
  radius: number;
  onRadiusChange: (value: number) => void;
  countryFilter: string | null;
  onCountryFilterChange: (country: string | null) => void;
  neighbors: Array<{
    id: number;
    country: {
      code: string;
      name: string;
    };
  }>;
  showEvents: boolean;
  onShowEventsChange: (show: boolean) => void;
  onAddEvent: () => void;
}

const RadiusFilter = ({
  radius,
  onRadiusChange,
  countryFilter,
  onCountryFilterChange,
  neighbors,
  showEvents,
  onShowEventsChange,
  onAddEvent
}: RadiusFilterProps) => {
  const { translations } = useLanguage();

  return (
    <div className="absolute bottom-4 left-4 right-4">
      <Card className="shadow-lg bg-background/90 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{translations.searchRadius}</span>
              <span className="text-sm font-medium">{radius} km</span>
            </div>
            <Slider
              value={[radius]}
              min={0.5}
              max={10}
              step={0.5}
              onValueChange={(value) => onRadiusChange(value[0])}
            />
            
            {/* Country filter */}
            <div className="flex flex-wrap gap-2 mt-3">
              <Button 
                size="sm" 
                variant={countryFilter === null ? "default" : "outline"}
                onClick={() => onCountryFilterChange(null)}
              >
                Tous
              </Button>
              {Array.from(new Set(neighbors.map(n => n.country.code))).map(code => {
                const country = neighbors.find(n => n.country.code === code)?.country;
                return (
                  <Button 
                    key={code}
                    size="sm" 
                    variant={countryFilter === code ? "default" : "outline"}
                    onClick={() => onCountryFilterChange(code)}
                  >
                    {country?.name}
                  </Button>
                );
              })}
            </div>
            
            {/* Event controls */}
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-1">
                <input 
                  type="checkbox" 
                  id="show-events" 
                  checked={showEvents} 
                  onChange={(e) => onShowEventsChange(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="show-events" className="text-sm">
                  Afficher les événements
                </label>
              </div>
              <Button size="sm" onClick={onAddEvent}>
                Nouvel événement
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RadiusFilter;
