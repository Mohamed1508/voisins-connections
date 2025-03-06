
import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of translations
interface Translations {
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
  createEvents: string;
  createEventsDesc: string;
  createGroups: string;
  createGroupsDesc: string;
  joinRides: string;
  joinRidesDesc: string;
  login: string;
  signup: string;
  logout: string;
  email: string;
  password: string;
  confirmPassword: string;
  createAccount: string;
  alreadyHaveAccount: string;
  dontHaveAccount: string;
  username: string;
  profileUpdated: string;
  errorUpdatingProfile: string;
  dashboard: string;
  profile: string;
  chat: string;
  events: string;
  groups: string;
  rides: string;
  createEvent: string;
  myProfile: string;
  editProfile: string;
  languages: string;
  interests: string;
  bio: string;
  saveChanges: string;
  cancel: string;
  origin: string;
  joinGroup: string;
  leaveGroup: string;
  shareLocation: string;
  shareLocationDesc: string;
  allowLocation: string;
  locationGranted: string;
  locationGrantedDesc: string;
  locationDenied: string;
  locationDeniedDesc: string;
  locationNotSupported: string;
  locationNotSupportedDesc: string;
  backToConversations: string;
  noActiveConversations: string;
  // Add new translation keys for rides
  departure: string;
  arrival: string;
  availableSeats: string;
  createRide: string;
}

// Define the shape of our context
interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  translations: Translations;
}

// Create the context with a default value
const LanguageContext = createContext<LanguageContextType>({
  language: "fr",
  setLanguage: () => {},
  translations: {} as Translations,
});

// Define available languages and their translations
const availableLanguages = ["fr", "en", "ar", "es"];

const translationsByLanguage: Record<string, Translations> = {
  fr: {
    welcome: "Bienvenue sur Voisin",
    neighbors: "Voisins",
    yourLocation: "Votre position",
    createdBy: "Créé par",
    discover: "Découvrez vos voisins",
    features: "Fonctionnalités",
    map: "Carte",
    mapDesc: "Explorez votre quartier et découvrez vos voisins",
    discoverNeighbors: "Découvrez vos voisins",
    discoverNeighborsDesc: "Connectez-vous avec des personnes de votre quartier",
    createEvents: "Créez des événements",
    createEventsDesc: "Organisez des événements locaux et invitez vos voisins",
    createGroups: "Créez des groupes",
    createGroupsDesc: "Formez des communautés autour d'intérêts communs",
    joinRides: "Covoiturage",
    joinRidesDesc: "Partagez vos trajets quotidiens avec vos voisins",
    login: "Connexion",
    signup: "Inscription",
    logout: "Déconnexion",
    email: "Email",
    password: "Mot de passe",
    confirmPassword: "Confirmer le mot de passe",
    createAccount: "Créer un compte",
    alreadyHaveAccount: "Vous avez déjà un compte?",
    dontHaveAccount: "Vous n'avez pas de compte?",
    username: "Nom d'utilisateur",
    profileUpdated: "Profil mis à jour",
    errorUpdatingProfile: "Erreur lors de la mise à jour du profil",
    dashboard: "Tableau de bord",
    profile: "Profil",
    chat: "Messages",
    events: "Événements",
    groups: "Groupes",
    rides: "Covoiturage",
    createEvent: "Créer un événement",
    myProfile: "Mon profil",
    editProfile: "Modifier le profil",
    languages: "Langues",
    interests: "Centres d'intérêt",
    bio: "Bio",
    saveChanges: "Enregistrer",
    cancel: "Annuler",
    origin: "Pays d'origine",
    joinGroup: "Rejoindre le groupe",
    leaveGroup: "Quitter le groupe",
    shareLocation: "Partagez votre position",
    shareLocationDesc: "Pour voir les voisins proches de vous, nous avons besoin de votre position.",
    allowLocation: "Autoriser la géolocalisation",
    locationGranted: "Position partagée",
    locationGrantedDesc: "Votre carte est maintenant centrée sur votre position.",
    locationDenied: "Accès à la position refusé",
    locationDeniedDesc: "Nous ne pouvons pas vous montrer les voisins proches sans votre position.",
    locationNotSupported: "Géolocalisation non supportée",
    locationNotSupportedDesc: "Votre navigateur ne supporte pas la géolocalisation.",
    backToConversations: "Retour aux conversations",
    noActiveConversations: "Aucune conversation active",
    // Add new translation keys for rides
    departure: "Départ",
    arrival: "Arrivée",
    availableSeats: "Places disponibles",
    createRide: "Créer un trajet"
  },
  en: {
    welcome: "Welcome to Voisin",
    neighbors: "Neighbors",
    yourLocation: "Your location",
    createdBy: "Created by",
    discover: "Discover your neighbors",
    features: "Features",
    map: "Map",
    mapDesc: "Explore your neighborhood and discover your neighbors",
    discoverNeighbors: "Discover your neighbors",
    discoverNeighborsDesc: "Connect with people in your neighborhood",
    createEvents: "Create events",
    createEventsDesc: "Organize local events and invite your neighbors",
    createGroups: "Create groups",
    createGroupsDesc: "Form communities around common interests",
    joinRides: "Carpooling",
    joinRidesDesc: "Share your daily commute with your neighbors",
    login: "Login",
    signup: "Sign Up",
    logout: "Logout",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    createAccount: "Create Account",
    alreadyHaveAccount: "Already have an account?",
    dontHaveAccount: "Don't have an account?",
    username: "Username",
    profileUpdated: "Profile updated",
    errorUpdatingProfile: "Error updating profile",
    dashboard: "Dashboard",
    profile: "Profile",
    chat: "Messages",
    events: "Events",
    groups: "Groups",
    rides: "Rides",
    createEvent: "Create Event",
    myProfile: "My Profile",
    editProfile: "Edit Profile",
    languages: "Languages",
    interests: "Interests",
    bio: "Bio",
    saveChanges: "Save Changes",
    cancel: "Cancel",
    origin: "Country of Origin",
    joinGroup: "Join Group",
    leaveGroup: "Leave Group",
    shareLocation: "Share your location",
    shareLocationDesc: "To see neighbors near you, we need your location.",
    allowLocation: "Allow Geolocation",
    locationGranted: "Location shared",
    locationGrantedDesc: "Your map is now centered on your location.",
    locationDenied: "Location access denied",
    locationDeniedDesc: "We can't show you nearby neighbors without your location.",
    locationNotSupported: "Geolocation not supported",
    locationNotSupportedDesc: "Your browser does not support geolocation.",
    backToConversations: "Back to conversations",
    noActiveConversations: "No active conversations",
    // Add new translation keys for rides
    departure: "Departure",
    arrival: "Arrival",
    availableSeats: "Available seats",
    createRide: "Create Ride"
  },
  ar: {
    welcome: "مرحبًا بك في Voisin",
    neighbors: "الجيران",
    yourLocation: "موقعك",
    createdBy: "أنشأ بواسطة",
    discover: "اكتشف جيرانك",
    features: "الميزات",
    map: "خريطة",
    mapDesc: "استكشف الحي الخاص بك واكتشف جيرانك",
    discoverNeighbors: "اكتشف جيرانك",
    discoverNeighborsDesc: "تواصل مع الأشخاص في حيك",
    createEvents: "إنشاء أحداث",
    createEventsDesc: "نظم أحداثًا محلية وادعُ جيرانك",
    createGroups: "إنشاء مجموعات",
    createGroupsDesc: "تشكيل مجتمعات حول الاهتمامات المشتركة",
    joinRides: "مشاركة السيارة",
    joinRidesDesc: "شارك رحلتك اليومية مع جيرانك",
    login: "تسجيل الدخول",
    signup: "إنشاء حساب",
    logout: "تسجيل الخروج",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    confirmPassword: "تأكيد كلمة المرور",
    createAccount: "إنشاء حساب",
    alreadyHaveAccount: "هل لديك حساب بالفعل؟",
    dontHaveAccount: "ليس لديك حساب؟",
    username: "اسم المستخدم",
    profileUpdated: "تم تحديث الملف الشخصي",
    errorUpdatingProfile: "خطأ في تحديث الملف الشخصي",
    dashboard: "لوحة القيادة",
    profile: "الملف الشخصي",
    chat: "الرسائل",
    events: "الأحداث",
    groups: "المجموعات",
    rides: "الرحلات",
    createEvent: "إنشاء حدث",
    myProfile: "ملفي الشخصي",
    editProfile: "تعديل الملف الشخصي",
    languages: "اللغات",
    interests: "الاهتمامات",
    bio: "نبذة",
    saveChanges: "حفظ التغييرات",
    cancel: "إلغاء",
    origin: "بلد المنشأ",
    joinGroup: "الانضمام إلى المجموعة",
    leaveGroup: "مغادرة المجموعة",
    shareLocation: "شارك موقعك",
    shareLocationDesc: "لرؤية الجيران بالقرب منك، نحتاج إلى موقعك.",
    allowLocation: "السماح بتحديد الموقع الجغرافي",
    locationGranted: "تم مشاركة الموقع",
    locationGrantedDesc: "الخريطة الآن متمركزة على موقعك.",
    locationDenied: "تم رفض الوصول إلى الموقع",
    locationDeniedDesc: "لا يمكننا إظهار الجيران القريبين منك بدون موقعك.",
    locationNotSupported: "تحديد الموقع الجغرافي غير مدعوم",
    locationNotSupportedDesc: "متصفحك لا يدعم تحديد الموقع الجغرافي.",
    backToConversations: "العودة إلى المحادثات",
    noActiveConversations: "لا توجد محادثات نشطة",
    // Add new translation keys for rides
    departure: "المغادرة",
    arrival: "الوصول",
    availableSeats: "المقاعد المتاحة",
    createRide: "إنشاء رحلة"
  },
  es: {
    welcome: "Bienvenido a Voisin",
    neighbors: "Vecinos",
    yourLocation: "Tu ubicación",
    createdBy: "Creado por",
    discover: "Descubre a tus vecinos",
    features: "Características",
    map: "Mapa",
    mapDesc: "Explora tu vecindario y descubre a tus vecinos",
    discoverNeighbors: "Descubre a tus vecinos",
    discoverNeighborsDesc: "Conéctate con personas de tu vecindario",
    createEvents: "Crea eventos",
    createEventsDesc: "Organiza eventos locales e invita a tus vecinos",
    createGroups: "Crea grupos",
    createGroupsDesc: "Forma comunidades en torno a intereses comunes",
    joinRides: "Viajes compartidos",
    joinRidesDesc: "Comparte tu trayecto diario con tus vecinos",
    login: "Iniciar sesión",
    signup: "Registrarse",
    logout: "Cerrar sesión",
    email: "Correo electrónico",
    password: "Contraseña",
    confirmPassword: "Confirmar contraseña",
    createAccount: "Crear cuenta",
    alreadyHaveAccount: "¿Ya tienes una cuenta?",
    dontHaveAccount: "¿No tienes una cuenta?",
    username: "Nombre de usuario",
    profileUpdated: "Perfil actualizado",
    errorUpdatingProfile: "Error al actualizar el perfil",
    dashboard: "Panel",
    profile: "Perfil",
    chat: "Mensajes",
    events: "Eventos",
    groups: "Grupos",
    rides: "Viajes",
    createEvent: "Crear evento",
    myProfile: "Mi perfil",
    editProfile: "Editar perfil",
    languages: "Idiomas",
    interests: "Intereses",
    bio: "Bio",
    saveChanges: "Guardar cambios",
    cancel: "Cancelar",
    origin: "País de origen",
    joinGroup: "Unirse al grupo",
    leaveGroup: "Dejar el grupo",
    shareLocation: "Comparte tu ubicación",
    shareLocationDesc: "Para ver a los vecinos cercanos, necesitamos tu ubicación.",
    allowLocation: "Permitir geolocalización",
    locationGranted: "Ubicación compartida",
    locationGrantedDesc: "Tu mapa ahora está centrado en tu ubicación.",
    locationDenied: "Acceso a la ubicación denegado",
    locationDeniedDesc: "No podemos mostrarte los vecinos cercanos sin tu ubicación.",
    locationNotSupported: "Geolocalización no compatible",
    locationNotSupportedDesc: "Tu navegador no admite la geolocalización.",
    backToConversations: "Volver a las conversaciones",
    noActiveConversations: "No hay conversaciones activas",
    // Add new translation keys for rides
    departure: "Salida",
    arrival: "Llegada",
    availableSeats: "Asientos disponibles",
    createRide: "Crear viaje"
  }
};

// Provider component
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<string>("fr");

  // Get translations for the current language
  const translations = translationsByLanguage[language] || translationsByLanguage.fr;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translations }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext);
