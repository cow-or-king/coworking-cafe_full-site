/**
 * Code Splitting Demo - Démonstration du système de code splitting
 *
 * Ce composant illustre :
 * - Migration progressive des composants existants
 * - Différentes stratégies de chargement
 * - Analytics en temps réel
 * - Preload intelligent
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
import {
  codeSplittingManager,
  CodeSplittingManager,
  useBundleAnalytics,
  useConditionalPreload,
  useLazyComponent,
} from "@/lib/code-splitting-manager";
import { useState } from "react";

// ===== COMPOSANTS LAZY POUR DÉMONSTRATION =====

// ===== COMPOSANTS DÉMO SIMPLES =====

// Composant Table Demo
const DemoTable = ({ data }: { data: any[] }) => (
  <div className="rounded-lg border p-4">
    <h3 className="mb-4 font-bold">📊 Table Avancée Simulée</h3>
    <div className="overflow-hidden">
      {data.map((item, index) => (
        <div
          key={index}
          className="flex justify-between border-b py-2 last:border-b-0"
        >
          <span>{item.name}</span>
          <span
            className={`rounded px-2 py-1 text-xs ${
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
  </div>
);

// Composant Chart Demo
const DemoChart = ({ data }: { data: any[] }) => (
  <div className="rounded-lg border p-4">
    <h3 className="mb-4 font-bold">📈 Graphique Simulé</h3>
    <div className="space-y-2">
      {data.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <span className="w-12 text-sm">{item.name}</span>
          <div className="h-4 flex-1 rounded-full bg-gray-200">
            <div
              className="h-4 rounded-full bg-blue-500 transition-all duration-1000"
              style={{ width: `${(item.value / 1000) * 100}%` }}
            />
          </div>
          <span className="text-sm font-medium">{item.value}</span>
        </div>
      ))}
    </div>
  </div>
);

// Composant Form Demo
const DemoForm = () => (
  <div className="rounded-lg border p-4">
    <h3 className="mb-4 font-bold">📝 Formulaire Avancé Simulé</h3>
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">Nom</label>
        <input className="w-full rounded border p-2" placeholder="Votre nom" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Email</label>
        <input
          className="w-full rounded border p-2"
          placeholder="email@example.com"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Message</label>
        <textarea
          className="h-20 w-full rounded border p-2"
          placeholder="Votre message"
        />
      </div>
      <Button className="w-full">Envoyer</Button>
    </div>
  </div>
);

// Composant PDF Demo
const DemoPDF = () => (
  <div className="rounded-lg border p-4">
    <h3 className="mb-4 font-bold">📄 Générateur PDF Simulé</h3>
    <div className="rounded border bg-gray-50 p-4">
      <div className="mb-4 text-center">
        <h4 className="text-lg font-bold">Rapport de Démonstration</h4>
        <p className="text-sm text-gray-600">
          Généré le {new Date().toLocaleDateString()}
        </p>
      </div>
      <div className="space-y-2 text-sm">
        <p>📊 Données analysées: 1,234 entrées</p>
        <p>⏱️ Temps de traitement: 2.3 secondes</p>
        <p>✅ Statut: Génération réussie</p>
      </div>
      <div className="mt-4 flex gap-2">
        <Button size="sm" variant="outline">
          👁️ Aperçu
        </Button>
        <Button size="sm">⬇️ Télécharger</Button>
      </div>
    </div>
  </div>
);

// Création des composants lazy
const LazyDemoTable = useLazyComponent(
  "demo-table",
  () => Promise.resolve({ default: DemoTable }),
  { strategy: "on-demand" },
);

const LazyDemoChart = useLazyComponent(
  "demo-chart",
  () => Promise.resolve({ default: DemoChart }),
  { strategy: "on-visible" },
);

const LazyDemoForm = useLazyComponent(
  "demo-form",
  () => Promise.resolve({ default: DemoForm }),
  { strategy: "on-hover" },
);

const LazyDemoPDF = useLazyComponent(
  "demo-pdf",
  () => Promise.resolve({ default: DemoPDF }),
  { strategy: "on-demand" },
);

// ===== COMPOSANT PRINCIPAL =====
export default function CodeSplittingDemo() {
  const [activeDemo, setActiveDemo] = useState<string>("");
  const [preloadTrigger, setPreloadTrigger] = useState(false);
  const { analytics, refresh } = useBundleAnalytics();

  // Preload conditionnel basé sur l'engagement utilisateur
  useConditionalPreload("demo-table", preloadTrigger, 1000);

  const handlePreloadToggle = () => {
    setPreloadTrigger(!preloadTrigger);
    console.log("🎯 Preload trigger:", !preloadTrigger);
  };

  const triggerManualPreload = async (chunkId: string) => {
    const manager = CodeSplittingManager.getInstance();
    await manager.preloadChunk(chunkId);
    refresh(); // Rafraîchir les analytics
  };

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div className="space-y-4 text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          🚀 Code Splitting & Performance Demo
        </h1>
        <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
          Démonstration du système de code splitting intelligent avec lazy
          loading, preload stratégique et analytics en temps réel.
        </p>
      </div>

      {/* ===== ANALYTICS EN TEMPS RÉEL ===== */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📊 Analytics du Bundle
            <Button variant="outline" size="sm" onClick={refresh}>
              🔄 Actualiser
            </Button>
          </CardTitle>
          <CardDescription>
            Métriques en temps réel de l'usage des chunks et de leur performance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {analytics.totalChunks}
              </div>
              <div className="text-muted-foreground text-sm">Total Chunks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {analytics.loadedChunks}
              </div>
              <div className="text-muted-foreground text-sm">Chargés</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {analytics.unusedChunks.length}
              </div>
              <div className="text-muted-foreground text-sm">Non Utilisés</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {analytics.heavyChunks.length}
              </div>
              <div className="text-muted-foreground text-sm">
                Lents (&gt;1s)
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
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
              className="h-2"
            />
          </div>

          {analytics.recommendations.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">🎯 Recommandations:</h4>
              {analytics.recommendations.map((rec, index) => (
                <Badge key={index} variant="outline" className="mr-2">
                  {rec}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ===== CONTRÔLES DE PRELOAD ===== */}
      <Card>
        <CardHeader>
          <CardTitle>⚡ Contrôles de Preload</CardTitle>
          <CardDescription>
            Testez différentes stratégies de preload et leur impact
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={preloadTrigger ? "default" : "outline"}
              onClick={handlePreloadToggle}
            >
              {preloadTrigger ? "✅" : "⏸️"} Preload Automatique
            </Button>

            <Button
              variant="outline"
              onClick={() => triggerManualPreload("demo-table")}
            >
              📊 Preload Table
            </Button>

            <Button
              variant="outline"
              onClick={() => triggerManualPreload("demo-chart")}
            >
              📈 Preload Chart
            </Button>

            <Button
              variant="outline"
              onClick={() => triggerManualPreload("demo-pdf")}
            >
              📄 Preload PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ===== DÉMONSTRATIONS INTERACTIVES ===== */}
      <Tabs value={activeDemo} onValueChange={setActiveDemo} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="table">📊 Table Avancée</TabsTrigger>
          <TabsTrigger value="chart">📈 Graphiques</TabsTrigger>
          <TabsTrigger value="form">📝 Formulaires</TabsTrigger>
          <TabsTrigger value="pdf">📄 Génération PDF</TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>📊 Table Avancée - Lazy Loading</CardTitle>
              <CardDescription>
                Chargement à la demande d'un composant de table complexe.
                <Badge variant="secondary" className="ml-2">
                  On-Demand
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activeDemo === "table" && (
                <LazyDemoTable
                  data={[
                    { id: 1, name: "Demo Item 1", status: "active" },
                    { id: 2, name: "Demo Item 2", status: "pending" },
                    { id: 3, name: "Demo Item 3", status: "completed" },
                  ]}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chart" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>📈 Graphiques - Lazy Loading Visible</CardTitle>
              <CardDescription>
                Chargement automatique quand le composant devient visible.
                <Badge variant="secondary" className="ml-2">
                  On-Visible
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activeDemo === "chart" && (
                <div data-chunk-id="demo-chart">
                  <LazyDemoChart
                    data={[
                      { name: "Jan", value: 400 },
                      { name: "Fév", value: 300 },
                      { name: "Mar", value: 600 },
                      { name: "Avr", value: 800 },
                      { name: "Mai", value: 500 },
                    ]}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="form" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>📝 Formulaire Avancé - Preload au Hover</CardTitle>
              <CardDescription>
                Préchargement intelligent au survol du bouton.
                <Badge variant="secondary" className="ml-2">
                  On-Hover
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                onMouseEnter={() =>
                  codeSplittingManager.preloadChunk("demo-form")
                }
                className="space-y-4"
              >
                <p className="text-muted-foreground text-sm">
                  Survolez cette zone pour déclencher le preload du formulaire.
                </p>

                {activeDemo === "form" && <LazyDemoForm />}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pdf" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>📄 Générateur PDF - Composant Lourd</CardTitle>
              <CardDescription>
                Chargement différé d'un composant complexe avec gestion
                d'erreur.
                <Badge variant="destructive" className="ml-2">
                  Heavy Component
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent>{activeDemo === "pdf" && <LazyDemoPDF />}</CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ===== GÉNÉRATEURS DE PATTERNS ===== */}
      <Card>
        <CardHeader>
          <CardTitle>🔧 Générateurs de Patterns</CardTitle>
          <CardDescription>
            Création automatique de composants lazy pour patterns récurrents
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-4">
              <h4 className="mb-2 font-medium">🗂️ Tables Automatiques</h4>
              <p className="text-muted-foreground mb-3 text-sm">
                Génération automatique de tables avec lazy loading optimisé
              </p>
              <code className="bg-muted block rounded p-2 text-xs">
                LazyComponentGenerator.createLazyTable('staff',
                '/components/staff-table')
              </code>
            </div>

            <div className="rounded-lg border p-4">
              <h4 className="mb-2 font-medium">📝 Formulaires Intelligents</h4>
              <p className="text-muted-foreground mb-3 text-sm">
                Formulaires avec preload basé sur l'interaction utilisateur
              </p>
              <code className="bg-muted block rounded p-2 text-xs">
                LazyComponentGenerator.createLazyForm('contact',
                '/components/contact-form')
              </code>
            </div>

            <div className="rounded-lg border p-4">
              <h4 className="mb-2 font-medium">📊 Charts Optimisés</h4>
              <p className="text-muted-foreground mb-3 text-sm">
                Graphiques avec chargement basé sur la visibilité
              </p>
              <code className="bg-muted block rounded p-2 text-xs">
                LazyComponentGenerator.createLazyChart('analytics',
                '/components/analytics-chart')
              </code>
            </div>

            <div className="rounded-lg border p-4">
              <h4 className="mb-2 font-medium">🪟 Modales Légères</h4>
              <p className="text-muted-foreground mb-3 text-sm">
                Modales chargées uniquement à l'ouverture
              </p>
              <code className="bg-muted block rounded p-2 text-xs">
                LazyComponentGenerator.createLazyModal('settings',
                '/components/settings-modal')
              </code>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ===== INSTRUCTIONS DE MIGRATION ===== */}
      <Card>
        <CardHeader>
          <CardTitle>📋 Plan de Migration Progressive</CardTitle>
          <CardDescription>
            Étapes pour migrer vos composants existants vers le code splitting
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                1
              </div>
              <div>
                <h4 className="font-medium">
                  Identifier les composants lourds
                </h4>
                <p className="text-muted-foreground text-sm">
                  Utilisez les analytics pour identifier les composants qui
                  ralentissent le chargement
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-600">
                2
              </div>
              <div>
                <h4 className="font-medium">Appliquer le lazy loading</h4>
                <p className="text-muted-foreground text-sm">
                  Convertir progressivement les composants avec{" "}
                  <code>useLazyComponent</code>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-600">
                3
              </div>
              <div>
                <h4 className="font-medium">Optimiser les stratégies</h4>
                <p className="text-muted-foreground text-sm">
                  Ajuster les stratégies de chargement selon l'usage (on-hover,
                  on-visible, on-demand)
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-purple-600">
                4
              </div>
              <div>
                <h4 className="font-medium">Mesurer et ajuster</h4>
                <p className="text-muted-foreground text-sm">
                  Utiliser les analytics pour mesurer l'impact et optimiser
                  davantage
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
