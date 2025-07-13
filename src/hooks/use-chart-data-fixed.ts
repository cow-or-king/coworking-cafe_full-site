"use client";

import type { TurnoverData } from "@/store/reporting/api";
import { useMemo, useState } from "react";

console.log("🚀🚀🚀 FICHIER use-chart-data-FIXED.ts CHARGÉ !!! 🚀🚀🚀");

interface ApiResponse {
  success: boolean;
  data: TurnoverData[];
}

interface ChartCacheState {
  data: TurnoverData[] | null;
  isLoading: boolean;
  error: string | null;
}

// Singleton Cache Manager pour les données chart
class ChartCacheManager {
  private static instance: ChartCacheManager;
  private state: ChartCacheState = {
    data: null,
    isLoading: false,
    error: null,
  };
  private promise: Promise<any> | null = null;
  private listeners: Set<() => void> = new Set();

  // Clés et configuration cache
  private readonly CACHE_KEY = "chart-turnover-cache-data";
  private readonly CACHE_TIMEOUT =
    process.env.NODE_ENV === "development"
      ? 5 * 60 * 1000 // 5 minutes en dev
      : 24 * 60 * 60 * 1000; // 24 heures en prod

  static getInstance(): ChartCacheManager {
    if (!ChartCacheManager.instance) {
      ChartCacheManager.instance = new ChartCacheManager();
    }
    return ChartCacheManager.instance;
  }

  // Ajouter un listener pour les mises à jour de state
  addListener(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Notifier tous les listeners
  private notifyListeners() {
    this.listeners.forEach((listener) => listener());
  }

  // Obtenir l'état actuel
  getState(): ChartCacheState {
    console.log(`🎯 CHART SINGLETON INITIAL STATE:`, this.state);
    return { ...this.state };
  }

  // Vérifier le cache localStorage (y compris le cache préchargé)
  private getCachedData(): TurnoverData[] | null {
    try {
      // Vérifier si on est côté client (SSR/CSR compatible)
      if (typeof window === "undefined") return null;

      // Essayer d'abord le cache chart normal
      const cached = localStorage.getItem(this.CACHE_KEY);
      if (cached) {
        const parsedCache = JSON.parse(cached);
        const currentTime = Date.now();

        if (currentTime - parsedCache.timestamp < this.CACHE_TIMEOUT) {
          console.log(
            `💾 CHART CACHE HIT: ${parsedCache.data?.length} records from localStorage`,
          );
          return parsedCache.data;
        } else {
          console.log(`⏰ CHART CACHE EXPIRED: Removing old data`);
          localStorage.removeItem(this.CACHE_KEY);
        }
      }

      // Si pas de cache normal, vérifier le cache préchargé
      const preloadedCache = localStorage.getItem("chart-data-cache");
      if (preloadedCache) {
        const parsedPreloadCache = JSON.parse(preloadedCache);
        const currentTime = Date.now();

        if (currentTime - parsedPreloadCache.timestamp < this.CACHE_TIMEOUT) {
          console.log(`🚀 CHART PRELOAD CACHE HIT: Using preloaded data`);
          // Copier les données préchargées vers le cache normal
          this.setCachedData(parsedPreloadCache.data);
          return parsedPreloadCache.data;
        } else {
          console.log(`⏰ CHART PRELOAD CACHE EXPIRED: Removing old data`);
          localStorage.removeItem("chart-data-cache");
        }
      }

      return null;
    } catch (error) {
      console.error(`❌ CHART CACHE READ ERROR:`, error);
      return null;
    }
  }

  // Sauvegarder en cache localStorage
  private setCachedData(data: TurnoverData[]) {
    try {
      // Vérifier si on est côté client (SSR/CSR compatible)
      if (typeof window === "undefined") return;

      const cacheData = {
        data,
        timestamp: Date.now(),
      };
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(cacheData));
      console.log(
        `💾 CHART CACHE SAVED: ${data.length} records to localStorage`,
      );
    } catch (error) {
      console.error(`❌ CHART CACHE SAVE ERROR:`, error);
    }
  }

  // Méthode principale pour récupérer les données
  async getChartData(): Promise<ChartCacheState> {
    console.log(`🎯 CHART SINGLETON GETDATA: Start function`, {
      hasData: !!this.state.data,
      isLoading: this.state.isLoading,
      hasPromise: !!this.promise,
    });

    // Si on a déjà des données, les retourner immédiatement
    if (this.state.data && !this.state.error) {
      console.log(
        `📊 CHART SINGLETON: Using existing data (${this.state.data.length} records)`,
      );
      return this.getState();
    }

    // Vérifier le cache localStorage
    const cachedData = this.getCachedData();
    if (cachedData) {
      this.state = { data: cachedData, isLoading: false, error: null };
      this.notifyListeners();
      return this.getState();
    }

    // Si un fetch est déjà en cours, l'attendre
    if (this.promise) {
      console.log(`🔄 CHART SINGLETON: Fetch already in progress - joining`);
      return this.promise;
    }

    // Démarrer un nouveau fetch
    console.log(`🔥 CHART SINGLETON: Starting new fetch`);
    this.state.isLoading = true;
    this.notifyListeners();

    this.promise = this.fetchFromApi()
      .then((data) => {
        this.state = { data, isLoading: false, error: null };
        this.setCachedData(data);
        this.notifyListeners();
        return this.getState();
      })
      .catch((error) => {
        this.state = { data: null, isLoading: false, error: error.message };
        this.notifyListeners();
        return this.getState();
      })
      .finally(() => {
        this.promise = null;
      });

    return this.promise;
  }

  // Fetch des données depuis l'API
  private async fetchFromApi(): Promise<TurnoverData[]> {
    const baseUrl =
      typeof window !== "undefined" ? "" : "http://localhost:3000";
    const url = `${baseUrl}/api/turnover`;

    console.log(`🔥 CHART SINGLETON FETCH: Starting API call to /api/turnover`);
    console.log(`🔗 CHART SINGLETON URL: ${url}`);

    const response = await fetch(url);
    console.log(`🌐 CHART SINGLETON RESPONSE: ${response.status}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse = await response.json();
    console.log(
      `📊 CHART SINGLETON SUCCESS: ${result.data?.length || 0} records loaded`,
    );

    return result.data || [];
  }

  // Méthode pour forcer le rechargement (utile pour debug)
  async forceRefresh(): Promise<ChartCacheState> {
    console.log(`🔄 CHART SINGLETON: Force refresh requested`);
    this.state = { data: null, isLoading: false, error: null };
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.CACHE_KEY);
    }
    return this.getChartData();
  }
}

// Hook principal utilisant le Singleton
export function useChartData() {
  console.log(`🚀🚀🚀 CHART SINGLETON HOOK CALLED`);

  const [, forceUpdate] = useState({});
  const manager = ChartCacheManager.getInstance();

  // S'abonner aux changements du manager
  useMemo(() => {
    const unsubscribe = manager.addListener(() => {
      forceUpdate({});
    });

    // Déclencher immédiatement le fetch si pas de données
    const currentState = manager.getState();
    if (!currentState.data && !currentState.isLoading) {
      console.log(
        `🎯 CHART SINGLETON: Triggering immediate fetch on first call`,
      );
      manager.getChartData();
    }

    return unsubscribe;
  }, [manager]);

  const state = manager.getState();
  console.log(`🚀 CHART SINGLETON HOOK STATE:`, {
    isLoading: state.isLoading,
    hasData: !!state.data,
    dataLength: state.data?.length || 0,
    error: state.error,
  });

  return state;
}

// Export du manager pour usage externe si nécessaire
export const chartCacheManager = ChartCacheManager.getInstance();
