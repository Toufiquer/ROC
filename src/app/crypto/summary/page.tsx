'use client';

/**
 * Summary Page - Charts and Statistics
 */

import { useState, useEffect, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCurrencyStore } from '@/store/useCurrencyStore';
import {
  calculateSummary,
  aggregateByPeriod,
  filterByDateRange,
  prepareChartData,
  getDateRangePresets,
} from '@/lib/dataProcessing';
import { TimePeriod } from '@/types/crypto';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Database, TrendingDown, TrendingUp, Calendar } from 'lucide-react';

export default function SummaryPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<string>('');
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('daily');
  const [dateRangePreset, setDateRangePreset] = useState('All Time');

  const currencies = useCurrencyStore((state) => state.currencies);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && currencies.length > 0 && !selectedCurrency) {
      setSelectedCurrency(currencies[0].name);
    }
  }, [mounted, currencies, selectedCurrency]);

  const currentCurrency = useMemo(() => {
    return currencies.find((c) => c.name === selectedCurrency);
  }, [currencies, selectedCurrency]);

  const dateRangePresets = useMemo(() => getDateRangePresets(), []);

  const filteredData = useMemo(() => {
    if (!currentCurrency || !currentCurrency.data || !Array.isArray(currentCurrency.data)) {
      return [];
    }

    const preset = dateRangePresets[dateRangePreset as keyof typeof dateRangePresets];
    if (!preset) return currentCurrency.data || [];

    return filterByDateRange(currentCurrency.data, preset);
  }, [currentCurrency, dateRangePreset, dateRangePresets]);

  const summary = useMemo(() => {
    return calculateSummary(filteredData);
  }, [filteredData]);

  const aggregatedData = useMemo(() => {
    return aggregateByPeriod(filteredData, timePeriod);
  }, [filteredData, timePeriod]);

  const chartData = useMemo(() => {
    return prepareChartData(filteredData);
  }, [filteredData]);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (currencies.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Summary & Analysis</h1>
        <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <Database className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Data Available
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Upload CSV data in the Settings page to view summaries and charts.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Summary & Analysis</h1>
          <p className="text-gray-600 mt-1">
            View statistics and trends for your crypto data
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Currency Selector */}
          <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((currency) => (
                <SelectItem key={currency.id} value={currency.name}>
                  {currency.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Date Range Selector */}
          <Select value={dateRangePreset} onValueChange={setDateRangePreset}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(dateRangePresets).map((preset) => (
                <SelectItem key={preset} value={preset}>
                  {preset}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* No Data State */}
      {currentCurrency && filteredData.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <Database className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-yellow-900 mb-2">
            No Data Available for Selected Filters
          </h3>
          <p className="text-yellow-800">
            Try adjusting your date range filter or select a different currency.
          </p>
        </div>
      )}

      {/* Summary Stats */}
      {currentCurrency && filteredData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Total Days</p>
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold">{summary.totalDays}</p>
            <p className="text-sm text-gray-500 mt-1">
              {summary.startDate.toLocaleDateString()} - {summary.endDate.toLocaleDateString()}
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Price Range</p>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold">${summary.minPrice.toFixed(4)}</p>
            <p className="text-sm text-gray-500 mt-1">
              Max: ${summary.maxPrice.toFixed(4)}
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Avg Price</p>
              <Database className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold">${summary.avgPrice.toFixed(4)}</p>
            <p className="text-sm text-gray-500 mt-1">
              Across all entries
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Avg Difference %</p>
              <TrendingDown className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-3xl font-bold">{summary.avgDifferencePercent.toFixed(2)}%</p>
            <p className="text-sm text-gray-500 mt-1">
              High-Low volatility
            </p>
          </div>
        </div>
      )}

      {/* Time Period Tabs */}
      {currentCurrency && filteredData.length > 0 && (
        <Tabs value={timePeriod} onValueChange={(v) => setTimePeriod(v as TimePeriod)}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
          </TabsList>

          <TabsContent value={timePeriod} className="space-y-6">
          {/* Price Chart */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">Price Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorPrice)"
                  name="Price"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Difference Percentage Chart */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">
              Difference Percentage (High-Low Volatility)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="differencePercent"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="Difference %"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* High-Low Range Chart */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">High-Low Price Range</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="high" fill="#10b981" name="High" />
                <Bar dataKey="low" fill="#ef4444" name="Low" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Aggregated Summary Table */}
          {aggregatedData.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">
                {timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1)} Summary
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">Period</th>
                      <th className="text-right py-3 px-4 font-semibold">Avg Price</th>
                      <th className="text-right py-3 px-4 font-semibold">Min Price</th>
                      <th className="text-right py-3 px-4 font-semibold">Max Price</th>
                      <th className="text-right py-3 px-4 font-semibold">Avg Diff %</th>
                      <th className="text-right py-3 px-4 font-semibold">Data Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {aggregatedData.map((item, index) => (
                      <tr key={index} className="border-b last:border-b-0 hover:bg-gray-50">
                        <td className="py-3 px-4">{item.period}</td>
                        <td className="text-right py-3 px-4">${item.avgPrice.toFixed(4)}</td>
                        <td className="text-right py-3 px-4">${item.minPrice.toFixed(4)}</td>
                        <td className="text-right py-3 px-4">${item.maxPrice.toFixed(4)}</td>
                        <td className="text-right py-3 px-4">{item.avgDifferencePercent.toFixed(2)}%</td>
                        <td className="text-right py-3 px-4">{item.dataPoints}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
      )}
    </div>
  );
}
