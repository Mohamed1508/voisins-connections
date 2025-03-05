
import React from "react";
import { cn } from "@/lib/utils";
import { MapPin } from "lucide-react";

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

const Logo = ({ className, ...props }: LogoProps) => {
  return (
    <div className={cn("h-10 w-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground", className)}>
      <MapPin className="h-6 w-6" />
    </div>
  );
};

export default Logo;
