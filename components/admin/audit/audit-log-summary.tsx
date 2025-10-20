import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Activity, Eye, AlertTriangle, TrendingUp, Users, Target, Database } from "lucide-react";
import { formatNumber } from "~/lib/utils";

interface AuditLogSummaryProps {
  summary?: {
    totalLogs: number;
    actionsByType: Record<string, number>;
    entitiesByType: Record<string, number>;
    actorsByActivity: Array<{
      actorId: string;
      actorName: string;
      actionCount: number;
    }>;
    timelineData: Array<{
      date: string;
      count: number;
    }>;
    criticalEvents: Array<{
      id: string;
      actorName: string;
      action: string;
      entity: string;
      description: string;
      occurredAt: Date;
      severity: string;
    }>;
  };
}

export function AuditLogSummary({ summary }: AuditLogSummaryProps) {
  // Mock data for demonstration
  const mockSummary = {
    totalLogs: 156,
    actionsByType: {
      CREATE: 45,
      UPDATE: 67,
      DELETE: 12,
      LOGIN: 23,
      APPROVE: 8,
      REJECT: 1
    },
    entitiesByType: {
      USER: 25,
      PARK: 38,
      FLORA: 28,
      FAUNA: 22,
      ARTICLE: 15,
      ANNOUNCEMENT: 12,
      BIODIVERSITY_INDEX: 8,
      SYSTEM_CONFIG: 8
    },
    actorsByActivity: [
      {
        actorId: "user-1",
        actorName: "Super Admin",
        actionCount: 67
      },
      {
        actorId: "user-2",
        actorName: "Admin Regional Jawa Barat",
        actionCount: 34
      },
      {
        actorId: "user-3",
        actorName: "Admin Regional Sumatera",
        actionCount: 28
      },
      {
        actorId: "user-4",
        actorName: "Admin Regional Kalimantan",
        actionCount: 22
      }
    ],
    timelineData: [
      {
        date: "2024-03-18",
        count: 23
      },
      {
        date: "2024-03-17",
        count: 18
      },
      {
        date: "2024-03-16",
        count: 31
      },
      {
        date: "2024-03-15",
        count: 45
      },
      {
        date: "2024-03-14",
        count: 39
      }
    ],
    criticalEvents: [
      {
        id: "1",
        actorName: "Super Admin",
        action: "APPROVE",
        entity: "BIODIVERSITY_INDEX",
        description: "Approved biodiversity index for critical park",
        occurredAt: new Date("2024-03-18T07:30:00"),
        severity: "HIGH"
      },
      {
        id: "2",
        actorName: "System",
        action: "DELETE",
        entity: "USER",
        description: "System detected and removed suspicious user account",
        occurredAt: new Date("2024-03-17T14:20:00"),
        severity: "CRITICAL"
      }
    ]
  };

  const data = summary || mockSummary;

  const statCards = [
    {
      title: "Total Aktivitas",
      value: formatNumber(data.totalLogs),
      icon: Activity,
      color: "bg-blue-500",
      description: "Total aktivitas yang tercatat"
    },
    {
      title: "Hari Ini",
      value: data.timelineData.find(d => d.date === new Date().toISOString().split('T')[0])?.count || 0,
      icon: Eye,
      color: "bg-green-500",
      description: "Aktivitas hari ini"
    },
    {
      title: "Critical Events",
      value: data.criticalEvents.length,
      icon: AlertTriangle,
      color: "bg-red-500",
      description: "Peristiwa kritis memerlukan perhatian"
    },
    {
      title: "Active Users",
      value: data.actorsByActivity.length,
      icon: Users,
      color: "bg-purple-500",
      description: "User yang aktif hari ini"
    }
  ];

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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "CRITICAL": return "bg-red-500";
      case "HIGH": return "bg-orange-500";
      case "MEDIUM": return "bg-yellow-500";
      case "LOW": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
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
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-gray-500">{stat.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}