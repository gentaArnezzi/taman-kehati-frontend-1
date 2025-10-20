"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Checkbox } from "~/components/ui/checkbox";
import { Slider } from "~/components/ui/slider";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { MapFilters as MapFiltersType, MapLocation } from "./enhanced-map-page";
import { Filter, X, Calendar, Thermometer, TreePine } from "lucide-react";

interface MapFiltersProps {
  filters: MapFiltersType;
  onFilterChange: (filters: Partial<MapFiltersType>) => void;
  locations: MapLocation[];
}

export function MapFilters({ filters, onFilterChange, locations }: MapFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Get unique values from locations
  const uniqueRegions = Array.from(new Set(locations.map(l => l.region).filter(Boolean)));
  const uniqueConservationStatuses = Array.from(new Set(locations.map(l => l.conservationStatus).filter(Boolean)));

  const handleLocationTypeChange = (type: string, checked: boolean) => {
    const newTypes = checked
      ? [...filters.locationTypes, type]
      : filters.locationTypes.filter(t => t !== type);
    onFilterChange({ locationTypes: newTypes });
  };

  const handleConservationStatusChange = (status: string, checked: boolean) => {
    const newStatuses = checked
      ? [...filters.conservationStatus, status]
      : filters.conservationStatus.filter(s => s !== status);
    onFilterChange({ conservationStatus: newStatuses });
  };

  const handleRegionChange = (region: string, checked: boolean) => {
    const newRegions = checked
      ? [...filters.regions, region]
      : filters.regions.filter(r => r !== region);
    onFilterChange({ regions: newRegions });
  };

  const clearAllFilters = () => {
    onFilterChange({
      locationTypes: [],
      conservationStatus: [],
      regions: [],
      biodiversityRange: [0, 100],
      searchQuery: ""
    });
  };

  const hasActiveFilters = !!(
    filters.locationTypes.length > 0 ||
    filters.conservationStatus.length > 0 ||
    filters.regions.length > 0 ||
    filters.searchQuery ||
    filters.biodiversityRange[0] > 0 ||
    filters.biodiversityRange[1] < 100
  );

  const activeFilterCount = [
    filters.locationTypes.length,
    filters.conservationStatus.length,
    filters.regions.length,
    filters.searchQuery ? 1 : 0,
    (filters.biodiversityRange[0] > 0 || filters.biodiversityRange[1] < 100) ? 1 : 0
  ].reduce((sum, count) => sum + (count > 0 ? 1 : 0), 0);

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Peta
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFilterCount}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-gray-500 hover:text-red-600"
              >
                <X className="h-4 w-4 mr-1" />
                Reset
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1"
            >
              {isExpanded ? <X className="h-4 w-4" /> : <Filter className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-6">
          {/* Location Types */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Tipe Lokasi</Label>
            <div className="space-y-2">
              {[
                { id: 'park', label: 'Taman Nasional', icon: '🏞️' },
                { id: 'flora', label: 'Flora', icon: '🌿' },
                { id: 'fauna', label: 'Fauna', icon: '🦎' },
                { id: 'activity', label: 'Aktivitas', icon: '🔬' }
              ].map((type) => (
                <div key={type.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={type.id}
                    checked={filters.locationTypes.includes(type.id)}
                    onCheckedChange={(checked) => handleLocationTypeChange(type.id, checked as boolean)}
                  />
                  <Label htmlFor={type.id} className="text-sm flex items-center gap-2 cursor-pointer">
                    <span>{type.icon}</span>
                    <span>{type.label}</span>
                    <Badge variant="outline" className="text-xs ml-auto">
                      {locations.filter(l => l.type === type.id).length}
                    </Badge>
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Conservation Status */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Status Konservasi</Label>
            <div className="space-y-2">
              {[
                { id: 'CRITICAL', label: 'Kritis', color: 'bg-red-500' },
                { id: 'VULNERABLE', label: 'Rentan', color: 'bg-orange-500' },
                { id: 'GOOD', label: 'Baik', color: 'bg-green-500' },
                { id: 'MONITORED', label: 'Dipantau', color: 'bg-blue-500' }
              ].map((status) => (
                <div key={status.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={status.id}
                    checked={filters.conservationStatus.includes(status.id)}
                    onCheckedChange={(checked) => handleConservationStatusChange(status.id, checked as boolean)}
                  />
                  <Label htmlFor={status.id} className="text-sm flex items-center gap-2 cursor-pointer">
                    <div className={`w-3 h-3 rounded-full ${status.color}`} />
                    <span>{status.label}</span>
                    <Badge variant="outline" className="text-xs ml-auto">
                      {locations.filter(l => l.conservationStatus === status.id).length}
                    </Badge>
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Regions */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Wilayah</Label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {uniqueRegions.map((region) => (
                <div key={region} className="flex items-center space-x-2">
                  <Checkbox
                    id={region}
                    checked={filters.regions.includes(region!)}
                    onCheckedChange={(checked) => handleRegionChange(region!, checked as boolean)}
                  />
                  <Label htmlFor={region} className="text-sm cursor-pointer">
                    {region}
                    <Badge variant="outline" className="text-xs ml-2">
                      {locations.filter(l => l.region === region).length}
                    </Badge>
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Biodiversity Index Range */}
          <div>
            <Label className="text-sm font-medium mb-3 block flex items-center gap-2">
              <TreePine className="w-4 h-4" />
              Indeks Keanekaragaman Hayati
            </Label>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>{filters.biodiversityRange[0]}</span>
                <span>{filters.biodiversityRange[1]}</span>
              </div>
              <Slider
                value={filters.biodiversityRange}
                onValueChange={(value) => onFilterChange({ biodiversityRange: value as [number, number] })}
                max={100}
                min={0}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Rendah</span>
                <span>Sedang</span>
                <span>Tinggi</span>
              </div>
            </div>
          </div>

          {/* Quick Filters */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Filter Cepat</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onFilterChange({
                  conservationStatus: ['CRITICAL'],
                  locationTypes: [],
                  regions: []
                })}
                className="text-xs h-8"
              >
                <div className="w-2 h-2 bg-red-500 rounded-full mr-1" />
                Kritis Saja
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onFilterChange({
                  locationTypes: ['park'],
                  conservationStatus: [],
                  regions: []
                })}
                className="text-xs h-8"
              >
                🏞️ Taman Saja
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onFilterChange({
                  biodiversityRange: [80, 100],
                  locationTypes: [],
                  conservationStatus: [],
                  regions: []
                })}
                className="text-xs h-8"
              >
                <Thermometer className="w-3 h-3 mr-1" />
                Indeks Tinggi
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onFilterChange({
                  locationTypes: ['fauna', 'flora'],
                  conservationStatus: [],
                  regions: []
                })}
                className="text-xs h-8"
              >
                🌿 Spesies Saja
              </Button>
            </div>
          </div>

          {/* Results Summary */}
          <div className="pt-4 border-t">
            <div className="text-sm text-gray-600 text-center">
              {hasActiveFilters ? (
                <span>
                  Menampilkan <strong>{locations.filter(l => {
                    // Apply same filter logic as in enhanced-map-page
                    const matchesTypes = filters.locationTypes.length === 0 || filters.locationTypes.includes(l.type);
                    const matchesStatus = filters.conservationStatus.length === 0 ||
                      (l.conservationStatus && filters.conservationStatus.includes(l.conservationStatus));
                    const matchesRegion = filters.regions.length === 0 ||
                      (l.region && filters.regions.includes(l.region));
                    const matchesBiodiversity = !l.biodiversityIndex ||
                      (l.biodiversityIndex >= filters.biodiversityRange[0] &&
                       l.biodiversityIndex <= filters.biodiversityRange[1]);
                    const matchesSearch = !filters.searchQuery ||
                      l.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
                      l.description?.toLowerCase().includes(filters.searchQuery.toLowerCase());

                    return matchesTypes && matchesStatus && matchesRegion && matchesBiodiversity && matchesSearch;
                  }).length}</strong> dari {locations.length} lokasi
                </span>
              ) : (
                <span>
                  Menampilkan semua <strong>{locations.length}</strong> lokasi
                </span>
              )}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}