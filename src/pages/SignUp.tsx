
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, UserPlus, Upload, Image, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import Header from "@/components/layout/Header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    bio: "",
    origin_country: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [neighborhoodImages, setNeighborhoodImages] = useState<File[]>([]);
  const [neighborhoodPreviews, setNeighborhoodPreviews] = useState<string[]>([]);
  
  const { signUp, loading, uploadProfileImage, uploadNeighborhoodImage } = useAuth();
  const { translations } = useLanguage();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCountryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, origin_country: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setAvatarFile(file);
      const fileUrl = URL.createObjectURL(file);
      setAvatarPreview(fileUrl);
    }
  };

  const handleNeighborhoodImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      if (neighborhoodImages.length >= 3) {
        alert("Vous pouvez télécharger un maximum de 3 images de quartier");
        return;
      }
      
      setNeighborhoodImages(prev => [...prev, file]);
      const fileUrl = URL.createObjectURL(file);
      setNeighborhoodPreviews(prev => [...prev, fileUrl]);
    }
  };

  const removeNeighborhoodImage = (index: number) => {
    setNeighborhoodImages(prev => prev.filter((_, i) => i !== index));
    setNeighborhoodPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Upload profile image if selected
      let avatarUrl = null;
      if (avatarFile) {
        avatarUrl = await uploadProfileImage(avatarFile);
      }
      
      // Upload neighborhood images if selected
      const neighborhoodUrls: string[] = [];
      for (const image of neighborhoodImages) {
        const imageUrl = await uploadNeighborhoodImage(image);
        if (imageUrl) neighborhoodUrls.push(imageUrl);
      }
      
      await signUp(formData.email, formData.password, {
        username: formData.name,
        bio: formData.bio,
        origin_country: formData.origin_country,
        avatar_url: avatarUrl || undefined,
        neighborhood_images: neighborhoodUrls.length > 0 ? neighborhoodUrls : undefined
      });
      
      // Redirect is handled in AuthContext
    } catch (error) {
      // Error is handled by the Auth context
      console.error("Signup failed:", error);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center p-4 bg-secondary/30">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Créer un compte</CardTitle>
            <CardDescription>
              Rejoignez Voisins Proches pour découvrir et échanger avec votre communauté locale
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Nom ou pseudonyme</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Comment vos voisins vous connaîtront"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="origin_country">Pays d'origine</Label>
                <Select value={formData.origin_country} onValueChange={handleCountryChange}>
                  <SelectTrigger>
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
              
              <div className="space-y-2">
                <Label htmlFor="bio">Bio (optionnelle)</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  placeholder="Parlez un peu de vous (max 200 caractères)"
                  value={formData.bio}
                  onChange={handleChange}
                  maxLength={200}
                  rows={3}
                />
              </div>
              
              {/* Profile Image Upload */}
              <div className="space-y-2">
                <Label>Photo de profil</Label>
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 bg-muted rounded-full overflow-hidden border flex items-center justify-center">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <UserPlus className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <Label htmlFor="avatar" className="cursor-pointer inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90">
                      <Upload className="mr-2 h-4 w-4" />
                      Choisir une image
                    </Label>
                    <Input 
                      id="avatar" 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleAvatarChange} 
                    />
                  </div>
                </div>
              </div>
              
              {/* Neighborhood Images Upload */}
              <div className="space-y-2">
                <Label>Photos de votre quartier (max 3)</Label>
                
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {neighborhoodPreviews.map((preview, index) => (
                    <div key={index} className="relative rounded-md overflow-hidden h-24">
                      <img 
                        src={preview} 
                        alt={`Quartier ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                      <button 
                        type="button"
                        onClick={() => removeNeighborhoodImage(index)}
                        className="absolute top-1 right-1 bg-black/60 rounded-full p-1 text-white"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  
                  {neighborhoodPreviews.length < 3 && (
                    <div className="h-24 border-2 border-dashed border-muted-foreground/20 rounded-md flex items-center justify-center">
                      <Label htmlFor="neighborhood" className="cursor-pointer flex flex-col items-center">
                        <Image className="h-6 w-6 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground mt-1">Ajouter</span>
                      </Label>
                      <Input 
                        id="neighborhood" 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleNeighborhoodImageChange} 
                      />
                    </div>
                  )}
                </div>
                
                <p className="text-xs text-muted-foreground">
                  Partagez des images de votre quartier pour aider vos voisins à le découvrir
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Création en cours..." : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    S'inscrire
                  </>
                )}
              </Button>
              <div className="text-center text-sm">
                Déjà inscrit ?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Se connecter
                </Link>
              </div>
              <Link to="/" className="text-muted-foreground text-sm flex items-center hover:text-primary transition-colors">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Retour à l'accueil
              </Link>
            </CardFooter>
          </form>
        </Card>
      </div>
    </>
  );
};

export default SignUp;
