
export interface BaseMapProps {
  withSearchBar?: boolean;
}

export interface NeighborType {
  id: number;
  name: string;
  lat: number;
  lng: number;
  distance: number;
  country?: { 
    code: string; 
    name: string; 
  };
  origin_country?: string;
  languages?: string[];
  interests?: string[];
  bio?: string;
}

export interface EventType {
  id: number;
  name: string;
  date: string;
  time: string;
  lat: number;
  lng: number;
  createdBy: string;
}

export interface SpotType {
  id: string;
  name: string;
  lat: number;
  lng: number;
  createdBy: string;
}

export interface GroupType {
  id: string;
  name: string;
  lat: number;
  lng: number;
  description?: string;
}

export interface RideType {
  id: string;
  name: string;
  departure: string;
  arrival: string;
  date: string;
  time: string;
  available_seats: number;
  lat: number;
  lng: number;
  createdBy?: string;
}

export interface MapViewProps {
  userLocation: { lat: number; lng: number };
  neighbors: NeighborType[];
  events: EventType[];
  spots?: SpotType[];
  groups?: GroupType[];
  rides?: RideType[];
  searchRadius?: number;
  onEventClick?: (event: any) => void;
  onSpotClick?: (spot: any) => void;
  onGroupClick?: (group: any) => void;
  onRideClick?: (ride: any) => void;
  previewMode?: boolean;
  withSearchBar?: boolean;
  askLocation?: boolean;
}
