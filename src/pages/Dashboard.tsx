import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useLanguage } from "@/context/LanguageContext";
import MapView from "@/components/map/MapView";

// Import other components as needed
// Mock data for development
const mockNeighbors = [
  {
    id: 1,
    name: "Alice",
    lat: 48.8566,
    lng: 2.3522,
    distance: 0.5,
    country: { code: "FR", name: "France" }
  },
  {
    id: 2,
    name: "Bob",
    lat: 48.8606,
    lng: 2.3376,
    distance: 1.2,
    country: { code: "FR", name: "France" }
  }
];

const mockEvents = [
  {
    id: 1,
    name: "Community Picnic",
    date: "2023-06-15",
    time: "14:00",
    lat: 48.8646,
    lng: 2.3426,
    createdBy: "Charlie"
  }
];

// Dashboard component
const Dashboard = () => {
  const { translations } = useLanguage();
  const [selectedConversation, setSelectedConversation] = React.useState<number | null>(null);

  return (
    <MainLayout>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-card rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">{translations.map}</h2>
          <div className="h-[400px] rounded-lg overflow-hidden">
            <MapView 
              userLocation={{ lat: 48.8566, lng: 2.3522 }}
              neighbors={mockNeighbors}
              events={mockEvents}
            />
          </div>
        </div>

        <div className="bg-card rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">{translations.chats}</h2>
          <div className="h-[400px] rounded-lg">
            {selectedConversation ? (
              <div className="h-full flex flex-col">
                <button
                  onClick={() => setSelectedConversation(null)}
                  className="mb-4 text-sm text-primary flex items-center"
                >
                  ← {translations.backToConversations}
                </button>
                {/* MessageBox would be here */}
              </div>
            ) : (
              <div className="h-full overflow-auto">
                {/* ConversationList would be here */}
                <div className="text-center text-muted-foreground py-8">
                  No active conversations
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
