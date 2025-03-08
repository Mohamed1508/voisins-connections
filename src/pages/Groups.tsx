import React, { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Calendar, MapPin, Clock, ArrowRight, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import LeafletProvider from "@/components/map/LeafletProvider";
import LeafletMap from "@/components/map/LeafletMap";
import GroupMarker from "@/components/map/markers/GroupMarker";

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
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [position, setPosition] = useState({ lat: 48.8566, lng: 2.3522 });
  const [newGroupLocation, setNewGroupLocation] = useState("");
  const [joining, setJoining] = useState(false);
  const [creating, setCreating] = useState(false);

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

  const handleCreateGroup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!user) return;
    
    try {
      setCreating(true);
      
      // Create the group
      const { data: newGroup, error: groupError } = await supabase
        .from('groups')
        .insert([
          {
            name: newGroupName,
            description: newGroupDescription,
            location: newGroupLocation,
            created_by: user.id,
            lat: position.lat,
            lng: position.lng
          }
        ])
        .select()
        .single();
        
      if (groupError) throw groupError;
      
      // Add creator as admin member
      const { error: memberError } = await supabase
        .from('group_members')
        .insert([
          {
            group_id: newGroup.id,
            user_id: user.id,
            role: 'admin',
            is_admin: true
          }
        ]);
        
      if (memberError) throw memberError;
      
      toast({
        title: "Group created!",
        description: "Your new group has been created successfully",
      });
      
      setShowGroupForm(false);
      setNewGroupName('');
      setNewGroupDescription('');
      setNewGroupLocation('');
      
      fetchGroups();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create group",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  const joinGroup = async (groupId: string) => {
    if (!user) return;
    
    try {
      setJoining(true);
      
      // Check if already a member
      const { data: existingMember, error: checkError } = await supabase
        .from('group_members')
        .select('*')
        .eq('group_id', groupId)
        .eq('user_id', user.id)
        .single();
        
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }
      
      if (existingMember) {
        toast({
          title: "Already a member",
          description: "You are already a member of this group",
        });
        return;
      }
      
      // Add as member
      const { error } = await supabase
        .from('group_members')
        .insert([
          {
            group_id: groupId,
            user_id: user.id,
            role: 'member',
            is_admin: false
          }
        ]);
        
      if (error) throw error;
      
      toast({
        title: "Success!",
        description: "You have joined the group successfully",
      });
      
      fetchGroups();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to join group",
        variant: "destructive",
      });
    } finally {
      setJoining(false);
    }
  };
  
  const leaveGroup = async (groupId: string) => {
    if (!user) return;
    
    try {
      setJoining(true);
      
      const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      toast({
        title: "Left group",
        description: "You have left the group successfully",
      });
      
      fetchGroups();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to leave group",
        variant: "destructive",
      });
    } finally {
      setJoining(false);
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
                      <LeafletProvider>
                        <LeafletMap
                          previewMode={true}
                          userLocation={{ lat: newGroupLat, lng: newGroupLng }}
                          neighbors={[]}
                          events={[]}
                          withSearchBar={true}
                        />
                      </LeafletProvider>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="secondary" onClick={() => setIsCreateModalOpen(false)}>
                  {translations.cancel}
                </Button>
                <Button 
                  type="submit" 
                  onClick={(e) => {
                    e.preventDefault();
                    handleCreateGroup(e as unknown as React.FormEvent<HTMLFormElement>);
                  }}
                  disabled={isCreating}
                >
                  {isCreating ? "Création..." : (
                    <>
                      <Users className="mr-2 h-4 w-4" />
                      Créer le groupe
                    </>
                  )}
                </Button>
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

