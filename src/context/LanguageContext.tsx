
import React, { createContext, useContext, useState, ReactNode } from "react";

export type SupportedLanguage = "en" | "fr" | "ar" | "es";

type Translations = {
  welcome: string;
  neighbors: string;
  yourLocation: string;
  createdBy: string;
  discover: string;
  features: string;
  map: string;
  mapDesc: string;
  discoverNeighbors: string;
  discoverNeighborsDesc: string;
  messaging: string;
  messagingDesc: string;
  signUp: string;
  login: string;
  language: string;
  chats: string;
  searchAddress: string;
  backToConversations: string;
  groups: string;
  communitySpots: string;
  dashboard: string;
  profile: string;
  logout: string;
  cancel: string;
  createEvent: string;
  eventName: string;
  date: string;
  time: string;
  locationNote: string;
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
  leaveGroup: string;
  joinGroup: string;
  members: string;
  searchRadius: string;
  rides: string;
  carpooling: string;
  departure: string;
  arrival: string;
  availableSeats: string;
  createRide: string;
};

const englishMessages: Translations = {
  welcome: "Welcome to",
  neighbors: "Neighbors",
  yourLocation: "Your location",
  createdBy: "Created by",
  discover: "Discover and connect with neighbors in your area. Build a stronger community together.",
  features: "Our Features",
  map: "Interactive Map",
  mapDesc: "Explore your neighborhood and find nearby events and community spots.",
  discoverNeighbors: "Discover Neighbors",
  discoverNeighborsDesc: "Meet and connect with people living near you based on shared interests.",
  messaging: "Direct Messaging",
  messagingDesc: "Communicate privately with neighbors to organize activities and share information.",
  signUp: "Sign Up",
  login: "Login",
  language: "Language",
  chats: "Chats",
  searchAddress: "Search an address",
  backToConversations: "Back to conversations",
  groups: "Groups",
  communitySpots: "Community Spots",
  dashboard: "Dashboard",
  profile: "Profile",
  logout: "Logout",
  cancel: "Cancel",
  createEvent: "Create Event",
  eventName: "Event Name",
  date: "Date",
  time: "Time",
  locationNote: "Click on the map to select a location",
  createSpot: "Create Spot",
  spotName: "Spot Name",
  spotDescription: "Description",
  spotOriginRelated: "Origin Related",
  createGroup: "Create Group",
  groupName: "Group Name",
  groupDescription: "Group Description",
  myGroups: "My Groups",
  availableGroups: "Available Groups",
  admin: "Admin",
  member: "Member",
  leaveGroup: "Leave Group",
  joinGroup: "Join Group",
  members: "Members",
  searchRadius: "Search Radius",
  rides: "Rides",
  carpooling: "Carpooling",
  departure: "Departure",
  arrival: "Arrival",
  availableSeats: "Available Seats",
  createRide: "Create Ride"
};

const frenchMessages: Translations = {
  welcome: "Bienvenue sur",
  neighbors: "Voisins",
  yourLocation: "Votre position",
  createdBy: "Créé par",
  discover: "Découvrez et connectez-vous avec vos voisins. Construisez une communauté plus forte ensemble.",
  features: "Nos Fonctionnalités",
  map: "Carte Interactive",
  mapDesc: "Explorez votre quartier et trouvez des événements et des lieux communautaires à proximité.",
  discoverNeighbors: "Découvrir vos Voisins",
  discoverNeighborsDesc: "Rencontrez des personnes vivant près de chez vous selon vos intérêts communs.",
  messaging: "Messagerie Directe",
  messagingDesc: "Communiquez en privé avec vos voisins pour organiser des activités et partager des informations.",
  signUp: "S'inscrire",
  login: "Connexion",
  language: "Langue",
  chats: "Messages",
  searchAddress: "Rechercher une adresse",
  backToConversations: "Retour aux conversations",
  groups: "Groupes",
  communitySpots: "Lieux Communautaires",
  dashboard: "Tableau de bord",
  profile: "Profil",
  logout: "Déconnexion",
  cancel: "Annuler",
  createEvent: "Créer un Événement",
  eventName: "Nom de l'Événement",
  date: "Date",
  time: "Heure",
  locationNote: "Cliquez sur la carte pour sélectionner un emplacement",
  createSpot: "Créer un Lieu",
  spotName: "Nom du Lieu",
  spotDescription: "Description",
  spotOriginRelated: "Lié à l'Origine",
  createGroup: "Créer un Groupe",
  groupName: "Nom du Groupe",
  groupDescription: "Description du Groupe",
  myGroups: "Mes Groupes",
  availableGroups: "Groupes Disponibles",
  admin: "Administrateur",
  member: "Membre",
  leaveGroup: "Quitter le Groupe",
  joinGroup: "Rejoindre le Groupe",
  members: "Membres",
  searchRadius: "Rayon de Recherche",
  rides: "Trajets",
  carpooling: "Covoiturage",
  departure: "Départ",
  arrival: "Arrivée",
  availableSeats: "Places Disponibles",
  createRide: "Créer un Trajet"
};

const arabicMessages: Translations = {
  welcome: "مرحبا بكم في",
  neighbors: "الجيران",
  yourLocation: "موقعك",
  createdBy: "تم الإنشاء بواسطة",
  discover: "اكتشف وتواصل مع جيرانك في منطقتك. بناء مجتمع أقوى معا.",
  features: "ميزاتنا",
  map: "خريطة تفاعلية",
  mapDesc: "استكشف حيك وابحث عن الأحداث والأماكن المجتمعية القريبة.",
  discoverNeighbors: "اكتشف جيرانك",
  discoverNeighborsDesc: "قابل وتواصل مع أشخاص يعيشون بالقرب منك بناءً على الاهتمامات المشتركة.",
  messaging: "المراسلة المباشرة",
  messagingDesc: "تواصل بشكل خاص مع جيرانك لتنظيم الأنشطة ومشاركة المعلومات.",
  signUp: "التسجيل",
  login: "تسجيل الدخول",
  language: "اللغة",
  chats: "المحادثات",
  searchAddress: "البحث عن عنوان",
  backToConversations: "العودة إلى المحادثات",
  groups: "المجموعات",
  communitySpots: "الأماكن المجتمعية",
  dashboard: "لوحة التحكم",
  profile: "الملف الشخصي",
  logout: "تسجيل الخروج",
  cancel: "إلغاء",
  createEvent: "إنشاء حدث",
  eventName: "اسم الحدث",
  date: "التاريخ",
  time: "الوقت",
  locationNote: "انقر على الخريطة لتحديد موقع",
  createSpot: "إنشاء مكان",
  spotName: "اسم المكان",
  spotDescription: "الوصف",
  spotOriginRelated: "متعلق بالأصل",
  createGroup: "إنشاء مجموعة",
  groupName: "اسم المجموعة",
  groupDescription: "وصف المجموعة",
  myGroups: "مجموعاتي",
  availableGroups: "المجموعات المتاحة",
  admin: "مشرف",
  member: "عضو",
  leaveGroup: "مغادرة المجموعة",
  joinGroup: "الانضمام إلى المجموعة",
  members: "الأعضاء",
  searchRadius: "نطاق البحث",
  rides: "الرحلات",
  carpooling: "مشاركة السيارة",
  departure: "المغادرة",
  arrival: "الوصول",
  availableSeats: "المقاعد المتاحة",
  createRide: "إنشاء رحلة"
};

const spanishMessages: Translations = {
  welcome: "Bienvenido a",
  neighbors: "Vecinos",
  yourLocation: "Tu ubicación",
  createdBy: "Creado por",
  discover: "Descubre y conéctate con vecinos en tu área. Construye una comunidad más fuerte juntos.",
  features: "Nuestras Características",
  map: "Mapa Interactivo",
  mapDesc: "Explora tu vecindario y encuentra eventos cercanos y lugares comunitarios.",
  discoverNeighbors: "Descubre Vecinos",
  discoverNeighborsDesc: "Conoce y conéctate con personas que viven cerca de ti según intereses compartidos.",
  messaging: "Mensajería Directa",
  messagingDesc: "Comunícate en privado con vecinos para organizar actividades y compartir información.",
  signUp: "Registrarse",
  login: "Iniciar Sesión",
  language: "Idioma",
  chats: "Chats",
  searchAddress: "Buscar una dirección",
  backToConversations: "Volver a conversaciones",
  groups: "Grupos",
  communitySpots: "Lugares Comunitarios",
  dashboard: "Panel de Control",
  profile: "Perfil",
  logout: "Cerrar Sesión",
  cancel: "Cancelar",
  createEvent: "Crear Evento",
  eventName: "Nombre del Evento",
  date: "Fecha",
  time: "Hora",
  locationNote: "Haz clic en el mapa para seleccionar una ubicación",
  createSpot: "Crear Lugar",
  spotName: "Nombre del Lugar",
  spotDescription: "Descripción",
  spotOriginRelated: "Relacionado con Origen",
  createGroup: "Crear Grupo",
  groupName: "Nombre del Grupo",
  groupDescription: "Descripción del Grupo",
  myGroups: "Mis Grupos",
  availableGroups: "Grupos Disponibles",
  admin: "Administrador",
  member: "Miembro",
  leaveGroup: "Salir del Grupo",
  joinGroup: "Unirse al Grupo",
  members: "Miembros",
  searchRadius: "Radio de Búsqueda",
  rides: "Viajes",
  carpooling: "Compartir Coche",
  departure: "Salida",
  arrival: "Llegada",
  availableSeats: "Asientos Disponibles",
  createRide: "Crear Viaje"
};

const messages = {
  en: englishMessages,
  fr: frenchMessages,
  ar: arabicMessages,
  es: spanishMessages
};

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  translations: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  translations: englishMessages,
});

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<SupportedLanguage>("en");

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        translations: messages[language],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
