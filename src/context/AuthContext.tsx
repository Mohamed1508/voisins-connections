
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';

type ProfileData = {
  username?: string;
  bio?: string;
  origin_country?: string;
  avatar_url?: string;
  neighborhood_images?: string[];
  languages?: string[];
  interests?: string[];
  lat?: number;
  lng?: number;
};

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: ProfileData) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: ProfileData) => Promise<void>;
  uploadProfileImage: (file: File) => Promise<string | null>;
  uploadNeighborhoodImage: (file: File) => Promise<string | null>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error fetching session:', error);
      } else {
        setSession(session);
        setUser(session?.user || null);
        
        // If user is authenticated and on login/signup page, redirect to dashboard
        if (session && (location.pathname === '/login' || location.pathname === '/signup')) {
          navigate('/dashboard');
        }
      }
      setLoading(false);
    };

    fetchSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", _event, session?.user?.email);
      setSession(session);
      setUser(session?.user || null);
      
      // If user logs in and is on login/signup page, redirect to dashboard
      if (session && (location.pathname === '/login' || location.pathname === '/signup')) {
        navigate('/dashboard');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, location]);

  const uploadProfileImage = async (file: File): Promise<string | null> => {
    try {
      if (!user) throw new Error("Vous devez être connecté pour télécharger une image");
      
      // Create a unique filename using user id and timestamp
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('user-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data } = supabase.storage
        .from('user-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error: any) {
      toast({
        title: "Erreur de téléchargement",
        description: error.message || "Impossible de télécharger l'image",
        variant: "destructive",
      });
      return null;
    }
  };

  const uploadNeighborhoodImage = async (file: File): Promise<string | null> => {
    try {
      if (!user) throw new Error("Vous devez être connecté pour télécharger une image");
      
      // Create a unique filename using user id, 'neighborhood' identifier, and timestamp
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-neighborhood-${Date.now()}.${fileExt}`;
      const filePath = `neighborhood/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('user-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data } = supabase.storage
        .from('user-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error: any) {
      toast({
        title: "Erreur de téléchargement",
        description: error.message || "Impossible de télécharger l'image",
        variant: "destructive",
      });
      return null;
    }
  };

  const signUp = async (email: string, password: string, userData: ProfileData) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: userData.username,
            avatar_url: userData.avatar_url,
            neighborhood_images: userData.neighborhood_images || [],
            origin_country: userData.origin_country,
          },
          emailRedirectTo: `${window.location.origin}/confirmation`,
        },
      });

      if (error) throw error;
      
      // If signup is successful, the trigger will automatically create the profile
      // But we'll update it with the additional data
      if (data.user) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            username: userData.username,
            avatar_url: userData.avatar_url,
            bio: userData.bio,
            origin_country: userData.origin_country,
            lat: userData.lat,
            lng: userData.lng,
            languages: userData.languages || [],
            interests: userData.interests || [],
            neighborhood_images: userData.neighborhood_images || []
          })
          .eq('id', data.user.id);
        
        if (updateError) {
          console.error("Error updating user profile:", updateError);
        }
      }
      
      toast({
        title: "Compte créé avec succès",
        description: "Vérifiez votre email pour confirmer votre compte.",
      });
      
      // Navigate to dashboard even before confirmation
      // The user will need to verify their email to perform certain actions
      navigate('/dashboard');
      return;
    } catch (error: any) {
      toast({
        title: "Erreur lors de l'inscription",
        description: error.message || "Veuillez réessayer plus tard.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur Voisins Proches!",
      });
      
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Erreur de connexion",
        description: error.message || "Email ou mot de passe incorrect.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt sur Voisins Proches!",
      });
      
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Erreur lors de la déconnexion",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: ProfileData) => {
    try {
      setLoading(true);
      
      if (!user) throw new Error("Vous devez être connecté pour mettre à jour votre profil");
      
      // Update Supabase Auth metadata
      const authUpdate = {
        data: {
          username: data.username,
          avatar_url: data.avatar_url,
          neighborhood_images: data.neighborhood_images,
          origin_country: data.origin_country,
        }
      };
      
      const { error: authError } = await supabase.auth.updateUser(authUpdate);
      if (authError) throw authError;
      
      // Update profile in the profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          username: data.username,
          bio: data.bio,
          avatar_url: data.avatar_url,
          origin_country: data.origin_country,
          lat: data.lat,
          lng: data.lng,
          languages: data.languages,
          interests: data.interests,
          neighborhood_images: data.neighborhood_images,
        })
        .eq('id', user.id);
        
      if (profileError) throw profileError;
      
      toast({
        title: "Profil mis à jour",
        description: "Les modifications ont été enregistrées avec succès.",
      });
    } catch (error: any) {
      toast({
        title: "Erreur lors de la mise à jour",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const value = {
    session,
    user,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    uploadProfileImage,
    uploadNeighborhoodImage,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
