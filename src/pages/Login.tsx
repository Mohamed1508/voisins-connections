
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, LogIn } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import Header from "@/components/layout/Header";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { signIn, loading } = useAuth();
  const { translations } = useLanguage();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(formData.email, formData.password);
    } catch (error) {
      // Error is handled by the Auth context
      console.error("Login failed:", error);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center p-4 bg-secondary/30">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Connexion</CardTitle>
            <CardDescription>
              Connectez-vous à votre compte Voisins Proches
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
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Connexion en cours..." : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Se connecter
                  </>
                )}
              </Button>
              <div className="text-center text-sm">
                Pas encore de compte ?{" "}
                <Link to="/signup" className="text-primary hover:underline">
                  S'inscrire
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

export default Login;
