/**
 * CSV Parser for Financial Data
 * Handles parsing, validation, and normalization of CSV data
 */

import { CsvRow, CurrencyDataEntry, CurrencyDataset } from '@/types/crypto';

/**
 * Parse CSV text into array of objects
 */
export function parseCSV(csvText: string): CsvRow[] {
  const lines = csvText.trim().split('\n');

  if (lines.length < 2) {
    throw new Error('CSV file must contain at least a header row and one data row');
  }

  const header = parseCSVLine(lines[0]);

  const requiredColumns = ['Date', 'Price', 'Open', 'High', 'Low', 'Vol.', 'Change %'];
  const missingColumns = requiredColumns.filter(col => !header.includes(col));

  if (missingColumns.length > 0) {
    throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
  }

  const rows: CsvRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;

    const values = parseCSVLine(lines[i]);
    const rowRecord: Record<string, string> = {};

    header.forEach((col, index) => {
      rowRecord[col] = values[index] || '';
    });

    // Build a properly typed CsvRow instead of casting a generic record.
    const csvRow: CsvRow = {
      Date: rowRecord['Date'] || '',
      Price: rowRecord['Price'] || '',
      Open: rowRecord['Open'] || '',
      High: rowRecord['High'] || '',
      Low: rowRecord['Low'] || '',
      'Vol.': rowRecord['Vol.'] || '',
      'Change %': rowRecord['Change %'] || '',
    };

    rows.push(csvRow);
  }

  return rows;
}

/**
 * Parse a single CSV line handling quoted values
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

/**
 * Parse date string to Date object
 * Supports formats: MM/DD/YYYY, DD/MM/YYYY, YYYY-MM-DD
 */
export function parseDate(dateStr: string): Date {
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    const month = parseInt(parts[0], 10);
    const day = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);

    if (!isNaN(month) && !isNaN(day) && !isNaN(year)) {
      return new Date(year, month - 1, day);
    }
  }

  const isoDate = new Date(dateStr);
  if (!isNaN(isoDate.getTime())) {
    return isoDate;
  }

  throw new Error(`Invalid date format: ${dateStr}`);
}

/**
 * Parse volume string (handles M for million, B for billion)
 */
export function parseVolume(volumeStr: string): number {
  const cleaned = volumeStr.replace(/[,\s]/g, '');

  if (cleaned.includes('B')) {
    const value = parseFloat(cleaned.replace('B', ''));
    return value * 1_000_000_000;
  }

  if (cleaned.includes('M')) {
    const value = parseFloat(cleaned.replace('M', ''));
    return value * 1_000_000;
  }

  if (cleaned.includes('K')) {
    const value = parseFloat(cleaned.replace('K', ''));
    return value * 1_000;
  }

  return parseFloat(cleaned) || 0;
}

/**
 * Parse percentage string to number
 */
export function parsePercent(percentStr: string): number {
  const cleaned = percentStr.replace(/[%,\s]/g, '');
  return parseFloat(cleaned) || 0;
}

/**
 * Parse price/number string to float
 */
export function parsePrice(priceStr: string): number {
  const cleaned = priceStr.replace(/[,\s]/g, '');
  return parseFloat(cleaned) || 0;
}

/**
 * Calculate difference percentage: ((High - Low) / Low) * 100
 */
export function calculateDifferencePercent(high: number, low: number): number {
  if (low === 0) return 0;
  return ((high - low) / low) * 100;
}

/**
 * Convert CSV rows to currency data entries
 */
export function csvRowsToDataEntries(rows: CsvRow[]): CurrencyDataEntry[] {
  return rows.map((row, index) => {
    try {
      const date = parseDate(row.Date);
      const price = parsePrice(row.Price);
      const open = parsePrice(row.Open);
      const high = parsePrice(row.High);
      const low = parsePrice(row.Low);
      const volume = parseVolume(row['Vol.']);
      const changePercent = parsePercent(row['Change %']);
      const differencePercent = calculateDifferencePercent(high, low);

      return {
        date,
        price,
        open,
        high,
        low,
        volume,
        changePercent,
        differencePercent,
      };
    } catch (error) {
      throw new Error(`Error parsing row ${index + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });
}

/**
 * Validate currency data entries
 */
export function validateDataEntries(entries: CurrencyDataEntry[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (entries.length === 0) {
    errors.push('No data entries found');
    return { valid: false, errors };
  }

  const invalidDates = entries.filter(entry => isNaN(entry.date.getTime()));
  if (invalidDates.length > 0) {
    errors.push(`Found ${invalidDates.length} entries with invalid dates`);
  }

  const negativePrices = entries.filter(entry => entry.price < 0 || entry.open < 0 || entry.high < 0 || entry.low < 0);
  if (negativePrices.length > 0) {
    errors.push(`Found ${negativePrices.length} entries with negative prices`);
  }

  const illogicalPrices = entries.filter(entry => entry.high < entry.low || entry.high < entry.open || entry.high < entry.price);
  if (illogicalPrices.length > 0) {
    errors.push(`Found ${illogicalPrices.length} entries with illogical price relationships (high < low)`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Main function to parse and validate CSV file
 */
export function parseCurrencyCSV(csvText: string, currencyName: string): CurrencyDataset {
  try {
    const rows = parseCSV(csvText);
    const entries = csvRowsToDataEntries(rows);
    const validation = validateDataEntries(entries);

    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    entries.sort((a, b) => a.date.getTime() - b.date.getTime());

    const dataset: CurrencyDataset = {
      id: `${currencyName.toLowerCase()}_${Date.now()}`,
      name: currencyName.toUpperCase(),
      data: entries,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return dataset;
  } catch (error) {
    throw new Error(`Failed to parse CSV: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Export data to CSV format
 */
export function exportToCSV(entries: CurrencyDataEntry[]): string {
  const headers = ['Date', 'Price', 'Open', 'High', 'Low', 'Vol.', 'Change %', 'Difference %'];
  const rows = [headers.join(',')];

  entries.forEach(entry => {
    const dateStr = entry.date.toLocaleDateString('en-US');
    const volume = entry.volume >= 1_000_000_000 ? `${(entry.volume / 1_000_000_000).toFixed(2)}B` : `${(entry.volume / 1_000_000).toFixed(2)}M`;

    const row = [
      dateStr,
      entry.price.toFixed(4),
      entry.open.toFixed(4),
      entry.high.toFixed(4),
      entry.low.toFixed(4),
      volume,
      `${entry.changePercent.toFixed(2)}%`,
      `${entry.differencePercent.toFixed(2)}%`,
    ];

    rows.push(row.join(','));
  });

  return rows.join('\n');
}

/**
 * Get sample CSV for testing
 */
export function getSampleCSV(): string {
  return `"Date","Price","Open","High","Low","Vol.","Change %"
"12/31/2021","0.8299","0.8387","0.8535","0.8029","457.62M","-1.04%"
"12/30/2021","0.8387","0.8168","0.8586","0.8042","502.92M","2.72%"
"12/29/2021","0.8165","0.8100","0.8290","0.7980","412.35M","0.80%"
"12/28/2021","0.8100","0.8250","0.8380","0.8050","385.20M","-1.82%"
"12/27/2021","0.8250","0.8180","0.8420","0.8120","455.78M","0.85%"`;
}
