import { Suspense } from "react";
import { EnhancedMapPage } from "~/components/maps/enhanced-map-page";
import { EnhancedMapSkeleton } from "~/components/maps/skeletons";

export default function MapPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<EnhancedMapSkeleton />}>
        <EnhancedMapPage />
      </Suspense>
    </div>
  );
}