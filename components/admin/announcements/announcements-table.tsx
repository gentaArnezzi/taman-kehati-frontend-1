import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Eye, Edit, Trash2, Send, Calendar, Users, Bell } from "lucide-react";
import { formatDate, formatNumber } from "~/lib/utils";
import { Announcement } from "~/db/schema";

interface AnnouncementsTableProps {
  announcements: Announcement[];
  onEdit: (announcement: Announcement) => void;
  onDelete: (id: string) => void;
  onPublish: (id: string) => void;
  onView: (id: string) => void;
}

export function AnnouncementsTable({
  announcements,
  onEdit,
  onDelete,
  onPublish,
  onView
}: AnnouncementsTableProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "URGENT": return "bg-red-100 text-red-800";
      case "HIGH": return "bg-orange-100 text-orange-800";
      case "MEDIUM": return "bg-blue-100 text-blue-800";
      case "LOW": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PUBLISHED": return "bg-green-100 text-green-800";
      case "DRAFT": return "bg-gray-100 text-gray-800";
      case "ARCHIVED": return "bg-gray-100 text-gray-600";
      case "EXPIRED": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "SYSTEM": return "bg-purple-100 text-purple-800";
      case "POLICY": return "bg-blue-100 text-blue-800";
      case "EVENT": return "bg-green-100 text-green-800";
      case "MAINTENANCE": return "bg-orange-100 text-orange-800";
      case "GENERAL": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTargetTypeDisplay = (type: string) => {
    switch (type) {
      case "ALL": return "Semua Admin";
      case "REGION": return "Per Provinsi";
      case "USER": return "User Spesifik";
      case "ROLE": return "Per Role";
      default: return type;
    }
  };

  const getReadPercentage = (announcement: Announcement) => {
    if (announcement.totalRecipients === 0) return 0;
    return Math.round((announcement.readCount / announcement.totalRecipients) * 100);
  };

  if (announcements.length === 0) {
    return (
      <div className="text-center py-12">
        <Bell className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Belum ada pengumuman
        </h3>
        <p className="text-gray-500">
          Mulai dengan membuat pengumuman untuk Regional Admin
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Judul</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Target</TableHead>
            <TableHead>Prioritas</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Pembaca</TableHead>
            <TableHead>Tanggal</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {announcements.map((announcement) => (
            <TableRow key={announcement.id} className="hover:bg-gray-50">
              <TableCell className="max-w-xs">
                <div>
                  <div className="font-medium line-clamp-1">{announcement.title}</div>
                  <div className="text-sm text-gray-500 line-clamp-1">
                    {announcement.summary}
                  </div>
                  {announcement.tags && announcement.tags.length > 0 && (
                    <div className="flex gap-1 mt-1">
                      {announcement.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {announcement.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{announcement.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getCategoryColor(announcement.category)}>
                  {announcement.category === 'SYSTEM' ? 'Sistem' :
                   announcement.category === 'POLICY' ? 'Kebijakan' :
                   announcement.category === 'EVENT' ? 'Acara' :
                   announcement.category === 'MAINTENANCE' ? 'Pemeliharaan' : 'Umum'}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Users className="h-3 w-3 text-gray-400" />
                  <span className="text-sm">{getTargetTypeDisplay(announcement.targetType)}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getPriorityColor(announcement.priority)}>
                  {announcement.priority === 'URGENT' ? 'Darurat' :
                   announcement.priority === 'HIGH' ? 'Tinggi' :
                   announcement.priority === 'MEDIUM' ? 'Sedang' : 'Rendah'}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(announcement.status)}>
                  {announcement.status === 'PUBLISHED' ? 'Diterbitkan' :
                   announcement.status === 'DRAFT' ? 'Draft' :
                   announcement.status === 'ARCHIVED' ? 'Diarsipkan' : 'Kadaluarsa'}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span>{formatNumber(announcement.readCount)}/{formatNumber(announcement.totalRecipients)}</span>
                    <span className="text-gray-500">
                      {getReadPercentage(announcement)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-green-500 h-1.5 rounded-full"
                      style={{ width: `${getReadPercentage(announcement)}%` }}
                    ></div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-gray-400" />
                    <span>{formatDate(announcement.createdAt)}</span>
                  </div>
                  {announcement.expiresAt && (
                    <div className="text-xs text-gray-500">
                      Kadaluarsa: {formatDate(announcement.expiresAt)}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onView(announcement.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(announcement)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  {announcement.status === 'DRAFT' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onPublish(announcement.id)}
                      className="text-green-600 hover:text-green-700"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(announcement.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}