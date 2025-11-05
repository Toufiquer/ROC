'use client';

/**
 * Crypto Home Page
 * Overview + Documentation + Global Stats
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import StatsCard from '@/components/crypto/StatsCard';
import DocumentationModal from '@/components/crypto/DocumentationModal';
import { useCurrencyStore } from '@/store/useCurrencyStore';
import { calculateGlobalStats, formatBytes } from '@/lib/dataProcessing';
import {
  Database,
  FileText,
  Calendar,
  HardDrive,
  BookOpen,
  TrendingUp,
} from 'lucide-react';

export default function CryptoHomePage() {
  const [showDocs, setShowDocs] = useState(false);
  const [mounted, setMounted] = useState(false);
  const currencies = useCurrencyStore((state) => state.currencies);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const stats = calculateGlobalStats(currencies);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold mb-4">
            Crypto CSV Analyzer
          </h1>
          <p className="text-lg text-blue-100 mb-6">
            Import, analyze, and visualize your cryptocurrency financial data.
            Track daily, weekly, monthly, and yearly trends with powerful analytics.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={() => setShowDocs(true)}
              variant="secondary"
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              View Documentation
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-blue-600"
              onClick={() => window.location.href = '/crypto/settings'}
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              Get Started
            </Button>
          </div>
        </div>
      </div>

      {/* Global Statistics */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Global Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Currencies"
            value={stats.totalCurrencies}
            icon={Database}
            description="Active datasets"
            colorClass="text-blue-600 bg-blue-600"
          />

          <StatsCard
            title="Total Entries"
            value={stats.totalEntries.toLocaleString()}
            icon={FileText}
            description="Data points"
            colorClass="text-green-600 bg-green-600"
          />

          <StatsCard
            title="Data Size"
            value={formatBytes(stats.totalDataSizeBytes)}
            icon={HardDrive}
            description="Stored locally"
            colorClass="text-purple-600 bg-purple-600"
          />

          <StatsCard
            title="Date Range"
            value={
              stats.oldestDate && stats.newestDate
                ? `${Math.ceil(
                    (stats.newestDate.getTime() - stats.oldestDate.getTime()) /
                      (1000 * 60 * 60 * 24)
                  )} days`
                : '0 days'
            }
            icon={Calendar}
            description={
              stats.oldestDate
                ? `${stats.oldestDate.toLocaleDateString()} - ${stats.newestDate?.toLocaleDateString()}`
                : 'No data yet'
            }
            colorClass="text-orange-600 bg-orange-600"
          />
        </div>
      </div>

      {/* Currency List */}
      {currencies.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Your Currencies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currencies.map((currency) => (
              <div
                key={currency.id}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">{currency.name}</h3>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {currency.data.length} entries
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Start Date:</span>
                    <span className="font-medium">
                      {currency.data?.length > 0
                        ? currency.data[0].date.toLocaleDateString()
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>End Date:</span>
                    <span className="font-medium">
                      {currency.data?.length > 0
                        ? currency.data[currency.data.length - 1].date.toLocaleDateString()
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Updated:</span>
                    <span className="font-medium">
                      {currency.updatedAt.toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {currencies.length === 0 && (
        <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <Database className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Data Yet
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Get started by uploading your first CSV file in the Settings page.
            Your data will be stored locally and ready for analysis.
          </p>
          <Button
            onClick={() => window.location.href = '/crypto/settings'}
            size="lg"
          >
            <TrendingUp className="w-5 h-5 mr-2" />
            Upload Your First Dataset
          </Button>
        </div>
      )}

      {/* Features Grid */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-2">Multi-Currency Support</h3>
            <p className="text-gray-600">
              Import and manage CSV data for multiple cryptocurrencies (BTC, ETH, etc.)
              with automatic parsing and validation.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-2">Time-Based Analysis</h3>
            <p className="text-gray-600">
              View daily, weekly, monthly, and yearly summaries with aggregated statistics
              and interactive charts.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-2">Research Metrics</h3>
            <p className="text-gray-600">
              Automatic calculation of difference percentage ((High - Low) / Low × 100)
              for market volatility analysis.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-2">Financial Strategies</h3>
            <p className="text-gray-600">
              Create and manage trading strategies with leverage, grid trading,
              and custom price limits.
            </p>
          </div>
        </div>
      </div>

      {/* Documentation Modal */}
      <DocumentationModal open={showDocs} onClose={() => setShowDocs(false)} />
    </div>
  );
}
