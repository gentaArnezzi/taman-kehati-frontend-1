import { Search, MapPin, Calendar, User, Newspaper, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock data for berita
const beritaList = [
  {
    id: 1,
    title: "Peningkatan Populasi Harimau Sumatra Tercatat Meningkat",
    summary: "Data terbaru menunjukkan peningkatan populasi harimau Sumatra di Taman Nasional Kerinci Seblat.",
    date: "15 Oktober 2025",
    category: "Konservasi",
    imageUrl: "/placeholder-berita.jpg",
    author: "Tim Redaksi Konservasi"
  },
  {
    id: 2,
    title: "Penemuan Spesies Baru Kadal di Papua",
    summary: "Para peneliti berhasil mengidentifikasi spesies kadal baru di kawasan Taman Nasional Lorentz.",
    date: "12 Oktober 2025",
    category: "Riset",
    imageUrl: "/placeholder-berita.jpg",
    author: "Dr. Sari Dewi"
  },
  {
    id: 3,
    title: "Kampanye Edukasi Keanekaragaman Hayati di Sekolah",
    summary: "Program edukasi keanekaragaman hayati berhasil diimplementasikan di 50 sekolah di Jawa Barat.",
    date: "10 Oktober 2025",
    category: "Edukasi",
    imageUrl: "/placeholder-berita.jpg",
    author: "Tim Edukasi Lingkungan"
  }
];

export default function BeritaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-50 dark:from-gray-900 dark:to-emerald-900/10 py-8">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-500 to-teal-400 bg-clip-text text-transparent mb-3">
            Berita & Artikel Konservasi
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Update terkini tentang konservasi, penelitian, dan edukasi keanekaragaman hayati Indonesia
          </p>
        </div>

        {/* Search Section */}
        <div className="mb-8">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Cari berita berdasarkan judul atau topik..." 
              className="pl-10 h-12"
            />
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <Button variant="secondary" size="sm">Konservasi</Button>
            <Button variant="outline" size="sm">Riset</Button>
            <Button variant="outline" size="sm">Edukasi</Button>
            <Button variant="outline" size="sm">Kebijakan</Button>
            <Button variant="outline" size="sm">Komunitas</Button>
          </div>
        </div>

        {/* Berita Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {beritaList.map((berita) => (
            <Card key={berita.id} className="overflow-hidden">
              <div className="relative h-48 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-blue-200 dark:bg-blue-800/50 border-2 border-dashed rounded-xl w-16 h-16" />
                </div>
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{berita.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm">{berita.summary}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {berita.category}
                    </Badge>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      {berita.date}
                    </div>
                  </div>
                  
                  <div className="flex items-center text-xs text-muted-foreground pt-2">
                    <Users className="h-3 w-3 mr-1" />
                    {berita.author}
                  </div>
                </div>
                
                <div className="mt-4">
                  <Button className="w-full" variant="outline">
                    Baca Selengkapnya
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-10">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">Sebelumnya</Button>
            <div className="flex items-center space-x-1">
              <Button variant="secondary" size="sm">1</Button>
              <Button variant="outline" size="sm">2</Button>
              <Button variant="outline" size="sm">3</Button>
              <span className="px-2">...</span>
              <Button variant="outline" size="sm">8</Button>
            </div>
            <Button variant="outline" size="sm">Berikutnya</Button>
          </div>
        </div>
      </div>
    </div>
  );
}