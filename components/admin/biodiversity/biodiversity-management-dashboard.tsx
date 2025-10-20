"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { BiodiversityTable } from "./biodiversity-table";
import { BiodiversityStats } from "./biodiversity-stats";
import { Plus, Search, Filter, Download, Eye } from "lucide-react";
import { Input } from "~/components/ui/input";
import { BiodiversityIndex } from "~/db/schema";
import { cn } from "~/lib/utils";

interface BiodiversityManagementDashboardProps {}

export function BiodiversityManagementDashboard({}: BiodiversityManagementDashboardProps) {
  const [selectedAssessment, setSelectedAssessment] = useState<BiodiversityIndex | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Mock data for demonstration
  const mockAssessments: BiodiversityIndex[] = [
    {
      id: "1",
      parkId: "park-1",
      assessmentDate: new Date("2024-01-15"),
      totalFloraSpecies: 456,
      endemicFloraSpecies: 89,
      threatenedFloraSpecies: 23,
      floraDiversityScore: 85,
      totalFaunaSpecies: 234,
      endemicFaunaSpecies: 45,
      threatenedFaunaSpecies: 12,
      faunaDiversityScore: 78,
      ecosystemTypes: ["Hutan Hujan Tropis", "Mangrove"],
      habitatQuality: 82,
      areaCoverage: 792705,
      overallBiodiversityScore: 82,
      ranking: 3,
      notes: "Assessment conducted during peak season",
      updatedBy: "user-1",
      status: "APPROVED",
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-16")
    },
    {
      id: "2",
      parkId: "park-2",
      assessmentDate: new Date("2024-02-20"),
      totalFloraSpecies: 378,
      endemicFloraSpecies: 67,
      threatenedFloraSpecies: 18,
      floraDiversityScore: 76,
      totalFaunaSpecies: 189,
      endemicFaunaSpecies: 34,
      threatenedFaunaSpecies: 8,
      faunaDiversityScore: 71,
      ecosystemTypes: ["Hutan Hujan Tropis"],
      habitatQuality: 75,
      areaCoverage: 356800,
      overallBiodiversityScore: 74,
      ranking: 7,
      notes: "Some species may be undercounted",
      updatedBy: "user-2",
      status: "PENDING",
      createdAt: new Date("2024-02-20"),
      updatedAt: new Date("2024-02-21")
    }
  ];

  const assessments = mockAssessments.filter(assessment => {
    const matchesSearch = !searchQuery ||
      assessment.parkId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assessment.notes?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || assessment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED": return "bg-green-100 text-green-800";
      case "PENDING": return "bg-yellow-100 text-yellow-800";
      case "DRAFT": return "bg-gray-100 text-gray-800";
      case "REJECTED": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleCreateNew = () => {
    setIsCreateModalOpen(true);
  };

  const handleViewDetails = (assessment: BiodiversityIndex) => {
    setSelectedAssessment(assessment);
  };

  const handleExport = () => {
    // Export functionality would be implemented here
    console.log("Exporting biodiversity data...");
  };

  return (
    <div className="space-y-6">
      {/* Statistics Overview */}
      <BiodiversityStats />

      {/* Actions and Filters */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Data Penilaian Indeks Keanekaragaman Hayati</CardTitle>
            <Button onClick={handleCreateNew}>
              <Plus className="h-4 w-4 mr-2" />
              Input Data Baru
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cari berdasarkan nama taman atau catatan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Tabs value={statusFilter} onValueChange={setStatusFilter}>
              <TabsList>
                <TabsTrigger value="all">Semua</TabsTrigger>
                <TabsTrigger value="APPROVED">Disetujui</TabsTrigger>
                <TabsTrigger value="PENDING">Menunggu</TabsTrigger>
                <TabsTrigger value="DRAFT">Draft</TabsTrigger>
                <TabsTrigger value="REJECTED">Ditolak</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Export Button */}
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{assessments.length}</div>
              <div className="text-sm text-gray-600">Total Penilaian</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {assessments.filter(a => a.status === "APPROVED").length}
              </div>
              <div className="text-sm text-gray-600">Disetujui</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {assessments.filter(a => a.status === "PENDING").length}
              </div>
              <div className="text-sm text-gray-600">Menunggu Review</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(assessments.reduce((sum, a) => sum + a.overallBiodiversityScore, 0) / assessments.length) || 0}
              </div>
              <div className="text-sm text-gray-600">Skor Rata-rata</div>
            </div>
          </div>

          {/* Data Table */}
          <BiodiversityTable
            assessments={assessments}
            onView={handleViewDetails}
            onEdit={(assessment) => {
              setSelectedAssessment(assessment);
              setIsCreateModalOpen(true);
            }}
            onDelete={(id) => {
              console.log("Delete assessment:", id);
            }}
          />
        </CardContent>
      </Card>

      {/* Create/Edit Modal Placeholder */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {selectedAssessment ? "Edit Data" : "Input Data Indeks Keanekaragaman Hayati"}
            </h2>
            <p className="text-gray-600 mb-4">
              Form input akan diimplementasikan di sini
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Batal
              </Button>
              <Button>
                Simpan
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}