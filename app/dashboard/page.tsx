"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TreePine,
  Bird,
  Flower,
  Users,
  Calendar,
  MessageCircle,
  BarChart3,
  Globe,
  Map,
  GalleryVertical,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Activity,
  Megaphone,
  Settings,
  Eye,
  Plus,
  Database
} from "lucide-react";
import { useSession } from "@/lib/auth-client";

export default function DashboardPage() {
  const { data: session } = useSession();
  const userRole = session?.user?.role || 'USER';

  // Mock data for demo
  const stats = {
    superAdmin: {
      totalParks: 150,
      totalFlora: 10000,
      totalFauna: 2000,
      pendingApprovals: 24,
      approvedPercentage: 87,
      newEntriesThisMonth: 45,
      activeRegionalAdmins: 42,
      systemHealth: 'good',
      announcementsUnread: 3
    },
    regionalAdmin: {
      totalParks: 3,
      totalFlora: 234,
      totalFauna: 56,
      pendingSubmissions: 5,
      approvedEntries: 187,
      draftEntries: 8,
      lastAnnouncement: '2 hari yang lalu',
      unreadAnnouncements: 2
    }
  };

  const currentStats = userRole === 'SUPER_ADMIN' ? stats.superAdmin : stats.regionalAdmin;
  const isSuperAdmin = userRole === 'SUPER_ADMIN';

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">
              {isSuperAdmin ? 'Dashboard Super Admin' : 'Dashboard Regional Admin'}
            </h1>
            <p className="text-muted-foreground">
              {isSuperAdmin
                ? 'Sistem Manajemen Taman Kehati Nasional'
                : 'Manajemen Konten Regional Taman Kehati'
              }
            </p>
          </div>
          {isSuperAdmin && (
            <Button>
              <Megaphone className="h-4 w-4 mr-2" />
              Buat Pengumuman
            </Button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
              <TreePine className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Taman</p>
              <p className="text-2xl font-bold">{currentStats.totalParks}</p>
              {isSuperAdmin && (
                <Badge variant="secondary" className="mt-1">
                  {currentStats.approvedPercentage}% Disetujui
                </Badge>
              )}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
              <Flower className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Spesies Flora</p>
              <p className="text-2xl font-bold">{currentStats.totalFlora.toLocaleString('id-ID')}+</p>
              {isSuperAdmin && (
                <p className="text-xs text-green-600 mt-1">+12% bulan ini</p>
              )}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-lg">
              <Bird className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Spesies Fauna</p>
              <p className="text-2xl font-bold">{currentStats.totalFauna.toLocaleString('id-ID')}+</p>
              {isSuperAdmin && (
                <p className="text-xs text-green-600 mt-1">+8% bulan ini</p>
              )}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
              {isSuperAdmin ? (
                <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              ) : (
                <CheckCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {isSuperAdmin ? 'Menunggu Persetujuan' : 'Disetujui'}
              </p>
              <p className="text-2xl font-bold">
                {isSuperAdmin ? currentStats.pendingApprovals : currentStats.approvedEntries}
              </p>
              {!isSuperAdmin && (
                <Badge variant="outline" className="mt-1">
                  {currentStats.draftEntries} Draft
                </Badge>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Super Admin: National Mini Map */}
          {isSuperAdmin && (
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Peta Nasional - Taman per Provinsi</h2>
                <Button variant="outline" size="sm">
                  <Map className="h-4 w-4 mr-2" />
                  Lihat Peta Lengkap
                </Button>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 rounded-lg p-8 text-center">
                <Map className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <p className="text-sm text-muted-foreground">Peta interaktif akan ditampilkan di sini</p>
                <div className="mt-4 grid grid-cols-3 gap-4 text-xs">
                  <div>
                    <p className="font-semibold text-green-600">15</p>
                    <p className="text-muted-foreground">Sumatera</p>
                  </div>
                  <div>
                    <p className="font-semibold text-blue-600">12</p>
                    <p className="text-muted-foreground">Jawa</p>
                  </div>
                  <div>
                    <p className="font-semibold text-amber-600">8</p>
                    <p className="text-muted-foreground">Kalimantan</p>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Approval Queue (Super Admin) or Quick Actions (Regional) */}
          {isSuperAdmin ? (
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Antrian Persetujuan</h2>
                <Button variant="outline" size="sm">
                  Lihat Semua
                </Button>
              </div>
              <div className="space-y-3">
                {[
                  { type: 'Taman', title: 'Taman Nasional Bukit Baka', status: 'urgent', time: '2 jam lalu' },
                  { type: 'Flora', title: '15 spesies baru - Kalimantan', status: 'normal', time: '5 jam lalu' },
                  { type: 'Artikel', title: 'Program Konservasi Harimau', status: 'normal', time: '1 hari lalu' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        item.status === 'urgent' ? 'bg-red-500' : 'bg-amber-500'
                      }`}></div>
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.type} • {item.time}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="default">
                        Review
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ) : (
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Akses Cepat</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <Button variant="outline" className="flex flex-col items-center gap-2 h-20">
                  <Plus className="h-5 w-5" />
                  <span className="text-sm">Tambah Taman</span>
                </Button>
                <Button variant="outline" className="flex flex-col items-center gap-2 h-20">
                  <Flower className="h-5 w-5" />
                  <span className="text-sm">Tambah Flora</span>
                </Button>
                <Button variant="outline" className="flex flex-col items-center gap-2 h-20">
                  <Bird className="h-5 w-5" />
                  <span className="text-sm">Tambah Fauna</span>
                </Button>
                <Button variant="outline" className="flex flex-col items-center gap-2 h-20">
                  <FileText className="h-5 w-5" />
                  <span className="text-sm">Buat Artikel</span>
                </Button>
                <Button variant="outline" className="flex flex-col items-center gap-2 h-20">
                  <GalleryVertical className="h-5 w-5" />
                  <span className="text-sm">Upload Media</span>
                </Button>
                <Button variant="outline" className="flex flex-col items-center gap-2 h-20">
                  <Calendar className="h-5 w-5" />
                  <span className="text-sm">Tambah Agenda</span>
                </Button>
              </div>
            </Card>
          )}

          {/* Activity Feed */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                {isSuperAdmin ? 'Aktivitas Sistem' : 'Aktivitas Terbaru'}
              </h2>
              <Button variant="outline" size="sm">
                Lihat Semua
              </Button>
            </div>
            <div className="space-y-4">
              {[
                {
                  icon: Users,
                  color: 'bg-green-500',
                  title: isSuperAdmin ? 'Admin Regional Baru' : 'Konten Disetujui',
                  description: isSuperAdmin
                    ? 'Ahmad Wijaya ditambahkan sebagai Regional Admin untuk Bali'
                    : '3 spesies flora telah disetujui oleh Super Admin',
                  time: '10 menit yang lalu'
                },
                {
                  icon: FileText,
                  color: 'bg-blue-500',
                  title: 'Artikel Diterbitkan',
                  description: 'Program Konservasi Orangutan telah diterbitkan',
                  time: '1 jam yang lalu'
                },
                {
                  icon: AlertTriangle,
                  color: 'bg-amber-500',
                  title: 'Data Membutuhkan Review',
                  description: '5 entri fauna menunggu persetujuan',
                  time: '2 jam yang lalu'
                },
              ].map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={`${activity.color} rounded-full p-1 mt-1`}>
                    <activity.icon className="h-3 w-3 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Announcements */}
          {isSuperAdmin ? (
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Pengumuman Aktif</h2>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-3">
                {[
                  { title: 'Maintenance Sistem', status: 'active', recipients: 'Semua Admin' },
                  { title: 'Update Panduan Data', status: 'scheduled', recipients: 'Regional Admin' },
                ].map((item, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.recipients}</p>
                      </div>
                      <Badge variant={item.status === 'active' ? 'default' : 'secondary'}>
                        {item.status === 'active' ? 'Aktif' : 'Terjadwal'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ) : (
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Pengumuman</h2>
                {currentStats.unreadAnnouncements > 0 && (
                  <Badge variant="destructive">{currentStats.unreadAnnouncements}</Badge>
                )}
              </div>
              <div className="space-y-3">
                {[
                  {
                    title: 'Sistem Maintenance 20 Okt',
                    content: 'Sistem akan maintenance pukul 22:00-02:00 WIB',
                    time: '2 hari yang lalu',
                    read: false
                  },
                  {
                    title: 'Update Panduan Data',
                    content: 'Panduan baru untuk input data flora dan fauna',
                    time: '1 minggu yang lalu',
                    read: true
                  },
                ].map((item, index) => (
                  <div key={index} className={`p-3 border rounded-lg ${!item.read ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-200' : ''}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{item.content}</p>
                        <p className="text-xs text-muted-foreground mt-2">{item.time}</p>
                      </div>
                      {!item.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* System Health (Super Admin) or Tasks (Regional) */}
          {isSuperAdmin ? (
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Kesehatan Sistem</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Database</span>
                  <Badge variant="default" className="bg-green-500">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Normal
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Storage</span>
                  <Badge variant="default" className="bg-green-500">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Normal
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">API Response</span>
                  <Badge variant="secondary">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    245ms
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Error Rate</span>
                  <Badge variant="secondary">
                    <Activity className="h-3 w-3 mr-1" />
                    0.1%
                  </Badge>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="text-xs text-muted-foreground">
                  <p>Uptime: 99.9% (30 hari)</p>
                  <p>Backup terakhir: 6 jam lalu</p>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Tugas Mendesak</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm">Selesaikan 3 draft fauna</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-amber-500 rounded-full"></div>
                  <span className="text-sm">Perbarui data Taman Nasional</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Upload foto galeri baru</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Review artikel bulanan</span>
                </div>
              </div>
            </Card>
          )}

          {/* Quick Stats */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">
              {isSuperAdmin ? 'Statistik Nasional' : 'Statistik Regional'}
            </h2>
            <div className="space-y-4">
              {isSuperAdmin ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm">Admin Regional Aktif</span>
                    <span className="text-sm font-medium">{currentStats.activeRegionalAdmins}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Entri Baru (30 hari)</span>
                    <span className="text-sm font-medium">{currentStats.newEntriesThisMonth}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Rata-rata Approval</span>
                    <span className="text-sm font-medium">2.3 hari</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm">Menunggu Review</span>
                    <span className="text-sm font-medium">{currentStats.pendingSubmissions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Draft</span>
                    <span className="text-sm font-medium">{currentStats.draftEntries}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Pengumuman Terakhir</span>
                    <span className="text-sm font-medium">{currentStats.lastAnnouncement}</span>
                  </div>
                </>
              )}
            </div>
          </Card>

          {/* Support */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Dukungan</h2>
            <Button className="w-full" variant="outline">
              <MessageCircle className="h-4 w-4 mr-2" />
              Hubungi Tim Support
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}