
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Types de langues supportées
type SupportedLanguage = 'fr' | 'en' | 'ar' | 'es';

// Structure des traductions
type Translations = {
  // Navigation et layout
  appName: string;
  home: string;
  dashboard: string;
  profile: string;
  messages: string;
  communitySpots: string;
  groups: string;
  signIn: string;
  signUp: string;
  logout: string;
  
  // Accueil
  welcome: string;
  subtitle: string;
  getStarted: string;
  featuresTitle: string;
  feature1Title: string;
  feature1Description: string;
  feature2Title: string;
  feature2Description: string;
  feature3Title: string;
  feature3Description: string;
  
  // Authentification
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  forgotPassword: string;
  alreadyHaveAccount: string;
  dontHaveAccount: string;
  
  // Tableau de bord
  welcomeBack: string;
  nearbyNeighbors: string;
  upcomingEvents: string;
  messages: string;
  newMessage: string;
  noMessages: string;
  
  // Profil
  editProfile: string;
  bio: string;
  location: string;
  save: string;
  cancel: string;
  originCountry: string;
  
  // Carte
  yourLocation: string;
  searchRadius: string;
  neighbors: string;
  events: string;
  
  // Messages
  send: string;
  typeMessage: string;
  
  // Événements
  createEvent: string;
  eventName: string;
  date: string;
  time: string;
  description: string;
  locationNote: string;
  createdBy: string;
  
  // Lieux communautaires
  createSpot: string;
  spotName: string;
  spotDescription: string;
  spotOriginRelated: string;
  
  // Groupes
  createGroup: string;
  groupName: string;
  groupDescription: string;
  joinGroup: string;
  leaveGroup: string;
  myGroups: string;
  availableGroups: string;
  members: string;
  member: string;
  admin: string;
  
  // Footer
  about: string;
  community: string;
  privacy: string;
  terms: string;
  contact: string;
  copyright: string;
  madeWith: string;
};

// Interface du contexte
interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  translations: Translations;
  isRTL: boolean;
}

// Les traductions
const translationsData: Record<SupportedLanguage, Translations> = {
  fr: {
    // Navigation et layout
    appName: 'Voisins Proches',
    home: 'Accueil',
    dashboard: 'Tableau de bord',
    profile: 'Profil',
    messages: 'Messages',
    communitySpots: 'Lieux communautaires',
    groups: 'Groupes',
    signIn: 'Connexion',
    signUp: 'Inscription',
    logout: 'Déconnexion',
    
    // Accueil
    welcome: 'Bienvenue sur Voisins Proches',
    subtitle: 'Connectez-vous avec vos voisins du monde entier',
    getStarted: 'Commencer',
    featuresTitle: 'Nos fonctionnalités',
    feature1Title: 'Rencontrez vos voisins',
    feature1Description: 'Découvrez les personnes qui vivent près de chez vous, en particulier celles qui partagent votre pays d\'origine',
    feature2Title: 'Événements locaux',
    feature2Description: 'Créez et participez à des événements dans votre quartier',
    feature3Title: 'Groupes d\'intérêt',
    feature3Description: 'Rejoignez des groupes basés sur des intérêts communs ou votre pays d\'origine',
    
    // Authentification
    email: 'Email',
    password: 'Mot de passe',
    confirmPassword: 'Confirmer le mot de passe',
    name: 'Nom',
    forgotPassword: 'Mot de passe oublié ?',
    alreadyHaveAccount: 'Vous avez déjà un compte ?',
    dontHaveAccount: 'Vous n\'avez pas de compte ?',
    
    // Tableau de bord
    welcomeBack: 'Bon retour',
    nearbyNeighbors: 'Voisins à proximité',
    upcomingEvents: 'Événements à venir',
    newMessage: 'Nouveau message',
    noMessages: 'Pas de messages',
    
    // Profil
    editProfile: 'Modifier le profil',
    bio: 'Bio',
    location: 'Localisation',
    save: 'Enregistrer',
    cancel: 'Annuler',
    originCountry: 'Pays d\'origine',
    
    // Carte
    yourLocation: 'Votre position',
    searchRadius: 'Rayon de recherche',
    neighbors: 'Voisins',
    events: 'Événements',
    
    // Messages
    send: 'Envoyer',
    typeMessage: 'Tapez votre message...',
    
    // Événements
    createEvent: 'Créer un événement',
    eventName: 'Nom de l\'événement',
    date: 'Date',
    time: 'Heure',
    description: 'Description',
    locationNote: 'L\'événement sera créé à votre position actuelle sur la carte',
    createdBy: 'Créé par',
    
    // Lieux communautaires
    createSpot: 'Ajouter un lieu',
    spotName: 'Nom du lieu',
    spotDescription: 'Description du lieu',
    spotOriginRelated: 'Lié au pays d\'origine',
    
    // Groupes
    createGroup: 'Créer un groupe',
    groupName: 'Nom du groupe',
    groupDescription: 'Description du groupe',
    joinGroup: 'Rejoindre',
    leaveGroup: 'Quitter',
    myGroups: 'Mes groupes',
    availableGroups: 'Groupes disponibles',
    members: 'Membres',
    member: 'Membre',
    admin: 'Admin',
    
    // Footer
    about: 'À propos',
    community: 'Communauté',
    privacy: 'Confidentialité',
    terms: 'Conditions',
    contact: 'Contact',
    copyright: '© 2023 Voisins Proches. Tous droits réservés.',
    madeWith: 'Fait avec ❤️',
  },
  
  en: {
    // Navigation et layout
    appName: 'Close Neighbors',
    home: 'Home',
    dashboard: 'Dashboard',
    profile: 'Profile',
    messages: 'Messages',
    communitySpots: 'Community Spots',
    groups: 'Groups',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    logout: 'Logout',
    
    // Accueil
    welcome: 'Welcome to Close Neighbors',
    subtitle: 'Connect with your neighbors from around the world',
    getStarted: 'Get Started',
    featuresTitle: 'Our Features',
    feature1Title: 'Meet Your Neighbors',
    feature1Description: 'Discover people who live near you, especially those who share your country of origin',
    feature2Title: 'Local Events',
    feature2Description: 'Create and participate in events in your neighborhood',
    feature3Title: 'Interest Groups',
    feature3Description: 'Join groups based on common interests or your country of origin',
    
    // Authentification
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    name: 'Name',
    forgotPassword: 'Forgot Password?',
    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount: 'Don\'t have an account?',
    
    // Tableau de bord
    welcomeBack: 'Welcome Back',
    nearbyNeighbors: 'Nearby Neighbors',
    upcomingEvents: 'Upcoming Events',
    newMessage: 'New Message',
    noMessages: 'No Messages',
    
    // Profil
    editProfile: 'Edit Profile',
    bio: 'Bio',
    location: 'Location',
    save: 'Save',
    cancel: 'Cancel',
    originCountry: 'Country of Origin',
    
    // Carte
    yourLocation: 'Your Location',
    searchRadius: 'Search Radius',
    neighbors: 'Neighbors',
    events: 'Events',
    
    // Messages
    send: 'Send',
    typeMessage: 'Type your message...',
    
    // Événements
    createEvent: 'Create Event',
    eventName: 'Event Name',
    date: 'Date',
    time: 'Time',
    description: 'Description',
    locationNote: 'Event will be created at your current location on the map',
    createdBy: 'Created by',
    
    // Lieux communautaires
    createSpot: 'Add Spot',
    spotName: 'Spot Name',
    spotDescription: 'Spot Description',
    spotOriginRelated: 'Related to country of origin',
    
    // Groupes
    createGroup: 'Create Group',
    groupName: 'Group Name',
    groupDescription: 'Group Description',
    joinGroup: 'Join',
    leaveGroup: 'Leave',
    myGroups: 'My Groups',
    availableGroups: 'Available Groups',
    members: 'Members',
    member: 'Member',
    admin: 'Admin',
    
    // Footer
    about: 'About',
    community: 'Community',
    privacy: 'Privacy',
    terms: 'Terms',
    contact: 'Contact',
    copyright: '© 2023 Close Neighbors. All rights reserved.',
    madeWith: 'Made with ❤️',
  },
  
  ar: {
    // Navigation et layout
    appName: 'الجيران القريبون',
    home: 'الرئيسية',
    dashboard: 'لوحة التحكم',
    profile: 'الملف الشخصي',
    messages: 'الرسائل',
    communitySpots: 'الأماكن المجتمعية',
    groups: 'المجموعات',
    signIn: 'تسجيل الدخول',
    signUp: 'التسجيل',
    logout: 'تسجيل الخروج',
    
    // Accueil
    welcome: 'مرحبًا بك في الجيران القريبون',
    subtitle: 'تواصل مع جيرانك من جميع أنحاء العالم',
    getStarted: 'ابدأ الآن',
    featuresTitle: 'ميزاتنا',
    feature1Title: 'تعرف على جيرانك',
    feature1Description: 'اكتشف الأشخاص الذين يعيشون بالقرب منك، خاصة أولئك الذين يشاركونك بلد المنشأ',
    feature2Title: 'الأحداث المحلية',
    feature2Description: 'إنشاء والمشاركة في الأحداث في حيك',
    feature3Title: 'مجموعات الاهتمام',
    feature3Description: 'انضم إلى مجموعات بناءً على الاهتمامات المشتركة أو بلد المنشأ',
    
    // Authentification
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    confirmPassword: 'تأكيد كلمة المرور',
    name: 'الاسم',
    forgotPassword: 'نسيت كلمة المرور؟',
    alreadyHaveAccount: 'هل لديك حساب بالفعل؟',
    dontHaveAccount: 'ليس لديك حساب؟',
    
    // Tableau de bord
    welcomeBack: 'مرحبًا بعودتك',
    nearbyNeighbors: 'الجيران القريبون',
    upcomingEvents: 'الأحداث القادمة',
    newMessage: 'رسالة جديدة',
    noMessages: 'لا توجد رسائل',
    
    // Profil
    editProfile: 'تعديل الملف الشخصي',
    bio: 'السيرة الذاتية',
    location: 'الموقع',
    save: 'حفظ',
    cancel: 'إلغاء',
    originCountry: 'بلد المنشأ',
    
    // Carte
    yourLocation: 'موقعك',
    searchRadius: 'نطاق البحث',
    neighbors: 'الجيران',
    events: 'الأحداث',
    
    // Messages
    send: 'إرسال',
    typeMessage: 'اكتب رسالتك...',
    
    // Événements
    createEvent: 'إنشاء حدث',
    eventName: 'اسم الحدث',
    date: 'التاريخ',
    time: 'الوقت',
    description: 'الوصف',
    locationNote: 'سيتم إنشاء الحدث في موقعك الحالي على الخريطة',
    createdBy: 'أنشأه',
    
    // Lieux communautaires
    createSpot: 'إضافة مكان',
    spotName: 'اسم المكان',
    spotDescription: 'وصف المكان',
    spotOriginRelated: 'متعلق ببلد المنشأ',
    
    // Groupes
    createGroup: 'إنشاء مجموعة',
    groupName: 'اسم المجموعة',
    groupDescription: 'وصف المجموعة',
    joinGroup: 'انضمام',
    leaveGroup: 'مغادرة',
    myGroups: 'مجموعاتي',
    availableGroups: 'المجموعات المتاحة',
    members: 'الأعضاء',
    member: 'عضو',
    admin: 'مسؤول',
    
    // Footer
    about: 'حول',
    community: 'المجتمع',
    privacy: 'الخصوصية',
    terms: 'الشروط',
    contact: 'اتصل بنا',
    copyright: '© 2023 الجيران القريبون. جميع الحقوق محفوظة.',
    madeWith: 'صنع بـ ❤️',
  },
  
  es: {
    // Navigation et layout
    appName: 'Vecinos Cercanos',
    home: 'Inicio',
    dashboard: 'Panel',
    profile: 'Perfil',
    messages: 'Mensajes',
    communitySpots: 'Lugares comunitarios',
    groups: 'Grupos',
    signIn: 'Iniciar sesión',
    signUp: 'Registrarse',
    logout: 'Cerrar sesión',
    
    // Accueil
    welcome: 'Bienvenido a Vecinos Cercanos',
    subtitle: 'Conéctate con tus vecinos de todo el mundo',
    getStarted: 'Comenzar',
    featuresTitle: 'Nuestras características',
    feature1Title: 'Conoce a tus vecinos',
    feature1Description: 'Descubre personas que viven cerca de ti, especialmente aquellas que comparten tu país de origen',
    feature2Title: 'Eventos locales',
    feature2Description: 'Crea y participa en eventos en tu vecindario',
    feature3Title: 'Grupos de interés',
    feature3Description: 'Únete a grupos basados en intereses comunes o tu país de origen',
    
    // Authentification
    email: 'Correo electrónico',
    password: 'Contraseña',
    confirmPassword: 'Confirmar contraseña',
    name: 'Nombre',
    forgotPassword: '¿Olvidaste tu contraseña?',
    alreadyHaveAccount: '¿Ya tienes una cuenta?',
    dontHaveAccount: '¿No tienes una cuenta?',
    
    // Tableau de bord
    welcomeBack: 'Bienvenido de nuevo',
    nearbyNeighbors: 'Vecinos cercanos',
    upcomingEvents: 'Próximos eventos',
    newMessage: 'Nuevo mensaje',
    noMessages: 'No hay mensajes',
    
    // Profil
    editProfile: 'Editar perfil',
    bio: 'Biografía',
    location: 'Ubicación',
    save: 'Guardar',
    cancel: 'Cancelar',
    originCountry: 'País de origen',
    
    // Carte
    yourLocation: 'Tu ubicación',
    searchRadius: 'Radio de búsqueda',
    neighbors: 'Vecinos',
    events: 'Eventos',
    
    // Messages
    send: 'Enviar',
    typeMessage: 'Escribe tu mensaje...',
    
    // Événements
    createEvent: 'Crear evento',
    eventName: 'Nombre del evento',
    date: 'Fecha',
    time: 'Hora',
    description: 'Descripción',
    locationNote: 'El evento se creará en tu ubicación actual en el mapa',
    createdBy: 'Creado por',
    
    // Lieux communautaires
    createSpot: 'Añadir lugar',
    spotName: 'Nombre del lugar',
    spotDescription: 'Descripción del lugar',
    spotOriginRelated: 'Relacionado con el país de origen',
    
    // Groupes
    createGroup: 'Crear grupo',
    groupName: 'Nombre del grupo',
    groupDescription: 'Descripción del grupo',
    joinGroup: 'Unirse',
    leaveGroup: 'Salir',
    myGroups: 'Mis grupos',
    availableGroups: 'Grupos disponibles',
    members: 'Miembros',
    member: 'Miembro',
    admin: 'Admin',
    
    // Footer
    about: 'Acerca de',
    community: 'Comunidad',
    privacy: 'Privacidad',
    terms: 'Términos',
    contact: 'Contacto',
    copyright: '© 2023 Vecinos Cercanos. Todos los derechos reservados.',
    madeWith: 'Hecho con ❤️',
  },
};

// Création du contexte
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Provider component
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<SupportedLanguage>('fr');
  
  const isRTL = language === 'ar';
  
  // Fournir le contexte à l'application
  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      translations: translationsData[language],
      isRTL,
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook personnalisé pour utiliser ce contexte
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
