import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Bell, Send, Eye, Users, TrendingUp, AlertCircle } from "lucide-react";
import { formatNumber } from "~/lib/utils";

export function AnnouncementsStats() {
  // Mock stats data
  const stats = {
    totalAnnouncements: 24,
    publishedAnnouncements: 18,
    draftAnnouncements: 4,
    archivedAnnouncements: 2,
    totalRecipients: 45,
    totalReads: 156,
    averageReadRate: 73.5,
    urgentAnnouncements: 3,
    thisMonthAnnouncements: 8,
    lastUpdated: new Date("2024-03-18")
  };

  const statCards = [
    {
      title: "Total Pengumuman",
      value: formatNumber(stats.totalAnnouncements),
      icon: Bell,
      color: "bg-blue-500",
      description: "Total pengumuman yang telah dibuat"
    },
    {
      title: "Tingkat Baca",
      value: `${stats.averageReadRate}%`,
      icon: Eye,
      color: "bg-green-500",
      description: "Rata-rata tingkat pembacaan",
      badge: stats.averageReadRate >= 70 ? "Baik" : stats.averageReadRate >= 50 ? "Cukup" : "Perlu Ditingkatkan"
    },
    {
      title: "Total Penerima",
      value: formatNumber(stats.totalRecipients),
      icon: Users,
      color: "bg-purple-500",
      description: "Total Regional Admin"
    },
    {
      title: "Bulan Ini",
      value: formatNumber(stats.thisMonthAnnouncements),
      icon: Send,
      color: "bg-orange-500",
      description: "Pengumuman baru bulan ini"
    }
  ];

  const statusBreakdown = [
    {
      label: "Diterbitkan",
      count: stats.publishedAnnouncements,
      color: "bg-green-500",
      icon: Send,
      percentage: (stats.publishedAnnouncements / stats.totalAnnouncements) * 100
    },
    {
      label: "Draft",
      count: stats.draftAnnouncements,
      color: "bg-gray-500",
      icon: AlertCircle,
      percentage: (stats.draftAnnouncements / stats.totalAnnouncements) * 100
    },
    {
      label: "Diarsipkan",
      count: stats.archivedAnnouncements,
      color: "bg-blue-500",
      icon: Bell,
      percentage: (stats.archivedAnnouncements / stats.totalAnnouncements) * 100
    }
  ];

  const categoryBreakdown = [
    { category: "Sistem", count: 8, color: "bg-purple-500" },
    { category: "Kebijakan", count: 5, color: "bg-blue-500" },
    { category: "Acara", count: 6, color: "bg-green-500" },
    { category: "Pemeliharaan", count: 3, color: "bg-orange-500" },
    { category: "Umum", count: 2, color: "bg-gray-500" }
  ];

  const priorityBreakdown = [
    { priority: "Darurat", count: stats.urgentAnnouncements, color: "bg-red-500" },
    { priority: "Tinggi", count: 6, color: "bg-orange-500" },
    { priority: "Sedang", count: 10, color: "bg-blue-500" },
    { priority: "Rendah", count: 5, color: "bg-gray-500" }
  ];

  return (
    <div className="space-y-6">
      {/* Main Stats */}
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

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Status Pengumuman</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {statusBreakdown.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold">{item.count}</div>
                    <div className="text-xs text-gray-500">{item.percentage.toFixed(0)}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Kategori</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {categoryBreakdown.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                    <span className="text-sm">{item.category}</span>
                  </div>
                  <div className="text-sm font-bold">{item.count}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Priority Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Prioritas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {priorityBreakdown.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                    <span className="text-sm">{item.priority}</span>
                  </div>
                  <div className="text-sm font-bold">{item.count}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Metrik Engagement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {formatNumber(stats.totalReads)}
              </div>
              <div className="text-sm text-gray-600">Total Dibaca</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {stats.averageReadRate}%
              </div>
              <div className="text-sm text-gray-600">Tingkat Baca Rata-rata</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {stats.urgentAnnouncements}
              </div>
              <div className="text-sm text-gray-600">Pengumuman Darurat</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {formatNumber(stats.totalReads / stats.totalAnnouncements)}
              </div>
              <div className="text-sm text-gray-600">Rata-rata Baca/Pengumuman</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}