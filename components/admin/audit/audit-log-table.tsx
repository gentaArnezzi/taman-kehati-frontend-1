import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Eye, Download, Activity, Edit, Trash2, Clock, MapPin, User } from "lucide-react";
import { formatDate } from "~/lib/utils";
import { AuditLog } from "~/lib/types";

interface AuditLogTableProps {
  logs: AuditLog[];
  onViewDetails: (log: AuditLog) => void;
  onExport: (log: AuditLog) => void;
}

export function AuditLogTable({ logs, onViewDetails, onExport }: AuditLogTableProps) {
  const getActionIcon = (action: string) => {
    const icons: Record<string, any> = {
      CREATE: Activity,
      UPDATE: Edit,
      DELETE: Trash2,
      LOGIN: User,
      LOGOUT: User,
      APPROVE: Activity,
      REJECT: Activity,
      EXPORT: Download,
      BACKUP: Activity
    };
    return icons[action] || Activity;
  };

  const getActionColor = (action: string) => {
    const colors: Record<string, string> = {
      CREATE: "text-green-600",
      UPDATE: "text-blue-600",
      DELETE: "text-red-600",
      LOGIN: "text-purple-600",
      LOGOUT: "text-gray-600",
      APPROVE: "text-green-600",
      REJECT: "text-red-600",
      EXPORT: "text-blue-600",
      BACKUP: "text-orange-600"
    };
    return colors[action] || "text-gray-600";
  };

  const getSeverityBadge = (severity: string) => {
    const variants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
      CRITICAL: "destructive",
      HIGH: "destructive",
      MEDIUM: "default",
      LOW: "secondary"
    };
    return (
      <Badge variant={variants[severity] || "secondary"}>
        {severity === 'CRITICAL' ? 'Kritis' :
         severity === 'HIGH' ? 'Tinggi' :
         severity === 'MEDIUM' ? 'Sedang' : 'Rendah'}
      </Badge>
    );
  };

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
      SUBMIT_FOR_REVIEW: "Ajukan Review",
      PUBLISH: "Terbitkan",
      ARCHIVE: "Arsipkan"
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
      SYSTEM_CONFIG: "Konfigurasi Sistem"
    };
    return names[entity] || entity;
  };

  const formatChangeSummary = (changes?: any[]) => {
    if (!changes || changes.length === 0) return "-";

    const fieldNames = changes.map(c => {
      // Translate field names to Indonesian
      const fieldTranslations: Record<string, string> = {
        name: "Nama",
        title: "Judul",
        description: "Deskripsi",
        status: "Status",
        content: "Konten",
        email: "Email",
        role: "Role",
        totalFlora: "Total Flora",
        totalFauna: "Total Fauna",
        biodiversityScore: "Skor Biodiversitas"
      };
      return fieldTranslations[c.field] || c.field;
    });

    if (fieldNames.length <= 2) {
      return fieldNames.join(', ');
    } else {
      return `${fieldNames.slice(0, 2).join(', ')} +${fieldNames.length - 2} lainnya`;
    }
  };

  if (logs.length === 0) {
    return (
      <div className="text-center py-12">
        <Activity className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Tidak ada data audit log
        </h3>
        <p className="text-gray-500">
          Belum ada aktivitas yang sesuai dengan filter yang dipilih
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-4">Waktu</th>
            <th className="text-left py-3 px-4">User</th>
            <th className="text-left py-3 px-4">Aksi</th>
            <th className="text-left py-3 px-4">Entitas</th>
            <th className="text-left py-3 px-4">Perubahan</th>
            <th className="text-center py-3 px-4">Level</th>
            <th className="text-center py-3 px-4">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => {
            const ActionIcon = getActionIcon(log.action);
            const actionColor = getActionColor(log.action);

            return (
              <tr
                key={log.id}
                className="border-b hover:bg-gray-50 cursor-pointer"
                onClick={() => onViewDetails(log)}
              >
                <td className="py-3 px-4">
                  <div className="text-sm">
                    <div>{formatDate(log.occurredAt, 'dd MMM yyyy')}</div>
                    <div className="text-gray-500">
                      {formatDate(log.occurredAt, 'HH:mm:ss')}
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <div className="w-full h-full bg-gray-300 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                        {log.actorName?.charAt(0).toUpperCase()}
                      </div>
                    </Avatar>
                    <div>
                      <div className="font-medium text-sm">{log.actorName}</div>
                      <div className="text-xs text-gray-500">{log.actorRole}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <ActionIcon className={`h-4 w-4 ${actionColor}`} />
                    <span className="text-sm font-medium">
                      {getActionDisplayName(log.action)}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="text-sm">
                    <div className="font-medium">{getEntityDisplayName(log.entity)}</div>
                    {log.entityName && (
                      <div className="text-gray-500">{log.entityName}</div>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="text-sm">
                    {formatChangeSummary(log.changes)}
                  </div>
                </td>
                <td className="py-3 px-4 text-center">
                  {getSeverityBadge(log.severity)}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewDetails(log);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onExport(log);
                      }}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}

// Avatar component for user display
interface AvatarProps {
  className?: string;
  children: React.ReactNode;
}

function Avatar({ className, children }: AvatarProps) {
  return (
    <div className={`relative inline-flex items-center justify-center w-6 h-6 overflow-hidden rounded-full ${className}`}>
      {children}
    </div>
  );
}