
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MainLayout from "@/components/layout/MainLayout";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { groupIcon } from "@/components/map/leaflet/LeafletConfig";
import { Badge } from "@/components/ui/badge";

interface GroupFormData {
  name: string;
  description: string;
}

const Groups = () => {
  const { translations } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<GroupFormData>({
    name: "",
    description: "",
  });
  const [myGroups, setMyGroups] = useState<any[]>([]);
  const [availableGroups, setAvailableGroups] = useState<any[]>([]);
  const [groupMembers, setGroupMembers] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number}>({
    lat: 48.8566,
    lng: 2.3522, // Paris par défaut
  });

  // Récupérer la localisation de l'utilisateur
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    }
  }, []);

  // Fonction pour récupérer les groupes et leurs membres
  const fetchGroups = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // 1. Récupérer tous les groupes
      const { data: allGroups, error: groupsError } = await supabase
        .from("groups")
        .select(`
          *,
          users (username)
        `);
        
      if (groupsError) throw groupsError;
      
      // 2. Récupérer les groupes dont l'utilisateur est membre
      const { data: membershipData, error: membershipError } = await supabase
        .from("group_members")
        .select(`
          group_id,
          role
        `)
        .eq("user_id", user.id);
        
      if (membershipError) throw membershipError;
      
      // 3. Séparer les groupes de l'utilisateur et les autres groupes disponibles
      const userGroupIds = new Set(membershipData.map(m => m.group_id));
      const userRoles = membershipData.reduce((acc: Record<string, string>, m) => {
        acc[m.group_id] = m.role;
        return acc;
      }, {});
      
      const processedGroups = allGroups.map(group => ({
        ...group,
        createdBy: group.users?.username || "Unknown user",
        role: userRoles[group.id] || null,
      }));
      
      const userGroups = processedGroups.filter(g => userGroupIds.has(g.id));
      const other = processedGroups.filter(g => !userGroupIds.has(g.id));
      
      setMyGroups(userGroups);
      setAvailableGroups(other);
      
      // 4. Pour chaque groupe, récupérer ses membres
      const allGroupIds = allGroups.map(g => g.id);
      await fetchGroupMembers(allGroupIds);
      
    } catch (error: any) {
      console.error("Error fetching groups:", error.message);
      toast({
        title: "Error",
        description: `Failed to load groups: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Récupérer les membres pour chaque groupe
  const fetchGroupMembers = async (groupIds: string[]) => {
    try {
      const { data, error } = await supabase
        .from("group_members")
        .select(`
          id,
          group_id,
          user_id,
          role,
          joined_at,
          users (username, avatar_url)
        `)
        .in("group_id", groupIds);
        
      if (error) throw error;
      
      // Organiser les membres par groupe
      const membersByGroup: Record<string, any[]> = {};
      
      data.forEach(member => {
        if (!membersByGroup[member.group_id]) {
          membersByGroup[member.group_id] = [];
        }
        
        membersByGroup[member.group_id].push({
          id: member.id,
          userId: member.user_id,
          role: member.role,
          joinedAt: member.joined_at,
          username: member.users?.username || "Unknown user",
          avatarUrl: member.users?.avatar_url
        });
      });
      
      setGroupMembers(membersByGroup);
    } catch (error: any) {
      console.error("Error fetching group members:", error.message);
    }
  };

  // Charger les groupes au chargement de la page
  useEffect(() => {
    if (user) {
      fetchGroups();
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Créer un nouveau groupe
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to create a group.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // 1. Créer le groupe
      const { data: groupData, error: groupError } = await supabase
        .from("groups")
        .insert({
          name: formData.name,
          description: formData.description,
          lat: userLocation.lat,
          lng: userLocation.lng,
          created_by: user.id,
        })
        .select()
        .single();
        
      if (groupError) throw groupError;
      
      // 2. Ajouter l'utilisateur comme admin du groupe
      const { error: memberError } = await supabase
        .from("group_members")
        .insert({
          group_id: groupData.id,
          user_id: user.id,
          role: "admin",
        });
        
      if (memberError) throw memberError;
      
      toast({
        title: "Group created",
        description: "Your group has been created successfully!",
      });
      
      // Réinitialiser le formulaire
      setFormData({
        name: "",
        description: "",
      });
      setShowForm(false);
      
      // Rafraîchir la liste des groupes
      fetchGroups();
      
    } catch (error: any) {
      console.error("Error creating group:", error.message);
      toast({
        title: "Error",
        description: `Failed to create group: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Rejoindre un groupe
  const handleJoinGroup = async (groupId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to join a group.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from("group_members")
        .insert({
          group_id: groupId,
          user_id: user.id,
          role: "member",
        });
        
      if (error) throw error;
      
      toast({
        title: "Group joined",
        description: "You have successfully joined the group!",
      });
      
      // Rafraîchir la liste des groupes
      fetchGroups();
      
    } catch (error: any) {
      console.error("Error joining group:", error.message);
      toast({
        title: "Error",
        description: `Failed to join group: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Quitter un groupe
  const handleLeaveGroup = async (groupId: string, isAdmin: boolean) => {
    if (!user) return;
    
    // Vérifier si l'utilisateur est le seul admin du groupe
    if (isAdmin) {
      const adminCount = groupMembers[groupId]?.filter(m => m.role === "admin").length || 0;
      
      if (adminCount <= 1) {
        toast({
          title: "Cannot leave group",
          description: "You are the only admin. Promote another member to admin before leaving.",
          variant: "destructive",
        });
        return;
      }
    }
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from("group_members")
        .delete()
        .eq("group_id", groupId)
        .eq("user_id", user.id);
        
      if (error) throw error;
      
      toast({
        title: "Left group",
        description: "You have successfully left the group.",
      });
      
      // Rafraîchir la liste des groupes
      fetchGroups();
      
    } catch (error: any) {
      console.error("Error leaving group:", error.message);
      toast({
        title: "Error",
        description: `Failed to leave group: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{translations.groups}</h1>
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? translations.cancel : translations.createGroup}
          </Button>
        </div>

        {showForm && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {translations.groupName} *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {translations.groupDescription}
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    rows={3}
                    disabled={loading}
                  />
                </div>
                <div className="text-xs text-gray-500">
                  {translations.locationNote}
                </div>
                <div className="pt-2 flex justify-end">
                  <Button type="submit" disabled={loading}>
                    {loading ? "Creating..." : translations.createGroup}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="myGroups" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="myGroups">{translations.myGroups}</TabsTrigger>
            <TabsTrigger value="availableGroups">{translations.availableGroups}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="myGroups">
            {myGroups.length === 0 ? (
              <Card>
                <CardContent className="py-6 text-center text-gray-500">
                  {user ? "You haven't joined any groups yet." : "Please sign in to see your groups."}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myGroups.map(group => (
                  <Card key={group.id} className="overflow-hidden">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{group.name}</CardTitle>
                          {group.role && (
                            <Badge className="mt-1" variant={group.role === "admin" ? "default" : "outline"}>
                              {group.role === "admin" ? translations.admin : translations.member}
                            </Badge>
                          )}
                        </div>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleLeaveGroup(group.id, group.role === "admin")}
                          disabled={loading}
                        >
                          {translations.leaveGroup}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {group.description && <p className="mb-4">{group.description}</p>}
                      
                      <div className="mt-4">
                        <h4 className="font-semibold text-sm mb-2">{translations.members}</h4>
                        <div className="space-y-2">
                          {groupMembers[group.id]?.map(member => (
                            <div key={member.id} className="flex justify-between items-center">
                              <div className="flex items-center">
                                {member.avatarUrl && (
                                  <img 
                                    src={member.avatarUrl} 
                                    alt={member.username} 
                                    className="w-6 h-6 rounded-full mr-2"
                                  />
                                )}
                                <span>{member.username}</span>
                              </div>
                              <Badge variant={member.role === "admin" ? "default" : "outline"} className="text-xs">
                                {member.role === "admin" ? translations.admin : translations.member}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="availableGroups">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableGroups.length === 0 ? (
                <Card>
                  <CardContent className="py-6 text-center text-gray-500">
                    No other groups available at the moment.
                  </CardContent>
                </Card>
              ) : (
                availableGroups.map(group => (
                  <Card key={group.id} className="overflow-hidden">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle>{group.name}</CardTitle>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleJoinGroup(group.id)}
                          disabled={loading || !user}
                        >
                          {translations.joinGroup}
                        </Button>
                      </div>
                      <CardDescription>{translations.createdBy}: {group.createdBy}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {group.description && <p className="mb-4">{group.description}</p>}
                      
                      <div className="mt-4">
                        <h4 className="font-semibold text-sm mb-2">{translations.members}</h4>
                        <div className="text-sm">
                          {(groupMembers[group.id]?.length || 0) === 0 
                            ? "No members yet"
                            : `${groupMembers[group.id]?.length || 0} members`}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>{translations.groups}</CardTitle>
          </CardHeader>
          <CardContent>
            <MapContainer
              style={{ height: "500px", width: "100%" }}
              center={[userLocation.lat, userLocation.lng]}
              zoom={13}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              
              {/* Marqueur pour l'utilisateur */}
              <Marker position={[userLocation.lat, userLocation.lng]}>
                <Popup>{translations.yourLocation}</Popup>
              </Marker>
              
              {/* Marqueurs pour les groupes */}
              {[...myGroups, ...availableGroups].map((group) => (
                <Marker
                  key={group.id}
                  position={[group.lat, group.lng]}
                  icon={groupIcon}
                >
                  <Popup>
                    <div className="text-sm">
                      <p className="font-bold">{group.name}</p>
                      {group.description && <p>{group.description}</p>}
                      <p className="text-xs text-gray-600">
                        {translations.createdBy}: {group.createdBy}
                      </p>
                      <p className="text-xs text-gray-600">
                        {translations.members}: {groupMembers[group.id]?.length || 0}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Groups;
