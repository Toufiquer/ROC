/**
 * Data Processing and Summary Utilities
 */

import {
  CurrencyDataEntry,
  CurrencySummary,
  AggregatedDataPoint,
  TimePeriod,
  DateRange,
  GlobalStats,
  CurrencyDataset,
} from '@/types/crypto';

/**
 * Calculate summary statistics for currency data
 */
export function calculateSummary(entries: CurrencyDataEntry[]): CurrencySummary {
  if (entries.length === 0) {
    return {
      totalDays: 0,
      startDate: new Date(),
      endDate: new Date(),
      minPrice: 0,
      maxPrice: 0,
      avgDifferencePercent: 0,
      avgVolume: 0,
      totalVolume: 0,
      avgPrice: 0,
    };
  }

  const sortedByDate = [...entries].sort((a, b) => a.date.getTime() - b.date.getTime());

  const prices = entries.map((e) => e.price);
  const volumes = entries.map((e) => e.volume);
  const differencePercents = entries.map((e) => e.differencePercent);

  return {
    totalDays: entries.length,
    startDate: sortedByDate[0].date,
    endDate: sortedByDate[sortedByDate.length - 1].date,
    minPrice: Math.min(...prices),
    maxPrice: Math.max(...prices),
    avgDifferencePercent: average(differencePercents),
    avgVolume: average(volumes),
    totalVolume: volumes.reduce((sum, v) => sum + v, 0),
    avgPrice: average(prices),
  };
}

/**
 * Filter entries by date range
 */
export function filterByDateRange(
  entries: CurrencyDataEntry[],
  dateRange: DateRange
): CurrencyDataEntry[] {
  return entries.filter((entry) => {
    const entryTime = entry.date.getTime();

    if (dateRange.start && entryTime < dateRange.start.getTime()) {
      return false;
    }

    if (dateRange.end && entryTime > dateRange.end.getTime()) {
      return false;
    }

    return true;
  });
}

/**
 * Aggregate data by time period
 */
export function aggregateByPeriod(
  entries: CurrencyDataEntry[],
  period: TimePeriod
): AggregatedDataPoint[] {
  if (entries.length === 0) return [];

  const sorted = [...entries].sort((a, b) => a.date.getTime() - b.date.getTime());
  const groups = groupByPeriod(sorted, period);

  return groups.map((group) => {
    if (group.length === 0) {
      return {
        period: '',
        startDate: new Date(),
        endDate: new Date(),
        avgPrice: 0,
        minPrice: 0,
        maxPrice: 0,
        avgDifferencePercent: 0,
        totalVolume: 0,
        dataPoints: 0,
      };
    }

    const prices = group.map((e) => e.price);
    const volumes = group.map((e) => e.volume);
    const differencePercents = group.map((e) => e.differencePercent);

    const startDate = group[0].date;
    const endDate = group[group.length - 1].date;

    return {
      period: formatPeriodLabel(startDate, period),
      startDate,
      endDate,
      avgPrice: average(prices),
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
      avgDifferencePercent: average(differencePercents),
      totalVolume: volumes.reduce((sum, v) => sum + v, 0),
      dataPoints: group.length,
    };
  });
}

/**
 * Group entries by time period
 */
function groupByPeriod(
  entries: CurrencyDataEntry[],
  period: TimePeriod
): CurrencyDataEntry[][] {
  if (entries.length === 0) return [];

  const groups: CurrencyDataEntry[][] = [];
  let currentGroup: CurrencyDataEntry[] = [entries[0]];

  for (let i = 1; i < entries.length; i++) {
    const current = entries[i];
    const previous = entries[i - 1];

    if (isSamePeriod(previous.date, current.date, period)) {
      currentGroup.push(current);
    } else {
      groups.push(currentGroup);
      currentGroup = [current];
    }
  }

  if (currentGroup.length > 0) {
    groups.push(currentGroup);
  }

  return groups;
}

/**
 * Check if two dates are in the same period
 */
function isSamePeriod(date1: Date, date2: Date, period: TimePeriod): boolean {
  switch (period) {
    case 'daily':
      return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
      );

    case 'weekly':
      return getWeekNumber(date1) === getWeekNumber(date2) &&
        date1.getFullYear() === date2.getFullYear();

    case 'monthly':
      return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth()
      );

    case 'yearly':
      return date1.getFullYear() === date2.getFullYear();

    default:
      return false;
  }
}

/**
 * Get week number of the year
 */
function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

/**
 * Format period label for display
 */
function formatPeriodLabel(date: Date, period: TimePeriod): string {
  switch (period) {
    case 'daily':
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

    case 'weekly':
      const weekNum = getWeekNumber(date);
      return `Week ${weekNum}, ${date.getFullYear()}`;

    case 'monthly':
      return date.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      });

    case 'yearly':
      return date.getFullYear().toString();

    default:
      return date.toLocaleDateString();
  }
}

/**
 * Calculate average of an array of numbers
 */
function average(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
}

/**
 * Calculate global statistics across all currencies
 */
export function calculateGlobalStats(currencies: CurrencyDataset[]): GlobalStats {
  if (currencies.length === 0) {
    return {
      totalCurrencies: 0,
      totalEntries: 0,
      totalDataSizeBytes: 0,
      oldestDate: null,
      newestDate: null,
    };
  }

  let totalEntries = 0;
  let allDates: Date[] = [];

  currencies.forEach((currency) => {
    if (currency.data && Array.isArray(currency.data)) {
      totalEntries += currency.data.length;
      allDates = allDates.concat(currency.data.map((e) => e.date));
    }
  });

  // Estimate data size in bytes
  const jsonString = JSON.stringify(currencies);
  const dataSize = new Blob([jsonString]).size;

  // Find oldest and newest dates
  const sortedDates = allDates.sort((a, b) => a.getTime() - b.getTime());

  return {
    totalCurrencies: currencies.length,
    totalEntries,
    totalDataSizeBytes: dataSize,
    oldestDate: sortedDates.length > 0 ? sortedDates[0] : null,
    newestDate: sortedDates.length > 0 ? sortedDates[sortedDates.length - 1] : null,
  };
}

/**
 * Format bytes to human readable string
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Format large numbers with abbreviations
 */
export function formatNumber(num: number): string {
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(2) + 'B';
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(2) + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(2) + 'K';
  }
  return num.toFixed(2);
}

/**
 * Prepare chart data from entries
 */
export function prepareChartData(entries: CurrencyDataEntry[]) {
  return entries.map((entry) => ({
    date: entry.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    differencePercent: parseFloat(entry.differencePercent.toFixed(2)),
    price: parseFloat(entry.price.toFixed(4)),
    high: parseFloat(entry.high.toFixed(4)),
    low: parseFloat(entry.low.toFixed(4)),
  }));
}

/**
 * Get date range presets
 */
export function getDateRangePresets() {
  const now = new Date();

  return {
    'Last 7 Days': {
      start: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      end: now,
    },
    'Last 30 Days': {
      start: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      end: now,
    },
    'Last 3 Months': {
      start: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
      end: now,
    },
    'Last 6 Months': {
      start: new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000),
      end: now,
    },
    'Last Year': {
      start: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000),
      end: now,
    },
    'All Time': {
      start: null,
      end: null,
    },
  };
}
