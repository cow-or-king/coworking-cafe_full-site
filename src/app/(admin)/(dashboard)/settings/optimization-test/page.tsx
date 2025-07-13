"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

export default function TestOptimizationPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState("");

  const testOptimization = async () => {
    console.log("🚀 DÉBUT TEST OPTIMISATION");
    setIsLoading(true);
    setResults("Démarrage du test...\n");

    try {
      const response = await fetch("/api/optimization/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "optimize",
          settings: {
            autoCleanConsole: true,
            strictTypeChecking: true,
            legacyMigration: false,
          },
        }),
      });

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      setResults(`Succès ! Données reçues:\n${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      console.error("Erreur:", error);
      setResults(`Erreur: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Test Optimisation API</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={testOptimization}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Test en cours..." : "Tester l'optimisation"}
          </Button>

          {results && (
            <div className="rounded bg-gray-100 p-4">
              <pre className="text-sm whitespace-pre-wrap">{results}</pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
