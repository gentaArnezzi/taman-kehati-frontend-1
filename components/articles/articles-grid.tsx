"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Article } from "~/lib/types";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import {
  Eye,
  Heart,
  Share2,
  MessageCircle,
  Clock,
  Star,
  TrendingUp,
  Calendar,
  BookmarkPlus
} from "lucide-react";

interface ArticlesGridProps {
  articles: Article[];
  loading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export function ArticlesGrid({
  articles,
  loading = false,
  onLoadMore,
  hasMore = true
}: ArticlesGridProps) {
  const [likedArticles, setLikedArticles] = useState<Set<string>>(new Set());
  const [bookmarkedArticles, setBookmarkedArticles] = useState<Set<string>>(new Set());

  // Separate featured and regular articles
  const featuredArticles = articles.filter(article => article.isFeatured);
  const regularArticles = articles.filter(article => !article.isFeatured);

  const handleLike = async (e: React.MouseEvent, articleId: string, currentLikes: number) => {
    e.preventDefault();
    e.stopPropagation();

    const newLikedArticles = new Set(likedArticles);
    const isLiked = newLikedArticles.has(articleId);

    if (isLiked) {
      newLikedArticles.delete(articleId);
    } else {
      newLikedArticles.add(articleId);
    }
    setLikedArticles(newLikedArticles);

    try {
      const response = await fetch(`/api/articles/${articleId}/like`, {
        method: 'POST',
      });

      if (!response.ok) {
        // Revert on error
        setLikedArticles(prev => {
          const reverted = new Set(prev);
          if (isLiked) {
            reverted.add(articleId);
          } else {
            reverted.delete(articleId);
          }
          return reverted;
        });
      }
    } catch (error) {
      console.error('Error liking article:', error);
      // Revert on error
      setLikedArticles(prev => {
        const reverted = new Set(prev);
        if (isLiked) {
          reverted.add(articleId);
        } else {
          reverted.delete(articleId);
        }
        return reverted;
      });
    }
  };

  const handleBookmark = async (e: React.MouseEvent, articleId: string) => {
    e.preventDefault();
    e.stopPropagation();

    const newBookmarkedArticles = new Set(bookmarkedArticles);
    const isBookmarked = newBookmarkedArticles.has(articleId);

    if (isBookmarked) {
      newBookmarkedArticles.delete(articleId);
    } else {
      newBookmarkedArticles.add(articleId);
    }
    setBookmarkedArticles(newBookmarkedArticles);

    try {
      const response = await fetch(`/api/articles/${articleId}/bookmark`, {
        method: 'POST',
      });

      if (!response.ok) {
        // Revert on error
        setBookmarkedArticles(prev => {
          const reverted = new Set(prev);
          if (isBookmarked) {
            reverted.add(articleId);
          } else {
            reverted.delete(articleId);
          }
          return reverted;
        });
      }
    } catch (error) {
      console.error('Error bookmarking article:', error);
      // Revert on error
      setBookmarkedArticles(prev => {
        const reverted = new Set(prev);
        if (isBookmarked) {
          reverted.add(articleId);
        } else {
          reverted.delete(articleId);
        }
        return reverted;
      });
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      NEWS: "bg-blue-100 text-blue-800",
      CONSERVATION: "bg-green-100 text-green-800",
      RESEARCH: "bg-purple-100 text-purple-800",
      EDUCATION: "bg-yellow-100 text-yellow-800",
      EVENT: "bg-orange-100 text-orange-800",
      SUCCESS_STORY: "bg-pink-100 text-pink-800",
      POLICY: "bg-red-100 text-red-800",
      TECHNOLOGY: "bg-indigo-100 text-indigo-800",
      COMMUNITY: "bg-teal-100 text-teal-800"
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      NEWS: "Berita",
      CONSERVATION: "Konservasi",
      RESEARCH: "Penelitian",
      EDUCATION: "Edukasi",
      EVENT: "Acara",
      SUCCESS_STORY: "Kisah Sukses",
      POLICY: "Kebijakan",
      TECHNOLOGY: "Teknologi",
      COMMUNITY: "Komunitas"
    };
    return labels[category] || category;
  };

  const ArticleCard = ({ article, isFeatured = false }: { article: Article; isFeatured?: boolean }) => {
    const isLiked = likedArticles.has(article.id);
    const isBookmarked = bookmarkedArticles.has(article.id);

    return (
      <Link href={`/artikel/${article.slug}`}>
        <Card className={`overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer ${
          isFeatured ? 'ring-2 ring-green-500 ring-opacity-50' : ''
        }`}>
          {/* Image Section */}
          <div className="relative h-48 overflow-hidden">
            {/* Placeholder gradient image */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-400 via-green-500 to-green-600">
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
            </div>

            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {isFeatured && (
                <Badge className="bg-yellow-500 text-white hover:bg-yellow-600 text-xs">
                  <Star className="w-3 h-3 mr-1" />
                  Pilihan
                </Badge>
              )}
              {article.isBreaking && (
                <Badge className="bg-red-600 text-white hover:bg-red-700 text-xs animate-pulse">
                  Breaking
                </Badge>
              )}
            </div>

            {/* Bookmark Button */}
            <Button
              variant="ghost"
              size="sm"
              className={`absolute top-2 right-2 bg-white/90 hover:bg-white text-gray-600 hover:text-green-600 p-1.5 h-8 w-8 ${
                isBookmarked ? 'text-green-600' : ''
              }`}
              onClick={(e) => handleBookmark(e, article.id)}
            >
              <BookmarkPlus className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </Button>
          </div>

          <CardContent className="p-4">
            {/* Category and Reading Time */}
            <div className="flex items-center gap-2 mb-2">
              <Badge className={`text-xs ${getCategoryColor(article.category)}`}>
                {getCategoryLabel(article.category)}
              </Badge>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                <span>{article.readingTime} menit</span>
              </div>
            </div>

            {/* Title */}
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-700 transition-colors">
              {article.title}
            </h3>

            {/* Summary */}
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {article.summary}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-3">
              {article.tags.slice(0, 3).map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-xs px-2 py-0.5 hover:bg-green-50 hover:border-green-300 transition-colors"
                >
                  #{tag}
                </Badge>
              ))}
              {article.tags.length > 3 && (
                <span className="text-xs text-gray-500">+{article.tags.length - 3}</span>
              )}
            </div>

            {/* Author and Date */}
            <div className="flex items-center gap-2 mb-3">
              <Avatar className="w-6 h-6">
                <AvatarImage src={`/avatars/${article.authorId}.jpg`} />
                <AvatarFallback className="bg-green-100 text-green-800 text-xs">
                  {article.authorName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-900 truncate">
                  {article.authorName}
                </p>
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(article.publishedAt, {
                    addSuffix: true,
                    locale: id
                  })}
                </p>
              </div>
            </div>

            {/* Stats and Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  <span>{article.viewCount}</span>
                </div>
                {article.commentCount > 0 && (
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" />
                    <span>{article.commentCount}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`text-gray-600 hover:text-red-600 transition-colors p-1 h-6 w-6 ${
                    isLiked ? 'text-red-600' : ''
                  }`}
                  onClick={(e) => handleLike(e, article.id, article.likeCount)}
                >
                  <Heart className={`w-3 h-3 ${isLiked ? 'fill-current' : ''}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-blue-600 transition-colors p-1 h-6 w-6"
                >
                  <Share2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  };

  if (loading && articles.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="h-48 bg-gray-200 animate-pulse" />
            <CardContent className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
              <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {articles.length === 0 && !loading ? (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="text-gray-400 mb-4">
              <TrendingUp className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Belum ada artikel
            </h3>
            <p className="text-gray-500">
              Belum ada artikel yang sesuai dengan filter yang Anda pilih.
              Coba ubah filter atau pencarian Anda.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Featured Articles Grid */}
          {featuredArticles.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Artikel Pilihan
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {featuredArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} isFeatured />
                ))}
              </div>
            </div>
          )}

          {/* Regular Articles Grid */}
          {regularArticles.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-500" />
                Artikel Terbaru
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {regularArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </div>
          )}

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center pt-8">
              <Button
                onClick={onLoadMore}
                disabled={loading}
                className="bg-green-700 hover:bg-green-800"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Memuat...
                  </>
                ) : (
                  <>
                    Muat Lebih Banyak
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Loading Skeleton for More Articles */}
          {loading && articles.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 2 }).map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="h-48 bg-gray-200 animate-pulse" />
                  <CardContent className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}