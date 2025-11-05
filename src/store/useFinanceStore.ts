/**
 * Zustand Store for Finance Configurations
 * Persists to localStorage
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { FinanceStore, FinanceConfig } from '@/types/crypto';

export const useFinanceStore = create<FinanceStore>()(
  persist(
    (set, get) => ({
      configs: [],

      addConfig: (config) => {
        const newConfig: FinanceConfig = {
          ...config,
          id: `finance_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        set((state) => ({
          configs: [...state.configs, newConfig],
        }));
      },

      updateConfig: (id, updates) => {
        set((state) => ({
          configs: state.configs.map((config) =>
            config.id === id
              ? {
                  ...config,
                  ...updates,
                  updatedAt: new Date(),
                }
              : config
          ),
        }));
      },

      removeConfig: (id) => {
        set((state) => ({
          configs: state.configs.filter((config) => config.id !== id),
        }));
      },

      getConfigById: (id) => {
        return get().configs.find((config) => config.id === id);
      },

      clearAll: () => {
        set({ configs: [] });
      },
    }),
    {
      name: 'crypto-finance-storage',
      storage: createJSONStorage(() => localStorage),
      // Custom serialization to handle Date objects
      onRehydrateStorage: () => (state) => {
        if (state && state.configs && Array.isArray(state.configs)) {
          // Convert date strings back to Date objects after rehydration
          state.configs = state.configs.map((config) => ({
            ...config,
            createdAt: new Date(config.createdAt),
            updatedAt: new Date(config.updatedAt),
          }));
        }
      },
    }
  )
);
