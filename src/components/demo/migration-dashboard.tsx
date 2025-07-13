/**
 * Migration Dashboard - Interface de gestion des migrations code splitting
 *
 * Ce composant permet de :
 * - Analyser automatiquement le projet
 * - Visualiser les opportunités de migration
 * - Générer le code de migration
 * - Suivre les progrès
 */

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

// Simulation des types d'analyse
interface ComponentAnalysis {
  filePath: string;
  fileName: string;
  size: number;
  complexity: number;
  imports: string[];
  exports: string[];
  dependencies: string[];
  migrationPriority: "critical" | "high" | "medium" | "low";
  estimatedSavings: number;
  migrationStrategy: "lazy-load" | "route-split" | "feature-split" | "defer";
}

interface MigrationPlan {
  phase: number;
  components: ComponentAnalysis[];
  estimatedImpact: string;
  prerequisites: string[];
  risks: string[];
}

// ===== SIMULATION DE DONNÉES =====
function generateMockAnalysis(): ComponentAnalysis[] {
  const mockComponents = [
    {
      fileName: "staff-table-advanced.tsx",
      filePath: "/src/components/dashboard/staff/staff-table-advanced.tsx",
      size: 45000,
      complexity: 32,
      dependencies: ["react-hook-form", "framer-motion"],
      migrationStrategy: "lazy-load" as const,
      estimatedSavings: 67,
    },
    {
      fileName: "generic-pdf.tsx",
      filePath: "/src/components/ui/generic-pdf.tsx",
      size: 78000,
      complexity: 48,
      dependencies: ["pdf-lib", "canvas"],
      migrationStrategy: "feature-split" as const,
      estimatedSavings: 125,
    },
    {
      fileName: "advanced-form.tsx",
      filePath: "/src/components/ui/advanced-form.tsx",
      size: 38000,
      complexity: 28,
      dependencies: ["react-hook-form"],
      migrationStrategy: "lazy-load" as const,
      estimatedSavings: 52,
    },
    {
      fileName: "analytics-dashboard.tsx",
      filePath: "/src/app/analytics/page.tsx",
      size: 62000,
      complexity: 41,
      dependencies: ["recharts", "date-fns"],
      migrationStrategy: "route-split" as const,
      estimatedSavings: 89,
    },
    {
      fileName: "type-optimizer.tsx",
      filePath: "/src/components/ui/type-optimizer.tsx",
      size: 23000,
      complexity: 18,
      dependencies: [],
      migrationStrategy: "defer" as const,
      estimatedSavings: 28,
    },
  ].map((comp) => ({
    ...comp,
    imports: [`@/lib/utils`, ...comp.dependencies],
    exports: [comp.fileName.replace(".tsx", "")],
    migrationPriority:
      comp.estimatedSavings > 80
        ? ("critical" as const)
        : comp.estimatedSavings > 50
          ? ("high" as const)
          : comp.estimatedSavings > 30
            ? ("medium" as const)
            : ("low" as const),
  }));

  return mockComponents;
}

function generateMockPlan(analysis: ComponentAnalysis[]): MigrationPlan[] {
  const criticalComponents = analysis.filter(
    (a) => a.migrationPriority === "critical",
  );
  const highComponents = analysis.filter((a) => a.migrationPriority === "high");
  const otherComponents = analysis.filter((a) =>
    ["medium", "low"].includes(a.migrationPriority),
  );

  return [
    {
      phase: 1,
      components: criticalComponents,
      estimatedImpact: `Réduction: ${criticalComponents.reduce((sum, c) => sum + c.estimatedSavings, 0)}KB`,
      prerequisites: ["Configuration du lazy loading", "Tests des fallbacks"],
      risks: ["Impact UX possible", "Complexité initiale"],
    },
    {
      phase: 2,
      components: highComponents,
      estimatedImpact: `Réduction: ${highComponents.reduce((sum, c) => sum + c.estimatedSavings, 0)}KB`,
      prerequisites: ["Phase 1 terminée", "Monitoring en place"],
      risks: ["Gestion des dépendances", "Tests supplémentaires"],
    },
    {
      phase: 3,
      components: otherComponents,
      estimatedImpact: `Réduction: ${otherComponents.reduce((sum, c) => sum + c.estimatedSavings, 0)}KB`,
      prerequisites: ["Phases 1-2 validées", "Retours utilisateurs"],
      risks: ["Risque minimal", "Maintenance continue"],
    },
  ];
}

// ===== COMPOSANT PRINCIPAL =====
export default function MigrationDashboard() {
  const [analysis, setAnalysis] = useState<ComponentAnalysis[]>([]);
  const [migrationPlan, setMigrationPlan] = useState<MigrationPlan[]>([]);
  const [selectedComponent, setSelectedComponent] =
    useState<ComponentAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showCodeDialog, setShowCodeDialog] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");

  // Simulation de l'analyse du projet
  const runAnalysis = async () => {
    setIsAnalyzing(true);

    // Simulation d'un délai d'analyse
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const mockAnalysis = generateMockAnalysis();
    const mockPlan = generateMockPlan(mockAnalysis);

    setAnalysis(mockAnalysis);
    setMigrationPlan(mockPlan);
    setIsAnalyzing(false);
  };

  // Générer le code pour un composant
  const generateCode = (component: ComponentAnalysis) => {
    const componentName = component.fileName.replace(".tsx", "");

    let code = "";
    switch (component.migrationStrategy) {
      case "lazy-load":
        code = `import React, { Suspense } from 'react';
import { useLazyComponent } from '@/lib/code-splitting-manager';

const Lazy${componentName} = useLazyComponent(
  '${componentName.toLowerCase()}',
  () => import('${component.filePath.replace("/src/", "@/")}'),
  { strategy: 'on-demand' }
);

export function ${componentName}WithLazyLoading(props: any) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2 text-sm">Chargement...</span>
      </div>
    }>
      <Lazy${componentName} {...props} />
    </Suspense>
  );
}`;
        break;

      case "route-split":
        code = `import { lazy } from 'react';

// Route-level code splitting
export const ${componentName} = lazy(() => import('${component.filePath.replace("/src/", "@/")}'));

// Usage in app router:
// import { Suspense } from 'react';
// import { ${componentName} } from './lazy-components';
//
// export default function Page() {
//   return (
//     <Suspense fallback={<PageLoader />}>
//       <${componentName} />
//     </Suspense>
//   );
// }`;
        break;

      case "feature-split":
        code = `import React, { Suspense } from 'react';
import { useLazyComponent } from '@/lib/code-splitting-manager';

const Lazy${componentName} = useLazyComponent(
  'feature-${componentName.toLowerCase()}',
  () => import('${component.filePath.replace("/src/", "@/")}'),
  { strategy: 'on-visible' }
);

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
        <Lazy${componentName} {...props} />
      </Suspense>
    </div>
  );
}`;
        break;

      default:
        code = `import React, { Suspense } from 'react';

const Lazy${componentName} = React.lazy(() => import('${component.filePath.replace("/src/", "@/")}'));

export function ${componentName}Deferred(props: any) {
  return (
    <Suspense fallback={<div className="h-8 bg-gray-100 animate-pulse rounded"></div>}>
      <Lazy${componentName} {...props} />
    </Suspense>
  );
}`;
    }

    setGeneratedCode(code);
    setSelectedComponent(component);
    setShowCodeDialog(true);
  };

  const totalSavings = analysis.reduce(
    (total, comp) => total + comp.estimatedSavings,
    0,
  );
  const criticalCount = analysis.filter(
    (a) => a.migrationPriority === "critical",
  ).length;

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div className="space-y-4 text-center">
        <h1 className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-4xl font-bold tracking-tight text-transparent">
          🛠️ Migration Dashboard
        </h1>
        <p className="text-muted-foreground mx-auto max-w-3xl text-lg">
          Analysez automatiquement votre projet et migrez vers le code splitting
          pour des performances optimales.
        </p>
      </div>

      {/* ===== CONTRÔLES D'ANALYSE ===== */}
      <Card>
        <CardHeader>
          <CardTitle>🔍 Analyse du Projet</CardTitle>
          <CardDescription>
            Lancez une analyse complète de votre codebase pour identifier les
            opportunités d'optimisation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button
              onClick={runAnalysis}
              disabled={isAnalyzing}
              className="flex-1"
            >
              {isAnalyzing ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                  Analyse en cours...
                </>
              ) : (
                "🚀 Analyser le Projet"
              )}
            </Button>

            {analysis.length > 0 && (
              <Button variant="outline" onClick={() => setAnalysis([])}>
                🔄 Réinitialiser
              </Button>
            )}
          </div>

          {isAnalyzing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Scan des composants en cours...</span>
                <span>Analyse des dépendances...</span>
              </div>
              <Progress value={66} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {analysis.length > 0 && (
        <>
          {/* ===== RÉSUMÉ DES RÉSULTATS ===== */}
          <Card>
            <CardHeader>
              <CardTitle>📊 Résumé de l'Analyse</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="rounded-lg bg-blue-50 p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {analysis.length}
                  </div>
                  <div className="text-muted-foreground text-sm">
                    Composants Analysés
                  </div>
                </div>
                <div className="rounded-lg bg-red-50 p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {criticalCount}
                  </div>
                  <div className="text-muted-foreground text-sm">
                    Priorité Critique
                  </div>
                </div>
                <div className="rounded-lg bg-green-50 p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {totalSavings}KB
                  </div>
                  <div className="text-muted-foreground text-sm">
                    Économies Estimées
                  </div>
                </div>
                <div className="rounded-lg bg-purple-50 p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {migrationPlan.length}
                  </div>
                  <div className="text-muted-foreground text-sm">
                    Phases de Migration
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ===== DÉTAILS ET GESTION ===== */}
          <Tabs defaultValue="components" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="components">📋 Composants</TabsTrigger>
              <TabsTrigger value="migration-plan">
                🗺️ Plan de Migration
              </TabsTrigger>
              <TabsTrigger value="recommendations">
                💡 Recommandations
              </TabsTrigger>
            </TabsList>

            <TabsContent value="components" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Composants Candidats à la Migration</CardTitle>
                  <CardDescription>
                    Liste des composants identifiés avec leur priorité et
                    stratégie recommandée
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Composant</TableHead>
                        <TableHead>Taille</TableHead>
                        <TableHead>Complexité</TableHead>
                        <TableHead>Priorité</TableHead>
                        <TableHead>Stratégie</TableHead>
                        <TableHead>Économies</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {analysis.map((component, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {component.fileName}
                          </TableCell>
                          <TableCell>
                            {Math.round(component.size / 1024)}KB
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                component.complexity > 30
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {component.complexity}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                component.migrationPriority === "critical"
                                  ? "destructive"
                                  : component.migrationPriority === "high"
                                    ? "default"
                                    : component.migrationPriority === "medium"
                                      ? "secondary"
                                      : "outline"
                              }
                            >
                              {component.migrationPriority}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {component.migrationStrategy}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium text-green-600">
                            {component.estimatedSavings}KB
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => generateCode(component)}
                            >
                              📄 Générer Code
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="migration-plan" className="mt-6">
              <div className="space-y-6">
                {migrationPlan.map((phase, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600">
                          {phase.phase}
                        </div>
                        Phase {phase.phase} - Migration
                      </CardTitle>
                      <CardDescription>
                        {phase.estimatedImpact} • {phase.components.length}{" "}
                        composants
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-3">
                        <div>
                          <h4 className="mb-2 font-medium">📋 Composants</h4>
                          <ul className="space-y-1 text-sm">
                            {phase.components.map((comp, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {comp.migrationStrategy}
                                </Badge>
                                {comp.fileName}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="mb-2 font-medium">✅ Prérequis</h4>
                          <ul className="space-y-1 text-sm">
                            {phase.prerequisites.map((req, idx) => (
                              <li key={idx} className="text-muted-foreground">
                                • {req}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="mb-2 font-medium">⚠️ Risques</h4>
                          <ul className="space-y-1 text-sm">
                            {phase.risks.map((risk, idx) => (
                              <li key={idx} className="text-orange-600">
                                • {risk}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="recommendations" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    💡 Recommandations & Meilleures Pratiques
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold">
                        🎯 Actions Prioritaires
                      </h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <span className="text-green-600">✓</span>
                          <span>
                            Commencer par les composants critiques (&gt;50KB)
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600">✓</span>
                          <span>Implémenter les fallbacks attrayants</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600">✓</span>
                          <span>Tester la performance avant/après</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600">✓</span>
                          <span>Surveiller les Core Web Vitals</span>
                        </li>
                      </ul>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold">
                        ⚡ Optimisations Avancées
                      </h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600">→</span>
                          <span>
                            Preload stratégique des composants critiques
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600">→</span>
                          <span>Code splitting au niveau des routes</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600">→</span>
                          <span>
                            Bundle analysis avec webpack-bundle-analyzer
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600">→</span>
                          <span>
                            Lazy loading basé sur l'interaction utilisateur
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h4 className="mb-4 text-lg font-semibold">
                      📈 Métriques à Surveiller
                    </h4>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                      <div className="rounded-lg border p-4 text-center">
                        <div className="font-bold text-blue-600">
                          First Load
                        </div>
                        <div className="text-muted-foreground text-sm">
                          Temps de chargement initial
                        </div>
                      </div>
                      <div className="rounded-lg border p-4 text-center">
                        <div className="font-bold text-green-600">
                          Bundle Size
                        </div>
                        <div className="text-muted-foreground text-sm">
                          Taille des chunks
                        </div>
                      </div>
                      <div className="rounded-lg border p-4 text-center">
                        <div className="font-bold text-purple-600">LCP</div>
                        <div className="text-muted-foreground text-sm">
                          Largest Contentful Paint
                        </div>
                      </div>
                      <div className="rounded-lg border p-4 text-center">
                        <div className="font-bold text-orange-600">CLS</div>
                        <div className="text-muted-foreground text-sm">
                          Cumulative Layout Shift
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}

      {/* ===== DIALOG DE GÉNÉRATION DE CODE ===== */}
      <Dialog open={showCodeDialog} onOpenChange={setShowCodeDialog}>
        <DialogContent className="max-h-[80vh] max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              📄 Code généré pour {selectedComponent?.fileName}
            </DialogTitle>
            <DialogDescription>
              Stratégie: {selectedComponent?.migrationStrategy} • Économies
              estimées: {selectedComponent?.estimatedSavings}KB
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="h-[500px] w-full">
            <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
              <code>{generatedCode}</code>
            </pre>
          </ScrollArea>

          <div className="flex gap-2 pt-4">
            <Button
              onClick={() => navigator.clipboard.writeText(generatedCode)}
            >
              📋 Copier le Code
            </Button>
            <Button variant="outline" onClick={() => setShowCodeDialog(false)}>
              Fermer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
