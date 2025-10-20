import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { biodiversityIndex, parks } from '@/db/schema';
import { eq, desc, and, gte, lte } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const parkId = searchParams.get('parkId');
    const region = searchParams.get('region');
    const minScore = parseInt(searchParams.get('minScore') || '0');
    const maxScore = parseInt(searchParams.get('maxScore') || '100');
    const offset = (page - 1) * limit;

    // Build query conditions
    const conditions = [
      gte(biodiversityIndex.overallBiodiversityScore, minScore),
      lte(biodiversityIndex.overallBiodiversityScore, maxScore),
    ];

    if (parkId) {
      conditions.push(eq(biodiversityIndex.parkId, parkId));
    }

    // Get biodiversity indices with park information
    const biodiversityData = await db
      .select({
        id: biodiversityIndex.id,
        parkId: biodiversityIndex.parkId,
        parkName: parks.name,
        region: parks.region,
        assessmentDate: biodiversityIndex.assessmentDate,
        totalFloraSpecies: biodiversityIndex.totalFloraSpecies,
        floraDiversityScore: biodiversityIndex.floraDiversityScore,
        totalFaunaSpecies: biodiversityIndex.totalFaunaSpecies,
        faunaDiversityScore: biodiversityIndex.faunaDiversityScore,
        overallBiodiversityScore: biodiversityIndex.overallBiodiversityScore,
        status: biodiversityIndex.status,
        assessedBy: biodiversityIndex.assessedBy,
      })
      .from(biodiversityIndex)
      .leftJoin(parks, eq(biodiversityIndex.parkId, parks.id))
      .where(and(...conditions))
      .orderBy(desc(biodiversityIndex.assessmentDate))
      .limit(limit)
      .offset(offset);

    // Apply region filter if specified (after joining with parks)
    const filteredData = region
      ? biodiversityData.filter(item => item.region === region)
      : biodiversityData;

    // Get total count
    const totalCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(biodiversityIndex)
      .leftJoin(parks, eq(biodiversityIndex.parkId, parks.id))
      .where(and(...conditions));

    const finalCount = region
      ? filteredData.length
      : totalCount[0]?.count || 0;

    return NextResponse.json({
      biodiversity: filteredData,
      pagination: {
        page,
        limit,
        total: finalCount,
        totalPages: Math.ceil(finalCount / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching biodiversity data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch biodiversity data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only admins can create biodiversity assessments
    if (!['SUPER_ADMIN', 'REGIONAL_ADMIN'].includes(session.user.role || '')) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      parkId,
      assessmentDate,
      totalFloraSpecies,
      floraDiversityScore,
      totalFaunaSpecies,
      faunaDiversityScore,
      overallBiodiversityScore,
      notes,
      status = 'DRAFT',
    } = body;

    // Validate required fields
    if (!parkId || !assessmentDate) {
      return NextResponse.json(
        { error: 'Park ID and assessment date are required' },
        { status: 400 }
      );
    }

    // Calculate overall score if not provided
    const calculatedOverallScore = overallBiodiversityScore ||
      Math.round((floraDiversityScore + faunaDiversityScore) / 2);

    // Create biodiversity assessment
    const [newAssessment] = await db
      .insert(biodiversityIndex)
      .values({
        id: crypto.randomUUID(),
        parkId,
        assessmentDate: new Date(assessmentDate),
        totalFloraSpecies: totalFloraSpecies || 0,
        floraDiversityScore: floraDiversityScore || 0,
        totalFaunaSpecies: totalFaunaSpecies || 0,
        faunaDiversityScore: faunaDiversityScore || 0,
        overallBiodiversityScore: calculatedOverallScore,
        notes,
        status: status.toUpperCase(),
        assessedBy: session.user.id,
        assessedByName: session.user.name || 'Unknown',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    // Log the action
    await db.insert(auditLogs).values({
      id: crypto.randomUUID(),
      actorId: session.user.id,
      actorName: session.user.name || 'Unknown',
      action: 'CREATE',
      entity: 'BIODIVERSITY_INDEX',
      entityId: newAssessment.id,
      description: `Created biodiversity assessment for park: ${parkId}`,
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      occurredAt: new Date(),
      severity: 'MEDIUM',
      category: 'DATA_CHANGE',
    });

    return NextResponse.json(newAssessment, { status: 201 });
  } catch (error) {
    console.error('Error creating biodiversity assessment:', error);
    return NextResponse.json(
      { error: 'Failed to create biodiversity assessment' },
      { status: 500 }
    );
  }
}