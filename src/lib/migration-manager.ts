/**
 * Migration Manager - Gestionnaire de migration progressive vers code splitting
 *
 * Ce système analyse votre codebase et suggère automatiquement des migrations
 * vers le code splitting pour optimiser les performances.
 */

import { readFileSync, readdirSync, statSync } from "fs";
import { join } from "path";

// Types pour l'analyse de migration
interface ComponentAnalysis {
  filePath: string;
  fileName: string;
  size: number; // En bytes
  complexity: number; // Score de complexité
  imports: string[];
  exports: string[];
  dependencies: string[];
  migrationPriority: "critical" | "high" | "medium" | "low";
  estimatedSavings: number; // Économie estimée en KB
  migrationStrategy: "lazy-load" | "route-split" | "feature-split" | "defer";
}

interface MigrationPlan {
  phase: number;
  components: ComponentAnalysis[];
  estimatedImpact: string;
  prerequisites: string[];
  risks: string[];
}

// ===== ANALYSEUR DE COMPOSANTS =====
export class ComponentMigrationAnalyzer {
  private srcPath: string;
  private analysisResults: ComponentAnalysis[] = [];

  constructor(srcPath: string = "./src") {
    this.srcPath = srcPath;
  }

  /**
   * Analyser tous les composants du projet
   */
  async analyzeProject(): Promise<ComponentAnalysis[]> {
    this.analysisResults = [];
    await this.scanDirectory(this.srcPath);
    return this.analysisResults.sort((a, b) =>
      b.migrationPriority.localeCompare(a.migrationPriority),
    );
  }

  /**
   * Scanner récursivement un répertoire
   */
  private async scanDirectory(dirPath: string): Promise<void> {
    try {
      const items = readdirSync(dirPath);

      for (const item of items) {
        const fullPath = join(dirPath, item);
        const stat = statSync(fullPath);

        if (stat.isDirectory() && !this.shouldSkipDirectory(item)) {
          await this.scanDirectory(fullPath);
        } else if (this.isComponentFile(item)) {
          const analysis = await this.analyzeComponent(fullPath);
          if (analysis) {
            this.analysisResults.push(analysis);
          }
        }
      }
    } catch (error) {
      console.warn(`Erreur lors du scan de ${dirPath}:`, error);
    }
  }

  /**
   * Analyser un composant spécifique
   */
  private async analyzeComponent(
    filePath: string,
  ): Promise<ComponentAnalysis | null> {
    try {
      const content = readFileSync(filePath, "utf-8");
      const stat = statSync(filePath);

      const imports = this.extractImports(content);
      const exports = this.extractExports(content);
      const dependencies = this.extractDependencies(content);
      const complexity = this.calculateComplexity(content);

      const analysis: ComponentAnalysis = {
        filePath,
        fileName: filePath.split("/").pop() || "",
        size: stat.size,
        complexity,
        imports,
        exports,
        dependencies,
        migrationPriority: this.determinePriority(
          stat.size,
          complexity,
          dependencies,
        ),
        estimatedSavings: this.estimateSavings(stat.size, complexity),
        migrationStrategy: this.suggestStrategy(
          content,
          complexity,
          dependencies,
        ),
      };

      return analysis;
    } catch (error) {
      console.warn(`Erreur lors de l'analyse de ${filePath}:`, error);
      return null;
    }
  }

  /**
   * Extraire les imports d'un fichier
   */
  private extractImports(content: string): string[] {
    const importRegex = /import\s+.*?from\s+['"`]([^'"`]+)['"`]/g;
    const imports: string[] = [];
    let match;

    while ((match = importRegex.exec(content)) !== null) {
      imports.push(match[1]);
    }

    return imports;
  }

  /**
   * Extraire les exports d'un fichier
   */
  private extractExports(content: string): string[] {
    const exportRegex =
      /export\s+(?:default\s+)?(?:function|const|class|interface|type)\s+(\w+)/g;
    const exports: string[] = [];
    let match;

    while ((match = exportRegex.exec(content)) !== null) {
      exports.push(match[1]);
    }

    return exports;
  }

  /**
   * Extraire les dépendances lourdes
   */
  private extractDependencies(content: string): string[] {
    const heavyDeps = [
      "react-hook-form",
      "framer-motion",
      "recharts",
      "canvas",
      "pdf",
      "xlsx",
      "chart.js",
      "three.js",
      "monaco-editor",
    ];

    return heavyDeps.filter(
      (dep) =>
        content.includes(`from '${dep}'`) ||
        content.includes(`from "${dep}"`) ||
        content.includes(`import('${dep}')`) ||
        content.includes(`import("${dep}")`),
    );
  }

  /**
   * Calculer la complexité d'un composant
   */
  private calculateComplexity(content: string): number {
    let complexity = 0;

    // Facteurs de complexité
    complexity +=
      (content.match(/useState|useEffect|useCallback|useMemo/g) || []).length *
      2;
    complexity += (content.match(/function|const.*=>/g) || []).length;
    complexity += (content.match(/if|switch|for|while/g) || []).length;
    complexity += (content.match(/import.*from/g) || []).length * 0.5;
    complexity += Math.floor(content.length / 1000); // Taille du fichier

    return Math.round(complexity);
  }

  /**
   * Déterminer la priorité de migration
   */
  private determinePriority(
    size: number,
    complexity: number,
    dependencies: string[],
  ): ComponentAnalysis["migrationPriority"] {
    const score = size / 1000 + complexity + dependencies.length * 5;

    if (score > 50) return "critical";
    if (score > 30) return "high";
    if (score > 15) return "medium";
    return "low";
  }

  /**
   * Estimer les économies potentielles
   */
  private estimateSavings(size: number, complexity: number): number {
    // Estimation basée sur la taille et la complexité
    const baseSavings = size / 1024; // Convertir en KB
    const complexityMultiplier = 1 + complexity / 20;

    return Math.round(baseSavings * complexityMultiplier);
  }

  /**
   * Suggérer une stratégie de migration
   */
  private suggestStrategy(
    content: string,
    complexity: number,
    dependencies: string[],
  ): ComponentAnalysis["migrationStrategy"] {
    // Route-level splitting pour les pages
    if (content.includes("export default") && content.includes("Page")) {
      return "route-split";
    }

    // Feature splitting pour les modules complexes
    if (complexity > 20 || dependencies.length > 3) {
      return "feature-split";
    }

    // Lazy loading pour les composants lourds
    if (
      content.includes("Modal") ||
      content.includes("Dialog") ||
      dependencies.some((dep) => dep.includes("pdf"))
    ) {
      return "lazy-load";
    }

    // Defer pour les composants moins critiques
    return "defer";
  }

  /**
   * Vérifier si c'est un fichier composant
   */
  private isComponentFile(fileName: string): boolean {
    return (
      /\.(tsx|jsx)$/.test(fileName) &&
      !fileName.includes(".test.") &&
      !fileName.includes(".spec.")
    );
  }

  /**
   * Vérifier si on doit ignorer un répertoire
   */
  private shouldSkipDirectory(dirName: string): boolean {
    const skipDirs = [
      "node_modules",
      ".git",
      ".next",
      "dist",
      "build",
      "coverage",
    ];
    return skipDirs.includes(dirName) || dirName.startsWith(".");
  }
}

// ===== GÉNÉRATEUR DE PLAN DE MIGRATION =====
export class MigrationPlanGenerator {
  /**
   * Générer un plan de migration en phases
   */
  generateMigrationPlan(analyses: ComponentAnalysis[]): MigrationPlan[] {
    const phases: MigrationPlan[] = [];

    // Phase 1: Composants critiques (impact immédiat)
    const criticalComponents = analyses.filter(
      (a) => a.migrationPriority === "critical",
    );
    if (criticalComponents.length > 0) {
      phases.push({
        phase: 1,
        components: criticalComponents.slice(0, 5), // Limiter à 5 par phase
        estimatedImpact: `Réduction estimée: ${this.calculateTotalSavings(criticalComponents.slice(0, 5))}KB`,
        prerequisites: [
          "Setup lazy loading infrastructure",
          "Configure code splitting",
        ],
        risks: [
          "Possible flickering during load",
          "SEO impact on critical content",
        ],
      });
    }

    // Phase 2: Composants haute priorité
    const highPriorityComponents = analyses.filter(
      (a) => a.migrationPriority === "high",
    );
    if (highPriorityComponents.length > 0) {
      phases.push({
        phase: 2,
        components: highPriorityComponents.slice(0, 8),
        estimatedImpact: `Réduction estimée: ${this.calculateTotalSavings(highPriorityComponents.slice(0, 8))}KB`,
        prerequisites: ["Phase 1 completed", "Performance monitoring in place"],
        risks: ["Minor UX impact", "Dependency management complexity"],
      });
    }

    // Phase 3: Composants moyens et bas
    const remainingComponents = analyses.filter((a) =>
      ["medium", "low"].includes(a.migrationPriority),
    );
    if (remainingComponents.length > 0) {
      phases.push({
        phase: 3,
        components: remainingComponents.slice(0, 10),
        estimatedImpact: `Réduction estimée: ${this.calculateTotalSavings(remainingComponents.slice(0, 10))}KB`,
        prerequisites: ["Phases 1-2 completed", "User feedback analyzed"],
        risks: ["Minimal risk", "Maintenance overhead"],
      });
    }

    return phases;
  }

  /**
   * Calculer les économies totales
   */
  private calculateTotalSavings(components: ComponentAnalysis[]): number {
    return components.reduce((total, comp) => total + comp.estimatedSavings, 0);
  }
}

// ===== GÉNÉRATEUR DE CODE =====
export class CodeSplittingCodeGenerator {
  /**
   * Générer le code pour un composant lazy
   */
  generateLazyComponent(analysis: ComponentAnalysis): string {
    const componentName = analysis.fileName.replace(/\.(tsx|jsx)$/, "");
    const lazyComponentName = `Lazy${componentName}`;

    switch (analysis.migrationStrategy) {
      case "lazy-load":
        return this.generateLazyLoadCode(
          componentName,
          lazyComponentName,
          analysis.filePath,
        );

      case "route-split":
        return this.generateRouteSplitCode(componentName, analysis.filePath);

      case "feature-split":
        return this.generateFeatureSplitCode(
          componentName,
          lazyComponentName,
          analysis.filePath,
        );

      default:
        return this.generateDeferCode(
          componentName,
          lazyComponentName,
          analysis.filePath,
        );
    }
  }

  private generateLazyLoadCode(
    componentName: string,
    lazyComponentName: string,
    filePath: string,
  ): string {
    return `import React, { Suspense } from 'react';
import { useLazyComponent } from '@/lib/code-splitting-manager';

// Lazy loaded component
const ${lazyComponentName} = useLazyComponent(
  '${componentName.toLowerCase()}',
  () => import('${filePath.replace("./src/", "@/")}'),
  { strategy: 'on-demand' }
);

// Usage with Suspense
export function ${componentName}WithLazyLoading(props: any) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <${lazyComponentName} {...props} />
    </Suspense>
  );
}`;
  }

  private generateRouteSplitCode(
    componentName: string,
    filePath: string,
  ): string {
    return `import { lazy } from 'react';

// Route-level code splitting
export const ${componentName} = lazy(() => import('${filePath.replace("./src/", "@/")}'));

// Usage in route configuration
/*
import { Suspense } from 'react';
import { ${componentName} } from './lazy-components';

<Route path="/your-path" element={
  <Suspense fallback={<PageLoader />}>
    <${componentName} />
  </Suspense>
} />
*/`;
  }

  private generateFeatureSplitCode(
    componentName: string,
    lazyComponentName: string,
    filePath: string,
  ): string {
    return `import React, { Suspense } from 'react';
import { useLazyComponent } from '@/lib/code-splitting-manager';

// Feature-level code splitting
const ${lazyComponentName} = useLazyComponent(
  'feature-${componentName.toLowerCase()}',
  () => import('${filePath.replace("./src/", "@/")}'),
  { strategy: 'on-visible' }
);

// Enhanced wrapper with preloading
export function ${componentName}Feature(props: any) {
  return (
    <div data-chunk-id="feature-${componentName.toLowerCase()}">
      <Suspense fallback={
        <div className="min-h-[200px] flex items-center justify-center">
          <div className="text-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-sm text-muted-foreground">Chargement du module...</p>
          </div>
        </div>
      }>
        <${lazyComponentName} {...props} />
      </Suspense>
    </div>
  );
}`;
  }

  private generateDeferCode(
    componentName: string,
    lazyComponentName: string,
    filePath: string,
  ): string {
    return `import React, { Suspense } from 'react';
import { useConditionalPreload } from '@/lib/code-splitting-manager';

// Deferred loading component
const ${lazyComponentName} = React.lazy(() => import('${filePath.replace("./src/", "@/")}'));

export function ${componentName}Deferred(props: any & { condition?: boolean }) {
  const { condition = true, ...restProps } = props;
  
  // Conditional preloading
  useConditionalPreload('${componentName.toLowerCase()}', condition, 2000);

  if (!condition) {
    return null;
  }

  return (
    <Suspense fallback={<div className="h-8 bg-gray-100 animate-pulse rounded"></div>}>
      <${lazyComponentName} {...restProps} />
    </Suspense>
  );
}`;
  }
}

// ===== UTILITAIRES D'ANALYSE =====
export async function analyzeProjectForMigration(srcPath?: string): Promise<{
  analysis: ComponentAnalysis[];
  migrationPlan: MigrationPlan[];
  totalSavings: number;
  recommendations: string[];
}> {
  const analyzer = new ComponentMigrationAnalyzer(srcPath);
  const planGenerator = new MigrationPlanGenerator();

  const analysis = await analyzer.analyzeProject();
  const migrationPlan = planGenerator.generateMigrationPlan(analysis);

  const totalSavings = analysis.reduce(
    (total, comp) => total + comp.estimatedSavings,
    0,
  );

  const recommendations = [
    `🎯 ${analysis.length} composants analysés`,
    `💾 Économies potentielles: ${totalSavings}KB`,
    `🚀 ${analysis.filter((a) => a.migrationPriority === "critical").length} composants critiques à migrer`,
    `📈 Migration suggérée en ${migrationPlan.length} phases`,
    analysis.length > 50
      ? "⚠️ Projet complexe - Migration par petites étapes recommandée"
      : "✅ Taille de projet gérable",
  ];

  return {
    analysis,
    migrationPlan,
    totalSavings,
    recommendations,
  };
}

// Export des instances
export const migrationAnalyzer = new ComponentMigrationAnalyzer();
export const codeGenerator = new CodeSplittingCodeGenerator();
