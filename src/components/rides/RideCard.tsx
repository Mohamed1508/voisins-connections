
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, User } from "lucide-react";
import { Link } from "react-router-dom";
import { RideType } from "@/types/RideType";
import { useLanguage } from "@/context/LanguageContext";

interface RideCardProps {
  ride: RideType;
  creatorInfo?: {
    username?: string;
    avatar_url?: string;
    email?: string;
  };
  onJoinRide?: (rideId: string) => void;
  isJoining?: boolean;
}

const RideCard: React.FC<RideCardProps> = ({ 
  ride, 
  creatorInfo, 
  onJoinRide,
  isJoining
}) => {
  const { translations } = useLanguage();
  const availableSeats = ride.available_seats || 0;
  
  const formatDate = (dateString: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = { 
        day: '2-digit', 
        month: 'long', 
        year: 'numeric' 
      };
      return new Date(dateString).toLocaleDateString('fr-FR', options);
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{ride.name}</CardTitle>
            <CardDescription className="mt-1 flex items-center">
              <User className="mr-1 h-3.5 w-3.5" />
              {creatorInfo ? (
                <Link to={`/profile/${ride.created_by}`} className="hover:underline">
                  {creatorInfo.username || creatorInfo.email || 'Utilisateur'}
                </Link>
              ) : (
                'Utilisateur'
              )}
            </CardDescription>
          </div>
          {creatorInfo?.avatar_url && (
            <Avatar className="h-10 w-10">
              <AvatarImage src={creatorInfo.avatar_url} alt={creatorInfo.username || 'User'} />
              <AvatarFallback>{(creatorInfo.username || 'U').substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          )}
        </div>
      </CardHeader>
      <CardContent className="py-2 flex-grow">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{formatDate(ride.date)}</span>
            <Clock className="h-4 w-4 text-muted-foreground ml-2" />
            <span>{ride.time}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-secondary/50 rounded-md p-2">
              <p className="text-xs text-muted-foreground mb-1">Départ</p>
              <p className="text-sm font-medium flex items-center">
                <MapPin className="h-3.5 w-3.5 mr-1 text-primary" />
                {ride.departure}
              </p>
            </div>
            <div className="bg-secondary/50 rounded-md p-2">
              <p className="text-xs text-muted-foreground mb-1">Arrivée</p>
              <p className="text-sm font-medium flex items-center">
                <MapPin className="h-3.5 w-3.5 mr-1 text-primary" />
                {ride.arrival}
              </p>
            </div>
          </div>
          
          <div className="mt-2">
            <Badge variant={availableSeats > 0 ? "outline" : "secondary"} className="flex items-center gap-1">
              <User className="h-3.5 w-3.5" />
              {availableSeats} place{availableSeats > 1 ? 's' : ''} disponible{availableSeats > 1 ? 's' : ''}
            </Badge>
          </div>
        </div>
      </CardContent>
      
      {onJoinRide && (
        <CardFooter className="pt-2 pb-4">
          <Button 
            onClick={() => onJoinRide(ride.id)} 
            disabled={availableSeats === 0 || isJoining}
            className="w-full"
            variant={availableSeats > 0 ? "default" : "secondary"}
          >
            {availableSeats > 0 ? (
              isJoining ? "Réservation..." : "Réserver une place"
            ) : (
              "Complet"
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default RideCard;
