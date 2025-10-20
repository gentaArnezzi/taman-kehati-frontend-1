# Enhanced Interactive Map with PostGIS Integration

## Deskripsi

Peta interaktif yang canggih dengan integrasi PostGIS untuk visualisasi data geospasial Taman Kehati. Mendukung clustering, filtering berdasarkan provinsi, searching, dan visualisasi data biodiversity index secara geografis.

## Struktur Data

### TypeScript Interfaces

```typescript
interface MapFeature {
  id: string;
  type: 'Feature';
  geometry: GeoJSON.Geometry;
  properties: ParkProperties;
}

interface ParkProperties {
  id: string;
  name: string;
  slug: string;
  province: string;
  regency: string;
  area: number; // hectares
  biodiversityScore?: number;
  status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: Date;
  lastUpdated: Date;

  // Map display properties
  fillColor: string;
  strokeColor: string;
  fillOpacity: number;
  strokeOpacity: number;

  // Statistics
  totalFlora: number;
  totalFauna: number;
  totalActivities: number;

  // Center point for clustering
  centroid: [number, number]; // [longitude, latitude]
}

interface MapCluster {
  id: string;
  type: 'Cluster';
  geometry: GeoJSON.Point;
  properties: {
    cluster: true;
    point_count: number;
    point_count_abbreviated: string;
    parkIds: string[];
    center: [number, number];
  };
}

interface MapViewport {
  center: [number, number];
  zoom: number;
  bounds?: [[number, number], [number, number]];
  pitch?: number;
  bearing?: number;
}

interface MapFilter {
  provinces: string[];
  biodiversityRange: [number, number];
  areaRange: [number, number];
  status: string[];
  hasFlora: boolean;
  hasFauna: boolean;
  hasActivities: boolean;
}

interface MapLayer {
  id: string;
  type: 'fill' | 'circle' | 'line' | 'symbol' | 'raster';
  source: string;
  paint?: Record<string, any>;
  layout?: Record<string, any>;
  minzoom?: number;
  maxzoom?: number;
  filter?: any[];
}
```

## Komponen UI

### 1. Enhanced Interactive Map Page (`/peta`)

```typescript
// app/peta/page.tsx
export default function InteractiveMapPage() {
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [viewport, setViewport] = useState<MapViewport>({
    center: [113.9213, -0.7893], // Center of Indonesia
    zoom: 5
  });
  const [filters, setFilters] = useState<MapFilter>({
    provinces: [],
    biodiversityRange: [0, 100],
    areaRange: [0, 100000],
    status: ['APPROVED'],
    hasFlora: false,
    hasFauna: false,
    hasActivities: false
  });
  const [selectedPark, setSelectedPark] = useState<ParkProperties | null>(null);
  const [mapStyle, setMapStyle] = useState<'streets' | 'satellite' | 'light'>('streets');

  return (
    <div className="h-screen flex flex-col">
      {/* Map Header */}
      <header className="bg-white shadow-sm border-b z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Peta Interaktif Taman Kehati
              </h1>
              <p className="text-sm text-gray-600">
                Jelajahi lokasi dan informasi Taman Kehati seluruh Indonesia
              </p>
            </div>
            <div className="flex items-center gap-4">
              <MapLegend />
              <MapStyleSelector
                currentStyle={mapStyle}
                onStyleChange={setMapStyle}
              />
              <Button onClick={resetView}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset View
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Map Container */}
      <div className="flex-1 relative">
        {/* Map Control Panel */}
        <MapControlPanel
          filters={filters}
          onFiltersChange={setFilters}
          onExportData={exportMapData}
        />

        {/* Map Component */}
        <EnhancedMap
          map={map}
          setMap={setMap}
          viewport={viewport}
          onViewportChange={setViewport}
          filters={filters}
          selectedPark={selectedPark}
          onParkSelect={setSelectedPark}
          mapStyle={mapStyle}
        />

        {/* Map Statistics Overlay */}
        <MapStatsOverlay
          visible={true}
          stats={calculateMapStats(filters)}
        />

        {/* Selected Park Sidebar */}
        {selectedPark && (
          <ParkDetailSidebar
            park={selectedPark}
            onClose={() => setSelectedPark(null)}
          />
        )}
      </div>
    </div>
  );
}
```

### 2. Enhanced Map Component

```typescript
// components/maps/EnhancedMap.tsx
interface EnhancedMapProps {
  map: mapboxgl.Map | null;
  setMap: (map: mapboxgl.Map) => void;
  viewport: MapViewport;
  onViewportChange: (viewport: MapViewport) => void;
  filters: MapFilter;
  selectedPark: ParkProperties | null;
  onParkSelect: (park: ParkProperties | null) => void;
  mapStyle: 'streets' | 'satellite' | 'light';
}

export function EnhancedMap({
  map,
  setMap,
  viewport,
  onViewportChange,
  filters,
  selectedPark,
  onParkSelect,
  mapStyle
}: EnhancedMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [geoData, setGeoData] = useState<MapFeature[]>([]);
  const [clusterData, setClusterData] = useState<MapCluster[]>([]);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map) return;

    const mapInstance = new mapboxgl.Map({
      container: mapContainer.current,
      style: `mapbox://styles/mapbox/${mapStyle}-v11`,
      center: viewport.center,
      zoom: viewport.zoom,
      pitch: viewport.pitch || 0,
      bearing: viewport.bearing || 0,
      attributionControl: false
    });

    // Add controls
    mapInstance.addControl(new mapboxgl.NavigationControl(), 'top-right');
    mapInstance.addControl(new mapboxgl.ScaleControl(), 'bottom-left');
    mapInstance.addControl(
      new mapboxgl.AttributionControl({
        compact: true
      }),
      'bottom-left'
    );

    // Event handlers
    mapInstance.on('moveend', () => {
      const newViewport = {
        center: mapInstance.getCenter().toArray(),
        zoom: mapInstance.getZoom(),
        pitch: mapInstance.getPitch(),
        bearing: mapInstance.getBearing()
      };
      onViewportChange(newViewport);
    });

    mapInstance.on('load', () => {
      setIsLoading(false);
      loadMapData(mapInstance);
    });

    setMap(mapInstance);

    return () => {
      mapInstance.remove();
    };
  }, [mapContainer, map, mapStyle]);

  // Load geospatial data from PostGIS
  const loadMapData = async (mapInstance: mapboxgl.Map) => {
    try {
      // Get GeoJSON data from API
      const response = await fetch('/api/geo/parks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filters })
      });
      const data = await response.json();

      setGeoData(data.features);

      // Add source for parks
      mapInstance.addSource('parks', {
        type: 'geojson',
        data: data,
        promoteId: 'id',
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50
      });

      // Add clustered circles layer
      mapInstance.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'parks',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#51bbd6', // 1-20 parks
            20,
            '#f1f075', // 21-50 parks
            50,
            '#f28cb1'  // 50+ parks
          ],
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            20,
            20,
            30,
            30,
            40
          ]
        }
      });

      // Add cluster count labels
      mapInstance.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'parks',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12
        },
        paint: {
          'text-color': '#ffffff'
        }
      });

      // Add unclustered point circles
      mapInstance.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'parks',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': [
            'case',
            ['==', ['get', 'status'], 'APPROVED'],
            '#22c55e',
            ['==', ['get', 'status'], 'PENDING'],
            '#f59e0b',
            '#ef4444'
          ],
          'circle-radius': 8,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#ffffff'
        }
      });

      // Add park labels
      mapInstance.addLayer({
        id: 'park-labels',
        type: 'symbol',
        source: 'parks',
        filter: ['!', ['has', 'point_count']],
        layout: {
          'text-field': ['get', 'name'],
          'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
          'text-offset': [0, 1.5],
          'text-anchor': 'top',
          'text-size': 11,
          'text-max-width': 8,
          'visibility': 'visible'
        },
        paint: {
          'text-color': '#202020',
          'text-halo-color': '#ffffff',
          'text-halo-width': 1
        }
      });

      // Add polygon fill for park boundaries
      mapInstance.addLayer({
        id: 'park-boundaries',
        type: 'fill',
        source: 'parks',
        filter: [
          'all',
          ['!', ['has', 'point_count']],
          ['==', ['geometry-type'], 'Polygon']
        ],
        paint: {
          'fill-color': [
            'interpolate',
            ['linear'],
            ['get', 'biodiversityScore'],
            0, '#fee2e2',
            25, '#fed7aa',
            50, '#fef3c7',
            75, '#d1fae5',
            100, '#22c55e'
          ],
          'fill-opacity': 0.3,
          'fill-outline-color': '#ffffff'
        }
      });

      // Click handlers
      mapInstance.on('click', 'clusters', handleClusterClick);
      mapInstance.on('click', 'unclustered-point', handleParkClick);
      mapInstance.on('click', 'park-boundaries', handleParkClick);

      // Hover effects
      mapInstance.on('mouseenter', 'unclustered-point', () => {
        mapInstance.getCanvas().style.cursor = 'pointer';
      });
      mapInstance.on('mouseleave', 'unclustered-point', () => {
        mapInstance.getCanvas().style.cursor = '';
      });

    } catch (error) {
      console.error('Error loading map data:', error);
      setIsLoading(false);
    }
  };

  // Handle cluster click
  const handleClusterClick = (e: mapboxgl.MapMouseEvent) => {
    const features = map?.queryRenderedFeatures(e.point, {
      layers: ['clusters']
    });

    if (!features || features.length === 0) return;

    const clusterId = features[0].properties?.cluster_id;
    const sourceData = map?.getSource('parks') as mapboxgl.GeoJSONSource;

    if (sourceData && clusterId) {
      sourceData.getClusterLeaves(clusterId, 100, 0, (error, features) => {
        if (!error && features) {
          const bounds = new mapboxgl.LngLatBounds();
          features.forEach((feature) => {
            if (feature.geometry.type === 'Point') {
              bounds.extend(feature.geometry.coordinates as [number, number]);
            }
          });
          map?.fitBounds(bounds, { padding: 50 });
        }
      });
    }
  };

  // Handle individual park click
  const handleParkClick = (e: mapboxgl.MapMouseEvent) => {
    const features = map?.queryRenderedFeatures(e.point, {
      layers: ['unclustered-point', 'park-boundaries']
    });

    if (!features || features.length === 0) return;

    const parkFeature = features[0];
    const park: ParkProperties = parkFeature.properties as ParkProperties;

    onParkSelect(park);

    // Center map on selected park
    if (park.centroid) {
      map?.flyTo({
        center: park.centroid,
        zoom: 12,
        duration: 1000
      });
    }
  };

  // Update map style
  useEffect(() => {
    if (map) {
      map.setStyle(`mapbox://styles/mapbox/${mapStyle}-v11`);
    }
  }, [map, mapStyle]);

  // Update filters
  useEffect(() => {
    if (map && map.getSource('parks')) {
      updateMapFilters(map, filters);
    }
  }, [map, filters]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />

      {isLoading && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p>Loading map data...</p>
          </div>
        </div>
      )}
    </div>
  );
}
```

### 3. Map Control Panel

```typescript
// components/maps/MapControlPanel.tsx
interface MapControlPanelProps {
  filters: MapFilter;
  onFiltersChange: (filters: MapFilter) => void;
  onExportData: (format: 'json' | 'csv' | 'geojson') => void;
}

export function MapControlPanel({
  filters,
  onFiltersChange,
  onExportData
}: MapControlPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`absolute top-4 left-4 bg-white rounded-lg shadow-lg z-10 transition-all duration-300 ${
      isExpanded ? 'w-80' : 'w-12'
    }`}>
      <div className="flex items-center justify-between p-3 border-b">
        {isExpanded && (
          <h3 className="font-semibold text-sm">Filter & Layers</h3>
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

      {isExpanded && (
        <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
          {/* Province Filter */}
          <div>
            <Label className="text-sm font-medium">Provinsi</Label>
            <ProvinceMultiSelect
              value={filters.provinces}
              onChange={(provinces) => onFiltersChange({
                ...filters,
                provinces
              })}
            />
          </div>

          {/* Biodiversity Score Range */}
          <div>
            <Label className="text-sm font-medium">
              Skor Keanekaragaman: {filters.biodiversityRange[0]} - {filters.biodiversityRange[1]}
            </Label>
            <RangeSlider
              value={filters.biodiversityRange}
              onChange={(value) => onFiltersChange({
                ...filters,
                biodiversityRange: value as [number, number]
              })}
              min={0}
              max={100}
              step={5}
              className="mt-2"
            />
          </div>

          {/* Area Range */}
          <div>
            <Label className="text-sm font-medium">
              Luas Area (ha): {filters.areaRange[0]} - {filters.areaRange[1]}
            </Label>
            <RangeSlider
              value={filters.areaRange}
              onChange={(value) => onFiltersChange({
                ...filters,
                areaRange: value as [number, number]
              })}
              min={0}
              max={100000}
              step={1000}
              className="mt-2"
            />
          </div>

          {/* Status Filter */}
          <div>
            <Label className="text-sm font-medium">Status</Label>
            <div className="space-y-2 mt-2">
              {['DRAFT', 'PENDING', 'APPROVED', 'REJECTED'].map((status) => (
                <label key={status} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.status.includes(status)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        onFiltersChange({
                          ...filters,
                          status: [...filters.status, status]
                        });
                      } else {
                        onFiltersChange({
                          ...filters,
                          status: filters.status.filter(s => s !== status)
                        });
                      }
                    }}
                  />
                  <span className="text-sm">{status}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Content Filters */}
          <div>
            <Label className="text-sm font-medium">Konten</Label>
            <div className="space-y-2 mt-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.hasFlora}
                  onChange={(e) => onFiltersChange({
                    ...filters,
                    hasFlora: e.target.checked
                  })}
                />
                <span className="text-sm">Memiliki data flora</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.hasFauna}
                  onChange={(e) => onFiltersChange({
                    ...filters,
                    hasFauna: e.target.checked
                  })}
                />
                <span className="text-sm">Memiliki data fauna</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.hasActivities}
                  onChange={(e) => onFiltersChange({
                    ...filters,
                    hasActivities: e.target.checked
                  })}
                />
                <span className="text-sm">Memiliki aktivitas</span>
              </label>
            </div>
          </div>

          {/* Export Options */}
          <div className="pt-4 border-t">
            <Label className="text-sm font-medium">Export Data</Label>
            <div className="flex gap-2 mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onExportData('geojson')}
              >
                <Download className="h-3 w-3 mr-1" />
                GeoJSON
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onExportData('csv')}
              >
                <Download className="h-3 w-3 mr-1" />
                CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onExportData('json')}
              >
                <Download className="h-3 w-3 mr-1" />
                JSON
              </Button>
            </div>
          </div>

          {/* Reset Filters */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onFiltersChange({
              provinces: [],
              biodiversityRange: [0, 100],
              areaRange: [0, 100000],
              status: ['APPROVED'],
              hasFlora: false,
              hasFauna: false,
              hasActivities: false
            })}
            className="w-full"
          >
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
}
```

### 4. Park Detail Sidebar

```typescript
// components/maps/ParkDetailSidebar.tsx
interface ParkDetailSidebarProps {
  park: ParkProperties;
  onClose: () => void;
}

export function ParkDetailSidebar({ park, onClose }: ParkDetailSidebarProps) {
  const [parkDetails, setParkDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadParkDetails(park.id);
  }, [park.id]);

  const loadParkDetails = async (parkId: string) => {
    try {
      const response = await fetch(`/api/parks/${parkId}`);
      const data = await response.json();
      setParkDetails(data);
    } catch (error) {
      console.error('Error loading park details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-lg z-10 p-6">
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-lg z-10 overflow-y-auto">
      <div className="sticky top-0 bg-white border-b p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">
            {park.name}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-sm text-gray-600">
          {park.regency}, {park.province}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Park Image */}
        {parkDetails?.featuredImage && (
          <div className="relative h-48 rounded-lg overflow-hidden">
            <Image
              src={parkDetails.featuredImage}
              alt={park.name}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            title="Luas Area"
            value={`${park.area.toLocaleString('id-ID')} ha`}
            icon={MapPin}
            size="sm"
          />
          <StatCard
            title="Skor Biodiversitas"
            value={`${park.biodiversityScore || 0}/100`}
            icon={Leaf}
            size="sm"
          />
        </div>

        {/* Content Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Konten Tersedia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Data Flora</span>
                <Badge variant={park.totalFlora > 0 ? 'default' : 'secondary'}>
                  {park.totalFlora} spesies
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Data Fauna</span>
                <Badge variant={park.totalFauna > 0 ? 'default' : 'secondary'}>
                  {park.totalFauna} spesies
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Aktivitas</span>
                <Badge variant={park.totalActivities > 0 ? 'default' : 'secondary'}>
                  {park.totalActivities} kegiatan
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        {parkDetails?.description && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Deskripsi</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 line-clamp-4">
                {parkDetails.description}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Recent Updates */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Update Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Update terakhir</span>
                <span>{formatDate(park.lastUpdated)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Dibuat</span>
                <span>{formatDate(park.createdAt)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="space-y-3">
          <Button asChild className="w-full">
            <Link href={`/taman/${park.slug}`}>
              <Eye className="h-4 w-4 mr-2" />
              Lihat Detail Lengkap
            </Link>
          </Button>

          {parkDetails?.geometry && (
            <Button variant="outline" className="w-full">
              <Map className="h-4 w-4 mr-2" />
              Tampilkan di Google Maps
            </Button>
          )}

          <Button variant="outline" className="w-full">
            <Share2 className="h-4 w-4 mr-2" />
            Bagikan
          </Button>
        </div>
      </div>
    </div>
  );
}
```

### 5. Map Legend

```typescript
// components/maps/MapLegend.tsx
export function MapLegend() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h3 className="font-semibold text-sm mb-3">Legenda</h3>

      {/* Status Colors */}
      <div className="space-y-2 mb-4">
        <h4 className="text-xs font-medium text-gray-600">Status</h4>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded-full"></div>
          <span className="text-xs">Disetujui</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
          <span className="text-xs">Menunggu Review</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded-full"></div>
          <span className="text-xs">Draft/Ditolak</span>
        </div>
      </div>

      {/* Biodiversity Score */}
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-gray-600">Skor Biodiversitas</h4>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-200 rounded"></div>
            <span className="text-xs">0-25 (Rendah)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-200 rounded"></div>
            <span className="text-xs">26-50 (Sedang)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-200 rounded"></div>
            <span className="text-xs">51-75 (Tinggi)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-xs">76-100 (Sangat Tinggi)</span>
          </div>
        </div>
      </div>

      {/* Cluster Info */}
      <div className="mt-4 pt-4 border-t">
        <h4 className="text-xs font-medium text-gray-600 mb-2">Cluster</h4>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
            <span className="text-xs">1-20 taman</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-yellow-400 rounded-full"></div>
            <span className="text-xs">21-50 taman</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-pink-400 rounded-full"></div>
            <span className="text-xs">50+ taman</span>
          </div>
        </div>
      </div>
    </div>
  );
}
```

## API Endpoints

```typescript
// app/api/geo/parks/route.ts
export async function POST(request: Request) {
  const body = await request.json() as { filters: MapFilter };

  try {
    // Build dynamic query based on filters
    let query = `
      SELECT
        id,
        slug,
        name,
        province,
        regency,
        area,
        status,
        created_at,
        updated_at,
        COALESCE(biodiversity_score, 0) as biodiversity_score,
        total_flora,
        total_fauna,
        total_activities,
        ST_Centroid(geom) as centroid,
        ST_AsGeoJSON(geom) as geometry
      FROM parks
      WHERE 1=1
    `;

    const queryParams: any[] = [];
    let paramIndex = 1;

    // Apply filters
    if (body.filters.provinces.length > 0) {
      query += ` AND province = ANY($${paramIndex})`;
      queryParams.push(body.filters.provinces);
      paramIndex++;
    }

    if (body.filters.status.length > 0) {
      query += ` AND status = ANY($${paramIndex})`;
      queryParams.push(body.filters.status);
      paramIndex++;
    }

    if (body.filters.biodiversityRange[0] > 0 || body.filters.biodiversityRange[1] < 100) {
      query += ` AND COALESCE(biodiversity_score, 0) BETWEEN $${paramIndex} AND $${paramIndex + 1}`;
      queryParams.push(body.filters.biodiversityRange[0], body.filters.biodiversityRange[1]);
      paramIndex += 2;
    }

    if (body.filters.areaRange[0] > 0 || body.filters.areaRange[1] < 100000) {
      query += ` AND area BETWEEN $${paramIndex} AND $${paramIndex + 1}`;
      queryParams.push(body.filters.areaRange[0], body.filters.areaRange[1]);
      paramIndex += 2;
    }

    if (body.filters.hasFlora) {
      query += ` AND total_flora > 0`;
    }

    if (body.filters.hasFauna) {
      query += ` AND total_fauna > 0`;
    }

    if (body.filters.hasActivities) {
      query += ` AND total_activities > 0`;
    }

    // Execute query
    const result = await db.execute(query);

    // Transform to GeoJSON
    const features = result.rows.map(row => ({
      type: 'Feature',
      id: row.id,
      geometry: JSON.parse(row.geometry),
      properties: {
        id: row.id,
        name: row.name,
        slug: row.slug,
        province: row.province,
        regency: row.regency,
        area: parseFloat(row.area),
        biodiversityScore: parseFloat(row.biodiversity_score),
        status: row.status,
        createdAt: row.created_at,
        lastUpdated: row.updated_at,
        totalFlora: parseInt(row.total_flora),
        totalFauna: parseInt(row.total_fauna),
        totalActivities: parseInt(row.total_activities),
        centroid: JSON.parse(row.centroid).coordinates,
        fillColor: getFillColor(row.biodiversity_score, row.status),
        strokeColor: '#ffffff',
        fillOpacity: 0.7,
        strokeOpacity: 1
      }
    }));

    const geoJson = {
      type: 'FeatureCollection',
      features
    };

    return Response.json(geoJson);

  } catch (error) {
    console.error('Error fetching parks geo data:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

// app/api/geo/export/[format]/route.ts
export async function GET(
  request: Request,
  { params }: { params: { format: string } }
) {
  const { searchParams } = new URL(request.url);
  const filters = JSON.parse(searchParams.get('filters') || '{}');

  try {
    const query = buildExportQuery(filters);
    const result = await db.execute(query);

    switch (params.format) {
      case 'geojson':
        return exportGeoJSON(result.rows);
      case 'csv':
        return exportCSV(result.rows);
      case 'json':
        return exportJSON(result.rows);
      default:
        return new Response('Unsupported format', { status: 400 });
    }
  } catch (error) {
    console.error('Error exporting data:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
```

## Database Schema (PostGIS Extensions)

```sql
-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Update parks table with PostGIS geometry
ALTER TABLE parks ADD COLUMN IF NOT EXISTS geom geometry(MultiPolygon, 4326);
ALTER TABLE parks ADD COLUMN IF NOT EXISTS centroid geometry(Point, 4326);

-- Create spatial indexes
CREATE INDEX IF NOT EXISTS idx_parks_geom ON parks USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_parks_centroid ON parks USING GIST (centroid);
CREATE INDEX IF NOT EXISTS idx_parks_province_geom ON parks (province, geom);

-- Function to calculate centroid from geometry
CREATE OR REPLACE FUNCTION update_park_centroid()
RETURNS TRIGGER AS $$
BEGIN
  NEW.centroid = ST_Centroid(NEW.geom);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update centroid
CREATE TRIGGER trg_update_park_centroid
  BEFORE INSERT OR UPDATE ON parks
  FOR EACH ROW
  EXECUTE FUNCTION update_park_centroid();

-- Function to calculate biodiversity index for a park
CREATE OR REPLACE FUNCTION calculate_park_biodiversity_score(park_id UUID)
RETURNS NUMERIC AS $$
DECLARE
  flora_score NUMERIC;
  fauna_score NUMERIC;
  ecosystem_score NUMERIC;
  total_score NUMERIC;
BEGIN
  -- Calculate flora diversity score (simplified)
  SELECT
    CASE
      WHEN COUNT(*) = 0 THEN 0
      WHEN COUNT(*) < 10 THEN 25
      WHEN COUNT(*) < 50 THEN 50
      WHEN COUNT(*) < 100 THEN 75
      ELSE 100
    END
  INTO flora_score
  FROM flora WHERE park_id = park_id AND status = 'APPROVED';

  -- Calculate fauna diversity score
  SELECT
    CASE
      WHEN COUNT(*) = 0 THEN 0
      WHEN COUNT(*) < 10 THEN 25
      WHEN COUNT(*) < 50 THEN 50
      WHEN COUNT(*) < 100 THEN 75
      ELSE 100
    END
  INTO fauna_score
  FROM fauna WHERE park_id = park_id AND status = 'APPROVED';

  -- Calculate ecosystem score (based on area and ecosystem types)
  SELECT
    CASE
      WHEN area < 1000 THEN 25
      WHEN area < 10000 THEN 50
      WHEN area < 50000 THEN 75
      ELSE 100
    END
  INTO ecosystem_score
  FROM parks WHERE id = park_id;

  -- Calculate total score (weighted average)
  total_score = (flora_score * 0.4 + fauna_score * 0.4 + ecosystem_score * 0.2);

  -- Update the park with the calculated score
  UPDATE parks
  SET biodiversity_score = total_score,
      updated_at = NOW()
  WHERE id = park_id;

  RETURN total_score;
END;
$$ LANGUAGE plpgsql;

-- Function to get parks within bounding box
CREATE OR REPLACE FUNCTION get_parks_in_bbox(
  min_lng NUMERIC,
  min_lat NUMERIC,
  max_lng NUMERIC,
  max_lat NUMERIC,
  filter_status TEXT DEFAULT 'APPROVED'
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  province TEXT,
  biodiversity_score NUMERIC,
  geom GEOMETRY
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.name,
    p.province,
    p.biodiversity_score,
    p.geom
  FROM parks p
  WHERE p.status = filter_status
    AND p.geom && ST_MakeEnvelope(min_lng, min_lat, max_lng, max_lat, 4326)
  ORDER BY p.biodiversity_score DESC NULLS LAST;
END;
$$ LANGUAGE plpgsql;

-- Function to get nearby parks within radius
CREATE OR REPLACE FUNCTION get_nearby_parks(
  center_lng NUMERIC,
  center_lat NUMERIC,
  radius_km INTEGER DEFAULT 50
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  distance_km NUMERIC,
  biodiversity_score NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.name,
    ST_Distance(
      p.centroid::geography,
      ST_MakePoint(center_lng, center_lat)::geography
    ) / 1000 as distance_km,
    p.biodiversity_score
  FROM parks p
  WHERE p.status = 'APPROVED'
    AND ST_DWithin(
      p.centroid::geography,
      ST_MakePoint(center_lng, center_lat)::geography,
      radius_km * 1000
    )
  ORDER BY distance_km;
END;
$$ LANGUAGE plpgsql;
```

## Features untuk MVP

- ✅ Interactive map with clustering
- ✅ PostGIS integration for spatial queries
- ✅ Province filtering
- ✅ Biodiversity score visualization
- ✅ Park detail popups
- ✅ Search functionality
- ✅ Data export (GeoJSON, CSV, JSON)
- ✅ Map legends and controls
- ✅ Responsive design
- ❌ Real-time updates (Phase 2)
- ❌ Heatmap visualization (Phase 2)
- ❌ Drawing tools (Phase 2)
- ❌ Route planning (Phase 2)
- ❌ Offline maps (Phase 2)

## Performance Optimizations

- **Spatial Indexing**: GIST indexes for geometry fields
- **Clustering**: Client-side clustering for performance
- **Viewport-based Loading**: Load only visible data
- **Caching**: Redis cache for frequently accessed data
- **Compression**: Gzip compression for API responses
- **CDN**: Content delivery for static assets

## Security & Validation

- **Input Sanitization**: Validate all spatial inputs
- **Access Control**: Role-based data access
- **Rate Limiting**: Prevent abuse of API endpoints
- **Data Validation**: Validate geometries and bounds
- **SQL Injection Prevention**: Use parameterized queries