
import React, { useEffect } from "react";

interface MapCenterUpdaterProps {
  center: [number, number];
  mapRef: React.MutableRefObject<google.maps.Map | null>;
}

const MapCenterUpdater: React.FC<MapCenterUpdaterProps> = ({ center, mapRef }) => {
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.panTo({ lat: center[0], lng: center[1] });
    }
  }, [center, mapRef]);
  
  return null;
};

export default MapCenterUpdater;
