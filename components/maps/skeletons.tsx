import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

export function EnhancedMapSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="space-y-2">
          <Skeleton className="h-9 w-80" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Map Area Skeleton */}
        <div className="lg:col-span-3 space-y-4">
          {/* Search and Controls Skeleton */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Skeleton className="h-10 w-full pl-10" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-10 w-20" />
            </div>
          </div>

          {/* Map Container Skeleton */}
          <div className="relative h-[600px]">
            <Skeleton className="w-full h-full rounded-lg" />

            {/* Map Stats Overlay Skeleton */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg space-y-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-28" />
            </div>

            {/* Climate Info Overlay Skeleton */}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-8" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-8" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-12" />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Skeleton */}
        <div className="space-y-6">
          {/* Map Filters Skeleton */}
          <Card className="sticky top-4">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-6 w-24" />
                </div>
                <Skeleton className="h-8 w-8" />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Location Types Skeleton */}
              <div>
                <Skeleton className="h-4 w-24 mb-3" />
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-5 w-8" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Separator Skeleton */}
              <Skeleton className="h-px w-full" />

              {/* Conservation Status Skeleton */}
              <div>
                <Skeleton className="h-4 w-32 mb-3" />
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-3 w-3 rounded-full" />
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-5 w-8" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Separator Skeleton */}
              <Skeleton className="h-px w-full" />

              {/* Regions Skeleton */}
              <div>
                <Skeleton className="h-4 w-16 mb-3" />
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-5 w-8" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Biodiversity Range Skeleton */}
              <div>
                <Skeleton className="h-4 w-48 mb-3" />
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-8" />
                    <Skeleton className="h-4 w-8" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                </div>
              </div>

              {/* Quick Filters Skeleton */}
              <div>
                <Skeleton className="h-4 w-24 mb-3" />
                <div className="grid grid-cols-2 gap-2">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton key={index} className="h-8 w-full" />
                  ))}
                </div>
              </div>

              {/* Results Summary Skeleton */}
              <div className="pt-4 border-t">
                <Skeleton className="h-4 w-48 mx-auto" />
              </div>
            </CardContent>
          </Card>

          {/* Map Sidebar Skeleton */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-6" />
                  <div>
                    <Skeleton className="h-6 w-48 mb-1" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
                <Skeleton className="h-6 w-6" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Status Badges Skeleton */}
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
              </div>

              {/* Description Skeleton */}
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />

              {/* Separator Skeleton */}
              <Skeleton className="h-px w-full" />

              {/* Quick Stats Skeleton */}
              <div className="grid grid-cols-2 gap-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <div>
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Climate Data Skeleton */}
              <div>
                <Skeleton className="h-4 w-24 mb-3" />
                <div className="grid grid-cols-3 gap-2">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="text-center p-2 bg-gray-50 rounded">
                      <Skeleton className="h-4 w-4 mx-auto mb-1" />
                      <Skeleton className="h-3 w-12 mx-auto" />
                      <Skeleton className="h-4 w-8 mx-auto" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Species Skeleton */}
              <div>
                <Skeleton className="h-4 w-32 mb-3" />
                <div className="flex flex-wrap gap-1">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Skeleton key={index} className="h-5 w-16" />
                  ))}
                </div>
              </div>

              {/* Coordinates Skeleton */}
              <div className="text-xs bg-gray-50 p-2 rounded">
                <Skeleton className="h-3 w-32" />
              </div>

              {/* Action Buttons Skeleton */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Skeleton className="h-9 flex-1" />
                  <Skeleton className="h-9 w-9" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-9 flex-1" />
                  <Skeleton className="h-9 flex-1" />
                </div>
              </div>

              {/* External Links Skeleton */}
              <div className="pt-2">
                <Skeleton className="h-8 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}