"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Textarea } from "~/components/ui/textarea";
import { Article } from "~/lib/types";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import {
  Calendar,
  Eye,
  Heart,
  Share2,
  MessageCircle,
  Clock,
  User,
  Tag,
  Send,
  BookmarkPlus,
  ArrowLeft,
  Facebook,
  Twitter,
  Linkedin,
  Whatsapp,
  Link2,
  Check
} from "lucide-react";

interface ArticleDetailPageProps {
  article: Article;
  relatedArticles: Article[];
}

interface Comment {
  id: string;
  content: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: Date;
  likes: number;
  isLiked: boolean;
  replies?: Comment[];
}

export function ArticleDetailPage({ article, relatedArticles }: ArticleDetailPageProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(article.likeCount);
  const [shareCount, setShareCount] = useState(article.shareCount);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);

  useEffect(() => {
    // Mock comments data
    setComments([
      {
        id: "1",
        content: "Artikel yang sangat informatif! Sangat membantu untuk memahami pentingnya konservasi satwa liar di Indonesia.",
        authorName: "Ahmad Wijaya",
        authorAvatar: "/avatars/user1.jpg",
        createdAt: new Date("2024-03-17T10:30:00"),
        likes: 12,
        isLiked: false
      },
      {
        id: "2",
        content: "Terima kasih telah berbagi informasi ini. Semoga semakin banyak orang yang peduli dengan keanekaragaman hayati Indonesia.",
        authorName: "Sarah Permata",
        authorAvatar: "/avatars/user2.jpg",
        createdAt: new Date("2024-03-17T14:20:00"),
        likes: 8,
        isLiked: true
      }
    ]);
  }, []);

  const handleLike = async () => {
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

  const handleBookmark = async () => {
    try {
      const response = await fetch(`/api/articles/${article.id}/bookmark`, {
        method: 'POST',
      });

      if (response.ok) {
        setIsBookmarked(!isBookmarked);
      }
    } catch (error) {
      console.error('Error bookmarking article:', error);
    }
  };

  const handleShare = async (platform?: string) => {
    const url = `${window.location.origin}/artikel/${article.slug}`;
    const text = `${article.title} - ${article.summary}`;

    try {
      if (platform === 'twitter') {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
      } else if (platform === 'facebook') {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
      } else if (platform === 'linkedin') {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
      } else if (platform === 'whatsapp') {
        window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`, '_blank');
      } else if (platform === 'copy') {
        await navigator.clipboard.writeText(url);
        setCopiedToClipboard(true);
        setTimeout(() => setCopiedToClipboard(false), 2000);
      } else {
        // Default share
        if (navigator.share) {
          await navigator.share({
            title: article.title,
            text: article.summary,
            url: url,
          });
        } else {
          await navigator.clipboard.writeText(url);
          setCopiedToClipboard(true);
          setTimeout(() => setCopiedToClipboard(false), 2000);
        }
      }

      setShareCount(prev => prev + 1);
      setShowShareMenu(false);
    } catch (error) {
      console.error('Error sharing article:', error);
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    setIsSubmittingComment(true);

    try {
      const response = await fetch(`/api/articles/${article.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment,
        }),
      });

      if (response.ok) {
        const comment = await response.json();
        setComments(prev => [comment, ...prev]);
        setNewComment("");
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmittingComment(false);
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
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <ol className="flex items-center space-x-2 text-sm text-gray-600">
          <li>
            <Link href="/" className="hover:text-green-600 transition-colors">
              Beranda
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/artikel" className="hover:text-green-600 transition-colors">
              Artikel
            </Link>
          </li>
          <li>/</li>
          <li className="text-gray-900 truncate max-w-xs">
            {article.title}
          </li>
        </ol>
      </nav>

      {/* Back Button */}
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => window.history.back()}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Kembali
      </Button>

      {/* Article Header */}
      <article className="prose prose-lg max-w-none">
        <header className="mb-8">
          {/* Category and Badges */}
          <div className="flex items-center gap-3 mb-4">
            <Badge className={getCategoryColor(article.category)}>
              {getCategoryLabel(article.category)}
            </Badge>
            {article.isFeatured && (
              <Badge className="bg-yellow-500 text-white">
                <Star className="w-3 h-3 mr-1" />
                Artikel Pilihan
              </Badge>
            )}
            {article.isBreaking && (
              <Badge className="bg-red-600 text-white animate-pulse">
                Breaking News
              </Badge>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {article.title}
          </h1>

          {/* Article Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{article.readingTime} menit baca</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(article.publishedAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>{article.viewCount.toLocaleString('id-ID')} dibaca</span>
            </div>
          </div>

          {/* Author Info */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <Avatar className="w-12 h-12">
              <AvatarImage src={`/avatars/${article.authorId}.jpg`} />
              <AvatarFallback className="bg-green-100 text-green-800">
                {article.authorName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium text-gray-900">{article.authorName}</p>
                <Badge variant="outline" className="text-xs">
                  {article.authorRole === 'SUPER_ADMIN' ? 'Super Admin' :
                   article.authorRole === 'REGIONAL_ADMIN' ? 'Admin Regional' : 'Author'}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">
                {formatDistanceToNow(article.publishedAt, {
                  addSuffix: true,
                  locale: id
                })}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-gray-600 hover:text-green-600"
            >
              Follow
            </Button>
          </div>
        </header>

        {/* Featured Image */}
        <div className="mb-8">
          <div className="relative h-96 lg:h-[500px] rounded-lg overflow-hidden bg-gradient-to-br from-green-400 via-green-500 to-green-600">
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute bottom-4 left-4 text-white">
              <p className="text-sm opacity-90">Image: {article.title}</p>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <div
          className="prose-headings:text-gray-900 prose-p:text-gray-700 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-blockquote:text-gray-600 prose-code:text-gray-900 prose-pre:bg-gray-100 prose-lead:text-gray-700 mb-8"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Tags */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Tag className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Tags:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <Link key={tag} href={`/artikel?tag=${encodeURIComponent(tag)}`}>
                <Badge
                  variant="outline"
                  className="hover:bg-green-50 hover:border-green-300 transition-colors cursor-pointer"
                >
                  #{tag}
                </Badge>
              </Link>
            ))}
          </div>
        </div>

        <Separator className="my-8" />

        {/* Engagement Actions */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <Button
            variant={isLiked ? "default" : "outline"}
            size="sm"
            className={`transition-colors ${
              isLiked ? 'bg-red-600 hover:bg-red-700 text-white' : 'hover:text-red-600'
            }`}
            onClick={handleLike}
          >
            <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
            {likeCount} Suka
          </Button>

          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowShareMenu(!showShareMenu)}
            >
              <Share2 className="w-4 h-4 mr-2" />
              {shareCount} Bagikan
            </Button>

            {showShareMenu && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-10 min-w-[200px]">
                <div className="grid grid-cols-2 gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start text-gray-700 hover:bg-gray-100"
                    onClick={() => handleShare('twitter')}
                  >
                    <Twitter className="w-4 h-4 mr-2" />
                    Twitter
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start text-gray-700 hover:bg-gray-100"
                    onClick={() => handleShare('facebook')}
                  >
                    <Facebook className="w-4 h-4 mr-2" />
                    Facebook
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start text-gray-700 hover:bg-gray-100"
                    onClick={() => handleShare('linkedin')}
                  >
                    <Linkedin className="w-4 h-4 mr-2" />
                    LinkedIn
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start text-gray-700 hover:bg-gray-100"
                    onClick={() => handleShare('whatsapp')}
                  >
                    <Whatsapp className="w-4 h-4 mr-2" />
                    WhatsApp
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start text-gray-700 hover:bg-gray-100 col-span-2"
                    onClick={() => handleShare('copy')}
                  >
                    {copiedToClipboard ? (
                      <>
                        <Check className="w-4 h-4 mr-2 text-green-600" />
                        Tersalin!
                      </>
                    ) : (
                      <>
                        <Link2 className="w-4 h-4 mr-2" />
                        Salin Link
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>

          <Button
            variant={isBookmarked ? "default" : "outline"}
            size="sm"
            className={`transition-colors ${
              isBookmarked ? 'bg-green-600 hover:bg-green-700 text-white' : 'hover:text-green-600'
            }`}
            onClick={handleBookmark}
          >
            <BookmarkPlus className={`w-4 h-4 mr-2 ${isBookmarked ? 'fill-current' : ''}`} />
            {isBookmarked ? 'Tersimpan' : 'Simpan'}
          </Button>

          <div className="flex items-center gap-1 text-sm text-gray-500">
            <MessageCircle className="w-4 h-4" />
            <span>{comments.length} Komentar</span>
          </div>
        </div>
      </article>

      <Separator className="my-8" />

      {/* Comments Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Komentar ({comments.length})
        </h2>

        {/* Add Comment */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <Textarea
              placeholder="Tulis komentar Anda..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="mb-3 min-h-[100px] resize-none"
            />
            <div className="flex justify-end">
              <Button
                onClick={handleCommentSubmit}
                disabled={!newComment.trim() || isSubmittingComment}
                className="bg-green-700 hover:bg-green-800"
              >
                {isSubmittingComment ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Mengirim...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Kirim Komentar
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.map((comment) => (
            <Card key={comment.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={comment.authorAvatar} />
                    <AvatarFallback>
                      {comment.authorName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-medium text-gray-900 text-sm">
                        {comment.authorName}
                      </p>
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(comment.createdAt, {
                          addSuffix: true,
                          locale: id
                        })}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm mb-2">
                      {comment.content}
                    </p>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`text-xs h-6 px-2 ${
                          comment.isLiked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
                        }`}
                      >
                        <Heart className={`w-3 h-3 mr-1 ${comment.isLiked ? 'fill-current' : ''}`} />
                        {comment.likes}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs h-6 px-2 text-gray-500 hover:text-blue-600"
                      >
                        Balas
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Artikel Terkait
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedArticles.map((relatedArticle) => (
              <Link key={relatedArticle.id} href={`/artikel/${relatedArticle.slug}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="h-32 bg-gradient-to-br from-green-400 via-green-500 to-green-600 rounded-t-lg" />
                  <CardContent className="p-4">
                    <Badge className={`text-xs mb-2 ${getCategoryColor(relatedArticle.category)}`}>
                      {getCategoryLabel(relatedArticle.category)}
                    </Badge>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-green-700 transition-colors">
                      {relatedArticle.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                      {relatedArticle.summary}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{relatedArticle.viewCount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{relatedArticle.readingTime} menit</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// Import Star component
import { Star } from "lucide-react";