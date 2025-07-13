"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CheckCircle2,
  Code2,
  FileSearch,
  Rocket,
  Settings,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";

// Import des composants d'optimisation
import OptimizationOrchestrator from "@/components/ui/optimization-orchestrator";

// Composant principal de démonstration
export default function OptimizationDemoPage() {
  return (
    <div className="container mx-auto space-y-8 py-8">
      {/* En-tête de la page */}
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          Centre d'Optimisation Automatisé
        </h1>
        <p className="text-muted-foreground mx-auto max-w-3xl text-xl">
          Plateforme complète pour l'optimisation automatique de votre codebase.
          Analyse, nettoie et optimise votre code en quelques clics.
        </p>
        <div className="flex justify-center gap-2">
          <Badge variant="default" className="text-sm">
            Phase 4 Complète
          </Badge>
          <Badge variant="secondary" className="text-sm">
            Outils Avancés
          </Badge>
          <Badge variant="outline" className="text-sm">
            Production Ready
          </Badge>
        </div>
      </div>

      {/* Statistiques actuelles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            État Actuel du Codebase
          </CardTitle>
          <CardDescription>
            Analyse basée sur notre scan automatique du projet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <div className="space-y-2 text-center">
              <div className="text-3xl font-bold text-red-600">31</div>
              <div className="text-muted-foreground text-sm">
                Fichiers avec console.log
              </div>
              <Badge variant="destructive" className="text-xs">
                À nettoyer
              </Badge>
            </div>
            <div className="space-y-2 text-center">
              <div className="text-3xl font-bold text-orange-600">17</div>
              <div className="text-muted-foreground text-sm">
                Tables legacy détectées
              </div>
              <Badge variant="secondary" className="text-xs">
                À migrer
              </Badge>
            </div>
            <div className="space-y-2 text-center">
              <div className="text-3xl font-bold text-yellow-600">89</div>
              <div className="text-muted-foreground text-sm">
                Types 'any' trouvés
              </div>
              <Badge variant="outline" className="text-xs">
                À optimiser
              </Badge>
            </div>
            <div className="space-y-2 text-center">
              <div className="text-3xl font-bold text-blue-600">10</div>
              <div className="text-muted-foreground text-sm">
                PDFs à moderniser
              </div>
              <Badge variant="default" className="text-xs">
                En cours
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Outils disponibles */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Code2 className="h-8 w-8 text-blue-500" />
              <Badge variant="default">Prêt</Badge>
            </div>
            <CardTitle className="text-lg">Optimiseur de Types</CardTitle>
            <CardDescription className="text-sm">
              Replace automatiquement les types 'any' par des types stricts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Impact estimé:</span>
                <span className="font-medium text-green-600">+45% qualité</span>
              </div>
              <div className="flex justify-between">
                <span>Temps estimé:</span>
                <span className="font-medium">6 minutes</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <FileSearch className="h-8 w-8 text-red-500" />
              <Badge variant="default">Prêt</Badge>
            </div>
            <CardTitle className="text-lg">Nettoyeur Debug</CardTitle>
            <CardDescription className="text-sm">
              Supprime les console.log et code de debug automatiquement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Fichiers concernés:</span>
                <span className="font-medium text-red-600">31 fichiers</span>
              </div>
              <div className="flex justify-between">
                <span>Gain de taille:</span>
                <span className="font-medium text-green-600">~2.3KB</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Zap className="h-8 w-8 text-yellow-500" />
              <Badge variant="secondary">Disponible</Badge>
            </div>
            <CardTitle className="text-lg">Optimiseur Performance</CardTitle>
            <CardDescription className="text-sm">
              Analyse et optimise les performances de l'application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Bundle réduction:</span>
                <span className="font-medium text-green-600">-15%</span>
              </div>
              <div className="flex justify-between">
                <span>Load time:</span>
                <span className="font-medium text-green-600">-23%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Target className="h-8 w-8 text-purple-500" />
              <Badge variant="default">Nouveau</Badge>
            </div>
            <CardTitle className="text-lg">Auto-Migrateur</CardTitle>
            <CardDescription className="text-sm">
              Migre automatiquement les patterns legacy vers les modernes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Tables legacy:</span>
                <span className="font-medium text-orange-600">17 fichiers</span>
              </div>
              <div className="flex justify-between">
                <span>Effort économisé:</span>
                <span className="font-medium text-green-600">~8 heures</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommandations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Recommandations d'Optimisation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <Rocket className="h-4 w-4" />
              <AlertDescription>
                <strong>Plan recommandé:</strong> Commencez par le "Nettoyage
                Rapide" (8 min) pour obtenir des améliorations immédiates, puis
                passez à l'"Optimisation Complète" pour un gain maximal de
                performance.
              </AlertDescription>
            </Alert>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2 rounded-lg border p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="font-medium">Priorité Haute</span>
                </div>
                <ul className="text-muted-foreground space-y-1 text-sm">
                  <li>• Nettoyer les 31 fichiers avec console.log</li>
                  <li>• Optimiser les 89 types 'any'</li>
                  <li>• Migrer 5 tables critiques</li>
                </ul>
              </div>

              <div className="space-y-2 rounded-lg border p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-orange-500" />
                  <span className="font-medium">Priorité Moyenne</span>
                </div>
                <ul className="text-muted-foreground space-y-1 text-sm">
                  <li>• Migrer les 12 tables legacy restantes</li>
                  <li>• Optimiser les imports inutilisés</li>
                  <li>• Appliquer le lazy loading</li>
                </ul>
              </div>

              <div className="space-y-2 rounded-lg border p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-blue-500" />
                  <span className="font-medium">Optimisations Futures</span>
                </div>
                <ul className="text-muted-foreground space-y-1 text-sm">
                  <li>• Moderniser les 10 composants PDF</li>
                  <li>• Implémenter le tree-shaking avancé</li>
                  <li>• Optimiser les images et assets</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orchestrateur principal */}
      <OptimizationOrchestrator />

      {/* Pied de page avec métriques */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2 text-center">
            <h3 className="text-lg font-semibold">Résultats Attendus</h3>
            <p className="text-muted-foreground text-sm">
              Avec l'optimisation complète, votre application sera plus
              performante, plus maintenable et plus robuste.
            </p>
            <div className="mt-4 flex justify-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">+40%</div>
                <div className="text-muted-foreground text-xs">Performance</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">+65%</div>
                <div className="text-muted-foreground text-xs">
                  Qualité Code
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">+55%</div>
                <div className="text-muted-foreground text-xs">
                  Maintenabilité
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">-30%</div>
                <div className="text-muted-foreground text-xs">Bundle Size</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
