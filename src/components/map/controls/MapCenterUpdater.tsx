
import React, { useEffect } from "react";
import { useMap } from "react-leaflet";

interface MapCenterUpdaterProps {
  center: [number, number];
}

const MapCenterUpdater: React.FC<MapCenterUpdaterProps> = ({ center }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  
  return null;
};

export default MapCenterUpdater;
