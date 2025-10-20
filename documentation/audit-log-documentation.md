# Audit Log & Change History (Log Audit & Riwayat Perubahan)

## Deskripsi

Sistem Audit Log mencatat semua aktivitas yang terjadi dalam aplikasi Taman Kehati, termasuk create, read, update, delete operations, approval workflows, dan sistem access. Ini penting untuk compliance, security monitoring, dan troubleshooting.

## Struktur Data

### TypeScript Interfaces

```typescript
interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: 'SUPER_ADMIN' | 'REGIONAL_ADMIN';
  actorRegionId?: string;

  // Action Details
  action: AuditAction;
  entity: AuditEntity;
  entityId: string;
  entityName?: string; // Human-readable name for display

  // Change Details
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  changes?: ChangeDetail[]; // Structured change information

  // Metadata
  ipAddress: string;
  userAgent: string;
  sessionId?: string;
  requestId?: string;

  // Timestamps
  occurredAt: Date;
  createdAt: Date;

  // Additional Context
  description?: string;
  category: 'SECURITY' | 'DATA_CHANGE' | 'WORKFLOW' | 'SYSTEM' | 'ACCESS';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

interface ChangeDetail {
  field: string;
  oldValue: any;
  newValue: any;
  fieldType: 'string' | 'number' | 'date' | 'boolean' | 'json' | 'array';
  changeType: 'CREATE' | 'UPDATE' | 'DELETE' | 'STATUS_CHANGE';
}

type AuditAction =
  | 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'BULK_CREATE' | 'BULK_UPDATE' | 'BULK_DELETE'
  | 'LOGIN' | 'LOGOUT' | 'LOGIN_FAILED' | 'PASSWORD_CHANGE' | 'PROFILE_UPDATE'
  | 'APPROVE' | 'REJECT' | 'SUBMIT_FOR_REVIEW' | 'WITHDRAW'
  | 'EXPORT' | 'IMPORT' | 'BACKUP' | 'RESTORE'
  | 'ARCHIVE' | 'UNARCHIVE' | 'PUBLISH' | 'UNPUBLISH'
  | 'ASSIGN_ROLE' | 'REMOVE_ROLE' | 'CHANGE_PERMISSIONS';

type AuditEntity =
  | 'USER' | 'PARK' | 'FLORA' | 'FAUNA' | 'ACTIVITY' | 'ARTICLE' | 'MEDIA'
  | 'ANNOUNCEMENT' | 'BIODIVERSITY_INDEX' | 'ROLE' | 'PERMISSION'
  | 'SYSTEM_CONFIG' | 'AUDIT_LOG' | 'BACKUP';

interface AuditLogQuery {
  startDate?: Date;
  endDate?: Date;
  actorId?: string;
  action?: AuditAction;
  entity?: AuditEntity;
  entityId?: string;
  category?: string;
  severity?: string;
  search?: string;
  page?: number;
  limit?: number;
}

interface AuditLogSummary {
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
  criticalEvents: AuditLog[];
}
```

## Komponen UI

### 1. Super Admin - Audit Log Dashboard

```typescript
// app/admin/logs/audit/page.tsx
export default function AuditLogDashboard() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [summary, setSummary] = useState<AuditLogSummary | null>(null);
  const [filters, setFilters] = useState<AuditLogQuery>({});
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Audit Log</h1>
          <p className="text-gray-600">
            Monitor semua aktivitas sistem dan perubahan data
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportLogs}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={() => setFilters({})}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Filter
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <AuditLogSummary summary={summary} />

      {/* Filters */}
      <AuditLogFilters
        filters={filters}
        onFiltersChange={setFilters}
        onSearch={handleSearch}
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
              <RefreshButton onRefresh={refreshLogs} isLoading={isLoading} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <AuditLogTable
            logs={logs}
            onViewDetails={viewLogDetails}
            onExport={exportSingleLog}
          />
          {logs.length > 0 && (
            <Pagination
              currentPage={filters.page || 1}
              totalPages={Math.ceil((summary?.totalLogs || 0) / (filters.limit || 50))}
              onPageChange={(page) => setFilters(prev => ({ ...prev, page }))}
            />
          )}
        </CardContent>
      </Card>

      {/* Log Details Modal */}
      <AuditLogDetailsModal
        isOpen={!!selectedLog}
        log={selectedLog}
        onClose={() => setSelectedLog(null)}
      />
    </div>
  );
}
```

### 2. Audit Log Summary Cards

```typescript
// components/admin/AuditLogSummary.tsx
interface AuditLogSummaryProps {
  summary: AuditLogSummary | null;
}

export function AuditLogSummary({ summary }: AuditLogSummaryProps) {
  if (!summary) return <AuditLogSummarySkeleton />;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-100 text-red-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <StatCard
        title="Total Aktivitas"
        value={summary.totalLogs.toLocaleString('id-ID')}
        icon={Activity}
        color="blue"
        description="Total aktivitas yang tercatat"
      />

      <StatCard
        title="Hari Ini"
        value={summary.timelineData.find(d => d.date === format(new Date(), 'yyyy-MM-dd'))?.count || 0}
        icon={Calendar}
        color="green"
        description="Aktivitas hari ini"
      />

      <StatCard
        title="Critical Events"
        value={summary.criticalEvents.length}
        icon={AlertTriangle}
        color="red"
        description="Peristiwa kritis memerlukan perhatian"
      />

      <StatCard
        title="Active Users"
        value={summary.actorsByActivity.length}
        icon={Users}
        color="purple"
        description="User yang aktif hari ini"
      />
    </div>
  );
}
```

### 3. Audit Log Filters

```typescript
// components/admin/AuditLogFilters.tsx
interface AuditLogFiltersProps {
  filters: AuditLogQuery;
  onFiltersChange: (filters: AuditLogQuery) => void;
  onSearch: () => void;
}

export function AuditLogFilters({
  filters,
  onFiltersChange,
  onSearch
}: AuditLogFiltersProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Filter Audit Log</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Date Range */}
          <div>
            <Label>Tanggal Mulai</Label>
            <Input
              type="date"
              value={filters.startDate ? format(filters.startDate, 'yyyy-MM-dd') : ''}
              onChange={(e) => onFiltersChange({
                ...filters,
                startDate: e.target.value ? new Date(e.target.value) : undefined
              })}
            />
          </div>
          <div>
            <Label>Tanggal Akhir</Label>
            <Input
              type="date"
              value={filters.endDate ? format(filters.endDate, 'yyyy-MM-dd') : ''}
              onChange={(e) => onFiltersChange({
                ...filters,
                endDate: e.target.value ? new Date(e.target.value) : undefined
              })}
            />
          </div>

          {/* Action Filter */}
          <div>
            <Label>Tipe Aksi</Label>
            <Select
              value={filters.action || ''}
              onValueChange={(value) => onFiltersChange({
                ...filters,
                action: value || undefined
              })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Semua aksi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Semua aksi</SelectItem>
                <SelectItem value="CREATE">Buat</SelectItem>
                <SelectItem value="UPDATE">Update</SelectItem>
                <SelectItem value="DELETE">Hapus</SelectItem>
                <SelectItem value="APPROVE">Setujui</SelectItem>
                <SelectItem value="REJECT">Tolak</SelectItem>
                <SelectItem value="LOGIN">Login</SelectItem>
                <SelectItem value="EXPORT">Export</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Entity Filter */}
          <div>
            <Label>Tipe Entitas</Label>
            <Select
              value={filters.entity || ''}
              onValueChange={(value) => onFiltersChange({
                ...filters,
                entity: value || undefined
              })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Semua entitas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Semua entitas</SelectItem>
                <SelectItem value="USER">User</SelectItem>
                <SelectItem value="PARK">Taman</SelectItem>
                <SelectItem value="FLORA">Flora</SelectItem>
                <SelectItem value="FAUNA">Fauna</SelectItem>
                <SelectItem value="ACTIVITY">Aktivitas</SelectItem>
                <SelectItem value="ARTICLE">Artikel</SelectItem>
                <SelectItem value="ANNOUNCEMENT">Pengumuman</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category Filter */}
          <div>
            <Label>Kategori</Label>
            <Select
              value={filters.category || ''}
              onValueChange={(value) => onFiltersChange({
                ...filters,
                category: value || undefined
              })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Semua kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Semua kategori</SelectItem>
                <SelectItem value="SECURITY">Keamanan</SelectItem>
                <SelectItem value="DATA_CHANGE">Perubahan Data</SelectItem>
                <SelectItem value="WORKFLOW">Workflow</SelectItem>
                <SelectItem value="SYSTEM">Sistem</SelectItem>
                <SelectItem value="ACCESS">Akses</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Severity Filter */}
          <div>
            <Label>Tingkat Severeitas</Label>
            <Select
              value={filters.severity || ''}
              onValueChange={(value) => onFiltersChange({
                ...filters,
                severity: value || undefined
              })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Semua level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Semua level</SelectItem>
                <SelectItem value="CRITICAL">Kritis</SelectItem>
                <SelectItem value="HIGH">Tinggi</SelectItem>
                <SelectItem value="MEDIUM">Sedang</SelectItem>
                <SelectItem value="LOW">Rendah</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Actor Filter */}
          <div>
            <Label>User</Label>
            <UserSelector
              value={filters.actorId}
              onChange={(userId) => onFiltersChange({
                ...filters,
                actorId: userId
              })}
              placeholder="Semua user"
            />
          </div>

          {/* Search */}
          <div>
            <Label>Pencarian</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Cari deskripsi..."
                value={filters.search || ''}
                onChange={(e) => onFiltersChange({
                  ...filters,
                  search: e.target.value
                })}
                onKeyPress={(e) => e.key === 'Enter' && onSearch()}
              />
              <Button onClick={onSearch}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

### 4. Audit Log Table

```typescript
// components/admin/AuditLogTable.tsx
interface AuditLogTableProps {
  logs: AuditLog[];
  onViewDetails: (log: AuditLog) => void;
  onExport: (log: AuditLog) => void;
}

export function AuditLogTable({
  logs,
  onViewDetails,
  onExport
}: AuditLogTableProps) {
  const getActionIcon = (action: string) => {
    const icons = {
      CREATE: Plus,
      UPDATE: Edit,
      DELETE: Trash2,
      LOGIN: LogIn,
      LOGOUT: LogOut,
      APPROVE: CheckCircle,
      REJECT: XCircle,
      EXPORT: Download,
      IMPORT: Upload
    };
    return icons[action as keyof typeof icons] || Activity;
  };

  const getActionColor = (action: string) => {
    const colors = {
      CREATE: 'text-green-600',
      UPDATE: 'text-blue-600',
      DELETE: 'text-red-600',
      LOGIN: 'text-purple-600',
      LOGOUT: 'text-gray-600',
      APPROVE: 'text-green-600',
      REJECT: 'text-red-600',
      EXPORT: 'text-blue-600',
      IMPORT: 'text-purple-600'
    };
    return colors[action as keyof typeof colors] || 'text-gray-600';
  };

  const getSeverityBadge = (severity: string) => {
    const variants = {
      CRITICAL: 'destructive',
      HIGH: 'destructive',
      MEDIUM: 'default',
      LOW: 'secondary'
    } as const;

    return (
      <Badge variant={variants[severity as keyof typeof variants]}>
        {severity === 'CRITICAL' ? 'Kritis' :
         severity === 'HIGH' ? 'Tinggi' :
         severity === 'MEDIUM' ? 'Sedang' : 'Rendah'}
      </Badge>
    );
  };

  const formatChangeSummary = (changes?: ChangeDetail[]) => {
    if (!changes || changes.length === 0) return '-';

    const fieldNames = changes.map(c => {
      // Translate field names to Indonesian
      const fieldTranslations: Record<string, string> = {
        name: 'Nama',
        description: 'Deskripsi',
        status: 'Status',
        priority: 'Prioritas',
        email: 'Email',
        role: 'Role'
      };
      return fieldTranslations[c.field] || c.field;
    });

    if (fieldNames.length <= 2) {
      return fieldNames.join(', ');
    } else {
      return `${fieldNames.slice(0, 2).join(', ')} +${fieldNames.length - 2} lainnya`;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
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
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={getUserAvatar(log.actorId)} />
                      <AvatarFallback>
                        {log.actorName?.charAt(0).toUpperCase()}
                      </AvatarFallback>
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
      </table>

      {logs.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Tidak ada data audit log yang sesuai dengan filter
        </div>
      )}
    </div>
  );
}
```

### 5. Audit Log Details Modal

```typescript
// components/admin/AuditLogDetailsModal.tsx
interface AuditLogDetailsModalProps {
  isOpen: boolean;
  log: AuditLog | null;
  onClose: () => void;
}

export function AuditLogDetailsModal({
  isOpen,
  log,
  onClose
}: AuditLogDetailsModalProps) {
  if (!log) return null;

  const renderChangeDetails = (changes?: ChangeDetail[]) => {
    if (!changes || changes.length === 0) {
      return (
        <div className="text-center py-4 text-gray-500">
          Tidak ada perubahan yang tercatat
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {changes.map((change, index) => (
          <div key={index} className="border rounded-lg p-3">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-sm">
                {change.field}
              </span>
              <Badge variant="outline" className="text-xs">
                {change.changeType}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Sebelumnya:</span>
                <div className="mt-1 p-2 bg-gray-50 rounded">
                  {formatValue(change.oldValue, change.fieldType)}
                </div>
              </div>
              <div>
                <span className="text-gray-500">Baru:</span>
                <div className="mt-1 p-2 bg-green-50 rounded">
                  {formatValue(change.newValue, change.fieldType)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>Detail Audit Log</DialogTitle>
            <div className="flex items-center gap-2">
              <Badge variant={log.severity === 'CRITICAL' ? 'destructive' : 'outline'}>
                {log.severity}
              </Badge>
              <Badge variant="outline">
                {log.category}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informasi Dasar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">ID Log:</span>
                  <div className="font-mono">{log.id}</div>
                </div>
                <div>
                  <span className="text-gray-500">Waktu:</span>
                  <div>{formatDate(log.occurredAt, 'dd MMM yyyy HH:mm:ss')}</div>
                </div>
                <div>
                  <span className="text-gray-500">User:</span>
                  <div>{log.actorName} ({log.actorRole})</div>
                </div>
                <div>
                  <span className="text-gray-500">Aksi:</span>
                  <div className="font-medium">{getActionDisplayName(log.action)}</div>
                </div>
                <div>
                  <span className="text-gray-500">Entitas:</span>
                  <div>{getEntityDisplayName(log.entity)} - {log.entityName}</div>
                </div>
                <div>
                  <span className="text-gray-500">IP Address:</span>
                  <div className="font-mono">{log.ipAddress}</div>
                </div>
              </div>

              {log.description && (
                <div className="mt-4">
                  <span className="text-gray-500">Deskripsi:</span>
                  <div className="mt-1 p-3 bg-gray-50 rounded">
                    {log.description}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Change Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Detail Perubahan</CardTitle>
            </CardHeader>
            <CardContent>
              {renderChangeDetails(log.changes)}
            </CardContent>
          </Card>

          {/* Technical Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informasi Teknis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">User Agent:</span>
                  <div className="font-mono text-xs mt-1 break-all">
                    {log.userAgent}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Session ID:</span>
                  <div className="font-mono text-xs">
                    {log.sessionId || '-'}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Request ID:</span>
                  <div className="font-mono text-xs">
                    {log.requestId || '-'}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Region ID:</span>
                  <div>
                    {log.actorRegionId || '-'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Raw Data */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Data Mentah</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="old">
                <TabsList>
                  <TabsTrigger value="old">Data Lama</TabsTrigger>
                  <TabsTrigger value="new">Data Baru</TabsTrigger>
                </TabsList>
                <TabsContent value="old">
                  <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-xs">
                    {JSON.stringify(log.oldValues, null, 2)}
                  </pre>
                </TabsContent>
                <TabsContent value="new">
                  <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-xs">
                    {JSON.stringify(log.newValues, null, 2)}
                  </pre>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => exportLog(log)}>
            <Download className="h-4 w-4 mr-2" />
            Export JSON
          </Button>
          <Button variant="outline" onClick={onClose}>
            Tutup
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

## API Endpoints

```typescript
// app/api/audit-logs/route.ts
export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (user.role !== 'SUPER_ADMIN') {
    return new Response('Unauthorized', { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const query: AuditLogQuery = {
    startDate: searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : undefined,
    endDate: searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : undefined,
    actorId: searchParams.get('actorId') || undefined,
    action: searchParams.get('action') as AuditAction || undefined,
    entity: searchParams.get('entity') as AuditEntity || undefined,
    entityId: searchParams.get('entityId') || undefined,
    category: searchParams.get('category') || undefined,
    severity: searchParams.get('severity') || undefined,
    search: searchParams.get('search') || undefined,
    page: parseInt(searchParams.get('page') || '1'),
    limit: parseInt(searchParams.get('limit') || '50')
  };

  const [logs, total] = await Promise.all([
    getAuditLogs(query),
    getAuditLogsCount(query)
  ]);

  const summary = await getAuditLogSummary(query);

  return Response.json({
    logs,
    total,
    summary,
    page: query.page,
    limit: query.limit
  });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  const body = await request.json() as {
    action: AuditAction;
    entity: AuditEntity;
    entityId: string;
    oldValues?: Record<string, any>;
    newValues?: Record<string, any>;
    description?: string;
    category?: string;
    severity?: string;
  };

  const auditLog = await createAuditLog({
    actorId: user.id,
    actorName: user.name,
    actorRole: user.role,
    actorRegionId: user.regionId,
    action: body.action,
    entity: body.entity,
    entityId: body.entityId,
    oldValues: body.oldValues,
    newValues: body.newValues,
    description: body.description,
    category: body.category || 'DATA_CHANGE',
    severity: body.severity || 'MEDIUM',
    ipAddress: getClientIP(request),
    userAgent: request.headers.get('user-agent') || '',
    sessionId: getSessionId(request),
    requestId: generateRequestId()
  });

  return Response.json(auditLog);
}
```

## Database Schema

```sql
-- Audit logs table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID NOT NULL REFERENCES users(id),
  actor_name VARCHAR(255) NOT NULL,
  actor_role VARCHAR(20) NOT NULL CHECK (actor_role IN ('SUPER_ADMIN', 'REGIONAL_ADMIN')),
  actor_region_id UUID,
  action VARCHAR(50) NOT NULL,
  entity VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  entity_name VARCHAR(255),
  old_values JSONB,
  new_values JSONB,
  changes JSONB,
  ip_address INET NOT NULL,
  user_agent TEXT,
  session_id VARCHAR(255),
  request_id VARCHAR(255),
  occurred_at TIMESTAMP NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  description TEXT,
  category VARCHAR(20) NOT NULL DEFAULT 'DATA_CHANGE' CHECK (category IN ('SECURITY', 'DATA_CHANGE', 'WORKFLOW', 'SYSTEM', 'ACCESS')),
  severity VARCHAR(20) NOT NULL DEFAULT 'MEDIUM' CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'))
);

-- Indexes for performance
CREATE INDEX idx_audit_logs_occurred_at ON audit_logs(occurred_at DESC);
CREATE INDEX idx_audit_logs_actor_id ON audit_logs(actor_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity, entity_id);
CREATE INDEX idx_audit_logs_category ON audit_logs(category);
CREATE INDEX idx_audit_logs_severity ON audit_logs(severity);
CREATE INDEX idx_audit_logs_search ON audit_logs USING gin(to_tsvector('indonesian', description || ' ' || entity_name || ' ' || actor_name));
```

## Services

```typescript
// services/audit.service.ts
export class AuditService {
  async createAuditLog(data: {
    action: AuditAction;
    entity: AuditEntity;
    entityId: string;
    oldValues?: Record<string, any>;
    newValues?: Record<string, any>;
    description?: string;
    category?: string;
    severity?: string;
  }) {
    const user = await getCurrentUser();
    const changes = this.detectChanges(data.oldValues, data.newValues);

    const auditLog = await db.insert(auditLogs).values({
      id: generateId(),
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      actorRegionId: user.regionId,
      action: data.action,
      entity: data.entity,
      entityId: data.entityId,
      entityName: await this.getEntityName(data.entity, data.entityId),
      oldValues: data.oldValues,
      newValues: data.newValues,
      changes: JSON.stringify(changes),
      description: data.description,
      category: data.category || this.determineCategory(data.action, data.entity),
      severity: data.severity || this.determineSeverity(data.action),
      ipAddress: getClientIP(),
      userAgent: headers().get('user-agent') || '',
      sessionId: getSessionId(),
      requestId: generateRequestId(),
      occurredAt: new Date(),
      createdAt: new Date()
    }).returning();

    // Check for critical events and send notifications
    if (data.severity === 'CRITICAL') {
      await this.notifyCriticalEvent(auditLog[0]);
    }

    return auditLog[0];
  }

  private detectChanges(oldValues?: Record<string, any>, newValues?: Record<string, any>): ChangeDetail[] {
    if (!oldValues && !newValues) return [];

    const changes: ChangeDetail[] = [];
    const allKeys = new Set([
      ...(oldValues ? Object.keys(oldValues) : []),
      ...(newValues ? Object.keys(newValues) : [])
    ]);

    for (const key of allKeys) {
      const oldValue = oldValues?.[key];
      const newValue = newValues?.[key];

      if (oldValue !== newValue) {
        changes.push({
          field: key,
          oldValue,
          newValue,
          fieldType: this.detectFieldType(newValue),
          changeType: !oldValue ? 'CREATE' : !newValue ? 'DELETE' : 'UPDATE'
        });
      }
    }

    return changes;
  }

  private determineCategory(action: AuditAction, entity: AuditEntity): string {
    if (['LOGIN', 'LOGOUT', 'LOGIN_FAILED', 'PASSWORD_CHANGE'].includes(action)) {
      return 'SECURITY';
    }
    if (['APPROVE', 'REJECT', 'SUBMIT_FOR_REVIEW'].includes(action)) {
      return 'WORKFLOW';
    }
    if (['EXPORT', 'IMPORT', 'BACKUP', 'RESTORE'].includes(action)) {
      return 'SYSTEM';
    }
    if (['ASSIGN_ROLE', 'REMOVE_ROLE', 'CHANGE_PERMISSIONS'].includes(action)) {
      return 'ACCESS';
    }
    return 'DATA_CHANGE';
  }

  private determineSeverity(action: AuditAction): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    if (['DELETE', 'BULK_DELETE', 'LOGIN_FAILED', 'REMOVE_ROLE'].includes(action)) {
      return 'HIGH';
    }
    if (['BULK_UPDATE', 'RESTORE', 'CHANGE_PERMISSIONS'].includes(action)) {
      return 'MEDIUM';
    }
    return 'LOW';
  }

  async notifyCriticalEvent(log: AuditLog) {
    // Send notification to Super Admins
    const superAdmins = await db
      .select()
      .from(users)
      .where(eq(users.role, 'SUPER_ADMIN'));

    for (const admin of superAdmins) {
      await sendNotification({
        userId: admin.id,
        type: 'CRITICAL_AUDIT_EVENT',
        title: 'Critical Event Detected',
        message: `${log.action} on ${log.entity} by ${log.actorName}`,
        data: { auditLogId: log.id }
      });
    }
  }
}
```

## Middleware untuk Automatic Logging

```typescript
// middleware/audit.middleware.ts
export function auditMiddleware(entity: AuditEntity) {
  return async (req: Request, data: any, action: AuditAction) => {
    const user = await getCurrentUser();
    if (!user) return;

    const auditService = new AuditService();

    await auditService.createAuditLog({
      action,
      entity,
      entityId: data.id,
      oldValues: action === 'UPDATE' ? data.oldValues : undefined,
      newValues: action === 'DELETE' ? undefined : data,
      description: `${user.name} ${action.toLowerCase()} ${entity.toLowerCase()} ${data.name || data.id}`
    });
  };
}

// Usage example
app.post('/api/parks', auditMiddleware('PARK'), async (req, res) => {
  const parkData = req.body;
  const newPark = await createPark(parkData);
  res.json(newPark);
});

app.put('/api/parks/:id', auditMiddleware('PARK'), async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  const updatedPark = await updatePark(id, updateData);
  res.json(updatedPark);
});
```

## Features untuk MVP

- ✅ Basic CRUD logging (Create, Read, Update, Delete)
- ✅ User action tracking (login, logout, profile updates)
- ✅ Workflow tracking (submit, approve, reject)
- ✅ Change detection and storage
- ✅ Audit log viewing and filtering
- ✅ Export functionality
- ✅ Security event logging
- ✅ Search functionality
- ❌ Real-time monitoring dashboard (Phase 2)
- ❌ Automated anomaly detection (Phase 2)
- ❌ Compliance reporting (Phase 2)
- ❌ Log retention policies (Phase 2)

## Security & Compliance

- **Immutable Logs**: Audit logs cannot be modified or deleted
- **Secure Storage**: Encrypted storage for sensitive audit data
- **Access Control**: Only Super Admin can view audit logs
- **Data Retention**: Configurable retention policies
- **Tamper Detection**: Checksum validation for log integrity
- **Privacy Compliance**: GDPR and local privacy law compliance
- **Secure Export**: Encrypted export functionality
- **Regular Backup**: Automated backup of audit logs