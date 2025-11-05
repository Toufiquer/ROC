/**
 * Type definitions for Crypto CSV Analyzer App
 */

// Raw CSV row type
export interface CsvRow {
  Date: string;
  Price: string;
  Open: string;
  High: string;
  Low: string;
  'Vol.': string;
  'Change %': string;
}

// Parsed currency data entry
export interface CurrencyDataEntry {
  date: Date;
  price: number;
  open: number;
  high: number;
  low: number;
  volume: number; // Converted to actual number (M = million, B = billion)
  changePercent: number;
  differencePercent: number; // ((High - Low) / Low) * 100
}

// Currency dataset
export interface CurrencyDataset {
  id: string;
  name: string; // e.g., "BTC", "ETH"
  data: CurrencyDataEntry[];
  createdAt: Date;
  updatedAt: Date;
}

// Summary statistics for a currency
export interface CurrencySummary {
  totalDays: number;
  startDate: Date;
  endDate: Date;
  minPrice: number;
  maxPrice: number;
  avgDifferencePercent: number;
  avgVolume: number;
  totalVolume: number;
  avgPrice: number;
}

// Time period types
export type TimePeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';

// Aggregated data point for summary views
export interface AggregatedDataPoint {
  period: string; // Date string or period label
  startDate: Date;
  endDate: Date;
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
  avgDifferencePercent: number;
  totalVolume: number;
  dataPoints: number; // Number of entries in this period
}

// Finance configuration (user-created strategies)
export interface FinanceConfig {
  id: string;
  currency: string;
  leverage: number;
  grid: number;
  amount: number;
  upperLimit: number;
  lowerLimit: number;
  createdAt: Date;
  updatedAt: Date;
}

// Store state types
export interface CurrencyStore {
  currencies: CurrencyDataset[];
  addCurrency: (currency: CurrencyDataset) => void;
  updateCurrency: (id: string, data: CurrencyDataEntry[]) => void;
  removeCurrency: (id: string) => void;
  getCurrencyById: (id: string) => CurrencyDataset | undefined;
  getCurrencyByName: (name: string) => CurrencyDataset | undefined;
  clearAll: () => void;
}

export interface FinanceStore {
  configs: FinanceConfig[];
  addConfig: (config: Omit<FinanceConfig, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateConfig: (id: string, config: Partial<Omit<FinanceConfig, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  removeConfig: (id: string) => void;
  getConfigById: (id: string) => FinanceConfig | undefined;
  clearAll: () => void;
}

// Date range filter
export interface DateRange {
  start: Date | null;
  end: Date | null;
}

// Chart data point
export interface ChartDataPoint {
  date: string;
  differencePercent: number;
  price: number;
  high: number;
  low: number;
}

// Upload result
export interface UploadResult {
  success: boolean;
  message: string;
  dataCount?: number;
  currencyName?: string;
}

// Global stats
export interface GlobalStats {
  totalCurrencies: number;
  totalEntries: number;
  totalDataSizeBytes: number;
  oldestDate: Date | null;
  newestDate: Date | null;
}
