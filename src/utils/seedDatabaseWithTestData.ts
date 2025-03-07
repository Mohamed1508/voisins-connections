
import { supabase } from "@/integrations/supabase/client";

/**
 * This function seeds the database with test data for users and rides.
 * It's meant to be called once for demonstration purposes.
 */
export const seedDatabaseWithTestData = async () => {
  try {
    console.log("Checking if test data exists...");
    
    // Check if test users already exist in the public users table
    const { data: existingUsers, error: checkError } = await supabase
      .from('users')
      .select('username')
      .in('username', ['Mohamed', 'Fatma']);

    if (checkError) {
      console.error("Error checking existing users:", checkError);
      return;
    }

    if (!existingUsers || existingUsers.length < 2) {
      console.log("Adding test user data to the database...");
      
      // Insert test users into the public users table
      const { error: userError } = await supabase
        .from('users')
        .upsert([
          {
            id: '11111111-1111-1111-1111-111111111111', 
            email: 'mohamed@test.com',
            username: 'Mohamed',
            lat: 33.5731,       // Casablanca lat
            lng: -7.5898,       // Casablanca lng
            origin_country: 'Maroc',
            languages: ['français', 'arabe'],
            interests: ['cuisine', 'jardinage'],
            bio: 'Bonjour! Je suis nouveau dans le quartier.'
          },
          {
            id: '22222222-2222-2222-2222-222222222222',
            email: 'fatma@test.com',
            username: 'Fatma',
            lat: 36.8065,       // Tunis lat
            lng: 10.1815,       // Tunis lng
            origin_country: 'Tunisie',
            languages: ['français', 'arabe', 'anglais', 'espagnol'],
            interests: ['sport', 'lecture'],
            bio: 'Heureuse de rencontrer mes voisins!'
          }
        ]);
        
      if (userError) {
        console.error("Error adding test users:", userError);
      }
    }

    // Check if test ride already exists
    const { data: existingRides, error: ridesCheckError } = await supabase
      .from('rides')
      .select('name')
      .eq('name', 'Casa-Tunis');

    if (ridesCheckError) {
      console.error("Error checking existing rides:", ridesCheckError);
    }

    if (!existingRides || existingRides.length === 0) {
      console.log("Adding test ride data to the database...");
      
      // Insert test ride
      const { error: rideError } = await supabase
        .from('rides')
        .insert([
          {
            name: 'Casa-Tunis',
            departure: 'Casablanca',
            arrival: 'Tunis',
            date: '2025-03-10',
            time: '10:00:00',
            available_seats: 3,
            created_by: '11111111-1111-1111-1111-111111111111',
            lat: 33.5731,
            lng: -7.5898
          }
        ]);
        
      if (rideError) {
        console.error("Error adding test ride:", rideError);
      }
    }

    // Check if test group already exists
    const { data: existingGroups, error: groupsCheckError } = await supabase
      .from('groups')
      .select('name')
      .eq('name', 'Groupe multiculturel');

    if (groupsCheckError) {
      console.error("Error checking existing groups:", groupsCheckError);
    }

    if (!existingGroups || existingGroups.length === 0) {
      console.log("Adding test group data to the database...");
      
      // Insert test group
      const { data: group, error: groupError } = await supabase
        .from('groups')
        .insert([
          {
            name: 'Groupe multiculturel',
            description: 'Groupe pour célébrer les différentes cultures',
            created_by: '11111111-1111-1111-1111-111111111111',
            lat: 34.0209,
            lng: 6.8326  // Somewhere between Morocco and Tunisia
          }
        ])
        .select();

      if (groupError) {
        console.error("Error adding test group:", groupError);
      } else if (group && group.length > 0) {
        // Add members to the group
        const { error: membersError } = await supabase
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
          
        if (membersError) {
          console.error("Error adding group members:", membersError);
        }
      }
    }

    // Check if test spot already exists
    const { data: existingSpots, error: spotsCheckError } = await supabase
      .from('community_spots')
      .select('name')
      .eq('name', 'Restaurant marocain');

    if (spotsCheckError) {
      console.error("Error checking existing spots:", spotsCheckError);
    }

    if (!existingSpots || existingSpots.length === 0) {
      console.log("Adding test community spot data to the database...");
      
      // Insert test spot
      const { error: spotError } = await supabase
        .from('community_spots')
        .insert([
          {
            name: 'Restaurant marocain',
            description: 'Excellent restaurant authentique',
            created_by: '11111111-1111-1111-1111-111111111111',
            lat: 33.5731,
            lng: -7.5898,
            origin_related: 'Maroc'
          }
        ]);
        
      if (spotError) {
        console.error("Error adding test spot:", spotError);
      }
    }

    console.log("Database seeding completed or data already exists.");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};
