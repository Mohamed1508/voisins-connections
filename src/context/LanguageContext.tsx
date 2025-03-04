
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

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
    backToConversations: "Retour aux conversations"
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
    backToConversations: "Back to conversations"
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
    backToConversations: "العودة إلى المحادثات"
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
  // Récupérer la langue du localStorage ou utiliser fr par défaut
  const [language, setLanguage] = useState(() => {
    const savedLang = localStorage.getItem("language");
    return savedLang || "fr";
  });

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
