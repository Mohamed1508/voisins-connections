
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

export type LanguageType = 'fr' | 'en' | 'es' | 'de';

type TranslationType = {
  // Page d'accueil
  welcome: string;
  neighbors: string;
  discover: string;
  signup: string;
  login: string;
  features: string;
  map: string;
  mapDesc: string;
  discoverNeighbors: string;
  discoverNeighborsDesc: string;
  messaging: string;
  messagingDesc: string;
  
  // Dashboard
  dashboard: string;
  messages: string;
  backToConversations: string;
  
  // Navigation
  home: string;
  profile: string;
  chats: string;
  spots: string;
  logout: string;

  // Footer
  description: string;
  community: string;
  privacy: string;
  terms: string;
  contact: string;
  copyright: string;
  madeWith: string;
  language: string;
  communitySpots: string;
  
  // Map & Filter
  searchRadius: string;
  searchAddress: string;
  
  // Events
  createEvent: string;
  eventName: string;
  date: string;
  time: string;
  description: string;
  locationNote: string;
  cancel: string;
  
  // Groups
  groups: string;
  createGroup: string;
  groupName: string;
  groupDescription: string;
  members: string;
  joinGroup: string;
  leaveGroup: string;
  myGroups: string;
};

const translations: Record<LanguageType, TranslationType> = {
  fr: {
    welcome: "Bienvenue sur",
    neighbors: "Voisins Proches",
    discover: "Découvrez, rencontrez et connectez-vous avec vos voisins qui partagent vos origines et votre culture.",
    signup: "S'inscrire",
    login: "Connexion",
    features: "Ce que nous offrons",
    map: "Carte interactive",
    mapDesc: "Visualisez vos voisins proches sur une carte et filtrez par pays d'origine.",
    discoverNeighbors: "Découvrir des voisins",
    discoverNeighborsDesc: "Trouvez des personnes partageant votre culture, langue ou pays d'origine.",
    messaging: "Messagerie simple",
    messagingDesc: "Connectez-vous et discutez directement avec vos nouveaux voisins.",
    
    dashboard: "Tableau de bord",
    messages: "Messages",
    backToConversations: "Retour aux conversations",
    
    home: "Accueil",
    profile: "Profil",
    chats: "Discussions",
    spots: "Lieux",
    logout: "Déconnexion",
    
    description: "Voisins Proches aide les personnes d'origine étrangère à trouver des voisins qui partagent leur culture.",
    community: "Communauté",
    privacy: "Confidentialité",
    terms: "Conditions",
    contact: "Contact",
    copyright: "© 2023 Voisins Proches. Tous droits réservés.",
    madeWith: "Fait avec ❤️ pour toutes les cultures",
    language: "Langue",
    communitySpots: "Lieux communautaires",
    
    searchRadius: "Rayon de recherche",
    searchAddress: "Rechercher une adresse",
    
    createEvent: "Créer un événement",
    eventName: "Nom de l'événement",
    date: "Date",
    time: "Heure",
    description: "Description",
    locationNote: "L'événement sera créé à votre position actuelle",
    cancel: "Annuler",
    
    groups: "Groupes",
    createGroup: "Créer un groupe",
    groupName: "Nom du groupe",
    groupDescription: "Description du groupe",
    members: "Membres",
    joinGroup: "Rejoindre",
    leaveGroup: "Quitter",
    myGroups: "Mes groupes"
  },
  en: {
    welcome: "Welcome to",
    neighbors: "Close Neighbors",
    discover: "Discover, meet and connect with neighbors who share your origins and culture.",
    signup: "Sign up",
    login: "Login",
    features: "What we offer",
    map: "Interactive map",
    mapDesc: "Visualize your close neighbors on a map and filter by country of origin.",
    discoverNeighbors: "Discover neighbors",
    discoverNeighborsDesc: "Find people sharing your culture, language or country of origin.",
    messaging: "Simple messaging",
    messagingDesc: "Connect and chat directly with your new neighbors.",
    
    dashboard: "Dashboard",
    messages: "Messages",
    backToConversations: "Back to conversations",
    
    home: "Home",
    profile: "Profile",
    chats: "Chats",
    spots: "Spots",
    logout: "Logout",
    
    description: "Close Neighbors helps people of foreign origin find neighbors who share their culture.",
    community: "Community",
    privacy: "Privacy",
    terms: "Terms",
    contact: "Contact",
    copyright: "© 2023 Close Neighbors. All rights reserved.",
    madeWith: "Made with ❤️ for all cultures",
    language: "Language",
    communitySpots: "Community Spots",
    
    searchRadius: "Search radius",
    searchAddress: "Search address",
    
    createEvent: "Create event",
    eventName: "Event name",
    date: "Date",
    time: "Time",
    description: "Description",
    locationNote: "The event will be created at your current location",
    cancel: "Cancel",
    
    groups: "Groups",
    createGroup: "Create group",
    groupName: "Group name",
    groupDescription: "Group description",
    members: "Members",
    joinGroup: "Join",
    leaveGroup: "Leave",
    myGroups: "My groups"
  },
  es: {
    welcome: "Bienvenido a",
    neighbors: "Vecinos Cercanos",
    discover: "Descubre, conoce y conéctate con vecinos que comparten tus orígenes y cultura.",
    signup: "Registrarse",
    login: "Iniciar sesión",
    features: "Lo que ofrecemos",
    map: "Mapa interactivo",
    mapDesc: "Visualiza a tus vecinos cercanos en un mapa y filtra por país de origen.",
    discoverNeighbors: "Descubrir vecinos",
    discoverNeighborsDesc: "Encuentra personas que comparten tu cultura, idioma o país de origen.",
    messaging: "Mensajería simple",
    messagingDesc: "Conéctate y chatea directamente con tus nuevos vecinos.",
    
    dashboard: "Panel de control",
    messages: "Mensajes",
    backToConversations: "Volver a conversaciones",
    
    home: "Inicio",
    profile: "Perfil",
    chats: "Chats",
    spots: "Lugares",
    logout: "Cerrar sesión",
    
    description: "Vecinos Cercanos ayuda a personas de origen extranjero a encontrar vecinos que comparten su cultura.",
    community: "Comunidad",
    privacy: "Privacidad",
    terms: "Términos",
    contact: "Contacto",
    copyright: "© 2023 Vecinos Cercanos. Todos los derechos reservados.",
    madeWith: "Hecho con ❤️ para todas las culturas",
    language: "Idioma",
    communitySpots: "Lugares comunitarios",
    
    searchRadius: "Radio de búsqueda",
    searchAddress: "Buscar dirección",
    
    createEvent: "Crear evento",
    eventName: "Nombre del evento",
    date: "Fecha",
    time: "Hora",
    description: "Descripción",
    locationNote: "El evento se creará en tu ubicación actual",
    cancel: "Cancelar",
    
    groups: "Grupos",
    createGroup: "Crear grupo",
    groupName: "Nombre del grupo",
    groupDescription: "Descripción del grupo",
    members: "Miembros",
    joinGroup: "Unirse",
    leaveGroup: "Salir",
    myGroups: "Mis grupos"
  },
  de: {
    welcome: "Willkommen bei",
    neighbors: "Nahe Nachbarn",
    discover: "Entdecke, triff und verbinde dich mit Nachbarn, die deine Herkunft und Kultur teilen.",
    signup: "Registrieren",
    login: "Anmelden",
    features: "Was wir bieten",
    map: "Interaktive Karte",
    mapDesc: "Visualisiere deine nahen Nachbarn auf einer Karte und filtere nach Herkunftsland.",
    discoverNeighbors: "Nachbarn entdecken",
    discoverNeighborsDesc: "Finde Menschen, die deine Kultur, Sprache oder dein Herkunftsland teilen.",
    messaging: "Einfaches Messaging",
    messagingDesc: "Verbinde dich und chatte direkt mit deinen neuen Nachbarn.",
    
    dashboard: "Dashboard",
    messages: "Nachrichten",
    backToConversations: "Zurück zu Gesprächen",
    
    home: "Startseite",
    profile: "Profil",
    chats: "Chats",
    spots: "Orte",
    logout: "Abmelden",
    
    description: "Nahe Nachbarn hilft Menschen ausländischer Herkunft, Nachbarn zu finden, die ihre Kultur teilen.",
    community: "Gemeinschaft",
    privacy: "Datenschutz",
    terms: "Bedingungen",
    contact: "Kontakt",
    copyright: "© 2023 Nahe Nachbarn. Alle Rechte vorbehalten.",
    madeWith: "Mit ❤️ für alle Kulturen gemacht",
    language: "Sprache",
    communitySpots: "Gemeinschaftsorte",
    
    searchRadius: "Suchradius",
    searchAddress: "Adresse suchen",
    
    createEvent: "Veranstaltung erstellen",
    eventName: "Name der Veranstaltung",
    date: "Datum",
    time: "Zeit",
    description: "Beschreibung",
    locationNote: "Die Veranstaltung wird an deinem aktuellen Standort erstellt",
    cancel: "Abbrechen",
    
    groups: "Gruppen",
    createGroup: "Gruppe erstellen",
    groupName: "Gruppenname",
    groupDescription: "Gruppenbeschreibung",
    members: "Mitglieder",
    joinGroup: "Beitreten",
    leaveGroup: "Verlassen",
    myGroups: "Meine Gruppen"
  }
};

type LanguageContextType = {
  language: LanguageType;
  setLanguage: (lang: LanguageType) => void;
  translations: TranslationType;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<LanguageType>('fr');
  const { user } = useAuth();
  
  // Charger la préférence de langue depuis Supabase quand l'utilisateur est connecté
  useEffect(() => {
    const loadLanguagePreference = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('users')
            .select('ui_language')
            .eq('id', user.id)
            .single();
          
          if (data && data.ui_language && !error) {
            setLanguage(data.ui_language as LanguageType);
          }
        } catch (error) {
          console.error("Erreur lors du chargement de la préférence de langue:", error);
        }
      }
    };
    
    loadLanguagePreference();
  }, [user]);
  
  // Sauvegarder la préférence de langue dans Supabase
  const handleSetLanguage = async (lang: LanguageType) => {
    setLanguage(lang);
    
    if (user) {
      try {
        await supabase
          .from('users')
          .update({ ui_language: lang })
          .eq('id', user.id);
      } catch (error) {
        console.error("Erreur lors de la sauvegarde de la préférence de langue:", error);
      }
    }
  };
  
  const value = {
    language,
    setLanguage: handleSetLanguage,
    translations: translations[language]
  };
  
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
