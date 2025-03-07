
interface LeafletMapOptions {
  center?: [number, number];
  zoom?: number;
  minZoom?: number;
  maxZoom?: number;
  layers?: any[];
  maxBounds?: any;
  renderer?: any;
  zoomAnimation?: boolean;
  zoomControl?: boolean;
  attributionControl?: boolean;
  closePopupOnClick?: boolean;
  [key: string]: any;
}

interface LeafletMarkerOptions {
  icon?: any;
  draggable?: boolean;
  autoPan?: boolean;
  title?: string;
  alt?: string;
  opacity?: number;
  [key: string]: any;
}

interface LeafletIconOptions {
  iconUrl: string;
  iconSize?: [number, number];
  iconAnchor?: [number, number];
  popupAnchor?: [number, number];
  shadowUrl?: string;
  shadowSize?: [number, number];
  shadowAnchor?: [number, number];
  className?: string;
}

interface LeafletTileLayerOptions {
  attribution?: string;
  maxZoom?: number;
  minZoom?: number;
  id?: string;
  accessToken?: string;
  [key: string]: any;
}

interface LeafletCircleOptions {
  color?: string;
  fillColor?: string;
  fillOpacity?: number;
  radius?: number;
  weight?: number;
  [key: string]: any;
}

interface LeafletPopupOptions {
  closeButton?: boolean;
  autoClose?: boolean;
  className?: string;
  maxWidth?: number;
  minWidth?: number;
  [key: string]: any;
}

interface Window {
  L: {
    map: (element: HTMLElement, options?: LeafletMapOptions) => any;
    tileLayer: (urlTemplate: string, options?: LeafletTileLayerOptions) => any;
    marker: (latlng: [number, number], options?: LeafletMarkerOptions) => any;
    icon: (options: LeafletIconOptions) => any;
    circle: (latlng: [number, number], options?: LeafletCircleOptions) => any;
    popup: (options?: LeafletPopupOptions) => any;
    layerGroup: (layers?: any[]) => any;
  };
}
