"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Badge } from "~/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Filter, Search, Calendar, TrendingUp, X } from "lucide-react";

interface ArticleFiltersProps {
  categories: string[];
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
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
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(localSearchQuery);
  };

  const clearAllFilters = () => {
    onCategoryChange(null);
    setLocalSearchQuery("");
    onSearchChange("");
    onSortChange('latest');
  };

  const hasActiveFilters = selectedCategory || searchQuery || sortBy !== 'latest';

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      NEWS: "bg-blue-100 text-blue-800 hover:bg-blue-200",
      CONSERVATION: "bg-green-100 text-green-800 hover:bg-green-200",
      RESEARCH: "bg-purple-100 text-purple-800 hover:bg-purple-200",
      EDUCATION: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
      EVENT: "bg-orange-100 text-orange-800 hover:bg-orange-200",
      SUCCESS_STORY: "bg-pink-100 text-pink-800 hover:bg-pink-200",
      POLICY: "bg-red-100 text-red-800 hover:bg-red-200",
      TECHNOLOGY: "bg-indigo-100 text-indigo-800 hover:bg-indigo-200",
      COMMUNITY: "bg-teal-100 text-teal-800 hover:bg-teal-200"
    };
    return colors[category] || "bg-gray-100 text-gray-800 hover:bg-gray-200";
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
    <Card className="sticky top-4">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Artikel
          </CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-gray-500 hover:text-red-600"
            >
              <X className="h-4 w-4 mr-1" />
              Reset
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Search */}
        <div>
          <Label className="text-sm font-medium mb-2 block">
            Pencarian
          </Label>
          <form onSubmit={handleSearchSubmit}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cari artikel..."
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
                className="pl-10 pr-10"
              />
              {localSearchQuery && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => {
                    setLocalSearchQuery("");
                    onSearchChange("");
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </form>
        </div>

        {/* Categories */}
        <div>
          <Label className="text-sm font-medium mb-3 block">
            Kategori
          </Label>
          <div className="space-y-2">
            <button
              onClick={() => onCategoryChange(null)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                !selectedCategory
                  ? 'bg-green-100 text-green-800 border-green-300 font-medium'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
              }`}
            >
              Semua Kategori
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onCategoryChange(
                  selectedCategory === category ? null : category
                )}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedCategory === category
                    ? 'bg-green-100 text-green-800 border-green-300 font-medium'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {getCategoryLabel(category)}
                <span className="float-right text-xs opacity-60">
                  {category}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Sort By */}
        <div>
          <Label className="text-sm font-medium mb-2 block">
            Urutkan
          </Label>
          <Select value={sortBy} onValueChange={(value: any) => onSortChange(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Terbaru
                </div>
              </SelectItem>
              <SelectItem value="popular">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Terpopuler
                </div>
              </SelectItem>
              <SelectItem value="trending">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Trending
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="pt-4 border-t">
            <Label className="text-sm font-medium mb-2 block">
              Filter Aktif
            </Label>
            <div className="flex flex-wrap gap-2">
              {selectedCategory && (
                <Badge
                  variant="secondary"
                  className="cursor-pointer hover:bg-red-100 hover:text-red-800"
                  onClick={() => onCategoryChange(null)}
                >
                  {getCategoryLabel(selectedCategory)}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              )}
              {searchQuery && (
                <Badge
                  variant="secondary"
                  className="cursor-pointer hover:bg-red-100 hover:text-red-800"
                  onClick={() => {
                    setLocalSearchQuery("");
                    onSearchChange("");
                  }}
                >
                  "{searchQuery}"
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              )}
              {sortBy !== 'latest' && (
                <Badge
                  variant="secondary"
                  className="cursor-pointer hover:bg-red-100 hover:text-red-800"
                  onClick={() => onSortChange('latest')}
                >
                  {sortBy === 'popular' ? 'Terpopuler' : 'Trending'}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="pt-4 border-t">
          <Label className="text-sm font-medium mb-3 block">
            Link Cepat
          </Label>
          <div className="space-y-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sm h-auto p-2 hover:bg-green-50"
              onClick={() => {
                onCategoryChange("CONSERVATION");
                setLocalSearchQuery("");
                onSearchChange("");
              }}
            >
              🌿 Konservasi
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sm h-auto p-2 hover:bg-green-50"
              onClick={() => {
                onCategoryChange("RESEARCH");
                setLocalSearchQuery("");
                onSearchChange("");
              }}
            >
              🔬 Penelitian
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sm h-auto p-2 hover:bg-green-50"
              onClick={() => {
                onCategoryChange("EDUCATION");
                setLocalSearchQuery("");
                onSearchChange("");
              }}
            >
              📚 Edukasi
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sm h-auto p-2 hover:bg-green-50"
              onClick={() => {
                setLocalSearchQuery("spesies baru");
                onSearchChange("spesies baru");
              }}
            >
              🔍 Spesies Baru
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}