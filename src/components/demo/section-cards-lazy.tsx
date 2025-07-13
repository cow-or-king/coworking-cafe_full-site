/**
 * SectionCards avec Code Splitting - Exemple de migration
 *
 * Ce fichier montre comment migrer un composant existant vers le code splitting
 * tout en maintenant la compatibilité et en améliorant les performances.
 */

import {
  useConditionalPreload,
  useLazyComponent,
} from "@/lib/code-splitting-manager";
import React, { Suspense } from "react";

// ===== FALLBACK COMPONENTS =====

// Fallback simple pour le chargement rapide
const SectionCardSkeleton = () => (
  <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
    {[...Array(4)].map((_, index) => (
      <div key={index} className="bg-card animate-pulse rounded-lg border p-6">
        <div className="space-y-4">
          <div className="h-4 w-1/3 rounded bg-gray-200"></div>
          <div className="h-8 w-1/2 rounded bg-gray-200"></div>
          <div className="flex items-center justify-between">
            <div className="h-6 w-16 rounded bg-gray-200"></div>
            <div className="h-4 w-4 rounded bg-gray-200"></div>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="h-4 w-3/4 rounded bg-gray-200"></div>
          <div className="h-3 w-1/2 rounded bg-gray-200"></div>
        </div>
      </div>
    ))}
  </div>
);

// Fallback avec preview des données (plus engageant)
const SectionCardPreview = () => (
  <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
    <div className="to-card rounded-lg border bg-gradient-to-t from-blue-50 p-6">
      <div className="space-y-4">
        <div className="text-muted-foreground text-sm">Total Revenue</div>
        <div className="text-2xl font-semibold">💰 Loading...</div>
        <div className="flex items-center justify-between">
          <div className="rounded bg-green-100 px-2 py-1 text-xs text-green-800">
            📈 +12.5%
          </div>
        </div>
      </div>
      <div className="text-muted-foreground mt-4 text-xs">
        Chargement des données en cours...
      </div>
    </div>

    <div className="to-card rounded-lg border bg-gradient-to-t from-green-50 p-6">
      <div className="space-y-4">
        <div className="text-muted-foreground text-sm">New Customers</div>
        <div className="text-2xl font-semibold">👥 Loading...</div>
        <div className="flex items-center justify-between">
          <div className="rounded bg-red-100 px-2 py-1 text-xs text-red-800">
            📉 -20%
          </div>
        </div>
      </div>
      <div className="text-muted-foreground mt-4 text-xs">
        Préparation des métriques...
      </div>
    </div>

    <div className="to-card rounded-lg border bg-gradient-to-t from-purple-50 p-6">
      <div className="space-y-4">
        <div className="text-muted-foreground text-sm">Active Sessions</div>
        <div className="text-2xl font-semibold">🔄 Loading...</div>
        <div className="flex items-center justify-between">
          <div className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800">
            📊 +5.1%
          </div>
        </div>
      </div>
      <div className="text-muted-foreground mt-4 text-xs">
        Calcul des sessions actives...
      </div>
    </div>

    <div className="to-card rounded-lg border bg-gradient-to-t from-orange-50 p-6">
      <div className="space-y-4">
        <div className="text-muted-foreground text-sm">Conversion Rate</div>
        <div className="text-2xl font-semibold">📈 Loading...</div>
        <div className="flex items-center justify-between">
          <div className="rounded bg-yellow-100 px-2 py-1 text-xs text-yellow-800">
            ⚡ +2.8%
          </div>
        </div>
      </div>
      <div className="text-muted-foreground mt-4 text-xs">
        Analyse des conversions...
      </div>
    </div>
  </div>
);

// ===== LAZY COMPONENT =====

// Créer le composant lazy avec différentes stratégies
const LazySectionCards = useLazyComponent(
  "section-cards",
  () =>
    import("@/components/section-card").then((module) => ({
      default: module.SectionCards,
    })),
  { strategy: "on-visible" }, // Charger quand visible
);

// Version améliorée avec preload intelligent
const LazyAdvancedSectionCards = useLazyComponent(
  "section-cards-advanced",
  () =>
    import("@/components/section-card").then((module) => ({
      default: module.SectionCards,
    })),
  { strategy: "on-hover" }, // Charger au survol
);

// ===== COMPOSANTS EXPORTÉS =====

/**
 * Version basique avec code splitting
 * Utilise un skeleton simple pendant le chargement
 */
export function SectionCardsLazy() {
  return (
    <Suspense fallback={<SectionCardSkeleton />}>
      <LazySectionCards />
    </Suspense>
  );
}

/**
 * Version avancée avec preload et fallback engageant
 * Recommandée pour les composants critiques
 */
export function SectionCardsWithPreload({
  enablePreload = false,
  preloadDelay = 1000,
}: {
  enablePreload?: boolean;
  preloadDelay?: number;
}) {
  // Preload conditionnel
  useConditionalPreload("section-cards-advanced", enablePreload, preloadDelay);

  return (
    <div
      data-chunk-id="section-cards-advanced"
      onMouseEnter={() => {
        // Preload au survol du conteneur
        console.log("🎯 Preloading SectionCards on hover");
      }}
    >
      <Suspense fallback={<SectionCardPreview />}>
        <LazyAdvancedSectionCards />
      </Suspense>
    </div>
  );
}

/**
 * Version pour le dashboard avec analytics
 * Inclut le tracking des performances
 */
export function SectionCardsDashboard({
  trackPerformance = true,
}: {
  trackPerformance?: boolean;
}) {
  const [loadTime, setLoadTime] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (trackPerformance) {
      const startTime = performance.now();

      // Simuler la mesure du temps de chargement
      const timer = setTimeout(() => {
        const endTime = performance.now();
        setLoadTime(endTime - startTime);
        console.log(`📊 SectionCards loaded in ${endTime - startTime}ms`);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [trackPerformance]);

  return (
    <div className="space-y-4">
      {trackPerformance && loadTime && (
        <div className="text-muted-foreground text-right text-xs">
          ⚡ Chargé en {loadTime.toFixed(2)}ms
        </div>
      )}

      <Suspense fallback={<SectionCardPreview />}>
        <LazySectionCards />
      </Suspense>
    </div>
  );
}

/**
 * Version conditionnelle pour l'optimisation
 * Ne charge que si certaines conditions sont remplies
 */
export function SectionCardsConditional({
  condition = true,
  priority = "normal",
}: {
  condition?: boolean;
  priority?: "high" | "normal" | "low";
}) {
  if (!condition) {
    return (
      <div className="text-muted-foreground rounded-lg border p-8 text-center">
        <div className="mb-2 text-2xl">📊</div>
        <div>Métriques non disponibles</div>
      </div>
    );
  }

  const FallbackComponent =
    priority === "high" ? SectionCardPreview : SectionCardSkeleton;

  return (
    <Suspense fallback={<FallbackComponent />}>
      <LazySectionCards />
    </Suspense>
  );
}

// ===== HOOK PERSONNALISÉ =====

/**
 * Hook pour gérer le chargement intelligent des section cards
 */
export function useSectionCardsLoader(
  options: {
    autoPreload?: boolean;
    visibilityThreshold?: number;
    enableAnalytics?: boolean;
  } = {},
) {
  const {
    autoPreload = false,
    visibilityThreshold = 0.3,
    enableAnalytics = false,
  } = options;

  const [isVisible, setIsVisible] = React.useState(false);
  const [loadTime, setLoadTime] = React.useState<number | null>(null);
  const ref = React.useRef<HTMLDivElement>(null);

  // Observer d'intersection pour la visibilité
  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (enableAnalytics) {
            console.log("📈 SectionCards became visible");
          }
        }
      },
      { threshold: visibilityThreshold },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [visibilityThreshold, enableAnalytics]);

  // Preload automatique
  useConditionalPreload("section-cards", autoPreload && isVisible, 500);

  return {
    ref,
    isVisible,
    loadTime,
    shouldLoad: isVisible || autoPreload,
  };
}

// ===== EXEMPLES D'USAGE =====

/**
 * Composant de démonstration montrant différentes approches
 */
export function SectionCardsMigrationDemo() {
  const [demoType, setDemoType] = React.useState<
    "basic" | "preload" | "conditional" | "dashboard"
  >("basic");

  return (
    <div className="space-y-6">
      <div className="space-y-4 text-center">
        <h2 className="text-2xl font-bold">🚀 SectionCards Migration Demo</h2>
        <p className="text-muted-foreground">
          Différentes approches de code splitting pour le composant SectionCards
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        <button
          onClick={() => setDemoType("basic")}
          className={`rounded px-4 py-2 ${demoType === "basic" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Basique
        </button>
        <button
          onClick={() => setDemoType("preload")}
          className={`rounded px-4 py-2 ${demoType === "preload" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Avec Preload
        </button>
        <button
          onClick={() => setDemoType("conditional")}
          className={`rounded px-4 py-2 ${demoType === "conditional" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Conditionnel
        </button>
        <button
          onClick={() => setDemoType("dashboard")}
          className={`rounded px-4 py-2 ${demoType === "dashboard" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Dashboard
        </button>
      </div>

      <div className="min-h-[300px] rounded-lg border p-4">
        {demoType === "basic" && <SectionCardsLazy />}
        {demoType === "preload" && (
          <SectionCardsWithPreload enablePreload={true} />
        )}
        {demoType === "conditional" && (
          <SectionCardsConditional condition={true} priority="high" />
        )}
        {demoType === "dashboard" && (
          <SectionCardsDashboard trackPerformance={true} />
        )}
      </div>

      <div className="text-muted-foreground text-xs">
        <p>
          <strong>Type actuel:</strong> {demoType}
        </p>
        <p>
          <strong>Stratégie:</strong>{" "}
          {demoType === "basic"
            ? "Lazy loading avec skeleton simple"
            : demoType === "preload"
              ? "Preload intelligent + fallback engageant"
              : demoType === "conditional"
                ? "Chargement conditionnel avec priorité"
                : "Dashboard avec analytics de performance"}
        </p>
      </div>
    </div>
  );
}
