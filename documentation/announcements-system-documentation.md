# Announcements System (Sistem Pengumuman)

## Deskripsi

Sistem pengumuman memungkinkan Super Admin untuk membuat, mengelola, dan mengirim pengumuman kepada semua Regional Admin atau target spesifik. Regional Admin dapat melihat, menandai sebagai dibaca, mengarsipkan, dan mencari pengumuman di dashboard mereka.

## Struktur Data

### TypeScript Interfaces

```typescript
interface Announcement {
  id: string;
  title: string;
  content: string; // Rich text content
  summary: string; // Short preview for list view

  // Targeting
  targetType: 'ALL' | 'REGION' | 'USER' | 'ROLE';
  targetRef?: string; // province_id, user_id, or role_id

  // Authoring
  createdBy: string;
  createdAt: Date;
  updatedBy?: string;
  updatedAt?: Date;

  // Publishing
  publishedAt?: Date;
  expiresAt?: Date;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'EXPIRED';

  // Metadata
  category: 'SYSTEM' | 'POLICY' | 'EVENT' | 'MAINTENANCE' | 'GENERAL';
  tags: string[];
  attachments: AnnouncementAttachment[];

  // Statistics
  totalRecipients: number;
  readCount: number;
  archivedCount: number;
}

interface AnnouncementAttachment {
  id: string;
  announcementId: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
  url: string;
  uploadedAt: Date;
}

interface AnnouncementStatus {
  id: string;
  announcementId: string;
  userId: string;
  status: 'UNREAD' | 'READ' | 'ARCHIVED';
  readAt?: Date;
  archivedAt?: Date;
}

interface AnnouncementRecipient {
  userId: string;
  userName: string;
  userEmail: string;
  userRole: 'SUPER_ADMIN' | 'REGIONAL_ADMIN';
  regionId?: string;
  regionName?: string;
  readAt?: Date;
  archivedAt?: Date;
}
```

## Komponen UI

### 1. Super Admin - Announcement Management

```typescript
// app/admin/announcements/page.tsx
export default function AnnouncementsManagement() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Manajemen Pengumuman</h1>
          <p className="text-gray-600">
            Buat dan kelola pengumuman untuk Regional Admin
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Buat Pengumuman Baru
        </Button>
      </div>

      <AnnouncementsStats announcements={announcements} />

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Daftar Pengumuman</CardTitle>
            <div className="flex gap-2">
              <FilterDropdown />
              <SearchBar placeholder="Cari pengumuman..." />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <AnnouncementsTable
            announcements={announcements}
            onSelect={setSelectedAnnouncement}
            onEdit={(announcement) => {
              setSelectedAnnouncement(announcement);
              setIsCreateModalOpen(true);
            }}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      <CreateEditAnnouncementModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setSelectedAnnouncement(null);
        }}
        announcement={selectedAnnouncement}
        onSave={handleSave}
      />
    </div>
  );
}
```

### 2. Announcement Table Component

```typescript
// components/admin/AnnouncementsTable.tsx
interface AnnouncementsTableProps {
  announcements: Announcement[];
  onSelect: (announcement: Announcement) => void;
  onEdit: (announcement: Announcement) => void;
  onDelete: (id: string) => void;
}

export function AnnouncementsTable({
  announcements,
  onSelect,
  onEdit,
  onDelete
}: AnnouncementsTableProps) {
  const formatTargetType = (type: string) => {
    const types = {
      ALL: 'Semua Admin',
      REGION: 'Per Provinsi',
      USER: 'User Spesifik',
      ROLE: 'Per Role'
    };
    return types[type as keyof typeof types] || type;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      LOW: 'bg-gray-100 text-gray-800',
      MEDIUM: 'bg-blue-100 text-blue-800',
      HIGH: 'bg-orange-100 text-orange-800',
      URGENT: 'bg-red-100 text-red-800'
    };
    return colors[priority as keyof typeof colors];
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      DRAFT: 'secondary',
      PUBLISHED: 'default',
      ARCHIVED: 'outline',
      EXPIRED: 'destructive'
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {status === 'DRAFT' ? 'Draft' :
         status === 'PUBLISHED' ? 'Diterbitkan' :
         status === 'ARCHIVED' ? 'Diarsipkan' : 'Kadaluarsa'}
      </Badge>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-4">Judul</th>
            <th className="text-left py-3 px-4">Target</th>
            <th className="text-center py-3 px-4">Prioritas</th>
            <th className="text-center py-3 px-4">Status</th>
            <th className="text-left py-3 px-4">Pembaca</th>
            <th className="text-left py-3 px-4">Tanggal</th>
            <th className="text-center py-3 px-4">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {announcements.map((announcement) => (
            <tr
              key={announcement.id}
              className="border-b hover:bg-gray-50 cursor-pointer"
              onClick={() => onSelect(announcement)}
            >
              <td className="py-3 px-4">
                <div>
                  <div className="font-medium">{announcement.title}</div>
                  <div className="text-sm text-gray-500 line-clamp-1">
                    {announcement.summary}
                  </div>
                </div>
              </td>
              <td className="py-3 px-4">
                <span className="text-sm">
                  {formatTargetType(announcement.targetType)}
                </span>
              </td>
              <td className="py-3 px-4 text-center">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(announcement.priority)}`}>
                  {announcement.priority === 'LOW' ? 'Rendah' :
                   announcement.priority === 'MEDIUM' ? 'Sedang' :
                   announcement.priority === 'HIGH' ? 'Tinggi' : 'Darurat'}
                </span>
              </td>
              <td className="py-3 px-4 text-center">
                {getStatusBadge(announcement.status)}
              </td>
              <td className="py-3 px-4">
                <div className="text-sm">
                  <div>{announcement.readCount}/{announcement.totalRecipients} dibaca</div>
                  <div className="text-gray-500">
                    {Math.round((announcement.readCount / announcement.totalRecipients) * 100)}%
                  </div>
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="text-sm">
                  <div>{formatDate(announcement.createdAt)}</div>
                  {announcement.expiresAt && (
                    <div className="text-gray-500">
                      Kadaluarsa: {formatDate(announcement.expiresAt)}
                    </div>
                  )}
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(announcement);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(announcement);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(announcement.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### 3. Create/Edit Announcement Modal

```typescript
// components/admin/CreateEditAnnouncementModal.tsx
interface CreateEditAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  announcement?: Announcement | null;
  onSave: (announcement: Partial<Announcement>) => void;
}

export function CreateEditAnnouncementModal({
  isOpen,
  onClose,
  announcement,
  onSave
}: CreateEditAnnouncementModalProps) {
  const [formData, setFormData] = useState<Partial<Announcement>>({
    title: announcement?.title || '',
    content: announcement?.content || '',
    summary: announcement?.summary || '',
    targetType: announcement?.targetType || 'ALL',
    targetRef: announcement?.targetRef || '',
    priority: announcement?.priority || 'MEDIUM',
    category: announcement?.category || 'GENERAL',
    tags: announcement?.tags || [],
    expiresAt: announcement?.expiresAt || null,
    status: announcement?.status || 'DRAFT'
  });

  const [attachments, setAttachments] = useState<AnnouncementAttachment[]>(
    announcement?.attachments || []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const submission = {
      ...formData,
      id: announcement?.id || generateId(),
      updatedAt: new Date(),
      attachments
    };

    if (!announcement) {
      submission.createdBy = getCurrentUser().id;
      submission.createdAt = new Date();
    }

    await onSave(submission);
    onClose();
  };

  const handlePublish = async () => {
    await onSave({
      ...formData,
      status: 'PUBLISHED',
      publishedAt: new Date()
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {announcement ? 'Edit Pengumuman' : 'Buat Pengumuman Baru'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <Label htmlFor="title">Judul Pengumuman</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    title: e.target.value
                  }))}
                  placeholder="Masukkan judul pengumuman"
                  required
                />
              </div>

              <div>
                <Label htmlFor="summary">Ringkasan</Label>
                <Textarea
                  id="summary"
                  value={formData.summary}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    summary: e.target.value
                  }))}
                  placeholder="Ringkasan singkat pengumuman (maks. 200 karakter)"
                  maxLength={200}
                  rows={2}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.summary?.length || 0}/200 karakter
                </p>
              </div>

              <div>
                <Label htmlFor="content">Isi Pengumuman</Label>
                <RichTextEditor
                  value={formData.content}
                  onChange={(content) => setFormData(prev => ({
                    ...prev,
                    content
                  }))}
                  placeholder="Tulis isi pengumuman lengkap..."
                />
              </div>

              <div>
                <Label>Lampiran</Label>
                <FileUpload
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                  maxFiles={5}
                  maxSize={10 * 1024 * 1024} // 10MB
                  onUpload={(files) => handleFileUpload(files)}
                  existingFiles={attachments}
                  onRemove={(fileId) => handleFileRemove(fileId)}
                />
              </div>
            </div>

            {/* Settings Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Pengaturan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Kategori</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData(prev => ({
                        ...prev,
                        category: value as Announcement['category']
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SYSTEM">Sistem</SelectItem>
                        <SelectItem value="POLICY">Kebijakan</SelectItem>
                        <SelectItem value="EVENT">Acara</SelectItem>
                        <SelectItem value="MAINTENANCE">Pemeliharaan</SelectItem>
                        <SelectItem value="GENERAL">Umum</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Prioritas</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value) => setFormData(prev => ({
                        ...prev,
                        priority: value as Announcement['priority']
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LOW">Rendah</SelectItem>
                        <SelectItem value="MEDIUM">Sedang</SelectItem>
                        <SelectItem value="HIGH">Tinggi</SelectItem>
                        <SelectItem value="URGENT">Darurat</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Tanggal Kadaluarsa</Label>
                    <Input
                      type="datetime-local"
                      value={formData.expiresAt ?
                        new Date(formData.expiresAt).toISOString().slice(0, 16) :
                        ''
                      }
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        expiresAt: e.target.value ? new Date(e.target.value) : null
                      }))}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Kosongkan jika tidak ada kadaluarsa
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Target Pengiriman</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Tujuan Pengumuman</Label>
                    <Select
                      value={formData.targetType}
                      onValueChange={(value) => setFormData(prev => ({
                        ...prev,
                        targetType: value as Announcement['targetType'],
                        targetRef: ''
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">Semua Regional Admin</SelectItem>
                        <SelectItem value="REGION">Per Provinsi</SelectItem>
                        <SelectItem value="USER">User Spesifik</SelectItem>
                        <SelectItem value="ROLE">Per Role</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.targetType === 'REGION' && (
                    <div>
                      <Label>Pilih Provinsi</Label>
                      <ProvinceSelector
                        value={formData.targetRef}
                        onChange={(provinceId) => setFormData(prev => ({
                          ...prev,
                          targetRef: provinceId
                        }))}
                      />
                    </div>
                  )}

                  {formData.targetType === 'USER' && (
                    <div>
                      <Label>Pilih User</Label>
                      <UserSelector
                        value={formData.targetRef}
                        onChange={(userId) => setFormData(prev => ({
                          ...prev,
                          targetRef: userId
                        }))}
                        filterRole="REGIONAL_ADMIN"
                      />
                    </div>
                  )}

                  {formData.targetType === 'ROLE' && (
                    <div>
                      <Label>Pilih Role</Label>
                      <Select
                        value={formData.targetRef}
                        onValueChange={(value) => setFormData(prev => ({
                          ...prev,
                          targetRef: value
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="REGIONAL_ADMIN">Regional Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {formData.targetType && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Estimasi Penerima:</strong> {getEstimatedRecipients(formData)}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <TagInput
                    value={formData.tags || []}
                    onChange={(tags) => setFormData(prev => ({
                      ...prev,
                      tags
                    }))}
                    placeholder="Tambah tag..."
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex justify-between items-center pt-6 border-t">
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Batal
              </Button>
              {!announcement && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => onSave({
                    ...formData,
                    status: 'DRAFT'
                  })}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Simpan Draft
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button type="submit">
                {announcement ? 'Perbarui' : 'Simpan'}
              </Button>
              {announcement?.status !== 'PUBLISHED' && (
                <Button
                  type="button"
                  onClick={handlePublish}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Terbitkan
                </Button>
              )}
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

### 4. Regional Admin - Announcement Dashboard

```typescript
// app/admin/regional/dashboard/page.tsx
export default function RegionalAdminDashboard() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  return (
    <div className="space-y-6">
      {/* Header dengan notifikasi */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Regional Admin</h1>
          <p className="text-gray-600">
            Selamat datang di dashboard manajemen Taman Kehati
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Pengumuman
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Pengumuman Terbaru */}
      {unreadCount > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800 flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Pengumuman Baru ({unreadCount})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RecentAnnouncements
              announcements={announcements.filter(a => a.status === 'UNREAD')}
              onRead={markAsRead}
              onArchive={archiveAnnouncement}
            />
          </CardContent>
        </Card>
      )}

      {/* Dashboard Grid */}
      <DashboardGrid />
    </div>
  );
}

// Recent Announcements Component
interface RecentAnnouncementsProps {
  announcements: Announcement[];
  onRead: (id: string) => void;
  onArchive: (id: string) => void;
}

function RecentAnnouncements({
  announcements,
  onRead,
  onArchive
}: RecentAnnouncementsProps) {
  if (announcements.length === 0) {
    return (
      <p className="text-center text-gray-500 py-4">
        Tidak ada pengumuman baru
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {announcements.map((announcement) => (
        <div
          key={announcement.id}
          className="bg-white p-4 rounded-lg border border-blue-200"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  announcement.priority === 'URGENT' ? 'bg-red-100 text-red-800' :
                  announcement.priority === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                  announcement.priority === 'MEDIUM' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
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
              <p className="text-sm text-gray-600 line-clamp-2">
                {announcement.summary}
              </p>
              {announcement.attachments.length > 0 && (
                <div className="flex items-center gap-2 mt-2">
                  <Paperclip className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-500">
                    {announcement.attachments.length} lampiran
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 ml-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRead(announcement.id)}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onArchive(announcement.id)}
              >
                <Archive className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
      <div className="text-center">
        <Button variant="outline" size="sm">
          Lihat Semua Pengumuman
        </Button>
      </div>
    </div>
  );
}
```

## API Endpoints

```typescript
// app/api/announcements/route.ts
export async function GET(request: Request) {
  const user = await getCurrentUser();
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const unread = searchParams.get('unread');

  let query = db.select().from(announcements);

  // Filter berdasarkan user role dan target
  if (user.role === 'REGIONAL_ADMIN') {
    query = query
      .where(
        or(
          eq(announcements.targetType, 'ALL'),
          and(
            eq(announcements.targetType, 'REGION'),
            eq(announcements.targetRef, user.regionId)
          ),
          and(
            eq(announcements.targetType, 'USER'),
            eq(announcements.targetRef, user.id)
          ),
          and(
            eq(announcements.targetType, 'ROLE'),
            eq(announcements.targetRef, user.role)
          )
        )
      );
  }

  // Filter status
  if (status) {
    query = query.where(eq(announcements.status, status));
  }

  // Filter unread untuk regional admin
  if (unread === 'true' && user.role === 'REGIONAL_ADMIN') {
    const unreadIds = await db
      .select({ announcementId: announcementStatus.announcementId })
      .from(announcementStatus)
      .where(
        and(
          eq(announcementStatus.userId, user.id),
          eq(announcementStatus.status, 'UNREAD')
        )
      );

    query = query.where(
      inArray(announcements.id, unreadIds.map(u => u.announcementId))
    );
  }

  const data = await query.orderBy(desc(announcements.createdAt));

  return Response.json(data);
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (user.role !== 'SUPER_ADMIN') {
    return new Response('Unauthorized', { status: 401 });
  }

  const body = await request.json();

  // Calculate total recipients
  const totalRecipients = await calculateRecipients(
    body.targetType,
    body.targetRef
  );

  const newAnnouncement = await db.insert(announcements).values({
    ...body,
    id: generateId(),
    createdBy: user.id,
    createdAt: new Date(),
    totalRecipients
  }).returning();

  // Create initial announcement statuses for all recipients
  if (body.status === 'PUBLISHED') {
    await createAnnouncementStatuses(newAnnouncement[0].id, body.targetType, body.targetRef);
  }

  // Create audit log
  await createAuditLog({
    userId: user.id,
    action: 'CREATE',
    entity: 'ANNOUNCEMENT',
    entityId: newAnnouncement[0].id,
    oldValues: null,
    newValues: newAnnouncement[0]
  });

  return Response.json(newAnnouncement[0]);
}

// app/api/announcements/[id]/read/route.ts
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  const { id } = params;

  // Update or create announcement status
  await db.insert(announcementStatus).values({
    id: generateId(),
    announcementId: id,
    userId: user.id,
    status: 'READ',
    readAt: new Date()
  }).onConflictDoUpdate({
    target: [announcementStatus.announcementId, announcementStatus.userId],
    set: {
      status: 'READ',
      readAt: new Date()
    }
  });

  // Update read count
  await db
    .update(announcements)
    .set({
      readCount: sql`${announcements.readCount} + 1`
    })
    .where(eq(announcements.id, id));

  return Response.json({ success: true });
}

// app/api/announcements/[id]/archive/route.ts
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  const { id } = params;

  await db.insert(announcementStatus).values({
    id: generateId(),
    announcementId: id,
    userId: user.id,
    status: 'ARCHIVED',
    archivedAt: new Date()
  }).onConflictDoUpdate({
    target: [announcementStatus.announcementId, announcementStatus.userId],
    set: {
      status: 'ARCHIVED',
      archivedAt: new Date()
    }
  });

  // Update archived count
  await db
    .update(announcements)
    .set({
      archivedCount: sql`${announcements.archivedCount} + 1`
    })
    .where(eq(announcements.id, id));

  return Response.json({ success: true });
}
```

## Database Schema

```sql
-- Announcements table
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  summary TEXT,
  target_type VARCHAR(20) NOT NULL CHECK (target_type IN ('ALL', 'REGION', 'USER', 'ROLE')),
  target_ref VARCHAR(255),
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES users(id),
  updated_at TIMESTAMP,
  published_at TIMESTAMP,
  expires_at TIMESTAMP,
  priority VARCHAR(10) NOT NULL DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
  status VARCHAR(20) NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED', 'EXPIRED')),
  category VARCHAR(20) NOT NULL DEFAULT 'GENERAL' CHECK (category IN ('SYSTEM', 'POLICY', 'EVENT', 'MAINTENANCE', 'GENERAL')),
  tags TEXT[],
  total_recipients INTEGER NOT NULL DEFAULT 0,
  read_count INTEGER NOT NULL DEFAULT 0,
  archived_count INTEGER NOT NULL DEFAULT 0
);

-- Announcement attachments
CREATE TABLE announcement_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  announcement_id UUID NOT NULL REFERENCES announcements(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  file_size INTEGER NOT NULL,
  url VARCHAR(500) NOT NULL,
  uploaded_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Announcement read status
CREATE TABLE announcement_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  announcement_id UUID NOT NULL REFERENCES announcements(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'UNREAD' CHECK (status IN ('UNREAD', 'READ', 'ARCHIVED')),
  read_at TIMESTAMP,
  archived_at TIMESTAMP,
  UNIQUE(announcement_id, user_id)
);

-- Indexes
CREATE INDEX idx_announcements_status ON announcements(status);
CREATE INDEX idx_announcements_target ON announcements(target_type, target_ref);
CREATE INDEX idx_announcements_created ON announcements(created_at DESC);
CREATE INDEX idx_announcement_status_user ON announcement_status(user_id, status);
CREATE INDEX idx_announcement_status_announcement ON announcement_status(announcement_id, status);
```

## Email Notifications (Optional)

```typescript
// services/notification.service.ts
export class AnnouncementNotificationService {
  async sendEmailNotifications(announcement: Announcement) {
    const recipients = await getAnnouncementRecipients(
      announcement.targetType,
      announcement.targetRef
    );

    for (const recipient of recipients) {
      await this.sendEmail({
        to: recipient.email,
        subject: `Pengumuman Baru: ${announcement.title}`,
        template: 'announcement-email',
        data: {
          recipientName: recipient.name,
          announcementTitle: announcement.title,
          announcementSummary: announcement.summary,
          announcementUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/admin/announcements/${announcement.id}`,
          priority: announcement.priority
        }
      });
    }
  }

  async sendExpiryNotifications() {
    const expiringAnnouncements = await db
      .select()
      .from(announcements)
      .where(
        and(
          eq(announcements.status, 'PUBLISHED'),
          lte(announcements.expiresAt, addDays(new Date(), 1)),
          gt(announcements.expiresAt, new Date())
        )
      );

    for (const announcement of expiringAnnouncements) {
      const recipients = await getAnnouncementRecipients(
        announcement.targetType,
        announcement.targetRef
      );

      for (const recipient of recipients) {
        await this.sendEmail({
          to: recipient.email,
          subject: 'Pengumuman Akan Kadaluarsa',
          template: 'announcement-expiry',
          data: {
            recipientName: recipient.name,
            announcementTitle: announcement.title,
            expiryDate: announcement.expiresAt
          }
        });
      }
    }
  }
}
```

## Security & Validation

- **Role Validation**: Hanya Super Admin yang dapat buat/edit/hapus pengumuman
- **Target Validation**: Validasi target audience sesuai dengan user role
- **Content Sanitization**: Sanitasi rich text content untuk mencegah XSS
- **File Upload Validation**: Validasi file type, size, dan scanning virus
- **Rate Limiting**: Limit jumlah pengumuman yang dapat dibuat per hari
- **Audit Trail**: Semua create/update/delete tercatat dalam audit log
- **Permission Check**: User hanya dapat melihat pengumuman yang ditujukan untuk mereka

## Features untuk MVP

- ✅ Create, read, update, delete announcements (Super Admin)
- ✅ Targeted announcements (all, per region, per user, per role)
- ✅ Read/unread status tracking
- ✅ Archive functionality
- ✅ Priority levels (Low, Medium, High, Urgent)
- ✅ Categories and tags
- ✅ File attachments
- ✅ Expiration dates
- ✅ Read statistics
- ❌ Email notifications (Phase 2)
- ❌ Push notifications (Phase 2)
- ❌ Scheduled announcements (Phase 2)