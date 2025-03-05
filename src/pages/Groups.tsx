
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/Header";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogTrigger, 
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { useLanguage } from "@/context/LanguageContext";
import { Tables } from "@/integrations/supabase/types";
import { DefaultIcon, groupIcon } from "@/components/map/leaflet/LeafletConfig";
import { PlusCircle, Pin, Users, UserPlus, UserMinus } from "lucide-react";

type Group = {
  id: string;
  name: string;
  description: string;
  lat: number;
  lng: number;
  created_by: string;
  created_at: string;
  member_count: number;
  is_member: boolean;
};

// Composant pour contrôler la carte
function MapController({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  
  return null;
}

const Groups = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [myGroups, setMyGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: "",
    description: "",
    lat: 0,
    lng: 0
  });
  const [mapCenter, setMapCenter] = useState<[number, number]>([48.8566, 2.3522]); // Paris par défaut
  const [zoom, setZoom] = useState(13);
  const [activeTab, setActiveTab] = useState<'all' | 'my'>('all');
  
  const { toast } = useToast();
  const { user } = useAuth();
  const { translations } = useLanguage();

  // Charger les groupes
  const fetchGroups = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Obtenir tous les groupes
      const { data: allGroups, error: allGroupsError } = await supabase
        .from('groups')
        .select('*, group_members!inner(user_id, group_id)');
      
      if (allGroupsError) throw allGroupsError;
      
      // Obtenir les groupes dont je suis membre
      const { data: userGroups, error: userGroupsError } = await supabase
        .from('group_members')
        .select('group_id')
        .eq('user_id', user.id);
        
      if (userGroupsError) throw userGroupsError;
      
      const userGroupIds = userGroups?.map(g => g.group_id) || [];
      
      if (allGroups) {
        const processedGroups = allGroups.map((group: any) => ({
          ...group,
          member_count: group.group_members ? group.group_members.length : 0,
          is_member: userGroupIds.includes(group.id)
        }));
        
        setGroups(processedGroups);
        setMyGroups(processedGroups.filter(g => g.is_member));
        
        // Si au moins un groupe existe, centrer la carte sur le premier
        if (processedGroups.length > 0) {
          setMapCenter([processedGroups[0].lat, processedGroups[0].lng]);
        }
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les groupes: " + error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (user) {
      fetchGroups();
    }
  }, [user, toast]);
  
  // Gérer la création d'un nouveau groupe
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Non autorisé",
        description: "Vous devez être connecté pour créer un groupe",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Créer le groupe
      const { data: groupData, error: groupError } = await supabase
        .from('groups')
        .insert({
          name: newGroup.name,
          description: newGroup.description,
          lat: newGroup.lat,
          lng: newGroup.lng,
          created_by: user.id
        })
        .select();
      
      if (groupError) throw groupError;
      
      // Ajouter le créateur comme membre du groupe
      if (groupData && groupData[0]) {
        const { error: memberError } = await supabase
          .from('group_members')
          .insert({
            group_id: groupData[0].id,
            user_id: user.id,
            role: 'admin'
          });
          
        if (memberError) throw memberError;
        
        toast({
          title: "Groupe créé avec succès",
          description: "Votre groupe a été ajouté à la carte",
        });
        
        // Rafraîchir la liste des groupes
        fetchGroups();
        
        setIsDialogOpen(false);
        setNewGroup({
          name: "",
          description: "",
          lat: 0,
          lng: 0
        });
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de créer le groupe: " + error.message,
        variant: "destructive",
      });
    }
  };
  
  // Utiliser la géolocalisation pour le nouveau groupe
  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setNewGroup({
            ...newGroup,
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          toast({
            title: "Position détectée",
            description: "Votre position actuelle sera utilisée pour le groupe",
          });
        },
        () => {
          toast({
            title: "Erreur de géolocalisation",
            description: "Impossible d'obtenir votre position",
            variant: "destructive",
          });
        }
      );
    } else {
      toast({
        title: "Géolocalisation non supportée",
        description: "Votre navigateur ne supporte pas la géolocalisation",
        variant: "destructive",
      });
    }
  };
  
  // Rejoindre un groupe
  const handleJoinGroup = async (groupId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('group_members')
        .insert({
          group_id: groupId,
          user_id: user.id,
          role: 'member'
        });
        
      if (error) throw error;
      
      toast({
        title: "Vous avez rejoint le groupe",
        description: "Vous pouvez maintenant participer aux discussions",
      });
      
      // Mettre à jour l'état local
      setGroups(groups.map(group => 
        group.id === groupId 
        ? { ...group, is_member: true, member_count: group.member_count + 1 } 
        : group
      ));
      
      // Mettre à jour mes groupes
      const joinedGroup = groups.find(g => g.id === groupId);
      if (joinedGroup) {
        const updatedJoinedGroup = { 
          ...joinedGroup, 
          is_member: true, 
          member_count: joinedGroup.member_count + 1 
        };
        setMyGroups([...myGroups, updatedJoinedGroup]);
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de rejoindre le groupe: " + error.message,
        variant: "destructive",
      });
    }
  };
  
  // Quitter un groupe
  const handleLeaveGroup = async (groupId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      toast({
        title: "Vous avez quitté le groupe",
        description: "Vous ne recevrez plus de notifications de ce groupe",
      });
      
      // Mettre à jour l'état local
      setGroups(groups.map(group => 
        group.id === groupId 
        ? { ...group, is_member: false, member_count: group.member_count - 1 } 
        : group
      ));
      
      // Supprimer de mes groupes
      setMyGroups(myGroups.filter(group => group.id !== groupId));
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de quitter le groupe: " + error.message,
        variant: "destructive",
      });
    }
  };
  
  const displayedGroups = activeTab === 'all' ? groups : myGroups;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="container mx-auto p-4 flex-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{translations.groups}</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                {translations.createGroup}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{translations.createGroup}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div>
                  <label className="block text-sm font-medium mb-1">{translations.groupName}</label>
                  <Input 
                    value={newGroup.name}
                    onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{translations.groupDescription}</label>
                  <Textarea 
                    value={newGroup.description}
                    onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Latitude</label>
                    <Input 
                      type="number" 
                      step="any"
                      value={newGroup.lat || ""}
                      onChange={(e) => setNewGroup({...newGroup, lat: parseFloat(e.target.value)})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Longitude</label>
                    <Input 
                      type="number" 
                      step="any"
                      value={newGroup.lng || ""}
                      onChange={(e) => setNewGroup({...newGroup, lng: parseFloat(e.target.value)})}
                      required
                    />
                  </div>
                </div>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleUseCurrentLocation}
                  className="w-full"
                >
                  <Pin className="mr-2 h-4 w-4" />
                  Utiliser ma position actuelle
                </Button>
                <DialogFooter>
                  <Button type="submit">{translations.createGroup}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Onglets */}
        <div className="flex border-b mb-6">
          <button 
            className={`py-2 px-4 font-medium ${activeTab === 'all' 
              ? 'border-b-2 border-primary text-primary' 
              : 'text-muted-foreground'}`}
            onClick={() => setActiveTab('all')}
          >
            {translations.groups}
          </button>
          <button 
            className={`py-2 px-4 font-medium ${activeTab === 'my' 
              ? 'border-b-2 border-primary text-primary' 
              : 'text-muted-foreground'}`}
            onClick={() => setActiveTab('my')}
          >
            {translations.myGroups}
          </button>
        </div>
        
        {/* Carte des groupes */}
        <div className="h-[500px] rounded-xl overflow-hidden shadow-md mb-8">
          <MapContainer 
            style={{ height: "100%", width: "100%" }}
            center={mapCenter}
            zoom={zoom}
            key={`map-${mapCenter.join(',')}-${zoom}`}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            <MapController center={mapCenter} zoom={zoom} />
            
            {/* Markers pour les groupes */}
            {displayedGroups.map((group) => (
              <Marker 
                key={group.id}
                position={[group.lat, group.lng]}
                icon={groupIcon}
              >
                <Popup>
                  <div className="p-1">
                    <h3 className="font-bold">{group.name}</h3>
                    <p className="text-sm mt-1">{group.description}</p>
                    <p className="text-xs mt-1 flex items-center">
                      <Users size={12} className="mr-1" />
                      {group.member_count} {translations.members}
                    </p>
                    {!group.is_member ? (
                      <Button 
                        size="sm" 
                        className="mt-2 w-full"
                        onClick={() => handleJoinGroup(group.id)}
                      >
                        <UserPlus className="mr-1 h-3 w-3" />
                        {translations.joinGroup}
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="mt-2 w-full"
                        onClick={() => handleLeaveGroup(group.id)}
                      >
                        <UserMinus className="mr-1 h-3 w-3" />
                        {translations.leaveGroup}
                      </Button>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
        
        {/* Liste des groupes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            <p>Chargement des groupes...</p>
          ) : displayedGroups.length > 0 ? (
            displayedGroups.map((group) => (
              <div 
                key={group.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                onClick={() => {
                  setMapCenter([group.lat, group.lng]);
                  setZoom(15);
                }}
              >
                <h3 className="font-bold text-lg">{group.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{group.description}</p>
                <p className="text-xs flex items-center mt-2">
                  <Users size={12} className="mr-1" />
                  {group.member_count} {translations.members}
                </p>
                <div className="flex justify-between mt-3">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setMapCenter([group.lat, group.lng]);
                      setZoom(15);
                    }}
                  >
                    <Pin className="h-3 w-3 mr-1" />
                    Voir sur la carte
                  </Button>
                  
                  {!group.is_member ? (
                    <Button 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleJoinGroup(group.id);
                      }}
                    >
                      <UserPlus className="mr-1 h-3 w-3" />
                      {translations.joinGroup}
                    </Button>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLeaveGroup(group.id);
                      }}
                    >
                      <UserMinus className="mr-1 h-3 w-3" />
                      {translations.leaveGroup}
                    </Button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center p-8">
              <p>Aucun groupe n'a encore été créé.</p>
              <p className="text-muted-foreground mt-2">Soyez le premier à créer un groupe !</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Groups;
