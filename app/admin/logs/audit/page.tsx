import { Suspense } from "react";
import { AuditLogDashboard } from "~/components/admin/audit/audit-log-dashboard";
import { DashboardSkeleton } from "~/components/admin/dashboard-skeleton";

export default function AuditLogPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Audit Log</h1>
          <p className="text-gray-600">
            Monitor semua aktivitas sistem dan perubahan data
          </p>
        </div>
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <AuditLogDashboard />
      </Suspense>
    </div>
  );
}