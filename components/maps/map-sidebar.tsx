"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { MapLocation } from "./enhanced-map-page";
import {
  MapPin,
  TreePine,
  Users,
  Calendar,
  Eye,
  Share2,
  Navigation,
  Thermometer,
  Droplets,
  Wind,
  Info,
  X,
  ExternalLink,
  Heart,
  BookmarkPlus
} from "lucide-react";

interface MapSidebarProps {
  selectedLocation: MapLocation | null;
  onClose: () => void;
}

export function MapSidebar({ selectedLocation, onClose }: MapSidebarProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  if (!selectedLocation) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-gray-500">
          <MapPin className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-sm">
            Pilih lokasi pada peta untuk melihat detail informasi
          </p>
        </CardContent>
      </Card>
    );
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      park: "Taman Nasional",
      flora: "Flora",
      fauna: "Fauna",
      activity: "Aktivitas Konservasi"
    };
    return labels[type] || type;
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      park: "🏞️",
      flora: "🌿",
      fauna: "🦎",
      activity: "🔬"
    };
    return icons[type] || "📍";
  };

  const getConservationStatusColor = (status?: string) => {
    switch (status) {
      case 'CRITICAL': return 'bg-red-100 text-red-800';
      case 'VULNERABLE': return 'bg-orange-100 text-orange-800';
      case 'GOOD': return 'bg-green-100 text-green-800';
      case 'MONITORED': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConservationStatusLabel = (status?: string) => {
    switch (status) {
      case 'CRITICAL': return 'Kritis';
      case 'VULNERABLE': return 'Rentan';
      case 'GOOD': return 'Baik';
      case 'MONITORED': return 'Dipantau';
      default: return status || 'Tidak Diketahui';
    }
  };

  const handleNavigate = () => {
    if (selectedLocation.coordinates) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${selectedLocation.coordinates[0]},${selectedLocation.coordinates[1]}`;
      window.open(url, '_blank');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: selectedLocation.name,
          text: selectedLocation.description,
          url: window.location.href
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <span className="text-lg">{getTypeIcon(selectedLocation.type)}</span>
            <div>
              <CardTitle className="text-lg leading-tight">
                {selectedLocation.name}
              </CardTitle>
              <p className="text-sm text-gray-600">
                {getTypeLabel(selectedLocation.type)}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-1 h-6 w-6"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Status Badges */}
        <div className="flex flex-wrap gap-2">
          <Badge className={getConservationStatusColor(selectedLocation.conservationStatus)}>
            {getConservationStatusLabel(selectedLocation.conservationStatus)}
          </Badge>
          {selectedLocation.region && (
            <Badge variant="outline">
              📍 {selectedLocation.region}
            </Badge>
          )}
          {selectedLocation.biodiversityIndex && (
            <Badge variant="secondary">
              🌿 Indeks: {selectedLocation.biodiversityIndex}
            </Badge>
          )}
        </div>

        {/* Description */}
        {selectedLocation.description && (
          <p className="text-sm text-gray-700 leading-relaxed">
            {selectedLocation.description}
          </p>
        )}

        <Separator />

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          {selectedLocation.areaSize && (
            <div className="flex items-center gap-2">
              <TreePine className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-gray-500 text-xs">Luas Area</p>
                <p className="font-medium">
                  {selectedLocation.areaSize.toLocaleString('id-ID')} ha
                </p>
              </div>
            </div>
          )}

          {selectedLocation.elevation && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-600" />
              <div>
                <p className="text-gray-500 text-xs">Ketinggian</p>
                <p className="font-medium">{selectedLocation.elevation.toLocaleString('id-ID')} m</p>
              </div>
            </div>
          )}

          {selectedLocation.biodiversityIndex && (
            <div className="flex items-center gap-2">
              <TreePine className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-gray-500 text-xs">Indeks Keanekaragaman</p>
                <p className="font-medium">{selectedLocation.biodiversityIndex}/100</p>
              </div>
            </div>
          )}

          {selectedLocation.lastUpdated && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-gray-500 text-xs">Update Terakhir</p>
                <p className="font-medium text-xs">
                  {selectedLocation.lastUpdated.toLocaleDateString('id-ID')}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Climate Data */}
        {selectedLocation.climateData && (
          <>
            <Separator />
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Thermometer className="w-4 h-4" />
                Data Iklim
              </h4>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="text-center p-2 bg-orange-50 rounded">
                  <Thermometer className="w-4 h-4 text-orange-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">Suhu</p>
                  <p className="font-medium">{selectedLocation.climateData.temperature}°C</p>
                </div>
                <div className="text-center p-2 bg-blue-50 rounded">
                  <Droplets className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">Kelembaban</p>
                  <p className="font-medium">{selectedLocation.climateData.humidity}%</p>
                </div>
                <div className="text-center p-2 bg-cyan-50 rounded">
                  <Wind className="w-4 h-4 text-cyan-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">Curah Hujan</p>
                  <p className="font-medium">{selectedLocation.climateData.rainfall}mm</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Species */}
        {selectedLocation.species && selectedLocation.species.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Spesies Terwakili
              </h4>
              <div className="flex flex-wrap gap-1">
                {selectedLocation.species.map((species, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-xs"
                  >
                    {species}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Coordinates */}
        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
          <strong>Koordinat:</strong> {selectedLocation.coordinates[0].toFixed(4)}, {selectedLocation.coordinates[1].toFixed(4)}
        </div>

        <Separator />

        {/* Action Buttons */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <Button
              size="sm"
              className="flex-1"
              onClick={handleNavigate}
            >
              <Navigation className="w-4 h-4 mr-2" />
              Petunjuk Arah
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className={`flex-1 ${isLiked ? 'text-red-600 border-red-300' : ''}`}
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
              {isLiked ? 'Disukai' : 'Sukai'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`flex-1 ${isBookmarked ? 'text-green-600 border-green-300' : ''}`}
              onClick={() => setIsBookmarked(!isBookmarked)}
            >
              <BookmarkPlus className={`w-4 h-4 mr-2 ${isBookmarked ? 'fill-current' : ''}`} />
              {isBookmarked ? 'Tersimpan' : 'Simpan'}
            </Button>
          </div>
        </div>

        {/* External Links */}
        <div className="pt-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs text-gray-600 hover:text-blue-600"
          >
            <ExternalLink className="w-3 h-3 mr-2" />
            Lihat Informasi Lebih Lanjut
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}