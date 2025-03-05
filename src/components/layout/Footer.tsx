
import React from "react";
import { Link } from "react-router-dom";
import { Github, Heart, Twitter } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import Logo from "../ui/Logo";

const Footer = () => {
  const { language } = useLanguage();

  const translations = {
    fr: {
      description: "Connectez-vous avec vos voisins et créez une communauté locale vivante.",
      community: "Communauté",
      privacy: "Confidentialité",
      terms: "Conditions",
      contact: "Contact",
      copyright: "© 2023 Voisins Proches. Tous droits réservés.",
      madeWith: "Fait avec"
    },
    en: {
      description: "Connect with your neighbors and create a vibrant local community.",
      community: "Community",
      privacy: "Privacy",
      terms: "Terms",
      contact: "Contact",
      copyright: "© 2023 Voisins Proches. All rights reserved.",
      madeWith: "Made with"
    },
    ar: {
      description: "تواصل مع جيرانك وأنشئ مجتمعًا محليًا نابضًا بالحياة.",
      community: "المجتمع",
      privacy: "الخصوصية",
      terms: "الشروط",
      contact: "تواصل معنا",
      copyright: "© 2023 فوازان بروش. جميع الحقوق محفوظة.",
      madeWith: "صنع بـ"
    },
    es: {
      description: "Conéctate con tus vecinos y crea una comunidad local vibrante.",
      community: "Comunidad",
      privacy: "Privacidad",
      terms: "Términos",
      contact: "Contacto",
      copyright: "© 2023 Voisins Proches. Todos los derechos reservados.",
      madeWith: "Hecho con"
    }
  };

  const t = translations[language as keyof typeof translations];

  return (
    <footer className="bg-background border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2">
              <Logo className="h-10 w-10" />
              <div className="font-semibold text-xl">Voisins Proches</div>
            </div>
            <p className="mt-4 text-muted-foreground max-w-xs">
              {t.description}
            </p>
            <div className="flex gap-4 mt-6">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter size={20} />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Github size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">{t.community}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/community-spots" className="text-muted-foreground hover:text-primary transition-colors">
                  {translations[language as keyof typeof translations].communitySpots}
                </Link>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">{t.contact}</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  {t.privacy}
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  {t.terms}
                </a>
              </li>
              <li>
                <a href="mailto:contact@voisinsproches.org" className="text-muted-foreground hover:text-primary transition-colors">
                  contact@voisinsproches.org
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-10 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">{t.copyright}</p>
          <p className="text-sm text-muted-foreground flex items-center mt-4 md:mt-0">
            {t.madeWith} <Heart className="h-4 w-4 mx-1 text-red-500" /> Paris, France
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
