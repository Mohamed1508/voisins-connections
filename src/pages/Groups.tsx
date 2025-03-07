import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Users, Plus, Calendar, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/context/LanguageContext";
import MapView from "@/components/map/MapView";

interface Group {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  created_by: string;
  lat: number;
  lng: number;
}

interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  joined_at: string;
  is_admin: boolean;
  username?: string;
}

const Groups = () => {
  const { translations } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [myGroups, setMyGroups] = useState<Group[]>([]);
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const [newGroupLat, setNewGroupLat] = useState<number | null>(null);
  const [newGroupLng, setNewGroupLng] = useState<number | null>(null);
  const [selectedGroupLocation, setSelectedGroupLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchGroups();
    fetchMyGroups();
  }, [user]);

  const fetchGroups = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('groups')
        .select('*');

      if (error) throw error;
      setGroups(data || []);
    } catch (error: any) {
      console.error("Error fetching groups:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les groupes disponibles.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMyGroups = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('group_members')
        .select('*, groups(*)')
        .eq('user_id', user.id);

      if (error) throw error;

      if (data) {
        const myGroupDetails = data.map((member) => ({
          ...member,
          group: member.groups as Group,
        })).map(member => member.group);

        setMyGroups(myGroupDetails || []);
      }
    } catch (error: any) {
      console.error("Error fetching my groups:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos groupes.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createGroup = async () => {
    if (!user || !newGroupName || !newGroupDescription || !selectedGroupLocation) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs et sélectionner un emplacement.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: group, error } = await supabase
        .from('groups')
        .insert([
          {
            name: newGroupName,
            description: newGroupDescription,
            created_by: user.id,
            lat: selectedGroupLocation.lat,
            lng: selectedGroupLocation.lng
          }
        ])
        .select();

      if (error) throw error;

      if (group && group.length > 0) {
        // Add the creator as an admin member
        await supabase
          .from('group_members')
          .insert([
            {
              group_id: group[0].id,
              user_id: user.id,
              is_admin: true
            }
          ]);

        toast({
          title: "Succès",
          description: "Groupe créé avec succès!",
        });

        fetchGroups();
        fetchMyGroups();
        setIsCreateModalOpen(false);
        setNewGroupName("");
        setNewGroupDescription("");
        setSelectedGroupLocation(null);
      }
    } catch (error: any) {
      console.error("Error creating group:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le groupe. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  const joinGroup = async (groupId: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('group_members')
        .insert([
          {
            group_id: groupId,
            user_id: user.id,
            is_admin: false
          }
        ]);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Vous avez rejoint le groupe avec succès!",
      });

      fetchGroups();
      fetchMyGroups();
    } catch (error: any) {
      console.error("Error joining group:", error);
      toast({
        title: "Erreur",
        description: "Impossible de rejoindre le groupe. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  const leaveGroup = async (groupId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Vous avez quitté le groupe avec succès!",
      });

      fetchGroups();
      fetchMyGroups();
    } catch (error: any) {
      console.error("Error leaving group:", error);
      toast({
        title: "Erreur",
        description: "Impossible de quitter le groupe. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  const fetchGroupMembers = async (groupId: string) => {
    try {
      const { data, error } = await supabase
        .from('group_members')
        .select('*, users(username)')
        .eq('group_id', groupId);

      if (error) throw error;

      if (data) {
        const membersWithUsernames = data.map(member => ({
          ...member,
          username: (member.users as any)?.username || 'Unknown'
        }));
        setGroupMembers(membersWithUsernames);
      }
    } catch (error: any) {
      console.error("Error fetching group members:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les membres du groupe.",
        variant: "destructive",
      });
    }
  };

  const handleLocationSelected = (location: { lat: number; lng: number }) => {
    setSelectedGroupLocation(location);
    setNewGroupLat(location.lat);
    setNewGroupLng(location.lng);
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">{translations.myGroups}</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                {translations.createGroup}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{translations.createGroup}</DialogTitle>
                <DialogDescription>
                  {translations.groupDescription}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="name" className="text-right">
                    {translations.groupName}
                  </label>
                  <Input
                    id="name"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="description" className="text-right">
                    {translations.groupDescription}
                  </label>
                  <Textarea
                    id="description"
                    value={newGroupDescription}
                    onChange={(e) => setNewGroupDescription(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="location" className="text-right">
                    {translations.locationNote}
                  </label>
                  <div className="col-span-3">
                    <div className="h-[200px] rounded-lg overflow-hidden">
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
              </div>
              <DialogFooter>
                <Button type="button" variant="secondary" onClick={() => setIsCreateModalOpen(false)}>
                  {translations.cancel}
                </Button>
                <Button type="submit" onClick={createGroup}>Créer</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="myGroups" className="w-full">
          <TabsList>
            <TabsTrigger value="myGroups">{translations.myGroups}</TabsTrigger>
            <TabsTrigger value="availableGroups">{translations.availableGroups}</TabsTrigger>
          </TabsList>
          <TabsContent value="myGroups">
            {isLoading ? (
              <p>Loading...</p>
            ) : myGroups.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myGroups.map((group) => (
                  <Card key={group.id}>
                    <CardHeader>
                      <CardTitle>{group.name}</CardTitle>
                      <CardDescription>
                        <MapPin className="mr-2 h-4 w-4 inline-block" />
                        {group.lat}, {group.lng}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>{group.description}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                      <Button onClick={() => leaveGroup(group.id)}>Quitter</Button>
                      <Button variant="secondary" onClick={() => fetchGroupMembers(group.id)}>
                        Voir les membres
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <p>Vous n'avez rejoint aucun groupe pour le moment.</p>
            )}
          </TabsContent>
          <TabsContent value="availableGroups">
            {isLoading ? (
              <p>Loading...</p>
            ) : groups.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groups.map((group) => (
                  <Card key={group.id}>
                    <CardHeader>
                      <CardTitle>{group.name}</CardTitle>
                      <CardDescription>
                        <MapPin className="mr-2 h-4 w-4 inline-block" />
                        {group.lat}, {group.lng}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>{group.description}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                      <Button onClick={() => joinGroup(group.id)}>Rejoindre</Button>
                      <Button variant="secondary" onClick={() => fetchGroupMembers(group.id)}>
                        Voir les membres
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <p>Aucun groupe disponible pour le moment.</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Groups;
