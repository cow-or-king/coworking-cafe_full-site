/**
 * Pattern Generator - Générateur automatique de patterns code splitting
 *
 * Ce système génère automatiquement des patterns de code splitting
 * pour différents types de composants courants.
 */

// Types de patterns supportés
export type ComponentPattern =
  | "form"
  | "table"
  | "chart"
  | "modal"
  | "dashboard"
  | "pdf"
  | "editor"
  | "calendar"
  | "map"
  | "gallery";

export type LoadingStrategy =
  | "immediate"
  | "on-demand"
  | "on-visible"
  | "on-hover"
  | "on-interaction"
  | "preload-conditional";

// Configuration d'un pattern
interface PatternConfig {
  pattern: ComponentPattern;
  strategy: LoadingStrategy;
  fallbackType: "skeleton" | "preview" | "placeholder" | "spinner";
  enableAnalytics?: boolean;
  enablePreload?: boolean;
  preloadConditions?: string[];
}

// ===== GÉNÉRATEUR DE PATTERNS =====
export class CodeSplittingPatternGenerator {
  /**
   * Générer un pattern complet pour un type de composant
   */
  generatePattern(config: PatternConfig): {
    component: string;
    fallback: string;
    hook: string;
    usage: string;
  } {
    const componentName = this.getComponentName(config.pattern);
    const fallbackComponent = this.generateFallback(config);
    const hookCode = this.generateHook(config);
    const componentCode = this.generateComponent(config, componentName);
    const usageExample = this.generateUsageExample(config, componentName);

    return {
      component: componentCode,
      fallback: fallbackComponent,
      hook: hookCode,
      usage: usageExample,
    };
  }

  /**
   * Générer le nom du composant basé sur le pattern
   */
  private getComponentName(pattern: ComponentPattern): string {
    const names = {
      form: "AdvancedForm",
      table: "DataTable",
      chart: "AnalyticsChart",
      modal: "DialogModal",
      dashboard: "DashboardWidget",
      pdf: "PDFGenerator",
      editor: "RichTextEditor",
      calendar: "CalendarPicker",
      map: "InteractiveMap",
      gallery: "ImageGallery",
    };
    return names[pattern];
  }

  /**
   * Générer le composant fallback
   */
  private generateFallback(config: PatternConfig): string {
    const componentName = this.getComponentName(config.pattern);

    switch (config.fallbackType) {
      case "skeleton":
        return this.generateSkeletonFallback(config, componentName);
      case "preview":
        return this.generatePreviewFallback(config, componentName);
      case "placeholder":
        return this.generatePlaceholderFallback(config, componentName);
      default:
        return this.generateSpinnerFallback(config, componentName);
    }
  }

  private generateSkeletonFallback(
    config: PatternConfig,
    componentName: string,
  ): string {
    const skeletons: Record<ComponentPattern, string> = {
      form: `
const ${componentName}Skeleton = () => (
  <div className="space-y-4 p-6 border rounded-lg">
    <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
    {[...Array(3)].map((_, i) => (
      <div key={i} className="space-y-2">
        <div className="h-3 bg-gray-200 rounded w-1/3 animate-pulse"></div>
        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
      </div>
    ))}
    <div className="h-10 bg-gray-300 rounded animate-pulse"></div>
  </div>
);`,
      table: `
const ${componentName}Skeleton = () => (
  <div className="border rounded-lg overflow-hidden">
    <div className="h-12 bg-gray-100 border-b animate-pulse"></div>
    {[...Array(5)].map((_, i) => (
      <div key={i} className="h-16 border-b flex items-center space-x-4 p-4">
        {[...Array(4)].map((_, j) => (
          <div key={j} className="h-4 bg-gray-200 rounded flex-1 animate-pulse"></div>
        ))}
      </div>
    ))}
  </div>
);`,
      chart: `
const ${componentName}Skeleton = () => (
  <div className="p-6 border rounded-lg space-y-4">
    <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
    <div className="h-64 bg-gray-100 rounded animate-pulse"></div>
    <div className="flex space-x-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
      ))}
    </div>
  </div>
);`,
      modal: `
const ${componentName}Skeleton = () => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
    <div className="bg-white rounded-lg p-6 w-full max-w-md space-y-4">
      <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
      </div>
      <div className="flex space-x-2">
        <div className="h-9 bg-gray-300 rounded flex-1 animate-pulse"></div>
        <div className="h-9 bg-gray-200 rounded flex-1 animate-pulse"></div>
      </div>
    </div>
  </div>
);`,
      dashboard: `
const ${componentName}Skeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="p-4 border rounded-lg space-y-3">
        <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
        <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        <div className="h-16 bg-gray-100 rounded animate-pulse"></div>
      </div>
    ))}
  </div>
);`,
      pdf: `
const ${componentName}Skeleton = () => (
  <div className="border rounded-lg p-6 space-y-4">
    <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
    <div className="h-96 bg-gray-100 border-2 border-dashed rounded animate-pulse"></div>
    <div className="flex space-x-2">
      <div className="h-10 bg-gray-300 rounded w-24 animate-pulse"></div>
      <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
    </div>
  </div>
);`,
      editor: `
const ${componentName}Skeleton = () => (
  <div className="border rounded-lg overflow-hidden">
    <div className="h-12 bg-gray-100 border-b flex items-center space-x-2 px-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
      ))}
    </div>
    <div className="h-96 bg-white p-4">
      <div className="space-y-3">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
        ))}
      </div>
    </div>
  </div>
);`,
      calendar: `
const ${componentName}Skeleton = () => (
  <div className="border rounded-lg p-6 space-y-4">
    <div className="flex justify-between items-center">
      <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
      <div className="flex space-x-2">
        <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
    <div className="grid grid-cols-7 gap-2">
      {[...Array(42)].map((_, i) => (
        <div key={i} className="h-8 bg-gray-100 rounded animate-pulse"></div>
      ))}
    </div>
  </div>
);`,
      map: `
const ${componentName}Skeleton = () => (
  <div className="border rounded-lg overflow-hidden">
    <div className="h-96 bg-gray-100 relative animate-pulse">
      <div className="absolute inset-4 bg-gray-200 rounded"></div>
      <div className="absolute top-4 left-4 right-4 h-10 bg-white rounded shadow"></div>
    </div>
  </div>
);`,
      gallery: `
const ${componentName}Skeleton = () => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
    {[...Array(12)].map((_, i) => (
      <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
    ))}
  </div>
);`,
    };

    return skeletons[config.pattern];
  }

  private generatePreviewFallback(
    config: PatternConfig,
    componentName: string,
  ): string {
    const previews: Record<ComponentPattern, string> = {
      form: `
const ${componentName}Preview = () => (
  <div className="p-6 border rounded-lg bg-gradient-to-r from-blue-50 to-white">
    <div className="flex items-center gap-2 mb-4">
      <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
      <h3 className="font-semibold">📝 Formulaire en cours de chargement...</h3>
    </div>
    <div className="space-y-3 opacity-60">
      <div className="flex items-center gap-2">
        <span className="text-sm">📧</span>
        <span className="text-sm">Champs email disponibles</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm">🔒</span>
        <span className="text-sm">Validation automatique</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm">✨</span>
        <span className="text-sm">Interface moderne</span>
      </div>
    </div>
  </div>
);`,
      table: `
const ${componentName}Preview = () => (
  <div className="border rounded-lg bg-gradient-to-r from-green-50 to-white">
    <div className="p-4 border-b">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        <h3 className="font-semibold">📊 Table de données en préparation...</h3>
      </div>
    </div>
    <div className="p-4 space-y-2 opacity-60">
      <div className="flex justify-between text-sm">
        <span>🔍 Recherche instantanée</span>
        <span>📂 Export CSV/PDF</span>
      </div>
      <div className="flex justify-between text-sm">
        <span>🎯 Filtres avancés</span>
        <span>📈 Tri multi-colonnes</span>
      </div>
    </div>
  </div>
);`,
      chart: `
const ${componentName}Preview = () => (
  <div className="p-6 border rounded-lg bg-gradient-to-r from-purple-50 to-white">
    <div className="flex items-center gap-2 mb-4">
      <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
      <h3 className="font-semibold">📈 Graphiques en génération...</h3>
    </div>
    <div className="h-48 bg-gradient-to-t from-purple-100 to-white rounded flex items-center justify-center">
      <div className="text-center space-y-2 opacity-60">
        <div className="text-2xl">📊</div>
        <div className="text-sm">Analyse des données en cours</div>
      </div>
    </div>
  </div>
);`,
      modal: `
const ${componentName}Preview = () => (
  <div className="p-6 border rounded-lg bg-gradient-to-r from-indigo-50 to-white">
    <div className="flex items-center gap-2 mb-4">
      <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse"></div>
      <h3 className="font-semibold">🪟 Interface modale en préparation...</h3>
    </div>
    <div className="space-y-3 opacity-60">
      <div className="text-sm">⚡ Chargement interactif</div>
      <div className="text-sm">🎨 Interface moderne</div>
      <div className="text-sm">🔒 Gestion des états</div>
    </div>
  </div>
);`,
      dashboard: `
const ${componentName}Preview = () => (
  <div className="p-6 border rounded-lg bg-gradient-to-r from-orange-50 to-white">
    <div className="flex items-center gap-2 mb-4">
      <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
      <h3 className="font-semibold">🎛️ Dashboard en construction...</h3>
    </div>
    <div className="grid grid-cols-3 gap-4 opacity-60">
      <div className="text-center text-sm">📊 Métriques</div>
      <div className="text-center text-sm">📈 Analytics</div>
      <div className="text-center text-sm">⚡ Performance</div>
    </div>
  </div>
);`,
      pdf: `
const ${componentName}Preview = () => (
  <div className="p-6 border rounded-lg bg-gradient-to-r from-red-50 to-white">
    <div className="flex items-center gap-2 mb-4">
      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
      <h3 className="font-semibold">📄 Générateur PDF en cours...</h3>
    </div>
    <div className="text-center space-y-2 opacity-60">
      <div className="text-sm">🎨 Templates avancés</div>
      <div className="text-sm">📋 Export haute qualité</div>
    </div>
  </div>
);`,
      editor: `
const ${componentName}Preview = () => (
  <div className="p-6 border rounded-lg bg-gradient-to-r from-emerald-50 to-white">
    <div className="flex items-center gap-2 mb-4">
      <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
      <h3 className="font-semibold">✏️ Éditeur en chargement...</h3>
    </div>
    <div className="text-center space-y-2 opacity-60">
      <div className="text-sm">🎨 Éditeur riche</div>
      <div className="text-sm">⌨️ Raccourcis clavier</div>
    </div>
  </div>
);`,
      calendar: `
const ${componentName}Preview = () => (
  <div className="p-6 border rounded-lg bg-gradient-to-r from-cyan-50 to-white">
    <div className="flex items-center gap-2 mb-4">
      <div className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse"></div>
      <h3 className="font-semibold">📅 Calendrier en préparation...</h3>
    </div>
    <div className="text-center space-y-2 opacity-60">
      <div className="text-sm">📅 Vue mensuelle</div>
      <div className="text-sm">⏰ Gestion d'événements</div>
    </div>
  </div>
);`,
      map: `
const ${componentName}Preview = () => (
  <div className="p-6 border rounded-lg bg-gradient-to-r from-green-50 to-white">
    <div className="flex items-center gap-2 mb-4">
      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
      <h3 className="font-semibold">🗺️ Carte interactive en cours...</h3>
    </div>
    <div className="text-center space-y-2 opacity-60">
      <div className="text-sm">🗺️ Navigation fluide</div>
      <div className="text-sm">📍 Marqueurs interactifs</div>
    </div>
  </div>
);`,
      gallery: `
const ${componentName}Preview = () => (
  <div className="p-6 border rounded-lg bg-gradient-to-r from-pink-50 to-white">
    <div className="flex items-center gap-2 mb-4">
      <div className="w-3 h-3 bg-pink-500 rounded-full animate-pulse"></div>
      <h3 className="font-semibold">🖼️ Galerie en construction...</h3>
    </div>
    <div className="text-center space-y-2 opacity-60">
      <div className="text-sm">🖼️ Affichage optimisé</div>
      <div className="text-sm">🔍 Zoom interactif</div>
    </div>
  </div>
);`,
    };

    return previews[config.pattern];
  }

  private generatePlaceholderFallback(
    config: PatternConfig,
    componentName: string,
  ): string {
    return `
const ${componentName}Placeholder = () => (
  <div className="p-8 text-center border rounded-lg bg-gray-50">
    <div className="text-4xl mb-2">${this.getPatternIcon(config.pattern)}</div>
    <div className="font-medium mb-1">Chargement du ${config.pattern}</div>
    <div className="text-sm text-gray-600">Préparation de l'interface...</div>
  </div>
);`;
  }

  private generateSpinnerFallback(
    config: PatternConfig,
    componentName: string,
  ): string {
    return `
const ${componentName}Spinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    <span className="ml-2 text-sm">Chargement du ${config.pattern}...</span>
  </div>
);`;
  }

  /**
   * Générer le hook personnalisé
   */
  private generateHook(config: PatternConfig): string {
    const componentName = this.getComponentName(config.pattern);
    const hookName = `use${componentName}Loader`;

    return `
/**
 * Hook pour gérer le chargement intelligent du ${componentName}
 */
export function ${hookName}(options: {
  autoPreload?: boolean;
  enableAnalytics?: boolean;
  preloadDelay?: number;
} = {}) {
  const {
    autoPreload = ${config.enablePreload || false},
    enableAnalytics = ${config.enableAnalytics || false},
    preloadDelay = 1000
  } = options;

  const [isLoaded, setIsLoaded] = React.useState(false);
  const [loadTime, setLoadTime] = React.useState<number | null>(null);
  const [error, setError] = React.useState<Error | null>(null);

  ${
    config.strategy === "on-visible"
      ? `
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (enableAnalytics) {
            console.log('📈 ${componentName} became visible');
          }
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [enableAnalytics]);`
      : ""
  }

  // Preload conditionnel
  useConditionalPreload(
    '${config.pattern}-component', 
    autoPreload ${config.strategy === "on-visible" ? "&& isVisible" : ""}, 
    preloadDelay
  );

  // Analytics de performance
  React.useEffect(() => {
    if (isLoaded && enableAnalytics && !loadTime) {
      const time = performance.now();
      setLoadTime(time);
      console.log(\`⚡ ${componentName} loaded in \${time}ms\`);
    }
  }, [isLoaded, enableAnalytics, loadTime]);

  return {
    ${config.strategy === "on-visible" ? "ref," : ""}
    isLoaded,
    loadTime,
    error,
    setIsLoaded,
    setError,
    shouldLoad: ${config.strategy === "on-visible" ? "isVisible ||" : ""} autoPreload
  };
}`;
  }

  /**
   * Générer le composant principal
   */
  private generateComponent(
    config: PatternConfig,
    componentName: string,
  ): string {
    const lazyComponentName = `Lazy${componentName}`;
    const fallbackComponentName = `${componentName}${this.capitalizeFirst(config.fallbackType)}`;

    return `
import React, { Suspense } from 'react';
import { useLazyComponent, useConditionalPreload } from '@/lib/code-splitting-manager';

// Lazy component avec stratégie ${config.strategy}
const ${lazyComponentName} = useLazyComponent(
  '${config.pattern}-component',
  () => import('./original-${componentName.toLowerCase()}'),
  { strategy: '${config.strategy}' }
);

${this.generateFallback(config)}

/**
 * ${componentName} avec code splitting
 * Pattern: ${config.pattern} | Stratégie: ${config.strategy}
 */
export function ${componentName}WithCodeSplitting(props: any) {
  ${
    config.enablePreload
      ? `
  // Preload intelligent
  useConditionalPreload('${config.pattern}-component', props.enablePreload, 1000);`
      : ""
  }

  return (
    <div 
      data-chunk-id="${config.pattern}-component"
      ${
        config.strategy === "on-hover"
          ? `
      onMouseEnter={() => {
        console.log('🎯 Preloading ${componentName} on hover');
      }}`
          : ""
      }
    >
      <Suspense fallback={<${fallbackComponentName} />}>
        <${lazyComponentName} {...props} />
      </Suspense>
    </div>
  );
}

/**
 * Version avancée avec analytics et gestion d'erreur
 */
export function ${componentName}Advanced(props: any & {
  enableAnalytics?: boolean;
  fallbackType?: '${config.fallbackType}';
  onLoadComplete?: (loadTime: number) => void;
}) {
  const { enableAnalytics, onLoadComplete, ...restProps } = props;
  const [loadTime, setLoadTime] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (enableAnalytics) {
      const startTime = performance.now();
      
      const timer = setTimeout(() => {
        const endTime = performance.now();
        const duration = endTime - startTime;
        setLoadTime(duration);
        onLoadComplete?.(duration);
        console.log(\`📊 ${componentName} analytics: \${duration}ms\`);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [enableAnalytics, onLoadComplete]);

  return (
    <div className="space-y-2">
      ${
        config.enableAnalytics
          ? `
      {enableAnalytics && loadTime && (
        <div className="text-xs text-muted-foreground text-right">
          ⚡ Chargé en {loadTime.toFixed(2)}ms
        </div>
      )}`
          : ""
      }
      
      <${componentName}WithCodeSplitting {...restProps} />
    </div>
  );
}`;
  }

  /**
   * Générer un exemple d'usage
   */
  private generateUsageExample(
    config: PatternConfig,
    componentName: string,
  ): string {
    return `
// ===== EXEMPLES D'USAGE =====

// 1. Usage basique
<${componentName}WithCodeSplitting />

// 2. Avec preload et analytics
<${componentName}Advanced 
  enableAnalytics={true}
  enablePreload={true}
  onLoadComplete={(time) => console.log(\`Loaded in \${time}ms\`)}
/>

// 3. Usage conditionnel
{condition && (
  <${componentName}WithCodeSplitting 
    ${config.strategy === "on-hover" ? "onMouseEnter={() => preloadNext()}" : ""}
  />
)}

// 4. Dans une route Next.js
export default function ${componentName}Page() {
  return (
    <Suspense fallback={<PageLoader />}>
      <${componentName}Advanced enableAnalytics={true} />
    </Suspense>
  );
}

// 5. Avec le hook personnalisé
function Custom${componentName}() {
  const { ${config.strategy === "on-visible" ? "ref, " : ""}shouldLoad, loadTime } = use${componentName}Loader({
    autoPreload: true,
    enableAnalytics: true
  });

  return (
    <div ${config.strategy === "on-visible" ? "ref={ref}" : ""}>
      {shouldLoad ? (
        <${componentName}WithCodeSplitting />
      ) : (
        <div>Composant en attente...</div>
      )}
    </div>
  );
}`;
  }

  /**
   * Obtenir l'icône pour un pattern
   */
  private getPatternIcon(pattern: ComponentPattern): string {
    const icons = {
      form: "📝",
      table: "📊",
      chart: "📈",
      modal: "🪟",
      dashboard: "🎛️",
      pdf: "📄",
      editor: "✏️",
      calendar: "📅",
      map: "🗺️",
      gallery: "🖼️",
    };
    return icons[pattern] || "📦";
  }

  /**
   * Capitaliser la première lettre
   */
  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

// ===== GÉNÉRATEUR RAPIDE =====
export function generateCodeSplittingPattern(
  pattern: ComponentPattern,
  strategy: LoadingStrategy = "on-demand",
  fallbackType: "skeleton" | "preview" | "placeholder" | "spinner" = "skeleton",
) {
  const generator = new CodeSplittingPatternGenerator();

  return generator.generatePattern({
    pattern,
    strategy,
    fallbackType,
    enableAnalytics: true,
    enablePreload: strategy !== "immediate",
  });
}

// ===== PATTERNS PRÉDÉFINIS =====
export const PREDEFINED_PATTERNS = {
  // Formulaires - Chargement à la demande avec preview
  ADVANCED_FORM: {
    pattern: "form" as const,
    strategy: "on-demand" as const,
    fallbackType: "preview" as const,
    enableAnalytics: true,
    enablePreload: true,
  },

  // Tables - Chargement visible avec skeleton
  DATA_TABLE: {
    pattern: "table" as const,
    strategy: "on-visible" as const,
    fallbackType: "skeleton" as const,
    enableAnalytics: true,
    enablePreload: false,
  },

  // Charts - Preload au hover avec preview
  ANALYTICS_CHART: {
    pattern: "chart" as const,
    strategy: "on-hover" as const,
    fallbackType: "preview" as const,
    enableAnalytics: true,
    enablePreload: true,
  },

  // Modales - Chargement immédiat avec placeholder
  MODAL_DIALOG: {
    pattern: "modal" as const,
    strategy: "immediate" as const,
    fallbackType: "placeholder" as const,
    enableAnalytics: false,
    enablePreload: false,
  },

  // PDF - Chargement à la demande avec spinner
  PDF_GENERATOR: {
    pattern: "pdf" as const,
    strategy: "on-demand" as const,
    fallbackType: "spinner" as const,
    enableAnalytics: true,
    enablePreload: false,
  },
};

// Export du générateur
export const patternGenerator = new CodeSplittingPatternGenerator();
