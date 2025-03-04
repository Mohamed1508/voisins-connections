
# Supabase Integration

Ce fichier explique comment mettre en place Supabase pour l'application Voisins Proches.

## Tables à créer

### Table 'users'

```sql
CREATE TABLE users (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  username TEXT,
  avatar_url TEXT,
  bio TEXT,
  lat FLOAT,
  lng FLOAT,
  origin_country TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
```

### Table 'events'

```sql
CREATE TABLE events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TIME NOT NULL,
  lat FLOAT NOT NULL,
  lng FLOAT NOT NULL,
  created_by UUID REFERENCES users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
```

### Table 'messages'

```sql
CREATE TABLE messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sender_id UUID REFERENCES users(id) NOT NULL,
  receiver_id UUID REFERENCES users(id) NOT NULL,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
```

## Politiques de sécurité (RLS)

Pour chaque table, vous devrez configurer des politiques de Row Level Security (RLS) pour
protéger vos données et n'autoriser que les accès appropriés.

### Exemple pour 'users'

```sql
-- Activer RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre aux utilisateurs de voir tous les profils
CREATE POLICY "Les profils sont visibles par tous les utilisateurs authentifiés" 
ON users FOR SELECT 
USING (auth.role() = 'authenticated');

-- Politique pour permettre aux utilisateurs de modifier uniquement leur propre profil
CREATE POLICY "Les utilisateurs peuvent modifier leur propre profil" 
ON users FOR UPDATE 
USING (auth.uid() = id);
```

Pour intégrer Supabase à votre application React, vous devez:

1. Créer un compte sur Supabase.com
2. Créer un nouveau projet
3. Configurer les tables et politiques de sécurité mentionnées ci-dessus
4. Utiliser l'URL et la clé d'API publique fournie par Supabase dans votre application

Utiliser le bouton "Connecter à Supabase" dans l'interface de Lovable pour une intégration facile.
