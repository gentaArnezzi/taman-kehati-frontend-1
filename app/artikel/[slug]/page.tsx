import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ArticleDetailPage } from "~/components/articles/article-detail-page";
import { ArticleDetailSkeleton } from "~/components/articles/skeletons";

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

async function getArticle(slug: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/articles/${slug}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch article');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

async function getRelatedArticles(articleId: string, category?: string, tags?: string[]) {
  try {
    const params = new URLSearchParams({
      limit: '4',
      exclude: articleId,
    });

    if (category) {
      params.append('category', category);
    }

    if (tags && tags.length > 0) {
      params.append('tags', tags.slice(0, 3).join(','));
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/articles/related?${params}`,
      {
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch related articles');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching related articles:', error);
    return [];
  }
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const article = await getArticle(params.slug);

  if (!article) {
    return {
      title: 'Artikel Tidak Ditemukan',
      description: 'Artikel yang Anda cari tidak ditemukan.',
    };
  }

  return {
    title: article.metaTitle || article.title,
    description: article.metaDescription || article.summary,
    keywords: article.metaKeywords?.join(', ') || article.tags?.join(', '),
    openGraph: {
      title: article.metaTitle || article.title,
      description: article.metaDescription || article.summary,
      type: 'article',
      publishedTime: article.publishedAt,
      authors: [article.authorName],
      images: [
        {
          url: article.featuredImage || '/images/default-article.jpg',
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.metaTitle || article.title,
      description: article.metaDescription || article.summary,
      images: [article.featuredImage || '/images/default-article.jpg'],
    },
    alternates: {
      canonical: `/artikel/${params.slug}`,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await getArticle(params.slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = await getRelatedArticles(
    article.id,
    article.category,
    article.tags
  );

  // Increment view count
  try {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/articles/${article.id}/view`, {
      method: 'POST',
    });
  } catch (error) {
    console.error('Error incrementing view count:', error);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<ArticleDetailSkeleton />}>
        <ArticleDetailPage article={article} relatedArticles={relatedArticles} />
      </Suspense>
    </div>
  );
}