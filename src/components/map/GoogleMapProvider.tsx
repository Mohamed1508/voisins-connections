
import React, { useState, useEffect, ReactNode } from 'react';
import { LoadScript } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = "AIzaSyC8jg6OhZ55oi4GqKCWV5S3KS8U9QR1NuA"; // Using public API key for demo purposes

const libraries = ["places"];

interface GoogleMapProviderProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * A provider component that ensures Google Maps is only loaded in browser environments
 * and provides a fallback UI while loading.
 */
const GoogleMapProvider: React.FC<GoogleMapProviderProps> = ({ 
  children, 
  fallback = <div className="w-full h-full bg-secondary flex items-center justify-center">Loading map...</div>
}) => {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);
  
  if (!isMounted) {
    return <>{fallback}</>;
  }
  
  return (
    <LoadScript
      googleMapsApiKey={GOOGLE_MAPS_API_KEY}
      libraries={libraries as any}
      loadingElement={fallback}
    >
      {children}
    </LoadScript>
  );
};

export default GoogleMapProvider;
