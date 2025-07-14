# Coworking Café - Full Site

Application de gestion complète pour café coworking avec système de pointage, comptabilité et reporting.

## 🚀 Démarrage rapide

```bash
# Installation des dépendances
pnpm install

# Démarrage en développement
pnpm dev

# Build pour la production
pnpm build
```

## 🏗️ Technologies

- **Frontend**: Next.js 15.3.3 (App Router), TypeScript, Tailwind CSS
- **Backend**: API Routes Next.js, MongoDB/Mongoose
- **UI**: shadcn/ui, Lucide React
- **State Management**: Redux Toolkit
- **Deployment**: Netlify

## 📁 Structure du projet

```
src/
├── app/                    # App Router (Next.js 15)
│   ├── (admin)/           # Routes admin protégées
│   ├── api/               # API Routes
│   └── site/              # Site public
├── components/            # Composants réutilisables
│   ├── dashboard/         # Composants dashboard
│   └── ui/                # Composants UI de base
├── hooks/                 # Hooks personnalisés
├── lib/                   # Utilitaires et configurations
└── store/                 # État global (Redux)
```

## 🔗 Accès rapide

- **Application**: http://localhost:3001
- **Dashboard Admin**: http://localhost:3001/admin
- **Site Public**: http://localhost:3001/site

## 📚 Documentation

La documentation complète est disponible dans le dossier [`docs/`](./docs/):

- [**Index Documentation**](./docs/INDEX.md) - Index de toute la documentation
- [**Guide Développeur**](./docs/DEVELOPER_GUIDE.md) - Guide technique complet
- [**Optimisation Système**](./docs/OPTIMIZATION_SYSTEM_COMPLETE.md) - Architecture et optimisations
- [**Migration Phase 4**](./docs/PHASE4_MIGRATION_COMPLETE.md) - Dernière migration API
- [**Performance**](./docs/PERFORMANCE-SUMMARY.md) - Métriques et optimisations
- [**Exemple de Refactoring**](./docs/REFACTORING_EXAMPLE.md) - Patterns de refactoring

## 🛠️ Scripts disponibles

```bash
pnpm dev          # Développement avec Turbopack
pnpm build        # Build de production
pnpm start        # Démarrage production
pnpm lint         # Vérification ESLint
pnpm type-check   # Vérification TypeScript
```

## 🔧 Configuration

- Variables d'environnement: `.env.local`
- Configuration MongoDB requise
- Port par défaut: 3001 (si 3000 occupé)

---

_Dernière mise à jour: Juillet 2025_
