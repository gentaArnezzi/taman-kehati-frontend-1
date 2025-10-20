import 'dotenv/config';
import { db } from '../db';
import { user, account, session, verification } from '../db/schema/auth';
import { userRoles } from '../db/schema/user-roles';
import { parks } from '../db/schema/taman';
import { flora } from '../db/schema/flora';
import { fauna } from '../db/schema/fauna';
import { articles } from '../db/schema/articles';
import { announcements } from '../db/schema/announcements';
import { biodiversityIndex } from '../db/schema/biodiversity';
import { auditLogs } from '../db/schema/audit';
import { randomUUID } from 'crypto';

async function seed() {
  console.log('🌱 Starting seed...');

  try {
    // Clear existing data (optional - remove if you don't want to clear)
    // Delete in correct order respecting foreign key constraints
    await db.delete(articles);
    await db.delete(announcements);
    await db.delete(biodiversityIndex);
    await db.delete(fauna);
    await db.delete(flora);
    await db.delete(parks);
    await db.delete(userRoles);
    await db.delete(session);
    await db.delete(account);
    await db.delete(verification);
    await db.delete(user);

    // Create admin user with dynamic ID
    const adminUserId = randomUUID();
    const adminUser = await db.insert(user).values({
      id: adminUserId,
      name: 'Admin User',
      email: 'admin@kehati.org',
      emailVerified: true,
      image: null,
      regionCode: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    console.log('✅ Admin user created');

    // Create admin role - userId in userRoles table references the user.id (text)
    await db.insert(userRoles).values({
      userId: adminUserId, // Using the dynamically generated user id
      role: 'admin',
      assignedBy: adminUserId, // Using the same user as assignedBy for admin
      assignedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
    });

    console.log('✅ Admin role created');

    // Create sample parks
    const sampleParks = [
      {
        slug: 'taman-nasional-lorentz',
        officialName: 'Taman Nasional Lorentz',
        skNumber: 'SK.426/Menhut-II/1999',
        managingAgency: 'Kementerian Lingkungan Hidup dan Kehutanan',
        province: 'Papua',
        regency: 'Asmat',
        district: 'Kawor',
        village: 'Sawa',
        areaHa: 1040000,
        physicalCondition: 'Baik',
        ecologicalValue: 'Sangat Tinggi',
        ecoregionType: 'Hutan Hujan Tropis Pegunungan',
        history: 'Didirikan sebagai Taman Nasional pada tahun 1999 dan ditetapkan sebagai Situs Warisan Dunia UNESCO pada tahun 1999.',
        visionMission: 'Menjaga keutuhan dan kelestarian kawasan konservasi yang memiliki nilai penting bagi keanekaragaman hayati.',
        coreValues: 'Keberlanjutan, Keadilan, Profesionalisme',
        centroidLat: -4.8333,
        centroidLng: 138.3333,
        featuredImage: 'https://images.unsplash.com/photo-1469474968028-58823808e424?w=800&h=600&fit=crop',
        gallery: [],
        biodiversityScore: 85,
        totalFlora: 2345,
        totalFauna: 654,
        totalActivities: 12,
        status: 'PUBLISHED',
        workflowStatus: 'APPROVED',
        isActive: true,
        isFeatured: true,
        tags: ['warisan dunia', 'papua', 'pegunungan'],
        createdBy: adminUserId,
        createdAt: new Date(),
        updatedBy: adminUserId,
        submittedAt: new Date(),
        submittedBy: adminUserId,
        reviewedAt: new Date(),
        reviewedBy: adminUserId,
        approvedAt: new Date(),
        approvedBy: adminUserId,
      },
      {
        slug: 'taman-nasional-way-kambas',
        officialName: 'Taman Nasional Way Kambas',
        skNumber: 'SK.227/Menhut-II/1999',
        managingAgency: 'Kementerian Lingkungan Hidup dan Kehutanan',
        province: 'Lampung',
        regency: 'Lampung Timur',
        district: 'Way Kambas',
        village: 'Rajabasa',
        areaHa: 797515,
        physicalCondition: 'Baik',
        ecologicalValue: 'Tinggi',
        ecoregionType: 'Hutan Hujan Dataran Rendah',
        history: 'Didirikan sebagai Suaka Margasatwa Way Kambas pada tahun 1972 dan ditetapkan sebagai Taman Nasional pada tahun 1999.',
        visionMission: 'Menjaga dan melindungi populasi gajah sumatera dan ekosistem hutan dataran rendah.',
        coreValues: 'Konservasi, Edukasi, Kemitraan',
        centroidLat: -5.4,
        centroidLng: 105.6,
        featuredImage: 'https://images.unsplash.com/photo-1562453056-6e5d1b7b8e4c?w=800&h=600&fit=crop',
        gallery: [],
        biodiversityScore: 72,
        totalFlora: 1876,
        totalFauna: 324,
        totalActivities: 8,
        status: 'PUBLISHED',
        workflowStatus: 'APPROVED',
        isActive: true,
        isFeatured: false,
        tags: ['gajah sumatera', 'lampung', 'suaka margasatwa'],
        createdBy: adminUserId,
        createdAt: new Date(),
        updatedBy: adminUserId,
        submittedAt: new Date(),
        submittedBy: adminUserId,
        reviewedAt: new Date(),
        reviewedBy: adminUserId,
        approvedAt: new Date(),
        approvedBy: adminUserId,
      },
      {
        slug: 'taman-nasional-kerinci-seblat',
        officialName: 'Taman Nasional Kerinci Seblat',
        skNumber: 'SK.9367/Menhut-II/1996',
        managingAgency: 'Kementerian Lingkungan Hidup dan Kehutanan',
        province: 'Sumatera Barat',
        regency: 'Kerinci',
        district: 'Gunung Kerinci',
        village: 'Kersik Tuo',
        areaHa: 1375400,
        physicalCondition: 'Baik',
        ecologicalValue: 'Sangat Tinggi',
        ecoregionType: 'Hutan Hujan Pegunungan',
        history: 'Taman Nasional Kerinci Seblat merupakan kawasan konservasi terbesar di Sumatera yang meliputi 4 provinsi.',
        visionMission: 'Menjaga keberlanjutan fungsi hidrologis, kawasan lindung, dan keanekaragaman hayati.',
        coreValues: 'Integritas, Profesionalisme, Kepedulian',
        centroidLat: -3.1,
        centroidLng: 101.7,
        featuredImage: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
        gallery: [],
        biodiversityScore: 81,
        totalFlora: 2987,
        totalFauna: 543,
        totalActivities: 15,
        status: 'PUBLISHED',
        workflowStatus: 'APPROVED',
        isActive: true,
        isFeatured: true,
        tags: ['harimau sumatera', 'pegunungan', 'sumatera barat'],
        createdBy: adminUserId,
        createdAt: new Date(),
        updatedBy: adminUserId,
        submittedAt: new Date(),
        submittedBy: adminUserId,
        reviewedAt: new Date(),
        reviewedBy: adminUserId,
        approvedAt: new Date(),
        approvedBy: adminUserId,
      },
    ];

    await db.insert(parks).values(sampleParks);
    console.log('✅ Sample parks created');

    // Create sample flora
    const sampleFlora = [
      {
        scientificName: 'Rafflesia arnoldii',
        localName: 'Bunga Bangkai',
        family: 'Rafflesiaceae',
        description: 'Bunga terbesar di dunia yang ditemukan di hutan Sumatera dan Kalimantan.',
        conservationStatus: 'Endangered',
        region: 'Sumatera',
        habitat: 'Rainforest',
        imageUrl: 'https://example.com/rafflesia.jpg',
        status: 'published',
        submittedBy: adminUserId, // Using the admin user id
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        scientificName: 'Nepenthes rajah',
        localName: 'Kantong Semar Raksasa',
        family: 'Nepenthaceae',
        description: 'Kantong semar terbesar di dunia yang hanya ditemukan di Gunung Kinabalu, Malaysia dan Kalimantan.',
        conservationStatus: 'Vulnerable',
        region: 'Kalimantan',
        habitat: 'Montane forest',
        imageUrl: 'https://example.com/nepenthes.jpg',
        status: 'published',
        submittedBy: adminUserId, // Using the admin user id
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        scientificName: 'Encephalartos woodii',
        localName: 'Paku Kucing Jantan',
        family: 'Zamiaceae',
        description: 'Pakis langka yang dianggap sebagai fosil hidup dan hanya ditemukan di Afrika Selatan.',
        conservationStatus: 'Critically Endangered',
        region: 'Kalimantan',
        habitat: 'Lowland forest',
        imageUrl: 'https://example.com/encephalartos.jpg',
        status: 'published',
        submittedBy: adminUserId, // Using the admin user id
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await db.insert(flora).values(sampleFlora);
    console.log('✅ Sample flora created');

    // Create sample fauna
    const sampleFauna = [
      {
        scientificName: 'Panthera tigris sumatrae',
        localName: 'Harimau Sumatera',
        family: 'Felidae',
        description: 'Subspesies harimau yang hanya ditemukan di Pulau Sumatera, Indonesia.',
        conservationStatus: 'Critically Endangered',
        region: 'Sumatera',
        habitat: 'Tropical rainforest',
        imageUrl: 'https://example.com/sumatran-tiger.jpg',
        status: 'published',
        submittedBy: adminUserId, // Using the admin user id
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        scientificName: 'Elephas maximus sumatranus',
        localName: 'Gajah Sumatera',
        family: 'Elephantidae',
        description: 'Subspesies gajah Asia yang ditemukan di Pulau Sumatera.',
        conservationStatus: 'Critically Endangered',
        region: 'Sumatera',
        habitat: 'Tropical forest',
        imageUrl: 'https://example.com/sumatran-elephant.jpg',
        status: 'published',
        submittedBy: adminUserId, // Using the admin user id
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        scientificName: 'Rhinoceros sondaicus',
        localName: 'Badak Jawa',
        family: 'Rhinocerotidae',
        description: 'Satu dari lima spesies badak di dunia dan hanya ditemukan di Taman Nasional Ujung Kulon.',
        conservationStatus: 'Critically Endangered',
        region: 'Jawa',
        habitat: 'Lowland rainforest',
        imageUrl: 'https://example.com/javan-rhino.jpg',
        status: 'published',
        submittedBy: adminUserId, // Using the admin user id
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await db.insert(fauna).values(sampleFauna);
    console.log('✅ Sample fauna created');

    // Create sample news articles
    const sampleNews = [
      {
        title: 'Upaya Konservasi Harimau Sumatera Meningkat',
        summary: 'Populasi harimau sumatera menunjukkan peningkatan berkat program konservasi intensif.',
        content: 'Program konservasi yang dilakukan di Taman Nasional Bukit Barisan Selatan berhasil meningkatkan populasi harimau sumatera sebesar 15% dalam 3 tahun terakhir...',
        category: 'Conservation',
        author: 'Admin User',
        imageUrl: 'https://example.com/tiger-conservation.jpg',
        status: 'published',
        submittedBy: adminUserId, // Using the admin user id
        publishedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Ditemukan Spesies Baru Paku di Hutan Kalimantan',
        summary: 'Para ilmuwan menemukan spesies pakis baru yang belum pernah tercatat sebelumnya.',
        content: 'Tim peneliti dari Universitas Lambung Mangkurat bekerja sama dengan Kementerian Lingkungan Hidup berhasil mengidentifikasi spesies pakis baru di hutan Kalimantan...',
        category: 'Discovery',
        author: 'Admin User',
        imageUrl: 'https://example.com/new-fern-species.jpg',
        status: 'published',
        submittedBy: adminUserId, // Using the admin user id
        publishedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Taman Nasional Gunung Leuser Ditetapkan sebagai Kawasan Konservasi Prioritas',
        summary: 'Pemerintah menetapkan Taman Nasional Gunung Leuser sebagai kawasan konservasi prioritas nasional.',
        content: 'Dengan luas lebih dari 950.000 hektar, Taman Nasional Gunung Leuser menjadi fokus utama pemerintah dalam upaya konservasi ekosistem hutan hujan tropis...',
        category: 'Policy',
        author: 'Admin User',
        imageUrl: 'https://example.com/gunung-leuser.jpg',
        status: 'published',
        submittedBy: adminUserId, // Using the admin user id
        publishedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // Note: berita table seems to be old schema, skipping for now
    // await db.insert(berita).values(sampleNews);
    console.log('✅ Sample news articles skipped (old schema)');

    // Create sample articles using the new articles schema
    const sampleArticles = [
      {
        title: 'Upaya Konservasi Harimau Sumatera Meningkat',
        slug: 'upaya-konservasi-harimau-sumatera-meningkat',
        content: 'Program konservasi yang dilakukan di Taman Nasional Bukit Barisan Selatan berhasil meningkatkan populasi harimau sumatera sebesar 15% dalam 3 tahun terakhir. Keberhasilan ini menjadi bukti nyata bahwa upaya konservasi yang tepat dapat memberikan hasil positif bagi satwa langka Indonesia.',
        summary: 'Populasi harimau sumatera menunjukkan peningkatan berkat program konservasi intensif.',
        featuredImage: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=800&h=600&fit=crop',
        authorId: adminUserId,
        authorName: 'Admin User',
        authorRole: 'SUPER_ADMIN',
        category: 'CONSERVATION',
        tags: ['harimau sumatera', 'konservasi', 'taman nasional'],
        topics: ['satwa langka', 'populasi', 'perlindungan'],
        metaTitle: 'Harimau Sumatera: Populasi Meningkat Berkat Konservasi',
        metaDescription: 'Program konservasi harimau sumatera menunjukkan hasil positif dengan peningkatan populasi 15% dalam 3 tahun.',
        metaKeywords: ['harimau sumatera', 'konservasi', 'satwa langka', 'taman nasional'],
        readingTime: 5,
        status: 'PUBLISHED',
        publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        viewCount: 1250,
        likeCount: 89,
        shareCount: 23,
        commentCount: 15,
        isFeatured: true,
        isBreaking: false,
        isSponsored: false,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        lastReadAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Ditemukan Spesies Baru Paku di Hutan Kalimantan',
        slug: 'spesies-baru-paku-hutan-kalimantan',
        content: 'Tim peneliti dari Universitas Lambung Mangkurat bekerja sama dengan Kementerian Lingkungan Hidup berhasil mengidentifikasi spesies pakis baru di hutan Kalimantan. Penemuan ini menambah kekayaan biodiversitas Indonesia dan membuka penelitian lebih lanjut mengenai flora endemik Kalimantan.',
        summary: 'Para ilmuwan menemukan spesies pakis baru yang belum pernah tercatat sebelumnya.',
        featuredImage: 'https://images.unsplash.com/photo-1540206395-68808572332f?w=800&h=600&fit=crop',
        authorId: adminUserId,
        authorName: 'Admin User',
        authorRole: 'SUPER_ADMIN',
        category: 'RESEARCH',
        tags: ['spesies baru', 'paku', 'kalimantan', 'penelitian'],
        topics: ['biodiversitas', 'flora', 'penemuan'],
        metaTitle: 'Spesies Baru Paku Ditemukan di Kalimantan',
        metaDescription: 'Tim peneliti menemukan spesies pakis baru di hutan Kalimantan yang menambah kekayaan biodiversitas Indonesia.',
        metaKeywords: ['spesies baru', 'paku', 'kalimantan', 'biodiversitas'],
        readingTime: 4,
        status: 'PUBLISHED',
        publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        viewCount: 890,
        likeCount: 67,
        shareCount: 12,
        commentCount: 8,
        isFeatured: false,
        isBreaking: true,
        isSponsored: false,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        lastReadAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      },
      {
        title: 'Taman Nasional Gunung Leuser Ditentapkan sebagai Kawasan Konservasi Prioritas',
        slug: 'gunung-leuser-kawasan-konservasi-prioritas',
        content: 'Pemerintah menetapkan Taman Nasional Gunung Leuser sebagai kawasan konservasi prioritas nasional. Dengan luas lebih dari 950.000 hektar, Taman Nasional Gunung Leuser menjadi fokus utama pemerintah dalam upaya konservasi ekosistem hutan hujan tropis dan habitat satwa langka seperti orangutan, harimau sumatera, dan badak sumatera.',
        summary: 'Pemerintah menetapkan Taman Nasional Gunung Leuser sebagai kawasan konservasi prioritas nasional.',
        featuredImage: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=600&fit=crop',
        authorId: adminUserId,
        authorName: 'Admin User',
        authorRole: 'SUPER_ADMIN',
        category: 'POLICY',
        tags: ['gunung leuser', 'konservasi', 'kebijakan', 'pemerintah'],
        topics: ['taman nasional', 'kawasan lindung', 'kebijakan lingkungan'],
        metaTitle: 'Gunung Leuser Jadi Kawasan Konservasi Prioritas',
        metaDescription: 'Pemerintah menetapkan Taman Nasional Gunung Leuser sebagai kawasan konservasi prioritas nasional untuk melindungi biodiversity.',
        metaKeywords: ['gunung leuser', 'konservasi', 'kebijakan', 'taman nasional'],
        readingTime: 6,
        status: 'PUBLISHED',
        publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        viewCount: 1567,
        likeCount: 123,
        shareCount: 34,
        commentCount: 19,
        isFeatured: true,
        isBreaking: false,
        isSponsored: false,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        lastReadAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    ];

    await db.insert(articles).values(sampleArticles);
    console.log('✅ Sample articles created');

    // Create sample announcements
    const sampleAnnouncements = [
      {
        title: 'Sistem Baru Manajemen Taman Kehati Diluncurkan',
        content: 'Kami dengan bangga mengumumkan peluncuran sistem manajemen Taman Kehati yang baru. Sistem ini dirancang untuk meningkatkan efisiensi pengelolaan data keanekaragaman hayati di seluruh Indonesia dengan fitur-fitur canggih dan antarmuka yang user-friendly.',
        targetType: 'ALL',
        priority: 'HIGH',
        status: 'PUBLISHED',
        targetAudience: ['SUPER_ADMIN', 'REGIONAL_ADMIN', 'USER'],
        scheduledAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        createdBy: adminUserId,
        updatedBy: adminUserId,
        publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        viewCount: 543,
        clickCount: 234,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Pelatihan Konservasi untuk Staf Regional',
        content: 'Akan diadakan pelatihan konservasi tingkat lanjutan untuk staf regional di seluruh Indonesia. Pelatihan ini akan mencakup teknik-teknik terbaru dalam monitoring satwa, pengelolaan habitat, dan community engagement.',
        targetType: 'REGION',
        priority: 'MEDIUM',
        status: 'PUBLISHED',
        targetAudience: ['REGIONAL_ADMIN'],
        scheduledAt: new Date(),
        expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        createdBy: adminUserId,
        updatedBy: adminUserId,
        publishedAt: new Date(),
        viewCount: 89,
        clickCount: 45,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Pemeliharaan Sistem: 20 Oktober 2025',
        content: 'Sistem akan mengalami maintenance pada hari Senin, 20 Oktober 2025 pukul 22:00 - 02:00 WIB. Selama periode ini, sistem tidak akan dapat diakses. Mohon maaf atas ketidaknyamanannya.',
        targetType: 'ALL',
        priority: 'CRITICAL',
        status: 'PUBLISHED',
        targetAudience: ['SUPER_ADMIN', 'REGIONAL_ADMIN', 'USER'],
        scheduledAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        expiresAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        createdBy: adminUserId,
        updatedBy: adminUserId,
        publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        viewCount: 234,
        clickCount: 156,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
    ];

    await db.insert(announcements).values(sampleAnnouncements);
    console.log('✅ Sample announcements created');

    // Create sample biodiversity index data
    const sampleBiodiversityData = [
      {
        parkId: 'park-1',
        regionId: 'park-1',
        assessmentDate: new Date('2025-09-20'),
        indexScore: 78.5,
        totalSpecies: 2847,
        floraSpecies: 1893,
        faunaSpecies: 954,
        endemicSpecies: 237,
        threatenedSpecies: 89,
        dataQuality: 'HIGH',
        assessmentMethod: 'STANDARDIZED_SURVEY',
        lastUpdated: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        nextAssessmentDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
        assessedBy: adminUserId,
        notes: 'Populasi harimau sumatera menunjukkan tren positif dengan peningkatan 15% dari assessment sebelumnya.',
        trendDirection: 'IMPROVING',
        confidenceLevel: 85,
        updatedBy: adminUserId,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      },
      {
        parkId: 'park-2',
        regionId: 'park-2',
        assessmentDate: new Date('2025-09-05'),
        indexScore: 72.3,
        totalSpecies: 1956,
        floraSpecies: 1432,
        faunaSpecies: 524,
        endemicSpecies: 156,
        threatenedSpecies: 123,
        dataQuality: 'MEDIUM',
        assessmentMethod: 'RAPID_ASSESSMENT',
        lastUpdated: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        nextAssessmentDate: new Date(Date.now() + 150 * 24 * 60 * 60 * 1000),
        assessedBy: adminUserId,
        notes: 'Populasi gajah relatif stabil namun memerlukan monitoring lebih intensif.',
        trendDirection: 'STABLE',
        confidenceLevel: 75,
        updatedBy: adminUserId,
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      },
      {
        parkId: 'park-3',
        regionId: 'park-3',
        assessmentDate: new Date('2025-09-25'),
        indexScore: 81.2,
        totalSpecies: 3421,
        floraSpecies: 2456,
        faunaSpecies: 965,
        endemicSpecies: 298,
        threatenedSpecies: 76,
        dataQuality: 'HIGH',
        assessmentMethod: 'COMPREHENSIVE_SURVEY',
        lastUpdated: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        nextAssessmentDate: new Date(Date.now() + 200 * 24 * 60 * 60 * 1000),
        assessedBy: adminUserId,
        notes: 'Keanekaragaman hayati sangat tinggi dengan beberapa spesies baru yang ditemukan dalam assessment terakhir.',
        trendDirection: 'IMPROVING',
        confidenceLevel: 92,
        updatedBy: adminUserId,
        createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      },
    ];

    // First update parks to have UUIDs for the biodiversity data
    const insertedParks = await db.select().from(parks).limit(3);
    if (insertedParks.length >= 3) {
      sampleBiodiversityData[0].parkId = insertedParks[0].id;
      sampleBiodiversityData[0].regionId = insertedParks[0].id;
      sampleBiodiversityData[1].parkId = insertedParks[1].id;
      sampleBiodiversityData[1].regionId = insertedParks[1].id;
      sampleBiodiversityData[2].parkId = insertedParks[2].id;
      sampleBiodiversityData[2].regionId = insertedParks[2].id;

      await db.insert(biodiversityIndex).values(sampleBiodiversityData);
      console.log('✅ Sample biodiversity index data created');
    }

    // Skip audit logs for now (needs UUID fixes)
    /*
    const sampleAuditLogs = [
      {
        actorId: adminUserId,
        actorName: 'Admin User',
        actorRole: 'SUPER_ADMIN',
        action: 'CREATE',
        entity: 'USER',
        entityId: adminUserId,
        entityName: 'Admin User',
        oldValues: null,
        newValues: { name: 'Admin User', email: 'admin@kehati.org', role: 'admin' },
        changes: [{ field: 'name', oldValue: null, newValue: 'Admin User', fieldType: 'string', changeType: 'CREATE' }],
        ipAddress: '127.0.0.1',
        userAgent: 'Mozilla/5.0 (compatible; SeedScript)',
        sessionId: 'seed-session-1',
        requestId: 'seed-req-1',
        description: 'Admin user created during database seeding',
        category: 'SYSTEM',
        severity: 'LOW',
        occurredAt: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
        createdAt: new Date(Date.now() - 60 * 60 * 1000),
      },
      {
        actorId: adminUserId,
        actorName: 'Admin User',
        actorRole: 'SUPER_ADMIN',
        action: 'CREATE',
        entity: 'PARK',
        entityId: 'park-1',
        entityName: 'Taman Nasional Lorentz',
        oldValues: null,
        newValues: { name: 'Taman Nasional Lorentz', province: 'Papua', status: 'published' },
        changes: [
          { field: 'name', oldValue: null, newValue: 'Taman Nasional Lorentz', fieldType: 'string', changeType: 'CREATE' },
          { field: 'province', oldValue: null, newValue: 'Papua', fieldType: 'string', changeType: 'CREATE' }
        ],
        ipAddress: '127.0.0.1',
        userAgent: 'Mozilla/5.0 (compatible; SeedScript)',
        sessionId: 'seed-session-1',
        requestId: 'seed-req-2',
        description: 'Park created during database seeding',
        category: 'DATA_CHANGE',
        severity: 'MEDIUM',
        occurredAt: new Date(Date.now() - 50 * 60 * 1000), // 50 minutes ago
        createdAt: new Date(Date.now() - 50 * 60 * 1000),
      },
      {
        actorId: adminUserId,
        actorName: 'Admin User',
        actorRole: 'SUPER_ADMIN',
        action: 'LOGIN',
        entity: 'USER',
        entityId: adminUserId,
        entityName: 'Admin User',
        oldValues: null,
        newValues: { loginTime: new Date(Date.now() - 30 * 60 * 1000) },
        changes: [{ field: 'lastLogin', oldValue: null, newValue: new Date(Date.now() - 30 * 60 * 1000), fieldType: 'date', changeType: 'UPDATE' }],
        ipAddress: '127.0.0.1',
        userAgent: 'Mozilla/5.0 (compatible; SeedScript)',
        sessionId: 'seed-session-2',
        requestId: 'seed-req-3',
        description: 'System login during seeding process',
        category: 'ACCESS',
        severity: 'LOW',
        occurredAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        createdAt: new Date(Date.now() - 30 * 60 * 1000),
      },
    ];

    await db.insert(auditLogs).values(sampleAuditLogs);
    console.log('✅ Sample audit logs created');
    */

    console.log('🎉 Seed completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
}

seed().catch(console.error);