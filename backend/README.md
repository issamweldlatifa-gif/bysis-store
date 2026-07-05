# Bysis Backend

API REST pour l'application Bysis (Node.js + Express + SQLite).

## Démarrage

```bash
cp .env.example .env        # éditez JWT_SECRET !
npm install
npm run seed                # charge 20 produits de démo
npm start                   # http://localhost:3001
```

**Configuration** : voir `.env.example` (PORT, JWT_SECRET, CORS_ORIGIN, DB_PATH).

## Endpoints

Voir **[API.md](./API.md)** pour la documentation complète.

| Méthode | Route | Description |
|---|---|---|
| POST | `/api/auth/register` | Inscription |
| POST | `/api/auth/login` | Connexion |
| GET | `/api/auth/me` | Utilisateur courant |
| GET | `/api/products` | Liste + filtres (`brand,size,color,min,max,q`) |
| GET | `/api/products/:id` | Détail produit |
| GET/POST/PUT/DELETE | `/api/cart` | Panier (auth requis) |
| GET/POST/DELETE | `/api/wishlist` | Favoris (auth requis) |
| GET/POST | `/api/orders` | Commandes (auth requis) |

## Sécurité

- Mots de passe hachés (bcrypt)
- JWT (7 jours, configurable)
- Total des commandes recalculé côté serveur
- CORS restreint aux origines configurées

## Migration PostgreSQL

Le schéma (`src/db.js`) est portable. Voir la fin de `API.md`.
