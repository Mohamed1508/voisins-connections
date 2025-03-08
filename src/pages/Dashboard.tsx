
// Only update the function that creates rides to fix the type mismatch in createRides function

// Update only the problematic transform function in Dashboard.tsx
createRides = (rawRides: any[]): RideType[] => {
  return rawRides.map(ride => ({
    id: ride.id,
    name: ride.name,
    departure: ride.departure,
    arrival: ride.arrival,
    date: ride.date,
    time: ride.time,
    available_seats: ride.available_seats,
    lat: ride.lat,
    lng: ride.lng,
    created_by: ride.created_by
  }));
};
