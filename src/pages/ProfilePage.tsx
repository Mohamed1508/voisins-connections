
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, MessageCircle, Calendar, ArrowLeft, Edit, Globe, Heart, Upload, X, Image as ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/context/LanguageContext";
import EditProfileModal from "@/components/profile/EditProfileModal";
import Header from "@/components/layout/Header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

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
  const { user, uploadProfileImage, uploadNeighborhoodImage, updateProfile } = useAuth();
  const { translations } = useLanguage();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isContactButtonLoading, setIsContactButtonLoading] = useState(false);
  const [isNeighborhoodModalOpen, setIsNeighborhoodModalOpen] = useState(false);
  const [neighborhoodImages, setNeighborhoodImages] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  
  const isOwnProfile = user && (!userId || userId === user.id);

  useEffect(() => {
    fetchUserData();
  }, [userId, user]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      const fetchId = userId || (user ? user.id : null);
      if (!fetchId) {
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', fetchId)
        .single();
        
      if (error) throw error;
      
      setUserData(data);
      
      // Check if the user has metadata with neighborhood images
      if (user && isOwnProfile) {
        const { data } = await supabase.auth.getUser();
        const neighborhoodImagesList = data.user?.user_metadata?.neighborhood_images || [];
        setNeighborhoodImages(neighborhoodImagesList);
      }
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
  
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    try {
      setIsSaving(true);
      const file = e.target.files[0];
      const avatarUrl = await uploadProfileImage(file);
      
      if (avatarUrl) {
        await updateProfile({
          avatar_url: avatarUrl
        });
        
        // Refresh user data
        fetchUserData();
        
        toast({
          title: "Photo de profil mise à jour",
          description: "Votre photo de profil a été mise à jour avec succès.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de mettre à jour la photo de profil.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleAddNeighborhoodImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    try {
      if (neighborhoodImages.length >= 3) {
        toast({
          title: "Limite atteinte",
          description: "Vous pouvez ajouter un maximum de 3 photos de quartier.",
          variant: "destructive",
        });
        return;
      }
      
      setIsSaving(true);
      const file = e.target.files[0];
      const imageUrl = await uploadNeighborhoodImage(file);
      
      if (imageUrl) {
        const updatedImages = [...neighborhoodImages, imageUrl];
        setNeighborhoodImages(updatedImages);
        
        await updateProfile({
          neighborhood_images: updatedImages
        });
        
        toast({
          title: "Photo ajoutée",
          description: "Votre photo de quartier a été ajoutée avec succès.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'ajouter la photo de quartier.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleRemoveNeighborhoodImage = async (index: number) => {
    try {
      setIsSaving(true);
      const updatedImages = neighborhoodImages.filter((_, i) => i !== index);
      setNeighborhoodImages(updatedImages);
      
      await updateProfile({
        neighborhood_images: updatedImages
      });
      
      toast({
        title: "Photo supprimée",
        description: "La photo de quartier a été supprimée avec succès.",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer la photo de quartier.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
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
                <div className="relative">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={userData.avatar_url} alt={userData.username} />
                    <AvatarFallback>{userData.username?.slice(0, 2).toUpperCase() || "VP"}</AvatarFallback>
                  </Avatar>
                  
                  {isOwnProfile && (
                    <Label 
                      htmlFor="avatar-upload" 
                      className="absolute -bottom-1 -right-1 p-1 bg-primary text-white rounded-full cursor-pointer"
                    >
                      <Upload className="h-3 w-3" />
                      <Input 
                        id="avatar-upload" 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleAvatarChange}
                        disabled={isSaving}
                      />
                    </Label>
                  )}
                </div>
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
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsNeighborhoodModalOpen(true)}
                  >
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Photos
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                </div>
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
            
            {/* Neighborhood Images Section */}
            {neighborhoodImages.length > 0 && (
              <>
                <Separator className="my-4" />
                <div>
                  <h3 className="font-semibold mb-2">Mon quartier</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {neighborhoodImages.map((imageUrl, index) => (
                      <div key={index} className="relative rounded-md overflow-hidden h-24">
                        <img 
                          src={imageUrl} 
                          alt={`Quartier ${index + 1}`} 
                          className="w-full h-full object-cover cursor-pointer" 
                          onClick={() => window.open(imageUrl, '_blank')}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
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
                    Contacter {userData.username?.split(' ')[0] || "cet utilisateur"}
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
        
        {/* Neighborhood Images Modal */}
        <Dialog open={isNeighborhoodModalOpen} onOpenChange={setIsNeighborhoodModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Photos de mon quartier</DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-3 gap-2">
                {neighborhoodImages.map((imageUrl, index) => (
                  <div key={index} className="relative rounded-md overflow-hidden h-24">
                    <img 
                      src={imageUrl} 
                      alt={`Quartier ${index + 1}`} 
                      className="w-full h-full object-cover" 
                    />
                    <button 
                      type="button"
                      onClick={() => handleRemoveNeighborhoodImage(index)}
                      className="absolute top-1 right-1 bg-black/60 rounded-full p-1 text-white"
                      disabled={isSaving}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                
                {neighborhoodImages.length < 3 && (
                  <div className="h-24 border-2 border-dashed border-muted-foreground/20 rounded-md flex items-center justify-center">
                    <Label htmlFor="neighborhood-upload" className="cursor-pointer flex flex-col items-center">
                      <ImageIcon className="h-6 w-6 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground mt-1">Ajouter</span>
                    </Label>
                    <Input 
                      id="neighborhood-upload" 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleAddNeighborhoodImage}
                      disabled={isSaving}
                    />
                  </div>
                )}
              </div>
              
              <p className="text-xs text-muted-foreground">
                Partagez des photos de votre quartier pour aider vos voisins à le découvrir (max 3 images)
              </p>
            </div>
            
            <DialogFooter>
              <Button 
                onClick={() => setIsNeighborhoodModalOpen(false)} 
                disabled={isSaving}
              >
                Fermer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default ProfilePage;
