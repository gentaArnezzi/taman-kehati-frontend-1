"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Eye, Info } from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";
import { ParkProperties } from "@/lib/types";

interface ProvinceData {
  code: string;
  name: string;
  parks: ParkProperties[];
  averageScore: number;
  totalParks: number;
}

export function NationalMap() {
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);
  const [provinceData, setProvinceData] = useState<ProvinceData[]>([]);

  // Mock data for provinces - in real implementation, this would come from API
  const mockProvinceData: ProvinceData[] = [
    {
      code: "ID-AC",
      name: "Aceh",
      parks: [],
      averageScore: 72.5,
      totalParks: 3
    },
    {
      code: "ID-BA",
      name: "Bali",
      parks: [],
      averageScore: 85.2,
      totalParks: 2
    },
    {
      code: "ID-JB",
      name: "Jawa Barat",
      parks: [],
      averageScore: 68.8,
      totalParks: 8
    },
    {
      code: "ID-JT",
      name: "Jawa Tengah",
      parks: [],
      averageScore: 71.3,
      totalParks: 6
    },
    {
      code: "ID-JI",
      name: "Jawa Timur",
      parks: [],
      averageScore: 76.4,
      totalParks: 7
    },
    {
      code: "ID-KB",
      name: "Kalimantan Barat",
      parks: [],
      averageScore: 82.1,
      totalParks: 4
    },
    {
      code: "ID-KT",
      name: "Kalimantan Tengah",
      parks: [],
      averageScore: 79.6,
      totalParks: 5
    },
    {
      code: "ID-KS",
      name: "Kalimantan Selatan",
      parks: [],
      averageScore: 74.3,
      totalParks: 3
    },
    {
      code: "ID-KU",
      name: "Kalimantan Utara",
      parks: [],
      averageScore: 88.7,
      totalParks: 2
    },
    {
      code: "ID-PB",
      name: "Papua Barat",
      parks: [],
      averageScore: 91.2,
      totalParks: 3
    },
    {
      code: "ID-PA",
      name: "Papua",
      parks: [],
      averageScore: 89.5,
      totalParks: 4
    },
    {
      code: "ID-IR",
      name: "Papua Irain",
      parks: [],
      averageScore: 92.3,
      totalParks: 2
    }
  ];

  useEffect(() => {
    setProvinceData(mockProvinceData);
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    if (score >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  const getScoreTextColor = (score: number) => {
    if (score >= 80) return "text-green-700";
    if (score >= 60) return "text-yellow-700";
    if (score >= 40) return "text-orange-700";
    return "text-red-700";
  };

  const selectedProvinceData = provinceData.find(p => p.code === selectedProvince);

  // Simplified Indonesia map SVG paths - in real implementation, use proper geojson
  const indonesiaProvinces = [
    { id: "ID-AC", name: "Aceh", path: "M 100 50 L 200 50 L 200 100 L 100 100 Z", x: 120, y: 80 },
    { id: "ID-BA", name: "Bali", path: "M 300 200 L 350 200 L 350 250 L 300 250 Z", x: 325, y: 225 },
    { id: "ID-JB", name: "Jawa Barat", path: "M 250 180 L 300 180 L 300 230 L 250 230 Z", x: 275, y: 205 },
    { id: "ID-JT", name: "Jawa Tengah", path: "M 300 200 L 350 200 L 350 250 L 300 250 Z", x: 325, y: 225 },
    { id: "ID-JI", name: "Jawa Timur", path: "M 350 210 L 400 210 L 400 260 L 350 260 Z", x: 375, y: 235 },
    { id: "ID-KB", name: "Kalimantan Barat", path: "M 150 250 L 200 250 L 200 300 L 150 300 Z", x: 175, y: 275 },
    { id: "ID-KT", name: "Kalimantan Tengah", path: "M 200 250 L 250 250 L 250 300 L 200 300 Z", x: 225, y: 275 },
    { id: "ID-KS", name: "Kalimantan Selatan", path: "M 200 300 L 250 300 L 250 350 L 200 350 Z", x: 225, y: 325 },
    { id: "ID-KU", name: "Kalimantan Utara", path: "M 150 200 L 200 200 L 200 250 L 150 250 Z", x: 175, y: 225 },
    { id: "ID-PB", name: "Papua Barat", path: "M 500 300 L 550 300 L 550 400 L 500 400 Z", x: 525, y: 350 },
    { id: "ID-PA", name: "Papua", path: "M 550 300 L 650 300 L 650 400 L 550 400 Z", x: 600, y: 350 },
    { id: "ID-IR", name: "Papua Irain", path: "M 650 320 L 700 320 L 700 380 L 650 380 Z", x: 675, y: 350 }
  ];

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Peta Sebaran Indeks Keanekaragaman Hayati
        </CardTitle>
        <p className="text-sm text-gray-600">
          Klik pada provinsi untuk melihat detail Taman Kehati dan indeks keanekaragaman hayati
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <div className="relative bg-gray-50 rounded-lg p-4" style={{ minHeight: "400px" }}>
              <svg
                viewBox="0 0 800 500"
                className="w-full h-full"
                style={{ maxHeight: "500px" }}
              >
                {/* Map background */}
                <rect width="800" height="500" fill="#f0f9ff" />

                {/* Indonesia provinces */}
                {indonesiaProvinces.map((province) => {
                  const data = provinceData.find(p => p.code === province.id);
                  const score = data?.averageScore || 0;
                  const isSelected = selectedProvince === province.id;
                  const isHovered = hoveredProvince === province.id;

                  return (
                    <g key={province.id}>
                      <path
                        d={province.path}
                        fill={isSelected ? data ? getScoreColor(score) : "#e5e7eb" :
                              isHovered ? data ? getScoreColor(score) : "#d1d5db" :
                              data ? getScoreColor(score) : "#e5e7eb"}
                        stroke="#ffffff"
                        strokeWidth="2"
                        className={cn(
                          "cursor-pointer transition-all duration-200",
                          isSelected && "stroke-width-3",
                          isHovered && "opacity-80"
                        )}
                        onClick={() => setSelectedProvince(isSelected ? null : province.id)}
                        onMouseEnter={() => setHoveredProvince(province.id)}
                        onMouseLeave={() => setHoveredProvince(null)}
                      />

                      {/* Province label */}
                      {data && (
                        <text
                          x={province.x}
                          y={province.y}
                          textAnchor="middle"
                          className="text-xs font-medium fill-white pointer-events-none"
                        >
                          {data.name}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* Map Legend */}
              <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-md">
                <h4 className="text-xs font-semibold mb-2">Legenda Skor</h4>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span className="text-xs">80-100 (Sangat Baik)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                    <span className="text-xs">60-79 (Baik)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-500 rounded"></div>
                    <span className="text-xs">40-59 (Cukup)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span className="text-xs">0-39 (Kurang)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Details Panel */}
          <div className="space-y-4">
            {selectedProvinceData ? (
              <ProvinceDetails
                province={selectedProvinceData}
                onClear={() => setSelectedProvince(null)}
              />
            ) : (
              <div className="text-center py-8 text-gray-500">
                <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">
                  Klik pada provinsi untuk melihat detail
                </p>
              </div>
            )}

            {/* Summary Stats */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-semibold mb-3">Statistik Nasional</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Provinsi</span>
                  <span className="font-medium">{provinceData.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Skor Tertinggi</span>
                  <span className={cn("font-medium", getScoreTextColor(Math.max(...provinceData.map(p => p.averageScore))))}>
                    {Math.max(...provinceData.map(p => p.averageScore)).toFixed(1)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Skor Terendah</span>
                  <span className={cn("font-medium", getScoreTextColor(Math.min(...provinceData.map(p => p.averageScore))))}>
                    {Math.min(...provinceData.map(p => p.averageScore)).toFixed(1)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Rata-rata</span>
                  <span className="font-medium">
                    {(provinceData.reduce((sum, p) => sum + p.averageScore, 0) / provinceData.length).toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface ProvinceDetailsProps {
  province: ProvinceData;
  onClear: () => void;
}

function ProvinceDetails({ province, onClear }: ProvinceDetailsProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    if (score >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  const getScoreTextColor = (score: number) => {
    if (score >= 80) return "text-green-700";
    if (score >= 60) return "text-yellow-700";
    if (score >= 40) return "text-orange-700";
    return "text-red-700";
  };

  return (
    <div className="bg-white border rounded-lg p-4">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-semibold text-lg">{province.name}</h3>
        <Button variant="ghost" size="sm" onClick={onClear}>
          ×
        </Button>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Skor Rata-rata</span>
          <div className="flex items-center gap-2">
            <Badge
              className={cn(getScoreTextColor(province.averageScore))}
              variant="outline"
            >
              {province.averageScore.toFixed(1)}/100
            </Badge>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Total Taman</span>
          <span className="font-medium">{formatNumber(province.totalParks)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Status Kesehatan</span>
          <Badge
            className={cn(
              province.averageScore >= 70 ? "bg-green-100 text-green-800" :
              province.averageScore >= 50 ? "bg-yellow-100 text-yellow-800" :
              "bg-red-100 text-red-800"
            )}
          >
            {province.averageScore >= 70 ? 'Baik' :
             province.averageScore >= 50 ? 'Sedang' : 'Perlu Perhatian'}
          </Badge>
        </div>

        <div className="pt-3 border-t">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={cn("h-2 rounded-full", getScoreColor(province.averageScore))}
              style={{ width: `${province.averageScore}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Indeks Keanekaragaman Hayati
          </p>
        </div>

        <div className="flex gap-2 pt-2">
          <Button size="sm" className="flex-1">
            <Eye className="h-3 w-3 mr-1" />
            Lihat Detail
          </Button>
          <Button size="sm" variant="outline">
            <Info className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}