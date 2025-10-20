"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Checkbox } from "~/components/ui/checkbox";
import { Slider } from "~/components/ui/slider";
import { EnhancedMap } from "./enhanced-map";
import { MapSidebar } from "./map-sidebar";
import { MapFilters } from "./map-filters";
import {
  MapPin,
  TreePine,
  Bird,
  Flower,
  Search,
  Filter,
  Layers,
  Satellite,
  Navigation,
  Maximize2,
  Download,
  Info,
  Thermometer,
  Droplets,
  Wind,
  Activity
} from "lucide-react";

interface MapLocation {
  id: string;
  name: string;
  type: 'park' | 'flora' | 'fauna' | 'activity';
  coordinates: [number, number];
  description?: string;
  species?: string[];
  conservationStatus?: string;
  lastUpdated?: Date;
  region?: string;
  biodiversityIndex?: number;
  areaSize?: number;
  elevation?: number;
  climateData?: {
    temperature: number;
    humidity: number;
    rainfall: number;
  };
}

interface MapFilters {
  locationTypes: string[];
  conservationStatus: string[];
  regions: string[];
  biodiversityRange: [number, number];
  dateRange: [Date | null, Date | null];
  searchQuery: string;
}

export function EnhancedMapPage() {
  const [locations, setLocations] = useState<MapLocation[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [filters, setFilters] = useState<MapFilters>({
    locationTypes: [],
    conservationStatus: [],
    regions: [],
    biodiversityRange: [0, 100],
    dateRange: [null, null],
    searchQuery: ""
  });
  const [mapStyle, setMapStyle] = useState<'streets' | 'satellite' | 'terrain'>('streets');
  const [showLayers, setShowLayers] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mapBounds, setMapBounds] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  // Mock data for demonstration
  useEffect(() => {
    const mockLocations: MapLocation[] = [
      {
        id: "1",
        name: "Taman Nasional Gunung Leuser",
        type: "park",
        coordinates: [3.5657, 97.6259],
        description: "Salah satu taman nasional terbesar di Sumatera dengan keanekaragaman hayati yang luar biasa.",
        species: ["Orangutan", "Harimau Sumatera", "Badak Sumatera", "Gajah Sumatera"],
        conservationStatus: "CRITICAL",
        lastUpdated: new Date("2024-03-15"),
        region: "Sumatera",
        biodiversityIndex: 92,
        areaSize: 1025000,
        elevation: 3405,
        climateData: {
          temperature: 24,
          humidity: 85,
          rainfall: 2800
        }
      },
      {
        id: "2",
        name: "Taman Nasional Komodo",
        type: "park",
        coordinates: [-8.5500, 119.4167],
        description: "Habitat asli komodo, kadal terbesar di dunia.",
        species: ["Komodo", "Rusa Timor", "Babi Hutan", "Burung Megapoda"],
        conservationStatus: "VULNERABLE",
        lastUpdated: new Date("2024-03-14"),
        region: "Nusa Tenggara",
        biodiversityIndex: 78,
        areaSize: 173300,
        elevation: 821,
        climateData: {
          temperature: 28,
          humidity: 70,
          rainfall: 1200
        }
      },
      {
        id: "3",
        name: "Orangutan Kalimantan",
        type: "fauna",
        coordinates: [-0.7278, 111.4753],
        description: "Populasi orangutan Borneo yang dilindungi di Kalimantan Tengah.",
        conservationStatus: "CRITICAL",
        lastUpdated: new Date("2024-03-16"),
        region: "Kalimantan",
        biodiversityIndex: 85
      },
      {
        id: "4",
        name: "Rafflesia Arnoldii",
        type: "flora",
        coordinates: [-2.4880, 102.9340],
        description: "Bunga terbesar di dunia yang ditemukan di hutan Sumatera.",
        conservationStatus: "VULNERABLE",
        lastUpdated: new Date("2024-03-13"),
        region: "Sumatera",
        biodiversityIndex: 65
      },
      {
        id: "5",
        name: "Cagar Alam Lorentz",
        type: "park",
        coordinates: [-4.7500, 137.8333],
        description: "Taman Nasional terbesar di Asia Tenggara, Situs Warisan Dunia UNESCO.",
        species: ["Kasuari", "Tree Kangaroo", "Burung Cendrawasih", "Penguin Kecil"],
        conservationStatus: "GOOD",
        lastUpdated: new Date("2024-03-12"),
        region: "Papua",
        biodiversityIndex: 95,
        areaSize: 2500000,
        elevation: 4884,
        climateData: {
          temperature: 18,
          humidity: 90,
          rainfall: 3500
        }
      },
      {
        id: "6",
        name: "Penangkaran Penyu Sukamade",
        type: "activity",
        coordinates: [-8.5167, 113.8667],
        description: "Konservasi penyu hijau dan penyu lekang di pesisir Jawa Timur.",
        conservationStatus: "MONITORED",
        lastUpdated: new Date("2024-03-17"),
        region: "Jawa",
        biodiversityIndex: 60
      }
    ];

    setTimeout(() => {
      setLocations(mockLocations);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  const handleLocationClick = (location: MapLocation) => {
    setSelectedLocation(location);
  };

  const handleFilterChange = (newFilters: Partial<MapFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const filteredLocations = locations.filter(location => {
    // Type filter
    if (filters.locationTypes.length > 0 && !filters.locationTypes.includes(location.type)) {
      return false;
    }

    // Conservation status filter
    if (filters.conservationStatus.length > 0 &&
        location.conservationStatus &&
        !filters.conservationStatus.includes(location.conservationStatus)) {
      return false;
    }

    // Region filter
    if (filters.regions.length > 0 &&
        location.region &&
        !filters.regions.includes(location.region)) {
      return false;
    }

    // Biodiversity range filter
    if (location.biodiversityIndex) {
      const [min, max] = filters.biodiversityRange;
      if (location.biodiversityIndex < min || location.biodiversityIndex > max) {
        return false;
      }
    }

    // Search query filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      if (!location.name.toLowerCase().includes(query) &&
          !location.description?.toLowerCase().includes(query) &&
          !location.species?.some(s => s.toLowerCase().includes(query))) {
        return false;
      }
    }

    return true;
  });

  const exportMapData = () => {
    const data = {
      locations: filteredLocations,
      filters: filters,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `taman-kehati-map-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const mapRef = useRef<HTMLDivElement>(null);

  return (
    <div className={`space-y-6 ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''}`}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Peta Interaktif Konservasi
          </h1>
          <p className="text-gray-600">
            Jelajahi lokasi konservasi, habitat spesies, dan kawasan perlindungan di seluruh Indonesia
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowLayers(!showLayers)}
          >
            <Layers className="w-4 h-4 mr-2" />
            Layers
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportMapData}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFullscreen}
          >
            <Maximize2 className="w-4 h-4 mr-2" />
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Map Area */}
        <div className="lg:col-span-3 space-y-4">
          {/* Search and Map Style Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Cari lokasi, spesies, atau aktivitas..."
                value={filters.searchQuery}
                onChange={(e) => handleFilterChange({ searchQuery: e.target.value })}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant={mapStyle === 'streets' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMapStyle('streets')}
              >
                <MapPin className="w-4 h-4 mr-1" />
                Streets
              </Button>
              <Button
                variant={mapStyle === 'satellite' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMapStyle('satellite')}
              >
                <Satellite className="w-4 h-4 mr-1" />
                Satellite
              </Button>
              <Button
                variant={mapStyle === 'terrain' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMapStyle('terrain')}
              >
                <TreePine className="w-4 h-4 mr-1" />
                Terrain
              </Button>
            </div>
          </div>

          {/* Map Container */}
          <div ref={mapRef} className={`relative ${isFullscreen ? 'h-[calc(100vh-200px)]' : 'h-[600px]'}`}>
            <EnhancedMap
              locations={filteredLocations}
              selectedLocation={selectedLocation}
              onLocationClick={handleLocationClick}
              userLocation={userLocation}
              mapStyle={mapStyle}
              showLayers={showLayers}
              onBoundsChange={setMapBounds}
            />

            {/* Map Stats Overlay */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
              <div className="text-sm space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Taman Nasional: {filteredLocations.filter(l => l.type === 'park').length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Flora: {filteredLocations.filter(l => l.type === 'flora').length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span>Fauna: {filteredLocations.filter(l => l.type === 'fauna').length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span>Aktivitas: {filteredLocations.filter(l => l.type === 'activity').length}</span>
                </div>
              </div>
            </div>

            {/* Climate Info Overlay */}
            {selectedLocation?.climateData && (
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                <div className="text-sm space-y-2">
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-orange-500" />
                    <span>{selectedLocation.climateData.temperature}°C</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-blue-500" />
                    <span>{selectedLocation.climateData.humidity}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wind className="w-4 h-4 text-gray-500" />
                    <span>{selectedLocation.climateData.rainfall}mm</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <MapFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            locations={locations}
          />

          <MapSidebar
            selectedLocation={selectedLocation}
            onClose={() => setSelectedLocation(null)}
          />
        </div>
      </div>
    </div>
  );
}