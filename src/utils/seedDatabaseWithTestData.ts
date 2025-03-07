
import { supabase } from "@/integrations/supabase/client";

/**
 * This function seeds the database with test data for users and rides.
 * It's meant to be called once for demonstration purposes.
 */
export const seedDatabaseWithTestData = async () => {
  try {
    console.log("Checking if test data exists...");
    
    // Check if test users already exist in the public users table
    const { data: existingUsers } = await supabase
      .from('users')
      .select('username')
      .in('username', ['Mohamed', 'Fatma']);

    if (!existingUsers || existingUsers.length < 2) {
      console.log("Adding test user data to the database...");
      
      // Insert test users into the public users table
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
            languages: ['français', 'arabe', 'anglais', 'espagnol'],
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

    // Check if test group already exists
    const { data: existingGroups } = await supabase
      .from('groups')
      .select('name')
      .eq('name', 'Groupe multiculturel');

    if (!existingGroups || existingGroups.length === 0) {
      console.log("Adding test group data to the database...");
      
      // Insert test group
      const { data: group, error } = await supabase
        .from('groups')
        .insert([
          {
            name: 'Groupe multiculturel',
            description: 'Groupe pour célébrer les différentes cultures',
            created_by: '11111111-1111-1111-1111-111111111111',
            lat: 48.8616,
            lng: 2.3492
          }
        ])
        .select();

      if (group && group.length > 0) {
        // Add members to the group
        await supabase
          .from('group_members')
          .insert([
            {
              group_id: group[0].id,
              user_id: '11111111-1111-1111-1111-111111111111',
              role: 'admin'
            },
            {
              group_id: group[0].id,
              user_id: '22222222-2222-2222-2222-222222222222',
              role: 'member'
            }
          ]);
      }
    }

    // Check if test spot already exists
    const { data: existingSpots } = await supabase
      .from('community_spots')
      .select('name')
      .eq('name', 'Restaurant marocain');

    if (!existingSpots || existingSpots.length === 0) {
      console.log("Adding test community spot data to the database...");
      
      // Insert test spot
      await supabase
        .from('community_spots')
        .insert([
          {
            name: 'Restaurant marocain',
            description: 'Excellent restaurant authentique',
            created_by: '11111111-1111-1111-1111-111111111111',
            lat: 48.8536,
            lng: 2.3502,
            origin_related: 'Maroc'
          }
        ]);
    }

    console.log("Database seeding completed or data already exists.");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};
