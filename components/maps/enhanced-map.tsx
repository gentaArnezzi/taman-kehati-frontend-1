"use client";

import { useEffect, useRef, useState } from "react";
import { MapLocation } from "./enhanced-map-page";

interface EnhancedMapProps {
  locations: MapLocation[];
  selectedLocation: MapLocation | null;
  onLocationClick: (location: MapLocation) => void;
  userLocation: [number, number] | null;
  mapStyle: 'streets' | 'satellite' | 'terrain';
  showLayers: boolean;
  onBoundsChange: (bounds: any) => void;
}

export function EnhancedMap({
  locations,
  selectedLocation,
  onLocationClick,
  userLocation,
  mapStyle,
  showLayers,
  onBoundsChange
}: EnhancedMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);

  // Initialize map (simplified version - in production, you'd use Leaflet or Mapbox)
  useEffect(() => {
    if (!mapRef.current || mapInstance) return;

    // Mock map initialization
    setIsMapLoaded(true);

    return () => {
      // Cleanup map instance
      if (mapInstance) {
        // mapInstance.remove();
      }
    };
  }, [mapInstance]);

  // Handle location clicks
  const handleLocationClick = (location: MapLocation) => {
    onLocationClick(location);
  };

  const getLocationColor = (location: MapLocation) => {
    switch (location.type) {
      case 'park':
        return location.conservationStatus === 'CRITICAL' ? '#dc2626' :
               location.conservationStatus === 'VULNERABLE' ? '#f59e0b' :
               location.conservationStatus === 'GOOD' ? '#10b981' : '#6b7280';
      case 'flora':
        return '#22c55e';
      case 'fauna':
        return '#f97316';
      case 'activity':
        return '#8b5cf6';
      default:
        return '#6b7280';
    }
  };

  const getLocationIcon = (location: MapLocation) => {
    switch (location.type) {
      case 'park':
        return '🏞️';
      case 'flora':
        return '🌿';
      case 'fauna':
        return '🦎';
      case 'activity':
        return '🔬';
      default:
        return '📍';
    }
  };

  const getMapBackground = () => {
    switch (mapStyle) {
      case 'satellite':
        return 'bg-gradient-to-br from-green-900 via-green-800 to-green-900';
      case 'terrain':
        return 'bg-gradient-to-br from-green-700 via-green-600 to-green-700';
      default:
        return 'bg-gradient-to-br from-green-100 via-blue-100 to-green-100';
    }
  };

  // Calculate position for locations (simplified positioning)
  const getLocationPosition = (location: MapLocation) => {
    // Convert lat/lng to x/y percentage for display
    const x = ((location.coordinates[1] + 180) / 360) * 100;
    const y = ((90 - location.coordinates[0]) / 180) * 100;
    return { x, y };
  };

  return (
    <div className="relative w-full h-full overflow-hidden rounded-lg">
      {/* Map Container */}
      <div
        ref={mapRef}
        className={`absolute inset-0 ${getMapBackground()} transition-colors duration-500`}
      >
        {/* Grid overlay for terrain view */}
        {mapStyle === 'terrain' && (
          <div className="absolute inset-0 opacity-20">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={`h-${i}`}
                className="absolute w-full border-t border-green-900"
                style={{ top: `${i * 10}%` }}
              />
            ))}
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={`v-${i}`}
                className="absolute h-full border-l border-green-900"
                style={{ left: `${i * 10}%` }}
              />
            ))}
          </div>
        )}

        {/* Location Markers */}
        {locations.map((location) => {
          const position = getLocationPosition(location);
          const isSelected = selectedLocation?.id === location.id;
          const isHovered = hoveredLocation === location.id;

          return (
            <div
              key={location.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 cursor-pointer ${
                isSelected ? 'z-20' : 'z-10'
              }`}
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
              }}
              onClick={() => handleLocationClick(location)}
              onMouseEnter={() => setHoveredLocation(location.id)}
              onMouseLeave={() => setHoveredLocation(null)}
            >
              {/* Marker */}
              <div
                className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 border-white shadow-lg transition-transform ${
                  isSelected ? 'scale-125 ring-4 ring-blue-400 ring-opacity-50' : ''
                } ${isHovered ? 'scale-110' : ''}`}
                style={{ backgroundColor: getLocationColor(location) }}
              >
                <span className="text-sm">{getLocationIcon(location)}</span>

                {/* Pulse animation for critical conservation status */}
                {location.conservationStatus === 'CRITICAL' && (
                  <div className="absolute inset-0 rounded-full animate-ping opacity-75"
                    style={{ backgroundColor: getLocationColor(location) }}
                  />
                )}
              </div>

              {/* Location tooltip */}
              {(isHovered || isSelected) && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap">
                  <div className="font-semibold">{location.name}</div>
                  <div className="text-gray-300">
                    {location.type === 'park' ? 'Taman Nasional' :
                     location.type === 'flora' ? 'Flora' :
                     location.type === 'fauna' ? 'Fauna' : 'Aktivitas'}
                  </div>
                  {location.biodiversityIndex && (
                    <div className="text-green-400">
                      Indeks: {location.biodiversityIndex}
                    </div>
                  )}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
                </div>
              )}
            </div>
          );
        })}

        {/* User Location */}
        {userLocation && (
          <div className="absolute transform -translate-x-1/2 -translate-y-1/2 z-15"
            style={{
              left: `${((userLocation[1] + 180) / 360) * 100}%`,
              top: `${((90 - userLocation[0]) / 180) * 100}%`,
            }}
          >
            <div className="relative">
              <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg" />
              <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75" />
            </div>
          </div>
        )}

        {/* Layers Panel */}
        {showLayers && (
          <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 w-64 z-30">
            <h3 className="font-semibold text-gray-900 mb-3">Layers</h3>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-sm">Taman Nasional</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-sm">Flora & Fauna</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-sm">Aktivitas Konservasi</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-sm">Status Konservasi</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Batas Administratif</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Data Iklim</span>
              </label>
            </div>
          </div>
        )}

        {/* Map Controls */}
        <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-2 space-y-2 z-30">
          <button className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <button className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <button className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5h-4m4 0v-4m0 4l-5-5" />
            </svg>
          </button>
        </div>

        {/* Loading State */}
        {!isMapLoaded && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Memuat peta...</p>
            </div>
          </div>
        )}

        {/* No Data State */}
        {isMapLoaded && locations.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center bg-white/90 backdrop-blur-sm rounded-lg p-8">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Tidak Ada Lokasi</h3>
              <p className="text-gray-600 max-w-md">
                Tidak ada lokasi yang ditemukan dengan filter yang dipilih. Coba ubah filter atau pencarian Anda.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}