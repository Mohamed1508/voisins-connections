
import React from "react";
import { Marker, InfoWindow } from "@react-google-maps/api";
import { rideIcon } from "../leaflet/LeafletConfig";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, ArrowRightLeft, Users } from "lucide-react";

interface RideType {
  id: string;
  name: string;
  departure: string;
  arrival: string;
  date: string;
  time: string;
  available_seats: number;
  lat: number;
  lng: number;
  created_by?: string;
  created_at?: string;
}

interface RideMarkerProps {
  ride: RideType;
  selected?: boolean;
  onClick?: (ride: RideType) => void;
  onClose?: () => void;
}

const RideMarker: React.FC<RideMarkerProps> = ({ 
  ride, 
  selected = false,
  onClick,
  onClose
}) => {
  const handleClick = () => {
    if (onClick) onClick(ride);
  };

  return (
    <Marker
      position={{ lat: ride.lat, lng: ride.lng }}
      icon={{
        url: rideIcon.url,
        scaledSize: new google.maps.Size(32, 32)
      }}
      onClick={handleClick}
    >
      {selected && (
        <InfoWindow onCloseClick={onClose}>
          <div className="max-w-[300px]">
            <Card className="border-0 shadow-none">
              <CardHeader className="p-3 pb-2">
                <CardTitle className="text-base">{ride.name}</CardTitle>
                <CardDescription className="text-xs flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {new Date(ride.date).toLocaleDateString()}
                  <Clock className="h-3 w-3 ml-2 mr-1" />
                  {ride.time}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 pt-0 pb-2">
                <div className="text-sm space-y-1">
                  <div className="flex items-center">
                    <ArrowRightLeft className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>
                      <strong>{ride.departure}</strong> → <strong>{ride.arrival}</strong>
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{ride.available_seats} siège(s) disponible(s)</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-3 pt-0">
                <Button size="sm" className="w-full">Contacter</Button>
              </CardFooter>
            </Card>
          </div>
        </InfoWindow>
      )}
    </Marker>
  );
};

export default RideMarker;
