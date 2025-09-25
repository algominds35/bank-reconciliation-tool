'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  AlertTriangle, 
  Download, 
  Settings, 
  Undo, 
  Trash2, 
  FileText,
  X,
  Info,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DuplicateGroup,
  Txn,
  DedupeSettings,
  DEFAULT_SETTINGS,
  dedupePreview,
  dedupeApply,
  exportCleanData,
  exportAuditLog
} from '@/lib/duplicateDetection';

interface DuplicateDetectionV2Props {
  transactions: Txn[];
  onExport?: (data: any, filename: string) => void;
}

export function DuplicateDetectionV2({ transactions, onExport }: DuplicateDetectionV2Props) {
  const [settings, setSettings] = useState<DedupeSettings>(DEFAULT_SETTINGS);
  const [duplicateGroups, setDuplicateGroups] = useState<DuplicateGroup[]>([]);
  const [keepMap, setKeepMap] = useState<Record<string, string>>({});
  const [auditLog, setAuditLog] = useState<any>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // Process duplicates when transactions or settings change
  useEffect(() => {
    if (transactions.length === 0) {
      setDuplicateGroups([]);
      return;
    }

    setIsProcessing(true);
    try {
      const groups = dedupePreview(transactions, settings);
      setDuplicateGroups(groups);
      
      // Initialize keep map with suggested keeps
      const initialKeepMap: Record<string, string> = {};
      groups.forEach(group => {
        if (group.suggested_keep_id) {
          initialKeepMap[group.group_id] = group.suggested_keep_id;
        }
      });
      setKeepMap(initialKeepMap);
    } catch (error) {
      console.error('Error processing duplicates:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [transactions, settings]);

  const handleKeepChange = (groupId: string, txnId: string) => {
    setKeepMap(prev => ({
      ...prev,
      [groupId]: txnId
    }));
  };

  const handleRemoveSelected = (groupId: string, txnIds: string[]) => {
    // This would mark transactions for removal in the actual implementation
    console.log(`Removing transactions: ${txnIds.join(', ')} from group ${groupId}`);
  };

  const handleApplyDeduplication = () => {
    try {
      const audit = dedupeApply(duplicateGroups, keepMap);
      setAuditLog(audit);
      
      // Here you would update the transactions in your state/database
      console.log('Deduplication applied:', audit);
    } catch (error) {
      console.error('Error applying deduplication:', error);
    }
  };

  const handleExportClean = (format: 'csv' | 'xlsx' | 'pdf') => {
    if (!auditLog) return;
    
    try {
      const exportData = exportCleanData(transactions, auditLog, format);
      if (onExport) {
        onExport(exportData.data, exportData.filename);
      }
    } catch (error) {
      console.error('Error exporting clean data:', error);
    }
  };

  const handleExportAudit = (format: 'csv' | 'json') => {
    if (!auditLog) return;
    
    try {
      const exportData = exportAuditLog(auditLog, format);
      if (onExport) {
        onExport(exportData.data, exportData.filename);
      }
    } catch (error) {
      console.error('Error exporting audit log:', error);
    }
  };

  const toggleGroupExpansion = (groupId: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  const definiteGroups = duplicateGroups.filter(g => g.label === 'definite');
  const possibleGroups = duplicateGroups.filter(g => g.label === 'possible');

  if (isProcessing) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span>Processing duplicates...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (duplicateGroups.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No duplicates detected</h3>
          <p className="text-gray-600 mb-4">
            No duplicates found under current rules. Try widening the date window or lowering the similarity threshold in Settings.
          </p>
          <Button onClick={() => setShowSettings(true)} variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Adjust Settings
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Smart Duplicate Finder</h2>
          <p className="text-gray-600">Catch duplicates in seconds. You make the final call — no risk of deleting real transactions.</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => setShowSettings(true)} variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          {auditLog && (
            <Button onClick={handleApplyDeduplication} className="bg-blue-600 hover:bg-blue-700">
              <CheckCircle className="h-4 w-4 mr-2" />
              Apply Changes
            </Button>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Definite Duplicates</p>
                <p className="text-2xl font-bold text-green-600">{definiteGroups.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium">Possible Duplicates</p>
                <p className="text-2xl font-bold text-orange-600">{possibleGroups.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Total Groups</p>
                <p className="text-2xl font-bold text-blue-600">{duplicateGroups.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Trash2 className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm font-medium">To Remove</p>
                <p className="text-2xl font-bold text-red-600">
                  {Object.values(keepMap).reduce((count, keepId, index) => {
                    const group = duplicateGroups[index];
                    return count + (group ? group.txns.filter(t => t.txn.id !== keepId).length : 0);
                  }, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Duplicate Groups */}
      <Tabs defaultValue="definite" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="definite">
            <CheckCircle className="h-4 w-4 mr-2" />
            Definite ({definiteGroups.length})
          </TabsTrigger>
          <TabsTrigger value="possible">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Possible ({possibleGroups.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="definite" className="space-y-4">
          <AnimatePresence>
            {definiteGroups.map((group) => (
              <DuplicateGroupCard
                key={group.group_id}
                group={group}
                keepMap={keepMap}
                onKeepChange={handleKeepChange}
                onRemoveSelected={handleRemoveSelected}
                isExpanded={expandedGroups.has(group.group_id)}
                onToggleExpansion={() => toggleGroupExpansion(group.group_id)}
              />
            ))}
          </AnimatePresence>
        </TabsContent>

        <TabsContent value="possible" className="space-y-4">
          <AnimatePresence>
            {possibleGroups.map((group) => (
              <DuplicateGroupCard
                key={group.group_id}
                group={group}
                keepMap={keepMap}
                onKeepChange={handleKeepChange}
                onRemoveSelected={handleRemoveSelected}
                isExpanded={expandedGroups.has(group.group_id)}
                onToggleExpansion={() => toggleGroupExpansion(group.group_id)}
              />
            ))}
          </AnimatePresence>
        </TabsContent>
      </Tabs>

      {/* Export Options */}
      {auditLog && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Download className="h-5 w-5" />
              <span>Export Results</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Button onClick={() => handleExportClean('csv')} variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Clean CSV
              </Button>
              <Button onClick={() => handleExportClean('xlsx')} variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Clean Excel
              </Button>
              <Button onClick={() => handleExportClean('pdf')} variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Clean PDF
              </Button>
              <Button onClick={() => handleExportAudit('csv')} variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Audit CSV
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <DuplicateSettingsModal
          settings={settings}
          onSettingsChange={setSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}

// Individual Duplicate Group Card Component
interface DuplicateGroupCardProps {
  group: DuplicateGroup;
  keepMap: Record<string, string>;
  onKeepChange: (groupId: string, txnId: string) => void;
  onRemoveSelected: (groupId: string, txnIds: string[]) => void;
  isExpanded: boolean;
  onToggleExpansion: () => void;
}

function DuplicateGroupCard({
  group,
  keepMap,
  onKeepChange,
  onRemoveSelected,
  isExpanded,
  onToggleExpansion
}: DuplicateGroupCardProps) {
  const [selectedToRemove, setSelectedToRemove] = useState<Set<string>>(new Set());
  const currentKeep = keepMap[group.group_id];

  const handleSelectRemove = (txnId: string, checked: boolean) => {
    setSelectedToRemove(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(txnId);
      } else {
        newSet.delete(txnId);
      }
      return newSet;
    });
  };

  const handleRemoveSelected = () => {
    const txnIds = Array.from(selectedToRemove);
    onRemoveSelected(group.group_id, txnIds);
    setSelectedToRemove(new Set());
  };

  const isDefinite = group.label === 'definite';
  const totalAmount = group.txns.reduce((sum, { txn }) => sum + txn.amount, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className={`border-l-4 ${isDefinite ? 'border-l-green-500' : 'border-l-orange-500'}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {isDefinite ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-orange-500" />
              )}
              <div>
                <CardTitle className="text-lg">
                  {isDefinite ? '✅ Definite duplicate' : '⚠️ Possible duplicate'}
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Found {group.txns.length} duplicates: {group.key.description} — ${Math.abs(totalAmount).toFixed(2)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={isDefinite ? 'default' : 'secondary'}>
                {Math.round(group.confidence * 100)}% confidence
              </Badge>
              <Button variant="ghost" size="sm" onClick={onToggleExpansion}>
                <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </Button>
            </div>
          </div>
        </CardHeader>

        {isExpanded && (
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Keep This One */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Keep this one
                </h4>
                <div className="space-y-2">
                  {group.txns.map(({ txn }) => (
                    <div
                      key={txn.id}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                        currentKeep === txn.id
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                      onClick={() => onKeepChange(group.group_id, txn.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{txn.date}</p>
                          <p className="text-sm text-gray-600">{txn.description}</p>
                          <p className="text-sm font-semibold">${txn.amount.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center">
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            currentKeep === txn.id ? 'border-green-500 bg-green-500' : 'border-gray-300'
                          }`}>
                            {currentKeep === txn.id && (
                              <div className="w-full h-full rounded-full bg-white scale-50"></div>
                            )}
                          </div>
                        </div>
                      </div>
                      {txn.created_at && (
                        <p className="text-xs text-gray-500 mt-1">
                          Oldest entry ({new Date(txn.created_at).toLocaleDateString()})
                        </p>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  You can change which to keep.
                </p>
              </div>

              {/* Remove These */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center">
                  <Trash2 className="h-4 w-4 text-red-500 mr-2" />
                  Remove these
                </h4>
                <div className="space-y-2">
                  {group.txns
                    .filter(({ txn }) => txn.id !== currentKeep)
                    .map(({ txn }) => (
                      <div
                        key={txn.id}
                        className="p-3 rounded-lg border border-gray-200 hover:border-red-300 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            checked={selectedToRemove.has(txn.id)}
                            onCheckedChange={(checked) => handleSelectRemove(txn.id, checked as boolean)}
                          />
                          <div className="flex-1">
                            <p className="font-medium">{txn.date}</p>
                            <p className="text-sm text-gray-600">{txn.description}</p>
                            <p className="text-sm font-semibold">${txn.amount.toFixed(2)}</p>
                            {txn.category && (
                              <p className="text-xs text-gray-500">{txn.category}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                {selectedToRemove.size > 0 && (
                  <Button
                    onClick={handleRemoveSelected}
                    variant="destructive"
                    size="sm"
                    className="mt-3"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove Selected ({selectedToRemove.size})
                  </Button>
                )}
              </div>
            </div>

            {/* Tooltip */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-start space-x-2">
                <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-800">
                  {isDefinite
                    ? 'Exact match on date + amount + description. Safe to remove duplicates.'
                    : 'Similar description and same amount within a short date window. Review before removing.'}
                </p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </motion.div>
  );
}

// Settings Modal Component
interface DuplicateSettingsModalProps {
  settings: DedupeSettings;
  onSettingsChange: (settings: DedupeSettings) => void;
  onClose: () => void;
}

function DuplicateSettingsModal({ settings, onSettingsChange, onClose }: DuplicateSettingsModalProps) {
  const [localSettings, setLocalSettings] = useState<DedupeSettings>(settings);

  const handleSave = () => {
    onSettingsChange(localSettings);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Duplicate Detection Settings</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Date Windows */}
          <div>
            <h3 className="font-semibold mb-3">Date Windows</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Expense Date Window (days)</label>
                <input
                  type="number"
                  value={localSettings.date_window_expense}
                  onChange={(e) => setLocalSettings(prev => ({
                    ...prev,
                    date_window_expense: parseInt(e.target.value) || 5
                  }))}
                  className="w-full p-2 border rounded-md"
                  min="1"
                  max="30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Income Date Window (days)</label>
                <input
                  type="number"
                  value={localSettings.date_window_income}
                  onChange={(e) => setLocalSettings(prev => ({
                    ...prev,
                    date_window_income: parseInt(e.target.value) || 3
                  }))}
                  className="w-full p-2 border rounded-md"
                  min="1"
                  max="30"
                />
              </div>
            </div>
          </div>

          {/* Similarity Threshold */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Similarity Threshold: {Math.round(localSettings.similarity_threshold * 100)}%
            </label>
            <input
              type="range"
              min="0.5"
              max="1"
              step="0.05"
              value={localSettings.similarity_threshold}
              onChange={(e) => setLocalSettings(prev => ({
                ...prev,
                similarity_threshold: parseFloat(e.target.value)
              }))}
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              Higher values require more exact matches. Lower values catch more potential duplicates.
            </p>
          </div>

          {/* Toggles */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium">Treat same amount, different date as possible duplicate</label>
                <p className="text-sm text-gray-500">Find duplicates even when dates differ</p>
              </div>
              <Checkbox
                checked={localSettings.treat_same_amount_different_date}
                onCheckedChange={(checked) => setLocalSettings(prev => ({
                  ...prev,
                  treat_same_amount_different_date: checked as boolean
                }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium">Auto-select keep for definite duplicates</label>
                <p className="text-sm text-gray-500">Automatically choose oldest entry to keep</p>
              </div>
              <Checkbox
                checked={localSettings.auto_select_keep}
                onCheckedChange={(checked) => setLocalSettings(prev => ({
                  ...prev,
                  auto_select_keep: checked as boolean
                }))}
              />
            </div>
          </div>

          {/* Vendor Aliases */}
          <div>
            <h3 className="font-semibold mb-3">Vendor Aliases</h3>
            <p className="text-sm text-gray-500 mb-3">
              Map different vendor names to the same canonical name for better duplicate detection.
            </p>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {Object.entries(localSettings.vendor_aliases).map(([alias, canonical]) => (
                <div key={alias} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={alias}
                    className="flex-1 p-2 border rounded-md text-sm"
                    readOnly
                  />
                  <span>→</span>
                  <input
                    type="text"
                    value={canonical}
                    onChange={(e) => setLocalSettings(prev => ({
                      ...prev,
                      vendor_aliases: {
                        ...prev.vendor_aliases,
                        [alias]: e.target.value
                      }
                    }))}
                    className="flex-1 p-2 border rounded-md text-sm"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newAliases = { ...localSettings.vendor_aliases };
                      delete newAliases[alias];
                      setLocalSettings(prev => ({
                        ...prev,
                        vendor_aliases: newAliases
                      }));
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newAlias = prompt('Enter new alias:');
                const newCanonical = prompt('Enter canonical name:');
                if (newAlias && newCanonical) {
                  setLocalSettings(prev => ({
                    ...prev,
                    vendor_aliases: {
                      ...prev.vendor_aliases,
                      [newAlias.toLowerCase()]: newCanonical.toLowerCase()
                    }
                  }));
                }
              }}
              className="mt-2"
            >
              Add Alias
            </Button>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
