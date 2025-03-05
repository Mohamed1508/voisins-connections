
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, Globe, Menu, LogOut, User, MessageCircle, Map } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import Logo from "../ui/Logo";

const Header = () => {
  const { language, setLanguage, translations } = useLanguage();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLanguageChange = async (value: string) => {
    setLanguage(value);
    
    // If user is logged in, update their preference in the database
    if (user) {
      try {
        await fetch(`https://poddiiizllphqxhfssja.supabase.co/rest/v1/users?id=eq.${user.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvZGRpaWl6bGxwaHF4aGZzc2phIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwODk5MDQsImV4cCI6MjA1NjY2NTkwNH0.ElqC5vUzS1LnPcQu74B7ZFRY_-Nl2UUZdTKXsvmgRz4',
            'Authorization': `Bearer ${user.id}`,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({ ui_language: value })
        });
      } catch (error) {
        console.error("Error updating language preference:", error);
      }
    }
  };

  return (
    <header className="py-4 px-6 bg-background border-b border-border flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2">
        <Logo className="h-10 w-10" />
        <div className="font-semibold text-xl">Voisins Proches</div>
      </Link>

      <div className="flex items-center gap-4">
        <Select value={language} onValueChange={handleLanguageChange}>
          <SelectTrigger className="w-[120px]">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <SelectValue placeholder={translations.selectLanguage} />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fr">Français</SelectItem>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="ar">العربية</SelectItem>
            <SelectItem value="es">Español</SelectItem>
          </SelectContent>
        </Select>

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar>
                  <AvatarImage src="/placeholder.svg" alt="Avatar" />
                  <AvatarFallback>VP</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate(`/profile/${user.id}`)}>
                <User className="mr-2 h-4 w-4" />
                <span>Profil</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                <Map className="mr-2 h-4 w-4" />
                <span>Tableau de bord</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/chat')}>
                <MessageCircle className="mr-2 h-4 w-4" />
                <span>Messages</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/community-spots')}>
                <MapPin className="mr-2 h-4 w-4" />
                <span>Spots communautaires</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Déconnexion</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate('/login')}>
              Connexion
            </Button>
            <Button size="sm" onClick={() => navigate('/signup')}>
              Inscription
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
