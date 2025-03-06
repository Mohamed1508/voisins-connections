import React, { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useLanguage } from "@/context/LanguageContext";
import MapView from "@/components/map/MapView";
import { useAuth } from "@/context/AuthContext";

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

const mockGroups = [
  {
    id: "1",
    name: "Neighborhood Watch",
    description: "Local safety group",
    lat: 48.8526,
    lng: 2.3395,
  }
];

const mockRides = [
  {
    id: "1",
    name: "Carpooling to City Center",
    departure: "Saint-Denis",
    arrival: "Paris Center",
    date: "2023-06-20",
    availableSeats: 3,
    lat: 48.8486,
    lng: 2.3465,
    createdBy: "David"
  }
];

// Dashboard component
const Dashboard = () => {
  const { translations } = useLanguage();
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [defaultLocation, setDefaultLocation] = useState({ lat: 48.8566, lng: 2.3522 });

  // Check if user has a stored location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setDefaultLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log("Geolocation error or permission denied:", error);
          // Keep default Paris location
        }
      );
    }
  }, []);

  return (
    <MainLayout>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-card rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">{translations.map}</h2>
          <div className="h-[400px] rounded-lg overflow-hidden">
            <MapView 
              userLocation={defaultLocation}
              neighbors={mockNeighbors}
              events={mockEvents}
              groups={mockGroups}
              rides={mockRides}
              withSearchBar={true}
              askLocation={true}
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
                  {translations.noActiveConversations || "Aucune conversation active"}
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
