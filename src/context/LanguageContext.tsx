
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

// Définir les traductions
const translations = {
  fr: {
    welcome: "Connectez-vous avec vos voisins",
    discover: "Découvrez qui habite près de chez vous, échangez des services et créez une communauté locale vivante.",
    signup: "S'inscrire",
    login: "Se connecter",
    features: "Fonctionnalités principales",
    map: "Carte interactive",
    mapDesc: "Visualisez les voisins proches de chez vous sur une carte intuitive.",
    discoverNeighbors: "Découvrez vos voisins",
    discoverNeighborsDesc: "Parcourez les profils des personnes qui habitent près de chez vous.",
    messaging: "Messagerie directe",
    messagingDesc: "Communiquez facilement avec vos voisins pour échanger des services ou organiser des événements.",
    dashboard: "Tableau de bord",
    neighbors: "Voisins",
    messages: "Messages",
    searchAddress: "Rechercher une adresse...",
    searchRadius: "Rayon de recherche",
    selectLanguage: "Langue",
    backToConversations: "Retour aux conversations",
    communitySpots: "Spots communautaires",
    events: "Événements",
    profile: "Profil",
    signOut: "Déconnexion"
  },
  en: {
    welcome: "Connect with your neighbors",
    discover: "Discover who lives near you, exchange services and create a vibrant local community.",
    signup: "Sign up",
    login: "Log in",
    features: "Main features",
    map: "Interactive map",
    mapDesc: "Visualize nearby neighbors on an intuitive map.",
    discoverNeighbors: "Discover your neighbors",
    discoverNeighborsDesc: "Browse through profiles of people who live near you.",
    messaging: "Direct messaging",
    messagingDesc: "Easily communicate with your neighbors to exchange services or organize events.",
    dashboard: "Dashboard",
    neighbors: "Neighbors",
    messages: "Messages",
    searchAddress: "Search an address...",
    searchRadius: "Search radius",
    selectLanguage: "Language",
    backToConversations: "Back to conversations",
    communitySpots: "Community spots",
    events: "Events",
    profile: "Profile",
    signOut: "Sign out"
  },
  ar: {
    welcome: "تواصل مع جيرانك",
    discover: "اكتشف من يعيش بالقرب منك، تبادل الخدمات وأنشئ مجتمعًا محليًا نابضًا بالحياة.",
    signup: "تسجيل",
    login: "تسجيل الدخول",
    features: "الميزات الرئيسية",
    map: "خريطة تفاعلية",
    mapDesc: "رؤية الجيران القريبين على خريطة سهلة الاستخدام.",
    discoverNeighbors: "اكتشف جيرانك",
    discoverNeighborsDesc: "تصفح ملفات الأشخاص الذين يعيشون بالقرب منك.",
    messaging: "المراسلة المباشرة",
    messagingDesc: "تواصل بسهولة مع جيرانك لتبادل الخدمات أو تنظيم الأحداث.",
    dashboard: "لوحة التحكم",
    neighbors: "الجيران",
    messages: "الرسائل",
    searchAddress: "ابحث عن عنوان...",
    searchRadius: "نطاق البحث",
    selectLanguage: "اللغة",
    backToConversations: "العودة إلى المحادثات",
    communitySpots: "أماكن المجتمع",
    events: "الأحداث",
    profile: "الملف الشخصي",
    signOut: "تسجيل الخروج"
  },
  es: {
    welcome: "Conéctate con tus vecinos",
    discover: "Descubre quién vive cerca de ti, intercambia servicios y crea una comunidad local vibrante.",
    signup: "Registrarse",
    login: "Iniciar sesión",
    features: "Características principales",
    map: "Mapa interactivo",
    mapDesc: "Visualiza a los vecinos cercanos en un mapa intuitivo.",
    discoverNeighbors: "Descubre a tus vecinos",
    discoverNeighborsDesc: "Navega por los perfiles de las personas que viven cerca de ti.",
    messaging: "Mensajería directa",
    messagingDesc: "Comunícate fácilmente con tus vecinos para intercambiar servicios u organizar eventos.",
    dashboard: "Panel de control",
    neighbors: "Vecinos",
    messages: "Mensajes",
    searchAddress: "Buscar una dirección...",
    searchRadius: "Radio de búsqueda",
    selectLanguage: "Idioma",
    backToConversations: "Volver a las conversaciones",
    communitySpots: "Lugares comunitarios",
    events: "Eventos",
    profile: "Perfil",
    signOut: "Cerrar sesión"
  }
};

// Type pour le contexte
type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
  translations: Record<string, string>;
};

// Créer le contexte
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Hook personnalisé pour utiliser le contexte
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

// Provider du contexte
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState(() => {
    const savedLang = localStorage.getItem("language");
    return savedLang || "fr";
  });
  
  const { user } = useAuth();
  
  // Charger la préférence de langue de l'utilisateur depuis Supabase
  useEffect(() => {
    const fetchUserLanguage = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('users')
            .select('ui_language')
            .eq('id', user.id)
            .single();
            
          if (!error && data && data.ui_language) {
            setLanguageState(data.ui_language);
          }
        } catch (error) {
          console.error("Error fetching user language preference:", error);
        }
      }
    };
    
    fetchUserLanguage();
  }, [user]);

  // Mettre à jour le localStorage lorsque la langue change
  useEffect(() => {
    localStorage.setItem("language", language);
    // Mettre à jour l'attribut dir pour le support RTL
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    // Mettre à jour la classe RTL pour les styles spécifiques
    if (language === "ar") {
      document.documentElement.classList.add("rtl");
    } else {
      document.documentElement.classList.remove("rtl");
    }
  }, [language]);
  
  const setLanguage = async (newLanguage: string) => {
    setLanguageState(newLanguage);
    
    // Si l'utilisateur est connecté, mettre à jour sa préférence de langue
    if (user) {
      try {
        await supabase
          .from('users')
          .update({ ui_language: newLanguage })
          .eq('id', user.id);
      } catch (error) {
        console.error("Error updating user language preference:", error);
      }
    }
  };

  // Valeur du contexte
  const value = {
    language,
    setLanguage,
    translations: translations[language as keyof typeof translations]
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
