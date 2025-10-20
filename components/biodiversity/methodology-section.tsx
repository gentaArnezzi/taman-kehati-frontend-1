import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { BookOpen, Leaf, Zap, Trees, Calculator, Info } from "lucide-react";
import { cn } from "~/lib/utils";

export function MethodologySection() {
  const methodologySteps = [
    {
      icon: Leaf,
      title: "Penilaian Flora",
      description: "Jumlah total spesies flora yang tercatat, spesies endemik, dan spesies terancam di setiap taman.",
      weight: "40%",
      calculation: "Skor berdasarkan jumlah spesies (0-100 poin)"
    },
    {
      icon: Zap,
      title: "Penilaian Fauna",
      description: "Jumlah total spesies fauna yang tercatat, spesies endemik, dan status konservasi fauna.",
      weight: "40%",
      calculation: "Skor berdasarkan jumlah spesies (0-100 poin)"
    },
    {
      icon: Trees,
      title: "Penilaian Ekosistem",
      description: "Luas area taman, kualitas habitat, dan jenis ekosistem yang ada.",
      weight: "20%",
      calculation: "Skor berdasarkan luasan dan kualitas (0-100 poin)"
    }
  ];

  const scoreRanges = [
    { range: "80-100", label: "Sangat Baik", color: "bg-green-500", description: "Keanekaragaman hayati sangat tinggi" },
    { range: "60-79", label: "Baik", color: "bg-yellow-500", description: "Keanekaragaman hayati tinggi" },
    { range: "40-59", label: "Cukup", color: "bg-orange-500", description: "Keanekaragaman hayati sedang" },
    { range: "0-39", label: "Kurang", color: "bg-red-500", description: "Keanekaragaman hayati rendah" }
  ];

  const limitations = [
    "Data bersifat kualitatif dan kuantitatif",
    "Tergantung pada kelengkapan data yang tersedia",
    "Dinilai berdasarkan spesies yang telah teridentifikasi",
    "Mempertimbangkan faktor geografis dan ekologis"
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Metodologi Penilaian
        </CardTitle>
        <p className="text-sm text-gray-600">
          Cara kami menghitung Indeks Keanekaragaman Hayati untuk setiap Taman Kehati
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Overview */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-800 mb-1">Overview</h4>
                <p className="text-sm text-blue-700">
                  Indeks Keanekaragaman Hayati dihitung menggunakan metode weighted average
                  dari tiga komponen utama: flora (40%), fauna (40%), dan ekosistem (20%).
                </p>
              </div>
            </div>
          </div>

          {/* Methodology Steps */}
          <div>
            <h4 className="font-semibold mb-4">Komponen Penilaian</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {methodologySteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <Card key={index} className="border-2">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <Icon className="h-5 w-5 text-green-600" />
                        <CardTitle className="text-base">{step.title}</CardTitle>
                      </div>
                      <Badge variant="outline" className="w-fit">
                        {step.weight}
                      </Badge>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-gray-600 mb-2">
                        {step.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calculator className="h-3 w-3" />
                        <span>{step.calculation}</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Score Ranges */}
          <div>
            <h4 className="font-semibold mb-4">Interpretasi Skor</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {scoreRanges.map((range, index) => (
                <div
                  key={index}
                  className={cn(
                    "p-3 rounded-lg border-2",
                    range.color === "bg-green-500" && "border-green-200 bg-green-50",
                    range.color === "bg-yellow-500" && "border-yellow-200 bg-yellow-50",
                    range.color === "bg-orange-500" && "border-orange-200 bg-orange-50",
                    range.color === "bg-red-500" && "border-red-200 bg-red-50"
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">{range.range}</span>
                    <div className={cn("w-3 h-3 rounded-full", range.color)}></div>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      "mb-2",
                      range.label === "Sangat Baik" && "border-green-500 text-green-700",
                      range.label === "Baik" && "border-yellow-500 text-yellow-700",
                      range.label === "Cukup" && "border-orange-500 text-orange-700",
                      range.label === "Kurang" && "border-red-500 text-red-700"
                    )}
                  >
                    {range.label}
                  </Badge>
                  <p className="text-xs text-gray-600">
                    {range.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Formula */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-3">Formula Perhitungan</h4>
            <div className="bg-white p-4 rounded border font-mono text-sm">
              <div className="space-y-2">
                <div>
                  <span className="text-blue-600">Indeks Total</span> =
                  <span className="text-green-600"> (Skor Flora × 0.40)</span> +
                  <span className="text-orange-600"> (Skor Fauna × 0.40)</span> +
                  <span className="text-purple-600"> (Skor Ekosistem × 0.20)</span>
                </div>
                <div className="text-xs text-gray-500 border-t pt-2">
                  <div>Skor Flora = 0-100 (berdasarkan jumlah dan keanekaragaman spesies)</div>
                  <div>Skor Fauna = 0-100 (berdasarkan jumlah dan keanekaragaman spesies)</div>
                  <div>Skor Ekosistem = 0-100 (berdasarkan luasan dan kualitas habitat)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Limitations */}
          <div>
            <h4 className="font-semibold mb-3">Keterbatasan Metodologi</h4>
            <ul className="space-y-2">
              {limitations.map((limitation, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>{limitation}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Download Report */}
          <div className="flex justify-between items-center pt-4 border-t">
            <p className="text-sm text-gray-600">
              Untuk informasi lebih detail, download metodologi lengkap kami.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <BookOpen className="h-4 w-4 mr-2" />
                Download Metodologi
              </Button>
              <Button size="sm">
                Download Data Lengkap
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}