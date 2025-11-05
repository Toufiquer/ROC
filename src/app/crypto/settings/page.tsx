'use client';

/**
 * Settings Page - CSV Import and Management
 */

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useCurrencyStore } from '@/store/useCurrencyStore';
import { parseCurrencyCSV, getSampleCSV } from '@/lib/csvParser';
import { calculateSummary } from '@/lib/dataProcessing';
import {
  Upload,
  Download,
  Trash2,
  FileText,
  AlertCircle,
  CheckCircle2,
  Plus,
  Database,
} from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [mounted, setMounted] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [currencyName, setCurrencyName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const currencies = useCurrencyStore((state) => state.currencies);
  const addCurrency = useCurrencyStore((state) => state.addCurrency);
  const removeCurrency = useCurrencyStore((state) => state.removeCurrency);
  const clearAll = useCurrencyStore((state) => state.clearAll);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && currencies.length > 0 && !selectedTab) {
      setSelectedTab(currencies[0].name);
    }
  }, [mounted, currencies, selectedTab]);

  const handleUploadClick = (existingCurrency?: string) => {
    if (existingCurrency) {
      setCurrencyName(existingCurrency);
    } else {
      setCurrencyName('');
    }
    setShowUploadDialog(true);
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!currencyName.trim()) {
      toast.error('Please enter a currency name');
      return;
    }

    setUploading(true);

    try {
      const text = await file.text();
      const dataset = parseCurrencyCSV(text, currencyName);

      addCurrency(dataset);

      toast.success(`Successfully imported ${dataset.data.length} entries for ${dataset.name}`);

      setShowUploadDialog(false);
      setCurrencyName('');
      setSelectedTab(dataset.name);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to parse CSV file');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
  };

  const confirmDelete = () => {
    if (deletingId) {
      removeCurrency(deletingId);
      toast.success('Currency data deleted successfully');
      setDeletingId(null);

      // Update selected tab
      const remaining = currencies.filter((c) => c.id !== deletingId);
      if (remaining.length > 0) {
        setSelectedTab(remaining[0].name);
      } else {
        setSelectedTab('');
      }
    }
  };

  const handleDownloadSample = () => {
    const csv = getSampleCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample-crypto-data.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Sample CSV downloaded');
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete all currency data? This action cannot be undone.')) {
      clearAll();
      setSelectedTab('');
      toast.success('All data cleared');
    }
  };

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-gray-600 mt-1">
            Import and manage your cryptocurrency CSV data
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={handleDownloadSample}>
            <Download className="w-4 h-4 mr-2" />
            Sample CSV
          </Button>
          <Button onClick={() => handleUploadClick()}>
            <Plus className="w-4 h-4 mr-2" />
            Add Currency
          </Button>
          {currencies.length > 0 && (
            <Button variant="destructive" onClick={handleClearAll}>
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-blue-900 mb-1">CSV Format Requirements</h3>
          <p className="text-sm text-blue-800">
            Your CSV must include columns: Date, Price, Open, High, Low, Vol., Change %.
            Download the sample CSV to see the exact format.
          </p>
        </div>
      </div>

      {/* Currency Tabs */}
      {currencies.length === 0 ? (
        <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Currency Data
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Upload your first CSV file to start analyzing cryptocurrency data.
            You can import data for BTC, ETH, or any other currency.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => handleUploadClick()} size="lg">
              <Upload className="w-5 h-5 mr-2" />
              Upload CSV File
            </Button>
            <Button variant="outline" onClick={handleDownloadSample} size="lg">
              <Download className="w-5 h-5 mr-2" />
              Download Sample
            </Button>
          </div>
        </div>
      ) : (
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="w-full justify-start overflow-x-auto">
            {currencies.map((currency) => (
              <TabsTrigger key={currency.id} value={currency.name}>
                {currency.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {currencies.map((currency) => {
            const summary = calculateSummary(
              currency.data && Array.isArray(currency.data) ? currency.data : []
            );

            return (
              <TabsContent key={currency.id} value={currency.name} className="space-y-6">
                {/* Currency Header */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold">{currency.name}</h2>
                      <p className="text-sm text-gray-500 mt-1">
                        Last updated: {currency.updatedAt.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUploadClick(currency.name)}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Update
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(currency.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Summary Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Total Entries</p>
                      <p className="text-2xl font-bold">
                        {currency.data?.length || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Date Range</p>
                      <p className="text-2xl font-bold">{summary.totalDays} days</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Price Range</p>
                      <p className="text-2xl font-bold">
                        ${summary.minPrice.toFixed(2)} - ${summary.maxPrice.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Avg Diff %</p>
                      <p className="text-2xl font-bold">{summary.avgDifferencePercent.toFixed(2)}%</p>
                    </div>
                  </div>
                </div>

                {/* Data Details */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold mb-4">Dataset Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Dataset ID</span>
                      <span className="font-mono text-sm">{currency.id}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Start Date</span>
                      <span className="font-medium">{summary.startDate.toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">End Date</span>
                      <span className="font-medium">{summary.endDate.toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Average Price</span>
                      <span className="font-medium">${summary.avgPrice.toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Total Volume</span>
                      <span className="font-medium">
                        {summary.totalVolume >= 1_000_000_000
                          ? `${(summary.totalVolume / 1_000_000_000).toFixed(2)}B`
                          : `${(summary.totalVolume / 1_000_000).toFixed(2)}M`}
                      </span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Created At</span>
                      <span className="font-medium">{currency.createdAt.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Sample Data Preview */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold mb-4">Data Preview (First 5 Entries)</h3>
                  {currency.data && currency.data.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 px-3">Date</th>
                            <th className="text-right py-2 px-3">Price</th>
                            <th className="text-right py-2 px-3">High</th>
                            <th className="text-right py-2 px-3">Low</th>
                            <th className="text-right py-2 px-3">Diff %</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currency.data.slice(0, 5).map((entry, index) => (
                            <tr key={index} className="border-b last:border-b-0">
                              <td className="py-2 px-3">{entry.date.toLocaleDateString()}</td>
                              <td className="text-right py-2 px-3">${entry.price.toFixed(4)}</td>
                              <td className="text-right py-2 px-3">${entry.high.toFixed(4)}</td>
                              <td className="text-right py-2 px-3">${entry.low.toFixed(4)}</td>
                              <td className="text-right py-2 px-3">{entry.differencePercent.toFixed(2)}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Database className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600">No data entries available</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      )}

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload CSV Data</DialogTitle>
            <DialogDescription>
              Import financial data for a cryptocurrency
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="currencyName">Currency Name</Label>
              <Input
                id="currencyName"
                placeholder="e.g., BTC, ETH, ADA"
                value={currencyName}
                onChange={(e) => setCurrencyName(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                If currency exists, it will be updated with new data
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="csvFile">CSV File</Label>
              <Input
                id="csvFile"
                type="file"
                accept=".csv"
                ref={fileInputRef}
                onChange={handleFileSelect}
                disabled={uploading}
              />
              <p className="text-xs text-gray-500">
                Must include: Date, Price, Open, High, Low, Vol., Change %
              </p>
            </div>

            {uploading && (
              <div className="flex items-center gap-2 text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm">Processing CSV file...</span>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadDialog(false)} disabled={uploading}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Currency Data?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete all data
              for this currency from your local storage.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
