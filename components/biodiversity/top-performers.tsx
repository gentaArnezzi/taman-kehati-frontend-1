import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Eye, MapPin } from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";

interface Park {
  id: string;
  name: string;
  province: string;
  score: number;
  totalFlora: number;
  totalFauna: number;
  area: number;
  slug: string;
}

interface TopPerformersProps {
  parks?: Park[];
  maxItems?: number;
}

export function TopPerformers({ parks, maxItems = 10 }: TopPerformersProps) {
  // Mock data - in real implementation, this would come from API
  const mockParks: Park[] = [
    {
      id: "1",
      name: "Taman Nasional Gunung Leuser",
      province: "Aceh",
      score: 92.3,
      totalFlora: 456,
      totalFauna: 234,
      area: 792705,
      slug: "gunung-leuser"
    },
    {
      id: "2",
      name: "Taman Nasional Lorentz",
      province: "Papua",
      score: 91.8,
      totalFlora: 678,
      totalFauna: 345,
      area: 2535610,
      slug: "lorentz"
    },
    {
      id: "3",
      name: "Taman Nasional Bukit Barisan Selatan",
      province: "Sumatera Selatan",
      score: 89.5,
      totalFlora: 389,
      totalFauna: 198,
      area: 356800,
      slug: "bukit-barisan-selatan"
    },
    {
      id: "4",
      name: "Taman Nasional Kerinci Seblat",
      province: "Jambi",
      score: 87.2,
      totalFlora: 423,
      totalFauna: 267,
      area: 1373000,
      slug: "kerinci-seblat"
    },
    {
      id: "5",
      name: "Taman Nasional Ujung Kulon",
      province: "Banten",
      score: 85.6,
      totalFlora: 234,
      totalFauna: 156,
      area: 122950,
      slug: "ujung-kulon"
    }
  ];

  const topParks = (parks || mockParks).slice(0, maxItems);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-4 w-4 text-yellow-500" />;
      case 2:
        return <Trophy className="h-4 w-4 text-gray-400" />;
      case 3:
        return <Trophy className="h-4 w-4 text-amber-600" />;
      default:
        return <span className="text-sm font-bold text-gray-600">{rank}</span>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 90) return "default";
    if (score >= 80) return "secondary";
    if (score >= 70) return "outline";
    return "destructive";
  };

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Taman Kehati Terbaik
        </CardTitle>
        <p className="text-sm text-gray-600">
          Peringkat Taman Kehati dengan indeks keanekaragaman hayati tertinggi
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {topParks.map((park, index) => (
            <div
              key={park.id}
              className={cn(
                "flex items-center justify-between p-3 rounded-lg border",
                "hover:bg-gray-50 transition-colors cursor-pointer"
              )}
            >
              {/* Rank and Basic Info */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex items-center justify-center w-8">
                  {getRankIcon(index + 1)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{park.name}</h4>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <MapPin className="h-3 w-3" />
                    <span>{park.province}</span>
                  </div>
                </div>
              </div>

              {/* Score and Stats */}
              <div className="text-right">
                <Badge
                  variant={getScoreBadgeVariant(park.score)}
                  className={cn("font-bold", getScoreColor(park.score))}
                >
                  {park.score}/100
                </Badge>
                <div className="flex gap-3 text-xs text-gray-500 mt-1">
                  <span>{park.totalFlora} flora</span>
                  <span>{park.totalFauna} fauna</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div className="mt-4 pt-4 border-t">
          <Button variant="outline" size="sm" className="w-full">
            <Eye className="h-4 w-4 mr-2" />
            Lihat Semua Peringkat
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <h4 className="text-xs font-semibold text-blue-800 mb-2">Quick Stats</h4>
          <div className="space-y-1 text-xs text-blue-700">
            <div className="flex justify-between">
              <span>Rata-rata skor:</span>
              <span className="font-medium">
                {(topParks.reduce((sum, p) => sum + p.score, 0) / topParks.length).toFixed(1)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Total flora:</span>
              <span className="font-medium">
                {formatNumber(topParks.reduce((sum, p) => sum + p.totalFlora, 0))}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Total fauna:</span>
              <span className="font-medium">
                {formatNumber(topParks.reduce((sum, p) => sum + p.totalFauna, 0))}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}