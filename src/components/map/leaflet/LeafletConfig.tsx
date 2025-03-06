
import L from "leaflet";

// Get base URL for Leaflet icons
const getIconUrl = (iconName: string) => {
  // Base URL for Leaflet icons
  return `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/${iconName}`;
};

// Default icon (blue marker)
export const DefaultIcon = L.icon({
  iconUrl: getIconUrl('marker-icon-2x-blue.png'),
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Icon for events (red marker)
export const eventIcon = L.icon({
  iconUrl: getIconUrl('marker-icon-2x-red.png'),
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Icon for community spots (green marker)
export const spotIcon = L.icon({
  iconUrl: getIconUrl('marker-icon-2x-green.png'),
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Icon for groups (violet marker)
export const groupIcon = L.icon({
  iconUrl: getIconUrl('marker-icon-2x-violet.png'),
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Icon for carpooling/rides (orange marker)
export const rideIcon = L.icon({
  iconUrl: getIconUrl('marker-icon-2x-orange.png'),
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
