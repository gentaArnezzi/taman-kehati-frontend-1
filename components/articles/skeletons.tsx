import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

export function ArticleListSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
      {/* Sidebar Filters */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <div className="space-y-2">
              {Array.from({ length: 8 }).map((_, index) => (
                <Skeleton key={index} className="h-8 w-full" />
              ))}
            </div>
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>

      {/* Articles Grid */}
      <div className="lg:col-span-3">
        {/* Featured Article Skeleton */}
        <Card className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="relative h-96 lg:h-auto">
              <Skeleton className="h-full w-full rounded-lg" />
            </div>
            <div className="p-6 lg:p-8 flex flex-col justify-center">
              <Skeleton className="h-8 w-48 mb-4" />
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-20 w-full mb-4" />
              <Skeleton className="h-4 w-24 mb-4" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </Card>

        {/* Article Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="relative h-48">
                <Skeleton className="h-full w-full rounded-lg" />
              </div>
              <CardContent className="p-5">
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-16 w-full mb-2" />
                <div className="flex justify-between items-center mb-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16 rounded" />
                  <Skeleton className="h-6 w-12 rounded" />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                  <AvatarSkeleton />
                  <Skeleton className="h-6 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More Skeleton */}
        <div className="col-span-full text-center mt-8">
          <Skeleton className="h-10 w-32 mx-auto" />
        </div>
      </div>
    </div>
  );
}

function AvatarSkeleton() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
      <Skeleton className="h-6 w-24" />
    </div>
  );
}

export function ArticleDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 mb-6">
        <Skeleton className="h-4 w-16" />
        <span>/</span>
        <Skeleton className="h-4 w-16" />
        <span>/</span>
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Title */}
      <div className="space-y-4 mb-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-3/4" />
      </div>

      {/* Article Meta */}
      <div className="flex items-center space-x-6 mb-6">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>

      {/* Author Info */}
      <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg mb-8">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-8 w-16" />
      </div>

      {/* Featured Image */}
      <div className="h-96 bg-gray-200 rounded-lg mb-8 animate-pulse" />

      {/* Article Content */}
      <div className="space-y-4 mb-8">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            {index % 2 === 0 && <Skeleton className="h-4 w-4/6" />}
          </div>
        ))}
      </div>

      {/* Tags */}
      <div className="flex items-center space-x-2 mb-8">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-16" />
        <div className="flex space-x-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-6 w-16 rounded-full" />
          ))}
        </div>
      </div>

      {/* Engagement Actions */}
      <div className="flex items-center space-x-4 mb-8">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>

      {/* Comments Section */}
      <div className="space-y-6 mb-12">
        <Skeleton className="h-8 w-32" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex space-x-3 p-4 bg-gray-50 rounded-lg">
              <Skeleton className="w-8 h-8 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Related Articles */}
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="space-y-4">
              <div className="h-32 bg-gray-200 rounded-lg animate-pulse" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <div className="flex space-x-4">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}