import { ShiftData } from "@/lib/shift-utils";
import { useCallback, useEffect, useState } from "react";

interface ShiftResponse {
  shifts: ShiftData[];
}

interface ShiftCacheData {
  data: ShiftResponse;
  timestamp: number;
}

type ShiftListener = (
  data: ShiftResponse | null,
  isLoading: boolean,
  error: string | null,
) => void;

class ShiftCacheManager {
  private static instance: ShiftCacheManager;
  private cache: ShiftResponse | null = null;
  private isLoading = false;
  private error: string | null = null;
  private listeners: Set<ShiftListener> = new Set();
  private lastFetch = 0;
  private readonly CACHE_DURATION =
    process.env.NODE_ENV === "development"
      ? 5 * 60 * 1000
      : 24 * 60 * 60 * 1000; // 5min dev, 24h prod
  private readonly STORAGE_KEY = "shift-cache-data";

  static getInstance(): ShiftCacheManager {
    if (!ShiftCacheManager.instance) {
      ShiftCacheManager.instance = new ShiftCacheManager();
    }
    return ShiftCacheManager.instance;
  }

  private constructor() {
    // Charger depuis localStorage si disponible
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (typeof window === "undefined") return;

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const cachedData: ShiftCacheData = JSON.parse(stored);
        const now = Date.now();

        // Vérifier si le cache est encore valide
        if (now - cachedData.timestamp < this.CACHE_DURATION) {
          this.cache = cachedData.data;
          this.lastFetch = cachedData.timestamp;
          console.log(
            "✅ Cache shifts chargé depuis localStorage:",
            cachedData.data.shifts.length,
            "shifts",
          );
        } else {
          // Cache expiré, le supprimer
          localStorage.removeItem(this.STORAGE_KEY);
          console.log("🕐 Cache shifts expiré, supprimé du localStorage");
        }
      }
    } catch (error) {
      console.warn("⚠️ Erreur lors du chargement du cache shifts:", error);
      if (typeof window !== "undefined") {
        localStorage.removeItem(this.STORAGE_KEY);
      }
    }
  }

  private saveToStorage() {
    if (typeof window === "undefined" || !this.cache) return;

    try {
      const cacheData: ShiftCacheData = {
        data: this.cache,
        timestamp: this.lastFetch,
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cacheData));
      console.log("💾 Cache shifts sauvé dans localStorage");
    } catch (error) {
      console.warn("⚠️ Erreur lors de la sauvegarde du cache shifts:", error);
    }
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => {
      listener(this.cache, this.isLoading, this.error);
    });
  }

  addListener(listener: ShiftListener) {
    this.listeners.add(listener);
    // Notifier immédiatement avec l'état actuel
    listener(this.cache, this.isLoading, this.error);
  }

  removeListener(listener: ShiftListener) {
    this.listeners.delete(listener);
  }

  private shouldFetch(): boolean {
    const now = Date.now();
    return !this.cache || now - this.lastFetch > this.CACHE_DURATION;
  }

  async fetchShifts(force = false): Promise<void> {
    if (!force && (!this.shouldFetch() || this.isLoading)) {
      return;
    }

    this.isLoading = true;
    this.error = null;
    this.notifyListeners();

    try {
      console.log("🔄 Récupération des données shifts...");
      const response = await fetch("/api/shift/list");

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success || !Array.isArray(data.data)) {
        throw new Error("Format de réponse invalide");
      }

      this.cache = { shifts: data.data };
      this.lastFetch = Date.now();
      this.isLoading = false;
      this.error = null;

      // Sauvegarder dans localStorage
      this.saveToStorage();

      console.log(
        "✅ Données shifts mises en cache:",
        data.shifts.length,
        "shifts",
      );
      this.notifyListeners();
    } catch (error) {
      console.error("❌ Erreur lors de la récupération des shifts:", error);
      this.isLoading = false;
      this.error = error instanceof Error ? error.message : "Erreur inconnue";
      this.notifyListeners();
    }
  }

  invalidateCache() {
    this.cache = null;
    this.lastFetch = 0;
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.STORAGE_KEY);
    }
    console.log("🗑️ Cache shifts invalidé");
  }

  refreshCache() {
    return this.fetchShifts(true);
  }

  // Méthode statique pour permettre l'invalidation depuis d'autres composants
  static invalidateCache() {
    const instance = ShiftCacheManager.getInstance();
    instance.invalidateCache();
    instance.fetchShifts(true);
  }

  getCache(): ShiftResponse | null {
    return this.cache;
  }

  isStale(): boolean {
    const now = Date.now();
    return now - this.lastFetch > this.CACHE_DURATION;
  }
}

export function useShiftDataFixed() {
  const [data, setData] = useState<ShiftResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cacheManager = ShiftCacheManager.getInstance();

  const handleCacheUpdate = useCallback(
    (
      newData: ShiftResponse | null,
      loading: boolean,
      newError: string | null,
    ) => {
      setData(newData);
      setIsLoading(loading);
      setError(newError);
    },
    [],
  );

  useEffect(() => {
    cacheManager.addListener(handleCacheUpdate);

    // Déclencher un fetch immédiat si nécessaire
    if (!cacheManager.getCache() || cacheManager.isStale()) {
      cacheManager.fetchShifts();
    }

    return () => {
      cacheManager.removeListener(handleCacheUpdate);
    };
  }, [cacheManager, handleCacheUpdate]);

  const refetch = useCallback(() => {
    return cacheManager.refreshCache();
  }, [cacheManager]);

  const invalidate = useCallback(() => {
    cacheManager.invalidateCache();
  }, [cacheManager]);

  return {
    data,
    isLoading,
    error,
    refetch,
    invalidate,
    shifts: data?.shifts || [],
  };
}
