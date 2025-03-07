
/**
 * Calculates the distance between two points on the Earth's surface using the Haversine formula.
 * 
 * @param lat1 - Latitude of the first point in decimal degrees
 * @param lon1 - Longitude of the first point in decimal degrees
 * @param lat2 - Latitude of the second point in decimal degrees
 * @param lon2 - Longitude of the second point in decimal degrees
 * @returns Distance in kilometers
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d;
};

/**
 * Converts decimal degrees to radians.
 */
const toRad = (value: number): number => {
  return (value * Math.PI) / 180;
};

/**
 * Converts kilometers to meters.
 */
export const kmToMeters = (km: number): number => {
  return km * 1000;
};

/**
 * Formats a date string to a localized format.
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

/**
 * Creates a circle on the map to represent a search radius.
 */
export const createSearchCircle = (center: google.maps.LatLng, radius: number): google.maps.CircleOptions => {
  return {
    center,
    radius: kmToMeters(radius),
    strokeColor: "#3b82f6",
    strokeOpacity: 0.8,
    strokeWeight: 1,
    fillColor: "#3b82f6",
    fillOpacity: 0.1,
  };
};
