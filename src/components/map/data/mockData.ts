
// Simuler la localisation de l'utilisateur
export const userLocation = {
  lat: 48.8566,
  lng: 2.3522, // Paris
};

// Simuler les voisins
export const neighbors = [
  { id: 1, name: "Marie D.", lat: 48.8576, lng: 2.3532, distance: 0.2, country: { code: "FR", name: "France" } },
  { id: 2, name: "Thomas L.", lat: 48.8580, lng: 2.3492, distance: 0.3, country: { code: "FR", name: "France" } },
  { id: 3, name: "Sarah K.", lat: 48.8546, lng: 2.3502, distance: 0.4, country: { code: "TN", name: "Tunisie" } },
  { id: 4, name: "Ahmed B.", lat: 48.8596, lng: 2.3572, distance: 0.5, country: { code: "MA", name: "Maroc" } },
  { id: 5, name: "Julie M.", lat: 48.8536, lng: 2.3482, distance: 0.7, country: { code: "FR", name: "France" } },
  { id: 6, name: "Karim Mensour", lat: 48.8536, lng: 2.3462, distance: 0.9, country: { code: "DZ", name: "Algérie" } },
];

// Simuler des événements communautaires
export const events = [
  { id: 1, name: "Café entre voisins", date: "2023-07-15", time: "10:00", lat: 48.8560, lng: 2.3510, createdBy: "Marie D." },
  { id: 2, name: "Vide-grenier", date: "2023-07-20", time: "14:00", lat: 48.8590, lng: 2.3530, createdBy: "Thomas L." },
];
