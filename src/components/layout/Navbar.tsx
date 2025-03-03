
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X, User } from "lucide-react";
import Logo from "@/components/ui/Logo";
import AuthModal from "@/components/auth/AuthModal";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Simule la connexion lorsque l'utilisateur se connecte via le modal
  const handleAuthSuccess = () => {
    setIsLoggedIn(true);
    setIsAuthOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center">
          <Logo />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
            Accueil
          </Link>
          <Link to="/neighbors" className="text-sm font-medium transition-colors hover:text-primary">
            Voisins
          </Link>
          <Link to="/messages" className="text-sm font-medium transition-colors hover:text-primary">
            Messages
          </Link>
          {isLoggedIn ? (
            <Link to="/profile">
              <Button variant="outline" size="sm" className="gap-2">
                <User size={16} />
                <span>Profil</span>
              </Button>
            </Link>
          ) : (
            <Button size="sm" onClick={() => setIsAuthOpen(true)}>
              Se connecter
            </Button>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-b border-border animate-slide-in">
          <div className="container mx-auto px-4 py-4 space-y-3">
            <Link 
              to="/" 
              className="block py-2 text-base font-medium transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Accueil
            </Link>
            <Link 
              to="/neighbors" 
              className="block py-2 text-base font-medium transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Voisins
            </Link>
            <Link 
              to="/messages" 
              className="block py-2 text-base font-medium transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Messages
            </Link>
            {isLoggedIn ? (
              <Link 
                to="/profile" 
                className="block py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                  <User size={16} />
                  <span>Profil</span>
                </Button>
              </Link>
            ) : (
              <Button 
                size="sm" 
                className="w-full mt-2" 
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsAuthOpen(true);
                }}
              >
                Se connecter
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onSuccess={handleAuthSuccess} 
      />
    </header>
  );
};

export default Navbar;
