import { Search, MapPin, TreePine, Calendar, User, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock data for taman
const tamanList = [
  {
    id: 1,
    name: "Taman Nasional Ujung Kulon",
    province: "Banten",
    area: "122.956 ha",
    status: "UNESCO World Heritage",
    description: "Rumah bagi badak bercula satu Jawa, salah satu taman nasional tertua di Indonesia",
    imageUrl: "/placeholder-taman.jpg",
    type: "Taman Nasional"
  },
  {
    id: 2,
    name: "Taman Nasional Kerinci Seblat",
    province: "Sumatra",
    area: "13.750 ha",
    status: "UNESCO World Heritage",
    description: "Taman nasional terbesar di Sumatra dengan keanekaragaman hayati tinggi",
    imageUrl: "/placeholder-taman.jpg",
    type: "Taman Nasional"
  },
  {
    id: 3,
    name: "Taman Nasional Lorentz",
    province: "Papua",
    area: "2.350.000 ha",
    status: "UNESCO World Heritage",
    description: "Salah satu taman nasional terbesar di Asia Tenggara dengan berbagai ekosistem",
    imageUrl: "/placeholder-taman.jpg",
    type: "Taman Nasional"
  }
];

export default function TamanPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-50 dark:from-gray-900 dark:to-emerald-900/10 py-8">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-500 to-teal-400 bg-clip-text text-transparent mb-3">
            Direktori Taman Konservasi
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Eksplorasi taman konservasi di seluruh Indonesia, dari taman nasional hingga cagar alam
          </p>
        </div>

        {/* Search Section */}
        <div className="mb-8">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Cari taman berdasarkan nama atau lokasi..." 
              className="pl-10 h-12"
            />
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <Button variant="secondary" size="sm">Taman Nasional</Button>
            <Button variant="outline" size="sm">Cagar Alam</Button>
            <Button variant="outline" size="sm">Suaka Margasatwa</Button>
            <Button variant="outline" size="sm">Taman Wisata Alam</Button>
            <Button variant="outline" size="sm">Hutan Lindung</Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">150+</div>
              <div className="text-xs text-muted-foreground">Taman Konservasi</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">2.35M+</div>
              <div className="text-xs text-muted-foreground">Hektar Perlindungan</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">50</div>
              <div className="text-xs text-muted-foreground">UNESCO World Heritage</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">18</div>
              <div className="text-xs text-muted-foreground">Wilayah Biogeografi</div>
            </CardContent>
          </Card>
        </div>

        {/* Taman Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tamanList.map((taman) => (
            <Card key={taman.id} className="overflow-hidden">
              <div className="relative h-48 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-green-200 dark:bg-green-800/50 border-2 border-dashed rounded-xl w-16 h-16" />
                </div>
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{taman.name}</CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {taman.type}
                  </Badge>
                </div>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  {taman.province}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <TreePine className="h-4 w-4 mr-2 text-green-500" />
                    <span className="font-medium">Luas Wilayah: </span>
                    <span>{taman.area}</span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <Star className="h-4 w-4 mr-2 text-yellow-500" />
                    <span className="font-medium">Status: </span>
                    <span>{taman.status}</span>
                  </div>
                  
                  <p className="text-sm">{taman.description}</p>
                  
                  <div className="flex justify-between text-xs text-muted-foreground pt-2">
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      Ditambahkan
                    </span>
                    <span className="flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      Admin
                    </span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <Button className="w-full" variant="outline">
                    Lihat Detail
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
              <Button variant="outline" size="sm">15</Button>
            </div>
            <Button variant="outline" size="sm">Berikutnya</Button>
          </div>
        </div>
      </div>
    </div>
  );
}