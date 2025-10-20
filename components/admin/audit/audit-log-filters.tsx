"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Filter, Calendar, Target, AlertCircle, Search, X } from "lucide-react";
import { AuditLogQuery } from "~/lib/types";

interface AuditLogFiltersProps {
  filters: AuditLogQuery;
  onFiltersChange: (filters: AuditLogQuery) => void;
  onSearch: (query: string) => void;
  onExport: (format: 'json' | 'csv') => void;
  onReset: () => void;
}

export function AuditLogFilters({
  filters,
  onFiltersChange,
  onSearch,
  onExport,
  onReset
}: AuditLogFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleDateRangeChange = (field: 'startDate' | 'endDate', value: string) => {
    onFiltersChange({
      ...filters,
      [field]: value ? new Date(value) : undefined
    });
  };

  const clearFilter = (field: keyof AuditLogQuery) => {
    onFiltersChange({
      ...filters,
      [field]: undefined
    });
  };

  const getActionDisplayName = (action: string) => {
    const names: Record<string, string> = {
      CREATE: "Buat",
      UPDATE: "Update",
      DELETE: "Hapus",
      LOGIN: "Login",
      LOGOUT: "Logout",
      APPROVE: "Setujui",
      REJECT: "Tolak",
      EXPORT: "Export",
      BACKUP: "Backup",
      SUBMIT_FOR_REVIEW: "Ajukan Review"
    };
    return names[action] || action;
  };

  const getEntityDisplayName = (entity: string) => {
    const names: Record<string, string> = {
      USER: "User",
      PARK: "Taman",
      FLORA: "Flora",
      FAUNA: "Fauna",
      ACTIVITY: "Aktivitas",
      ARTICLE: "Artikel",
      ANNOUNCEMENT: "Pengumuman",
      BIODIVERSITY_INDEX: "Indeks Biodiversitas",
      SYSTEM_CONFIG: "Sistem"
    };
    return names[entity] || entity;
  };

  const hasActiveFilters = !!(
    filters.startDate ||
    filters.endDate ||
    filters.action ||
    filters.entity ||
    filters.category ||
    filters.severity ||
    filters.search
  );

  return (
    <Card className={`transition-all duration-300 ${isExpanded ? '' : 'w-auto'}`}>
      <CardHeader>
        <div className="flex justify-between items-center">
          {isExpanded && (
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter Audit Log
            </CardTitle>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1"
          >
            {isExpanded ? <X className="h-4 w-4" : <Filter className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4">
          {/* Search */}
          <div>
            <Label className="text-sm font-medium">Pencarian</Label>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cari deskripsi atau nama entitas..."
                value={filters.search || ''}
                onChange={(e) => onSearch(e.target.value)}
                className="pl-10"
              />
              {filters.search && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => clearFilter('search')}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Date Range */}
          <div>
            <Label className="text-sm font-medium">Rentang Tanggal</Label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <Label className="text-xs text-gray-500">Tanggal Mulai</Label>
                <Input
                  type="date"
                  value={filters.startDate ?
                    filters.startDate.toISOString().split('T')[0] : ''
                  }
                  onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
                />
              </div>
              <div>
                <Label className="text-xs text-gray-500">Tanggal Akhir</Label>
                <Input
                  type="date"
                  value={filters.endDate ?
                    filters.endDate.toISOString().split('T')[0] : ''
                  }
                  onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Action Filter */}
          <div>
            <Label className="text-sm font-medium">Tipe Aksi</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'APPROVE', 'REJECT', 'EXPORT', 'BACKUP'].map((action) => (
                <button
                  key={action}
                  onClick={() => onFiltersChange({
                    ...filters,
                    action: filters.action === action ? undefined : action
                  })}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                    filters.action === action
                      ? 'bg-blue-100 text-blue-800 border-blue-300'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {getActionDisplayName(action)}
                </button>
              ))}
            </div>
          </div>

          {/* Entity Filter */}
          <div>
            <Label className="text-sm font-medium">Tipe Entitas</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {['USER', 'PARK', 'FLORA', 'FAUNA', 'ACTIVITY', 'ARTICLE', 'ANNOUNCEMENT', 'BIODIVERSITY_INDEX', 'SYSTEM_CONFIG'].map((entity) => (
                <button
                  key={entity}
                  onClick={() => onFiltersChange({
                    ...filters,
                    entity: filters.entity === entity ? undefined : entity
                  })}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                    filters.entity === entity
                      ? 'bg-green-100 text-green-800 border-green-300'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {getEntityDisplayName(entity)}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <Label className="text-sm font-medium">Kategori</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {['SECURITY', 'DATA_CHANGE', 'WORKFLOW', 'SYSTEM', 'ACCESS'].map((category) => (
                <button
                  key={category}
                  onClick={() => onFiltersChange({
                    ...filters,
                    category: filters.category === category ? undefined : category
                  })}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                    filters.category === category
                      ? 'bg-purple-100 text-purple-800 border-purple-300'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {category === 'SECURITY' ? 'Keamanan' :
                   category === 'DATA_CHANGE' ? 'Perubahan Data' :
                   category === 'WORKFLOW' ? 'Workflow' :
                   category === 'SYSTEM' ? 'Sistem' : 'Akses'}
                </button>
              ))}
            </div>
          </div>

          {/* Severity Filter */}
          <div>
            <Label className="text-sm font-medium">Tingkat Severeitas</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((severity) => (
                <button
                  key={severity}
                  onClick={() => onFiltersChange({
                    ...filters,
                    severity: filters.severity === severity ? undefined : severity
                  })}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                    filters.severity === severity
                      ? 'bg-red-100 text-red-800 border-red-300'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {severity === 'CRITICAL' ? 'Kritis' :
                   severity === 'HIGH' ? 'Tinggi' :
                   severity === 'MEDIUM' ? 'Sedang' : 'Rendah'}
                </button>
              ))}
            </div>
          </div>

          {/* Export Options */}
          <div className="pt-4 border-t">
            <Label className="text-sm font-medium">Export Data</Label>
            <div className="flex gap-2 mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onExport('json')}
              >
                <Calendar className="h-3 w-3 mr-1" />
                Export JSON
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onExport('csv')}
              >
                <Target className="h-3 w-3 mr-1" />
                Export CSV
              </Button>
            </div>
          </div>

          {/* Reset Filters */}
          <div className="flex justify-between items-center pt-4 border-t">
            <span className="text-sm text-gray-500">
              {hasActiveFilters ? `${Object.keys(filters).filter(key => filters[key as keyof AuditLogQuery]).length} filter aktif` : 'Tidak ada filter aktif'}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              disabled={!hasActiveFilters}
            >
              <Filter className="h-4 w-4 mr-2" />
              Reset Filter
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}