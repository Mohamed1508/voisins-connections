
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
import { X } from "lucide-react";

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
  lat?: number;
  lng?: number;
}

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
}

const EditProfileModal = ({ open, onClose }: EditProfileModalProps) => {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    username: "",
    bio: "",
    origin_country: "",
    languages: [],
    interests: [],
    avatar_url: "",
    lat: undefined,
    lng: undefined
  });
  const [currentLanguage, setCurrentLanguage] = useState<string>("");
  const [currentInterest, setCurrentInterest] = useState<string>("");

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
      
      if (data) {
        setProfile({
          username: data.username || "",
          bio: data.bio || "",
          origin_country: data.origin_country || "",
          languages: data.languages || [],
          interests: data.interests || [],
          avatar_url: data.avatar_url || "",
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

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      if (!user) throw new Error("Vous devez être connecté pour mettre à jour votre profil");
      
      await updateProfile({
        username: profile.username,
        bio: profile.bio,
        origin_country: profile.origin_country,
        languages: profile.languages,
        interests: profile.interests,
        avatar_url: profile.avatar_url,
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
        
        <div className="grid gap-4 py-4">
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
          
          <div className="grid gap-2">
            <Label htmlFor="avatar_url">URL de votre avatar (optionnel)</Label>
            <Input
              id="avatar_url"
              name="avatar_url"
              value={profile.avatar_url}
              onChange={handleChange}
              placeholder="https://exemple.com/votre-avatar.jpg"
            />
          </div>
        </div>
        
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
