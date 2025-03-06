
import { Button } from "@/components/ui/button";
import MapView from "@/components/map/MapView";
import { Link } from "react-router-dom";
import { UserPlus, MessageCircle, Map, Users, Car } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useLanguage } from "@/context/LanguageContext";

const Index = () => {
  const { translations } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/20 -z-10" />
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                {translations.welcome} <span className="text-primary">{translations.neighbors}</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                {translations.discover}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild>
                  <Link to="/signup">
                    <UserPlus className="mr-2 h-5 w-5" />
                    {translations.signUp}
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/login">
                    {translations.login}
                  </Link>
                </Button>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden shadow-xl h-[400px]">
              <MapView
                previewMode={true}
                userLocation={{ lat: 48.8566, lng: 2.3522 }}
                neighbors={[]}
                events={[]}
                withSearchBar={true}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-secondary/50">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{translations.features}</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<Map className="h-10 w-10 text-primary" />}
              title={translations.map}
              description={translations.mapDesc}
            />
            <FeatureCard 
              icon={<Users className="h-10 w-10 text-primary" />}
              title={translations.discoverNeighbors}
              description={translations.discoverNeighborsDesc}
            />
            <FeatureCard 
              icon={<MessageCircle className="h-10 w-10 text-primary" />}
              title={translations.messaging}
              description={translations.messagingDesc}
            />
            <FeatureCard 
              icon={<Car className="h-10 w-10 text-primary" />}
              title={translations.carpooling}
              description="Share rides with your neighbors to save money and reduce your carbon footprint."
            />
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => {
  return (
    <div className="bg-card shadow-md rounded-lg p-6 hover:shadow-lg transition-all duration-200">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default Index;
