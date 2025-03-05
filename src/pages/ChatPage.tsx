
import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, MessageCircle, Send, Laugh } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useLanguage } from "@/context/LanguageContext";

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
}

interface UserData {
  id: string;
  username: string;
  avatar_url?: string;
  origin_country?: string;
  interests?: string[];
}

// Liste des icebreakers selon pays et intérêts
const getIcebreakers = (currentUser: UserData | null, otherUser: UserData | null) => {
  const icebreakers = [];
  
  // Icebreakers basés sur le pays
  if (currentUser?.origin_country && otherUser?.origin_country && currentUser.origin_country === otherUser.origin_country) {
    switch (currentUser.origin_country) {
      case 'DZ':
        icebreakers.push("Salam! Tu viens de quelle région en Algérie?");
        icebreakers.push("Est-ce que tu aimes le couscous?");
        break;
      case 'MA':
        icebreakers.push("Salam! Tu viens de quelle ville au Maroc?");
        icebreakers.push("Quel est ton plat marocain préféré?");
        break;
      case 'TN':
        icebreakers.push("Ahla! Tu viens de quelle région en Tunisie?");
        icebreakers.push("Est-ce que tu aimes le lablabi?");
        break;
      case 'FR':
        icebreakers.push("Tu viens de quelle région en France?");
        icebreakers.push("Quelle est ta spécialité culinaire française préférée?");
        break;
      default:
        icebreakers.push(`Avez-vous grandi dans votre pays d'origine?`);
    }
  } else if (currentUser?.origin_country && otherUser?.origin_country) {
    icebreakers.push(`J'aimerais en savoir plus sur ${otherUser.origin_country}. Tu y retournes souvent?`);
  }
  
  // Icebreakers basés sur les intérêts communs
  if (currentUser?.interests && otherUser?.interests) {
    const commonInterests = currentUser.interests.filter(interest => 
      otherUser.interests?.includes(interest)
    );
    
    if (commonInterests.length > 0) {
      commonInterests.forEach(interest => {
        switch (interest) {
          case 'Cuisine':
            icebreakers.push("J'ai vu que tu aimais la cuisine! Quel est ton plat signature?");
            break;
          case 'Musique':
            icebreakers.push("Quels artistes ou groupes de musique écoutes-tu en ce moment?");
            break;
          case 'Lecture':
            icebreakers.push("Quel est le dernier livre que tu as lu et apprécié?");
            break;
          case 'Cinéma':
            icebreakers.push("Quel est ton film préféré de tous les temps?");
            break;
          case 'Voyages':
            icebreakers.push("Quelle est la destination de voyage dont tu rêves?");
            break;
          default:
            icebreakers.push(`J'ai vu que tu t'intéressais à ${interest}. Comment as-tu développé cette passion?`);
        }
      });
    }
  }
  
  // Icebreakers génériques si rien ne correspond
  if (icebreakers.length === 0) {
    icebreakers.push("Bonjour! Comment ça va aujourd'hui?");
    icebreakers.push("Depuis combien de temps habites-tu dans ce quartier?");
    icebreakers.push("Qu'est-ce qui t'a poussé à rejoindre Voisins Proches?");
  }
  
  return icebreakers;
};

const ChatPage = () => {
  const { userId } = useParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const { translations } = useLanguage();
  const [otherUser, setOtherUser] = useState<UserData | null>(null);
  const [currentUserData, setCurrentUserData] = useState<UserData | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [showIcebreakers, setShowIcebreakers] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (user && userId) {
      fetchUsers();
      fetchMessages();
      
      // Set up real-time listener for new messages
      const subscription = supabase
        .channel('public:messages')
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `sender_id=eq.${userId},receiver_id=eq.${user.id}`
        }, (payload) => {
          const newMsg = payload.new as Message;
          setMessages(prev => [...prev, newMsg]);
        })
        .subscribe();
        
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user, userId]);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const fetchUsers = async () => {
    try {
      if (!user || !userId) return;
      
      // Fetch the other user
      const { data: otherUserData, error: otherUserError } = await supabase
        .from('users')
        .select('id, username, avatar_url, origin_country, interests')
        .eq('id', userId)
        .single();
        
      if (otherUserError) throw otherUserError;
      setOtherUser(otherUserData);
      
      // Fetch current user data
      const { data: currentUserData, error: currentUserError } = await supabase
        .from('users')
        .select('id, username, avatar_url, origin_country, interests')
        .eq('id', user.id)
        .single();
        
      if (currentUserError) throw currentUserError;
      setCurrentUserData(currentUserData);
      
    } catch (error: any) {
      console.error("Error fetching users:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les informations utilisateur.",
        variant: "destructive",
      });
    }
  };
  
  const fetchMessages = async () => {
    try {
      setLoading(true);
      if (!user || !userId) return;
      
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${userId}),and(sender_id.eq.${userId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      
      setMessages(data || []);
      
      // Mark messages as read
      if (data && data.length > 0) {
        const unreadMessages = data.filter(msg => 
          msg.receiver_id === user.id && !msg.read
        );
        
        if (unreadMessages.length > 0) {
          await supabase
            .from('messages')
            .update({ read: true })
            .in('id', unreadMessages.map(msg => msg.id));
        }
      }
    } catch (error: any) {
      console.error("Error fetching messages:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les messages.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!newMessage.trim() || !user || !userId) return;
    
    try {
      setSendingMessage(true);
      
      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: userId,
          content: newMessage.trim()
        })
        .select()
        .single();
        
      if (error) throw error;
      
      setMessages(prev => [...prev, data]);
      setNewMessage("");
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le message.",
        variant: "destructive",
      });
    } finally {
      setSendingMessage(false);
    }
  };
  
  const handleIcebreakerSelect = (icebreaker: string) => {
    setNewMessage(icebreaker);
    setShowIcebreakers(false);
  };
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  if (!user || !userId) {
    return (
      <>
        <Header />
        <div className="container mx-auto p-4 max-w-3xl">
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">Conversation non disponible</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => window.history.back()}
              >
                Retour
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }
  
  const icebreakers = getIcebreakers(currentUserData, otherUser);
  
  return (
    <>
      <Header />
      <div className="container mx-auto p-4 max-w-3xl">
        <div className="mb-4">
          <Link 
            to="/dashboard" 
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au tableau de bord
          </Link>
        </div>
        
        <Card className="overflow-hidden">
          <CardHeader className="p-4 border-b flex-row items-center gap-4">
            {otherUser ? (
              <>
                <Avatar>
                  <AvatarImage src={otherUser.avatar_url} />
                  <AvatarFallback>{otherUser.username?.slice(0, 2).toUpperCase() || "VP"}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle>{otherUser.username || "Utilisateur"}</CardTitle>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.location.href = `/profile/${userId}`}
                >
                  Voir le profil
                </Button>
              </>
            ) : (
              <div className="flex-1">
                <CardTitle>Chargement...</CardTitle>
              </div>
            )}
          </CardHeader>
          
          <div className="flex flex-col h-[400px]">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <p className="text-muted-foreground">Chargement des messages...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex justify-center items-center h-full flex-col gap-2">
                  <MessageCircle className="h-10 w-10 text-muted-foreground/50" />
                  <p className="text-muted-foreground">Aucun message pour le moment</p>
                  <p className="text-sm text-muted-foreground">Commencez la conversation!</p>
                </div>
              ) : (
                <>
                  {messages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`flex ${message.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.sender_id === user.id 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted'
                        }`}
                      >
                        <p>{message.content}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {new Date(message.created_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>
            
            <form 
              onSubmit={handleSendMessage}
              className="p-4 border-t flex items-center gap-2"
            >
              {icebreakers.length > 0 && (
                <Popover open={showIcebreakers} onOpenChange={setShowIcebreakers}>
                  <PopoverTrigger asChild>
                    <Button 
                      type="button" 
                      size="icon" 
                      variant="ghost"
                      className="flex-shrink-0"
                    >
                      <Laugh />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent side="top" align="start" className="w-72">
                    <div className="space-y-2">
                      <h4 className="font-medium">Suggestions pour briser la glace</h4>
                      <div className="grid gap-1.5">
                        {icebreakers.map((icebreaker, index) => (
                          <Button
                            key={index}
                            variant="ghost"
                            className="justify-start h-auto py-1.5 px-2 text-sm"
                            onClick={() => handleIcebreakerSelect(icebreaker)}
                          >
                            {icebreaker}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
              
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Écrivez votre message..."
                className="flex-1"
                disabled={sendingMessage}
              />
              
              <Button 
                type="submit" 
                size="icon"
                disabled={!newMessage.trim() || sendingMessage}
                className="flex-shrink-0"
              >
                <Send />
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </>
  );
};

export default ChatPage;
