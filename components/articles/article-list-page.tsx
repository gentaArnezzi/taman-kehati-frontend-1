"use client";

import { useState, useEffect } from "react";
import { FeaturedArticle } from "./featured-article";
import { ArticleFilters } from "./article-filters";
import { ArticlesGrid } from "./articles-grid";
import { Article, FilterOptions } from "~/lib/types";

export function ArticleListPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'trending'>('latest');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for demonstration
  const mockArticles: Article[] = [
    {
      id: "1",
      title: "Program Monitoring Satwa Liar Diluncurkan di Seluruh Indonesia",
      slug: "program-monitoring-satwa-liar",
      content: `
        <p>Kementerian Lingkungan Hidup dan Kehutanan dengan bangga mengumumkan peluncuran program monitoring satwa liar baru yang akan membantu melacak populasi spesies dilindungi di seluruh Taman Kehati Indonesia.</p>
        <p>Program ini menggunakan teknologi AI dan drone untuk memantau pergerakan satwa secara real-time, memberikan data yang akurat untuk keperluan konservasi dan penelitian.</p>
        <h3>Teknologi yang Digunakan</h3>
        <ul>
          <li>Kamera trap otomatis dengan AI recognition</li>
         >Drone mapping untuk habitat analysis</li>
        <li>GPS tracking untuk mamalia besar</li>
        <li>Acoustic monitoring untuk burung dan amfibi</li>
        </ul>
        <p>"Ini adalah terobosan besar dalam konservasi satwa liar Indonesia. Dengan teknologi ini, kita dapat merespons lebih cepat terhadap ancaman dan memberikan perlindungan yang lebih efektif," kata Menteri LHK.</p>
      `,
      summary: "Program baru untuk monitoring satwa liar dengan teknologi AI dan drone",
      authorId: "author-1",
      authorName: "Tim Redaksi Taman Kehati",
      authorRole: "SUPER_ADMIN",
      authorRegionId: null,
      category: "CONSERVATION",
      tags: ["monitoring", "satwa liar", "AI", "teknologi"],
      topics: ["konservasi", "teknologi", "inovasi"],
      parkId: null,
      metaTitle: "Program Monitoring Satwa Liar Diluncurkan di Seluruh Indonesia",
      metaDescription: "Peluncuran program monitoring satwa liar baru dengan teknologi AI dan drone di Taman Kehati Indonesia",
      metaKeywords: ["satwa liar", "monitoring", "konservasi", "AI", "drone"],
      readingTime: 5,
      status: "PUBLISHED",
      publishedAt: new Date("2024-03-15"),
      scheduledAt: null,
      viewCount: 342,
      likeCount: 28,
      shareCount: 15,
      commentCount: 8,
      createdAt: new Date("2024-03-15"),
      updatedAt: new Date("2024-03-15"),
      lastReadAt: new Date("2024-03-18"),
      isFeatured: true,
      isBreaking: false,
      isSponsored: false
    },
    {
      id: "2",
      title: "Penemuan Spesies Baru Burung Cenderawas Merah di Taman Nasional Gunung Leuser",
      slug: "penemuan-spesies-burung-cenderawas-merah-gunung-leuser",
      content: `
        <p>Tim peneliti dari LIPI berhasil mendokumentasikan keberadaan spesies burung cenderawas merah (Aceros nibbasilis) yang sebelumnya dianggap punah di Indonesia.</p>
        <p>Spesies ini ditemukan di kawasan hutan dataran rendah Taman Nasional Gunung Leuser, Aceh. Penemuan ini menjadi berita baik karena menambah daftar spesies burung Indonesia dan memperkuat pentingnya kawasan konservasi.</p>
        <p>"Ini penemuan yang sangat signifikan untuk ornitologi Indonesia. Burung cenderawas merah sebelumnya hanya diketahui di Malaysia dan Thailand, jadi ini adalah catatan pertama untuk Indonesia," kata Dr. Hari Wibowo, peneliti utama.</p>
      `,
      summary: "Spesies burung baru berhasil didokumentasikan di Gunung Leuser",
      authorId: "author-2",
      authorName: "Dr. Sarah Wijaya",
      authorRole: "SUPER_ADMIN",
      authorRegionId: null,
      category: "RESEARCH",
      tags: ["penemuan", "burung", "spesies baru", "gunung leuser"],
      topics: ["penelitian", "ornitologi", "spesies baru"],
      parkId: "park-1",
      metaTitle: "Penemuan Spesies Baru Burung Cenderawas Merah di Gunung Leuser",
      metaDescription: "Tim LIPI berhasil mendokumentasikan spesies burung cenderawas merah pertama di Indonesia",
      metaKeywords: ["burung", "penemuan", "spesies baru", "gunung leuser", "LIPI"],
      readingTime: 3,
      status: "PUBLISHED",
      publishedAt: new Date("2024-03-14"),
      scheduledAt: null,
      viewCount: 256,
      likeCount: 42,
      shareCount: 18,
      commentCount: 12,
      createdAt: new Date("2024-03-14"),
      updatedAt: new Date("2024-03-14"),
      lastReadAt: new Date("2024-03-16"),
      isFeatured: true,
      isBreaking: true,
      isSponsored: false
    },
    {
      id: "3",
      title: "Tips Fotografi Satwa di Habitat Alami: Panduan Lengkap",
      slug: "tips-fotografi-satwa-habitat-alam",
      content: `
        <p>Fotografi satwa di habitat alami membutuhkan keterampilan, kesabaran, dan pemahaman tentang perilaku satwa. Berikut panduan lengkap untuk fotografer pemula maupun berpengalaman.</p>
        <h3>Persiapan yang Perlu</h3>
        <ul>
          <li>Kamera dengan lensa yang sesuai (minimal 200mm untuk wildlife)</li>
          <>Tripod untuk stabilisasi</li>
          <>Camo pakaian untuk menyatu diri</li>
          <>Baterai cadangan</li>
          <>Binocular untuk observasi jarak jauh</li>
        </ul>
        <h3>Teknik Fotografi</h3>
        <ul>
          <li>Gunakan mode aperture priority untuk depth of field yang baik</li>
          <li>Fast shutter speed untuk menghindar blur</li>
          <li>ISO serendah mungkin untuk mengurangi noise</li>
          <li>Komposisi yang memperhatikan rule of thirds</li>
        </ul>
      `,
      summary: "Panduan lengkap fotografi satwa di alam liar untuk fotografer pemula",
      authorId: "author-3",
      authorName: "Budi Santoso",
      authorRole: "REGIONAL_ADMIN",
      authorRegionId: "region-jb",
      category: "EDUCATION",
      tags: ["fotografi", "satwa", "tips", "panduan"],
      topics: ["fotografi", "education", "tips"],
      parkId: null,
      metaTitle: "Tips Fotografi Satwa di Habitat Alami: Panduan Lengkap",
      metaDescription: "Panduan lengkap untuk fotografi satwa liar mulai dari persiapan hingga teknik pemotretikan",
      metaKeywords: ["fotografi satwa", "wildlife photography", "tips", "panduan"],
      readingTime: 4,
      status: "PUBLISHED",
      publishedAt: new Date("2024-03-12"),
      scheduledAt: null,
      viewCount: 189,
      likeCount: 34,
      shareCount: 12,
      commentCount: 6,
      createdAt: new Date("2024-03-12"),
      updatedAt: new Date("2024-03-12"),
      lastReadAt: new Date("2024-03-15"),
      isFeatured: false,
      isBreaking: false,
      isSponsored: false
    },
    {
      id: "4",
      title: "Masyarakat Adat Berperan Aktif dalam Pelestarian Hutan Mangrove",
      slug: "masyarakat-adat-pelestarian-hutan-mangrove",
      content: `
        <p>Komunitas adat di pesisir Sumatera Bagian Utara telah menunjukkan partisipasi aktif dalam pelestarian hutan mangrove melalui pengetahuan adat dan kearifan lokal.</p>
        <p>Penelitian yang dilakukan di tiga desa di Aceh Utara menunjukkan bahwa sistem pengetahuan adat yang telah ada selama generasi terbukti efektif dalam mencegah deforestasi ilegal.</p>
        <p>"Masyarakat adat adalah garda terdepan dalam pelestarian hutan. Mereka memiliki pengetahuan yang mendalam tentang pentingnya ekosistem mangrove," kata Dr. Ahmad Yani, peneliti dari Universitas Syiah Kuala.</p>
      `,
      summary: "Komunitas adat Aceh berhasil menjaga hutan mangrove melalui pengetahuan lokal",
      authorId: "author-4",
      authorName: "Dr. Ahmad Yani",
      authorRole: "SUPER_ADMIN",
      authorRegionId: null,
      category: "COMMUNITY",
      tags: ["masyarakat adat", "mangrove", "pelestarian", "konservasi"],
      topics: ["komunitas", "mangrove", "konservasi"],
      parkId: "park-3",
      metaTitle: "Masyarakat Adat Berperan Aktif dalam Pelestarian Hutan Mangrove",
      metaDescription: "Komunitas adat di Aceh menunjukkan partisipasi aktif dalam pelestarian hutan mangrove melalui sistem pengetahuan lokal",
      metaKeywords: ["masyarakat adat", "mangrove", "aceh", "konservasi komunitas"],
      readingTime: 6,
      status: "PUBLISHED",
      publishedAt: new Date("2024-03-10"),
      scheduledAt: null,
      viewCount: 145,
      likeCount: 28,
      shareCount: 8,
      commentCount: 4,
      createdAt: new Date("2024-03-10"),
      updatedAt: new Date("2024-03-10"),
      lastReadAt: new Date("2024-03-13"),
      isFeatured: false,
      isBreaking: false,
      isSponsored: false
    },
    {
      id: "5",
      title: "Workshop Pengelolaan Data Keanekaragaman Hayati untuk Regional Admin",
      slug: "workshop-pengelolaan-data-keanekaragaman-hayati",
      content: `
        <p>Sebanyak 38 Regional Admin dari seluruh Indonesia mengikuti workshop pengelolaan data keanekaragaman hayati yang diselenggarakan oleh Kementerian LHK.</p>
        <p>Workshop yang berlangsung selama tiga hari ini bertujuan untuk meningkatkan kapasitas admin regional dalam mengumpulkan, mengelola, dan melaporkan data flora dan fauna di wilayah kerja masing-masing.</p>
        <p>"Data yang akurat dan terkini adalah kunci untuk pengambilan keputusan konservasi yang berbasis bukti. Workshop ini akan membantu regional admin menjadi lebih terampil dalam mengelola data keanekaragaman hayati," jelas Kepala Badan Konservasi Sumber Daya Alam.</p>
      `,
      summary: "38 Regional Admin ikuti workshop pengelolaan data biodiversitas",
      authorId: "author-1",
      authorName: "Tim Redaksi Taman Kehati",
      authorRole: "SUPER_ADMIN",
      authorRegionId: null,
      category: "EVENT",
      tags: ["workshop", "training", "regional admin", "data"],
      topics: ["event", "training", "capacity building"],
      parkId: null,
      metaTitle: "Workshop Pengelolaan Data Keanekaragaman Hayati untuk Regional Admin",
      metaDescription: "Workshop tiga hari untuk meningkatkan kapasitas Regional Admin dalam pengelolaan data biodiversitas",
      metaKeywords: ["workshop", "training", "regional admin", "data biodiversitas"],
      readingTime: 4,
      status: "PUBLISHED",
      publishedAt: new Date("2024-03-08"),
      scheduledAt: null,
      viewCount: 98,
      likeCount: 15,
      shareCount: 6,
      commentCount: 2,
      createdAt: new Date("2024-03-08"),
      updatedAt: new Date("2024-03-08"),
      lastReadAt: new Date("2024-03-10"),
      isFeatured: false,
      isBreaking: false,
      isSponsored: false
    }
  ];

  // Available categories
  const availableCategories = [
    "NEWS", "CONSERVATION", "RESEARCH", "EDUCATION", "EVENT", "SUCCESS_STORY", "POLICY", "TECHNOLOGY", "COMMUNITY"
  ];

  useEffect(() => {
    setCategories(availableCategories);
    setArticles(mockArticles);
  }, []);

  // Filter articles based on selected criteria
  const filteredArticles = articles.filter(article => {
    const matchesCategory = !selectedCategory || article.category === selectedCategory;
    const matchesSearch = !searchQuery ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  // Sort articles
  const sortedArticles = [...filteredArticles].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.viewCount - a.viewCount;
      case 'trending':
        return (b.likeCount + b.shareCount) - (a.likeCount + a.shareCount);
      case 'latest':
      default:
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    }
  });

  return (
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
          articles={sortedArticles}
          loading={isLoading}
          onLoadMore={() => console.log("Load more articles")}
        />
      </div>
    </div>
  );
}