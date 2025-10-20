# Public Website Architecture - Taman Kehati

## Daftar Isi

1. [Struktur Navigasi Publik](#struktur-navigasi-publik)
2. [Homepage Implementation](#homepage-implementation)
3. [Database Pages Architecture](#database-pages-architecture)
4. [Component Specifications](#component-specifications)
5. [Chatbot Integration](#chatbot-integration)
6. [TypeScript Interfaces](#typescript-interfaces)

---

## Struktur Navigasi Publik

### 1. Header Navigation Component

```typescript
// src/components/layout/PublicHeader.tsx
interface PublicHeaderProps {
  isTransparent?: boolean;
  currentPath?: string;
}

const PublicHeader: React.FC<PublicHeaderProps> = ({ 
  isTransparent = false, 
  currentPath 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  const navigationItems = [
    { 
      label: "Beranda", 
      href: "/", 
      icon: Home 
    },
    { 
      label: "Taman", 
      href: "/taman", 
      icon: Map 
    },
    { 
      label: "Flora", 
      href: "/flora", 
      icon: Leaf 
    },
    { 
      label: "Fauna", 
      href: "/fauna", 
      icon: Bird 
    },
    { 
      label: "Berita", 
      href: "/berita", 
      icon: Newspaper 
    },
    { 
      label: "Peta", 
      href: "/peta", 
      icon: MapPin 
    },
    { 
      label: "Hubungi", 
      href: "/kontak", 
      icon: Phone 
    }
  ];

  return (
    <header className={`
      fixed top-0 w-full z-50 transition-all duration-300
      ${isTransparent ? 'bg-transparent' : 'bg-white shadow-md'}
    `}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image 
              src="/logo-taman-kehati.png" 
              alt="Taman Kehati" 
              width={40} 
              height={40}
            />
            <span className="text-xl font-bold text-green-700">
              Taman Kehati
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center space-x-1 text-sm font-medium
                  hover:text-green-600 transition-colors
                  ${currentPath === item.href ? 'text-green-600' : 'text-gray-700'}
                `}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <ChatbotButton />
            {user ? (
              <UserMenu />
            ) : (
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Masuk Admin
                </Button>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-md
                    hover:bg-gray-100 transition-colors
                    ${currentPath === item.href ? 'bg-green-50 text-green-600' : 'text-gray-700'}
                  `}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
```

### 2. Breadcrumb Navigation

```typescript
// src/components/navigation/Breadcrumb.tsx
interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600">
      <Link href="/" className="hover:text-green-600">
        <Home className="w-4 h-4" />
      </Link>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-4 h-4" />
          {item.href ? (
            <Link href={item.href} className="hover:text-green-600">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
```

---

## Homepage Implementation

### 1. Hero Section

```typescript
// src/components/sections/HeroSection.tsx
interface HeroSectionProps {
  title: string;
  subtitle: string;
  primaryCTA: {
    text: string;
    href: string;
  };
  secondaryCTA: {
    text: string;
    href: string;
  };
  backgroundImage?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  primaryCTA,
  secondaryCTA,
  backgroundImage
}) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        {backgroundImage ? (
          <Image
            src={backgroundImage}
            alt="Taman Kehati Background"
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="bg-gradient-to-br from-green-50 to-green-100 w-full h-full" />
        )}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
          {title}
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
          {subtitle}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="bg-green-600 hover:bg-green-700 text-white"
            asChild
          >
            <Link href={primaryCTA.href}>
              <MapPin className="w-5 h-5 mr-2" />
              {primaryCTA.text}
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            className="bg-white/10 border-white text-white hover:bg-white/20"
            asChild
          >
            <Link href={secondaryCTA.href}>
              <List className="w-5 h-5 mr-2" />
              {secondaryCTA.text}
            </Link>
          </Button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-6 h-6 text-white" />
      </div>
    </section>
  );
};
```

### 2. Three Pillars Section

```typescript
// src/components/sections/ThreePillars.tsx
interface Pillar {
  icon: React.ComponentType;
  title: string;
  description: string;
  features: string[];
}

const ThreePillars: React.FC = () => {
  const pillars: Pillar[] = [
    {
      icon: Shield,
      title: "Konservasi",
      description: "Perlindungan habitat dan spesies endemik Indonesia",
      features: [
        "Perlindungan habitat alami",
        "Penyelamatan spesies langka",
        "Restorasi ekosistem",
        "Monitoring keanekaragaman hayati"
      ]
    },
    {
      icon: BookOpen,
      title: "Edukasi",
      description: "Penyebaran pengetahuan keanekaragaman hayati",
      features: [
        "Program edukasi sekolah",
        "Workshop konservasi",
        "Materi pembelajaran digital",
        "Sertifikasi pelatihan"
      ]
    },
    {
      icon: Users,
      title: "Pemberdayaan",
      description: "Peningkatan kapasitas masyarakat lokal",
      features: [
        "Pelatihan masyarakat lokal",
        "Pengembangan ekowisata",
        "Kemitraan komunitas",
        "Program pemberdayaan ekonomi"
      ]
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Tiga Pilar Utama Taman Kehati
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Mewujudkan Indonesia yang berkelanjutan melalui konservasi, 
            edukasi, dan pemberdayaan masyarakat
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {pillars.map((pillar, index) => (
            <Card key={index} className="group hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full 
                              flex items-center justify-center mx-auto mb-6 
                              group-hover:bg-green-200 transition-colors">
                  <pillar.icon className="w-8 h-8 text-green-600" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {pillar.title}
                </h3>
                
                <p className="text-gray-600 mb-6">
                  {pillar.description}
                </p>
                
                <ul className="space-y-2 text-left">
                  {pillar.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
```

### 3. Statistics Section

```typescript
// src/components/sections/StatisticsSection.tsx
interface StatisticItem {
  label: string;
  value: string;
  icon: React.ComponentType;
  description: string;
}

const StatisticsSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const statistics: StatisticItem[] = [
    {
      label: "Taman Konservasi",
      value: "127",
      icon: MapPin,
      description: "Taman konservasi aktif di seluruh Indonesia"
    },
    {
      label: "Spesies Flora",
      value: "3,456",
      icon: Leaf,
      description: "Spesies flora terdokumentasi dan dilindungi"
    },
    {
      label: "Spesies Fauna",
      value: "1,892",
      icon: Bird,
      description: "Spesies fauna dalam program konservasi"
    },
    {
      label: "Masyarakat Terlibat",
      value: "45K+",
      icon: Users,
      description: "Masyarakat lokal berpartisipasi aktif"
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-20 bg-green-50" ref={ref}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Dampak Nyata Konservasi
          </h2>
          <p className="text-xl text-gray-600">
            Angka capaian kami dalam menjaga keanekaragaman hayati Indonesia
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {statistics.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full 
                            flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-6 h-6 text-green-600" />
              </div>
              
              <div className={`text-3xl md:text-4xl font-bold text-green-600 mb-2
                              ${isVisible ? 'animate-in' : ''}`}>
                {stat.value}
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {stat.label}
              </h3>
              
              <p className="text-sm text-gray-600">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
```

---

## Database Pages Architecture

### 1. Flora Page Implementation

```typescript
// src/app/(public)/flora/page.tsx
interface FloraSearchParams {
  search?: string;
  wilayah?: string;
  status_iucn?: string;
  kategori?: string;
  limit?: number;
  offset?: number;
}

const FloraPage: React.FC<FloraPageProps> = ({ searchParams }) => {
  const [filters, setFilters] = useState<FloraSearchParams>({
    search: searchParams.search || "",
    wilayah: searchParams.wilayah || "",
    status_iucn: searchParams.status_iucn || "",
    kategori: searchParams.kategori || "",
    limit: 12,
    offset: 0
  });

  const { data: floraData, isLoading, error } = useFloraList(filters);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Database Flora Indonesia
          </h1>
          <p className="text-lg text-gray-600">
            Jelajahi keanekaragaman flora Indonesia yang dilindungi dalam 
            program konservasi Taman Kehati
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-1/4">
            <FloraFilterPanel 
              filters={filters} 
              onFiltersChange={setFilters} 
            />
          </aside>

          {/* Main Content */}
          <main className="lg:w-3/4">
            {/* Search Bar */}
            <div className="mb-6">
              <SearchBar
                value={filters.search}
                onChange={(value) => setFilters(prev => ({ ...prev, search: value }))}
                placeholder="Cari nama ilmiah atau nama lokal flora..."
              />
            </div>

            {/* Results Count */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-600">
                Menampilkan {floraData?.count || 0} spesies flora
              </p>
              
              <div className="flex items-center gap-4">
                <SortSelect />
                <ViewToggle />
              </div>
            </div>

            {/* Loading State */}
            {isLoading && <FloraGridSkeleton />}

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-600">Terjadi kesalahan saat memuat data</p>
              </div>
            )}

            {/* Flora Grid */}
            {!isLoading && !error && (
              <>
                <FloraGrid flora={floraData?.results || []} />
                
                {/* Pagination */}
                {floraData && floraData.count > filters.limit && (
                  <Pagination
                    currentPage={Math.floor(filters.offset / filters.limit) + 1}
                    totalPages={Math.ceil(floraData.count / filters.limit)}
                    onPageChange={(page) => {
                      const newOffset = (page - 1) * filters.limit;
                      setFilters(prev => ({ ...prev, offset: newOffset }));
                    }}
                  />
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
```

### 2. Flora Filter Panel

```typescript
// src/components/filters/FloraFilterPanel.tsx
interface FloraFilterPanelProps {
  filters: FloraSearchParams;
  onFiltersChange: (filters: FloraSearchParams) => void;
}

const FloraFilterPanel: React.FC<FloraFilterPanelProps> = ({
  filters,
  onFiltersChange
}) => {
  const { data: regions } = useRegionsList();
  const { data: iucnStatuses } = useIUCNStatusesList();

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filter Pencarian</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onFiltersChange({
            search: "",
            wilayah: "",
            status_iucn: "",
            kategori: "",
            limit: 12,
            offset: 0
          })}
        >
          Reset
        </Button>
      </div>

      <div className="space-y-6">
        {/* Region Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Wilayah
          </label>
          <Select
            value={filters.wilayah}
            onValueChange={(value) => 
              onFiltersChange({ ...filters, wilayah: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih wilayah" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Semua wilayah</SelectItem>
              {regions?.map((region) => (
                <SelectItem key={region.code} value={region.code}>
                  {region.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* IUCN Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status Konservasi IUCN
          </label>
          <div className="space-y-2">
            {iucnStatuses?.map((status) => (
              <label key={status.code} className="flex items-center space-x-2">
                <Checkbox
                  checked={filters.status_iucn === status.code}
                  onCheckedChange={(checked) => 
                    onFiltersChange({ 
                      ...filters, 
                      status_iucn: checked ? status.code : "" 
                    })
                  }
                />
                <span className="text-sm text-gray-700">{status.name}</span>
                <IUCNStatusBadge status={status.code} />
              </label>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kategori
          </label>
          <Select
            value={filters.kategori}
            onValueChange={(value) => 
              onFiltersChange({ ...filters, kategori: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Semua kategori</SelectItem>
              <SelectItem value="pohon">Pohon</SelectItem>
              <SelectItem value="semak">Semak</SelectItem>
              <SelectItem value="herba">Herba</SelectItem>
              <SelectItem value="anggrek">Anggrek</SelectItem>
              <SelectItem value="palem">Palem</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
};
```

### 3. Flora Grid Component

```typescript
// src/components/flora/FloraGrid.tsx
interface FloraGridProps {
  flora: Flora[];
  viewMode?: "grid" | "list";
}

const FloraGrid: React.FC<FloraGridProps> = ({ 
  flora, 
  viewMode = "grid" 
}) => {
  if (viewMode === "list") {
    return <FloraListView flora={flora} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {flora.map((species) => (
        <FloraCard key={species.id} flora={species} />
      ))}
    </div>
  );
};

// Flora Card Component
interface FloraCardProps {
  flora: Flora;
}

const FloraCard: React.FC<FloraCardProps> = ({ flora }) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={flora.primary_image || "/placeholder-flora.jpg"}
          alt={flora.scientific_name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* IUCN Status Badge */}
        <div className="absolute top-2 right-2">
          <IUCNStatusBadge status={flora.iucn_status} />
        </div>

        {/* Quick Actions */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 
                        transition-opacity duration-300 flex items-center justify-center">
          <div className="flex space-x-2">
            <Button size="sm" variant="secondary">
              <Heart className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="secondary">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-4">
        <div className="mb-3">
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
            {flora.scientific_name}
          </h3>
          <p className="text-sm text-gray-600">
            {flora.local_names?.join(", ") || "Tidak ada nama lokal"}
          </p>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center">
            <MapPin className="w-3 h-3 mr-1" />
            {flora.region_name}
          </span>
          <span className="flex items-center">
            <Leaf className="w-3 h-3 mr-1" />
            {flora.category}
          </span>
        </div>

        <div className="mt-3">
          <Link href={`/flora/${flora.id}`}>
            <Button variant="outline" size="sm" className="w-full">
              Lihat Detail
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
```

---

## Component Specifications

### 1. Search Bar Component

```typescript
// src/components/search/SearchBar.tsx
interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSearch?: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = "Cari...",
  onSearch
}) => {
  const [inputValue, setInputValue] = useState(value);
  const debouncedValue = useDebounce(inputValue, 300);

  useEffect(() => {
    onChange(debouncedValue);
  }, [debouncedValue, onChange]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(inputValue);
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 
                      w-5 h-5 text-gray-400" />
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          className="pl-10 pr-12"
        />
        {inputValue && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 
                     h-6 w-6 p-0"
            onClick={() => setInputValue("")}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </form>
  );
};
```

### 2. Pagination Component

```typescript
// src/components/navigation/Pagination.tsx
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showPageNumbers?: boolean;
  maxVisiblePages?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showPageNumbers = true,
  maxVisiblePages = 5
}) => {
  const getPageNumbers = () => {
    const pages: number[] = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);
    
    let start = Math.max(1, currentPage - halfVisible);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);
    
    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center space-x-2">
      {/* Previous Button */}
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      {/* Page Numbers */}
      {showPageNumbers && (
        <>
          {getPageNumbers().map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page)}
            >
              {page}
            </Button>
          ))}
        </>
      )}

      {/* Next Button */}
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
};
```

---

## Chatbot Integration

### 1. Chatbot Button Component

```typescript
// src/components/chatbot/ChatbotButton.tsx
const ChatbotButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg 
                 bg-green-600 hover:bg-green-700 text-white z-40"
        size="icon"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>

      <ChatbotWindow
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};
```

### 2. Chatbot Window Component

```typescript
// src/components/chatbot/ChatbotWindow.tsx
interface ChatbotWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatbotWindow: React.FC<ChatbotWindowProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/public/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: inputValue })
      });

      const data = await response.json();

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        sender: "bot",
        timestamp: new Date().toISOString(),
        sources: data.sources
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-lg 
                    shadow-2xl border z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-green-600 
                      text-white rounded-t-lg">
        <div className="flex items-center space-x-2">
          <Bot className="w-5 h-5" />
          <h3 className="font-semibold">Asisten Taman Kehati</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <Bot className="w-12 h-12 mx-auto mb-4 text-green-600" />
            <p>Halo! Saya adalah asisten virtual Taman Kehati.</p>
            <p className="text-sm mt-2">
              Tanyakan apa saja tentang flora, fauna, dan konservasi di Indonesia.
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.sender === "user"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              <p className="text-sm">{message.content}</p>
              {message.sources && (
                <div className="mt-2 text-xs opacity-75">
                  <p>Sumber: {message.sources.join(", ")}</p>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ketik pertanyaan Anda..."
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            disabled={isLoading}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={isLoading || !inputValue.trim()}
            size="icon"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
```

---

## TypeScript Interfaces

### 1. Core Data Types

```typescript
// src/types/flora.ts
export interface Flora {
  id: number;
  scientific_name: string;
  local_names: string[];
  family: string;
  genus: string;
  species: string;
  iucn_status: "EX" | "EW" | "CR" | "EN" | "VU" | "NT" | "LC" | "DD";
  category: "pohon" | "semak" | "herba" | "anggrek" | "palem";
  description: string;
  habitat: string;
  distribution: string[];
  region_code: string;
  region_name: string;
  primary_image?: string;
  images: FloraImage[];
  conservation_notes?: string;
  uses?: string[];
  created_at: string;
  updated_at: string;
}

export interface FloraImage {
  id: number;
  flora_id: number;
  image_url: string;
  caption?: string;
  is_primary: boolean;
  photographer?: string;
  uploaded_at: string;
}

export interface FloraSearchParams {
  search?: string;
  wilayah?: string;
  status_iucn?: string;
  kategori?: string;
  limit?: number;
  offset?: number;
  sort_by?: "scientific_name" | "created_at" | "region_name";
  sort_order?: "asc" | "desc";
}

export interface FloraListResponse {
  results: Flora[];
  count: number;
  next?: string;
  previous?: string;
}

// src/types/fauna.ts
export interface Fauna {
  id: number;
  scientific_name: string;
  local_names: string[];
  class: string;
  order: string;
  family: string;
  genus: string;
  species: string;
  iucn_status: IUCNStatus;
  category: "mamalia" | "burung" | "reptil" | "amfibi" | "ikan" | "invertebrata";
  is_pest: boolean;
  description: string;
  habitat: string;
  distribution: string[];
  region_code: string;
  region_name: string;
  primary_image?: string;
  images: FaunaImage[];
  conservation_notes?: string;
  behavior?: string;
  diet?: string;
  created_at: string;
  updated_at: string;
}

// src/types/common.ts
export interface Region {
  code: string;
  name: string;
  description?: string;
}

export interface IUCNStatusInfo {
  code: string;
  name: string;
  description: string;
  color: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: string;
  sources?: string[];
}

// src/types/navigation.ts
export interface NavigationItem {
  label: string;
  href: string;
  icon: React.ComponentType;
  badge?: {
    count: number;
    color: string;
  };
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}
```

### 2. API Response Types

```typescript
// src/types/api.ts
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  results: T[];
  count: number;
  next?: string;
  previous?: string;
  limit: number;
  offset: number;
}

export interface ErrorResponse {
  error: string;
  details?: Record<string, string[]>;
  status: number;
}

// API Request/Response for Chatbot
export interface ChatRequest {
  message: string;
  conversation_id?: string;
  context?: {
    page?: string;
    species_type?: "flora" | "fauna";
    species_id?: number;
  };
}

export interface ChatResponse {
  response: string;
  sources: string[];
  suggestions?: string[];
  conversation_id: string;
}
```

---

## Kesimpulan

Dokumentasi ini memberikan detail implementasi lengkap untuk arsitektur website publik Taman Kehati, meliputi:

1. **Komponen Navigasi**: Header, breadcrumb, dan navigasi mobile yang responsif
2. **Halaman Publik**: Homepage dengan hero section dan statistik dinamis
3. **Database Pages**: Implementasi lengkap untuk flora/fauna dengan filter dan pagination
4. **Integrasi Chatbot**: Sistem chatbot dengan RAG capabilities
5. **TypeScript Interfaces**: Type definitions yang komprehensif untuk type safety

Dengan mengikuti arsitektur ini, developer dapat membangun website publik yang performant, accessible, dan user experience yang optimal untuk pengunjung Taman Kehati.