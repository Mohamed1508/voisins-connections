
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, MessageCircle, Calendar, ArrowLeft, Edit, Globe, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/context/LanguageContext";
import EditProfileModal from "@/components/profile/EditProfileModal";
import Header from "@/components/layout/Header";

// Liste des langues et pays pour l'affichage
const LANGUAGES = {
  fr: "Français",
  en: "Anglais",
  ar: "Arabe",
  es: "Espagnol",
  de: "Allemand",
  zh: "Chinois",
  pt: "Portugais",
  ru: "Russe",
  ja: "Japonais",
  it: "Italien"
};

const COUNTRIES = {
  FR: "France",
  DZ: "Algérie",
  MA: "Maroc",
  TN: "Tunisie",
  DE: "Allemagne",
  IT: "Italie",
  ES: "Espagne",
  GB: "Royaume-Uni",
  US: "États-Unis",
  SN: "Sénégal",
  CM: "Cameroun",
  CI: "Côte d'Ivoire",
};

const ProfilePage = () => {
  const { userId } = useParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const { translations } = useLanguage();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isContactButtonLoading, setIsContactButtonLoading] = useState(false);
  
  const isOwnProfile = user && userId === user.id;

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) throw error;
      
      setUserData(data);
    } catch (error: any) {
      console.error("Error fetching user data:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données de l'utilisateur.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleContactUser = async () => {
    setIsContactButtonLoading(true);
    try {
      navigate(`/chat/${userId}`);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ouvrir la conversation. Veuillez réessayer.",
        variant: "destructive",
      });
      setIsContactButtonLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="container mx-auto p-4 max-w-2xl">
          <div className="flex justify-center items-center h-48">
            <p>Chargement du profil...</p>
          </div>
        </div>
      </>
    );
  }

  if (!userData) {
    return (
      <>
        <Header />
        <div className="container mx-auto p-4 max-w-2xl">
          <div className="mb-4">
            <Link 
              to="/dashboard" 
              className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour au tableau de bord
            </Link>
          </div>
          
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">Profil non trouvé</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => navigate('/dashboard')}
              >
                Retour au tableau de bord
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container mx-auto p-4 max-w-2xl">
        <div className="mb-4">
          <Link 
            to="/dashboard" 
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au tableau de bord
          </Link>
        </div>
        
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={userData.avatar_url} alt={userData.username} />
                  <AvatarFallback>{userData.username?.slice(0, 2).toUpperCase() || "VP"}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">{userData.username}</CardTitle>
                  {userData.lat && userData.lng && (
                    <CardDescription className="flex items-center mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>À proximité</span>
                    </CardDescription>
                  )}
                </div>
              </div>
              
              {isOwnProfile && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsEditModalOpen(true)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="pb-6">
            <div className="flex items-center text-muted-foreground text-sm mb-4">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Membre depuis {new Date(userData.created_at).toLocaleDateString()}</span>
            </div>
            
            {userData.origin_country && (
              <div className="flex items-center mb-4">
                <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Origine : {COUNTRIES[userData.origin_country as keyof typeof COUNTRIES] || userData.origin_country}</span>
              </div>
            )}
            
            {userData.languages && userData.languages.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Langues parlées :</h4>
                <div className="flex flex-wrap gap-2">
                  {userData.languages.map((lang: string) => (
                    <Badge key={lang} variant="outline">
                      {LANGUAGES[lang as keyof typeof LANGUAGES] || lang}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {userData.interests && userData.interests.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Centres d'intérêt :</h4>
                <div className="flex flex-wrap gap-2">
                  {userData.interests.map((interest: string) => (
                    <Badge key={interest} variant="secondary" className="flex items-center">
                      <Heart className="h-3 w-3 mr-1" />
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            <Separator className="my-4" />
            
            <div>
              <h3 className="font-semibold mb-2">À propos</h3>
              <p className="text-muted-foreground">{userData.bio || "Aucune information fournie."}</p>
            </div>
          </CardContent>
          
          {!isOwnProfile && (
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={handleContactUser}
                disabled={isContactButtonLoading}
              >
                {isContactButtonLoading ? (
                  "Ouverture de la conversation..."
                ) : (
                  <>
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Contacter {userData.username.split(' ')[0]}
                  </>
                )}
              </Button>
            </CardFooter>
          )}
        </Card>
        
        {isOwnProfile && isEditModalOpen && (
          <EditProfileModal 
            open={isEditModalOpen} 
            onClose={() => {
              setIsEditModalOpen(false);
              // Reload user data after closing the modal
              fetchUserData();
            }} 
          />
        )}
      </div>
    </>
  );
};

const Separator = ({ className }: { className?: string }) => {
  return <div className={`h-px bg-border ${className || ''}`} />;
};

export default ProfilePage;
