# Bysis — Application Mode & Lifestyle

Application e-commerce de mode (prototype / démo fonctionnelle) avec PWA, i18n,
panier, paiement, favoris, suivi de commande, authentification et filtres.

---

## 📦 Contenu du ZIP

```
bysis-app/
├── index.html              ← Application complète (HTML + CSS + JS, ~376 KB)
├── manifest.json           ← Configuration PWA (installable)
├── sw.js                   ← Service Worker (offline / cache)
├── PRODUCTION_NOTES.md     ← Ce qu'il faut pour passer en production
├── README.md               ← Ce fichier
└── icons/
    ├── icon-192.png        ← Icône PWA 192×192
    ├── icon-512.png        ← Icône PWA 512×512
    └── icon-maskable-512.png  ← Icône maskable (Android)
```

---

## 🚀 Comment lancer l'application

### Option 1 — Ouverture simple (aperçu rapide)
Double-cliquez sur `index.html`. ⚠️ Le Service Worker (PWA / offline) **ne
fonctionne pas** en `file://` — seul un aperçu visuel sera disponible.

### Option 2 — Serveur local (PWA complète, recommandé)
Depuis le dossier décompressé :

```bash
# Python 3
python3 -m http.server 8000

# ou Node.js
npx serve .
```
Puis ouvrez `http://localhost:8000` dans votre navigateur.

---

## ✨ Fonctionnalités

| Catégorie | Détails |
|---|---|
| **Navigation** | 16 écrans, menu Femme/Homme/Enfant, sous-menus dynamiques |
| **Catalogue** | 20 produits, fiches détaillées, galerie, couleurs/tailles |
| **Panier** | Ajout, quantités, codes promo (`SOLDES30`, `BIENVENUE`) |
| **Paiement** | 3 étapes (livraison → paiement → confirmation), validation des champs |
| **Favoris** | Ajout/retrait, page dédiée, persistance |
| **Commandes** | Historique stocké localement, suivi |
| **Auth** | Connexion / inscription / social (démo) |
| **Filtres** | Prix, marque, taille, couleur (fonctionnels) |
| **IA & Lens** | Dress Me, Build Look, Budget, recherche visuelle (simulés) |
| **i18n** | Français / English / العربية (avec RTL automatique) |
| **PWA** | Installable, fonctionne hors-ligne |
| **Thème** | Mode clair / sombre |
| **UX** | Skeleton loaders, onboarding rejouable, nav auto-hide |

---

## 🌍 Langues
Paramètres → Langue : change la langue **et** la direction (RTL pour l'arabe).
Les chaînes principales sont traduites ; les noms de produits restent en français.

---

## 💳 Codes promo de test
- `SOLDES30` → -30%
- `BIENVENUE` → -10%

---

## 🔧 Pour la production
Voir `PRODUCTION_NOTES.md` — points principaux :
1. **Backend API** (produits, commandes, auth réelle)
2. **Hébergement images** sur CDN (WebP/AVIF + srcset)
3. Intégration paiement réel (Stripe / PayPal)

---

## 📊 Tech
HTML5 · CSS3 (variables, glassmorphism, animations) · JavaScript vanilla (sans framework) · PWA · localStorage
