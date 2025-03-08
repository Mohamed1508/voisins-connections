
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, UserPlus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import Header from "@/components/layout/Header";

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    bio: "",
  });
  const { signUp, loading, session } = useAuth();
  const { translations } = useLanguage();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signUp(formData.email, formData.password, {
        name: formData.name,
        bio: formData.bio
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
