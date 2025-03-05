
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Menu, X, User, MessageCircle, LogOut, MapPin, Users } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { useAuth } from "@/context/AuthContext";
import { useLanguage, LanguageType } from "@/context/LanguageContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { language, setLanguage, translations } = useLanguage();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang as LanguageType);
  };

  return (
    <header className="bg-background w-full border-b shadow-sm">
      <div className="container mx-auto px-4 py-3 sm:px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <Logo className="h-8 w-auto" />
        </Link>

        {/* Menu de navigation pour grand écrans */}
        <nav className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <Link to="/dashboard" className="text-foreground hover:text-primary transition-colors">
                {translations.dashboard}
              </Link>
              <Link to="/community-spots" className="text-foreground hover:text-primary transition-colors">
                {translations.communitySpots}
              </Link>
              <Link to="/groups" className="text-foreground hover:text-primary transition-colors">
                {translations.groups}
              </Link>
              <Link to="/chat" className="text-foreground hover:text-primary transition-colors">
                {translations.chats}
              </Link>
              <Link to={`/profile/${user.id}`} className="text-foreground hover:text-primary transition-colors">
                {translations.profile}
              </Link>
              <Button 
                variant="ghost"
                onClick={() => signOut()}
                className="text-foreground hover:text-primary"
              >
                {translations.logout}
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline">
                  {translations.login}
                </Button>
              </Link>
              <Link to="/signup">
                <Button>
                  {translations.signup}
                </Button>
              </Link>
            </>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {language.toUpperCase()}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleLanguageChange('fr')}>Français</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleLanguageChange('en')}>English</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleLanguageChange('es')}>Español</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleLanguageChange('de')}>Deutsch</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Bouton du menu mobile */}
        <button 
          className="md:hidden text-foreground focus:outline-none"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Menu mobile */}
      {isMenuOpen && (
        <div className="md:hidden py-4 px-6 border-t">
          <nav className="flex flex-col space-y-3">
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="flex items-center gap-2 py-2 hover:text-primary transition-colors"
                  onClick={toggleMenu}
                >
                  <MapPin size={18} />
                  {translations.dashboard}
                </Link>
                <Link 
                  to="/community-spots" 
                  className="flex items-center gap-2 py-2 hover:text-primary transition-colors"
                  onClick={toggleMenu}
                >
                  <MapPin size={18} />
                  {translations.communitySpots}
                </Link>
                <Link 
                  to="/groups" 
                  className="flex items-center gap-2 py-2 hover:text-primary transition-colors"
                  onClick={toggleMenu}
                >
                  <Users size={18} />
                  {translations.groups}
                </Link>
                <Link 
                  to="/chat" 
                  className="flex items-center gap-2 py-2 hover:text-primary transition-colors"
                  onClick={toggleMenu}
                >
                  <MessageCircle size={18} />
                  {translations.chats}
                </Link>
                <Link 
                  to={`/profile/${user.id}`} 
                  className="flex items-center gap-2 py-2 hover:text-primary transition-colors"
                  onClick={toggleMenu}
                >
                  <User size={18} />
                  {translations.profile}
                </Link>
                <Button 
                  variant="ghost"
                  onClick={() => {
                    signOut();
                    toggleMenu();
                  }}
                  className="flex items-center justify-start gap-2 py-2 hover:text-primary"
                >
                  <LogOut size={18} />
                  {translations.logout}
                </Button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="py-2 hover:text-primary transition-colors"
                  onClick={toggleMenu}
                >
                  {translations.login}
                </Link>
                <Link 
                  to="/signup" 
                  className="py-2 hover:text-primary transition-colors"
                  onClick={toggleMenu}
                >
                  {translations.signup}
                </Link>
              </>
            )}
            
            <div className="py-2">
              <p className="text-sm text-muted-foreground mb-2">{translations.language}:</p>
              <div className="flex gap-2">
                <Button 
                  variant={language === 'fr' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => {
                    handleLanguageChange('fr');
                    toggleMenu();
                  }}
                >
                  FR
                </Button>
                <Button 
                  variant={language === 'en' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => {
                    handleLanguageChange('en');
                    toggleMenu();
                  }}
                >
                  EN
                </Button>
                <Button 
                  variant={language === 'es' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => {
                    handleLanguageChange('es');
                    toggleMenu();
                  }}
                >
                  ES
                </Button>
                <Button 
                  variant={language === 'de' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => {
                    handleLanguageChange('de');
                    toggleMenu();
                  }}
                >
                  DE
                </Button>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
