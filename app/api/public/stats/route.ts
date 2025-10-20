import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { parks, flora, fauna, articles, biodiversityIndex, announcements } from '@/db/schema';
import { eq, and, sql, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Get general statistics
    const [parkStats] = await db
      .select({
        totalParks: sql<number>`count(*)`,
        totalArea: sql<number>`sum(areaSize)`,
        averageBiodiversity: sql<number>`avg(biodiversityIndex)`,
        nationalParks: sql<number>`count(*) FILTER (WHERE type = 'NATIONAL_PARK')`,
        natureReserves: sql<number>`count(*) FILTER (WHERE type = 'NATURE_RESERVE')`,
        wildlifeSanctuaries: sql<number>`count(*) FILTER (WHERE type = 'WILDLIFE_SANCTUARY')`,
      })
      .from(parks);

    const [floraStats] = await db
      .select({
        totalFloraSpecies: sql<number>`count(*)`,
        endemicSpecies: sql<number>`count(*) FILTER (WHERE isEndemic = true)`,
        threatenedSpecies: sql<number>`count(*) FILTER (WHERE conservationStatus IN ('CRITICAL', 'ENDANGERED', 'VULNERABLE'))`,
        uniqueFamilies: sql<number>`count(DISTINCT family)`,
      })
      .from(flora);

    const [faunaStats] = await db
      .select({
        totalFaunaSpecies: sql<number>`count(*)`,
        endemicSpecies: sql<number>`count(*) FILTER (WHERE isEndemic = true)`,
        threatenedSpecies: sql<number>`count(*) FILTER (WHERE conservationStatus IN ('CRITICAL', 'ENDANGERED', 'VULNERABLE'))`,
        uniqueFamilies: sql<number>`count(DISTINCT family)`,
      })
      .from(fauna);

    const [articleStats] = await db
      .select({
        totalArticles: sql<number>`count(*)`,
        publishedArticles: sql<number>`count(*) FILTER (WHERE status = 'PUBLISHED')`,
        totalViews: sql<number>`sum(viewCount)`,
        totalLikes: sql<number>`sum(likeCount)`,
        featuredArticles: sql<number>`count(*) FILTER (WHERE isFeatured = true)`,
      })
      .from(articles);

    const [biodiversityStats] = await db
      .select({
        latestAssessment: sql<Date>`max(assessmentDate)`,
        averageIndex: sql<number>`avg(overallBiodiversityScore)`,
        highestIndex: sql<number>`max(overallBiodiversityScore)`,
        lowestIndex: sql<number>`min(overallBiodiversityScore)`,
        totalAssessments: sql<number>`count(*)`,
      })
      .from(biodiversityIndex)
      .where(eq(biodiversityIndex.status, 'PUBLISHED'));

    const [announcementStats] = await db
      .select({
        totalAnnouncements: sql<number>`count(*)`,
        activeAnnouncements: sql<number>`count(*) FILTER (WHERE status = 'PUBLISHED' AND (expiresAt IS NULL OR expiresAt > CURRENT_DATE))`,
        highPriority: sql<number>`count(*) FILTER (WHERE priority = 'HIGH')`,
        totalReads: sql<number>`sum(readCount)`,
      })
      .from(announcements);

    // Get regional breakdown
    const regionalStats = await db
      .select({
        region: parks.region,
        parkCount: sql<number>`count(*)`,
        totalArea: sql<number>`sum(parks.areaSize)`,
        averageBiodiversity: sql<number>`avg(parks.biodiversityIndex)`,
        floraCount: sql<number>`count(DISTINCT ${flora.id})`,
        faunaCount: sql<number>`count(DISTINCT ${fauna.id})`,
      })
      .from(parks)
      .leftJoin(flora, eq(parks.region, flora.region))
      .leftJoin(fauna, eq(parks.region, fauna.region))
      .groupBy(parks.region)
      .orderBy(sql`count(*) DESC`);

    // Get recent activities (latest published articles, announcements, etc.)
    const recentArticles = await db
      .select({
        id: articles.id,
        title: articles.title,
        type: sql<string>`'article'`,
        date: articles.publishedAt,
        author: articles.authorName,
      })
      .from(articles)
      .where(eq(articles.status, 'PUBLISHED'))
      .orderBy(desc(articles.publishedAt))
      .limit(5);

    const recentAnnouncements = await db
      .select({
        id: announcements.id,
        title: announcements.title,
        type: sql<string>`'announcement'`,
        date: announcements.createdAt,
        author: announcements.authorName,
      })
      .from(announcements)
      .where(eq(announcements.status, 'PUBLISHED'))
      .orderBy(desc(announcements.createdAt))
      .limit(5);

    // Get conservation status breakdown
    const conservationBreakdown = await db
      .select({
        status: parks.conservationStatus,
        count: sql<number>`count(*)`,
        totalArea: sql<number>`sum(areaSize)`,
      })
      .from(parks)
      .groupBy(parks.conservationStatus)
      .orderBy(sql`count(*) DESC`);

    // Combine recent activities
    const recentActivities = [
      ...recentArticles.map(item => ({ ...item, date: item.publishedAt })),
      ...recentAnnouncements
    ]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);

    return NextResponse.json({
      overview: {
        totalParks: parkStats.totalParks || 0,
        totalArea: parkStats.totalArea || 0,
        averageBiodiversity: Math.round(parkStats.averageBiodiversity || 0),
        totalSpecies: (floraStats.totalFloraSpecies || 0) + (faunaStats.totalFaunaSpecies || 0),
        totalEndemicSpecies: (floraStats.endemicSpecies || 0) + (faunaStats.endemicSpecies || 0),
        totalThreatenedSpecies: (floraStats.threatenedSpecies || 0) + (faunaStats.threatenedSpecies || 0),
        totalArticles: articleStats.totalArticles || 0,
        totalViews: articleStats.totalViews || 0,
        totalAnnouncements: announcementStats.totalAnnouncements || 0,
      },
      parks: {
        total: parkStats.totalParks || 0,
        nationalParks: parkStats.nationalParks || 0,
        natureReserves: parkStats.natureReserves || 0,
        wildlifeSanctuaries: parkStats.wildlifeSanctuaries || 0,
        totalArea: parkStats.totalArea || 0,
        averageBiodiversity: Math.round(parkStats.averageBiodiversity || 0),
        regionalBreakdown: regionalStats,
        conservationBreakdown: conservationBreakdown,
      },
      biodiversity: {
        floraSpecies: floraStats.totalFloraSpecies || 0,
        faunaSpecies: faunaStats.totalFaunaSpecies || 0,
        endemicSpecies: (floraStats.endemicSpecies || 0) + (faunaStats.endemicSpecies || 0),
        threatenedSpecies: (floraStats.threatenedSpecies || 0) + (faunaStats.threatenedSpecies || 0),
        averageIndex: Math.round(biodiversityStats.averageIndex || 0),
        highestIndex: biodiversityStats.highestIndex || 0,
        lowestIndex: biodiversityStats.lowestIndex || 0,
        latestAssessment: biodiversityStats.latestAssessment,
      },
      content: {
        totalArticles: articleStats.totalArticles || 0,
        publishedArticles: articleStats.publishedArticles || 0,
        totalViews: articleStats.totalViews || 0,
        totalLikes: articleStats.totalLikes || 0,
        featuredArticles: articleStats.featuredArticles || 0,
        activeAnnouncements: announcementStats.activeAnnouncements || 0,
        highPriorityAnnouncements: announcementStats.highPriority || 0,
        recentActivities,
      },
    });
  } catch (error) {
    console.error('Error fetching public stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}