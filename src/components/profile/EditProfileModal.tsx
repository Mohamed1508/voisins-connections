
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Liste des langues et pays pour les sélecteurs
const LANGUAGES = [
  { code: "fr", name: "Français" },
  { code: "en", name: "Anglais" },
  { code: "ar", name: "Arabe" },
  { code: "es", name: "Espagnol" },
  { code: "de", name: "Allemand" },
  { code: "zh", name: "Chinois" },
  { code: "pt", name: "Portugais" },
  { code: "ru", name: "Russe" },
  { code: "ja", name: "Japonais" },
  { code: "it", name: "Italien" }
];

const COUNTRIES = [
  { code: "FR", name: "France" },
  { code: "DZ", name: "Algérie" },
  { code: "MA", name: "Maroc" },
  { code: "TN", name: "Tunisie" },
  { code: "DE", name: "Allemagne" },
  { code: "IT", name: "Italie" },
  { code: "ES", name: "Espagne" },
  { code: "GB", name: "Royaume-Uni" },
  { code: "US", name: "États-Unis" },
  { code: "SN", name: "Sénégal" },
  { code: "CM", name: "Cameroun" },
  { code: "CI", name: "Côte d'Ivoire" },
];

const INTERESTS = [
  "Cuisine", "Jardinage", "Sport", "Musique", "Lecture", 
  "Voyages", "Arts", "Cinéma", "Danse", "Photographie", 
  "Informatique", "Jeux vidéo", "Histoire", "Sciences",
  "Langues", "Bricolage", "Mode", "Nature", "Politique", "Religion"
];

interface UserProfile {
  username: string;
  bio: string;
  origin_country: string;
  languages: string[];
  interests: string[];
  avatar_url: string;
  neighborhood_images?: string[];
  lat?: number;
  lng?: number;
}

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
}

const EditProfileModal = ({ open, onClose }: EditProfileModalProps) => {
  const { user, updateProfile, uploadProfileImage, uploadNeighborhoodImage } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    username: "",
    bio: "",
    origin_country: "",
    languages: [],
    interests: [],
    avatar_url: "",
    neighborhood_images: [],
    lat: undefined,
    lng: undefined
  });
  const [currentLanguage, setCurrentLanguage] = useState<string>("");
  const [currentInterest, setCurrentInterest] = useState<string>("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [newNeighborhoodImage, setNewNeighborhoodImage] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    if (user && open) {
      fetchUserProfile();
    }
  }, [user, open]);

  const fetchUserProfile = async () => {
    try {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      
      // Also get user metadata for neighborhood images
      const { data: userData } = await supabase.auth.getUser();
      const neighborhoodImages = userData.user?.user_metadata?.neighborhood_images || [];
      
      if (data) {
        setProfile({
          username: data.username || "",
          bio: data.bio || "",
          origin_country: data.origin_country || "",
          languages: data.languages || [],
          interests: data.interests || [],
          avatar_url: data.avatar_url || "",
          neighborhood_images: neighborhoodImages,
          lat: data.lat,
          lng: data.lng
        });
      }
    } catch (error: any) {
      console.error("Error fetching profile:", error.message);
      toast({
        title: "Erreur",
        description: "Impossible de charger votre profil.",
        variant: "destructive",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };
  
  const handleNeighborhoodImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setNewNeighborhoodImage(file);
    }
  };

  const handleAddLanguage = () => {
    if (!currentLanguage || profile.languages.includes(currentLanguage)) return;
    
    setProfile((prev) => ({
      ...prev,
      languages: [...prev.languages, currentLanguage]
    }));
    setCurrentLanguage("");
  };

  const handleRemoveLanguage = (lang: string) => {
    setProfile((prev) => ({
      ...prev,
      languages: prev.languages.filter(l => l !== lang)
    }));
  };

  const handleAddInterest = () => {
    if (!currentInterest || profile.interests.includes(currentInterest)) return;
    
    setProfile((prev) => ({
      ...prev,
      interests: [...prev.interests, currentInterest]
    }));
    setCurrentInterest("");
  };

  const handleRemoveInterest = (interest: string) => {
    setProfile((prev) => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };
  
  const handleAddNeighborhoodImage = async () => {
    if (!newNeighborhoodImage) return;
    
    try {
      if ((profile.neighborhood_images?.length || 0) >= 3) {
        toast({
          title: "Limite atteinte",
          description: "Vous pouvez ajouter un maximum de 3 photos de quartier.",
          variant: "destructive",
        });
        return;
      }
      
      setLoading(true);
      const imageUrl = await uploadNeighborhoodImage(newNeighborhoodImage);
      
      if (imageUrl) {
        const updatedImages = [...(profile.neighborhood_images || []), imageUrl];
        
        setProfile(prev => ({
          ...prev,
          neighborhood_images: updatedImages
        }));
        
        setNewNeighborhoodImage(null);
        
        toast({
          title: "Photo ajoutée",
          description: "Votre photo de quartier a été ajoutée avec succès.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'ajouter la photo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleRemoveNeighborhoodImage = (index: number) => {
    if (!profile.neighborhood_images) return;
    
    setProfile(prev => ({
      ...prev,
      neighborhood_images: prev.neighborhood_images?.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      if (!user) throw new Error("Vous devez être connecté pour mettre à jour votre profil");
      
      // Upload new avatar if selected
      let avatarUrl = profile.avatar_url;
      if (avatarFile) {
        const uploadedUrl = await uploadProfileImage(avatarFile);
        if (uploadedUrl) {
          avatarUrl = uploadedUrl;
        }
      }
      
      await updateProfile({
        username: profile.username,
        bio: profile.bio,
        origin_country: profile.origin_country,
        languages: profile.languages,
        interests: profile.interests,
        avatar_url: avatarUrl,
        neighborhood_images: profile.neighborhood_images,
        lat: profile.lat,
        lng: profile.lng
      });
      
      onClose();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de mettre à jour votre profil.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier votre profil</DialogTitle>
          <DialogDescription>
            Complétez votre profil pour vous connecter avec vos voisins
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="neighborhood">Photos de quartier</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-4 mt-4">
            <div className="flex justify-center">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage 
                    src={avatarPreview || profile.avatar_url} 
                    alt={profile.username} 
                  />
                  <AvatarFallback>{profile.username?.slice(0, 2).toUpperCase() || "VP"}</AvatarFallback>
                </Avatar>
                <Label 
                  htmlFor="avatar-upload-edit" 
                  className="absolute bottom-0 right-0 p-1.5 bg-primary text-white rounded-full cursor-pointer"
                >
                  <Upload className="h-4 w-4" />
                  <Input 
                    id="avatar-upload-edit" 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleAvatarChange}
                  />
                </Label>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="username">Nom d'utilisateur</Label>
              <Input
                id="username"
                name="username"
                value={profile.username}
                onChange={handleChange}
                placeholder="Votre nom ou pseudonyme"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="bio">Biographie</Label>
              <Textarea
                id="bio"
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                placeholder="Parlez un peu de vous..."
                rows={3}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="origin_country">Pays d'origine</Label>
              <Select 
                value={profile.origin_country} 
                onValueChange={(value) => setProfile(prev => ({ ...prev, origin_country: value }))}
              >
                <SelectTrigger id="origin_country">
                  <SelectValue placeholder="Sélectionnez votre pays d'origine" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map(country => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label>Langues parlées</Label>
              <div className="flex gap-2">
                <Select value={currentLanguage} onValueChange={setCurrentLanguage}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Sélectionnez une langue" />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map(lang => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button type="button" onClick={handleAddLanguage} disabled={!currentLanguage}>
                  Ajouter
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {profile.languages.map(lang => {
                  const language = LANGUAGES.find(l => l.code === lang);
                  return (
                    <Badge key={lang} variant="secondary" className="flex items-center gap-1">
                      {language ? language.name : lang}
                      <button
                        type="button"
                        onClick={() => handleRemoveLanguage(lang)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X size={12} />
                      </button>
                    </Badge>
                  );
                })}
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label>Centres d'intérêt</Label>
              <div className="flex gap-2">
                <Select value={currentInterest} onValueChange={setCurrentInterest}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Sélectionnez un intérêt" />
                  </SelectTrigger>
                  <SelectContent>
                    {INTERESTS.map(interest => (
                      <SelectItem key={interest} value={interest}>
                        {interest}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button type="button" onClick={handleAddInterest} disabled={!currentInterest}>
                  Ajouter
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {profile.interests.map(interest => (
                  <Badge key={interest} variant="secondary" className="flex items-center gap-1">
                    {interest}
                    <button
                      type="button"
                      onClick={() => handleRemoveInterest(interest)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X size={12} />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="neighborhood" className="space-y-4 mt-4">
            <div className="grid gap-2">
              <Label>Photos de mon quartier (max 3)</Label>
              
              <div className="grid grid-cols-3 gap-2">
                {profile.neighborhood_images?.map((imageUrl, index) => (
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
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                
                {(!profile.neighborhood_images || profile.neighborhood_images.length < 3) && (
                  <div className="h-24 border-2 border-dashed border-muted-foreground/20 rounded-md flex items-center justify-center">
                    {newNeighborhoodImage ? (
                      <Button 
                        type="button" 
                        onClick={handleAddNeighborhoodImage}
                        disabled={loading}
                        variant="secondary"
                        className="h-full w-full text-xs"
                      >
                        Ajouter la photo
                      </Button>
                    ) : (
                      <Label htmlFor="neighborhood-upload-edit" className="cursor-pointer flex flex-col items-center">
                        <ImageIcon className="h-6 w-6 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground mt-1">Ajouter</span>
                        <Input 
                          id="neighborhood-upload-edit" 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleNeighborhoodImageChange}
                        />
                      </Label>
                    )}
                  </div>
                )}
              </div>
              
              <p className="text-xs text-muted-foreground">
                Partagez des photos de votre quartier pour aider vos voisins à le découvrir
              </p>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;
