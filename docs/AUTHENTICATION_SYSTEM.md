# Système d'Authentification - Coworking Café

## Vue d'ensemble

Le système d'authentification intègre une gestion des rôles permettant de contrôler l'accès aux différentes fonctionnalités selon le type d'utilisateur.

## Rôles Disponibles

### Admin

- **Accès complet** au dashboard financier
- **Gestion du personnel** (liste, ajout, modification)
- **Contrôle de caisse** et rapports financiers
- **Paramètres système** et administration
- **Pointages** de tout le personnel

### Staff

- **Pointages personnels** uniquement
- **Consultation** de ses propres données
- **Accès limité** aux fonctionnalités

## Comptes de Démonstration

```
Admin:
- Username: admin
- Password: admin123

Staff:
- Username: staff
- Password: staff123

Manager (Admin):
- Username: manager
- Password: manager123
```

## Pages et Routes

### Routes Publiques

- `/login` - Page de connexion
- `/site` - Site vitrine (si existant)

### Routes Protégées

- `/` - Dashboard principal (nécessite auth)
- `/admin/*` - Pages d'administration (admin uniquement)
- `/accounting/*` - Pages financières (admin uniquement)
- `/list` - Liste du personnel (admin uniquement)
- `/score` - Pointages (staff minimum)

## Architecture

### Composants Principaux

1. **AuthContext** (`/src/contexts/AuthContext.tsx`)

   - Gestion de l'état d'authentification
   - Fonctions login/logout
   - Vérification des rôles

2. **ProtectedRoute** (`/src/components/auth/ProtectedRoute.tsx`)

   - Protection des routes selon l'authentification
   - Vérification des rôles requis

3. **RoleGuard** (`/src/components/auth/RoleGuard.tsx`)

   - Affichage conditionnel selon le rôle
   - Composant wrapper pour les éléments UI

4. **UserMenu** (`/src/components/auth/UserMenu.tsx`)
   - Menu utilisateur avec options de déconnexion
   - Liens spécifiques selon le rôle

### Middleware

Le middleware (`/src/middleware.ts`) :

- Protège automatiquement les routes sensibles
- Redirige les utilisateurs non authentifiés vers `/login`
- Redirige les utilisateurs connectés loin de `/login`

## Utilisation

### Protéger une Page

```tsx
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <div>Contenu admin uniquement</div>
    </ProtectedRoute>
  );
}
```

### Affichage Conditionnel

```tsx
import { RoleGuard } from "@/components/auth/RoleGuard";

export default function Dashboard() {
  return (
    <div>
      <RoleGuard role="admin">
        <AdminOnlyComponent />
      </RoleGuard>

      <RoleGuard role="staff">
        <StaffComponent />
      </RoleGuard>
    </div>
  );
}
```

### Utiliser le Hook d'Auth

```tsx
import { useAuth } from "@/contexts/AuthContext";

export default function MyComponent() {
  const { user, hasRole, logout } = useAuth();

  return (
    <div>
      <p>Bonjour {user?.firstName}</p>
      {hasRole("admin") && <AdminButton />}
      <button onClick={logout}>Déconnexion</button>
    </div>
  );
}
```

## Sécurité

### Points Importants

- ⚠️ **Système de démonstration** - Remplacer les comptes mock par une vraie API
- 🔒 Les mots de passe sont en clair dans le code (démo uniquement)
- 🍪 Authentification persistée via localStorage + cookies
- 🛡️ Middleware automatique pour la protection des routes

### Améliorations de Production

1. Intégrer une vraie API d'authentification
2. Hasher les mots de passe
3. Implémenter des tokens JWT
4. Ajouter une gestion des sessions
5. Logs d'audit des connexions

## Interface Utilisateur

### Navigation Adaptative

- **Admin** : Accès à "Finances", "Administration", "Personnel"
- **Staff** : Accès uniquement à "Personnel" > "Pointages"

### Dashboard Personnalisé

- Message de bienvenue personnalisé
- Affichage conditionnel des sections financières
- Liens et boutons adaptés selon le rôle

## Structure des Fichiers

```
src/
├── contexts/
│   └── AuthContext.tsx           # Contexte d'authentification
├── components/
│   └── auth/
│       ├── ProtectedRoute.tsx    # Protection des routes
│       ├── RoleGuard.tsx         # Guard pour les rôles
│       └── UserMenu.tsx          # Menu utilisateur
├── types/
│   └── auth.ts                   # Types TypeScript
├── app/
│   ├── login/
│   │   └── page.tsx              # Page de connexion
│   └── (admin)/
│       ├── layout.tsx            # Layout protégé
│       └── (dashboard)/
│           └── admin/
│               └── settings/
│                   └── page.tsx  # Page admin
└── middleware.ts                 # Middleware de protection
```

## Roadmap

- [ ] Intégration API réelle
- [ ] Gestion des tokens JWT
- [ ] Refresh tokens automatique
- [ ] Logs d'audit
- [ ] Récupération de mot de passe
- [ ] Validation email
- [ ] 2FA (authentification à deux facteurs)
