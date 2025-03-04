
// Types pour les données
export interface Neighbor {
  id: string;
  name: string;
  distance: string; // ex: "350m"
  bio?: string;
  avatarUrl?: string;
  isOnline: boolean;
  latitude: number;
  longitude: number;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar?: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
}

// Données simulées pour les voisins
export const mockNeighbors: Neighbor[] = [
  {
    id: "1",
    name: "Sophie Martin",
    distance: "350m",
    bio: "Passionnée de jardinage et de cuisine.",
    avatarUrl: "/placeholder.svg",
    isOnline: true,
    latitude: 48.8584,
    longitude: 2.2945
  },
  {
    id: "2",
    name: "Thomas Dubois",
    distance: "450m",
    bio: "Musicien et développeur web.",
    avatarUrl: "/placeholder.svg",
    isOnline: false,
    latitude: 48.8584,
    longitude: 2.2935
  },
  {
    id: "3",
    name: "Emma Bernard",
    distance: "620m",
    bio: "Étudiante en médecine, cherche aide en mathématiques.",
    avatarUrl: "/placeholder.svg",
    isOnline: true,
    latitude: 48.8590,
    longitude: 2.2955
  },
  {
    id: "4",
    name: "Lucas Petit",
    distance: "780m",
    bio: "Passionné de jeux de société et de randonnée.",
    avatarUrl: "/placeholder.svg",
    isOnline: false,
    latitude: 48.8570,
    longitude: 2.2965
  },
  {
    id: "5",
    name: "Camille Roux",
    distance: "950m",
    bio: "Chef à domicile, propose des cours de cuisine.",
    avatarUrl: "/placeholder.svg",
    isOnline: true,
    latitude: 48.8560,
    longitude: 2.2940
  }
];

// Données simulées pour les conversations
export const mockConversations: Conversation[] = [
  {
    id: "conv1",
    participantId: "1",
    participantName: "Sophie Martin",
    participantAvatar: "/placeholder.svg",
    lastMessage: "Bonjour, est-ce que vous seriez disponible pour...",
    timestamp: "10:30",
    unread: true
  },
  {
    id: "conv2",
    participantId: "3",
    participantName: "Emma Bernard",
    participantAvatar: "/placeholder.svg",
    lastMessage: "Merci pour votre aide !",
    timestamp: "Hier",
    unread: false
  },
  {
    id: "conv3",
    participantId: "5",
    participantName: "Camille Roux",
    participantAvatar: "/placeholder.svg",
    lastMessage: "On se retrouve mercredi pour le cours de cuisine ?",
    timestamp: "Lun",
    unread: false
  }
];

// Données simulées pour les messages
export const mockMessages: Record<string, Message[]> = {
  "conv1": [
    {
      id: "msg1",
      conversationId: "conv1",
      senderId: "1",
      text: "Bonjour, je suis votre voisine Sophie ! J'ai vu que vous aviez un potager, est-ce que vous auriez des conseils pour démarrer le mien ?",
      timestamp: "10:15",
      isRead: true
    },
    {
      id: "msg2",
      conversationId: "conv1",
      senderId: "currentUser",
      text: "Bonjour Sophie ! Bien sûr, je serais ravi de vous aider. Quels légumes souhaitez-vous planter ?",
      timestamp: "10:20",
      isRead: true
    },
    {
      id: "msg3",
      conversationId: "conv1",
      senderId: "1",
      text: "J'aimerais commencer avec des tomates et des courgettes. Est-ce que c'est une bonne idée pour débuter ?",
      timestamp: "10:25",
      isRead: true
    },
    {
      id: "msg4",
      conversationId: "conv1",
      senderId: "1",
      text: "Bonjour, est-ce que vous seriez disponible pour me montrer comment préparer le sol ce weekend ?",
      timestamp: "10:30",
      isRead: false
    }
  ],
  "conv2": [
    {
      id: "msg5",
      conversationId: "conv2",
      senderId: "currentUser",
      text: "Bonjour Emma, j'ai vu que vous cherchiez de l'aide en mathématiques ?",
      timestamp: "Hier, 15:30",
      isRead: true
    },
    {
      id: "msg6",
      conversationId: "conv2",
      senderId: "3",
      text: "Oui ! J'ai des examens dans deux semaines et je bloque sur les statistiques.",
      timestamp: "Hier, 15:45",
      isRead: true
    },
    {
      id: "msg7",
      conversationId: "conv2",
      senderId: "currentUser",
      text: "Je pourrais vous aider, j'étais prof de maths. On pourrait se retrouver au café du quartier ?",
      timestamp: "Hier, 16:00",
      isRead: true
    },
    {
      id: "msg8",
      conversationId: "conv2",
      senderId: "3",
      text: "Merci pour votre aide !",
      timestamp: "Hier, 16:10",
      isRead: true
    }
  ],
  "conv3": [
    {
      id: "msg9",
      conversationId: "conv3",
      senderId: "5",
      text: "Bonjour ! Je propose un cours de cuisine française mercredi prochain, ça vous intéresserait ?",
      timestamp: "Lundi, 09:00",
      isRead: true
    },
    {
      id: "msg10",
      conversationId: "conv3",
      senderId: "currentUser",
      text: "Bonjour Camille ! Oui, ça m'intéresse beaucoup. C'est à quelle heure ?",
      timestamp: "Lundi, 09:30",
      isRead: true
    },
    {
      id: "msg11",
      conversationId: "conv3",
      senderId: "5",
      text: "Super ! C'est de 18h à 20h chez moi. On va préparer un bœuf bourguignon.",
      timestamp: "Lundi, 10:00",
      isRead: true
    },
    {
      id: "msg12",
      conversationId: "conv3",
      senderId: "5",
      text: "On se retrouve mercredi pour le cours de cuisine ?",
      timestamp: "Lundi, 18:00",
      isRead: true
    }
  ]
};

// Service simulé pour récupérer les données
export const getNeighbors = (): Promise<Neighbor[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockNeighbors);
    }, 500);
  });
};

export const getNeighborById = (id: string): Promise<Neighbor | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockNeighbors.find(neighbor => neighbor.id === id));
    }, 300);
  });
};

export const getConversations = (): Promise<Conversation[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockConversations);
    }, 500);
  });
};

export const getMessagesByConversationId = (conversationId: string): Promise<Message[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockMessages[conversationId] || []);
    }, 300);
  });
};

export const sendMessage = (conversationId: string, text: string): Promise<Message> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newMessage: Message = {
        id: `msg${Date.now()}`,
        conversationId,
        senderId: "currentUser",
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: false
      };
      
      // Dans une vraie application, vous mettriez à jour la base de données ici
      if (mockMessages[conversationId]) {
        mockMessages[conversationId].push(newMessage);
      } else {
        mockMessages[conversationId] = [newMessage];
      }
      
      resolve(newMessage);
    }, 300);
  });
};
