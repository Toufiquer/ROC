'use client';

/**
 * Finance Page - CRUD for Financial Strategies
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { useFinanceStore } from '@/store/useFinanceStore';
import { FinanceConfig } from '@/types/crypto';
import { Plus, Edit, Trash2, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

export default function FinancePage() {
  const [mounted, setMounted] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingConfig, setEditingConfig] = useState<FinanceConfig | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const configs = useFinanceStore((state) => state.configs);
  const addConfig = useFinanceStore((state) => state.addConfig);
  const updateConfig = useFinanceStore((state) => state.updateConfig);
  const removeConfig = useFinanceStore((state) => state.removeConfig);

  const [formData, setFormData] = useState({
    currency: '',
    leverage: '',
    grid: '',
    amount: '',
    upperLimit: '',
    lowerLimit: '',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      currency: '',
      leverage: '',
      grid: '',
      amount: '',
      upperLimit: '',
      lowerLimit: '',
    });
  };

  const handleAdd = () => {
    setEditingConfig(null);
    resetForm();
    setShowAddDialog(true);
  };

  const handleEdit = (config: FinanceConfig) => {
    setEditingConfig(config);
    setFormData({
      currency: config.currency,
      leverage: config.leverage.toString(),
      grid: config.grid.toString(),
      amount: config.amount.toString(),
      upperLimit: config.upperLimit.toString(),
      lowerLimit: config.lowerLimit.toString(),
    });
    setShowAddDialog(true);
  };

  const handleSave = () => {
    // Validate
    if (!formData.currency.trim()) {
      toast.error('Currency is required');
      return;
    }

    const leverage = parseFloat(formData.leverage);
    const grid = parseFloat(formData.grid);
    const amount = parseFloat(formData.amount);
    const upperLimit = parseFloat(formData.upperLimit);
    const lowerLimit = parseFloat(formData.lowerLimit);

    if (isNaN(leverage) || isNaN(grid) || isNaN(amount) || isNaN(upperLimit) || isNaN(lowerLimit)) {
      toast.error('All numeric fields must be valid numbers');
      return;
    }

    if (upperLimit <= lowerLimit) {
      toast.error('Upper limit must be greater than lower limit');
      return;
    }

    const configData = {
      currency: formData.currency.toUpperCase(),
      leverage,
      grid,
      amount,
      upperLimit,
      lowerLimit,
    };

    if (editingConfig) {
      updateConfig(editingConfig.id, configData);
      toast.success('Configuration updated successfully');
    } else {
      addConfig(configData);
      toast.success('Configuration added successfully');
    }

    setShowAddDialog(false);
    resetForm();
    setEditingConfig(null);
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
  };

  const confirmDelete = () => {
    if (deletingId) {
      removeConfig(deletingId);
      toast.success('Configuration deleted successfully');
      setDeletingId(null);
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Financial Strategies</h1>
          <p className="text-gray-600 mt-1">
            Manage your trading configurations and strategies
          </p>
        </div>
        <Button onClick={handleAdd} size="lg">
          <Plus className="w-5 h-5 mr-2" />
          Add Strategy
        </Button>
      </div>

      {/* Configurations List */}
      {configs.length === 0 ? (
        <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Strategies Yet
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Create your first financial strategy to start managing your trading configurations.
          </p>
          <Button onClick={handleAdd} size="lg">
            <Plus className="w-5 h-5 mr-2" />
            Create First Strategy
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {configs.map((config) => (
            <div
              key={config.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold">{config.currency}</h3>
                  <p className="text-sm text-gray-500">
                    Created: {config.createdAt.toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(config)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(config.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Leverage</p>
                  <p className="text-lg font-semibold">{config.leverage}x</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Grid</p>
                  <p className="text-lg font-semibold">{config.grid}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Amount</p>
                  <p className="text-lg font-semibold">${config.amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Upper Limit</p>
                  <p className="text-lg font-semibold">${config.upperLimit.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Lower Limit</p>
                  <p className="text-lg font-semibold">${config.lowerLimit.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Range</p>
                  <p className="text-lg font-semibold">
                    {((config.upperLimit - config.lowerLimit) / config.lowerLimit * 100).toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingConfig ? 'Edit Strategy' : 'Add New Strategy'}
            </DialogTitle>
            <DialogDescription>
              Configure your financial trading strategy
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Input
                id="currency"
                placeholder="e.g., BTC, ETH"
                value={formData.currency}
                onChange={(e) => handleInputChange('currency', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="leverage">Leverage</Label>
                <Input
                  id="leverage"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 2.5"
                  value={formData.leverage}
                  onChange={(e) => handleInputChange('leverage', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="grid">Grid</Label>
                <Input
                  id="grid"
                  type="number"
                  placeholder="e.g., 10"
                  value={formData.grid}
                  onChange={(e) => handleInputChange('grid', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="e.g., 10000"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="upperLimit">Upper Limit ($)</Label>
                <Input
                  id="upperLimit"
                  type="number"
                  step="0.01"
                  placeholder="e.g., 50000"
                  value={formData.upperLimit}
                  onChange={(e) => handleInputChange('upperLimit', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lowerLimit">Lower Limit ($)</Label>
                <Input
                  id="lowerLimit"
                  type="number"
                  step="0.01"
                  placeholder="e.g., 30000"
                  value={formData.lowerLimit}
                  onChange={(e) => handleInputChange('lowerLimit', e.target.value)}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingConfig ? 'Update' : 'Add'} Strategy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              financial strategy configuration.
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
