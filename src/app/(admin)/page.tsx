"use client";

import { Chart } from "@/components/dashboard/chart";
import { DashSectionCards } from "@/components/dashboard/dash-SectionCard";
import ScoreCard from "@/components/dashboard/staff/score/scoreCard";
import SwitchWithText from "@/components/dashboard/switchWithText";
import { Button } from "@/components/ui/button";
import { diagnoseDashboardCache, invalidateDashboardCache } from "@/hooks/use-dashboard-data-fixed";
import { useAutoPreloader } from "@/hooks/use-global-preloader";
import { RefreshCw, Loader2, Zap } from "lucide-react";
import { useState } from "react";

export default function DashboardPage() {
  const [checked, setChecked] = useState(false);
  
  // Préchargement automatique de toutes les APIs
  const {
    isPreloading,
    isComplete,
    progress,
    completedApis,
    totalApis,
    preloadStatus,
    errors,
    startPreload
  } = useAutoPreloader();

  const handleRefresh = () => {
    console.log("🔄 MANUAL REFRESH: User clicked refresh button");
    
    // Diagnostique avant refresh
    diagnoseDashboardCache();
    
    // Invalider le cache et forcer un refresh
    invalidateDashboardCache();
    
    // Attendre un peu puis recharger
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <ScoreCard hidden={""} />
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex justify-between items-center px-8">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="text-xs"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Refresh Debug
              </Button>
              
              <Button
                variant={isComplete ? "default" : "outline"}
                size="sm"
                onClick={startPreload}
                disabled={isPreloading}
                className="text-xs"
              >
                {isPreloading ? (
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                ) : isComplete ? (
                  <Zap className="w-3 h-3 mr-1" />
                ) : (
                  <Zap className="w-3 h-3 mr-1" />
                )}
                {isPreloading 
                  ? `Préchargement... ${progress}%` 
                  : isComplete 
                    ? "APIs Préchargées ✓" 
                    : "Précharger APIs"}
              </Button>
            </div>

            {/* Indicateur de progression */}
            {(isPreloading || isComplete) && (
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <span>{completedApis}/{totalApis} APIs</span>
                {isComplete && <span className="text-green-600">✓ Complet</span>}
                {errors.length > 0 && <span className="text-red-600">({errors.length} erreurs)</span>}
              </div>
            )}
            
            <SwitchWithText
              checked={checked}
              setChecked={setChecked}
              firstText="HT"
              secondText="TTC"
            />
          </div>
          <DashSectionCards checked={checked} />
          <div className="px-4 lg:px-6">
            <Chart />
          </div>
        </div>
      </div>
    </div>
  );
}
