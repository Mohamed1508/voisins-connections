
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import Logo from "@/components/ui/Logo";
import { MapPin, MessageCircle, User, Map, Users, Car } from "lucide-react";

const Navbar = () => {
  const { user, signOut } = useAuth();
  const { translations } = useLanguage();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const NavLink = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => (
    <Link
      to={to}
      className={`flex items-center gap-2 py-2 px-3 rounded-md transition-colors ${
        isActive(to)
          ? "bg-primary/10 text-primary font-medium"
          : "text-muted-foreground hover:bg-secondary"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );

  return (
    <div className="bg-background border-b border-border sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center">
            <Logo className="h-8 w-auto" />
          </Link>
        </div>

        {user ? (
          <nav className="flex items-center gap-1">
            <NavLink
              to="/dashboard"
              icon={<Map size={18} />}
              label={translations.dashboard}
            />
            <NavLink
              to="/community-spots"
              icon={<MapPin size={18} />}
              label={translations.communitySpots}
            />
            <NavLink
              to="/groups"
              icon={<Users size={18} />}
              label={translations.groups}
            />
            <NavLink
              to="/rides"
              icon={<Car size={18} />}
              label={translations.rides}
            />
            <NavLink
              to="/chat"
              icon={<MessageCircle size={18} />}
              label={translations.chats}
            />
            <NavLink
              to={`/profile/${user.id}`}
              icon={<User size={18} />}
              label={translations.profile}
            />
            <Button variant="ghost" size="sm" onClick={() => signOut()}>
              {translations.logout}
            </Button>
          </nav>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="outline" size="sm">{translations.login}</Button>
            </Link>
            <Link to="/signup">
              <Button size="sm">{translations.signUp}</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
