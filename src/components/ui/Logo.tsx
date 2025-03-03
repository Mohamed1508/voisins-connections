
import { MapPin } from "lucide-react";

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
}

const Logo = ({ className = "", iconOnly = false }: LogoProps) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
          <MapPin size={18} className="animate-pulse-slow" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-background border-2 border-primary rounded-full"></div>
      </div>
      {!iconOnly && (
        <div className="font-semibold text-xl tracking-tight">
          <span className="text-foreground">Voisins</span>
          <span className="text-primary">Proches</span>
        </div>
      )}
    </div>
  );
};

export default Logo;
