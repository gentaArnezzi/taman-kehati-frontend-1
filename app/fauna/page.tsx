import { Search, Filter, MapPin, Footprints, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock data for fauna
const faunaList = [
  {
    id: 1,
    scientificName: "Panthera tigris sumatrae",
    localName: "Harimau Sumatra",
    family: "Felidae",
    conservationStatus: "Critically Endangered",
    region: "Sumatra",
    description: "Subspesies harimau yang hanya ditemukan di Pulau Sumatra",
    imageUrl: "/placeholder-fauna.jpg"
  },
  {
    id: 2,
    scientificName: "Pongo abelii",
    localName: "Orangutan Sumatra",
    family: "Hominidae",
    conservationStatus: "Critically Endangered",
    region: "Sumatra",
    description: "Primata besar yang hanya ditemukan di Sumatra",
    imageUrl: "/placeholder-fauna.jpg"
  },
  {
    id: 3,
    scientificName: "Varanus komodoensis",
    localName: "Komodo",
    family: "Varanidae",
    conservationStatus: "Endangered",
    region: "Nusa Tenggara",
    description: "Kadal terbesar di dunia yang ditemukan di pulau Nusa Tenggara",
    imageUrl: "/placeholder-fauna.jpg"
  }
];

const conservationStatusColors = {
  "Extinct": "bg-gray-500",
  "Extinct in Wild": "bg-red-700",
  "Critically Endangered": "bg-red-600",
  "Endangered": "bg-red-500",
  "Vulnerable": "bg-orange-500",
  "Near Threatened": "bg-yellow-500",
  "Least Concern": "bg-green-500",
  "Data Deficient": "bg-purple-500",
  "Not Evaluated": "bg-gray-400"
};

export default function FaunaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-50 dark:from-gray-900 dark:to-emerald-900/10 py-8">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-500 to-teal-400 bg-clip-text text-transparent mb-3">
            Database Fauna Indonesia
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Eksplorasi keanekaragaman hayati fauna Indonesia, dari satwa endemik hingga yang terancam punah
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Cari berdasarkan nama ilmiah atau lokal..." 
                className="pl-10 h-12"
              />
            </div>
            <Button variant="outline" className="h-12 flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <Button variant="secondary" size="sm">Jawa</Button>
            <Button variant="outline" size="sm">Sumatra</Button>
            <Button variant="outline" size="sm">Kalimantan</Button>
            <Button variant="outline" size="sm">Sulawesi</Button>
            <Button variant="outline" size="sm">Papua</Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">2,000+</div>
              <div className="text-xs text-muted-foreground">Spesies Tercatat</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">400+</div>
              <div className="text-xs text-muted-foreground">Endemik Indonesia</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">250+</div>
              <div className="text-xs text-muted-foreground">Terancam Punah</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">18</div>
              <div className="text-xs text-muted-foreground">Tipe Biogeografi</div>
            </CardContent>
          </Card>
        </div>

        {/* Fauna Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {faunaList.map((fauna) => (
            <Card key={fauna.id} className="overflow-hidden">
              <div className="relative h-48 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-amber-200 dark:bg-amber-800/50 border-2 border-dashed rounded-xl w-16 h-16" />
                </div>
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{fauna.scientificName}</CardTitle>
                  <Badge className={`${conservationStatusColors[fauna.conservationStatus as keyof typeof conservationStatusColors] || "bg-gray-500"} text-xs`}>
                    {fauna.conservationStatus}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">Nama lokal: {fauna.localName}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Footprints className="h-4 w-4 mr-2" />
                    {fauna.family}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2" />
                    {fauna.region}
                  </div>
                  <p className="text-sm">{fauna.description}</p>
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
              <Button variant="outline" size="sm">10</Button>
            </div>
            <Button variant="outline" size="sm">Berikutnya</Button>
          </div>
        </div>
      </div>
    </div>
  );
}