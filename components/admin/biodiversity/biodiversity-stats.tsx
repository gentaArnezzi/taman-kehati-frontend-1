import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { TrendingUp, Leaf, Zap, Trees, Calendar, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { formatNumber } from "~/lib/utils";

export function BiodiversityStats() {
  // Mock stats data
  const stats = {
    totalAssessments: 48,
    approvedAssessments: 32,
    pendingAssessments: 8,
    draftAssessments: 5,
    rejectedAssessments: 3,
    averageScore: 74.2,
    highestScore: 92.3,
    lowestScore: 45.6,
    totalParksAssessed: 38,
    totalParksRemaining: 16,
    thisMonthAssessments: 12,
    lastUpdated: new Date("2024-03-15")
  };

  const statCards = [
    {
      title: "Total Penilaian",
      value: formatNumber(stats.totalAssessments),
      icon: Calendar,
      color: "bg-blue-500",
      description: "Total data penilaian yang telah dibuat"
    },
    {
      title: "Skor Rata-rata",
      value: `${stats.averageScore}/100`,
      icon: TrendingUp,
      color: "bg-green-500",
      description: "Rata-rata indeks keanekaragaman hayati",
      badge: stats.averageScore >= 70 ? "Baik" : stats.averageScore >= 50 ? "Sedang" : "Perlu Perhatian"
    },
    {
      title: "Taman Ternilai",
      value: `${stats.totalParksAssessed}/${stats.totalParksAssessed + stats.totalParksRemaining}`,
      icon: Trees,
      color: "bg-purple-500",
      description: "Taman yang telah dinilai"
    },
    {
      title: "Bulan Ini",
      value: formatNumber(stats.thisMonthAssessments),
      icon: Clock,
      color: "bg-orange-500",
      description: "Penilaian baru bulan ini"
    }
  ];

  const statusBreakdown = [
    {
      label: "Disetujui",
      count: stats.approvedAssessments,
      color: "bg-green-500",
      icon: CheckCircle,
      percentage: (stats.approvedAssessments / stats.totalAssessments) * 100
    },
    {
      label: "Menunggu Review",
      count: stats.pendingAssessments,
      color: "bg-yellow-500",
      icon: Clock,
      percentage: (stats.pendingAssessments / stats.totalAssessments) * 100
    },
    {
      label: "Draft",
      count: stats.draftAssessments,
      color: "bg-gray-500",
      icon: AlertCircle,
      percentage: (stats.draftAssessments / stats.totalAssessments) * 100
    },
    {
      label: "Ditolak",
      count: stats.rejectedAssessments,
      color: "bg-red-500",
      icon: AlertCircle,
      percentage: (stats.rejectedAssessments / stats.totalAssessments) * 100
    }
  ];

  const componentBreakdown = [
    {
      label: "Flora",
      icon: Leaf,
      averageScore: 76.8,
      color: "text-green-600"
    },
    {
      label: "Fauna",
      icon: Zap,
      averageScore: 71.2,
      color: "text-blue-600"
    },
    {
      label: "Ekosistem",
      icon: Trees,
      averageScore: 74.6,
      color: "text-purple-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.color} text-white`}>
                <Icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              {stat.badge && (
                <Badge variant="outline" className="mb-2 text-xs">
                  {stat.badge}
                </Badge>
              )}
              <p className="text-xs text-gray-500">{stat.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}