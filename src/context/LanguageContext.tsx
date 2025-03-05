
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";

type LanguageType = "fr" | "en" | "ar" | "es";

type TranslationType = {
  welcome: string;
  discover: string;
  neighbors: string;
  features: string;
  map: string;
  mapDesc: string;
  discoverNeighbors: string;
  discoverNeighborsDesc: string;
  messaging: string;
  messagingDesc: string;
  signup: string;
  login: string;
  dashboard: string;
  messages: string;
  backToConversations: string;
  selectLanguage: string;
  communitySpots: string;
};

type FooterTranslationType = {
  description: string;
  community: string;
  privacy: string;
  terms: string;
  contact: string;
  copyright: string;
  madeWith: string;
  communitySpots: string;
};

const translations: Record<LanguageType, TranslationType> = {
  fr: {
    welcome: "Bienvenue sur Voisins Proches",
    discover: "Découvrez et échangez avec vos voisins d'origines diverses",
    neighbors: "Voisins",
    features: "Fonctionnalités",
    map: "Carte interactive",
    mapDesc: "Localisez vos voisins et organisez des événements près de chez vous",
    discoverNeighbors: "Découvrez vos voisins",
    discoverNeighborsDesc: "Rencontrez des personnes d'origines diverses dans votre quartier",
    messaging: "Messagerie",
    messagingDesc: "Échangez facilement avec vos voisins en toute sécurité",
    signup: "S'inscrire",
    login: "Se connecter",
    dashboard: "Tableau de bord",
    messages: "Messages",
    backToConversations: "Retour aux conversations",
    selectLanguage: "Langue",
    communitySpots: "Spots communautaires",
  },
  en: {
    welcome: "Welcome to Close Neighbors",
    discover: "Discover and connect with neighbors from diverse origins",
    neighbors: "Neighbors",
    features: "Features",
    map: "Interactive Map",
    mapDesc: "Locate your neighbors and organize events near you",
    discoverNeighbors: "Discover your neighbors",
    discoverNeighborsDesc: "Meet people from diverse backgrounds in your neighborhood",
    messaging: "Messaging",
    messagingDesc: "Safely and easily exchange with your neighbors",
    signup: "Sign up",
    login: "Login",
    dashboard: "Dashboard",
    messages: "Messages",
    backToConversations: "Back to conversations",
    selectLanguage: "Language",
    communitySpots: "Community Spots",
  },
  ar: {
    welcome: "مرحبًا بك في الجيران القريبين",
    discover: "اكتشف وتواصل مع الجيران من أصول متنوعة",
    neighbors: "الجيران",
    features: "الميزات",
    map: "خريطة تفاعلية",
    mapDesc: "حدد موقع جيرانك ونظم الأحداث بالقرب منك",
    discoverNeighbors: "اكتشف جيرانك",
    discoverNeighborsDesc: "قابل أشخاصًا من خلفيات متنوعة في منطقتك",
    messaging: "المراسلة",
    messagingDesc: "تبادل بأمان وسهولة مع جيرانك",
    signup: "التسجيل",
    login: "تسجيل الدخول",
    dashboard: "لوحة التحكم",
    messages: "الرسائل",
    backToConversations: "العودة إلى المحادثات",
    selectLanguage: "اللغة",
    communitySpots: "أماكن المجتمع",
  },
  es: {
    welcome: "Bienvenido a Vecinos Cercanos",
    discover: "Descubre y conéctate con vecinos de diversos orígenes",
    neighbors: "Vecinos",
    features: "Características",
    map: "Mapa Interactivo",
    mapDesc: "Localiza a tus vecinos y organiza eventos cerca de ti",
    discoverNeighbors: "Descubre a tus vecinos",
    discoverNeighborsDesc: "Conoce a personas de diversos orígenes en tu barrio",
    messaging: "Mensajería",
    messagingDesc: "Intercambia de forma segura y fácil con tus vecinos",
    signup: "Registrarse",
    login: "Iniciar sesión",
    dashboard: "Tablero",
    messages: "Mensajes",
    backToConversations: "Volver a las conversaciones",
    selectLanguage: "Idioma",
    communitySpots: "Lugares comunitarios",
  },
};

const footerTranslations: Record<LanguageType, FooterTranslationType> = {
  fr: {
    description: "Voisins Proches est une application qui aide à créer des liens entre voisins d'origines diverses.",
    community: "Communauté",
    privacy: "Confidentialité",
    terms: "Conditions d'utilisation",
    contact: "Contact",
    copyright: "Tous droits réservés",
    madeWith: "Fait avec",
    communitySpots: "Spots communautaires",
  },
  en: {
    description: "Close Neighbors is an app that helps create connections between neighbors from diverse origins.",
    community: "Community",
    privacy: "Privacy",
    terms: "Terms of Service",
    contact: "Contact",
    copyright: "All rights reserved",
    madeWith: "Made with",
    communitySpots: "Community Spots",
  },
  ar: {
    description: "الجيران القريبون هو تطبيق يساعد على إنشاء روابط بين الجيران من أصول متنوعة.",
    community: "المجتمع",
    privacy: "الخصوصية",
    terms: "شروط الاستخدام",
    contact: "اتصل بنا",
    copyright: "جميع الحقوق محفوظة",
    madeWith: "صنع بـ",
    communitySpots: "أماكن المجتمع",
  },
  es: {
    description: "Vecinos Cercanos es una aplicación que ayuda a crear conexiones entre vecinos de diversos orígenes.",
    community: "Comunidad",
    privacy: "Privacidad",
    terms: "Términos de servicio",
    contact: "Contacto",
    copyright: "Todos los derechos reservados",
    madeWith: "Hecho con",
    communitySpots: "Lugares comunitarios",
  },
};

type LanguageContextType = {
  language: LanguageType;
  setLanguage: (language: LanguageType) => void;
  translations: TranslationType;
  footerTranslations: FooterTranslationType;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<LanguageType>("fr");
  const { user } = useAuth();

  // Récupérer la préférence de langue depuis Supabase lors de la connexion
  useEffect(() => {
    const fetchUserLanguagePreference = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from("users")
            .select("ui_language")
            .eq("id", user.id)
            .single();

          if (error) throw error;
          if (data && data.ui_language) {
            setLanguage(data.ui_language as LanguageType);
          }
        } catch (error) {
          console.error("Error fetching user language preference:", error);
        }
      }
    };

    fetchUserLanguagePreference();
  }, [user]);

  // Mettre à jour la préférence de langue dans Supabase
  const handleSetLanguage = async (newLanguage: LanguageType) => {
    setLanguage(newLanguage);
    
    if (user) {
      try {
        const { error } = await supabase
          .from("users")
          .update({ ui_language: newLanguage })
          .eq("id", user.id);

        if (error) throw error;
      } catch (error) {
        console.error("Error updating user language preference:", error);
      }
    }
  };

  const value = {
    language,
    setLanguage: handleSetLanguage,
    translations: translations[language],
    footerTranslations: footerTranslations[language],
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};
