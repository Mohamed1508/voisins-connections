
import { MapPinIcon, Users, Tent, Utensils, Car } from "lucide-react";

// Constants for marker size
export const ICON_SIZE = 32;

// Custom marker paths
export const DEFAULT_MARKER = '/map-markers/blue-marker.png';
export const SPOT_MARKER = '/map-markers/green-marker.png';
export const EVENT_MARKER = '/map-markers/red-marker.png';
export const GROUP_MARKER = '/map-markers/purple-marker.png';
export const RIDE_MARKER = '/map-markers/yellow-marker.png';

// Icons for different entity types that will be used with Leaflet
export const DefaultIcon = {
  url: DEFAULT_MARKER,
  iconSize: [ICON_SIZE, ICON_SIZE]
};

export const spotIcon = {
  url: SPOT_MARKER,
  iconSize: [ICON_SIZE, ICON_SIZE]
};

export const eventIcon = {
  url: EVENT_MARKER,
  iconSize: [ICON_SIZE, ICON_SIZE]
};

export const groupIcon = {
  url: GROUP_MARKER,
  iconSize: [ICON_SIZE, ICON_SIZE]
};

export const rideIcon = {
  url: RIDE_MARKER,
  iconSize: [ICON_SIZE, ICON_SIZE]
};

// Create Leaflet icon instances
export const createLeafletIcon = (iconConfig: { url: string, iconSize: number[] }) => {
  if (typeof window !== 'undefined' && window.L) {
    return window.L.icon({
      iconUrl: iconConfig.url,
      iconSize: iconConfig.iconSize,
      iconAnchor: [iconConfig.iconSize[0] / 2, iconConfig.iconSize[1]],
      popupAnchor: [0, -iconConfig.iconSize[1]]
    });
  }
  return null;
};
