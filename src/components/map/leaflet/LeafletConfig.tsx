
import L from "leaflet";

// Déterminer l'URL de base pour les icônes Leaflet
const getIconUrl = (iconName: string) => {
  // URL de base pour les icônes Leaflet
  return `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/${iconName}`;
};

// Icône par défaut (marker bleu)
export const DefaultIcon = L.icon({
  iconUrl: getIconUrl('marker-icon-2x-blue.png'),
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Icône pour les événements (marker rouge)
export const eventIcon = L.icon({
  iconUrl: getIconUrl('marker-icon-2x-red.png'),
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Icône pour les lieux communautaires (marker vert)
export const spotIcon = L.icon({
  iconUrl: getIconUrl('marker-icon-2x-green.png'),
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Icône pour les groupes (marker violet)
export const groupIcon = L.icon({
  iconUrl: getIconUrl('marker-icon-2x-violet.png'),
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
