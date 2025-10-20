# Dokumentasi Frontend Taman Kehati

## Daftar Isi

1. [Instruksi Teknis Setup](#instruksi-teknis-setup)
2. [Arsitektur Sistem](#arsitektur-sistem)
3. [Website Publik](#website-publik)
4. [Sistem Admin CMS](#sistem-admin-cms)
5. [Role-Based Access Control (RBAC)](#role-based-access-control-rbac)
6. [Workflow dan Manajemen Data](#workflow-dan-manajemen-data)
7. [Komponen UI/UX](#komponen-uiux)
8. [Integrasi API](#integrasi-api)
9. [Responsivitas dan Aksesibilitas](#responsivitas-dan-aksesibilitas)

---

## Instruksi Teknis Setup

Sebelum mengintegrasikan komponen React ke dalam codebase, pastikan proyek memiliki setup berikut:

### Prasyarat Teknologi

- **Next.js 15** dengan App Router
- **TypeScript** untuk type safety
- **Tailwind CSS v4.0** untuk styling
- **shadcn/ui** untuk komponen UI
- **React Query (@tanstack/react-query)** untuk state management
- **Lucide React** untuk ikon

### Struktur Proyek

```
src/
├── app/                    # Next.js 15 App Router
│   ├── page.tsx           # Homepage publik
│   ├── layout.tsx         # Root layout
│   ├── dashboard/         # Admin dashboard
│   ├── flora/             # Halaman flora publik
│   ├── fauna/             # Halaman fauna publik
│   ├── taman/             # Halaman taman publik
│   ├── login/             # Login admin
│   └── (public routes)    # Rute publik lainnya
├── components/
│   ├── Layout.tsx         # Layout utama
│   ├── DashboardLayout.tsx # Layout dashboard admin
│   ├── Header.tsx         # Header navigasi
│   ├── Footer.tsx         # Footer
│   └── ui/                # Komponen shadcn/ui
├── contexts/
│   └── AuthContext.tsx    # Context autentikasi
├── lib/
│   └── api.ts             # Konfigurasi API client
├── services/
│   └── api.ts             # Service layer API
└── types/
   └── index.ts           # Type definitions
```

### Instalasi dan Konfigurasi

#### 1. Instalasi Dependencies

```bash
npm install next@15 react@19 react-dom@19
npm install -D typescript @types/react @types/node
npm install tailwindcss@4 @tailwindcss/postcss
npm install @radix-ui/react-*
npm install @tanstack/react-query lucide-react
npm install better-auth drizzle-orm pg
```

#### 2. Konfigurasi TypeScript

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

#### 3. Konfigurasi Tailwind CSS

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: "#f4f0ee",
          500: "#4d805f",
          600: "#356447",
          700: "#294e37",
          900: "#233c2b",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontFamily: {
        primary: ["TAN Aegean", "sans-serif"],
        secondary: ["Helvetica Now", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

#### 4. Konfigurasi Next.js App Router

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
  },
}

module.exports = nextConfig
```

---

## Arsitektur Sistem

### 1. Frontend Architecture

Taman Kehati menggunakan arsitektur **modular** dengan pemisahan yang jelas antara:

- **Public Website**: Interface untuk pengunjung umum
- **Admin CMS**: Interface untuk Super Admin dan Regional Admin
- **Shared Components**: Komponen yang digunakan kedua interface

### 2. Tech Stack

| Komponen         | Teknologi    | Versi  | Fungsi                               |
| ---------------- | ------------ | ------ | ------------------------------------ |
| Framework        | Next.js      | 15.x   | Full-stack React framework           |
| Language         | TypeScript   | 5.x    | Type safety dan developer experience |
| Styling          | Tailwind CSS | 4.0    | Utility-first CSS framework          |
| UI Library       | shadcn/ui    | Latest | Komponen UI modern dan accessible    |
| State Management | React Query  | 5.x    | Server state management              |
| Icons            | Lucide React | Latest | Icon library                         |
| Maps             | (TBD)        | -      | Integrasi peta interaktif            |

### 3. Color Palette & Design System

```css
/* Primary Colors */
--color-primary-900: #233c2b; /* Dark green */
--color-primary-700: #294e37; /* Dark forest */
--color-primary-600: #356447; /* Forest green */
--color-primary-500: #4d805f; /* Medium green */
--color-neutral-50: #f4f0ee; /* Light cream */

/* Typography */
--font-primary: "TAN Aegean", sans-serif;
--font-secondary: "Helvetica Now", sans-serif;
```

### 4. Project Structure Detail

```
src/
├── app/                          # Next.js App Router
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout component
│   ├── page.tsx                 # Homepage
│   ├── (auth)/                  # Authentication routes group
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/               # Admin dashboard
│   │   ├── layout.tsx           # Dashboard layout
│   │   ├── page.tsx             # Dashboard overview
│   │   ├── taman/               # Zone management
│   │   ├── flora/               # Flora management
│   │   ├── fauna/               # Fauna management
│   │   ├── berita/              # News management
│   │   ├── galeri/              # Gallery management
│   │   ├── data/                # Data export
│   │   └── akun/                # Account settings
│   ├── (public)/                # Public routes group
│   │   ├── flora/
│   │   │   ├── page.tsx         # Flora listing
│   │   │   └── [id]/            # Flora detail
│   │   ├── fauna/
│   │   ├── taman/
│   │   ├── berita/
│   │   ├── peta/
│   │   └── kontak/
│   └── api/                     # API routes
│       ├── auth/
│       ├── public/
│       └── v1/                  # Admin API endpoints
├── components/                  # Reusable components
│   ├── ui/                      # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── table.tsx
│   │   └── ...
│   ├── layout/                  # Layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Sidebar.tsx
│   │   └── DashboardLayout.tsx
│   ├── forms/                   # Form components
│   │   ├── FloraForm.tsx
│   │   ├── FaunaForm.tsx
│   │   └── ZoneForm.tsx
│   ├── charts/                  # Chart components
│   │   └── StatisticsChart.tsx
│   └── common/                  # Common components
│       ├── SearchBar.tsx
│       ├── FilterPanel.tsx
│       ├── Pagination.tsx
│       └── LoadingSpinner.tsx
├── lib/                         # Utility libraries
│   ├── api.ts                   # API client configuration
│   ├── auth.ts                  # Authentication utilities
│   ├── utils.ts                 # General utilities
│   └── validations.ts           # Form validations
├── services/                    # API service layer
│   ├── api.ts                   # Base API service
│   ├── flora.ts                 # Flora API service
│   ├── fauna.ts                 # Fauna API service
│   ├── taman.ts                 # Zone API service
│   └── auth.ts                  # Auth API service
├── types/                       # TypeScript type definitions
│   ├── api.ts                   # API response types
│   ├── auth.ts                  # Authentication types
│   ├── flora.ts                 # Flora types
│   ├── fauna.ts                 # Fauna types
│   └── common.ts                # Common types
├── hooks/                       # Custom React hooks
│   ├── useAuth.ts               # Authentication hook
│   ├── usePermissions.ts        # Permission hook
│   ├── useLocalStorage.ts       # Local storage hook
│   └── useDebounce.ts           # Debounce hook
└── contexts/                    # React contexts
    ├── AuthContext.tsx          # Authentication context
    └── ThemeContext.tsx         # Theme context
```

---

## Website Publik

### 1. Struktur Navigasi

#### Header Navigation

```
┌─────────────────────────────────────────────────────────┐
│ Logo Taman Kehati        [Navigasi Utama]    [Chatbot] │
├─────────────────────────────────────────────────────────┤
│ Beranda │ Taman │ Flora │ Fauna │ Berita │ Peta │ Hubungi │
└─────────────────────────────────────────────────────────┘
```

#### Main Navigation Items

- **Beranda** (`/`) - Landing page dengan overview sistem
- **Taman** (`/taman`) - Direktori taman konservasi
- **Flora** (`/flora`) - Database flora Indonesia
- **Fauna** (`/fauna`) - Database fauna Indonesia
- **Berita** (`/berita`) - Artikel dan berita konservasi
- **Peta** (`/peta`) - Peta interaktif lokasi konservasi
- **Hubungi** (`/kontak`) - Informasi kontak dan form

### 2. Landing Page (Homepage)

#### Hero Section

```typescript
interface HeroSection {
  title: "Taman Kehati";
  subtitle: "Platform Nasional untuk Konservasi, Edukasi, dan Pemberdayaan Keanekaragaman Hayati Indonesia";
  primaryCTA: {
    text: "Jelajahi Peta";
    href: "/peta";
  };
  secondaryCTA: {
    text: "Direktori Taman";
    href: "/taman";
  };
}
```

#### Tiga Pilar Utama

1. **Konservasi** - Perlindungan habitat dan spesies endemik
2. **Edukasi** - Penyebaran pengetahuan keanekaragaman hayati
3. **Pemberdayaan** - Peningkatan kapasitas masyarakat lokal

#### Featured Content Sections

- **Statistik Nasional**: Tampilan angka capaian konservasi
- **Taman Unggulan**: Showcase taman konservasi terpilih
- **Koleksi Flora/Fauna**: Highlight spesies endemik
- **Berita Terbaru**: Update terkini konservasi

### 3. Halaman Database Publik

#### Flora Page (`/flora`)

```typescript
interface FloraPageProps {
  searchParams: {
    search?: string; // Nama ilmiah/lokal
    wilayah?: string; // Filter region
    status_iucn?: string; // Filter status konservasi IUCN
    limit?: number; // Items per page
    offset?: number; // Pagination
  };
}
```

**UI Components:**

- Search bar dengan filter advanced
- Grid layout untuk kartu flora
- Kategori status IUCN dengan color coding
- Pagination component
- Filter sidebar dengan checkbox

#### Fauna Page (`/fauna`)

Struktur serupa dengan Flora page, dengan filter tambahan untuk:

- Ordo (taksonomi)
- Status hama
- Habitat spesifik

#### Detail Pages

```typescript
// /flora/[id] dan /fauna/[id]
interface SpeciesDetailPage {
  id: string;
  content: {
    scientificInfo: SpeciesTaxonomy;
    localNames: string[];
    conservation: ConservationStatus;
    images: ImageGallery;
    habitat: HabitatInfo;
    distribution: GeoDistribution;
  };
}
```

### 4. Chatbot Integration

#### Public Chatbot (`/api/public/chat`)

```typescript
interface ChatbotProps {
  // Komponen chatbot menggunakan API endpoint:
  endpoint: "/api/public/chat";
  features: {
    rag: boolean; // Retrieval Augmented Generation
    streaming: boolean; // Real-time response streaming
    tools: boolean; // Tool calling capability
  };
  ui: {
    floatingButton: boolean;
    chatWindow: ChatWindow;
    messageTypes: ["text", "image", "document"];
  };
}
```

**Chat Features:**

- Real-time chat dengan RAG system
- Knowledge base tentang keanekaragaman hayati Indonesia
- Streaming responses untuk UX yang lebih baik
- Image upload untuk identifikasi spesies

---

## Sistem Admin CMS

### 1. Dashboard Architecture

Sistem admin menggunakan **Role-Based Dashboard** dengan layout yang berbeda untuk setiap role:

#### Dashboard Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│ [Logo] Dashboard Admin              [User] [Bell] [Logout] │
├─────────────────────────────────────────────────────────┤
│ Sidebar Navigation  │  Main Content Area                │
│                     │                                   │
│ • Dashboard         │  [Page Content dengan             │
│ • Profil Taman      │    Breadcrumb Navigation]        │
│ • Flora Taman       │                                   │
│ • Fauna Taman       │                                   │
│ • Galeri           │                                   │
│ • Agenda            │                                   │
│ • Berita            │                                   │
│ • Data & Ekspor     │                                   │
│ • Pengaturan        │                                   │
└─────────────────────────────────────────────────────────┘
```

### 2. Super Admin Dashboard

#### Navigation Menu (Full Access)

```typescript
interface SuperAdminNavigation {
  dashboard: {
    href: "/dashboard";
    permissions: ["read"];
    description: "Ringkasan dan KPI nasional";
  };
  contentManagement: {
    zones: {
      href: "/dashboard/taman";
      permissions: ["create", "read", "update", "delete"];
    };
    flora: {
      href: "/dashboard/taman/flora";
      permissions: ["create", "read", "update", "delete", "approve", "reject"];
    };
    fauna: {
      href: "/dashboard/taman/fauna";
      permissions: ["create", "read", "update", "delete", "approve", "reject"];
    };
    articles: {
      href: "/dashboard/taman/berita";
      permissions: ["create", "read", "update", "delete", "approve", "reject"];
    };
    gallery: {
      href: "/dashboard/taman/galeri";
      permissions: ["create", "read", "update", "delete", "approve", "reject"];
    };
  };
  userManagement: {
    users: {
      href: "/super/users";
      permissions: ["create", "read", "update", "delete", "activate", "deactivate"];
    };
    roles: {
      href: "/super/roles";
      permissions: ["create", "read", "update", "delete"];
    };
  };
  systemSettings: {
    href: "/dashboard/akun";
    permissions: ["read", "update"];
  };
  dataExport: {
    href: "/dashboard/data";
    permissions: ["read", "export"];
  };
}
```

#### Dashboard Overview Page

```typescript
interface SuperAdminDashboard {
  summaryCards: {
    totalZones: number;
    totalFlora: number;
    totalFauna: number;
    totalUsers: number;
    pendingApprovals: number;
    regionalStats: RegionalStatistics[];
  };
  recentActivity: ActivityFeed[];
  approvalQueue: PendingApproval[];
  systemHealth: SystemStatus;
}
```

### 3. Regional Admin Dashboard

#### Limited Navigation Menu

```typescript
interface RegionalAdminNavigation {
  dashboard: {
    href: "/dashboard";
    regionScope: boolean; // Hanya data region sendiri
  };
  contentManagement: {
    zones: {
      href: "/dashboard/taman";
      permissions: ["create", "read", "update"]; // Tidak bisa delete
      scope: "own_region";
    };
    flora: {
      href: "/dashboard/taman/flora";
      permissions: ["create", "read", "update", "submit"]; // Submit untuk approval
      scope: "own_region";
    };
    fauna: {
      href: "/dashboard/taman/fauna";
      permissions: ["create", "read", "update", "submit"];
      scope: "own_region";
    };
  };
  // Tidak memiliki akses ke:
  // - User management
  // - System settings (global)
  // - Cross-region data
}
```

---

## Role-Based Access Control (RBAC)

### 1. User Roles & Permissions

#### Super Admin

```typescript
interface SuperAdminPermissions {
  scope: "global";
  contentAccess: {
    allRegions: true;
    createZones: true;
    approveContent: true;
    deleteContent: true;
  };
  userManagement: {
    createUsers: true;
    modifyRoles: true;
    activateDeactivate: true;
    crossRegionAccess: true;
  };
  systemSettings: {
    globalSettings: true;
    apiConfigurations: true;
    backupRestore: true;
  };
}
```

#### Regional Admin

```typescript
interface RegionalAdminPermissions {
  scope: "region_specific"; // Berdasarkan region_code
  contentAccess: {
    ownRegionOnly: true;
    createZones: true;
    submitContent: true; // Tidak bisa approve langsung
    readOwnContent: true;
  };
  userManagement: {
    createRegionUsers: true;
    manageRegionUsers: true; // Hanya user dalam regionnya
    noRoleModification: true;
  };
  systemSettings: {
    regionSettings: true;
    noGlobalSettings: true;
  };
}
```

### 2. Permission Implementation

#### Frontend Route Protection

```typescript
// src/components/ProtectedRoute.tsx
interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: UserRole;
  requiredPermissions?: Permission[];
  regionScope?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole, 
  requiredPermissions, 
  regionScope 
}) => {
  const { user, isLoading } = useAuth();

  // Check authentication
  if (isLoading) return <LoadingSpinner />;
  if (!user) redirect("/login");

  // Check role permissions
  if (requiredRole && !hasRole(user, requiredRole)) {
    return <AccessDenied />;
  }

  // Check specific permissions
  if (requiredPermissions && !hasPermissions(user, requiredPermissions)) {
    return <AccessDenied />;
  }

  return <>{children}</>;
};
```

#### API Request Interception

```typescript
// src/lib/api.ts - Request interceptor
api.interceptors.request.use((config) => {
  const { user } = authStore.getState();

  // Add authorization header
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }

  // Add region scope for Regional Admin
  if (user?.role === "regional_admin" && user?.region_code) {
    config.headers["X-Region-Scope"] = user.region_code;
  }

  return config;
});
```

---

## Workflow dan Manajemen Data

### 1. Content Workflow Status

#### Status Flow Diagram

```
Draft → Submit → In Review → [Approve/Reject]
 ↑                          ↓
 ←──────── Revise ←─────────┘
```

#### Status Implementation

```typescript
enum WorkflowStatus {
  DRAFT = "draft",
  IN_REVIEW = "in_review",
  APPROVED = "approved",
  REJECTED = "rejected",
}

interface ContentItem {
  id: number;
  status: WorkflowStatus;
  submitted_by?: number;
  submitted_at?: string;
  approved_by?: number;
  approved_at?: string;
  rejected_by?: number;
  rejected_at?: string;
  rejection_reason?: string;
}
```

### 2. Content Management UI

#### Flora/Fauna Management Page

```typescript
interface ContentManagementPage {
  layout: {
    header: {
      title: string;
      breadcrumb: BreadcrumbItem[];
      actions: ActionButton[];
    };
    filters: {
      status: WorkflowStatusFilter[];
      dateRange: DateRangePicker;
      search: SearchInput;
      region: RegionFilter; // Untuk Super Admin
    };
    dataTable: {
      columns: TableColumn[];
      rows: ContentRow[];
      pagination: PaginationControl;
      bulkActions: BulkActionButton[];
    };
  };
}
```

#### Action Buttons per Role

```typescript
interface ActionButtons {
  superAdmin: {
    create: "Tambah Baru";
    edit: "Edit";
    submit: "Submit untuk Review";
    approve: "Setujui";
    reject: "Tolak dengan Alasan";
    delete: "Hapus";
    export: "Ekspor Data";
  };
  regionalAdmin: {
    create: "Tambah Baru";
    edit: "Edit";
    submit: "Kirim untuk Review";
    // Tidak ada approve/reject/delete
  };
}
```

### 3. Approval Workflow UI

#### Review Inbox (Super Admin)

```typescript
interface ReviewInbox {
  pendingItems: {
    flora: PendingReview[];
    fauna: PendingReview[];
    articles: PendingReview[];
    galleries: PendingReview[];
  };
  actions: {
    bulkApprove: boolean;
    bulkReject: boolean;
    individualReview: boolean;
  };
}
```

#### Rejection Modal

```typescript
interface RejectionModal {
  title: "Alasan Penolakan";
  form: {
    reason: TextArea;
    suggestions?: TextArea; // Saran perbaikan
  };
  actions: {
    submit: "Submit Rejection";
    cancel: "Batal";
  };
}
```

---

## Komponen UI/UX

### 1. Design System Components

#### Color Palette Usage

```typescript
// Tailwind Configuration
const colors = {
  primary: {
    50: "#f4f0ee", // Light cream background
    500: "#4d805f", // Medium green buttons
    600: "#356447", // Primary brand color
    700: "#294e37", // Dark forest
    900: "#233c2b", // Darkest green
  },
};
```

#### Typography Scale

```typescript
// Font Configuration
const typography = {
  fontFamily: {
    primary: ["TAN Aegean", "sans-serif"],
    secondary: ["Helvetica Now", "sans-serif"],
  },
  fontSize: {
    display: "4.5rem", // Hero titles
    "heading-1": "3rem", // Page titles
    "heading-2": "2.25rem", // Section titles
    "body-lg": "1.125rem", // Large body text
    body: "1rem", // Regular body text
    caption: "0.875rem", // Small text
  },
};
```

### 2. Common UI Components

#### Data Table Component

```typescript
interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
  loading?: boolean;
  bulkActions?: BulkAction[];
  rowActions?: RowAction<T>[];
}

// Usage example untuk Flora Management
const floraColumns: ColumnDef<Flora>[] = [
  {
    accessorKey: "scientific_name",
    header: "Nama Ilmiah",
    cell: ({ row }) => {
      const flora = row.original;
      return (
        <div className="space-y-1">
          <div className="font-medium">{flora.scientific_name}</div>
          <div className="text-sm text-gray-500">{flora.local_name}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return <StatusBadge status={status} />;
    },
  },
];
```

#### Form Components

```typescript
interface FloraFormProps {
  initialData?: Partial<Flora>;
  onSubmit: (data: FloraFormData) => Promise<void>;
  mode: "create" | "edit";
}

const FloraForm: React.FC<FloraFormProps> = ({ initialData, onSubmit, mode }) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Informasi Dasar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="scientific_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Ilmiah *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter scientific name" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};
```

### 3. Map Integration

#### Interactive Map Component

```typescript
interface MapComponentProps {
  initialView?: MapView;
  zones: Zone[];
  selectedZone?: Zone;
  onZoneClick: (zone: Zone) => void;
  showFilters?: boolean;
}

const InteractiveMap: React.FC<MapComponentProps> = ({ 
  zones, 
  selectedZone, 
  onZoneClick 
}) => {
  return (
    <div className="w-full h-96 bg-gray-100 rounded-lg">
      {/* Map implementation dengan Leaflet atau Mapbox */}
      <MapContainer>
        {zones.map((zone) => (
          <ZoneMarker 
            key={zone.id} 
            zone={zone} 
            isSelected={selectedZone?.id === zone.id} 
            onClick={() => onZoneClick(zone)} 
          />
        ))}
      </MapContainer>
    </div>
  );
};
```

---

## Integrasi API

### 1. API Client Configuration

#### Base API Setup

```typescript
// src/lib/api.ts
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor untuk auth
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Region scope untuk Regional Admin
  const user = getCurrentUser();
  if (user?.role === "regional_admin" && user?.region_code) {
    config.headers["X-Region-Scope"] = user.region_code;
  }

  return config;
});
```

#### Service Layer

```typescript
// src/services/api.ts
export const floraService = {
  // Public endpoints
  searchFlora: (params: FloraSearchParams) => 
    api.get("/api/public/flora/", { params }),

  getFloraById: (id: number) => 
    api.get(`/api/public/flora/${id}`),

  // Admin endpoints (dengan auth)
  listFlora: (params: AdminFloraParams) => 
    api.get("/api/v1/", { params }),

  createFlora: (data: FloraCreateData) => 
    api.post("/api/v1/flora", data),

  updateFlora: (id: number, data: FloraUpdateData) => 
    api.put(`/api/v1/${id}`, data),

  submitFlora: (id: number) => 
    api.post(`/api/v1/${id}/submit`),

  approveFlora: (id: number) => 
    api.post(`/api/v1/${id}/approve`),

  rejectFlora: (id: number, reason: string) => 
    api.post(`/api/v1/${id}/reject`, { reason }),
};
```

### 2. React Query Integration

#### Data Fetching Hooks

```typescript
// Custom hooks untuk data management
export const useFloraList = (params: FloraSearchParams) => {
  return useQuery({
    queryKey: ["flora", params],
    queryFn: () => floraService.searchFlora(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useFloraMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: floraService.createFlora,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flora"] });
    },
  });
};
```

---

## Responsivitas dan Aksesibilitas

### 1. Mobile-First Design

#### Responsive Breakpoints

```typescript
// Tailwind configuration
const screens = {
  xs: "475px",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
};
```

#### Mobile Navigation

```typescript
interface MobileNavigation {
  header: {
    hamburger: boolean;
    logo: boolean;
    actions: ActionButton[]; // User menu, notifications
  };
  sidebar: {
    overlay: boolean;
    slideAnimation: boolean;
    backdrop: boolean;
  };
  content: {
    fullWidth: boolean;
    padding: "reduced";
  };
}
```

### 2. Accessibility Features

#### WCAG 2.1 AA Compliance

```typescript
// Accessibility implementation examples
const AccessibleButton: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <button 
      {...props} 
      role="button" 
      tabIndex={0} 
      aria-label={props["aria-label"]} 
      className="focus:ring-2 focus:ring-green-500 focus:outline-none"
    >
      {children}
    </button>
  );
};

const AccessibleTable: React.FC<TableProps> = ({ columns, data }) => {
  return (
    <table role="table" aria-label="Data table">
      <thead>
        <tr role="row">
          {columns.map((column) => (
            <th 
              key={column.id} 
              role="columnheader" 
              aria-sort={column.sortable ? "none" : undefined}
            >
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={row.id} role="row" aria-rowindex={index + 1}>
            {/* Row content */}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
```

### 3. Performance Optimization

#### Code Splitting dan Lazy Loading

```typescript
// Dynamic imports untuk route-based code splitting
const LazyFloraPage = dynamic(() => import("./flora/page"), {
  loading: () => <PageSkeleton />,
});

const LazyDashboard = dynamic(() => import("./dashboard/page"), {
  loading: () => <DashboardSkeleton />,
  ssr: false, // Client-side only untuk admin pages
});
```

#### Image Optimization

```typescript
// src/components/OptimizedImage.tsx
interface OptimizedImageProps {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({ 
  src, 
  alt, 
  priority = false, 
  sizes = "100vw" 
}) => {
  return (
    <Image 
      src={src} 
      alt={alt} 
      priority={priority} 
      sizes={sizes} 
      quality={85} 
      placeholder="blur" 
      blurDataURL="data:image/jpeg;base64,..." 
    />
  );
};
```

---

## Kesimpulan

Dokumentasi ini memberikan panduan lengkap untuk memahami dan mengembangkan frontend Taman Kehati. Sistem ini dirancang dengan prinsip:

1. **Modularity**: Pemisahan jelas antara public dan admin interface
2. **Scalability**: Arsitektur yang dapat dikembangkan sesuai kebutuhan
3. **Accessibility**: Design yang inklusif untuk semua pengguna
4. **Performance**: Optimisasi loading dan rendering
5. **Maintainability**: Struktur code yang mudah dipelihara

Dengan mengikuti dokumentasi ini, developer dapat memahami workflow development, implementasi fitur baru, dan maintenance sistem secara efektif.