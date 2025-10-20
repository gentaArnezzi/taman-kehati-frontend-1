"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { AuditLogTable } from "./audit-log-table";
import { AuditLogSummary } from "./audit-log-summary";
import { AuditLogFilters } from "./audit-log-filters";
import { Search, Download, RotateCcw, Activity, AlertTriangle } from "lucide-react";
import { Input } from "~/components/ui/input";
import { AuditLog, AuditLogQuery } from "~/lib/types";

export function AuditLogDashboard() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [filters, setFilters] = useState<AuditLogQuery>({});

  // Mock data for demonstration
  const mockLogs: AuditLog[] = [
    {
      id: "1",
      actorId: "user-1",
      actorName: "Super Admin",
      actorRole: "SUPER_ADMIN",
      actorRegionId: null,
      action: "CREATE",
      entity: "ARTICLE",
      entityId: "article-1",
      entityName: "Pengumuman Peluncuran Program Baru",
      oldValues: null,
      newValues: {
        title: "Pengumuman Peluncuran Program Baru",
        content: "Kami dengan bangga mengumumkan...",
        status: "PUBLISHED"
      },
      changes: [
        {
          field: "title",
          oldValue: null,
          newValue: "Pengumuman Peluncuran Program Baru",
          fieldType: "string",
          changeType: "CREATE"
        },
        {
          field: "status",
          oldValue: null,
          newValue: "PUBLISHED",
          fieldType: "string",
          changeType: "CREATE"
        }
      ],
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      sessionId: "sess_123456",
      requestId: "req_789012",
      occurredAt: new Date("2024-03-18T10:30:00"),
      createdAt: new Date("2024-03-18T10:30:00"),
      description: "Super Admin created new article 'Pengumuman Peluncuran Program Baru'",
      category: "DATA_CHANGE",
      severity: "MEDIUM"
    },
    {
      id: "2",
      actorId: "user-2",
      actorName: "Admin Regional Jawa Barat",
      actorRole: "REGIONAL_ADMIN",
      actorRegionId: "region-jb",
      action: "UPDATE",
      entity: "PARK",
      entityId: "park-1",
      entityName: "Taman Nasional Gunung Gede Pangrango",
      oldValues: {
        totalFlora: 156,
        totalFauna: 89,
        biodiversityScore: 72
      },
      newValues: {
        totalFlora: 158,
        totalFauna: 90,
        biodiversityScore: 74
      },
      changes: [
        {
          field: "totalFlora",
          oldValue: 156,
          newValue: 158,
          fieldType: "number",
          changeType: "UPDATE"
        },
        {
          field: "totalFauna",
          oldValue: 89,
          newValue: 90,
          fieldType: "number",
          changeType: "UPDATE"
        },
        {
          field: "biodiversityScore",
          oldValue: 72,
          newValue: 74,
          fieldType: "number",
          changeType: "UPDATE"
        }
      ],
      ipAddress: "192.168.1.101",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      sessionId: "sess_234567",
      requestId: "req_890123",
      occurredAt: new Date("2024-03-18T09:15:00"),
      createdAt: new Date("2024-03-18T09:15:00"),
      description: "Admin Regional Jawa Barat updated park biodiversity data",
      category: "DATA_CHANGE",
      severity: "LOW"
    },
    {
      id: "3",
      actorId: "user-1",
      actorName: "Super Admin",
      actorRole: "SUPER_ADMIN",
      actorRegionId: null,
      action: "LOGIN",
      entity: "USER",
      entityId: "user-1",
      entityName: "Super Admin",
      oldValues: null,
      newValues: {
        loginTime: new Date("2024-03-18T08:00:00"),
        loginMethod: "password"
      },
      changes: [],
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      sessionId: "sess_123456",
      requestId: "req_345678",
      occurredAt: new Date("2024-03-18T08:00:00"),
      createdAt: new Date("2024-03-18T08:00:00"),
      description: "Super Admin logged in to system",
      category: "SECURITY",
      severity: "LOW"
    },
    {
      id: "4",
      actorId: "user-3",
      actorName: "Admin Regional Kalimantan",
      actorRole: "REGIONAL_ADMIN",
      actorRegionId: "region-kalimantan",
      action: "SUBMIT_FOR_REVIEW",
      entity: "BIODIVERSITY_INDEX",
      entityId: "bio-1",
      entityName: "Indeks Keanekaragaman Hayati Taman Nasional Tanjung Puting",
      oldValues: {
        status: "DRAFT"
      },
      newValues: {
        status: "PENDING"
      },
      changes: [
        {
          field: "status",
          oldValue: "DRAFT",
          newValue: "PENDING",
          fieldType: "string",
          changeType: "STATUS_CHANGE"
        }
      ],
      ipAddress: "192.168.1.102",
      userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
      sessionId: "sess_345678",
      requestId: "req_234567",
      occurredAt: new Date("2024-03-17T14:45:00"),
      createdAt: new Date("2024-03-17T14:45:00"),
      description: "Admin Regional Kalimantan submitted biodiversity index for review",
      category: "WORKFLOW",
      severity: "MEDIUM"
    },
    {
      id: "5",
      actorId: "user-1",
      actorName: "Super Admin",
      actorRole: "SUPER_ADMIN",
      actorRegionId: null,
      action: "APPROVE",
      entity: "BIODIVERSITY_INDEX",
      entityId: "bio-1",
      entityName: "Indeks Keanekaragaman Hayati Taman Nasional Tanjung Puting",
      oldValues: {
        status: "PENDING"
      },
      newValues: {
        status: "APPROVED",
        approvedAt: new Date("2024-03-18T07:30:00"),
        approvedBy: "user-1"
      },
      changes: [
        {
          field: "status",
          oldValue: "PENDING",
          newValue: "APPROVED",
          fieldType: "string",
          changeType: "STATUS_CHANGE"
        },
        {
          field: "approvedAt",
          oldValue: null,
          newValue: new Date("2024-03-18T07:30:00"),
          fieldType: "date",
          changeType: "CREATE"
        }
      ],
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      sessionId: "sess_123456",
      requestId: "req_456789",
      occurredAt: new Date("2024-03-18T07:30:00"),
      createdAt: new Date("2024-03-18T07:30:00"),
      description: "Super Admin approved biodiversity index for Taman Nasional Tanjung Puting",
      category: "WORKFLOW",
      severity: "HIGH"
    },
    {
      id: "6",
      actorId: "system",
      actorName: "System",
      actorRole: "SYSTEM",
      actorRegionId: null,
      action: "BACKUP",
      entity: "SYSTEM_CONFIG",
      entityId: "backup-daily-20240318",
      entityName: "Daily Database Backup",
      oldValues: null,
      newValues: {
        backupType: "automated",
        backupSize: "2.4GB",
        backupLocation: "/backups/daily/2024-03-18",
        status: "completed"
      },
      changes: [],
      ipAddress: "127.0.0.1",
      userAgent: "System Scheduler",
      sessionId: null,
      requestId: "req_system_backup",
      occurredAt: new Date("2024-03-18T02:00:00"),
      createdAt: new Date("2024-03-18T02:00:00"),
      description: "System completed daily database backup",
      category: "SYSTEM",
      severity: "LOW"
    }
  ];

  const mockSummary = {
    totalLogs: 6,
    actionsByType: {
      CREATE: 1,
      UPDATE: 1,
      LOGIN: 1,
      SUBMIT_FOR_REVIEW: 1,
      APPROVE: 1,
      BACKUP: 1
    },
    entitiesByType: {
      ARTICLE: 1,
      PARK: 1,
      USER: 1,
      BIODIVERSITY_INDEX: 2,
      SYSTEM_CONFIG: 1
    },
    actorsByActivity: [
      {
        actorId: "user-1",
        actorName: "Super Admin",
        actionCount: 3
      },
      {
        actorId: "user-2",
        actorName: "Admin Regional Jawa Barat",
        actionCount: 1
      },
      {
        actorId: "user-3",
        actorName: "Admin Regional Kalimantan",
        actionCount: 1
      },
      {
        actorId: "system",
        actorName: "System",
        actionCount: 1
      }
    ],
    timelineData: [
      {
        date: "2024-03-18",
        count: 5
      },
      {
        date: "2024-03-17",
        count: 1
      }
    ],
    criticalEvents: [
      {
        id: "5",
        actorName: "Super Admin",
        action: "APPROVE",
        entity: "BIODIVERSITY_INDEX",
        description: "Super Admin approved biodiversity index for Taman Nasional Tanjung Puting",
        occurredAt: new Date("2024-03-18T07:30:00"),
        severity: "HIGH"
      }
    ]
  };

  // Load initial data
  useState(() => {
    setLogs(mockLogs);
    setSummary(mockSummary);
  });

  const handleFilter = (newFilters: AuditLogQuery) => {
    setFilters(newFilters);
    // In real implementation, this would fetch filtered data
    console.log("Applying filters:", newFilters);
  };

  const handleSearch = (query: string) => {
    setFilters({ ...filters, search: query });
    // In real implementation, this would search logs
    console.log("Searching logs:", query);
  };

  const handleExport = (format: 'json' | 'csv') => {
    console.log("Exporting logs:", format);
    // Implementation would export logs in specified format
  };

  const handleViewDetails = (log: AuditLog) => {
    setSelectedLog(log);
    setIsDetailsModalOpen(true);
  };

  const handleResetFilters = () => {
    setFilters({});
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "CRITICAL": return "bg-red-100 text-red-800";
      case "HIGH": return "bg-orange-100 text-orange-800";
      case "MEDIUM": return "bg-yellow-100 text-yellow-800";
      case "LOW": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <AuditLogSummary summary={summary} />

      {/* Filters and Search */}
      <AuditLogFilters
        filters={filters}
        onFiltersChange={handleFilter}
        onSearch={handleSearch}
        onExport={handleExport}
        onReset={handleResetFilters}
      />

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Riwayat Aktivitas</CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {logs.length} dari {summary?.totalLogs || 0} entri
              </span>
              <Button variant="outline" size="sm" onClick={handleResetFilters}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <AuditLogTable
            logs={logs}
            onViewDetails={handleViewDetails}
            onExport={(log) => console.log("Export single log:", log.id)}
          />
        </CardContent>
      </Card>

      {/* Log Details Modal */}
      {isDetailsModalOpen && selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Detail Audit Log</h2>
              <Button variant="outline" size="sm" onClick={() => setIsDetailsModalOpen(false)}>
                ✕
              </Button>
            </div>

            <div className="space-y-6">
              {/* Basic Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Informasi Dasar</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">ID Log:</span>
                    <div className="font-mono">{selectedLog.id}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Waktu:</span>
                    <div>{selectedLog.occurredAt.toLocaleString('id-ID')}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">User:</span>
                    <div>{selectedLog.actorName} ({selectedLog.actorRole})</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Aksi:</span>
                    <div className="font-medium">{selectedLog.action}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Entitas:</span>
                    <div>{selectedLog.entity} - {selectedLog.entityName}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">IP Address:</span>
                    <div className="font-mono">{selectedLog.ipAddress}</div>
                  </div>
                </div>

                {selectedLog.description && (
                  <div className="mt-4">
                    <span className="text-gray-500">Deskripsi:</span>
                    <div className="mt-1 p-3 bg-white rounded">
                      {selectedLog.description}
                    </div>
                  </div>
                )}
              </div>

              {/* Change Details */}
              {selectedLog.changes && selectedLog.changes.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Detail Perubahan</h4>
                  <div className="space-y-3">
                    {selectedLog.changes.map((change, index) => (
                      <div key={index} className="bg-white p-3 rounded border">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-sm">{change.field}</span>
                          <Badge variant="outline" className="text-xs">
                            {change.changeType}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Sebelumnya:</span>
                            <div className="mt-1 p-2 bg-gray-50 rounded">
                              {change.oldValue !== null ? String(change.oldValue) : '-'}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500">Baru:</span>
                            <div className="mt-1 p-2 bg-green-50 rounded">
                              {change.newValue !== null ? String(change.newValue) : '-'}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Technical Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Informasi Teknis</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">User Agent:</span>
                    <div className="font-mono text-xs mt-1 break-all">
                      {selectedLog.userAgent}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Session ID:</span>
                    <div className="font-mono text-xs">
                      {selectedLog.sessionId || '-'}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Request ID:</span>
                    <div className="font-mono text-xs">
                      {selectedLog.requestId || '-'}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Region ID:</span>
                    <div>
                      {selectedLog.actorRegionId || '-'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Raw Data */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Data Mentah</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-sm font-medium mb-2">Data Lama:</h5>
                    <pre className="bg-white p-4 rounded overflow-x-auto text-xs">
                      {JSON.stringify(selectedLog.oldValues, null, 2)}
                    </pre>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium mb-2">Data Baru:</h5>
                    <pre className="bg-white p-4 rounded overflow-x-auto text-xs">
                      {JSON.stringify(selectedLog.newValues, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => console.log("Export JSON")}>
                Export JSON
              </Button>
              <Button variant="outline" onClick={() => setIsDetailsModalOpen(false)}>
                Tutup
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}