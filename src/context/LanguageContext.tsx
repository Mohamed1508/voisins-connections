
import React, { createContext, useContext, useState, ReactNode } from "react";

export type SupportedLanguage = "en" | "fr";

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
  dashboard: "Dashboard"
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
  dashboard: "Tableau de bord"
};

const messages = {
  en: englishMessages,
  fr: frenchMessages
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
