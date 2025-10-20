# Admin CMS System & Role-Based Access Control - Taman Kehati

## Daftar Isi

1. [Arsitektur Dashboard Admin](#arsitektur-dashboard-admin)
2. [Struktur Navigasi Berbasis Role](#struktur-navigasi-berbasis-role)
3. [Super Admin Dashboard](#super-admin-dashboard)
4. [Regional Admin Dashboard](#regional-admin-dashboard)
5. [Role-Based Access Control (RBAC)](#role-based-access-control-rbac)
6. [Component Implementation](#component-implementation)
7. [Permission Management](#permission-management)

---

## Arsitektur Dashboard Admin

### 1. Dashboard Layout Structure

```typescript
// src/components/layout/DashboardLayout.tsx
interface DashboardLayoutProps {
  children: React.ReactNode;
  user: User;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  user 
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { navigationItems } = useDashboardNavigation(user.role);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform 
        transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <DashboardSidebar 
          user={user} 
          navigationItems={navigationItems}
          onClose={() => setSidebarOpen(false)}
        />
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Header */}
        <DashboardHeader 
          user={user}
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* Page Content */}
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            <Breadcrumb />
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
```

### 2. Dashboard Header Component

```typescript
// src/components/layout/DashboardHeader.tsx
interface DashboardHeaderProps {
  user: User;
  onMenuClick: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  user, 
  onMenuClick 
}) => {
  const { notifications } = useNotifications();
  const { data: pendingApprovals } = usePendingApprovals();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left: Mobile Menu & Logo */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <Menu className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center space-x-2">
            <Image 
              src="/logo-taman-kehati.png" 
              alt="Taman Kehati" 
              width={32} 
              height={32}
            />
            <span className="text-lg font-semibold text-gray-900">
              Dashboard Admin
            </span>
          </div>
        </div>

        {/* Right: Notifications & User Menu */}
        <div className="flex items-center space-x-4">
          {/* Pending Approvals Badge */}
          {pendingApprovals && pendingApprovals.count > 0 && (
            <Button variant="ghost" size="sm" className="relative">
              <AlertCircle className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white 
                             text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {pendingApprovals.count > 99 ? '99+' : pendingApprovals.count}
              </span>
            </Button>
          )}

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-green-500 text-white 
                                 text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifikasi</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <DropdownMenuItem key={notification.id} className="p-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{notification.title}</p>
                        <p className="text-xs text-gray-500">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDistanceToNow(new Date(notification.created_at), { 
                            addSuffix: true 
                          })}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  Tidak ada notifikasi baru
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user.avatar_url} />
                  <AvatarFallback>
                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:block text-sm font-medium">
                  {user.name}
                </span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                  <Badge variant="secondary" className="mt-1">
                    {user.role === 'super_admin' ? 'Super Admin' : 'Regional Admin'}
                  </Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/akun">
                  <User className="w-4 h-4 mr-2" />
                  Pengaturan Akun
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <form action="/api/auth/logout" method="POST">
                  <button type="submit" className="flex items-center w-full">
                    <LogOut className="w-4 h-4 mr-2" />
                    Keluar
                  </button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
```

### 3. Dashboard Sidebar Component

```typescript
// src/components/layout/DashboardSidebar.tsx
interface DashboardSidebarProps {
  user: User;
  navigationItems: NavigationItem[];
  onClose: () => void;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  user,
  navigationItems,
  onClose
}) => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
      {/* Logo & Close Button (Mobile) */}
      <div className="flex items-center justify-between p-6 border-b lg:hidden">
        <div className="flex items-center space-x-2">
          <Image 
            src="/logo-taman-kehati.png" 
            alt="Taman Kehati" 
            width={32} 
            height={32}
          />
          <span className="text-lg font-semibold">Taman Kehati</span>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* User Info */}
      <div className="p-6 border-b">
        <div className="flex items-center space-x-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={user.avatar_url} />
            <AvatarFallback>
              {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-gray-900">{user.name}</p>
            <p className="text-sm text-gray-500">
              {user.role === 'super_admin' ? 'Super Admin' : `Admin ${user.region_name}`}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          
          return (
            <div key={item.href}>
              {item.children ? (
                <Collapsible defaultOpen={item.expanded}>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className="w-full justify-start"
                    >
                      <item.icon className="w-4 h-4 mr-2" />
                      {item.label}
                      <ChevronDown className="w-4 h-4 ml-auto" />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-1 ml-4">
                    {item.children.map((child) => (
                      <Button
                        key={child.href}
                        variant={pathname === child.href ? "secondary" : "ghost"}
                        className="w-full justify-start text-sm"
                        asChild
                      >
                        <Link href={child.href}>
                          <child.icon className="w-4 h-4 mr-2" />
                          {child.label}
                        </Link>
                      </Button>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  asChild
                >
                  <Link href={item.href}>
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.label}
                    {item.badge && (
                      <Badge variant="destructive" className="ml-auto">
                        {item.badge.count}
                      </Badge>
                    )}
                  </Link>
                </Button>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t">
        <div className="text-xs text-gray-500">
          Taman Kehati v1.0.0
        </div>
      </div>
    </div>
  );
};
```

---

## Struktur Navigasi Berbasis Role

### 1. Navigation Hook

```typescript
// src/hooks/useDashboardNavigation.ts
interface NavigationItem {
  label: string;
  href: string;
  icon: React.ComponentType;
  badge?: {
    count: number;
    color: string;
  };
  children?: NavigationItem[];
  expanded?: boolean;
  permissions?: Permission[];
}

export const useDashboardNavigation = (role: UserRole) => {
  const { user } = useAuth();
  
  if (role === 'super_admin') {
    return {
      navigationItems: [
        {
          label: "Dashboard",
          href: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          label: "Manajemen Konten",
          href: "/dashboard/content",
          icon: FileText,
          expanded: true,
          children: [
            {
              label: "Taman Konservasi",
              href: "/dashboard/taman",
              icon: MapPin,
            },
            {
              label: "Flora",
              href: "/dashboard/taman/flora",
              icon: Leaf,
            },
            {
              label: "Fauna",
              href: "/dashboard/taman/fauna",
              icon: Bird,
            },
            {
              label: "Berita",
              href: "/dashboard/taman/berita",
              icon: Newspaper,
            },
            {
              label: "Galeri",
              href: "/dashboard/taman/galeri",
              icon: Image,
            },
          ],
        },
        {
          label: "Manajemen Pengguna",
          href: "/dashboard/users",
          icon: Users,
          children: [
            {
              label: "Daftar Pengguna",
              href: "/dashboard/users",
              icon: Users,
            },
            {
              label: "Role & Permissions",
              href: "/dashboard/users/roles",
              icon: Shield,
            },
          ],
        },
        {
          label: "Data & Ekspor",
          href: "/dashboard/data",
          icon: Database,
        },
        {
          label: "Pengaturan",
          href: "/dashboard/settings",
          icon: Settings,
        },
      ]
    };
  }

  // Regional Admin
  return {
    navigationItems: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        label: "Manajemen Konten",
        href: "/dashboard/content",
        icon: FileText,
        expanded: true,
        children: [
          {
            label: "Taman Saya",
            href: "/dashboard/taman",
            icon: MapPin,
          },
          {
            label: "Flora",
            href: "/dashboard/taman/flora",
            icon: Leaf,
          },
          {
            label: "Fauna",
            href: "/dashboard/taman/fauna",
            icon: Bird,
          },
          {
            label: "Berita",
            href: "/dashboard/taman/berita",
            icon: Newspaper,
          },
          {
            label: "Galeri",
            href: "/dashboard/taman/galeri",
            icon: Image,
          },
        ],
      },
      {
        label: "Pengaturan Akun",
        href: "/dashboard/akun",
        icon: Settings,
      },
    ]
  };
};
```

### 2. Permission System

```typescript
// src/types/auth.ts
export type UserRole = 'super_admin' | 'regional_admin';

export type Permission = 
  | 'create_content'
  | 'read_content'
  | 'update_content'
  | 'delete_content'
  | 'approve_content'
  | 'reject_content'
  | 'submit_content'
  | 'manage_users'
  | 'manage_roles'
  | 'export_data'
  | 'system_settings'
  | 'cross_region_access';

export interface RolePermissions {
  role: UserRole;
  permissions: Permission[];
  scope: 'global' | 'region_specific';
  restrictions?: string[];
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  super_admin: {
    role: 'super_admin',
    permissions: [
      'create_content',
      'read_content',
      'update_content',
      'delete_content',
      'approve_content',
      'reject_content',
      'submit_content',
      'manage_users',
      'manage_roles',
      'export_data',
      'system_settings',
      'cross_region_access',
    ],
    scope: 'global',
  },
  regional_admin: {
    role: 'regional_admin',
    permissions: [
      'create_content',
      'read_content',
      'update_content',
      'submit_content',
      'export_data',
    ],
    scope: 'region_specific',
    restrictions: [
      'cannot_delete_content',
      'cannot_approve_content',
      'cannot_manage_users',
      'cannot_access_other_regions',
    ],
  },
};
```

---

## Super Admin Dashboard

### 1. Dashboard Overview Page

```typescript
// src/app/dashboard/page.tsx (Super Admin)
const SuperAdminDashboard: React.FC = () => {
  const { data: statistics, isLoading } = useDashboardStatistics();
  const { data: recentActivity } = useRecentActivity();
  const { data: pendingApprovals } = usePendingApprovals();
  const { data: regionalStats } = useRegionalStatistics();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Dashboard Super Admin
        </h1>
        <p className="text-gray-600">
          Ringkasan KPI dan aktivitas sistem Taman Kehati
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Taman"
          value={statistics?.totalZones || 0}
          icon={MapPin}
          color="green"
          trend={{ value: "+12%", direction: "up" }}
        />
        <StatCard
          title="Total Flora"
          value={statistics?.totalFlora || 0}
          icon={Leaf}
          color="emerald"
          trend={{ value: "+8%", direction: "up" }}
        />
        <StatCard
          title="Total Fauna"
          value={statistics?.totalFauna || 0}
          icon={Bird}
          color="sky"
          trend={{ value: "+15%", direction: "up" }}
        />
        <StatCard
          title="Total Pengguna"
          value={statistics?.totalUsers || 0}
          icon={Users}
          color="purple"
          trend={{ value: "+23%", direction: "up" }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Approvals */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Menunggu Persetujuan</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/approvals">
                Lihat Semua
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <PendingApprovalsList approvals={pendingApprovals?.items || []} />
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Aktivitas Terbaru</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/activity">
                Lihat Semua
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <ActivityFeed activities={recentActivity || []} />
          </CardContent>
        </Card>
      </div>

      {/* Regional Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Statistik per Wilayah</CardTitle>
        </CardHeader>
        <CardContent>
          <RegionalStatsChart data={regionalStats || []} />
        </CardContent>
      </Card>
    </div>
  );
};
```

### 2. Content Management Pages

```typescript
// src/app/dashboard/taman/flora/page.tsx (Super Admin Flora Management)
const FloraManagementPage: React.FC = () => {
  const [filters, setFilters] = useState<FloraAdminFilters>({
    status: 'all',
    region: 'all',
    search: '',
    limit: 20,
    offset: 0,
  });

  const { data: floraData, isLoading, refetch } = useFloraAdminList(filters);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Manajemen Flora
          </h1>
          <p className="text-gray-600">
            Kelola database flora nasional dan persetujuan konten
          </p>
        </div>
        
        <div className="flex space-x-2 mt-4 sm:mt-0">
          <Button variant="outline" asChild>
            <Link href="/dashboard/taman/flora/import">
              <Upload className="w-4 h-4 mr-2" />
              Import Data
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/taman/flora/create">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Flora
            </Link>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <FloraAdminFilters 
            filters={filters} 
            onFiltersChange={setFilters} 
          />
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-green-800">
                {selectedItems.length} item dipilih
              </p>
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleBulkApprove()}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Setujui
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleBulkReject()}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Tolak
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => handleBulkDelete()}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Hapus
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data Table */}
      <Card>
        <CardContent className="p-0">
          <FloraAdminDataTable
            data={floraData?.results || []}
            loading={isLoading}
            selectedItems={selectedItems}
            onSelectionChange={setSelectedItems}
            onEdit={(id) => router.push(`/dashboard/taman/flora/${id}/edit`)}
            onView={(id) => router.push(`/dashboard/taman/flora/${id}`)}
            onApprove={handleApprove}
            onReject={handleReject}
            onDelete={handleDelete}
          />
          
          {/* Pagination */}
          {floraData && floraData.count > filters.limit && (
            <div className="p-4 border-t">
              <Pagination
                currentPage={Math.floor(filters.offset / filters.limit) + 1}
                totalPages={Math.ceil(floraData.count / filters.limit)}
                onPageChange={(page) => {
                  const newOffset = (page - 1) * filters.limit;
                  setFilters(prev => ({ ...prev, offset: newOffset }));
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
```

### 3. User Management

```typescript
// src/app/dashboard/users/page.tsx (Super Admin User Management)
const UserManagementPage: React.FC = () => {
  const [filters, setFilters] = useState<UserFilters>({
    role: 'all',
    region: 'all',
    status: 'all',
    search: '',
  });

  const { data: users, isLoading } = useUsersList(filters);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Manajemen Pengguna
          </h1>
          <p className="text-gray-600">
            Kelola akses pengguna dan role sistem
          </p>
        </div>
        
        <Button asChild>
          <Link href="/dashboard/users/create">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Pengguna
          </Link>
        </Button>
      </div>

      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Pengguna"
          value={users?.totalUsers || 0}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Super Admin"
          value={users?.superAdminCount || 0}
          icon={Shield}
          color="purple"
        />
        <StatCard
          title="Regional Admin"
          value={users?.regionalAdminCount || 0}
          icon={MapPin}
          color="green"
        />
        <StatCard
          title="Aktif"
          value={users?.activeCount || 0}
          icon={CheckCircle}
          color="emerald"
        />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <UserFilters filters={filters} onFiltersChange={setFilters} />
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <UsersDataTable
            users={users?.results || []}
            loading={isLoading}
            onEdit={(id) => router.push(`/dashboard/users/${id}/edit`)}
            onDeactivate={handleDeactivate}
            onActivate={handleActivate}
            onResetPassword={handleResetPassword}
          />
        </CardContent>
      </Card>
    </div>
  );
};
```

---

## Regional Admin Dashboard

### 1. Regional Dashboard Overview

```typescript
// src/app/dashboard/page.tsx (Regional Admin)
const RegionalAdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { data: statistics, isLoading } = useRegionalDashboardStatistics();
  const { data: myContent } = useMyContent();
  const { data: pendingSubmissions } = useMyPendingSubmissions();

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">
          Selamat Datang, {user?.name}!
        </h1>
        <p className="text-green-100">
          Dashboard Admin untuk wilayah {user?.region_name}
        </p>
      </div>

      {/* Regional Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Taman Saya"
          value={statistics?.myZones || 0}
          icon={MapPin}
          color="green"
          description={`Total di ${user?.region_name}`}
        />
        <StatCard
          title="Flora Terdaftar"
          value={statistics?.myFlora || 0}
          icon={Leaf}
          color="emerald"
        />
        <StatCard
          title="Fauna Terdaftar"
          value={statistics?.myFauna || 0}
          icon={Bird}
          color="sky"
        />
        <StatCard
          title="Menunggu Persetujuan"
          value={pendingSubmissions?.count || 0}
          icon={Clock}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Recent Content */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Konten Saya Terbaru</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/taman">Lihat Semua</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <MyContentList content={myContent || []} />
          </CardContent>
        </Card>

        {/* Pending Submissions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Menunggu Persetujuan</CardTitle>
            {pendingSubmissions && pendingSubmissions.count > 0 && (
              <Badge variant="destructive">
                {pendingSubmissions.count} pending
              </Badge>
            )}
          </CardHeader>
          <CardContent>
            <PendingSubmissionsList submissions={pendingSubmissions?.items || []} />
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Aksi Cepat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link href="/dashboard/taman/create">
                <Plus className="w-6 h-6 mb-2" />
                Tambah Taman
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link href="/dashboard/taman/flora/create">
                <Leaf className="w-6 h-6 mb-2" />
                Tambah Flora
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link href="/dashboard/taman/fauna/create">
                <Bird className="w-6 h-6 mb-2" />
                Tambah Fauna
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link href="/dashboard/data">
                <Download className="w-6 h-6 mb-2" />
                Ekspor Data
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
```

### 2. Content Submission Workflow

```typescript
// src/components/content/ContentSubmissionForm.tsx
interface ContentSubmissionFormProps<T> {
  initialData?: Partial<T>;
  contentType: 'flora' | 'fauna' | 'taman' | 'berita';
  onSubmit: (data: T) => Promise<void>;
  onSaveDraft: (data: T) => Promise<void>;
}

const ContentSubmissionForm = <T extends Record<string, any>>({
  initialData,
  contentType,
  onSubmit,
  onSaveDraft
}: ContentSubmissionFormProps<T>) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [status, setStatus] = useState<'draft' | 'ready_to_submit'>('draft');

  const handleSubmit = async (data: T) => {
    if (status === 'draft') {
      await onSaveDraft(data);
      toast.success("Draf berhasil disimpan");
    } else {
      setIsSubmitting(true);
      try {
        await onSubmit(data);
        toast.success("Konten berhasil dikirim untuk persetujuan");
        router.push(`/dashboard/${contentType}`);
      } catch (error) {
        toast.error("Gagal mengirim konten");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            {initialData ? 'Edit' : 'Tambah'} {contentType === 'flora' ? 'Flora' : 
                                           contentType === 'fauna' ? 'Fauna' : 
                                           contentType === 'taman' ? 'Taman' : 'Berita'}
          </CardTitle>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch
                checked={status === 'ready_to_submit'}
                onCheckedChange={(checked) => 
                  setStatus(checked ? 'ready_to_submit' : 'draft')
                }
              />
              <Label className="text-sm">
                {status === 'ready_to_submit' ? 'Siap Dikirim' : 'Simpan sebagai Draf'}
              </Label>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form fields would go here based on content type */}
          
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Batal
            </Button>
            
            <Button
              type="button"
              variant="secondary"
              disabled={isSavingDraft}
              onClick={() => form.handleSubmit(handleSaveDraft)()}
            >
              {isSavingDraft && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Simpan Draf
            </Button>
            
            <Button
              type="submit"
              disabled={isSubmitting || status === 'draft'}
            >
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {status === 'draft' ? 'Lengkapi Form Terlebih Dahulu' : 'Kirim untuk Persetujuan'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
```

---

## Role-Based Access Control (RBAC)

### 1. Permission Hooks

```typescript
// src/hooks/usePermissions.ts
export const usePermissions = () => {
  const { user } = useAuth();

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    
    const roleConfig = ROLE_PERMISSIONS[user.role];
    return roleConfig.permissions.includes(permission);
  };

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    return permissions.some(permission => hasPermission(permission));
  };

  const hasAllPermissions = (permissions: Permission[]): boolean => {
    return permissions.every(permission => hasPermission(permission));
  };

  const canAccessRegion = (regionCode: string): boolean => {
    if (user?.role === 'super_admin') return true;
    return user?.region_code === regionCode;
  };

  const canEditContent = (content: ContentItem): boolean => {
    if (user?.role === 'super_admin') return true;
    
    // Regional admin can only edit their own content
    if (user?.role === 'regional_admin') {
      return content.region_code === user.region_code && 
             content.created_by === user.id;
    }
    
    return false;
  };

  const canApproveContent = (content: ContentItem): boolean => {
    // Only super admin can approve content
    return user?.role === 'super_admin';
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccessRegion,
    canEditContent,
    canApproveContent,
  };
};
```

### 2. Protected Route Component

```typescript
// src/components/auth/ProtectedRoute.tsx
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  requiredPermissions?: Permission[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  requiredPermissions,
  requireAll = false,
  fallback = <AccessDenied />
}) => {
  const { user, isLoading } = useAuth();
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();

  if (isLoading) {
    return <PageSkeleton />;
  }

  if (!user) {
    redirect('/login');
  }

  // Check role requirement
  if (requiredRole && user.role !== requiredRole) {
    return fallback;
  }

  // Check permissions requirement
  if (requiredPermissions && requiredPermissions.length > 0) {
    const hasRequired = requireAll 
      ? hasAllPermissions(requiredPermissions)
      : hasAnyPermission(requiredPermissions);
    
    if (!hasRequired) {
      return fallback;
    }
  }

  return <>{children}</>;
};

// Usage example
// <ProtectedRoute requiredPermissions={['approve_content']}>
//   <ApprovalComponent />
// </ProtectedRoute>
```

### 3. Conditional Components

```typescript
// src/components/auth/ConditionalRender.tsx
interface ConditionalRenderProps {
  children: React.ReactNode;
  permissions?: Permission[];
  role?: UserRole;
  requireAll?: boolean;
  fallback?: React.ReactNode;
}

export const ConditionalRender: React.FC<ConditionalRenderProps> = ({
  children,
  permissions,
  role,
  requireAll = false,
  fallback = null
}) => {
  const { user } = useAuth();
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();

  if (role && user?.role !== role) {
    return <>{fallback}</>;
  }

  if (permissions && permissions.length > 0) {
    const hasRequired = requireAll
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
    
    if (!hasRequired) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
};

// Usage example
// <ConditionalRender permissions={['delete_content']}>
//   <Button variant="destructive">Hapus</Button>
// </ConditionalRender>
```

---

## Component Implementation

### 1. Data Table with Role-Based Actions

```typescript
// src/components/tables/FloraAdminDataTable.tsx
interface FloraAdminDataTableProps {
  data: Flora[];
  loading?: boolean;
  selectedItems: number[];
  onSelectionChange: (items: number[]) => void;
  onEdit: (id: number) => void;
  onView: (id: number) => void;
  onApprove: (id: number) => void;
  onReject: (id: number, reason: string) => void;
  onDelete: (id: number) => void;
}

const FloraAdminDataTable: React.FC<FloraAdminDataTableProps> = ({
  data,
  loading,
  selectedItems,
  onSelectionChange,
  onEdit,
  onView,
  onApprove,
  onReject,
  onDelete
}) => {
  const { user } = useAuth();
  const { canEditContent, canApproveContent } = usePermissions();

  const columns: ColumnDef<Flora>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "scientific_name",
      header: "Nama Ilmiah",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.getValue("scientific_name")}</div>
          <div className="text-sm text-gray-500">
            {row.original.local_names?.join(", ")}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "region_name",
      header: "Wilayah",
      cell: ({ row }) => row.getValue("region_name"),
    },
    {
      accessorKey: "iucn_status",
      header: "Status IUCN",
      cell: ({ row }) => (
        <IUCNStatusBadge status={row.getValue("iucn_status")} />
      ),
    },
    {
      accessorKey: "status",
      header: "Status Konten",
      cell: ({ row }) => (
        <Badge variant={
          row.original.status === 'approved' ? 'default' :
          row.original.status === 'in_review' ? 'secondary' :
          row.original.status === 'rejected' ? 'destructive' : 'outline'
        }>
          {row.original.status === 'approved' ? 'Disetujui' :
           row.original.status === 'in_review' ? 'Dalam Review' :
           row.original.status === 'rejected' ? 'Ditolak' : 'Draf'}
        </Badge>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Dibuat",
      cell: ({ row }) => (
        <div className="text-sm">
          {format(new Date(row.getValue("created_at")), "dd MMM yyyy")}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => {
        const flora = row.original;
        
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(flora.id)}>
                <Eye className="w-4 h-4 mr-2" />
                Lihat Detail
              </DropdownMenuItem>
              
              {/* Edit Action - Based on permissions */}
              {canEditContent(flora) && (
                <DropdownMenuItem onClick={() => onEdit(flora.id)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
              )}
              
              {/* Approve/Reject Actions - Super Admin only */}
              {canApproveContent(flora) && flora.status === 'in_review' && (
                <>
                  <DropdownMenuItem 
                    onClick={() => onApprove(flora.id)}
                    className="text-green-600"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Setujui
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => {
                      const reason = prompt("Alasan penolakan:");
                      if (reason) onReject(flora.id, reason);
                    }}
                    className="text-red-600"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Tolak
                  </DropdownMenuItem>
                </>
              )}
              
              {/* Delete Action - Based on permissions */}
              {user?.role === 'super_admin' && (
                <DropdownMenuSeparator />
              )}
              
              {user?.role === 'super_admin' && (
                <DropdownMenuItem 
                  onClick={() => {
                    if (confirm(`Hapus ${flora.scientific_name}?`)) {
                      onDelete(flora.id);
                    }
                  }}
                  className="text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Hapus
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useDataTable({
    data,
    columns,
    onSelectionChange: setSelectedItems,
    state: {
      rowSelection: selectedItems.reduce((acc, id) => {
        acc[id] = true;
        return acc;
      }, {} as Record<string, boolean>),
    },
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                {loading ? (
                  <div className="flex justify-center">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                ) : (
                  "Tidak ada data flora."
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
```

---

## Permission Management

### 1. API Middleware for Permission Check

```typescript
// src/lib/api-middleware.ts
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Request interceptor for authentication and permissions
apiClient.interceptors.request.use((config) => {
  const { user } = getAuth();
  
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }

  // Add region scope for regional admin
  if (user?.role === 'regional_admin' && user?.region_code) {
    config.headers['X-Region-Scope'] = user.region_code;
  }

  return config;
});

// Response interceptor for permission errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      // Permission denied
      toast.error("Anda tidak memiliki izin untuk melakukan aksi ini");
      router.push('/dashboard');
    } else if (error.response?.status === 401) {
      // Unauthorized
      toast.error("Sesi Anda telah berakhir");
      router.push('/login');
    }
    
    return Promise.reject(error);
  }
);
```

### 2. Server-side Permission Check (API Routes)

```typescript
// src/app/api/v1/flora/route.ts
export async function GET(request: Request) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const regionScope = request.headers.get('X-Region-Scope');

    let whereClause = {};

    // Regional admin can only see their region's data
    if (session.user.role === 'regional_admin') {
      whereClause = {
        region_code: session.user.region_code
      };
    }

    // Apply additional region scope if provided
    if (regionScope && session.user.role === 'regional_admin') {
      whereClause = {
        ...whereClause,
        region_code: regionScope
      };
    }

    const flora = await db.query.flora.findMany({
      where: whereClause,
      with: {
        images: true,
        region: true,
      },
      orderBy: [desc(schema.flora.created_at)],
    });

    return NextResponse.json({ results: flora, count: flora.length });
  } catch (error) {
    console.error('Error fetching flora:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // Validate required permissions
    if (!hasPermission(session.user, 'create_content')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Add region code for regional admin
    if (session.user.role === 'regional_admin') {
      body.region_code = session.user.region_code;
    }

    const newFlora = await db.insert(schema.flora).values({
      ...body,
      created_by: session.user.id,
      status: session.user.role === 'super_admin' ? 'approved' : 'draft',
    }).returning();

    return NextResponse.json(newFlora[0], { status: 201 });
  } catch (error) {
    console.error('Error creating flora:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

---

## Kesimpulan

Dokumentasi ini memberikan panduan lengkap untuk implementasi Admin CMS System dengan Role-Based Access Control (RBAC) untuk Taman Kehati, meliputi:

1. **Arsitektur Dashboard**: Layout yang responsif dengan sidebar navigasi dan header yang adaptif
2. **Role-Based Navigation**: Menu navigasi yang dinamis berdasarkan user role
3. **Permission System**: Sistem permission yang komprehensif dengan granular access control
4. **Super Admin Features**: Akses penuh untuk manajemen konten, pengguna, dan sistem
5. **Regional Admin Features**: Akses terbatas untuk konten di wilayahnya sendiri
6. **Security Implementation**: Middleware dan validasi permission di client dan server side

Dengan mengikuti arsitektur ini, sistem Taman Kehati akan memiliki admin panel yang aman, scalable, dan user-friendly dengan kontrol akses yang tepat untuk setiap role pengguna.