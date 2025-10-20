import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Leaf, Zap, MapPin } from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";

interface BiodiversityOverviewProps {
  summary?: {
    totalParks: number;
    averageScore: number;
    totalFloraSpecies: number;
    totalFaunaSpecies: number;
    totalAssessments: number;
    recentTrend: 'up' | 'down' | 'stable';
  };
}

export function BiodiversityOverview({ summary }: BiodiversityOverviewProps) {
  // Mock data for now - this would come from API
  const mockSummary = {
    totalParks: 54,
    averageScore: 67.5,
    totalFloraSpecies: 2847,
    totalFaunaSpecies: 1234,
    totalAssessments: 48,
    recentTrend: 'up' as const
  };

  const data = summary || mockSummary;

  const statCards = [
    {
      title: "Skor Rata-rata Nasional",
      value: `${data.averageScore}/100`,
      unit: "",
      icon: TrendingUp,
      color: "bg-green-500",
      description: "Rata-rata indeks keanekaragaman hayati seluruh taman",
      trend: data.recentTrend
    },
    {
      title: "Total Spesies Flora",
      value: formatNumber(data.totalFloraSpecies),
      unit: "spesies",
      icon: Leaf,
      color: "bg-green-600",
      description: "Jumlah total spesies tumbuhan yang tercatat"
    },
    {
      title: "Total Spesies Fauna",
      value: formatNumber(data.totalFaunaSpecies),
      unit: "spesies",
      icon: Zap,
      color: "bg-blue-600",
      description: "Jumlah total spesies hewan yang tercatat"
    },
    {
      title: "Taman Terdaftar",
      value: formatNumber(data.totalParks),
      unit: "taman",
      icon: MapPin,
      color: "bg-purple-600",
      description: "Jumlah Taman Kehati dalam database"
    }
  ];

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      case 'stable': return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return '↗';
      case 'down': return '↘';
      case 'stable': return '→';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={cn("p-2 rounded-full", stat.color, "text-white")}>
                <Icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-2xl font-bold">
                    {stat.value}
                    {stat.unit && (
                      <span className="text-sm font-normal text-gray-500 ml-1">
                        {stat.unit}
                      </span>
                    )}
                  </div>
                  {stat.trend && (
                    <div className={cn("text-sm mt-1", getTrendColor(stat.trend))}>
                      <span className="mr-1">{getTrendIcon(stat.trend)}</span>
                      {stat.trend === 'up' ? 'Meningkat' :
                       stat.trend === 'down' ? 'Menurun' : 'Stabil'}
                    </div>
                  )}
                </div>
                {index === 0 && (
                  <Badge
                    variant="outline"
                    className={cn(
                      "ml-2",
                      data.averageScore >= 70 ? "border-green-500 text-green-700" :
                      data.averageScore >= 50 ? "border-yellow-500 text-yellow-700" :
                      "border-red-500 text-red-700"
                    )}
                  >
                    {data.averageScore >= 70 ? 'Baik' :
                     data.averageScore >= 50 ? 'Sedang' : 'Perlu Perhatian'}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}