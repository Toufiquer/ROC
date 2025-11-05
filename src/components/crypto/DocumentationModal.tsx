'use client';

/**
 * Documentation Modal Component
 */

import { X, FileText, Upload, BarChart, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface DocumentationModalProps {
  open: boolean;
  onClose: () => void;
}

export default function DocumentationModal({ open, onClose }: DocumentationModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <FileText className="w-6 h-6" />
            Crypto CSV Analyzer - Documentation
          </DialogTitle>
          <DialogDescription>
            Learn how to use the app to analyze your crypto financial data
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Overview */}
          <section>
            <h3 className="text-lg font-semibold mb-3">Overview</h3>
            <p className="text-gray-600 leading-relaxed">
              This application helps you analyze financial CSV data for cryptocurrencies like BTC, ETH, and more.
              Import your data, view summaries, and create financial strategies all in one place.
            </p>
          </section>

          {/* CSV Format */}
          <section>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Upload className="w-5 h-5" />
              CSV Format
            </h3>
            <p className="text-gray-600 mb-2">Your CSV file should have the following columns:</p>
            <div className="bg-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
              <code>
                &quot;Date&quot;,&quot;Price&quot;,&quot;Open&quot;,&quot;High&quot;,&quot;Low&quot;,&quot;Vol.&quot;,&quot;Change %&quot;
              </code>
            </div>
            <div className="mt-3 space-y-2 text-sm text-gray-600">
              <p><strong>Date:</strong> Format MM/DD/YYYY (e.g., 12/31/2021)</p>
              <p><strong>Price, Open, High, Low:</strong> Decimal numbers</p>
              <p><strong>Vol.:</strong> Supports M (million), B (billion), K (thousand)</p>
              <p><strong>Change %:</strong> Percentage with % sign</p>
            </div>
          </section>

          {/* Example */}
          <section>
            <h3 className="text-lg font-semibold mb-3">Example CSV</h3>
            <div className="bg-gray-100 p-4 rounded-lg font-mono text-xs overflow-x-auto">
              <pre>
{`"Date","Price","Open","High","Low","Vol.","Change %"
"12/31/2021","0.8299","0.8387","0.8535","0.8029","457.62M","-1.04%"
"12/30/2021","0.8387","0.8168","0.8586","0.8042","502.92M","2.72%"`}
              </pre>
            </div>
          </section>

          {/* Features */}
          <section>
            <h3 className="text-lg font-semibold mb-3">Key Features</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Upload className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold">Settings</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Import CSV files for multiple currencies. View summary stats for each dataset.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart className="w-5 h-5 text-green-600" />
                  <h4 className="font-semibold">Summary</h4>
                </div>
                <p className="text-sm text-gray-600">
                  View daily, weekly, monthly, and yearly summaries with interactive charts.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  <h4 className="font-semibold">Finance</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Create and manage financial strategies with leverage, grids, and limits.
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-5 h-5 text-orange-600" />
                  <h4 className="font-semibold">Analytics</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Automatic calculation of difference percentage: ((High - Low) / Low) × 100
                </p>
              </div>
            </div>
          </section>

          {/* Getting Started */}
          <section>
            <h3 className="text-lg font-semibold mb-3">Getting Started</h3>
            <ol className="space-y-2 text-sm text-gray-600 list-decimal list-inside">
              <li>Go to <strong>Settings</strong> page</li>
              <li>Click <strong>&quot;Upload CSV&quot;</strong> for your currency (BTC, ETH, etc.)</li>
              <li>Select and upload your CSV file</li>
              <li>Navigate to <strong>Summary</strong> to view analysis and charts</li>
              <li>Use <strong>Finance</strong> to create trading strategies</li>
            </ol>
          </section>

          {/* Storage */}
          <section className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2 text-blue-900">Local Storage</h3>
            <p className="text-sm text-blue-800">
              All data is stored locally in your browser using Zustand + localStorage.
              Your data never leaves your device and persists between sessions.
            </p>
          </section>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={onClose}>
            Got it!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
