import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, MapPin, UserPlus, UserMinus, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import { groupIcon } from "@/components/map/leaflet/LeafletConfig";
import MainLayout from "@/components/layout/MainLayout";

interface Group {
  id: string;
  name: string;
  description: string | null;
  created_by: string;
  lat: number;
  lng: number;
}

interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  role: string;
  username: string;
  avatar_url: string | null;
}

const Groups = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [groups, setGroups] = useState<Group[]>([]);
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [newGroupName, setNewGroupName] = useState("");
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [isJoiningGroup, setIsJoiningGroup] = useState(false);

  const fetchGroups = useCallback(async () => {
    try {
      setLoading(true);
      const { data: groupsData, error: groupsError } = await supabase
        .from('groups')
        .select('*');

      if (groupsError) throw groupsError;
      setGroups(groupsData || []);

      const { data: membersData, error: membersError } = await supabase
        .from('group_members')
        .select(`*, users(username, avatar_url)`)
        .order('created_at', { ascending: false });

      if (membersError) throw membersError;

      const formattedMembers = membersData?.map(member => ({
        ...member,
        username: (member.users as any)?.username || 'Utilisateur',
        avatar_url: (member.users as any)?.avatar_url || null,
      })) as GroupMember[];

      setGroupMembers(formattedMembers || []);
    } catch (error: any) {
      console.error("Error fetching groups:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les groupes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const handleGroupClick = (group: Group | null) => {
    setSelectedGroup(group);
  };

  const handleCreateGroup = async () => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour créer un groupe.",
        variant: "destructive",
      });
      return;
    }

    if (!newGroupName.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom du groupe ne peut pas être vide.",
        variant: "destructive",
      });
      return;
    }

    setIsCreatingGroup(true);
    try {
      // Get user location
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('lat, lng')
        .eq('id', user.id)
        .single();

      if (userError) throw userError;

      const { data: newGroup, error: createError } = await supabase
        .from('groups')
        .insert([
          {
            name: newGroupName,
            created_by: user.id,
            lat: userData?.lat || 48.8566, // Default Paris latitude
            lng: userData?.lng || 2.3522, // Default Paris longitude
          },
        ])
        .select()
        .single();

      if (createError) throw createError;

      // Add the user creating the group as a member with admin role
      const { error: memberError } = await supabase
        .from('group_members')
        .insert([
          {
            group_id: newGroup.id,
            user_id: user.id,
            role: 'admin',
          },
        ]);

      if (memberError) throw memberError;

      setNewGroupName("");
      fetchGroups();
      toast({
        title: "Succès",
        description: "Groupe créé avec succès.",
      });
    } catch (error: any) {
      console.error("Error creating group:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le groupe.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingGroup(false);
    }
  };

  const handleJoinGroup = async (groupId: string) => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour rejoindre un groupe.",
        variant: "destructive",
      });
      return;
    }

    setIsJoiningGroup(true);
    try {
      const { error: joinError } = await supabase
        .from('group_members')
        .insert([
          {
            group_id: groupId,
            user_id: user.id,
            role: 'member',
          },
        ]);

      if (joinError) throw joinError;

      fetchGroups();
      toast({
        title: "Succès",
        description: "Groupe rejoint avec succès.",
      });
    } catch (error: any) {
      console.error("Error joining group:", error);
      toast({
        title: "Erreur",
        description: "Impossible de rejoindre le groupe.",
        variant: "destructive",
      });
    } finally {
      setIsJoiningGroup(false);
    }
  };

  const handleLeaveGroup = async (groupId: string) => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour quitter un groupe.",
        variant: "destructive",
      });
      return;
    }

    setIsJoiningGroup(true);
    try {
      const { error: leaveError } = await supabase
        .from('group_members')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', user.id);

      if (leaveError) throw leaveError;

      fetchGroups();
      toast({
        title: "Succès",
        description: "Groupe quitté avec succès.",
      });
    } catch (error: any) {
      console.error("Error leaving group:", error);
      toast({
        title: "Erreur",
        description: "Impossible de quitter le groupe.",
        variant: "destructive",
      });
    } finally {
      setIsJoiningGroup(false);
    }
  };

  const isUserInGroup = (groupId: string) => {
    return groupMembers.some(member => member.group_id === groupId && member.user_id === user?.id);
  };

  const getGroupMembers = (groupId: string) => {
    return groupMembers.filter(member => member.group_id === groupId);
  };

  // Replace the MapContainer component with GoogleMap
  const GroupMap = ({ groups, selectedGroup, onGroupClick }: GroupMapProps) => {
    const mapContainerStyle = {
      height: "300px",
      width: "100%"
    };
    
    const center = selectedGroup 
      ? { lat: selectedGroup.lat, lng: selectedGroup.lng }
      : { lat: 48.8566, lng: 2.3522 }; // Paris by default
    
    return (
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={13}
        options={{
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false
        }}
      >
        {groups.map(group => (
          <Marker
            key={group.id}
            position={{ lat: group.lat, lng: group.lng }}
            icon={groupIcon}
            onClick={() => onGroupClick(group)}
          >
            {selectedGroup && selectedGroup.id === group.id && (
              <InfoWindow onCloseClick={() => onGroupClick(null)}>
                <div className="text-sm">
                  <p className="font-bold">{group.name}</p>
                  {group.description && <p className="text-xs">{group.description}</p>}
                </div>
              </InfoWindow>
            )}
          </Marker>
        ))}
      </GoogleMap>
    );
  };

  // Fix the relation issues with username
  const getCreatorUsername = async (userId: string) => {
    const { data } = await supabase
      .from('users')
      .select('username')
      .eq('id', userId)
      .single();
    
    return data?.username || 'Utilisateur';
  };

  const getMemberInfo = async (userId: string) => {
    const { data } = await supabase
      .from('users')
      .select('username, avatar_url')
      .eq('id', userId)
      .single();
    
    return {
      username: data?.username || 'Utilisateur',
      avatar_url: data?.avatar_url
    };
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto p-4">
          <div className="flex justify-center items-center h-48">
            <p>Chargement des groupes...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto p-4">
        <div className="mb-4">
          <Button asChild>
            <Link to="/dashboard" className="inline-flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour au tableau de bord
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Group List */}
          <div className="bg-card rounded-xl shadow-md p-6">
            <CardTitle className="text-2xl font-bold mb-4">
              Groupes
            </CardTitle>
            <CardDescription>
              Découvrez et rejoignez des groupes près de chez vous.
            </CardDescription>

            {/* Create Group Form */}
            <div className="mt-4">
              <div className="flex items-center">
                <Input
                  type="text"
                  placeholder="Nom du nouveau groupe"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="flex-grow mr-2"
                />
                <Button onClick={handleCreateGroup} disabled={isCreatingGroup}>
                  {isCreatingGroup ? "Création..." : <Plus className="mr-2 h-4 w-4" />}
                  Créer
                </Button>
              </div>
            </div>

            {/* Group List */}
            <div className="mt-4 space-y-3">
              {groups.map((group) => (
                <Card key={group.id} className="shadow-sm">
                  <CardHeader className="flex items-center">
                    <CardTitle className="text-lg font-semibold">{group.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{group.description || "Aucune description"}</p>
                    <div className="flex items-center mt-2">
                      <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Lat: {group.lat}, Lng: {group.lng}</span>
                    </div>
                  </CardContent>
                  <div className="flex justify-end items-center p-3">
                    {isUserInGroup(group.id) ? (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleLeaveGroup(group.id)}
                        disabled={isJoiningGroup}
                      >
                        {isJoiningGroup ? "Quitter..." : <UserMinus className="mr-2 h-4 w-4" />}
                        Quitter
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleJoinGroup(group.id)}
                        disabled={isJoiningGroup}
                      >
                        {isJoiningGroup ? "Rejoindre..." : <UserPlus className="mr-2 h-4 w-4" />}
                        Rejoindre
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Group Map and Details */}
          <div className="bg-card rounded-xl shadow-md p-6">
            <CardTitle className="text-2xl font-bold mb-4">
              Carte des groupes
            </CardTitle>
            <CardDescription>
              Visualisez les groupes sur la carte.
            </CardDescription>

            {/* Group Map */}
            <div className="mt-4">
              <GroupMap
                groups={groups}
                selectedGroup={selectedGroup}
                onGroupClick={handleGroupClick}
              />
            </div>

            {/* Selected Group Details */}
            {selectedGroup && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-2">{selectedGroup.name}</h3>
                <p className="text-muted-foreground">{selectedGroup.description || "Aucune description"}</p>
                <div className="mt-4">
                  <h4 className="text-lg font-semibold mb-2">Membres du groupe</h4>
                  <ul className="space-y-2">
                    {getGroupMembers(selectedGroup.id).map((member) => (
                      <li key={member.id} className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.avatar_url || ""} alt={member.username} />
                          <AvatarFallback>{member.username?.slice(0, 2).toUpperCase() || "VP"}</AvatarFallback>
                        </Avatar>
                        <span>{member.username}</span>
                        {member.role === 'admin' && <Badge className="ml-2">Admin</Badge>}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

interface GroupMapProps {
  groups: Group[];
  selectedGroup: Group | null;
  onGroupClick: (group: Group | null) => void;
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export default Groups;
