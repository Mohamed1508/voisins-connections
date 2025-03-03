
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, MapPin, Flag, MessageCircle } from "lucide-react";

interface ProfileCardProps {
  isOwnProfile?: boolean;
  avatarUrl?: string;
  name: string;
  bio?: string;
  distance?: number;
  country?: {
    code: string;
    name: string;
  };
  isOnline?: boolean;
  onMessageClick?: () => void;
  onEditClick?: () => void;
}

const ProfileCard = ({
  isOwnProfile = false,
  avatarUrl,
  name,
  bio,
  distance,
  country,
  isOnline = false,
  onMessageClick,
  onEditClick,
}: ProfileCardProps) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <Card className="w-full overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="p-0">
        <div className="h-24 bg-gradient-to-r from-primary/20 to-primary/40 flex items-end justify-end">
          {isOwnProfile && (
            <Button
              variant="ghost"
              size="icon"
              className="m-2 bg-background/80 backdrop-blur-sm"
              onClick={onEditClick}
            >
              <Edit size={16} />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0 -mt-12">
        <div className="flex flex-col items-center">
          <Avatar className="h-24 w-24 border-4 border-background shadow-md">
            <AvatarImage 
              src={avatarUrl} 
              alt={name} 
              className={`${isImageLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
              onLoad={() => setIsImageLoaded(true)}
            />
            <AvatarFallback className="text-xl">
              {name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="mt-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <h3 className="text-xl font-semibold">{name}</h3>
              {isOnline && (
                <span className="h-2.5 w-2.5 rounded-full bg-green-500 shadow-sm"></span>
              )}
            </div>
            
            <div className="flex items-center justify-center gap-1.5 mt-1.5 text-sm text-muted-foreground">
              {distance !== undefined && (
                <div className="flex items-center gap-1">
                  <MapPin size={14} />
                  <span>{distance < 1 ? `${distance * 1000}m` : `${distance.toFixed(1)}km`}</span>
                </div>
              )}
              
              {country && (
                <>
                  {distance !== undefined && <span className="mx-1">•</span>}
                  <div className="flex items-center gap-1">
                    <Flag size={14} />
                    <span>{country.name}</span>
                  </div>
                </>
              )}
            </div>
            
            {bio && (
              <p className="mt-3 text-sm text-muted-foreground">
                {bio}
              </p>
            )}
          </div>
        </div>
      </CardContent>
      {!isOwnProfile && (
        <CardFooter className="p-4 pt-0 flex justify-center">
          <Button onClick={onMessageClick} className="w-full gap-2">
            <MessageCircle size={16} />
            <span>Envoyer un message</span>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ProfileCard;
