
import { Link } from "react-router-dom";
import { MapPin, Heart, Car, Users, MessageCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const Footer = () => {
  const { translations, language } = useLanguage();
  
  const footerTranslations = {
    fr: {
      description: "Une application pour connecter les personnes partageant des origines similaires dans le même quartier.",
      community: "Communauté",
      communitySpots: "Spots communautaires",
      privacy: "Confidentialité",
      terms: "Conditions d'utilisation",
      contact: "Contact",
      copyright: "Tous droits réservés",
      madeWith: "Fait avec"
    },
    en: {
      description: "An application to connect people with similar origins in the same neighborhood.",
      community: "Community",
      communitySpots: "Community Spots",
      privacy: "Privacy",
      terms: "Terms of Service",
      contact: "Contact",
      copyright: "All rights reserved",
      madeWith: "Made with"
    },
    ar: {
      description: "تطبيق لربط الأشخاص ذوي الأصول المتشابهة في نفس الحي.",
      community: "المجتمع",
      communitySpots: "أماكن المجتمع",
      privacy: "الخصوصية",
      terms: "شروط الاستخدام",
      contact: "اتصل بنا",
      copyright: "جميع الحقوق محفوظة",
      madeWith: "صنع بـ"
    },
    es: {
      description: "Una aplicación para conectar personas con orígenes similares en el mismo barrio.",
      community: "Comunidad",
      communitySpots: "Lugares comunitarios",
      privacy: "Privacidad",
      terms: "Términos de uso",
      contact: "Contacto",
      copyright: "Todos los derechos reservados",
      madeWith: "Hecho con"
    }
  };
  
  // Use the current language or fallback to English
  const currentLanguage = language || 'en';
  const t = footerTranslations[currentLanguage as keyof typeof footerTranslations] || footerTranslations.en;
  
  return (
    <footer className="bg-secondary py-10 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <MapPin className="h-5 w-5 text-primary mr-2" />
              <span className="text-lg font-bold">Voisins Proches</span>
            </div>
            <p className="text-muted-foreground max-w-xs">
              {t.description}
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">{t.community}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {translations.dashboard}
                </Link>
              </li>
              <li>
                <Link to="/community-spots" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {t.communitySpots}
                </Link>
              </li>
              <li>
                <Link to="/chat" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  {translations.chats}
                </Link>
              </li>
              <li>
                <Link to="/groups" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {translations.groups}
                </Link>
              </li>
              <li>
                <Link to="/rides" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  {translations.carpooling}
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">{t.contact}</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t.privacy}
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t.terms}
                </a>
              </li>
              <li>
                <a href="mailto:contact@voisinsproches.com" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t.contact}
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Voisins Proches. {t.copyright}.
          </p>
          <p className="text-sm text-muted-foreground flex items-center mt-4 md:mt-0">
            {t.madeWith} <Heart className="h-4 w-4 text-red-500 mx-1" /> 
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
