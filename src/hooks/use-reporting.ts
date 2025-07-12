/**
 * Hook personnalisé pour la gestion des données de reporting
 * CONTOURNEMENT RTK Query - utilise fetch direct
 */

import {
  calculatePercentageChange,
  calculateReportingPeriod,
  formatCurrency,
  formatPercentage,
  getTrendDirection,
} from "@/lib/reporting-utils";
import type { ReportingRange } from "@/store/reporting/api";
import { useMemo } from "react";
import { useImmediateReportingData } from "./use-immediate-reporting";

export const useReportingData = (
  range: ReportingRange,
  compareRange?: ReportingRange,
) => {
  console.log(
    `🔥 HOOK CALL: useReportingData called with range=${range}, compareRange=${compareRange}`,
  );

  // CONTOURNEMENT RTK Query - utilise fetch direct IMMÉDIAT
  const { mainData, mainLoading, mainError, compareData, compareLoading } =
    useImmediateReportingData(range, compareRange);

  console.log(`🔥 HOOK RESULT: useImmediateReportingData(${range}) returned:`, {
    mainData,
    mainLoading,
    mainError,
    compareData,
    compareLoading,
  });

  // Debug temporaire
  console.log(`📊 DEBUG useReportingData [${range}]:`, {
    mainData,
    mainLoading,
    mainError,
    compareData,
    compareLoading,
    compareRange,
  });

  const reportingData = useMemo(() => {
    if (!mainData) return null;

    const period = calculateReportingPeriod(range);

    // Avec notre contournement direct, mainData est déjà l'objet avec les totaux
    const totals = {
      HT: mainData.HT || 0,
      TTC: mainData.TTC || 0,
    };

    // Pour la compatibilité avec les charts, on crée un tableau avec une entrée
    const chartData = [
      {
        date: new Date().toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "2-digit",
        }),
        HT: totals.HT,
        TTC: totals.TTC,
      },
    ];

    // Données de comparaison si disponibles
    let comparison = null;
    if (compareData && compareRange) {
      const compareTotals = {
        HT: compareData.HT || 0,
        TTC: compareData.TTC || 0,
      };

      const htChange = calculatePercentageChange(totals.HT, compareTotals.HT);
      const ttcChange = calculatePercentageChange(
        totals.TTC,
        compareTotals.TTC,
      );

      comparison = {
        previous: {
          HT: compareTotals.HT,
          TTC: compareTotals.TTC,
          period: calculateReportingPeriod(compareRange),
        },
        changes: {
          HT: {
            percentage: htChange,
            formatted: formatPercentage(htChange),
            trend: getTrendDirection(htChange),
          },
          TTC: {
            percentage: ttcChange,
            formatted: formatPercentage(ttcChange),
            trend: getTrendDirection(ttcChange),
          },
        },
      };
    }

    return {
      period,
      totals: {
        HT: totals.HT,
        TTC: totals.TTC,
        formattedHT: formatCurrency(totals.HT),
        formattedTTC: formatCurrency(totals.TTC),
      },
      chartData,
      comparison,
      rawData: mainData,
    };
  }, [mainData, compareData, range, compareRange]);

  return {
    data: reportingData,
    isLoading: mainLoading || compareLoading,
    error: mainError,
  };
};

// Hook spécialisé pour les cartes du dashboard
export const useDashboardCard = (
  range: ReportingRange,
  compareRange: ReportingRange,
  type: "HT" | "TTC" = "TTC",
) => {
  const { data, isLoading, error } = useReportingData(range, compareRange);

  // Debug temporaire
  console.log(`🐛 DEBUG useDashboardCard [${range}]:`, {
    data,
    isLoading,
    error,
    type,
    comparison: data?.comparison,
  });

  const cardData = useMemo(() => {
    if (!data) return null;

    const value = data.totals[type];
    const formattedValue =
      type === "HT" ? data.totals.formattedHT : data.totals.formattedTTC;
    const comparison = data.comparison?.changes[type];

    return {
      title: data.period.label,
      value,
      formattedValue,
      trend: comparison
        ? {
            percentage: comparison.percentage,
            formatted: comparison.formatted,
            direction: comparison.trend,
            isPositive: comparison.trend === "up",
          }
        : null,
    };
  }, [data, type]);

  return {
    data: cardData,
    isLoading,
    error,
  };
};
