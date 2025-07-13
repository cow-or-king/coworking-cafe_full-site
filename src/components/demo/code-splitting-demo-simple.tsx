/**
 * Code Splitting Demo Simplifié - Version fonctionnelle
 *
 * Démonstration du système de code splitting sans dépendances complexes
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
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { Suspense, useEffect, useState } from "react";

// ===== COMPOSANTS DÉMO SIMPLES =====

// Composant Table Demo avec delay simulé
const DemoTable = React.lazy(
  () =>
    new Promise<{ default: React.ComponentType<{ data: any[] }> }>(
      (resolve) => {
        setTimeout(() => {
          resolve({
            default: ({ data }: { data: any[] }) => (
              <div className="rounded-lg border bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
                <div className="mb-4 flex items-center gap-2">
                  <div className="h-3 w-3 animate-pulse rounded-full bg-green-500"></div>
                  <h3 className="font-bold">📊 Table Avancée (Code Split)</h3>
                </div>
                <div className="overflow-hidden">
                  {data.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between border-b py-2 last:border-b-0"
                    >
                      <span className="font-medium">{item.name}</span>
                      <span
                        className={`rounded px-2 py-1 text-xs font-medium ${
                          item.status === "active"
                            ? "bg-green-100 text-green-800"
                            : item.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-xs text-gray-500">
                  ⚡ Chargé dynamiquement avec React.lazy()
                </div>
              </div>
            ),
          });
        }, 800); // Simule un chargement
      },
    ),
);

// Composant Chart Demo avec delay simulé
const DemoChart = React.lazy(
  () =>
    new Promise<{ default: React.ComponentType<{ data: any[] }> }>(
      (resolve) => {
        setTimeout(() => {
          resolve({
            default: ({ data }: { data: any[] }) => (
              <div className="rounded-lg border bg-gradient-to-r from-green-50 to-emerald-50 p-4">
                <div className="mb-4 flex items-center gap-2">
                  <div className="h-3 w-3 animate-pulse rounded-full bg-green-500"></div>
                  <h3 className="font-bold">📈 Graphique (Code Split)</h3>
                </div>
                <div className="space-y-3">
                  {data.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <span className="w-12 text-sm font-medium">
                        {item.name}
                      </span>
                      <div className="relative h-6 flex-1 overflow-hidden rounded-full bg-gray-200">
                        <div
                          className="flex h-6 items-center justify-end rounded-full bg-gradient-to-r from-blue-500 to-purple-500 pr-2 transition-all duration-1000"
                          style={{ width: `${(item.value / 1000) * 100}%` }}
                        >
                          <span className="text-xs font-bold text-white">
                            {item.value}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-xs text-gray-500">
                  📊 Visualisation interactive chargée à la demande
                </div>
              </div>
            ),
          });
        }, 600);
      },
    ),
);

// Composant Form Demo avec delay simulé
const DemoForm = React.lazy(
  () =>
    new Promise<{ default: React.ComponentType }>((resolve) => {
      setTimeout(() => {
        resolve({
          default: () => (
            <div className="rounded-lg border bg-gradient-to-r from-purple-50 to-pink-50 p-4">
              <div className="mb-4 flex items-center gap-2">
                <div className="h-3 w-3 animate-pulse rounded-full bg-green-500"></div>
                <h3 className="font-bold">📝 Formulaire Avancé (Code Split)</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Nom complet
                  </label>
                  <input
                    className="w-full rounded-lg border p-3 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                    placeholder="Votre nom complet"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Adresse email
                  </label>
                  <input
                    type="email"
                    className="w-full rounded-lg border p-3 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Message
                  </label>
                  <textarea
                    className="h-24 w-full rounded-lg border p-3 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                    placeholder="Votre message détaillé"
                  />
                </div>
                <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  📤 Envoyer le message
                </Button>
              </div>
              <div className="mt-4 text-xs text-gray-500">
                🔄 Formulaire avec validation en temps réel
              </div>
            </div>
          ),
        });
      }, 400);
    }),
);

// Composant PDF Demo avec delay simulé
const DemoPDF = React.lazy(
  () =>
    new Promise<{ default: React.ComponentType }>((resolve) => {
      setTimeout(() => {
        resolve({
          default: () => (
            <div className="rounded-lg border bg-gradient-to-r from-orange-50 to-red-50 p-4">
              <div className="mb-4 flex items-center gap-2">
                <div className="h-3 w-3 animate-pulse rounded-full bg-green-500"></div>
                <h3 className="font-bold">📄 Générateur PDF (Code Split)</h3>
              </div>
              <div className="rounded border-2 border-dashed border-gray-300 bg-white p-6">
                <div className="mb-6 text-center">
                  <h4 className="text-xl font-bold text-gray-800">
                    📊 Rapport d'Analyse
                  </h4>
                  <p className="mt-1 text-sm text-gray-600">
                    Généré automatiquement le{" "}
                    {new Date().toLocaleDateString("fr-FR")}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <p>
                      <strong>📈 Données analysées:</strong> 2,847 entrées
                    </p>
                    <p>
                      <strong>⏱️ Temps de traitement:</strong> 1.3 secondes
                    </p>
                    <p>
                      <strong>🎯 Précision:</strong> 97.2%
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p>
                      <strong>📊 Graphiques:</strong> 12 générés
                    </p>
                    <p>
                      <strong>📋 Tables:</strong> 8 créées
                    </p>
                    <p>
                      <strong>✅ Statut:</strong>{" "}
                      <span className="text-green-600">Réussi</span>
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <Button size="sm" variant="outline" className="flex-1">
                    👁️ Aperçu en ligne
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                  >
                    ⬇️ Télécharger PDF
                  </Button>
                </div>
              </div>
              <div className="mt-4 text-xs text-gray-500">
                🚀 Génération PDF optimisée avec templates avancés
              </div>
            </div>
          ),
        });
      }, 1200); // Plus long pour simuler un composant lourd
    }),
);

// Composant de fallback avec animation
const LoadingFallback = ({ name }: { name: string }) => (
  <div className="flex items-center justify-center rounded-lg border bg-gray-50 p-12">
    <div className="space-y-3 text-center">
      <div className="border-primary mx-auto h-8 w-8 animate-spin rounded-full border-b-2"></div>
      <div className="space-y-1">
        <p className="text-sm font-medium">Chargement du module {name}...</p>
        <p className="text-muted-foreground text-xs">
          Code splitting en action 🚀
        </p>
      </div>
    </div>
  </div>
);

// ===== SIMULATION DES ANALYTICS =====
function useSimulatedAnalytics() {
  const [loadedComponents, setLoadedComponents] = useState<string[]>([]);
  const [analytics, setAnalytics] = useState({
    totalChunks: 4,
    loadedChunks: 0,
    unusedChunks: ["demo-table", "demo-chart", "demo-form", "demo-pdf"],
    heavyChunks: [] as string[],
    recommendations: [
      "🎯 Aucun chunk utilisé - Activez les démos pour voir l'impact!",
    ] as string[],
  });

  const markAsLoaded = (componentName: string) => {
    if (!loadedComponents.includes(componentName)) {
      const newLoaded = [...loadedComponents, componentName];
      setLoadedComponents(newLoaded);

      setAnalytics((prev) => ({
        totalChunks: 4,
        loadedChunks: newLoaded.length,
        unusedChunks: [
          "demo-table",
          "demo-chart",
          "demo-form",
          "demo-pdf",
        ].filter((chunk) => !newLoaded.includes(chunk)),
        heavyChunks: newLoaded.includes("demo-pdf") ? ["demo-pdf"] : [],
        recommendations:
          newLoaded.length === 0
            ? ["🎯 Aucun chunk utilisé - Activez les démos pour voir l'impact!"]
            : [
                `✅ ${newLoaded.length}/4 chunks chargés avec succès`,
                ...(newLoaded.length < 4
                  ? [`⚡ ${4 - newLoaded.length} chunks encore disponibles`]
                  : []),
                ...(newLoaded.includes("demo-pdf")
                  ? ["🐌 Composant PDF détecté comme lourd"]
                  : []),
              ],
      }));
    }
  };

  return { analytics, markAsLoaded };
}

// ===== COMPOSANT PRINCIPAL =====
export default function CodeSplittingDemo() {
  const [activeDemo, setActiveDemo] = useState<string>("");
  const [preloadEnabled, setPreloadEnabled] = useState(false);
  const { analytics, markAsLoaded } = useSimulatedAnalytics();

  // Marquer comme chargé quand les composants sont affichés
  useEffect(() => {
    if (activeDemo === "table") markAsLoaded("demo-table");
    if (activeDemo === "chart") markAsLoaded("demo-chart");
    if (activeDemo === "form") markAsLoaded("demo-form");
    if (activeDemo === "pdf") markAsLoaded("demo-pdf");
  }, [activeDemo, markAsLoaded]);

  // Simulation de preload
  const handlePreload = (componentName: string) => {
    console.log(`🚀 Preload simulé pour: ${componentName}`);
    setTimeout(() => markAsLoaded(componentName), 300);
  };

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div className="space-y-4 text-center">
        <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-bold tracking-tight text-transparent">
          🚀 Code Splitting Demo
        </h1>
        <p className="text-muted-foreground mx-auto max-w-3xl text-lg">
          Démonstration interactive du lazy loading et du code splitting avec
          React.lazy(). Observez le chargement dynamique des composants et leur
          impact sur les performances.
        </p>
      </div>

      {/* ===== ANALYTICS EN TEMPS RÉEL ===== */}
      <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📊 Analytics du Bundle en Temps Réel
            <Badge variant="outline" className="animate-pulse">
              Live
            </Badge>
          </CardTitle>
          <CardDescription>
            Métriques en temps réel du chargement des chunks et de leur
            utilisation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-lg border bg-white p-4 text-center">
              <div className="mb-1 text-3xl font-bold text-blue-600">
                {analytics.totalChunks}
              </div>
              <div className="text-muted-foreground text-sm">Total Chunks</div>
            </div>
            <div className="rounded-lg border bg-white p-4 text-center">
              <div className="mb-1 text-3xl font-bold text-green-600">
                {analytics.loadedChunks}
              </div>
              <div className="text-muted-foreground text-sm">Chargés</div>
            </div>
            <div className="rounded-lg border bg-white p-4 text-center">
              <div className="mb-1 text-3xl font-bold text-orange-600">
                {analytics.unusedChunks.length}
              </div>
              <div className="text-muted-foreground text-sm">En Attente</div>
            </div>
            <div className="rounded-lg border bg-white p-4 text-center">
              <div className="mb-1 text-3xl font-bold text-red-600">
                {analytics.heavyChunks.length}
              </div>
              <div className="text-muted-foreground text-sm">
                Lents (&gt;1s)
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span>Progression du chargement</span>
              <span>
                {Math.round(
                  (analytics.loadedChunks / analytics.totalChunks) * 100,
                )}
                %
              </span>
            </div>
            <Progress
              value={(analytics.loadedChunks / analytics.totalChunks) * 100}
              className="h-3"
            />
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">🎯 Status & Recommandations:</h4>
            <div className="flex flex-wrap gap-2">
              {analytics.recommendations.map((rec, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {rec}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ===== CONTRÔLES DE PRELOAD ===== */}
      <Card>
        <CardHeader>
          <CardTitle>⚡ Contrôles de Performance</CardTitle>
          <CardDescription>
            Testez différentes stratégies de preload et observez leur impact sur
            les métriques
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={preloadEnabled ? "default" : "outline"}
              onClick={() => setPreloadEnabled(!preloadEnabled)}
            >
              {preloadEnabled ? "✅ Preload ON" : "⏸️ Preload OFF"}
            </Button>

            <Button
              variant="outline"
              onClick={() => handlePreload("demo-table")}
            >
              📊 Preload Table
            </Button>

            <Button
              variant="outline"
              onClick={() => handlePreload("demo-chart")}
            >
              📈 Preload Chart
            </Button>

            <Button variant="outline" onClick={() => handlePreload("demo-pdf")}>
              📄 Preload PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ===== DÉMONSTRATIONS INTERACTIVES ===== */}
      <Tabs value={activeDemo} onValueChange={setActiveDemo} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="table">📊 Table</TabsTrigger>
          <TabsTrigger value="chart">📈 Chart</TabsTrigger>
          <TabsTrigger value="form">📝 Form</TabsTrigger>
          <TabsTrigger value="pdf">📄 PDF</TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>📊 Table Avancée - Lazy Loading</CardTitle>
              <CardDescription>
                Chargement à la demande d'un composant de table complexe
                <Badge variant="secondary" className="ml-2">
                  On-Demand
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activeDemo === "table" && (
                <Suspense fallback={<LoadingFallback name="Table" />}>
                  <DemoTable
                    data={[
                      { id: 1, name: "Utilisateur Premium", status: "active" },
                      { id: 2, name: "Client Standard", status: "pending" },
                      { id: 3, name: "Visiteur Anonyme", status: "completed" },
                      { id: 4, name: "Admin Système", status: "active" },
                    ]}
                  />
                </Suspense>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chart" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>📈 Graphiques - Lazy Loading Visible</CardTitle>
              <CardDescription>
                Visualisations chargées dynamiquement avec animations
                <Badge variant="secondary" className="ml-2">
                  On-Visible
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activeDemo === "chart" && (
                <Suspense fallback={<LoadingFallback name="Chart" />}>
                  <DemoChart
                    data={[
                      { name: "Jan", value: 420 },
                      { name: "Fév", value: 380 },
                      { name: "Mar", value: 680 },
                      { name: "Avr", value: 920 },
                      { name: "Mai", value: 750 },
                      { name: "Jun", value: 890 },
                    ]}
                  />
                </Suspense>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="form" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>📝 Formulaire Avancé - Preload au Hover</CardTitle>
              <CardDescription>
                Formulaire avec validation préchargé intelligemment
                <Badge variant="secondary" className="ml-2">
                  On-Hover
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activeDemo === "form" && (
                <Suspense fallback={<LoadingFallback name="Form" />}>
                  <DemoForm />
                </Suspense>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pdf" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>📄 Générateur PDF - Composant Lourd</CardTitle>
              <CardDescription>
                Génération PDF optimisée avec chargement différé
                <Badge variant="destructive" className="ml-2">
                  Heavy Component
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activeDemo === "pdf" && (
                <Suspense fallback={<LoadingFallback name="PDF Generator" />}>
                  <DemoPDF />
                </Suspense>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ===== GUIDE D'IMPLÉMENTATION ===== */}
      <Card>
        <CardHeader>
          <CardTitle>🔧 Guide d'Implémentation</CardTitle>
          <CardDescription>
            Comment intégrer le code splitting dans vos projets
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">📚 React.lazy() Basique</h4>
              <div className="rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
                <code>{`// Composant lazy simple
const LazyComponent = React.lazy(
  () => import('./MyComponent')
);

// Usage avec Suspense
<Suspense fallback={<Loading />}>
  <LazyComponent />
</Suspense>`}</code>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold">🚀 Avec Delay Simulé</h4>
              <div className="rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
                <code>{`// Simuler un chargement réaliste
const LazyComponent = React.lazy(() => 
  new Promise(resolve => {
    setTimeout(() => {
      resolve(import('./MyComponent'));
    }, 800);
  })
);`}</code>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold">📊 Analytics Intégrées</h4>
              <div className="rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
                <code>{`// Tracker les performances
const LazyComponent = React.lazy(() => {
  const start = performance.now();
  return import('./MyComponent').then(module => {
    console.log(\`Loaded in \${performance.now() - start}ms\`);
    return module;
  });
});`}</code>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold">⚡ Preload Stratégique</h4>
              <div className="rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
                <code>{`// Preload au hover
onMouseEnter={() => {
  import('./ExpensiveComponent');
}}

// Preload basé sur l'usage
useEffect(() => {
  if (userIsActive) {
    import('./UserDashboard');
  }
}, [userIsActive]);`}</code>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h4 className="mb-4 text-lg font-semibold">
              🎯 Meilleures Pratiques
            </h4>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-lg border p-4">
                <h5 className="mb-2 font-medium">
                  🔍 Identifier les Candidats
                </h5>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Composants &gt; 50KB</li>
                  <li>• Routes non critiques</li>
                  <li>• Modales et overlays</li>
                  <li>• Fonctionnalités avancées</li>
                </ul>
              </div>

              <div className="rounded-lg border p-4">
                <h5 className="mb-2 font-medium">⚡ Optimiser le Chargement</h5>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Preload critiques</li>
                  <li>• Fallbacks attrayants</li>
                  <li>• Gestion d'erreurs</li>
                  <li>• Cache intelligent</li>
                </ul>
              </div>

              <div className="rounded-lg border p-4">
                <h5 className="mb-2 font-medium">📈 Mesurer l'Impact</h5>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Bundle size analysis</li>
                  <li>• Load time tracking</li>
                  <li>• User experience metrics</li>
                  <li>• Core Web Vitals</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
