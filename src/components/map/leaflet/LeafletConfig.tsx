
import { MapPinIcon, Users, Tent, Utensils, Car } from "lucide-react";

// Custom markers for different entity types
export const DefaultIcon = {
  url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
  scaledSize: { width: 32, height: 32 }
};

export const spotIcon = {
  url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
  scaledSize: { width: 32, height: 32 }
};

export const eventIcon = {
  url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
  scaledSize: { width: 32, height: 32 }
};

export const groupIcon = {
  url: "https://maps.google.com/mapfiles/ms/icons/purple-dot.png",
  scaledSize: { width: 32, height: 32 }
};

export const rideIcon = {
  url: "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
  scaledSize: { width: 32, height: 32 }
};

export const mapStyles = [
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [{ visibility: "off" }]
  }
];
