# Biodiversity Index (Indeks Keanekaragaman Hayati)

## Deskripsi

Biodiversity Index adalah metrik untuk mengukur dan memvisualisasikan tingkat keanekaragaman hayati di setiap Taman Kehati. Untuk MVP, akan diimplementasikan sebagai placeholder dengan input manual, yang akan dikembangkan menjadi perhitungan otomatis di Phase 2.

## Struktur Data

### TypeScript Interfaces

```typescript
interface BiodiversityIndex {
  id: string;
  parkId: string;
  regionId: string;
  assessmentDate: Date;

  // Flora Metrics
  totalFloraSpecies: number;
  endemicFloraSpecies: number;
  threatenedFloraSpecies: number;
  floraDiversityScore: number; // 0-100

  // Fauna Metrics
  totalFaunaSpecies: number;
  endemicFaunaSpecies: number;
  threatenedFaunaSpecies: number;
  faunaDiversityScore: number; // 0-100

  // Ecosystem Metrics
  ecosystemTypes: string[];
  habitatQuality: number; // 0-100
  areaCoverage: number; // hectares

  // Overall Index
  overallBiodiversityScore: number; // 0-100
  ranking: number; // national ranking

  // Metadata
  lastUpdated: Date;
  updatedBy: string;
  status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED';
  notes?: string;
}

interface BiodiversityTrend {
  id: string;
  parkId: string;
  year: number;
  biodiversityScore: number;
  floraScore: number;
  faunaScore: number;
  ecosystemScore: number;
  changeFromPreviousYear: number;
}

interface BiodiversityComparison {
  nationalAverage: number;
  provincialAverage: number;
  parkRanking: number;
  totalParks: number;
  topPerformers: Array<{
    parkId: string;
    parkName: string;
    score: number;
  }>;
}
```

## Komponen UI

### 1. Biodiversity Index Page (`/indeks`)

```typescript
// app/indeks/page.tsx
export default function BiodiversityIndexPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12">
        <h1 className="text-4xl font-bold text-green-800 mb-4">
          Indeks Keanekaragaman Hayati Nasional
        </h1>
        <p className="text-lg text-gray-600 max-w-4xl">
          Monitor dan evaluasi tingkat keanekaragaman hayati di seluruh Taman Kehati
          Indonesia melalui indeks komprehensif yang mencakup metrik flora, fauna, dan ekosistem.
        </p>
      </section>

      <BiodiversityOverview />
      <NationalMap />
      <TopPerformers />
      <MethodologySection />
    </div>
  );
}
```

### 2. Biodiversity Overview Cards

```typescript
// components/biodiversity/BiodiversityOverview.tsx
interface BiodiversityOverviewProps {
  nationalData: BiodiversityIndex[];
}

export function BiodiversityOverview({ nationalData }: BiodiversityOverviewProps) {
  const stats = calculateNationalStats(nationalData);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Skor Rata-rata Nasional"
        value={stats.averageScore}
        unit="/ 100"
        icon={TrendingUp}
        color="green"
        description="Rata-rata indeks keanekaragaman hayati seluruh taman"
      />

      <StatCard
        title="Total Spesies Flora"
        value={stats.totalFloraSpecies.toLocaleString('id-ID')}
        icon={Leaf}
        color="green"
        description="Jumlah total spesies tumbuhan yang tercatat"
      />

      <StatCard
        title="Total Spesies Fauna"
        value={stats.totalFaunaSpecies.toLocaleString('id-ID')}
        icon={Zap}
        color="blue"
        description="Jumlah total spesies hewan yang tercatat"
      />

      <StatCard
        title="Taman Terdaftar"
        value={stats.totalParks}
        icon={MapPin}
        color="purple"
        description="Jumlah Taman Kehati dalam database"
      />
    </div>
  );
}
```

### 3. National Biodiversity Map

```typescript
// components/biodiversity/NationalMap.tsx
export function NationalMap() {
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [parkData, setParkData] = useState<BiodiversityIndex[]>([]);

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Peta Sebaran Indeks Keanekaragaman Hayati
        </CardTitle>
        <CardDescription>
          Klik pada provinsi untuk melihat detail Taman Kehati dan indeks keanekaragaman hayati
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <IndonesiaMap
              data={parkData}
              selectedProvince={selectedProvince}
              onProvinceSelect={setSelectedProvince}
              colorScale={(score: number) => {
                if (score >= 80) return '#22c55e';
                if (score >= 60) return '#eab308';
                if (score >= 40) return '#f97316';
                return '#ef4444';
              }}
            />
          </div>

          <div>
            <ProvinceDetails
              province={selectedProvince}
              parks={parkData.filter(p => selectedProvince && p.province === selectedProvince)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

### 4. Top Performers Table

```typescript
// components/biodiversity/TopPerformers.tsx
export function TopPerformers() {
  const [topParks, setTopParks] = useState<BiodiversityIndex[]>([]);

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Taman Kehati Terbaik</CardTitle>
        <CardDescription>
          Peringkat Taman Kehati dengan indeks keanekaragaman hayati tertinggi
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Peringkat</th>
                <th className="text-left py-3 px-4">Nama Taman</th>
                <th className="text-left py-3 px-4">Provinsi</th>
                <th className="text-center py-3 px-4">Skor Total</th>
                <th className="text-center py-3 px-4">Flora</th>
                <th className="text-center py-3 px-4">Fauna</th>
                <th className="text-center py-3 px-4">Ekosistem</th>
                <th className="text-center py-3 px-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {topParks.map((park, index) => (
                <tr key={park.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {index < 3 && (
                        <Trophy className={`h-4 w-4 ${
                          index === 0 ? 'text-yellow-500' :
                          index === 1 ? 'text-gray-400' : 'text-amber-600'
                        }`} />
                      )}
                      {index + 1}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium">{park.parkName}</td>
                  <td className="py-3 px-4">{park.province}</td>
                  <td className="py-3 px-4 text-center">
                    <Badge variant="outline" className="font-bold">
                      {park.overallBiodiversityScore}/100
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-center">{park.floraDiversityScore}</td>
                  <td className="py-3 px-4 text-center">{park.faunaDiversityScore}</td>
                  <td className="py-3 px-4 text-center">{park.ecosystemScore}</td>
                  <td className="py-3 px-4 text-center">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
```

## Admin Panel untuk Biodiversity Index

### 1. Biodiversity Management Dashboard

```typescript
// app/admin/biodiversity/page.tsx
export default function BiodiversityManagement() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manajemen Indeks Keanekaragaman Hayati</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Input Data Baru
        </Button>
      </div>

      <BiodiversityStats />
      <BiodiversityTable />
    </div>
  );
}
```

### 2. Input Form (MVP - Manual Input)

```typescript
// components/admin/BiodiversityForm.tsx
export function BiodiversityForm({ parkId }: { parkId: string }) {
  const [formData, setFormData] = useState<Partial<BiodiversityIndex>>({
    parkId,
    assessmentDate: new Date(),
    status: 'DRAFT'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Calculate overall score (MVP simple formula)
    const overallScore = (
      (formData.floraDiversityScore || 0) * 0.4 +
      (formData.faunaDiversityScore || 0) * 0.4 +
      (formData.ecosystemScore || 0) * 0.2
    );

    const submission = {
      ...formData,
      overallBiodiversityScore: overallScore,
      updatedBy: getCurrentUser().id
    };

    await submitBiodiversityData(submission);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informasi Dasar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Tanggal Penilaian</Label>
            <Input
              type="date"
              value={formData.assessmentDate?.toISOString().split('T')[0]}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                assessmentDate: new Date(e.target.value)
              }))}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Metrik Flora</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Total Spesies Flora</Label>
              <Input
                type="number"
                placeholder="0"
                value={formData.totalFloraSpecies || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  totalFloraSpecies: parseInt(e.target.value) || 0
                }))}
              />
            </div>
            <div>
              <Label>Spesies Endemik</Label>
              <Input
                type="number"
                placeholder="0"
                value={formData.endemicFloraSpecies || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  endemicFloraSpecies: parseInt(e.target.value) || 0
                }))}
              />
            </div>
            <div>
              <Label>Spesies Terancam</Label>
              <Input
                type="number"
                placeholder="0"
                value={formData.threatenedFloraSpecies || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  threatenedFloraSpecies: parseInt(e.target.value) || 0
                }))}
              />
            </div>
          </div>
          <div>
            <Label>Skor Keanekaragaman Flora (0-100)</Label>
            <Slider
              value={[formData.floraDiversityScore || 0]}
              onValueChange={(value) => setFormData(prev => ({
                ...prev,
                floraDiversityScore: value[0]
              }))}
              max={100}
              step={1}
              className="mt-2"
            />
            <span className="text-sm text-gray-500">
              {formData.floraDiversityScore || 0}/100
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Metrik Fauna</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Total Spesies Fauna</Label>
              <Input
                type="number"
                placeholder="0"
                value={formData.totalFaunaSpecies || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  totalFaunaSpecies: parseInt(e.target.value) || 0
                }))}
              />
            </div>
            <div>
              <Label>Spesies Endemik</Label>
              <Input
                type="number"
                placeholder="0"
                value={formData.endemicFaunaSpecies || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  endemicFaunaSpecies: parseInt(e.target.value) || 0
                }))}
              />
            </div>
            <div>
              <Label>Spesies Terancam</Label>
              <Input
                type="number"
                placeholder="0"
                value={formData.threatenedFaunaSpecies || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  threatenedFaunaSpecies: parseInt(e.target.value) || 0
                }))}
              />
            </div>
          </div>
          <div>
            <Label>Skor Keanekaragaman Fauna (0-100)</Label>
            <Slider
              value={[formData.faunaDiversityScore || 0]}
              onValueChange={(value) => setFormData(prev => ({
                ...prev,
                faunaDiversityScore: value[0]
              }))}
              max={100}
              step={1}
              className="mt-2"
            />
            <span className="text-sm text-gray-500">
              {formData.faunaDiversityScore || 0}/100
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Metrik Ekosistem</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Tipe Ekosistem</Label>
            <Input
              placeholder="contoh: Hutan Hujan Tropis, Mangrove"
              value={formData.ecosystemTypes?.join(', ') || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                ecosystemTypes: e.target.value.split(',').map(t => t.trim())
              }))}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Kualitas Habitat (0-100)</Label>
              <Slider
                value={[formData.habitatQuality || 0]}
                onValueChange={(value) => setFormData(prev => ({
                  ...prev,
                  habitatQuality: value[0]
                }))}
                max={100}
                step={1}
                className="mt-2"
              />
              <span className="text-sm text-gray-500">
                {formData.habitatQuality || 0}/100
              </span>
            </div>
            <div>
              <Label>Luas Area (Hektar)</Label>
              <Input
                type="number"
                placeholder="0"
                value={formData.areaCoverage || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  areaCoverage: parseFloat(e.target.value) || 0
                }))}
              />
            </div>
          </div>
          <div>
            <Label>Skor Ekosistem (0-100)</Label>
            <Slider
              value={[formData.ecosystemScore || 0]}
              onValueChange={(value) => setFormData(prev => ({
                ...prev,
                ecosystemScore: value[0]
              }))}
              max={100}
              step={1}
              className="mt-2"
            />
            <span className="text-sm text-gray-500">
              {formData.ecosystemScore || 0}/100
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="submit">
          {formData.status === 'DRAFT' ? 'Simpan Draft' : 'Perbarui Data'}
        </Button>
        {formData.status === 'DRAFT' && (
          <Button
            type="button"
            variant="outline"
            onClick={() => submitForReview(formData)}
          >
            <Send className="h-4 w-4 mr-2" />
            Ajukan Review
          </Button>
        )}
      </div>
    </form>
  );
}
```

## API Endpoints

```typescript
// app/api/biodiversity/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const province = searchParams.get('province');
  const year = searchParams.get('year');

  let query = db.select().from(biodiversityIndex);

  if (province) {
    query = query.where(eq(biodiversityIndex.province, province));
  }

  if (year) {
    query = query.where(
      eq(extractYear(biodiversityIndex.assessmentDate), parseInt(year))
    );
  }

  const data = await query;

  return Response.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const user = await getCurrentUser();

  const newBiodiversityData = await db.insert(biodiversityIndex).values({
    ...body,
    id: generateId(),
    createdBy: user.id,
    createdAt: new Date(),
    updatedAt: new Date()
  }).returning();

  // Create audit log
  await createAuditLog({
    userId: user.id,
    action: 'CREATE',
    entity: 'BIODIVERSITY_INDEX',
    entityId: newBiodiversityData[0].id,
    oldValues: null,
    newValues: newBiodiversityData[0]
  });

  return Response.json(newBiodiversityData[0]);
}
```

## Status Flow

```typescript
// Workflow untuk Biodiversity Index
const BIODIVERSITY_WORKFLOW = {
  DRAFT: {
    canEdit: ['SUPER_ADMIN', 'REGIONAL_ADMIN'],
    canSubmit: ['SUPER_ADMIN', 'REGIONAL_ADMIN'],
    nextStatus: 'PENDING'
  },
  PENDING: {
    canReview: ['SUPER_ADMIN'],
    canApprove: ['SUPER_ADMIN'],
    canReject: ['SUPER_ADMIN'],
    canEdit: [],
    nextStatus: ['APPROVED', 'REJECTED']
  },
  APPROVED: {
    canView: ['SUPER_ADMIN', 'REGIONAL_ADMIN', 'PUBLIC'],
    canEdit: ['SUPER_ADMIN'], // untuk update berkala
    canArchive: ['SUPER_ADMIN'],
    nextStatus: 'ARCHIVED'
  },
  REJECTED: {
    canEdit: ['REGIONAL_ADMIN'],
    canResubmit: ['REGIONAL_ADMIN'],
    canView: ['SUPER_ADMIN', 'REGIONAL_ADMIN'],
    nextStatus: 'DRAFT'
  }
};
```

## Phase 2 Enhancement Plan

### Automated Calculation (Future)
```typescript
// Future enhancement untuk perhitungan otomatis
export function calculateBiodiversityIndex(parkData: ParkData): BiodiversityScore {
  // Shannon-Wiener Index untuk flora
  const floraShannonIndex = calculateShannonIndex(parkData.flora);

  // Simpson Index untuk fauna
  const faunaSimpsonIndex = calculateSimpsonIndex(parkData.fauna);

  // Ecosystem completeness score
  const ecosystemScore = calculateEcosystemCompleteness(parkData.habitats);

  // Weighted combination
  const overallScore = (
    floraShannonIndex * 0.4 +
    faunaSimpsonIndex * 0.4 +
    ecosystemScore * 0.2
  ) * 100; // normalize to 0-100

  return {
    flora: Math.round(floraShannonIndex * 100),
    fauna: Math.round(faunaSimpsonIndex * 100),
    ecosystem: Math.round(ecosystemScore * 100),
    overall: Math.round(overallScore)
  };
}
```

## Integrasi dengan Public Website

- **Public Access**: Indeks yang sudah di-approve dapat diakses publik
- **Comparison Tools**: Bandingkan indeks antar taman/provinsi
- **Trend Visualization**: Grafik perubahan indeks dari waktu ke waktu
- **Download Reports**: Export data dalam format PDF/Excel
- **Methodology Documentation**: Dokumentasi metodologi perhitungan transparan

## Security & Validation

- **Input Validation**: Validasi range nilai (0-100) dan format data
- **Role-based Access**: Hanya user yang memiliki izin yang dapat input/edit
- **Audit Trail**: Semua perubahan tercatat dalam audit log
- **Data Integrity**: Validasi konsistensi data antar metrik
- **Approval Process**: Data harus melalui proses review sebelum dipublikasi