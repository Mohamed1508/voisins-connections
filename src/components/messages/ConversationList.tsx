
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

// Simuler des conversations
const DUMMY_CONVERSATIONS = [
  {
    id: 1,
    contactName: "Marie Dupont",
    avatar: "https://randomuser.me/api/portraits/women/11.jpg",
    lastMessage: "Bonjour, je suis nouvelle dans le quartier. Ravie de te rencontrer !",
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    unread: 2,
    online: true,
  },
  {
    id: 2,
    contactName: "Thomas Lefebvre",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    lastMessage: "Ça te dirait d'aller prendre un café demain après-midi ?",
    timestamp: new Date(Date.now() - 120 * 60 * 1000),
    unread: 0,
    online: false,
  },
  {
    id: 3,
    contactName: "Amina Benzarti",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    lastMessage: "J'organise une petite soirée tunisienne samedi, ça te tente ?",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    unread: 1,
    online: true,
  },
  {
    id: 4,
    contactName: "Ahmed Ben Ali",
    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    lastMessage: "Merci pour les infos sur le quartier !",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    unread: 0,
    online: false,
  },
];

interface ConversationListProps {
  onSelectConversation: (conversationId: number) => void;
  selectedConversationId?: number;
}

const ConversationList = ({ onSelectConversation, selectedConversationId }: ConversationListProps) => {
  const [conversations, setConversations] = useState(DUMMY_CONVERSATIONS);
  const [searchTerm, setSearchTerm] = useState("");

  // Format timestamp for display
  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInDays === 1) {
      return 'Hier';
    } else if (diffInDays < 7) {
      return ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'][timestamp.getDay()];
    } else {
      return timestamp.toLocaleDateString([], { day: 'numeric', month: 'numeric' });
    }
  };

  // Filter conversations based on search term
  const filteredConversations = conversations.filter(conversation =>
    conversation.contactName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full border-r border-border">
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une conversation..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length > 0 ? (
          <ul className="divide-y divide-border">
            {filteredConversations.map((conversation) => (
              <li 
                key={conversation.id} 
                className={cn(
                  "hover:bg-muted cursor-pointer transition-colors",
                  selectedConversationId === conversation.id && "bg-muted"
                )}
                onClick={() => onSelectConversation(conversation.id)}
              >
                <div className="flex items-start p-4 gap-3">
                  <div className="relative flex-shrink-0">
                    <Avatar>
                      <AvatarImage src={conversation.avatar} alt={conversation.contactName} />
                      <AvatarFallback>{conversation.contactName[0]}</AvatarFallback>
                    </Avatar>
                    {conversation.online && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="font-medium truncate">{conversation.contactName}</h4>
                      <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                        {formatTimestamp(conversation.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {conversation.lastMessage}
                    </p>
                  </div>
                  
                  {conversation.unread > 0 && (
                    <div className="flex-shrink-0 ml-2">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                        {conversation.unread}
                      </span>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <p className="text-muted-foreground mb-2">Aucune conversation trouvée</p>
            <Button size="sm" variant="outline">Commencer une nouvelle conversation</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationList;
