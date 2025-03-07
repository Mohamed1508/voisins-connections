
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
  const [isLeafletLoaded, setIsLeafletLoaded] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    
    // Check if Leaflet is loaded
    if (typeof window !== 'undefined' && window.L) {
      setIsLeafletLoaded(true);
    } else {
      // Wait for Leaflet to load
      const checkLeaflet = setInterval(() => {
        if (typeof window !== 'undefined' && window.L) {
          setIsLeafletLoaded(true);
          clearInterval(checkLeaflet);
        }
      }, 100);
      
      return () => clearInterval(checkLeaflet);
    }
    
    return () => setIsMounted(false);
  }, []);
  
  if (!isMounted || !isLeafletLoaded) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};

export default LeafletProvider;
