
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, MapPin, Flag } from "lucide-react";
import ProfileCard from "@/components/profile/ProfileCard";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Simuler des données de voisins
const DUMMY_NEIGHBORS = [
  {
    id: 1,
    name: "Marie Dupont",
    avatarUrl: "https://randomuser.me/api/portraits/women/11.jpg",
    bio: "Nouvelle dans le quartier, j'adore la cuisine et les balades.",
    distance: 0.3,
    country: { code: "FR", name: "France" },
    isOnline: true,
    age: 28,
  },
  {
    id: 2,
    name: "Thomas Lefebvre",
    avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    bio: "Passionné de photo et de voyages. Toujours partant pour un café !",
    distance: 0.5,
    country: { code: "FR", name: "France" },
    isOnline: false,
    age: 34,
  },
  {
    id: 3,
    name: "Amina Benzarti",
    avatarUrl: "https://randomuser.me/api/portraits/women/68.jpg",
    bio: "Originaire de Tunis, installée depuis 2 ans. J'adore cuisiner et partager.",
    distance: 0.8,
    country: { code: "TN", name: "Tunisie" },
    isOnline: true,
    age: 31,
  },
  {
    id: 4,
    name: "Ahmed Ben Ali",
    avatarUrl: "https://randomuser.me/api/portraits/men/22.jpg",
    bio: "Ingénieur en informatique, j'aime le sport et les jeux de société.",
    distance: 1.2,
    country: { code: "MA", name: "Maroc" },
    isOnline: false,
    age: 29,
  },
  {
    id: 5,
    name: "Sophie Martin",
    avatarUrl: "https://randomuser.me/api/portraits/women/45.jpg",
    bio: "Professeure de yoga, je cherche à organiser des séances dans le parc.",
    distance: 1.5,
    country: { code: "FR", name: "France" },
    isOnline: true,
    age: 36,
  },
  {
    id: 6,
    name: "Karim Mensour",
    avatarUrl: "https://randomuser.me/api/portraits/men/76.jpg",
    bio: "Musicien, je joue de la guitare et cherche des personnes pour jammer.",
    distance: 2.1,
    country: { code: "DZ", name: "Algérie" },
    isOnline: false,
    age: 27,
  },
];

// Simuler des pays pour le filtre
const COUNTRIES = [
  { code: "ALL", name: "Tous les pays" },
  { code: "FR", name: "France" },
  { code: "TN", name: "Tunisie" },
  { code: "MA", name: "Maroc" },
  { code: "DZ", name: "Algérie" },
  { code: "SN", name: "Sénégal" },
];

const NeighborsList = () => {
  const [neighbors, setNeighbors] = useState(DUMMY_NEIGHBORS);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [countryFilter, setCountryFilter] = useState("ALL");
  const [distanceFilter, setDistanceFilter] = useState("all");
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [selectedNeighbor, setSelectedNeighbor] = useState<typeof DUMMY_NEIGHBORS[0] | null>(null);
  
  const { toast } = useToast();

  // Filtre les voisins en fonction des critères
  const filteredNeighbors = neighbors.filter((neighbor) => {
    // Filtre par recherche
    const matchesSearch = neighbor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (neighbor.bio && neighbor.bio.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filtre par pays
    const matchesCountry = countryFilter === "ALL" || neighbor.country.code === countryFilter;
    
    // Filtre par distance
    let matchesDistance = true;
    if (distanceFilter === "1km") matchesDistance = neighbor.distance <= 1;
    else if (distanceFilter === "2km") matchesDistance = neighbor.distance <= 2;
    else if (distanceFilter === "5km") matchesDistance = neighbor.distance <= 5;
    
    return matchesSearch && matchesCountry && matchesDistance;
  });

  const applyFilters = () => {
    setIsFilterOpen(false);
    toast({
      title: "Filtres appliqués",
      description: `${filteredNeighbors.length} voisins correspondent à vos critères.`,
    });
  };

  const resetFilters = () => {
    setCountryFilter("ALL");
    setDistanceFilter("all");
    setSearchTerm("");
    setIsFilterOpen(false);
    toast({
      description: "Filtres réinitialisés",
    });
  };

  const handleMessageClick = (neighbor: typeof DUMMY_NEIGHBORS[0]) => {
    setSelectedNeighbor(neighbor);
    setMessageDialogOpen(true);
  };

  const sendMessage = (message: string) => {
    if (!selectedNeighbor) return;
    
    toast({
      title: `Message envoyé à ${selectedNeighbor.name}`,
      description: "Votre message a été envoyé avec succès.",
    });
    
    setMessageDialogOpen(false);
  };

  return (
    <div className="w-full">
      {/* Search and Filter */}
      <div className="flex gap-2 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un voisin..."
            className="pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => setIsFilterOpen(true)}
        >
          <Filter size={18} />
        </Button>
      </div>

      {/* Dialog pour les filtres */}
      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Filtrer les voisins</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <MapPin size={16} />
                Distance maximum
              </label>
              <Select value={distanceFilter} onValueChange={setDistanceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes distances" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes distances</SelectItem>
                  <SelectItem value="1km">1 km ou moins</SelectItem>
                  <SelectItem value="2km">2 km ou moins</SelectItem>
                  <SelectItem value="5km">5 km ou moins</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Flag size={16} />
                Pays d'origine
              </label>
              <Select value={countryFilter} onValueChange={setCountryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les pays" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map(country => (
                    <SelectItem key={country.code} value={country.code}>{country.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-between">
            <Button variant="outline" onClick={resetFilters}>
              Réinitialiser
            </Button>
            <Button onClick={applyFilters}>
              Appliquer
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Message Dialog */}
      <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Envoyer un message à {selectedNeighbor?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-muted p-3 rounded-md text-sm">
              <p className="font-medium mb-1">Messages suggérés:</p>
              <button 
                className="block w-full text-left p-2 hover:bg-background rounded"
                onClick={() => sendMessage("Salut, on est voisins, ça te dit de discuter ?")}
              >
                Salut, on est voisins, ça te dit de discuter ?
              </button>
              {selectedNeighbor?.country.code !== "FR" && (
                <button 
                  className="block w-full text-left p-2 hover:bg-background rounded mt-1"
                  onClick={() => sendMessage(`Salut, je vois que nous venons du même pays, ça te dirait de se rencontrer ?`)}
                >
                  Salut, je vois que nous venons du même pays, ça te dirait de se rencontrer ?
                </button>
              )}
            </div>
            
            <textarea 
              className="w-full min-h-[100px] p-3 rounded-md border border-border"
              placeholder="Écrivez votre message..."
            ></textarea>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setMessageDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={() => sendMessage("Message personnalisé")}>
              Envoyer
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Neighbors Grid */}
      {filteredNeighbors.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNeighbors.map(neighbor => (
            <div key={neighbor.id} className="animate-fade-in">
              <ProfileCard 
                name={neighbor.name}
                avatarUrl={neighbor.avatarUrl}
                bio={neighbor.bio}
                distance={neighbor.distance}
                country={neighbor.country}
                isOnline={neighbor.isOnline}
                onMessageClick={() => handleMessageClick(neighbor)}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <MapPin size={24} className="text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">Aucun voisin trouvé</h3>
          <p className="text-muted-foreground max-w-md">
            Aucun voisin ne correspond à vos critères de recherche. Essayez d'élargir votre rayon ou de modifier vos filtres.
          </p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={resetFilters}
          >
            Réinitialiser les filtres
          </Button>
        </div>
      )}
    </div>
  );
};

export default NeighborsList;
