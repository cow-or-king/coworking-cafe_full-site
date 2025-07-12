/**
 * Utilitaires partagés pour le système de reporting
 */

import { ReportingRange, TurnoverData } from "@/store/reporting/api";

// Types pour les périodes de reporting
export type ReportingPeriod = {
  start: Date;
  end: Date;
  label: string;
};

// Fonction pour calculer les dates selon la période demandée
export const calculateReportingPeriod = (
  range: ReportingRange,
): ReportingPeriod => {
  const today = new Date();
  const startDate = new Date();
  const endDate = new Date();

  switch (range) {
    case "yesterday":
      startDate.setDate(today.getDate() - 1);
      endDate.setDate(today.getDate() - 1);
      return {
        start: startDate,
        end: endDate,
        label: "Hier",
      };

    case "previousDay":
      startDate.setDate(today.getDate() - 2);
      endDate.setDate(today.getDate() - 2);
      return {
        start: startDate,
        end: endDate,
        label: "Avant-hier",
      };

    case "week":
      // Semaine en cours (lundi à aujourd'hui)
      if (startDate.getDay() === 0) {
        startDate.setDate(startDate.getDate() - 6);
      } else {
        startDate.setDate(startDate.getDate() - startDate.getDay() + 1);
      }
      return {
        start: startDate,
        end: today,
        label: "Cette semaine",
      };

    case "previousWeek":
      // Semaine précédente (lundi à dimanche)
      if (startDate.getDay() === 0) {
        startDate.setDate(startDate.getDate() - 13);
        endDate.setDate(endDate.getDate() - endDate.getDay() - 6);
      } else {
        startDate.setDate(startDate.getDate() - startDate.getDay() - 6);
        endDate.setDate(endDate.getDate() - endDate.getDay() + 1);
      }
      return {
        start: startDate,
        end: endDate,
        label: "Semaine précédente",
      };

    case "month":
      // Mois en cours (1er du mois à aujourd'hui)
      startDate.setDate(1);
      return {
        start: startDate,
        end: today,
        label: "Ce mois",
      };

    case "previousMonth":
      // Mois précédent (1er au dernier jour)
      startDate.setMonth(startDate.getMonth() - 1, 1);
      endDate.setMonth(endDate.getMonth(), 0);
      return {
        start: startDate,
        end: endDate,
        label: "Mois précédent",
      };

    default:
      return {
        start: today,
        end: today,
        label: "Aujourd'hui",
      };
  }
};

// Fonction pour formater les montants en euros
export const formatCurrency = (amount: number, showDecimals = true): string => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(amount);
};

// Fonction pour calculer le pourcentage de variation
export const calculatePercentageChange = (
  current: number,
  previous: number,
): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

// Fonction pour formater le pourcentage
export const formatPercentage = (percentage: number): string => {
  const sign = percentage >= 0 ? "+" : "";
  return `${sign}${percentage.toFixed(1)}%`;
};

// Fonction pour déterminer la tendance
export const getTrendDirection = (
  percentage: number,
): "up" | "down" | "stable" => {
  if (Math.abs(percentage) < 0.1) return "stable";
  return percentage > 0 ? "up" : "down";
};

// Fonction pour calculer les totaux d'une liste de données
export const calculateTotals = (data: TurnoverData[]) => {
  if (!data || !Array.isArray(data)) {
    return { HT: 0, TTC: 0 };
  }

  return data.reduce(
    (totals, item) => ({
      HT: totals.HT + (item.HT || 0),
      TTC: totals.TTC + (item.TTC || 0),
    }),
    { HT: 0, TTC: 0 },
  );
};

// Fonction pour filtrer les données par période
export const filterDataByPeriod = (
  data: TurnoverData[],
  period: ReportingPeriod,
): TurnoverData[] => {
  if (!data || !Array.isArray(data)) {
    return [];
  }

  return data.filter((item) => {
    const itemDate = new Date(item.date);
    return itemDate >= period.start && itemDate <= period.end;
  });
};

// Fonction pour grouper les données par jour/semaine/mois
export const groupDataByPeriod = (
  data: TurnoverData[],
  groupBy: "day" | "week" | "month",
) => {
  if (!data || !Array.isArray(data)) {
    return {};
  }

  const groups: { [key: string]: TurnoverData[] } = {};

  data.forEach((item) => {
    const date = new Date(item.date);
    let key: string;

    switch (groupBy) {
      case "day":
        key = date.toISOString().split("T")[0]; // YYYY-MM-DD
        break;
      case "week":
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay() + 1); // Lundi
        key = startOfWeek.toISOString().split("T")[0];
        break;
      case "month":
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        break;
      default:
        key = date.toISOString().split("T")[0];
    }

    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  });

  return groups;
};

// Fonction pour préparer les données pour les graphiques
export const prepareChartData = (data: TurnoverData[]) => {
  if (!data || !Array.isArray(data)) {
    return [];
  }

  return data
    .map((item) => ({
      date: new Date(item.date).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
      }),
      HT: item.HT || 0,
      TTC: item.TTC || 0,
    }))
    .sort((a, b) => {
      const dateA = new Date(a.date.split("/").reverse().join("-"));
      const dateB = new Date(b.date.split("/").reverse().join("-"));
      return dateA.getTime() - dateB.getTime();
    });
};
