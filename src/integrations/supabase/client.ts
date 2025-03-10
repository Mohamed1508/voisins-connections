
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Define the Database type explicitly to extend it with the types for our new tables
type ExtendedDatabase = Database & {
  public: {
    Tables: {
      groups: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          created_at: string;
          created_by: string;
          lat: number;
          lng: number;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          created_at?: string;
          created_by: string;
          lat: number;
          lng: number;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          created_at?: string;
          created_by?: string;
          lat?: number;
          lng?: number;
        };
      };
      group_members: {
        Row: {
          id: string;
          group_id: string;
          user_id: string;
          joined_at: string;
          is_admin: boolean;
          role: string;
        };
        Insert: {
          id?: string;
          group_id: string;
          user_id: string;
          joined_at?: string;
          is_admin?: boolean;
          role: string;
        };
        Update: {
          id?: string;
          group_id?: string;
          user_id?: string;
          joined_at?: string;
          is_admin?: boolean;
          role?: string;
        };
      };
      rides: {
        Row: {
          id: string;
          name: string;
          departure: string;
          arrival: string;
          date: string;
          time: string;
          available_seats: number;
          created_at: string;
          created_by: string;
          lat: number;
          lng: number;
        };
        Insert: {
          id?: string;
          name: string;
          departure: string;
          arrival: string;
          date: string;
          time: string;
          available_seats: number;
          created_at?: string;
          created_by: string;
          lat: number;
          lng: number;
        };
        Update: {
          id?: string;
          name?: string;
          departure?: string;
          arrival?: string;
          date?: string;
          time?: string;
          available_seats?: number;
          created_at?: string;
          created_by?: string;
          lat?: number;
          lng?: number;
        };
      };
      users: {
        Row: {
          id: string;
          email: string;
          username: string | null;
          avatar_url: string | null;
          bio: string | null;
          lat: number | null;
          lng: number | null;
          origin_country: string | null;
          created_at: string;
          languages: string[] | null;
          interests: string[] | null;
          neighborhood_images: string[] | null;
          ui_language: string | null;
        };
        Insert: {
          id: string;
          email: string;
          username?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          lat?: number | null;
          lng?: number | null;
          origin_country?: string | null;
          created_at?: string;
          languages?: string[] | null;
          interests?: string[] | null;
          neighborhood_images?: string[] | null;
          ui_language?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          username?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          lat?: number | null;
          lng?: number | null;
          origin_country?: string | null;
          created_at?: string;
          languages?: string[] | null;
          interests?: string[] | null;
          neighborhood_images?: string[] | null;
          ui_language?: string | null;
        };
      };
    };
  };
};

const SUPABASE_URL = "https://poddiiizllphqxhfssja.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvZGRpaWl6bGxwaHF4aGZzc2phIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwODk5MDQsImV4cCI6MjA1NjY2NTkwNH0.ElqC5vUzS1LnPcQu74B7ZFRY_-Nl2UUZdTKXsvmgRz4";

export const supabase = createClient<ExtendedDatabase>(
  SUPABASE_URL, 
  SUPABASE_ANON_KEY, 
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    }
  }
);
