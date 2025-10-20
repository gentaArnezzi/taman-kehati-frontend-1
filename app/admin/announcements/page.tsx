import { Suspense } from "react";
import { AnnouncementsManagement } from "~/components/admin/announcements/announcements-management";
import { DashboardSkeleton } from "~/components/admin/dashboard-skeleton";

export default function AnnouncementsManagementPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Manajemen Pengumuman</h1>
          <p className="text-gray-600">
            Buat dan kelola pengumuman untuk Regional Admin
          </p>
        </div>
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <AnnouncementsManagement />
      </Suspense>
    </div>
  );
}