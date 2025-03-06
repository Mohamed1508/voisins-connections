
import { supabase } from "@/integrations/supabase/client";

/**
 * This function seeds the database with test data for users and rides.
 * It's meant to be called once for demonstration purposes.
 */
export const seedDatabaseWithTestData = async () => {
  try {
    // Create auth users first (this would normally be done through signup)
    // Note: This wouldn't actually work in a real application due to security,
    // but we're simulating the presence of auth users for the sake of the demo

    // Check if test users already exist in the public users table
    const { data: existingUsers } = await supabase
      .from('users')
      .select('username')
      .in('username', ['Mohamed', 'Fatma']);

    if (!existingUsers || existingUsers.length < 2) {
      console.log("Adding test user data to the database...");
      
      // Insert test users into the public users table
      // In a real app, these would be linked to auth users
      // but for preview we'll just add them as standalone entries
      await supabase
        .from('users')
        .upsert([
          {
            id: '11111111-1111-1111-1111-111111111111', 
            email: 'mohamed@test.com',
            username: 'Mohamed',
            lat: 48.8566,
            lng: 2.3522,
            origin_country: 'Maroc',
            languages: ['français', 'arabe'],
            interests: ['cuisine', 'jardinage'],
            bio: 'Bonjour! Je suis nouveau dans le quartier.'
          },
          {
            id: '22222222-2222-2222-2222-222222222222',
            email: 'fatma@test.com',
            username: 'Fatma',
            lat: 48.8606,
            lng: 2.3376,
            origin_country: 'Tunisie',
            languages: ['français', 'arabe', 'anglais'],
            interests: ['sport', 'lecture'],
            bio: 'Heureuse de rencontrer mes voisins!'
          }
        ], { ignoreDuplicates: true });
    }

    // Check if test ride already exists
    const { data: existingRides } = await supabase
      .from('rides')
      .select('name')
      .eq('name', 'Trajet centre-ville');

    if (!existingRides || existingRides.length === 0) {
      console.log("Adding test ride data to the database...");
      
      // Insert test ride
      await supabase
        .from('rides')
        .insert([
          {
            name: 'Trajet centre-ville',
            departure: 'Saint-Denis',
            arrival: 'Paris Centre',
            date: '2024-03-15',
            time: '09:00:00',
            available_seats: 3,
            created_by: '11111111-1111-1111-1111-111111111111',
            lat: 48.8486,
            lng: 2.3465
          }
        ]);
    }

    console.log("Database seeding completed or data already exists.");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};
