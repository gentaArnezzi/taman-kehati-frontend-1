"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Bell, Eye, Archive, Check, Clock, AlertCircle } from "lucide-react";
import { formatDate } from "~/lib/utils";
import { Announcement } from "~/db/schema";

interface AnnouncementsDashboardProps {
  regionId?: string;
}

export function AnnouncementsDashboard({ regionId }: AnnouncementsDashboardProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for demonstration
  const mockAnnouncements: Announcement[] = [
    {
      id: "1",
      title: "Pembaruan Sistem Manajemen Taman Kehati",
      content: "Sistem akan mengalami maintenance terjadwal pada hari Sabtu, 20 Maret 2024 mulai pukul 22:00 WIB hingga Minggu, 21 Maret 2024 pukul 02:00 WIB. Selama maintenance, sistem tidak akan dapat diakses.",
      summary: "Maintenance terjadwal sistem manajemen",
      targetType: "ALL",
      targetRef: null,
      createdBy: "admin-1",
      createdAt: new Date("2024-03-15"),
      updatedAt: new Date("2024-03-15"),
      publishedAt: new Date("2024-03-15"),
      expiresAt: new Date("2024-03-25"),
      priority: "HIGH",
      status: "PUBLISHED",
      category: "SYSTEM",
      tags: ["maintenance", "system", "update"],
      attachments: [],
      totalRecipients: 45,
      readCount: 32,
      archivedCount: 2,
      description: "Pengumuman penting mengenai maintenance sistem"
    },
    {
      id: "2",
      title: "Update Kebijakan Pelaporan Data Bulanan",
      content: "Ada perubahan pada format pelaporan data bulanan. Semua Regional Admin diharapkan menggunakan template baru yang telah disediakan mulai bulan April 2024.",
      summary: "Perubahan format pelaporan data bulanan",
      targetType: "REGION",
      targetRef: "all-regions",
      createdBy: "admin-1",
      createdAt: new Date("2024-03-08"),
      updatedAt: new Date("2024-03-08"),
      publishedAt: new Date("2024-03-09"),
      expiresAt: new Date("2024-04-30"),
      priority: "MEDIUM",
      status: "PUBLISHED",
      category: "POLICY",
      tags: ["kebijakan", "pelaporan", "template"],
      attachments: [],
      totalRecipients: 38,
      readCount: 25,
      archivedCount: 0,
      description: "Update kebijakan pelaporan"
    },
    {
      id: "3",
      title: "Workshop Pengenalan Sistem Baru",
      content: "Akan diadakan workshop untuk memperkenalkan sistem manajemen Taman Kehati yang baru. Workshop akan dilaksanakan secara daring pada tanggal 25 Maret 2024.",
      summary: "Workshop pengenalan sistem baru",
      targetType: "ROLE",
      targetRef: "REGIONAL_ADMIN",
      createdBy: "admin-2",
      createdAt: new Date("2024-03-05"),
      updatedAt: new Date("2024-03-05"),
      publishedAt: new Date("2024-03-06"),
      expiresAt: new Date("2024-03-25"),
      priority: "LOW",
      status: "PUBLISHED",
      category: "EVENT",
      tags: ["workshop", "training", "sistem"],
      attachments: [],
      totalRecipients: 38,
      readCount: 18,
      archivedCount: 0,
      description: "Undangan workshop pengenalan sistem"
    },
    {
      id: "4",
      title: "Tips Upload Foto Berkualitas Tinggi",
      content: "Berikut adalah panduan lengkap untuk mengupload foto flora dan fauna dengan kualitas tinggi sesuai standar dokumentasi Taman Kehati.",
      summary: "Panduan upload foto berkualitas tinggi",
      targetType: "ALL",
      targetRef: null,
      createdBy: "admin-2",
      createdAt: new Date("2024-03-01"),
      updatedAt: new Date("2024-03-01"),
      publishedAt: new Date("2024-03-02"),
      expiresAt: null,
      priority: "LOW",
      status: "PUBLISHED",
      category: "GENERAL",
      tags: ["tips", "foto", "documentation", "quality"],
      attachments: [],
      totalRecipients: 45,
      readCount: 28,
      archivedCount: 5,
      description: "Tips untuk dokumentasi foto"
    }
  ];

  useEffect(() => {
    // Simulate loading and data fetching
    setIsLoading(true);
    setTimeout(() => {
      setAnnouncements(mockAnnouncements);
      setUnreadCount(mockAnnouncements.filter(a =>
        // Simulate unread status based on read count
        a.readCount < Math.floor(a.totalRecipients * 0.8)
      ).length);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "URGENT": return "bg-red-100 text-red-800";
      case "HIGH": return "bg-orange-100 text-orange-800";
      case "MEDIUM": return "bg-blue-100 text-blue-800";
      case "LOW": return "bg-gray-100 text-gray-800";
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

  const handleMarkAsRead = async (announcementId: string) => {
    console.log("Mark as read:", announcementId);
    // Implementation would call API to mark as read
    setAnnouncements(prev =>
      prev.map(a => a.id === announcementId
        ? { ...a, readCount: a.readCount + 1 }
        : a
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const handleArchive = async (announcementId: string) => {
    console.log("Archive announcement:", announcementId);
    // Implementation would call API to archive
    setAnnouncements(prev =>
      prev.filter(a => a.id !== announcementId)
    );
  };

  const handleViewDetails = (announcementId: string) => {
    console.log("View details:", announcementId);
    // Implementation would open modal or navigate to details page
  };

  const isUnread = (announcement: Announcement) => {
    // Simulate unread status based on read count vs total recipients
    return announcement.readCount < Math.floor(announcement.totalRecipients * 0.8);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Pengumuman Terbaru
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <Bell className="h-8 w-8 mx-auto mb-2 text-gray-400 animate-pulse" />
              <p className="text-sm text-gray-500">Memuat pengumuman...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Recent Announcements with Unread Badge */}
      {unreadCount > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800 flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Pengumuman Baru ({unreadCount})
            </CardTitle>
            <p className="text-sm text-blue-700">
              Anda memiliki {unreadCount} pengumuman yang belum dibaca
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {announcements.filter(isUnread).map((announcement) => (
                <div
                  key={announcement.id}
                  className="bg-white p-4 rounded-lg border border-blue-200"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(announcement.priority)}`}>
                          {announcement.priority === 'URGENT' ? 'Darurat' :
                           announcement.priority === 'HIGH' ? 'Tinggi' :
                           announcement.priority === 'MEDIUM' ? 'Sedang' : 'Rendah'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(announcement.publishedAt)}
                        </span>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {announcement.title}
                      </h4>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                        {announcement.summary}
                      </p>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getCategoryColor(announcement.category)}>
                          {announcement.category === 'SYSTEM' ? 'Sistem' :
                           announcement.category === 'POLICY' ? 'Kebijakan' :
                           announcement.category === 'EVENT' ? 'Acara' :
                           announcement.category === 'MAINTENANCE' ? 'Pemeliharaan' : 'Umum'}
                        </Badge>
                        {announcement.expiresAt && (
                          <Badge variant="outline" className="text-xs">
                            Kadaluarsa: {formatDate(announcement.expiresAt)}
                          </Badge>
                        )}
                      </div>
                      {announcement.attachments && announcement.attachments.length > 0 && (
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>📎</span>
                          <span>{announcement.attachments.length} lampiran</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMarkAsRead(announcement.id)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleArchive(announcement.id)}
                        className="text-gray-600 hover:text-gray-700"
                      >
                        <Archive className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-4">
              <Button variant="outline" size="sm">
                Lihat Semua Pengumuman
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Announcements Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Semua Pengumuman
          </CardTitle>
          <p className="text-sm text-gray-600">
            Riwayat pengumuman yang telah diterima
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {announcements.map((announcement) => (
              <div
                key={announcement.id}
                className={`p-3 rounded-lg border ${
                  isUnread(announcement)
                    ? 'bg-blue-50 border-blue-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {isUnread(announcement) && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(announcement.priority)}`}>
                        {announcement.priority === 'URGENT' ? 'Darurat' :
                         announcement.priority === 'HIGH' ? 'Tinggi' :
                         announcement.priority === 'MEDIUM' ? 'Sedang' : 'Rendah'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(announcement.publishedAt)}
                      </span>
                      {isUnread(announcement) && (
                        <Badge variant="outline" className="text-xs border-blue-500 text-blue-700">
                          Baru
                        </Badge>
                      )}
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">
                      {announcement.title}
                    </h4>
                    <p className="text-sm text-gray-600 line-clamp-1">
                      {announcement.summary}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetails(announcement.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {isUnread(announcement) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMarkAsRead(announcement.id)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleArchive(announcement.id)}
                      className="text-gray-600 hover:text-gray-700"
                    >
                      <Archive className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Statistik Pengumuman</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{announcements.length}</div>
              <div className="text-sm text-gray-600">Total Pengumuman</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{unreadCount}</div>
              <div className="text-sm text-gray-600">Belum Dibaca</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {announcements.filter(a => a.priority === 'HIGH' || a.priority === 'URGENT').length}
              </div>
              <div className="text-sm text-gray-600">Prioritas Tinggi</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {announcements.filter(a => {
                  if (!a.expiresAt) return false;
                  return new Date(a.expiresAt) > new Date();
                }).length}
              </div>
              <div className="text-sm text-gray-600">Masih Aktif</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}