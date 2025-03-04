
import { Button } from "@/components/ui/button";
import MapView from "@/components/map/MapView";
import { Link } from "react-router-dom";
import { UserPlus, MessageCircle, Map, Users } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/20 -z-10" />
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Connectez-vous avec vos <span className="text-primary">voisins</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                Découvrez qui habite près de chez vous, échangez des services et créez une communauté locale vivante.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild>
                  <Link to="/signup">
                    <UserPlus className="mr-2 h-5 w-5" />
                    S'inscrire
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/login">
                    Se connecter
                  </Link>
                </Button>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden shadow-xl h-[400px]">
              <MapView previewMode={true} />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-secondary/50">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Fonctionnalités principales</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Map className="h-10 w-10 text-primary" />}
              title="Carte interactive"
              description="Visualisez les voisins proches de chez vous sur une carte intuitive."
            />
            <FeatureCard 
              icon={<Users className="h-10 w-10 text-primary" />}
              title="Découvrez vos voisins"
              description="Parcourez les profils des personnes qui habitent près de chez vous."
            />
            <FeatureCard 
              icon={<MessageCircle className="h-10 w-10 text-primary" />}
              title="Messagerie directe"
              description="Communiquez facilement avec vos voisins pour échanger des services ou organiser des événements."
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => {
  return (
    <div className="bg-card shadow-md rounded-lg p-6 hover:shadow-lg transition-all-200">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default Index;

