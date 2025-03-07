
import React, { useEffect, useRef } from 'react';
import { createLeafletIcon, DefaultIcon, spotIcon, eventIcon, groupIcon, rideIcon } from './leaflet/LeafletConfig';
import { kmToMeters } from './utils/mapUtils';

interface LeafletMapProps {
  center: [number, number];
  zoom?: number;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (latlng: { lat: number, lng: number }) => void;
  markers?: Array<{
    id: string | number;
    type: 'user' | 'event' | 'spot' | 'group' | 'ride';
    position: [number, number];
    popupContent?: React.ReactNode;
    onClick?: () => void;
  }>;
  circle?: {
    center: [number, number];
    radius: number;
  };
  onMapReady?: (map: any) => void;
  children?: React.ReactNode;
}

const LeafletMap: React.FC<LeafletMapProps> = ({
  center,
  zoom = 13,
  className,
  style,
  onClick,
  markers = [],
  circle,
  onMapReady,
  children
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    if (!mapContainerRef.current || typeof window === 'undefined' || !window.L) return;

    // Initialize map if not already initialized
    if (!mapInstanceRef.current) {
      const map = window.L.map(mapContainerRef.current).setView(center, zoom);
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Add click handler
      if (onClick) {
        map.on('click', (e: any) => {
          onClick({ lat: e.latlng.lat, lng: e.latlng.lng });
        });
      }

      mapInstanceRef.current = map;
      if (onMapReady) onMapReady(map);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update map center and zoom when props change
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(center, zoom);
    }
  }, [center, zoom]);

  // Handle markers
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear previous markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    markers.forEach(marker => {
      let icon;
      switch (marker.type) {
        case 'user':
          icon = createLeafletIcon(DefaultIcon);
          break;
        case 'event':
          icon = createLeafletIcon(eventIcon);
          break;
        case 'spot':
          icon = createLeafletIcon(spotIcon);
          break;
        case 'group':
          icon = createLeafletIcon(groupIcon);
          break;
        case 'ride':
          icon = createLeafletIcon(rideIcon);
          break;
        default:
          icon = createLeafletIcon(DefaultIcon);
      }

      const leafletMarker = window.L.marker(marker.position, { icon }).addTo(mapInstanceRef.current);
      
      if (marker.onClick) {
        leafletMarker.on('click', marker.onClick);
      }
      
      if (marker.popupContent) {
        const popupContainer = document.createElement('div');
        popupContainer.className = 'leaflet-popup-content-wrapper';
        popupContainer.style.padding = '0';
        popupContainer.style.overflow = 'hidden';
        popupContainer.style.borderRadius = '8px';

        const popup = window.L.popup({
          closeButton: true,
          className: 'custom-popup',
          maxWidth: 300
        });

        popup.setContent(popupContainer);
        leafletMarker.bindPopup(popup);

        leafletMarker.on('click', () => {
          if (marker.popupContent && popupContainer) {
            // Clear existing content
            while (popupContainer.firstChild) {
              popupContainer.removeChild(popupContainer.firstChild);
            }

            if (typeof marker.popupContent === 'string') {
              popupContainer.innerHTML = marker.popupContent;
            } else if (marker.popupContent) {
              // React render will happen via the PopupPortal component
              popupContainer.setAttribute('data-marker-id', marker.id.toString());
            }
          }
        });
      }

      markersRef.current.push(leafletMarker);
    });

    // Add circle if provided
    if (circle) {
      const circleInstance = window.L.circle(circle.center, {
        color: '#3b82f6',
        fillColor: '#3b82f6',
        fillOpacity: 0.1,
        radius: circle.radius,
        weight: 1
      }).addTo(mapInstanceRef.current);
      markersRef.current.push(circleInstance);
    }
  }, [markers, circle]);

  return (
    <div 
      ref={mapContainerRef} 
      className={className || 'w-full h-full'} 
      style={style || { height: '500px', width: '100%', borderRadius: '0.5rem' }}
    >
      {/* React portals for popups will be rendered here */}
      {children}
    </div>
  );
};

export default LeafletMap;
