
import { useEffect } from 'react';

interface MapCenterUpdaterProps {
  center: [number, number];
  mapRef: React.MutableRefObject<any>;
}

/**
 * A utility component that updates the map center when the center prop changes.
 * Used to keep the map centered on the user's location.
 */
const MapCenterUpdater: React.FC<MapCenterUpdaterProps> = ({ center, mapRef }) => {
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(center, mapRef.current.getZoom());
    }
  }, [center, mapRef]);

  return null;
};

export default MapCenterUpdater;
