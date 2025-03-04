
import React from "react";
import { MapPin, Globe } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useLanguage } from "@/context/LanguageContext";
import { Link } from "react-router-dom";

const Header = () => {
  const { language, setLanguage, translations } = useLanguage();

  return (
    <header className="py-4 px-6 bg-background border-b border-border flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2">
        <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
          <MapPin className="h-6 w-6" />
        </div>
        <div className="font-semibold text-xl">Voisins Proches</div>
      </Link>

      <Select value={language} onValueChange={setLanguage}>
        <SelectTrigger className="w-[120px]">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <SelectValue placeholder={translations.selectLanguage} />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="fr">Français</SelectItem>
          <SelectItem value="en">English</SelectItem>
          <SelectItem value="ar">العربية</SelectItem>
        </SelectContent>
      </Select>
    </header>
  );
};

export default Header;
