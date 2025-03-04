
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, MessageCircle, Calendar, ArrowLeft } from "lucide-react";
import { ProfileCard } from "@/components/profile/ProfileCard";
import { useToast } from "@/hooks/use-toast";

// Simulation de données utilisateur (à remplacer par des données réelles)
const mockUserData = {
  id: "1",
  name: "Sophie Martin",
  bio: "Passionnée de jardinage et de cuisine. Toujours prête à échanger des conseils ou des plantes !",
  distance: "350m",
  joinedDate: "Mars 2023",
  avatarUrl: "/placeholder.svg",
};

const ProfilePage = () => {
  const { userId } = useParams();
  const { toast } = useToast();
  const [isContactButtonLoading, setIsContactButtonLoading] = useState(false);
  
  // Dans une vraie application, vous utiliseriez userId pour charger les données de l'utilisateur
  const userData = mockUserData;

  const handleContactUser = async () => {
    setIsContactButtonLoading(true);
    try {
      // Simulation d'envoi de message (à remplacer par une vraie API)
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Message envoyé !",
        description: `Vous avez démarré une conversation avec ${userData.name}.`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le message. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsContactButtonLoading(false);
    }
  };

  return (
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
                <AvatarImage src={userData.avatarUrl} alt={userData.name} />
                <AvatarFallback>{userData.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{userData.name}</CardTitle>
                <CardDescription className="flex items-center mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>À {userData.distance} de chez vous</span>
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pb-6">
          <div className="flex items-center text-muted-foreground text-sm mb-4">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Membre depuis {userData.joinedDate}</span>
          </div>
          
          <Separator className="my-4" />
          
          <div>
            <h3 className="font-semibold mb-2">À propos</h3>
            <p className="text-muted-foreground">{userData.bio}</p>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={handleContactUser}
            disabled={isContactButtonLoading}
          >
            {isContactButtonLoading ? (
              "Envoi en cours..."
            ) : (
              <>
                <MessageCircle className="mr-2 h-4 w-4" />
                Contacter {userData.name.split(' ')[0]}
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

const Separator = ({ className }: { className?: string }) => {
  return <div className={`h-px bg-border ${className || ''}`} />;
};

export default ProfilePage;
