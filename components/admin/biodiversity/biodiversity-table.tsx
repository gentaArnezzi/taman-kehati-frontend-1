import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Eye, Edit, Trash2, Calendar, TrendingUp } from "lucide-react";
import { formatDate, formatNumber } from "~/lib/utils";
import { BiodiversityIndex } from "~/db/schema";

interface BiodiversityTableProps {
  assessments: BiodiversityIndex[];
  onView: (assessment: BiodiversityIndex) => void;
  onEdit: (assessment: BiodiversityIndex) => void;
  onDelete: (id: string) => void;
}

export function BiodiversityTable({
  assessments,
  onView,
  onEdit,
  onDelete
}: BiodiversityTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED": return "bg-green-100 text-green-800";
      case "PENDING": return "bg-yellow-100 text-yellow-800";
      case "DRAFT": return "bg-gray-100 text-gray-800";
      case "REJECTED": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return "default";
    if (score >= 60) return "secondary";
    if (score >= 40) return "outline";
    return "destructive";
  };

  if (assessments.length === 0) {
    return (
      <div className="text-center py-12">
        <TrendingUp className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Belum ada data penilaian
        </h3>
        <p className="text-gray-500">
          Mulai dengan menambahkan data indeks keanekaragaman hayati untuk taman-taman
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Taman</TableHead>
            <TableHead>Tanggal Penilaian</TableHead>
            <TableHead>Skor Total</TableHead>
            <TableHead>Flora</TableHead>
            <TableHead>Fauna</TableHead>
            <TableHead>Ekosistem</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assessments.map((assessment) => (
            <TableRow key={assessment.id} className="hover:bg-gray-50">
              <TableCell>
                <div>
                  <div className="font-medium">
                    {assessment.parkId}
                  </div>
                  <div className="text-sm text-gray-500">
                    Peringkat #{assessment.ranking}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">
                    {formatDate(assessment.assessmentDate)}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <Badge
                    variant={getScoreBadgeVariant(assessment.overallBiodiversityScore)}
                    className={cn(
                      "font-bold",
                      getScoreColor(assessment.overallBiodiversityScore)
                    )}
                  >
                    {assessment.overallBiodiversityScore}/100
                  </Badge>
                  <div className="text-xs text-gray-500">
                    {assessment.overallBiodiversityScore >= 80 ? 'Sangat Baik' :
                     assessment.overallBiodiversityScore >= 60 ? 'Baik' :
                     assessment.overallBiodiversityScore >= 40 ? 'Cukup' : 'Kurang'}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <div className="font-medium">{assessment.floraDiversityScore}/100</div>
                  <div className="text-xs text-gray-500">
                    {formatNumber(assessment.totalFloraSpecies)} spesies
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <div className="font-medium">{assessment.faunaDiversityScore}/100</div>
                  <div className="text-xs text-gray-500">
                    {formatNumber(assessment.totalFaunaSpecies)} spesies
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <div className="font-medium">{assessment.habitatQuality}/100</div>
                  <div className="text-xs text-gray-500">
                    {formatNumber(Number(assessment.areaCoverage))} ha
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(assessment.status)}>
                  {assessment.status === 'APPROVED' ? 'Disetujui' :
                   assessment.status === 'PENDING' ? 'Menunggu Review' :
                   assessment.status === 'DRAFT' ? 'Draft' : 'Ditolak'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onView(assessment)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(assessment)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(assessment.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}