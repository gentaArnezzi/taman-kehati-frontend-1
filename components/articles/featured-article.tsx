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
import { Calendar, Eye, Heart, Share2, ArrowRight, Clock } from "lucide-react";

interface FeaturedArticleProps {
  article: Article;
}

export function FeaturedArticle({ article }: FeaturedArticleProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(article.likeCount);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const response = await fetch(`/api/articles/${article.id}/like`, {
        method: 'POST',
      });

      if (response.ok) {
        setIsLiked(!isLiked);
        setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
      }
    } catch (error) {
      console.error('Error liking article:', error);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.summary,
          url: `/artikel/${article.slug}`,
        });
      } catch (error) {
        console.error('Error sharing article:', error);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(`${window.location.origin}/artikel/${article.slug}`);
        // You could show a toast notification here
      } catch (error) {
        console.error('Error copying to clipboard:', error);
      }
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

  return (
    <Link href={`/artikel/${article.slug}`}>
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Image Section */}
          <div className="relative h-96 lg:h-full min-h-[400px] overflow-hidden">
            {/* Placeholder image with gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-400 via-green-500 to-green-600">
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
            </div>

            {/* Featured Badge */}
            <div className="absolute top-4 left-4 z-10">
              <Badge className="bg-yellow-500 text-white hover:bg-yellow-600">
                <Star className="w-3 h-3 mr-1" />
                Artikel Pilihan
              </Badge>
            </div>

            {/* Breaking News Badge */}
            {article.isBreaking && (
              <div className="absolute top-4 right-4 z-10">
                <Badge className="bg-red-600 text-white hover:bg-red-700 animate-pulse">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Breaking News
                </Badge>
              </div>
            )}

            {/* Overlay with view count */}
            <div className="absolute bottom-4 left-4 z-10">
              <div className="flex items-center gap-2 text-white/90 text-sm">
                <Eye className="w-4 h-4" />
                <span>{article.viewCount.toLocaleString('id-ID')} dibaca</span>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6 lg:p-8 flex flex-col justify-center">
            {/* Category and Meta */}
            <div className="flex items-center gap-3 mb-4">
              <Badge className={getCategoryColor(article.category)}>
                {getCategoryLabel(article.category)}
              </Badge>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>{article.readingTime} menit baca</span>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 line-clamp-3 group-hover:text-green-700 transition-colors">
              {article.title}
            </h2>

            {/* Summary */}
            <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
              {article.summary}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {article.tags.slice(0, 4).map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-xs hover:bg-green-50 hover:border-green-300 transition-colors"
                >
                  #{tag}
                </Badge>
              ))}
              {article.tags.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{article.tags.length - 4} lainnya
                </Badge>
              )}
            </div>

            {/* Author and Date */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={`/avatars/${article.authorId}.jpg`} />
                  <AvatarFallback className="bg-green-100 text-green-800">
                    {article.authorName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900">{article.authorName}</p>
                  <p className="text-sm text-gray-500">
                    {formatDistanceToNow(article.publishedAt, {
                      addSuffix: true,
                      locale: id
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`text-gray-600 hover:text-red-600 transition-colors ${
                    isLiked ? 'text-red-600' : ''
                  }`}
                  onClick={handleLike}
                >
                  <Heart className={`w-4 h-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
                  {likeCount}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                  onClick={handleShare}
                >
                  <Share2 className="w-4 h-4 mr-1" />
                  {article.shareCount}
                </Button>
              </div>

              <Button
                variant="ghost"
                className="text-green-700 hover:text-green-800 group-hover:bg-green-50 transition-all"
              >
                Baca Selengkapnya
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

// Additional imports that were referenced
import { Star, AlertCircle } from "lucide-react";