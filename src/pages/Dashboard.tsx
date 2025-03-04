
import { useState } from "react";
import MapView from "@/components/map/MapView";
import NeighborsList from "@/components/neighbors/NeighborsList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ConversationList from "@/components/messages/ConversationList";
import MessageBox from "@/components/messages/MessageBox";
import { Separator } from "@/components/ui/separator";
import { Map, MessageCircle, Users } from "lucide-react";

const Dashboard = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversation(conversationId);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Tableau de bord</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Carte interactive (occupe toute la largeur sur mobile, 2/3 sur desktop) */}
        <div className="lg:col-span-2 rounded-lg overflow-hidden shadow-md h-[400px] lg:h-[500px]">
          <MapView />
        </div>
        
        {/* Onglets pour afficher soit la liste des voisins, soit la messagerie */}
        <div className="lg:col-span-1">
          <Tabs defaultValue="neighbors" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="neighbors">
                <Users className="h-4 w-4 mr-2" />
                Voisins
              </TabsTrigger>
              <TabsTrigger value="messages">
                <MessageCircle className="h-4 w-4 mr-2" />
                Messages
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="neighbors" className="border rounded-md mt-2">
              <NeighborsList />
            </TabsContent>
            
            <TabsContent value="messages" className="border rounded-md mt-2">
              {selectedConversation ? (
                <div className="flex flex-col h-[400px]">
                  <button 
                    onClick={() => setSelectedConversation(null)}
                    className="p-2 text-sm text-primary hover:underline flex items-center"
                  >
                    ← Retour aux conversations
                  </button>
                  <Separator />
                  <MessageBox conversationId={selectedConversation} />
                </div>
              ) : (
                <ConversationList onSelectConversation={handleSelectConversation} />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

