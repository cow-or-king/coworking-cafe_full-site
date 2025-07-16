"use client";

import { useCallback, useEffect, useState } from "react";

// Types pour les données Staff (API MongoDB moderne)
interface StaffMemberFromAPI {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string; // Champ moderne unifié
  numberSecu?: string;
  adresse?: string;
  zipcode?: string;
  city?: string;
  framework?: string;
  times?: string;
  hourlyRate?: number;
  startDate?: string;
  endDate?: string;
  contract?: string;
  mdp: number;
  isActive: boolean; // Champ moderne unifié
  createdAt?: string;
  updatedAt?: string;
}

// Types pour les composants (format unifié moderne)
interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string; // Unifié vers le format moderne
  mdp: number;
  isActive: boolean; // Unifié vers le format moderne
}

interface StaffResponse {
  success: boolean;
  data: StaffMemberFromAPI[];
}

interface StaffCacheData {
  data: StaffResponse;
  timestamp: number;
}

type StaffListener = (
  data: StaffMember[] | null,
  isLoading: boolean,
  error: string | null,
) => void;

// ===== SINGLETON GLOBAL CACHE MANAGER =====
class StaffCacheManager {
  private static instance: StaffCacheManager;
  private cache: StaffMember[] | null = null;
  private isLoading = false;
  private error: string | null = null;
  private listeners: Set<StaffListener> = new Set();
  private lastFetch = 0;
  private currentFetch: Promise<StaffMember[]> | null = null;
  private readonly CACHE_DURATION =
    process.env.NODE_ENV === "development"
      ? 5 * 60 * 1000
      : 24 * 60 * 60 * 1000; // 5min dev, 24h prod
  private readonly STORAGE_KEY = "staff-cache-data";

  static getInstance(): StaffCacheManager {
    if (!StaffCacheManager.instance) {
      StaffCacheManager.instance = new StaffCacheManager();
    }
    return StaffCacheManager.instance;
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
        const cachedData: StaffCacheData = JSON.parse(stored);
        const now = Date.now();

        if (now - cachedData.timestamp < this.CACHE_DURATION) {
          this.cache = this.transformStaffData(cachedData.data.data);
          this.lastFetch = cachedData.timestamp;
        } else {
          localStorage.removeItem(this.STORAGE_KEY);
        }
      }
    } catch (error) {
      console.error("📦 STAFF SINGLETON: Error loading from storage", error);
    }
  }

  private saveToStorage(data: StaffResponse) {
    if (typeof window === "undefined") return;

    try {
      const cacheData: StaffCacheData = {
        data,
        timestamp: Date.now(),
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.error("📦 STAFF SINGLETON: Error saving to storage", error);
    }
  }

  private transformStaffData = (
    apiData: StaffMemberFromAPI[],
  ): StaffMember[] => {
    return apiData.map((member) => ({
      id: member._id,
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email || "",
      phone: member.phone || "",
      mdp: member.mdp || 0,
      isActive: member.isActive ?? true,
    }));
  };

  async getStaffData(forceRefresh = false): Promise<StaffMember[]> {
    const now = Date.now();
    const isCacheValid =
      this.cache && now - this.lastFetch < this.CACHE_DURATION;

    if (!forceRefresh && isCacheValid) {
      return this.cache!;
    }

    // Si un cache existe et est valide, l'utiliser
    if (this.cache && !forceRefresh) {
      return this.cache;
    }

    // Si un fetch est déjà en cours, on s'y joint
    if (this.currentFetch) {
      return this.currentFetch;
    }

    this.setLoading(true);
    this.setError(null);

    this.currentFetch = this.performFetch();

    try {
      const result = await this.currentFetch;
      return result;
    } finally {
      this.currentFetch = null;
    }
  }

  private async performFetch(): Promise<StaffMember[]> {
    try {
      const now = Date.now();
      const url = "/api/staff";

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: StaffResponse = await response.json();
      if (result.success && result.data) {
        this.cache = this.transformStaffData(result.data);
        this.lastFetch = now;
        this.saveToStorage(result);
        this.setLoading(false);
        this.notifyListeners();
        return this.cache;
      } else {
        throw new Error("API returned unsuccessful response");
      }
    } catch (error) {
      console.error("❌ STAFF SINGLETON ERROR:", error);
      this.setError(error instanceof Error ? error.message : "Unknown error");
      this.setLoading(false);
      this.notifyListeners();
      throw error;
    }
  }

  forceRefresh(): Promise<StaffMember[]> {
    return this.getStaffData(true);
  }

  // Interface publique
  getState() {
    return {
      data: this.cache,
      isLoading: this.isLoading,
      error: this.error,
    };
  }

  subscribe(listener: StaffListener) {
    this.listeners.add(listener);
    // Envoyer immédiatement l'état actuel
    listener(this.cache, this.isLoading, this.error);

    return () => {
      this.listeners.delete(listener);
    };
  }

  private setLoading(loading: boolean) {
    this.isLoading = loading;
  }

  private setError(error: string | null) {
    this.error = error;
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => {
      listener(this.cache, this.isLoading, this.error);
    });
  }

  invalidateCache() {
    this.cache = null;
    this.lastFetch = 0;
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }
}

// Instance globale
const staffCacheManager = StaffCacheManager.getInstance();

// Hook principal utilisant le Singleton
export const useStaffDataFixed = () => {
  const [state, setState] = useState(() => {
    const initialState = staffCacheManager.getState();
    return initialState;
  });

  useEffect(() => {
    // Si pas de données, on déclenche un fetch immédiat
    if (!state.data && !state.isLoading) {
      staffCacheManager.getStaffData().catch((error) => {
        console.error("🎯 STAFF SINGLETON IMMEDIATE FETCH ERROR:", error);
      });
    }

    // S'abonner aux changements
    const unsubscribe = staffCacheManager.subscribe(
      (data, isLoading, error) => {
        setState({ data, isLoading, error });
      },
    );

    staffCacheManager.getStaffData().catch((error) => {
      console.error(
        "🎯 STAFF SINGLETON USEEFFECT: Error in getDashboardData",
        error,
      );
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const refresh = useCallback(() => {
    return staffCacheManager.forceRefresh();
  }, []);

  const invalidateCache = useCallback(() => {
    staffCacheManager.invalidateCache();
  }, []);

  return {
    data: state.data,
    isLoading: state.isLoading,
    error: state.error,
    refresh,
    invalidateCache,
  };
};
