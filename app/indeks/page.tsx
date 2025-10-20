import { Suspense } from "react";
import { BiodiversityOverview } from "~/components/biodiversity/biodiversity-overview";
import { NationalMap } from "~/components/biodiversity/national-map";
import { TopPerformers } from "~/components/biodiversity/top-performers";
import { MethodologySection } from "~/components/biodiversity/methodology-section";
import { BiodiversityOverviewSkeleton } from "~/components/biodiversity/skeletons";

export default function BiodiversityIndexPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12">
        <h1 className="text-4xl font-bold text-green-800 mb-4">
          Indeks Keanekaragaman Hayati Nasional
        </h1>
        <p className="text-lg text-gray-600 max-w-4xl">
          Monitor dan evaluasi tingkat keanekaragaman hayati di seluruh Taman Kehati
          Indonesia melalui indeks komprehensif yang mencakup metrik flora, fauna, dan ekosistem.
        </p>
      </section>

      <Suspense fallback={<BiodiversityOverviewSkeleton />}>
        <BiodiversityOverview />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2">
          <NationalMap />
        </div>
        <div>
          <TopPerformers />
        </div>
      </div>

      <MethodologySection />
    </div>
  );
}