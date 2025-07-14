"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";

export default function MigrationDashboardPage() {
  const [migrationStatus, setMigrationStatus] = useState<
    "idle" | "running" | "completed"
  >("idle");
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");

  const migrationSteps = [
    "Analyse des fichiers existants",
    "Sauvegarde des données",
    "Migration des APIs",
    "Conversion des composants",
    "Mise à jour des routes",
    "Tests de validation",
    "Finalisation",
  ];

  const startMigration = async () => {
    setMigrationStatus("running");
    setProgress(0);

    for (let i = 0; i < migrationSteps.length; i++) {
      setCurrentStep(migrationSteps[i]);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setProgress(((i + 1) / migrationSteps.length) * 100);
    }

    setMigrationStatus("completed");
    setCurrentStep("Migration terminée avec succès !");
  };

  const resetMigration = () => {
    setMigrationStatus("idle");
    setProgress(0);
    setCurrentStep("");
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-3xl font-bold">Dashboard de Migration</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Statut de Migration
              <Badge
                variant={
                  migrationStatus === "completed"
                    ? "default"
                    : migrationStatus === "running"
                      ? "secondary"
                      : "outline"
                }
              >
                {migrationStatus === "idle"
                  ? "En attente"
                  : migrationStatus === "running"
                    ? "En cours"
                    : "Terminé"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {migrationStatus === "idle" && (
              <Button onClick={startMigration} className="w-full">
                Démarrer la Migration
              </Button>
            )}

            {migrationStatus === "running" && (
              <div className="space-y-4">
                <Progress value={progress} className="w-full" />
                <p className="text-muted-foreground text-center text-sm">
                  {currentStep} ({progress.toFixed(0)}%)
                </p>
              </div>
            )}

            {migrationStatus === "completed" && (
              <div className="space-y-4">
                <Alert>
                  <AlertDescription>{currentStep}</AlertDescription>
                </Alert>
                <Button
                  onClick={resetMigration}
                  variant="outline"
                  className="w-full"
                >
                  Nouvelle Migration
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informations de Migration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="mb-2 font-semibold">Étapes de Migration :</h4>
                <ul className="space-y-2">
                  {migrationSteps.map((step, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span
                        className={`h-4 w-4 rounded-full ${
                          migrationStatus === "completed" ||
                          (migrationStatus === "running" &&
                            index <
                              Math.floor(
                                progress / (100 / migrationSteps.length),
                              ))
                            ? "bg-green-500"
                            : migrationStatus === "running" &&
                                index ===
                                  Math.floor(
                                    progress / (100 / migrationSteps.length),
                                  )
                              ? "bg-blue-500"
                              : "bg-gray-300"
                        }`}
                      />
                      <span
                        className={
                          migrationStatus === "completed" ||
                          (migrationStatus === "running" &&
                            index <=
                              Math.floor(
                                progress / (100 / migrationSteps.length),
                              ))
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }
                      >
                        {step}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t pt-4">
                <h4 className="mb-2 font-semibold">Système :</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">
                      Version actuelle :
                    </span>
                    <span className="ml-2">Next.js 15.3.3</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">App Router :</span>
                    <span className="ml-2 text-green-600">✓ Activé</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">TypeScript :</span>
                    <span className="ml-2 text-green-600">✓ Configuré</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">APIs :</span>
                    <span className="ml-2 text-green-600">✓ Migrées</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
