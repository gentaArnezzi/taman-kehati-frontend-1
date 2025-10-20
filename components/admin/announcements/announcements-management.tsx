"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { AnnouncementsTable } from "./announcements-table";
import { AnnouncementsStats } from "./announcements-stats";
import { Plus, Search, Download, Bell } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Announcement } from "~/db/schema";
import { cn } from "~/lib/utils";

export function AnnouncementsManagement() {
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

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
      title: "Peluncuran Program Monitoring Satwa Liar",
      content: "Kami dengan bangga mengumumkan peluncuran program monitoring satwa liar baru yang akan membantu melacak populasi spesies dilindungi di seluruh Taman Kehati Indonesia.",
      summary: "Program baru untuk monitoring satwa liar",
      targetType: "ALL",
      targetRef: null,
      createdBy: "admin-2",
      createdAt: new Date("2024-03-10"),
      updatedAt: new Date("2024-03-10"),
      publishedAt: new Date("2024-03-12"),
      expiresAt: null,
      priority: "MEDIUM",
      status: "PUBLISHED",
      category: "EVENT",
      tags: ["program", "monitoring", "satwa liar"],
      attachments: [],
      totalRecipients: 45,
      readCount: 28,
      archivedCount: 1,
      description: "Pengumuman peluncuran program baru"
    },
    {
      id: "3",
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
      id: "4",
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
      id: "5",
      title: "Pembaruan Fitur Keamanan Sistem",
      content: "Draft: Kami berencana untuk menambahkan fitur keamanan baru termasuk two-factor authentication dan enhanced password requirements.",
      summary: "Pembaruan fitur keamanan sistem",
      targetType: "ALL",
      targetRef: null,
      createdBy: "admin-1",
      createdAt: new Date("2024-03-18"),
      updatedAt: new Date("2024-03-18"),
      publishedAt: null,
      expiresAt: null,
      priority: "MEDIUM",
      status: "DRAFT",
      category: "SYSTEM",
      tags: ["keamanan", "update", "2fa"],
      attachments: [],
      totalRecipients: 0,
      readCount: 0,
      archivedCount: 0,
      description: "Draft untuk pembaruan keamanan"
    }
  ];

  const announcements = mockAnnouncements.filter(announcement => {
    const matchesSearch = !searchQuery ||
      announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      announcement.summary?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || announcement.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || announcement.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

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

  const handleCreateNew = () => {
    setSelectedAnnouncement(null);
    setIsCreateModalOpen(true);
  };

  const handleEdit = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setIsCreateModalOpen(true);
  };

  const handlePublish = async (id: string) => {
    console.log("Publish announcement:", id);
    // Implementation would go here
  };

  const handleExport = () => {
    console.log("Export announcements...");
    // Implementation would go here
  };

  return (
    <div className="space-y-6">
      {/* Statistics Overview */}
      <AnnouncementsStats />

      {/* Actions and Filters */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Daftar Pengumuman
            </CardTitle>
            <Button onClick={handleCreateNew}>
              <Plus className="h-4 w-4 mr-2" />
              Buat Pengumuman Baru
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cari judul atau konten pengumuman..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <Tabs value={statusFilter} onValueChange={setStatusFilter}>
                <TabsList>
                  <TabsTrigger value="all">Semua Status</TabsTrigger>
                  <TabsTrigger value="PUBLISHED">Diterbitkan</TabsTrigger>
                  <TabsTrigger value="DRAFT">Draft</TabsTrigger>
                  <TabsTrigger value="ARCHIVED">Diarsipkan</TabsTrigger>
                </TabsList>
              </Tabs>

              <Tabs value={categoryFilter} onValueChange={setCategoryFilter}>
                <TabsList>
                  <TabsTrigger value="all">Semua Kategori</TabsTrigger>
                  <TabsTrigger value="SYSTEM">Sistem</TabsTrigger>
                  <TabsTrigger value="POLICY">Kebijakan</TabsTrigger>
                  <TabsTrigger value="EVENT">Acara</TabsTrigger>
                </TabsList>
              </Tabs>

              <Button variant="outline" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{announcements.length}</div>
              <div className="text-sm text-gray-600">Total Pengumuman</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {announcements.filter(a => a.status === "PUBLISHED").length}
              </div>
              <div className="text-sm text-gray-600">Diterbitkan</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {announcements.reduce((sum, a) => sum + a.readCount, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Dibaca</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {announcements.filter(a => a.priority === "HIGH" || a.priority === "URGENT").length}
              </div>
              <div className="text-sm text-gray-600">Prioritas Tinggi</div>
            </div>
          </div>

          {/* Data Table */}
          <AnnouncementsTable
            announcements={announcements}
            onEdit={handleEdit}
            onDelete={(id) => console.log("Delete announcement:", id)}
            onPublish={handlePublish}
            onView={(id) => console.log("View announcement:", id)}
          />
        </CardContent>
      </Card>

      {/* Create/Edit Modal Placeholder */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {selectedAnnouncement ? "Edit Pengumuman" : "Buat Pengumuman Baru"}
            </h2>
            <p className="text-gray-600 mb-4">
              Form pengumuman akan diimplementasikan di sini
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Batal
              </Button>
              <Button>
                {selectedAnnouncement ? "Perbarui" : "Simpan"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}