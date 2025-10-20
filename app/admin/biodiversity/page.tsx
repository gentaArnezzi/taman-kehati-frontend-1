import { Suspense } from "react";
import { BiodiversityManagementDashboard } from "~/components/admin/biodiversity/biodiversity-management-dashboard";
import { DashboardSkeleton } from "~/components/admin/dashboard-skeleton";

export default function BiodiversityManagementPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Manajemen Indeks Keanekaragaman Hayati</h1>
          <p className="text-gray-600">
            Input dan kelola data indeks keanekaragaman hayati untuk setiap Taman Kehati
          </p>
        </div>
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <BiodiversityManagementDashboard />
      </Suspense>
    </div>
  );
}