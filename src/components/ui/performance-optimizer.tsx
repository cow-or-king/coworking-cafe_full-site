/**
 * Performance Optimization System
 * Automated code cleanup, performance monitoring, and optimization utilities
 *
 * Features:
 * - Debug code removal
 * - Bundle size optimization
 * - Performance monitoring
 * - Memory leak detection
 * - Automated code analysis
 */

import * as React from "react";

// Types pour le système d'optimisation
interface PerformanceMetrics {
  renderTime: number;
  componentCount: number;
  reRenderCount: number;
  memoryUsage: number;
  bundleSize?: number;
}

interface OptimizationConfig {
  enableProfiling: boolean;
  enableMemoryTracking: boolean;
  enableRenderTracking: boolean;
  debugMode: boolean;
  autoCleanup: boolean;
}

// Utilitaires pour mesurer les performances
export class PerformanceProfiler {
  private metrics: Map<string, PerformanceMetrics> = new Map();
  private config: OptimizationConfig;

  constructor(config: Partial<OptimizationConfig> = {}) {
    this.config = {
      enableProfiling: process.env.NODE_ENV === "development",
      enableMemoryTracking: process.env.NODE_ENV === "development",
      enableRenderTracking: process.env.NODE_ENV === "development",
      debugMode: process.env.NODE_ENV === "development",
      autoCleanup: true,
      ...config,
    };
  }

  startProfiling(componentName: string): () => void {
    if (!this.config.enableProfiling) {
      return () => {};
    }

    const startTime = performance.now();
    const startMemory = this.getMemoryUsage();

    return () => {
      const endTime = performance.now();
      const endMemory = this.getMemoryUsage();

      const metrics: PerformanceMetrics = {
        renderTime: endTime - startTime,
        componentCount: 1,
        reRenderCount: this.metrics.get(componentName)?.reRenderCount || 0 + 1,
        memoryUsage: endMemory - startMemory,
      };

      this.metrics.set(componentName, metrics);

      if (this.config.debugMode) {
        console.log(`🚀 Performance [${componentName}]:`, {
          renderTime: `${metrics.renderTime.toFixed(2)}ms`,
          reRenders: metrics.reRenderCount,
          memory: `${metrics.memoryUsage.toFixed(2)}MB`,
        });
      }
    };
  }

  private getMemoryUsage(): number {
    if (typeof window !== "undefined" && "memory" in performance) {
      return (performance as any).memory.usedJSHeapSize / 1024 / 1024;
    }
    return 0;
  }

  getMetrics(
    componentName?: string,
  ): PerformanceMetrics | Map<string, PerformanceMetrics> {
    return componentName ? this.metrics.get(componentName)! : this.metrics;
  }

  clearMetrics(): void {
    this.metrics.clear();
  }

  generateReport(): string {
    let report = "📊 Performance Report\n";
    report += "=====================================\n\n";

    for (const [component, metrics] of this.metrics) {
      report += `🔧 ${component}:\n`;
      report += `   Render Time: ${metrics.renderTime.toFixed(2)}ms\n`;
      report += `   Re-renders: ${metrics.reRenderCount}\n`;
      report += `   Memory: ${metrics.memoryUsage.toFixed(2)}MB\n`;
      report += "\n";
    }

    return report;
  }
}

// Hook pour mesurer les performances des composants
export function usePerformanceProfiler(
  componentName: string,
  deps: React.DependencyList = [],
) {
  const profilerRef = React.useRef<PerformanceProfiler | null>(null);

  if (!profilerRef.current) {
    profilerRef.current = new PerformanceProfiler();
  }

  React.useEffect(() => {
    const stopProfiling = profilerRef.current!.startProfiling(componentName);
    return stopProfiling;
  }, deps);

  return {
    getMetrics: () => profilerRef.current!.getMetrics(componentName),
    generateReport: () => profilerRef.current!.generateReport(),
  };
}

// Hook pour détecter les fuites mémoire
export function useMemoryLeakDetector(componentName: string) {
  const mountedRef = React.useRef(true);
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      intervalRef.current = setInterval(() => {
        if (!mountedRef.current) return;

        const memory = (performance as any).memory;
        if (memory && memory.usedJSHeapSize > 100 * 1024 * 1024) {
          // 100MB
          console.warn(
            `⚠️ Memory leak detected in ${componentName}: ${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
          );
        }
      }, 5000);
    }

    return () => {
      mountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [componentName]);
}

// Utilitaire pour nettoyer le code de debug
export class DebugCleaner {
  private static readonly DEBUG_PATTERNS = [
    /console\.(log|debug|info|warn|error)\([^)]*\);?\s*\n?/g,
    /\/\/ DEBUG:.*\n/g,
    /\/\/ FIXME:.*\n/g,
    /\/\/ TODO:.*\n/g,
    /\/\* DEBUG[\s\S]*?\*\//g,
    /if\s*\(\s*process\.env\.NODE_ENV\s*===\s*['"]development['"]\s*\)\s*\{[\s\S]*?\}/g,
  ];

  static cleanCode(code: string): string {
    let cleanedCode = code;

    for (const pattern of this.DEBUG_PATTERNS) {
      cleanedCode = cleanedCode.replace(pattern, "");
    }

    // Nettoyer les lignes vides multiples
    cleanedCode = cleanedCode.replace(/\n\s*\n\s*\n/g, "\n\n");

    return cleanedCode.trim();
  }

  static analyzeCode(code: string): {
    debugLines: number;
    todoComments: number;
    consoleStatements: number;
    fileSize: number;
    cleanedSize: number;
    reduction: number;
  } {
    const originalSize = code.length;
    const cleanedCode = this.cleanCode(code);
    const cleanedSize = cleanedCode.length;

    return {
      debugLines: (code.match(/\/\/ DEBUG:/g) || []).length,
      todoComments: (code.match(/\/\/ TODO:/g) || []).length,
      consoleStatements: (code.match(/console\./g) || []).length,
      fileSize: originalSize,
      cleanedSize,
      reduction: Math.round(
        ((originalSize - cleanedSize) / originalSize) * 100,
      ),
    };
  }
}

// Hook pour optimiser les re-renders
export function useOptimizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList,
): T {
  return React.useCallback(callback, deps);
}

export function useOptimizedMemo<T>(
  factory: () => T,
  deps: React.DependencyList,
): T {
  return React.useMemo(factory, deps);
}

// Hook pour lazy loading des composants
export function useLazyComponent<T = React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ComponentType,
) {
  const [Component, setComponent] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    let mounted = true;

    importFunc()
      .then((module) => {
        if (mounted) {
          setComponent(() => module.default);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err);
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  return { Component, loading, error };
}

// Composant pour afficher les métriques de performance
interface PerformanceMonitorProps {
  componentName: string;
  showInProduction?: boolean;
}

export function PerformanceMonitor({
  componentName,
  showInProduction = false,
}: PerformanceMonitorProps) {
  const [metrics, setMetrics] = React.useState<PerformanceMetrics | null>(null);
  const profilerRef = React.useRef<PerformanceProfiler | null>(null);

  React.useEffect(() => {
    if (process.env.NODE_ENV === "development" || showInProduction) {
      profilerRef.current = new PerformanceProfiler();
      const stopProfiling = profilerRef.current.startProfiling(componentName);

      const updateMetrics = () => {
        const currentMetrics = profilerRef.current!.getMetrics(
          componentName,
        ) as PerformanceMetrics;
        setMetrics(currentMetrics);
      };

      const interval = setInterval(updateMetrics, 1000);

      return () => {
        stopProfiling();
        clearInterval(interval);
      };
    }
  }, [componentName, showInProduction]);

  if (process.env.NODE_ENV === "production" && !showInProduction) {
    return null;
  }

  if (!metrics) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 rounded bg-black/80 p-2 font-mono text-xs text-white">
      <div className="font-bold">{componentName}</div>
      <div>Render: {metrics.renderTime.toFixed(1)}ms</div>
      <div>Re-renders: {metrics.reRenderCount}</div>
      <div>Memory: {metrics.memoryUsage.toFixed(1)}MB</div>
    </div>
  );
}

// HOC pour wrapper les composants avec profiling
export function withPerformanceProfiler<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName?: string,
) {
  const WithProfiler = (props: P) => {
    const name =
      componentName ||
      WrappedComponent.displayName ||
      WrappedComponent.name ||
      "Component";

    usePerformanceProfiler(name);
    useMemoryLeakDetector(name);

    return React.createElement(WrappedComponent, props);
  };

  WithProfiler.displayName = `withPerformanceProfiler(${componentName || WrappedComponent.displayName || WrappedComponent.name})`;

  return WithProfiler;
}

// Utilitaires pour l'optimisation du bundle
export const BundleOptimizer = {
  // Lazy loading pour les routes
  createLazyRoute: <T extends React.ComponentType<any>>(
    importFunc: () => Promise<{ default: T }>,
  ) => {
    return React.lazy(importFunc);
  },

  // Code splitting pour les composants lourds
  createLazyComponent: <T extends React.ComponentType<any>>(
    importFunc: () => Promise<{ default: T }>,
    fallback?: React.ReactNode,
  ) => {
    const LazyComponent = React.lazy(importFunc);

    return (props: React.ComponentProps<T>) => (
      <React.Suspense fallback={fallback || <div>Chargement...</div>}>
        <LazyComponent {...props} />
      </React.Suspense>
    );
  },

  // Preload des composants critiques
  preloadComponent: (importFunc: () => Promise<any>) => {
    // Preload après un délai pour ne pas bloquer le rendu initial
    setTimeout(() => {
      importFunc().catch(() => {
        // Ignorer les erreurs de preload
      });
    }, 100);
  },
};

// Analyseur de performance global
export class GlobalPerformanceAnalyzer {
  private static instance: GlobalPerformanceAnalyzer;
  private profilers: Map<string, PerformanceProfiler> = new Map();

  static getInstance(): GlobalPerformanceAnalyzer {
    if (!GlobalPerformanceAnalyzer.instance) {
      GlobalPerformanceAnalyzer.instance = new GlobalPerformanceAnalyzer();
    }
    return GlobalPerformanceAnalyzer.instance;
  }

  registerComponent(name: string, profiler: PerformanceProfiler): void {
    this.profilers.set(name, profiler);
  }

  getGlobalReport(): string {
    let report = "🌍 Global Performance Report\n";
    report += "=====================================\n\n";

    let totalRenderTime = 0;
    let totalReRenders = 0;
    let totalMemory = 0;

    for (const [name, profiler] of this.profilers) {
      const metrics = profiler.getMetrics(name) as PerformanceMetrics;
      if (metrics) {
        totalRenderTime += metrics.renderTime;
        totalReRenders += metrics.reRenderCount;
        totalMemory += metrics.memoryUsage;

        report += `📊 ${name}: ${metrics.renderTime.toFixed(2)}ms, ${metrics.reRenderCount} re-renders\n`;
      }
    }

    report += "\n📈 Summary:\n";
    report += `Total Render Time: ${totalRenderTime.toFixed(2)}ms\n`;
    report += `Total Re-renders: ${totalReRenders}\n`;
    report += `Total Memory: ${totalMemory.toFixed(2)}MB\n`;
    report += `Components: ${this.profilers.size}\n`;

    return report;
  }

  exportMetrics(): object {
    const metrics: Record<string, any> = {};

    for (const [name, profiler] of this.profilers) {
      metrics[name] = profiler.getMetrics(name);
    }

    return {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      components: metrics,
      summary: {
        componentCount: this.profilers.size,
        totalMemory: Object.values(metrics).reduce(
          (sum: number, m: any) => sum + (m?.memoryUsage || 0),
          0,
        ),
      },
    };
  }
}

// Hook pour utiliser l'analyseur global
export function useGlobalPerformanceAnalyzer() {
  const analyzer = React.useMemo(
    () => GlobalPerformanceAnalyzer.getInstance(),
    [],
  );

  return {
    getGlobalReport: () => analyzer.getGlobalReport(),
    exportMetrics: () => analyzer.exportMetrics(),
  };
}

export default {
  PerformanceProfiler,
  DebugCleaner,
  BundleOptimizer,
  GlobalPerformanceAnalyzer,
};
