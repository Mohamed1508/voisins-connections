
import { createContext, useContext, useState, ReactNode } from "react";

// Define supported languages
export type SupportedLanguage = "fr" | "en" | "ar" | "es";

// Define translations type
interface Translations {
  welcome: string;
  neighbors: string;
  discover: string;
  login: string;
  signup: string;
  signUp: string;
  features: string;
  map: string;
  mapDesc: string;
  discoverNeighbors: string;
  discoverNeighborsDesc: string;
  messaging: string;
  messagingDesc: string;
  carpooling: string;
  carpoolingDesc: string;
  yourLocation: string;
  created_by: string;
  createdBy: string;
  searchRadius: string;
  searchAddress: string;
  locationNote: string;
  date: string;
  time: string;
  eventName: string;
  communitySpots: string;
  createSpot: string;
  spotName: string;
  spotDescription: string;
  spotOriginRelated: string;
  createGroup: string;
  groupName: string;
  groupDescription: string;
  myGroups: string;
  availableGroups: string;
  admin: string;
  member: string;
  members: string;
  createRide: string;
  cancel: string;
  languages: string;
  language: string;
  [key: string]: string;
}

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  translations: Translations;
  isRTL: boolean;
}

// Create the context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Default translations
const defaultTranslations: Record<SupportedLanguage, Translations> = {
  fr: {
    welcome: "Bienvenue dans votre",
    neighbors: "voisinage",
    discover: "Découvrez vos voisins, participez à des événements locaux, et créez des liens dans votre communauté.",
    login: "Connexion",
    signup: "Inscription",
    signUp: "S'inscrire",
    features: "Fonctionnalités",
    map: "Carte intéractive",
    mapDesc: "Visualisez vos voisins proches et découvrez des lieux d'intérêt dans votre quartier.",
    discoverNeighbors: "Découvrir vos voisins",
    discoverNeighborsDesc: "Rencontrez des personnes partageant vos intérêts et qui habitent à proximité.",
    messaging: "Messagerie",
    messagingDesc: "Communiquez facilement avec vos voisins pour partager des conseils ou organiser des rencontres.",
    carpooling: "Covoiturage",
    carpoolingDesc: "Partagez vos trajets quotidiens pour économiser et réduire votre empreinte carbone.",
    yourLocation: "Votre position",
    created_by: "Créé par",
    createdBy: "Créé par",
    searchRadius: "Rayon de recherche",
    searchAddress: "Rechercher une adresse",
    locationNote: "Position sélectionnée",
    date: "Date",
    time: "Heure",
    eventName: "Nom de l'événement",
    communitySpots: "Lieux communautaires",
    createSpot: "Créer un lieu",
    spotName: "Nom du lieu",
    spotDescription: "Description",
    spotOriginRelated: "Lié à une origine",
    createGroup: "Créer un groupe",
    groupName: "Nom du groupe",
    groupDescription: "Description du groupe",
    myGroups: "Mes groupes",
    availableGroups: "Groupes disponibles",
    admin: "Admin",
    member: "Membre",
    members: "Membres",
    createRide: "Créer un trajet",
    cancel: "Annuler",
    languages: "Langues",
    language: "Langue",
    chats: "Messages",
    chat: "Messages"
  },
  en: {
    welcome: "Welcome to your",
    neighbors: "neighborhood",
    discover: "Discover your neighbors, participate in local events, and create connections in your community.",
    login: "Login",
    signup: "Sign up",
    signUp: "Sign up",
    features: "Features",
    map: "Interactive Map",
    mapDesc: "Visualize your close neighbors and discover points of interest in your area.",
    discoverNeighbors: "Discover Neighbors",
    discoverNeighborsDesc: "Meet people sharing your interests and who live nearby.",
    messaging: "Messaging",
    messagingDesc: "Easily communicate with your neighbors to share tips or organize meetings.",
    carpooling: "Carpooling",
    carpoolingDesc: "Share your daily commutes to save money and reduce your carbon footprint.",
    yourLocation: "Your location",
    created_by: "Created by",
    createdBy: "Created by",
    searchRadius: "Search radius",
    searchAddress: "Search address",
    locationNote: "Selected location",
    date: "Date",
    time: "Time",
    eventName: "Event name",
    communitySpots: "Community spots",
    createSpot: "Create spot",
    spotName: "Spot name",
    spotDescription: "Description",
    spotOriginRelated: "Related to an origin",
    createGroup: "Create group",
    groupName: "Group name",
    groupDescription: "Group description",
    myGroups: "My groups",
    availableGroups: "Available groups",
    admin: "Admin",
    member: "Member",
    members: "Members",
    createRide: "Create ride",
    cancel: "Cancel",
    languages: "Languages",
    language: "Language",
    chats: "Messages",
    chat: "Messages"
  },
  ar: {
    welcome: "مرحبا بكم في",
    neighbors: "حيكم",
    discover: "اكتشف جيرانك، شارك في الأحداث المحلية، وأنشئ روابط في مجتمعك.",
    login: "تسجيل الدخول",
    signup: "التسجيل",
    signUp: "التسجيل",
    features: "المميزات",
    map: "خريطة تفاعلية",
    mapDesc: "تصور جيرانك القريبين واكتشف نقاط الاهتمام في منطقتك.",
    discoverNeighbors: "اكتشف الجيران",
    discoverNeighborsDesc: "قابل أشخاصًا يشاركونك اهتماماتك ويعيشون بالقرب منك.",
    messaging: "المراسلة",
    messagingDesc: "تواصل بسهولة مع جيرانك لمشاركة النصائح أو تنظيم اللقاءات.",
    carpooling: "مشاركة السيارة",
    carpoolingDesc: "شارك رحلاتك اليومية لتوفير المال وتقليل بصمتك الكربونية.",
    yourLocation: "موقعك",
    created_by: "تم إنشاؤه بواسطة",
    createdBy: "تم إنشاؤه بواسطة",
    searchRadius: "نصف قطر البحث",
    searchAddress: "البحث عن عنوان",
    locationNote: "الموقع المختار",
    date: "التاريخ",
    time: "الوقت",
    eventName: "اسم الحدث",
    communitySpots: "أماكن المجتمع",
    createSpot: "إنشاء مكان",
    spotName: "اسم المكان",
    spotDescription: "الوصف",
    spotOriginRelated: "متعلق بأصل",
    createGroup: "إنشاء مجموعة",
    groupName: "اسم المجموعة",
    groupDescription: "وصف المجموعة",
    myGroups: "مجموعاتي",
    availableGroups: "المجموعات المتاحة",
    admin: "مسؤول",
    member: "عضو",
    members: "الأعضاء",
    createRide: "إنشاء رحلة",
    cancel: "إلغاء",
    languages: "اللغات",
    language: "اللغة",
    chats: "الرسائل",
    chat: "الرسائل"
  },
  es: {
    welcome: "Bienvenido a tu",
    neighbors: "vecindario",
    discover: "Descubre a tus vecinos, participa en eventos locales y crea conexiones en tu comunidad.",
    login: "Iniciar sesión",
    signup: "Registrarse",
    signUp: "Registrarse",
    features: "Características",
    map: "Mapa interactivo",
    mapDesc: "Visualiza a tus vecinos cercanos y descubre puntos de interés en tu área.",
    discoverNeighbors: "Descubrir vecinos",
    discoverNeighborsDesc: "Conoce a personas que comparten tus intereses y que viven cerca.",
    messaging: "Mensajería",
    messagingDesc: "Comunícate fácilmente con tus vecinos para compartir consejos o organizar reuniones.",
    carpooling: "Compartir coche",
    carpoolingDesc: "Comparte tus desplazamientos diarios para ahorrar dinero y reducir tu huella de carbono.",
    yourLocation: "Tu ubicación",
    created_by: "Creado por",
    createdBy: "Creado por",
    searchRadius: "Radio de búsqueda",
    searchAddress: "Buscar dirección",
    locationNote: "Ubicación seleccionada",
    date: "Fecha",
    time: "Hora",
    eventName: "Nombre del evento",
    communitySpots: "Lugares comunitarios",
    createSpot: "Crear lugar",
    spotName: "Nombre del lugar",
    spotDescription: "Descripción",
    spotOriginRelated: "Relacionado con un origen",
    createGroup: "Crear grupo",
    groupName: "Nombre del grupo",
    groupDescription: "Descripción del grupo",
    myGroups: "Mis grupos",
    availableGroups: "Grupos disponibles",
    admin: "Administrador",
    member: "Miembro",
    members: "Miembros",
    createRide: "Crear viaje",
    cancel: "Cancelar",
    languages: "Idiomas",
    language: "Idioma",
    chats: "Mensajes",
    chat: "Mensajes"
  }
};

// Provider component
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<SupportedLanguage>("fr");
  
  // Determine if the language is RTL
  const isRTL = language === "ar";
  
  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        translations: defaultTranslations[language],
        isRTL
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

// Hook to use the Language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
