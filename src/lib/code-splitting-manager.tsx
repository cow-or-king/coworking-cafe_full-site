/**
 * Code Splitting Manager - Gestionnaire intelligent du code splitting
 *
 * Fonctionnalités :
 * - Lazy loading progressif des composants
 * - Preload intelligent basé sur l'usage
 * - Code splitting au niveau des routes et composants
 * - Cache des chunks et optimisation du bundle
 */

import React, { Suspense } from "react";

// Types pour le système de code splitting
interface ComponentChunk {
  id: string;
  path: string;
  priority: "critical" | "high" | "medium" | "low";
  preload?: boolean;
  dependencies?: string[];
  size?: number;
  loadTime?: number;
}

interface LoadingStrategy {
  strategy: "immediate" | "on-hover" | "on-visible" | "on-demand";
  threshold?: number;
  delay?: number;
}

interface ChunkAnalytics {
  chunkId: string;
  loadCount: number;
  avgLoadTime: number;
  lastLoaded: number;
  cacheHit: boolean;
}

// ===== GESTIONNAIRE DE CODE SPLITTING =====
export class CodeSplittingManager {
  private static instance: CodeSplittingManager;
  private chunks: Map<string, ComponentChunk> = new Map();
  private loadedChunks: Set<string> = new Set();
  private analytics: Map<string, ChunkAnalytics> = new Map();
  private preloadQueue: string[] = [];

  static getInstance(): CodeSplittingManager {
    if (!CodeSplittingManager.instance) {
      CodeSplittingManager.instance = new CodeSplittingManager();
    }
    return CodeSplittingManager.instance;
  }

  private constructor() {
    this.initializeChunks();
    this.setupIntersectionObserver();
  }

  /**
   * Registre un composant pour le lazy loading
   */
  registerChunk(chunk: ComponentChunk): void {
    this.chunks.set(chunk.id, chunk);

    // Preload automatique des chunks critiques
    if (chunk.priority === "critical" && chunk.preload) {
      this.preloadChunk(chunk.id);
    }
  }

  /**
   * Création d'un composant lazy avec stratégie de chargement
   */
  createLazyComponent<T extends React.ComponentType<any>>(
    chunkId: string,
    importFunc: () => Promise<{ default: T }>,
    strategy: LoadingStrategy = { strategy: "on-demand" },
    fallback?: React.ReactNode,
  ): React.ComponentType<React.ComponentProps<T>> {
    const LazyComponent = React.lazy(() => {
      const startTime = performance.now();

      return importFunc().then((module) => {
        const loadTime = performance.now() - startTime;
        this.recordAnalytics(chunkId, loadTime);
        this.loadedChunks.add(chunkId);

        console.log(
          `📦 Code Split: ${chunkId} loaded in ${loadTime.toFixed(2)}ms`,
        );
        return module;
      });
    });

    return (props: React.ComponentProps<T>) => (
      <Suspense fallback={fallback || this.createLoadingFallback(chunkId)}>
        <LazyComponent {...props} />
      </Suspense>
    );
  }

  /**
   * Preload intelligent des chunks
   */
  async preloadChunk(chunkId: string): Promise<void> {
    if (this.loadedChunks.has(chunkId)) return;

    const chunk = this.chunks.get(chunkId);
    if (!chunk) return;

    try {
      // Importer le module sans l'utiliser (preload)
      const module = await import(chunk.path);
      this.loadedChunks.add(chunkId);
      console.log(`🚀 Preloaded: ${chunkId}`);
    } catch (error) {
      console.warn(`❌ Failed to preload ${chunkId}:`, error);
    }
  }

  /**
   * Preload basé sur la proximité (hover, visible)
   */
  setupPreloadOnHover(element: HTMLElement, chunkId: string): void {
    const handleMouseEnter = () => {
      this.preloadChunk(chunkId);
      element.removeEventListener("mouseenter", handleMouseEnter);
    };

    element.addEventListener("mouseenter", handleMouseEnter);
  }

  /**
   * Observer d'intersection pour le preload automatique
   */
  private setupIntersectionObserver(): void {
    if (typeof window === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const chunkId = entry.target.getAttribute("data-chunk-id");
            if (chunkId) {
              this.preloadChunk(chunkId);
              observer.unobserve(entry.target);
            }
          }
        });
      },
      { rootMargin: "100px" }, // Preload 100px avant d'être visible
    );

    // Stocker l'observer pour usage ultérieur
    (this as any).intersectionObserver = observer;
  }

  /**
   * Analyser et optimiser les chunks
   */
  analyzeBundleUsage(): {
    totalChunks: number;
    loadedChunks: number;
    unusedChunks: string[];
    heavyChunks: string[];
    recommendations: string[];
  } {
    const unusedChunks = Array.from(this.chunks.keys()).filter(
      (id) => !this.loadedChunks.has(id),
    );

    const heavyChunks = Array.from(this.analytics.entries())
      .filter(([_, analytics]) => analytics.avgLoadTime > 1000)
      .map(([id]) => id);

    const recommendations: string[] = [];

    if (unusedChunks.length > 0) {
      recommendations.push(
        `🎯 ${unusedChunks.length} chunks non utilisés peuvent être optimisés`,
      );
    }

    if (heavyChunks.length > 0) {
      recommendations.push(
        `⚡ ${heavyChunks.length} chunks lents (>1s) à optimiser`,
      );
    }

    return {
      totalChunks: this.chunks.size,
      loadedChunks: this.loadedChunks.size,
      unusedChunks,
      heavyChunks,
      recommendations,
    };
  }

  /**
   * Enregistrer les métriques d'usage
   */
  private recordAnalytics(chunkId: string, loadTime: number): void {
    const existing = this.analytics.get(chunkId) || {
      chunkId,
      loadCount: 0,
      avgLoadTime: 0,
      lastLoaded: 0,
      cacheHit: false,
    };

    existing.loadCount++;
    existing.avgLoadTime =
      (existing.avgLoadTime + loadTime) / existing.loadCount;
    existing.lastLoaded = Date.now();
    existing.cacheHit = this.loadedChunks.has(chunkId);

    this.analytics.set(chunkId, existing);
  }

  /**
   * Créer un fallback de chargement personnalisé
   */
  private createLoadingFallback(chunkId: string): React.ReactNode {
    const chunk = this.chunks.get(chunkId);

    return (
      <div className="flex items-center justify-center p-8">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
        <span className="text-muted-foreground ml-2 text-sm">
          Chargement {chunk?.id || chunkId}...
        </span>
      </div>
    );
  }

  /**
   * Initialiser les chunks par défaut
   */
  private initializeChunks(): void {
    // Chunks critiques à preloader
    this.registerChunk({
      id: "dashboard-section-card",
      path: "@/components/dashboard/section-card",
      priority: "critical",
      preload: true,
    });

    // Chunks moyens - preload on hover
    this.registerChunk({
      id: "staff-advanced-table",
      path: "@/components/dashboard/staff/staff-table-advanced",
      priority: "high",
      preload: false,
    });

    // Chunks lourds - load on demand
    this.registerChunk({
      id: "pdf-generation",
      path: "@/components/ui/generic-pdf",
      priority: "medium",
      preload: false,
    });

    this.registerChunk({
      id: "type-optimizer",
      path: "@/components/ui/type-optimizer",
      priority: "low",
      preload: false,
    });
  }
}

// ===== HOOKS POUR CODE SPLITTING =====

/**
 * Hook pour lazy loading avec analytics
 */
export function useLazyComponent<T extends React.ComponentType<any>>(
  chunkId: string,
  importFunc: () => Promise<{ default: T }>,
  strategy?: LoadingStrategy,
) {
  const manager = CodeSplittingManager.getInstance();

  return React.useMemo(
    () => manager.createLazyComponent(chunkId, importFunc, strategy),
    [chunkId, importFunc, strategy],
  );
}

/**
 * Hook pour preload conditionnel
 */
export function useConditionalPreload(
  chunkId: string,
  condition: boolean,
  delay: number = 0,
) {
  React.useEffect(() => {
    if (condition) {
      const manager = CodeSplittingManager.getInstance();
      const timeoutId = setTimeout(() => {
        manager.preloadChunk(chunkId);
      }, delay);

      return () => clearTimeout(timeoutId);
    }
  }, [chunkId, condition, delay]);
}

/**
 * Hook pour analytics du bundle
 */
export function useBundleAnalytics() {
  const [analytics, setAnalytics] = React.useState(() =>
    CodeSplittingManager.getInstance().analyzeBundleUsage(),
  );

  const refresh = React.useCallback(() => {
    setAnalytics(CodeSplittingManager.getInstance().analyzeBundleUsage());
  }, []);

  React.useEffect(() => {
    const interval = setInterval(refresh, 10000); // Refresh every 10s
    return () => clearInterval(interval);
  }, [refresh]);

  return { analytics, refresh };
}

// ===== UTILITAIRES DE MIGRATION =====

/**
 * HOC pour migration progressive vers code splitting
 */
export function withProgressiveLoading<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  chunkId: string,
  strategy: LoadingStrategy = { strategy: "on-demand" },
) {
  const manager = CodeSplittingManager.getInstance();

  return manager.createLazyComponent(
    chunkId,
    () => Promise.resolve({ default: WrappedComponent }),
    strategy,
  );
}

/**
 * Générateur de composants lazy pour patterns récurrents
 */
export const LazyComponentGenerator = {
  // Tables de données
  createLazyTable: (tableName: string, importPath: string) => {
    return useLazyComponent(`table-${tableName}`, () => import(importPath), {
      strategy: "on-visible",
    });
  },

  // Formulaires
  createLazyForm: (formName: string, importPath: string) => {
    return useLazyComponent(`form-${formName}`, () => import(importPath), {
      strategy: "on-demand",
    });
  },

  // Modales
  createLazyModal: (modalName: string, importPath: string) => {
    return useLazyComponent(`modal-${modalName}`, () => import(importPath), {
      strategy: "on-demand",
    });
  },

  // Charts
  createLazyChart: (chartName: string, importPath: string) => {
    return useLazyComponent(`chart-${chartName}`, () => import(importPath), {
      strategy: "on-visible",
      threshold: 0.3,
    });
  },
};

// Instance globale
export const codeSplittingManager = CodeSplittingManager.getInstance();
