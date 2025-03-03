
import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Send, Phone, VideoIcon, MoreHorizontal, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

// Type definitions for messages
interface MessageType {
  id: number;
  content: string;
  timestamp: Date;
  sender: "user" | "contact";
  read: boolean;
}

interface Contact {
  id: number;
  name: string;
  avatar: string;
  online: boolean;
  lastSeen?: Date;
}

interface MessageBoxProps {
  contactId: number;
  onBack?: () => void;
}

// Mocked data for the selected conversation
const DUMMY_CONTACTS: Record<number, Contact> = {
  1: {
    id: 1,
    name: "Marie Dupont",
    avatar: "https://randomuser.me/api/portraits/women/11.jpg",
    online: true,
  },
  2: {
    id: 2,
    name: "Thomas Lefebvre",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    online: false,
    lastSeen: new Date(Date.now() - 30 * 60 * 1000),
  },
  3: {
    id: 3,
    name: "Amina Benzarti",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    online: true,
  },
  4: {
    id: 4,
    name: "Ahmed Ben Ali",
    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    online: false,
    lastSeen: new Date(Date.now() - 120 * 60 * 1000),
  },
};

// MOCK conversations data
const MOCK_MESSAGES: Record<number, MessageType[]> = {
  1: [
    {
      id: 1,
      content: "Bonjour, je suis nouvelle dans le quartier. Ravie de te rencontrer !",
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      sender: "contact",
      read: true,
    },
    {
      id: 2,
      content: "Bonjour Marie ! Bienvenue dans le quartier. Je m'appelle Sarah et j'habite ici depuis 2 ans.",
      timestamp: new Date(Date.now() - 59 * 60 * 1000),
      sender: "user",
      read: true,
    },
    {
      id: 3,
      content: "Merci pour ton accueil ! Est-ce que tu connais de bons cafés dans le coin ?",
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      sender: "contact",
      read: true,
    },
    {
      id: 4,
      content: "Bien sûr ! Il y a le Café des Arts à 5 minutes d'ici qui est super. Ils font d'excellentes pâtisseries aussi.",
      timestamp: new Date(Date.now() - 40 * 60 * 1000),
      sender: "user",
      read: true,
    },
    {
      id: 5,
      content: "Ça a l'air génial ! On pourrait y aller ensemble un de ces jours ?",
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      sender: "contact",
      read: false,
    },
  ],
  2: [
    {
      id: 1,
      content: "Salut ! J'ai vu que tu cherchais des conseils pour découvrir le quartier.",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      sender: "contact",
      read: true,
    },
    {
      id: 2,
      content: "Oui tout à fait, je viens d'emménager et je ne connais pas encore bien les environs.",
      timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000),
      sender: "user",
      read: true,
    },
    {
      id: 3,
      content: "Ça te dirait d'aller prendre un café demain après-midi ? Je pourrai te faire découvrir quelques endroits sympas.",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      sender: "contact",
      read: true,
    },
  ],
  3: [
    {
      id: 1,
      content: "Salut ! J'ai vu que tu viens de Tunisie comme moi !",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      sender: "contact",
      read: true,
    },
    {
      id: 2,
      content: "Bonjour Amina ! Oui, je suis de Tunis. Tu es de quelle ville ?",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 20 * 60 * 1000),
      sender: "user",
      read: true,
    },
    {
      id: 3,
      content: "Je suis de Sousse ! Ça fait combien de temps que tu es en France ?",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      sender: "contact",
      read: true,
    },
    {
      id: 4,
      content: "Ça fait 3 ans maintenant. Et toi ?",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000),
      sender: "user",
      read: true,
    },
    {
      id: 5,
      content: "J'y suis depuis 5 ans. J'organise une petite soirée tunisienne samedi, ça te tente ? On fera des plats typiques !",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      sender: "contact",
      read: false,
    },
  ],
  4: [
    {
      id: 1,
      content: "Bonjour ! Je viens d'arriver dans le quartier et j'aurais besoin de quelques conseils.",
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      sender: "user",
      read: true,
    },
    {
      id: 2,
      content: "Salut ! Bienvenue dans le quartier. Qu'est-ce que tu aimerais savoir ?",
      timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      sender: "contact",
      read: true,
    },
    {
      id: 3,
      content: "Je cherche un bon médecin généraliste dans le coin. Tu aurais des recommandations ?",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      sender: "user",
      read: true,
    },
    {
      id: 4,
      content: "Bien sûr ! Le Dr Martin à la clinique Saint-Joseph est très bien. Son cabinet est à 10 minutes à pied d'ici. Je te recommande aussi la pharmacie du Parc qui est vraiment serviable.",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000),
      sender: "contact",
      read: true,
    },
    {
      id: 5,
      content: "Merci beaucoup pour ces infos sur le quartier ! Ça m'aide vraiment.",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      sender: "user",
      read: true,
    },
    {
      id: 6,
      content: "Pas de problème ! N'hésite pas si tu as d'autres questions.",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000),
      sender: "contact",
      read: true,
    },
  ],
};

const MessageBox = ({ contactId, onBack }: MessageBoxProps) => {
  const [messages, setMessages] = useState<MessageType[]>(MOCK_MESSAGES[contactId] || []);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const contact = DUMMY_CONTACTS[contactId];

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    
    // Simulate "seen" effect
    const timer = setTimeout(() => {
      setMessages(prevMessages => 
        prevMessages.map(msg => ({
          ...msg,
          read: true
        }))
      );
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [messages, contactId]);

  useEffect(() => {
    // Update messages when contactId changes
    setMessages(MOCK_MESSAGES[contactId] || []);
    
    // Simulate typing indicator
    if (contactId === 1 || contactId === 3) {
      setIsTyping(true);
      const timer = setTimeout(() => {
        setIsTyping(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [contactId]);

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    
    // Add new message
    const newMsg: MessageType = {
      id: messages.length + 1,
      content: newMessage,
      timestamp: new Date(),
      sender: "user",
      read: false,
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage("");
    
    // Simulate reply after delay for contact 1
    if (contactId === 1) {
      setTimeout(() => {
        setIsTyping(true);
        
        setTimeout(() => {
          const replyMsg: MessageType = {
            id: messages.length + 2,
            content: "D'accord, ça me ferait très plaisir ! Quand es-tu disponible ?",
            timestamp: new Date(),
            sender: "contact",
            read: false,
          };
          
          setMessages(prevMessages => [...prevMessages, replyMsg]);
          setIsTyping(false);
        }, 3000);
      }, 1000);
    }
  };

  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatLastSeen = (date?: Date) => {
    if (!date) return "Hors ligne";
    
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Vu à l'instant";
    if (diffInMinutes < 60) return `Vu il y a ${diffInMinutes} min`;
    if (diffInMinutes < 24 * 60) return `Vu il y a ${Math.floor(diffInMinutes / 60)} h`;
    return `Vu ${date.toLocaleDateString()}`;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-border bg-background sticky top-0 z-10">
        {isMobile && onBack && (
          <Button variant="ghost" size="icon" className="mr-2" onClick={onBack}>
            <ArrowLeft size={20} />
          </Button>
        )}
        
        <div className="flex items-center flex-1">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src={contact.avatar} alt={contact.name} />
            <AvatarFallback>{contact.name[0]}</AvatarFallback>
          </Avatar>
          
          <div>
            <h3 className="font-medium">{contact.name}</h3>
            <p className="text-xs text-muted-foreground">
              {contact.online ? (
                <span className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                  En ligne
                </span>
              ) : (
                formatLastSeen(contact.lastSeen)
              )}
            </p>
          </div>
        </div>
        
        <div className="flex space-x-1">
          <Button variant="ghost" size="icon">
            <Phone size={18} />
          </Button>
          <Button variant="ghost" size="icon">
            <VideoIcon size={18} />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreHorizontal size={18} />
          </Button>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-secondary/30">
        <div className="space-y-4">
          {messages.map((message, index) => {
            const isFirstInGroup = index === 0 || messages[index - 1].sender !== message.sender;
            const isLastInGroup = index === messages.length - 1 || messages[index + 1].sender !== message.sender;
            
            return (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.sender === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] px-4 py-2 rounded-xl",
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-none"
                      : "bg-background shadow-sm rounded-tl-none"
                  )}
                >
                  <p>{message.content}</p>
                  <div
                    className={cn(
                      "text-[10px] mt-1 flex items-center",
                      message.sender === "user"
                        ? "justify-end text-primary-foreground/70"
                        : "justify-start text-muted-foreground"
                    )}
                  >
                    {formatMessageTime(message.timestamp)}
                    {message.sender === "user" && (
                      <span className="ml-1">
                        {message.read ? (
                          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                        ) : (
                          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
                          </svg>
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-background px-4 py-2 rounded-xl rounded-tl-none shadow-sm">
                <div className="flex space-x-1 items-center">
                  <div className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Input */}
      <div className="p-3 border-t border-border bg-background">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Écrivez votre message..."
              className="w-full py-2 px-4 bg-secondary rounded-full focus:outline-none focus:ring-1 focus:ring-primary"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage();
                }
              }}
            />
          </div>
          <Button 
            size="icon" 
            className="rounded-full"
            onClick={handleSendMessage}
            disabled={newMessage.trim() === ""}
          >
            <Send size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessageBox;
