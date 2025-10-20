import { Suspense } from "react";
import { ArticleListPage } from "@/components/articles/article-list-page";
import { ArticleListSkeleton } from "@/components/articles/skeletons";

export default function ArticlesPage() {
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

      <Suspense fallback={<ArticleListSkeleton />}>
        <ArticleListPage />
      </Suspense>
    </div>
  );
}