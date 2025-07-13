"use client";

import { useEffect, useState } from "react";

console.log("🚀🚀🚀 FICHIER use-global-preloader.ts CHARGÉ !!! 🚀🚀🚀");

// Interface pour le statut du préchargement
interface PreloadStatus {
  dashboard: boolean;
  charts: boolean;
  staff: boolean;
  shifts: boolean;
  cashEntry: boolean;
}

interface GlobalPreloaderState {
  isPreloading: boolean;
  preloadStatus: PreloadStatus;
  completedApis: number;
  totalApis: number;
  errors: string[];
}

// ===== SINGLETON GLOBAL PRELOADER =====
class GlobalPreloader {
  private static instance: GlobalPreloader;
  private state: GlobalPreloaderState = {
    isPreloading: false,
    preloadStatus: {
      dashboard: false,
      charts: false,
      staff: false,
      shifts: false,
      cashEntry: false,
    },
    completedApis: 0,
    totalApis: 4, // Réduit à 4 APIs (dashboard, charts, staff, cashEntry)
    errors: [],
  };
  private listeners: Set<() => void> = new Set();

  private constructor() {}

  static getInstance(): GlobalPreloader {
    if (!GlobalPreloader.instance) {
      GlobalPreloader.instance = new GlobalPreloader();
    }
    return GlobalPreloader.instance;
  }

  // Ajouter un listener
  addListener(callback: () => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  // Notifier les listeners
  private notifyListeners() {
    this.listeners.forEach((callback) => callback());
  }

  // Obtenir l'état actuel
  getState(): GlobalPreloaderState {
    return { ...this.state };
  }

  // Fonction principale de préchargement
  async preloadAllApis(): Promise<void> {
    if (this.state.isPreloading) {
      console.log("🔄 PRELOADER: Already preloading...");
      return;
    }

    console.log("🚀 PRELOADER: Starting global preload...");
    this.state.isPreloading = true;
    this.state.completedApis = 0;
    this.state.errors = [];
    this.state.preloadStatus = {
      dashboard: false,
      charts: false,
      staff: false,
      shifts: false,
      cashEntry: false,
    };
    this.notifyListeners();

    // APIs à précharger
    const apiPreloads = [
      { name: "dashboard", url: "/api/dashboard", key: "dashboard" },
      { name: "charts", url: "/api/turnover", key: "charts" },
      { name: "staff", url: "/api/staff", key: "staff" },
      // Pas de préchargement des shifts individuels pour éviter les erreurs
      // { name: "shifts", url: `/api/shift?staffId=all&date=${new Date().toISOString().split('T')[0]}`, key: "shifts" },
      { name: "cashEntry", url: "/api/cash-entry", key: "cashEntry" },
    ];

    // Lancer tous les préchargements en parallèle pour une vitesse maximum
    const preloadPromises = apiPreloads.map(async (api) => {
      try {
        console.log(`📡 PRELOADER: Loading ${api.name}...`);
        const response = await fetch(api.url);
        
        if (response.ok) {
          const data = await response.json();
          console.log(`✅ PRELOADER: ${api.name} loaded successfully`);
          
          // Mettre en cache les données selon le type d'API
          this.cacheApiData(api.key, data);
          
          this.state.preloadStatus[api.key as keyof PreloadStatus] = true;
          this.state.completedApis++;
          this.notifyListeners();
        } else {
          throw new Error(`HTTP ${response.status}`);
        }
      } catch (error) {
        console.error(`❌ PRELOADER: Failed to load ${api.name}:`, error);
        this.state.errors.push(`${api.name}: ${error}`);
        this.state.completedApis++;
        this.notifyListeners();
      }
    });

    // Attendre que tous les préchargements soient terminés
    await Promise.all(preloadPromises);

    this.state.isPreloading = false;
    this.notifyListeners();

    console.log(`🎉 PRELOADER: Global preload completed! ${this.state.completedApis}/${this.state.totalApis} APIs loaded`);
    if (this.state.errors.length > 0) {
      console.warn("⚠️ PRELOADER: Some APIs failed to load:", this.state.errors);
    }
  }

  // Mettre en cache les données selon le type d'API
  private cacheApiData(type: string, data: any) {
    try {
      // Cache spécialisé selon le type de données
      switch (type) {
        case "dashboard":
          // Stocker dans le cache dashboard existant
          if (typeof window !== "undefined") {
            localStorage.setItem("dashboard-data-cache", JSON.stringify({
              data: data.data || data,
              timestamp: Date.now(),
              date: new Date().toISOString().split("T")[0],
            }));
          }
          break;

        case "charts":
          // Stocker dans le cache charts
          if (typeof window !== "undefined") {
            localStorage.setItem("chart-data-cache", JSON.stringify({
              data: data.data || data,
              timestamp: Date.now(),
              date: new Date().toISOString().split("T")[0],
            }));
          }
          break;

        case "staff":
          // Stocker dans le cache staff
          if (typeof window !== "undefined") {
            localStorage.setItem("staff-data-cache", JSON.stringify({
              data: data.data || data,
              timestamp: Date.now(),
              date: new Date().toISOString().split("T")[0],
            }));
          }
          break;

        case "shifts":
        case "cashEntry":
          // Stocker dans des caches génériques
          if (typeof window !== "undefined") {
            localStorage.setItem(`${type}-data-cache`, JSON.stringify({
              data: data.data || data,
              timestamp: Date.now(),
              date: new Date().toISOString().split("T")[0],
            }));
          }
          break;
      }
    } catch (error) {
      console.error(`❌ PRELOADER: Failed to cache ${type} data:`, error);
    }
  }

  // Vérifier si le préchargement est terminé
  isPreloadComplete(): boolean {
    return !this.state.isPreloading && this.state.completedApis === this.state.totalApis;
  }

  // Obtenir le pourcentage de progression
  getProgress(): number {
    return Math.round((this.state.completedApis / this.state.totalApis) * 100);
  }
}

// Instance globale
const globalPreloader = GlobalPreloader.getInstance();

// Hook pour utiliser le préchargement global
export function useGlobalPreloader() {
  const [state, setState] = useState<GlobalPreloaderState>(() => globalPreloader.getState());

  useEffect(() => {
    // S'abonner aux changements
    const unsubscribe = globalPreloader.addListener(() => {
      setState(globalPreloader.getState());
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Fonction pour démarrer le préchargement
  const startPreload = () => {
    globalPreloader.preloadAllApis();
  };

  return {
    ...state,
    startPreload,
    isComplete: globalPreloader.isPreloadComplete(),
    progress: globalPreloader.getProgress(),
  };
}

// Hook pour démarrer automatiquement le préchargement sur la page d'accueil
export function useAutoPreloader() {
  const { startPreload, isPreloading, isComplete } = useGlobalPreloader();

  useEffect(() => {
    // Démarrer le préchargement automatiquement avec un petit délai
    // pour ne pas surcharger le chargement initial de la page
    const timer = setTimeout(() => {
      if (!isPreloading && !isComplete) {
        console.log("🎯 AUTO-PRELOADER: Starting automatic preload...");
        startPreload();
      }
    }, 500); // Délai de 500ms pour laisser la page se charger

    return () => clearTimeout(timer);
  }, [startPreload, isPreloading, isComplete]);

  return useGlobalPreloader();
}
