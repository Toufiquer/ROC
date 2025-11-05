/**
 * Zustand Store for Currency Data
 * Persists to localStorage
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CurrencyStore, CurrencyDataset, CurrencyDataEntry } from '@/types/crypto';

export const useCurrencyStore = create<CurrencyStore>()(
  persist(
    (set, get) => ({
      currencies: [],

      addCurrency: (currency: CurrencyDataset) => {
        set((state) => {
          // Check if currency with same name already exists
          const existingIndex = state.currencies.findIndex(
            (c) => c.name.toLowerCase() === currency.name.toLowerCase()
          );

          if (existingIndex !== -1) {
            // Update existing currency
            const updated = [...state.currencies];
            updated[existingIndex] = {
              ...currency,
              updatedAt: new Date(),
            };
            return { currencies: updated };
          }

          // Add new currency
          return {
            currencies: [...state.currencies, currency],
          };
        });
      },

      updateCurrency: (id: string, data: CurrencyDataEntry[]) => {
        set((state) => ({
          currencies: state.currencies.map((currency) =>
            currency.id === id
              ? {
                  ...currency,
                  data,
                  updatedAt: new Date(),
                }
              : currency
          ),
        }));
      },

      removeCurrency: (id: string) => {
        set((state) => ({
          currencies: state.currencies.filter((currency) => currency.id !== id),
        }));
      },

      getCurrencyById: (id: string) => {
        return get().currencies.find((currency) => currency.id === id);
      },

      getCurrencyByName: (name: string) => {
        return get().currencies.find(
          (currency) => currency.name.toLowerCase() === name.toLowerCase()
        );
      },

      clearAll: () => {
        set({ currencies: [] });
      },
    }),
    {
      name: 'crypto-currency-storage',
      storage: createJSONStorage(() => localStorage),
      // Custom serialization to handle Date objects
      partialize: (state) => ({ currencies: state.currencies }),
      onRehydrateStorage: () => (state) => {
        if (state && state.currencies && Array.isArray(state.currencies)) {
          // Convert date strings back to Date objects after rehydration
          state.currencies = state.currencies.map((currency) => ({
            ...currency,
            createdAt: new Date(currency.createdAt),
            updatedAt: new Date(currency.updatedAt),
            data:
              currency.data && Array.isArray(currency.data)
                ? currency.data.map((entry) => ({
                    ...entry,
                    date: new Date(entry.date),
                  }))
                : [],
          }));
        }
      },
    }
  )
);
