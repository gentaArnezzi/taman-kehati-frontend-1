# Articles Pages (Halaman Artikel)

## Deskripsi

Halaman artikel memungkinkan publik untuk membaca artikel-artikel tentang keanekaragaman hayati, konservasi, dan berita terkini dari Taman Kehati. Admin dapat membuat, mengelola, dan mempublikasikan artikel dengan sistem workflow approval.

## Struktur Data

### TypeScript Interfaces

```typescript
interface Article {
  id: string;
  title: string;
  slug: string; // Unique URL-friendly identifier
  content: string; // Rich text content
  summary: string; // Article summary for list view
  featuredImage?: string; // Cover image URL

  // Authoring
  authorId: string;
  authorName: string;
  authorRole: 'SUPER_ADMIN' | 'REGIONAL_ADMIN';
  authorRegionId?: string;

  // Categorization
  category: ArticleCategory;
  tags: string[];
  topics: string[]; // Specific topics like "orangutan conservation", "mangrove ecosystem"

  // Park Association (optional)
  parkId?: string; // If article is specific to a park
  parkName?: string;

  // SEO & Publishing
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  readingTime: number; // Estimated reading time in minutes

  // Publishing Workflow
  status: 'DRAFT' | 'IN_REVIEW' | 'PUBLISHED' | 'REJECTED' | 'ARCHIVED';
  publishedAt?: Date;
  scheduledAt?: Date; // For scheduled publishing

  // Statistics
  viewCount: number;
  likeCount: number;
  shareCount: number;
  commentCount: number;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  lastReadAt?: Date;

  // Flags
  isFeatured: boolean;
  isBreaking: boolean;
  isSponsored: boolean;
}

type ArticleCategory =
  | 'NEWS'
  | 'CONSERVATION'
  | 'RESEARCH'
  | 'EDUCATION'
  | 'EVENT'
  | 'SUCCESS_STORY'
  | 'POLICY'
  | 'TECHNOLOGY'
  | 'COMMUNITY';

interface ArticleComment {
  id: string;
  articleId: string;
  authorName: string;
  authorEmail: string;
  content: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: Date;
  parentId?: string; // For nested comments
  replies?: ArticleComment[];
}

interface ArticleStats {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  totalViews: number;
  totalShares: number;
  topCategories: Array<{
    category: ArticleCategory;
    count: number;
  }>;
  recentActivity: Array<{
    articleId: string;
    title: string;
    action: string;
    timestamp: Date;
  }>;
}
```

## Komponen UI

### 1. Public - Article List Page (`/artikel`)

```typescript
// app/artikel/page.tsx
export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<ArticleCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ArticleCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'trending'>('latest');

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold text-green-800 mb-4">
          Artikel & Berita Keanekaragaman Hayati
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Temukan informasi terkini tentang konservasi, penelitian, dan kegiatan
          di seluruh Taman Kehati Indonesia
        </p>
      </section>

      {/* Featured Article */}
      {articles.find(a => a.isFeatured) && (
        <FeaturedArticle article={articles.find(a => a.isFeatured)!} />
      )}

      {/* Filters and Search */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1">
          <ArticleFilters
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </div>

        {/* Articles Grid */}
        <div className="lg:col-span-3">
          <ArticlesGrid
            articles={articles}
            loading={isLoading}
            onLoadMore={loadMoreArticles}
          />
        </div>
      </div>
    </div>
  );
}
```

### 2. Featured Article Component

```typescript
// components/articles/FeaturedArticle.tsx
interface FeaturedArticleProps {
  article: Article;
}

export function FeaturedArticle({ article }: FeaturedArticleProps) {
  return (
    <section className="mb-12">
      <Card className="overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Image */}
          <div className="relative h-96 lg:h-auto">
            <Image
              src={article.featuredImage || '/placeholder-article.jpg'}
              alt={article.title}
              fill
              className="object-cover"
            />
            <div className="absolute top-4 left-4">
              <Badge className="bg-red-600 text-white">
                <Star className="h-3 w-3 mr-1" />
                Artikel Pilihan
              </Badge>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 lg:p-8 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline">
                {getCategoryDisplayName(article.category)}
              </Badge>
              {article.isBreaking && (
                <Badge variant="destructive">
                  <Zap className="h-3 w-3 mr-1" />
                  Berita Terkini
                </Badge>
              )}
            </div>

            <h2 className="text-3xl font-bold mb-4 line-clamp-2">
              <Link href={`/artikel/${article.slug}`} className="hover:text-green-700">
                {article.title}
              </Link>
            </h2>

            <p className="text-gray-600 mb-6 line-clamp-3">
              {article.summary}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={getAuthorAvatar(article.authorId)} />
                    <AvatarFallback>
                      {article.authorName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium">{article.authorName}</div>
                    <div className="text-xs text-gray-500">
                      {formatDate(article.publishedAt)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {article.readingTime} menit
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {article.viewCount}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Button asChild>
                <Link href={`/artikel/${article.slug}`}>
                  Baca Selengkapnya
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}
```

### 3. Article Filters Sidebar

```typescript
// components/articles/ArticleFilters.tsx
interface ArticleFiltersProps {
  categories: ArticleCategory[];
  selectedCategory: ArticleCategory | null;
  onCategoryChange: (category: ArticleCategory | null) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: 'latest' | 'popular' | 'trending';
  onSortChange: (sort: 'latest' | 'popular' | 'trending') => void;
}

export function ArticleFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange
}: ArticleFiltersProps) {
  const popularTags = [
    'konservasi', 'satwa liar', 'ekosistem', 'hutan hujan',
    'penelitian', 'community', 'education', 'biodiversity'
  ];

  return (
    <div className="space-y-6">
      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Pencarian</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari artikel..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Sort */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Urutkan</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Terbaru</SelectItem>
              <SelectItem value="popular">Terpopuler</SelectItem>
              <SelectItem value="trending">Trending</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Kategori</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <button
              onClick={() => onCategoryChange(null)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                selectedCategory === null
                  ? 'bg-green-100 text-green-800'
                  : 'hover:bg-gray-100'
              }`}
            >
              Semua Kategori
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between ${
                  selectedCategory === category
                    ? 'bg-green-100 text-green-800'
                    : 'hover:bg-gray-100'
                }`}
              >
                {getCategoryDisplayName(category)}
                <Badge variant="outline" className="text-xs">
                  {getCategoryCount(category)}
                </Badge>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Popular Tags */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tag Populer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="cursor-pointer hover:bg-green-100 hover:text-green-800"
                onClick={() => onSearchChange(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Newsletter Subscription */}
      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-lg text-green-800">
            Newsletter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-green-700 mb-4">
            Dapatkan artikel terbaru langsung di inbox Anda
          </p>
          <NewsletterSignup />
        </CardContent>
      </Card>
    </div>
  );
}
```

### 4. Article Grid Component

```typescript
// components/articles/ArticlesGrid.tsx
interface ArticlesGridProps {
  articles: Article[];
  loading?: boolean;
  onLoadMore?: () => void;
}

export function ArticlesGrid({ articles, loading, onLoadMore }: ArticlesGridProps) {
  if (loading && articles.length === 0) {
    return <ArticlesGridSkeleton />;
  }

  if (articles.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <div className="text-gray-400 mb-4">
            <FileText className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Belum ada artikel
          </h3>
          <p className="text-gray-500">
            Belum ada artikel yang sesuai dengan filter yang dipilih
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}

      {loading && <ArticlesGridSkeleton />}

      {onLoadMore && (
        <div className="col-span-full text-center mt-8">
          <Button onClick={onLoadMore} variant="outline">
            Muat Lebih Banyak
          </Button>
        </div>
      )}
    </div>
  );
}

// Article Card Component
interface ArticleCardProps {
  article: Article;
}

function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {/* Article Image */}
      <div className="relative h-48">
        <Image
          src={article.featuredImage || '/placeholder-article.jpg'}
          alt={article.title}
          fill
          className="object-cover"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant="secondary">
            {getCategoryDisplayName(article.category)}
          </Badge>
          {article.isBreaking && (
            <Badge variant="destructive" className="text-xs">
              <Zap className="h-3 w-3 mr-1" />
              Terkini
            </Badge>
          )}
        </div>
      </div>

      <CardContent className="p-5">
        {/* Article Title */}
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">
          <Link
            href={`/artikel/${article.slug}`}
            className="hover:text-green-700 transition-colors"
          >
            {article.title}
          </Link>
        </h3>

        {/* Article Summary */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {article.summary}
        </p>

        {/* Article Meta */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(article.publishedAt, 'dd MMM yyyy')}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {article.readingTime} menit
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {article.viewCount}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="h-3 w-3" />
              {article.likeCount}
            </span>
          </div>
        </div>

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {article.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {article.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{article.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Author Info */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t">
          <Avatar className="h-6 w-6">
            <AvatarImage src={getAuthorAvatar(article.authorId)} />
            <AvatarFallback className="text-xs">
              {article.authorName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-gray-600">
            {article.authorName}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
```

### 5. Article Detail Page (`/artikel/[slug]`)

```typescript
// app/artikel/[slug]/page.tsx
interface ArticlePageProps {
  params: { slug: string };
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [comments, setComments] = useState<ArticleComment[]>([]);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (article) {
      // Increment view count
      incrementArticleView(article.id);
    }
  }, [article]);

  if (!article) return <ArticleNotFound />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Article Header */}
          <article className="prose prose-lg max-w-none">
            <header className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline">
                  {getCategoryDisplayName(article.category)}
                </Badge>
                {article.isFeatured && (
                  <Badge className="bg-yellow-100 text-yellow-800">
                    <Star className="h-3 w-3 mr-1" />
                    Pilihan
                  </Badge>
                )}
                {article.isBreaking && (
                  <Badge variant="destructive">
                    <Zap className="h-3 w-3 mr-1" />
                    Terkini
                  </Badge>
                )}
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {article.title}
              </h1>

              <p className="text-xl text-gray-600 mb-6">
                {article.summary}
              </p>

              {/* Article Meta */}
              <div className="flex items-center justify-between border-y py-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={getAuthorAvatar(article.authorId)} />
                      <AvatarFallback>
                        {article.authorName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{article.authorName}</div>
                      <div className="text-sm text-gray-500">
                        {article.authorRole === 'SUPER_ADMIN' ? 'Super Admin' : 'Regional Admin'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(article.publishedAt, 'dd MMMM yyyy')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {article.readingTime} menit baca
                  </span>
                </div>
              </div>
            </header>

            {/* Featured Image */}
            {article.featuredImage && (
              <div className="mb-8">
                <Image
                  src={article.featuredImage}
                  alt={article.title}
                  width={800}
                  height={400}
                  className="w-full rounded-lg"
                />
              </div>
            )}

            {/* Article Content */}
            <div
              className="prose-content"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Article Tags */}
            {article.tags.length > 0 && (
              <div className="mt-8 pt-8 border-t">
                <h3 className="text-lg font-semibold mb-4">Tag</h3>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Share & Like */}
            <div className="mt-8 pt-8 border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant={isLiked ? "default" : "outline"}
                    size="sm"
                    onClick={toggleLike}
                    className="flex items-center gap-2"
                  >
                    <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                    {article.likeCount + (isLiked ? 1 : 0)}
                  </Button>

                  <ShareButton
                    url={`${process.env.NEXT_PUBLIC_BASE_URL}/artikel/${article.slug}`}
                    title={article.title}
                  />
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {article.viewCount + 1} dilihat
                  </span>
                  <span className="flex items-center gap-1">
                    <Share2 className="h-4 w-4" />
                    {article.shareCount} dibagikan
                  </span>
                </div>
              </div>
            </div>
          </article>

          {/* Comments Section */}
          <CommentsSection
            articleId={article.id}
            comments={comments}
            onCommentAdd={handleCommentAdd}
          />
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 space-y-6">
            {/* Table of Contents */}
            <TableOfContents content={article.content} />

            {/* Author Card */}
            <AuthorCard authorId={article.authorId} />

            {/* Related Articles */}
            <RelatedArticles articles={relatedArticles} />

            {/* Newsletter */}
            <NewsletterCard />
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 6. Admin - Article Management

```typescript
// app/admin/content/articles/page.tsx
export default function ArticlesManagement() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Manajemen Artikel</h1>
          <p className="text-gray-600">
            Buat dan kelola artikel untuk website publik
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Artikel Baru
        </Button>
      </div>

      <ArticlesStats />

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Daftar Artikel</CardTitle>
            <div className="flex gap-2">
              <StatusFilter />
              <SearchBar placeholder="Cari artikel..." />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ArticlesTable
            articles={articles}
            onSelect={setSelectedArticle}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
          />
        </CardContent>
      </Card>

      <CreateEditArticleModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setSelectedArticle(null);
        }}
        article={selectedArticle}
        onSave={handleSave}
      />
    </div>
  );
}
```

### 7. Article Create/Edit Modal

```typescript
// components/admin/CreateEditArticleModal.tsx
interface CreateEditArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  article?: Article | null;
  onSave: (article: Partial<Article>) => void;
}

export function CreateEditArticleModal({
  isOpen,
  onClose,
  article,
  onSave
}: CreateEditArticleModalProps) {
  const [formData, setFormData] = useState<Partial<Article>>({
    title: '',
    slug: '',
    content: '',
    summary: '',
    category: 'NEWS',
    tags: [],
    topics: [],
    parkId: '',
    isFeatured: false,
    isBreaking: false,
    isSponsored: false,
    metaTitle: '',
    metaDescription: '',
    status: 'DRAFT'
  });

  const [isGeneratingSlug, setIsGeneratingSlug] = useState(false);

  // Generate slug from title
  useEffect(() => {
    if (formData.title && (!formData.slug || !article)) {
      setIsGeneratingSlug(true);
      const slug = generateSlug(formData.title);
      setFormData(prev => ({ ...prev, slug }));
      setIsGeneratingSlug(false);
    }
  }, [formData.title, article]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Calculate reading time
    const readingTime = calculateReadingTime(formData.content || '');

    const submission = {
      ...formData,
      id: article?.id || generateId(),
      readingTime,
      updatedAt: new Date()
    };

    if (!article) {
      submission.createdBy = getCurrentUser().id;
      submission.createdAt = new Date();
    }

    await onSave(submission);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {article ? 'Edit Artikel' : 'Buat Artikel Baru'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <Label htmlFor="title">Judul Artikel</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    title: e.target.value
                  }))}
                  placeholder="Masukkan judul artikel"
                  required
                />
              </div>

              <div>
                <Label htmlFor="slug">URL Slug</Label>
                <div className="relative">
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      slug: e.target.value
                    }))}
                    placeholder="url-slug-artikel"
                    required
                  />
                  {isGeneratingSlug && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Akan digunakan sebagai URL: /artikel/{formData.slug}
                </p>
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
                  placeholder="Ringkasan singkat artikel (maks. 300 karakter)"
                  maxLength={300}
                  rows={3}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.summary?.length || 0}/300 karakter
                </p>
              </div>

              <div>
                <Label htmlFor="content">Konten Artikel</Label>
                <RichTextEditor
                  value={formData.content}
                  onChange={(content) => setFormData(prev => ({
                    ...prev,
                    content
                  }))}
                  placeholder="Tulis konten artikel lengkap..."
                />
                <p className="text-sm text-gray-500 mt-1">
                  Estimasi waktu baca: {calculateReadingTime(formData.content || '')} menit
                </p>
              </div>

              <div>
                <Label>Gambar Utama</Label>
                <ImageUpload
                  value={formData.featuredImage}
                  onChange={(url) => setFormData(prev => ({
                    ...prev,
                    featuredImage: url
                  }))}
                  aspectRatio="16:9"
                  maxSize={5 * 1024 * 1024} // 5MB
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
                        category: value as ArticleCategory
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NEWS">Berita</SelectItem>
                        <SelectItem value="CONSERVATION">Konservasi</SelectItem>
                        <SelectItem value="RESEARCH">Penelitian</SelectItem>
                        <SelectItem value="EDUCATION">Pendidikan</SelectItem>
                        <SelectItem value="EVENT">Acara</SelectItem>
                        <SelectItem value="SUCCESS_STORY">Kisah Sukses</SelectItem>
                        <SelectItem value="POLICY">Kebijakan</SelectItem>
                        <SelectItem value="TECHNOLOGY">Teknologi</SelectItem>
                        <SelectItem value="COMMUNITY">Komunitas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Terkait Taman (Opsional)</Label>
                    <ParkSelector
                      value={formData.parkId}
                      onChange={(parkId) => setFormData(prev => ({
                        ...prev,
                        parkId
                      }))}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Label Khusus</Label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.isFeatured}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            isFeatured: e.target.checked
                          }))}
                        />
                        <span className="text-sm">Artikel Pilihan</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.isBreaking}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            isBreaking: e.target.checked
                          }))}
                        />
                        <span className="text-sm">Berita Terkini</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.isSponsored}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            isSponsored: e.target.checked
                          }))}
                        />
                        <span className="text-sm">Bersponsor</span>
                      </label>
                    </div>
                  </div>
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

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Topik</CardTitle>
                </CardHeader>
                <CardContent>
                  <TopicInput
                    value={formData.topics || []}
                    onChange={(topics) => setFormData(prev => ({
                      ...prev,
                      topics
                    }))}
                    placeholder="Tambah topik spesifik..."
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">SEO Meta</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="metaTitle">Meta Title</Label>
                    <Input
                      id="metaTitle"
                      value={formData.metaTitle}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        metaTitle: e.target.value
                      }))}
                      placeholder="Judul untuk SEO (maks. 60 karakter)"
                      maxLength={60}
                    />
                  </div>
                  <div>
                    <Label htmlFor="metaDescription">Meta Description</Label>
                    <Textarea
                      id="metaDescription"
                      value={formData.metaDescription}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        metaDescription: e.target.value
                      }))}
                      placeholder="Deskripsi untuk SEO (maks. 160 karakter)"
                      maxLength={160}
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData(prev => ({
                      ...prev,
                      status: value as Article['status']
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="IN_REVIEW">Menunggu Review</SelectItem>
                      <SelectItem value="PUBLISHED">Diterbitkan</SelectItem>
                      <SelectItem value="REJECTED">Ditolak</SelectItem>
                      <SelectItem value="ARCHIVED">Diarsipkan</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex justify-between items-center pt-6 border-t">
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Batal
              </Button>
              {!article && (
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
                {article ? 'Perbarui' : 'Simpan'}
              </Button>
              {article?.status !== 'PUBLISHED' && (
                <Button
                  type="button"
                  onClick={() => handlePublish()}
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

## API Endpoints

```typescript
// app/api/articles/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const tag = searchParams.get('tag');
  const search = searchParams.get('search');
  const park = searchParams.get('park');
  const featured = searchParams.get('featured');
  const sort = searchParams.get('sort') || 'latest';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '12');

  let query = db
    .select()
    .from(articles)
    .where(eq(articles.status, 'PUBLISHED'));

  // Apply filters
  if (category) {
    query = query.where(eq(articles.category, category));
  }
  if (park) {
    query = query.where(eq(articles.parkId, park));
  }
  if (featured === 'true') {
    query = query.where(eq(articles.isFeatured, true));
  }
  if (search) {
    query = query.where(
      or(
        ilike(articles.title, `%${search}%`),
        ilike(articles.content, `%${search}%`),
        ilike(articles.summary, `%${search}%`)
      )
    );
  }

  // Apply sorting
  switch (sort) {
    case 'popular':
      query = query.orderBy(desc(articles.viewCount));
      break;
    case 'trending':
      query = query.orderBy(desc(articles.likeCount));
      break;
    default:
      query = query.orderBy(desc(articles.publishedAt));
  }

  const offset = (page - 1) * limit;
  const data = await query.limit(limit).offset(offset);

  return Response.json({
    articles: data,
    page,
    limit,
    hasMore: data.length === limit
  });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  const body = await request.json();

  const newArticle = await db.insert(articles).values({
    ...body,
    id: generateId(),
    authorId: user.id,
    authorName: user.name,
    authorRole: user.role,
    authorRegionId: user.regionId,
    createdAt: new Date(),
    updatedAt: new Date()
  }).returning();

  // Create audit log
  await createAuditLog({
    action: 'CREATE',
    entity: 'ARTICLE',
    entityId: newArticle[0].id,
    newValues: newArticle[0],
    description: `${user.name} created article: ${newArticle[0].title}`
  });

  return Response.json(newArticle[0]);
}

// app/api/articles/[slug]/route.ts
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const article = await db
    .select()
    .from(articles)
    .where(
      and(
        eq(articles.slug, params.slug),
        eq(articles.status, 'PUBLISHED')
      )
    )
    .limit(1);

  if (article.length === 0) {
    return new Response('Article not found', { status: 404 });
  }

  // Increment view count
  await db
    .update(articles)
    .set({
      viewCount: sql`${articles.viewCount} + 1`,
      lastReadAt: new Date()
    })
    .where(eq(articles.id, article[0].id));

  return Response.json(article[0]);
}

// app/api/articles/[id]/view/route.ts
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  await db
    .update(articles)
    .set({
      viewCount: sql`${articles.viewCount} + 1`,
      lastReadAt: new Date()
    })
    .where(eq(articles.id, params.id));

  return Response.json({ success: true });
}
```

## Database Schema

```sql
-- Articles table
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) NOT NULL UNIQUE,
  content TEXT NOT NULL,
  summary TEXT,
  featured_image VARCHAR(500),

  -- Authoring
  author_id UUID NOT NULL REFERENCES users(id),
  author_name VARCHAR(255) NOT NULL,
  author_role VARCHAR(20) NOT NULL CHECK (author_role IN ('SUPER_ADMIN', 'REGIONAL_ADMIN')),
  author_region_id UUID REFERENCES parks(id),

  -- Categorization
  category VARCHAR(20) NOT NULL DEFAULT 'NEWS' CHECK (category IN ('NEWS', 'CONSERVATION', 'RESEARCH', 'EDUCATION', 'EVENT', 'SUCCESS_STORY', 'POLICY', 'TECHNOLOGY', 'COMMUNITY')),
  tags TEXT[],
  topics TEXT[],

  -- Park Association
  park_id UUID REFERENCES parks(id),

  -- SEO
  meta_title VARCHAR(255),
  meta_description TEXT,
  meta_keywords TEXT[],
  reading_time INTEGER NOT NULL DEFAULT 0,

  -- Publishing
  status VARCHAR(20) NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'IN_REVIEW', 'PUBLISHED', 'REJECTED', 'ARCHIVED')),
  published_at TIMESTAMP,
  scheduled_at TIMESTAMP,

  -- Statistics
  view_count INTEGER NOT NULL DEFAULT 0,
  like_count INTEGER NOT NULL DEFAULT 0,
  share_count INTEGER NOT NULL DEFAULT 0,
  comment_count INTEGER NOT NULL DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  last_read_at TIMESTAMP,

  -- Flags
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_breaking BOOLEAN NOT NULL DEFAULT FALSE,
  is_sponsored BOOLEAN NOT NULL DEFAULT FALSE
);

-- Article comments
CREATE TABLE article_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  author_name VARCHAR(255) NOT NULL,
  author_email VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
  parent_id UUID REFERENCES article_comments(id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_category ON articles(category);
CREATE INDEX idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_author_id ON articles(author_id);
CREATE INDEX idx_articles_park_id ON articles(park_id);
CREATE INDEX idx_articles_search ON articles USING gin(to_tsvector('indonesian', title || ' ' || content || ' ' || summary));
CREATE INDEX idx_article_comments_article_id ON article_comments(article_id);
CREATE INDEX idx_article_comments_status ON article_comments(status);
```

## Utility Functions

```typescript
// utils/article.utils.ts
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
}

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200; // Average reading speed
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

export function getCategoryDisplayName(category: ArticleCategory): string {
  const categoryNames = {
    NEWS: 'Berita',
    CONSERVATION: 'Konservasi',
    RESEARCH: 'Penelitian',
    EDUCATION: 'Pendidikan',
    EVENT: 'Acara',
    SUCCESS_STORY: 'Kisah Sukses',
    POLICY: 'Kebijakan',
    TECHNOLOGY: 'Teknologi',
    COMMUNITY: 'Komunitas'
  };
  return categoryNames[category] || category;
}

export function getActionDisplayName(action: string): string {
  const actionNames = {
    CREATE: 'Buat',
    UPDATE: 'Update',
    DELETE: 'Hapus',
    APPROVE: 'Setujui',
    REJECT: 'Tolak',
    PUBLISH: 'Terbitkan',
    ARCHIVE: 'Arsipkan'
  };
  return actionNames[action as keyof typeof actionNames] || action;
}
```

## Features untuk MVP

- ✅ Create, read, update, delete articles
- ✅ Rich text editor with media support
- ✅ Article categorization and tagging
- ✅ SEO optimization (meta tags, slugs)
- ✅ Public article listing and detail pages
- ✅ Search and filtering functionality
- ✅ View count tracking
- ✅ Author attribution
- ✅ Related articles suggestions
- ✅ Comment system (pending approval workflow)
- ✅ Featured and breaking news flags
- ✅ Reading time calculation
- ❌ Social sharing integration (Phase 2)
- ❌ Newsletter subscription (Phase 2)
- ❌ Advanced analytics (Phase 2)
- ❌ Article scheduling (Phase 2)