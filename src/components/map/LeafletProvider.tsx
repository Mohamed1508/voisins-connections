
import React, { useState, useEffect, ReactNode } from 'react';

interface LeafletProviderProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * A provider component that ensures Leaflet is only loaded in browser environments
 * and provides a fallback UI while loading.
 */
const LeafletProvider: React.FC<LeafletProviderProps> = ({ 
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
  
  return <>{children}</>;
};

export default LeafletProvider;
