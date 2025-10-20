import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { announcements, announcementRecipients, auditLogs } from '@/db/schema';
import { eq, desc, and, ilike, sql } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const offset = (page - 1) * limit;

    // Build query conditions based on user role
    const conditions = [];

    if (session.user.role === 'SUPER_ADMIN') {
      // Super admins can see all announcements
      if (status) {
        conditions.push(eq(announcements.status, status.toUpperCase()));
      }
      if (priority) {
        conditions.push(eq(announcements.priority, priority.toUpperCase()));
      }
    } else if (session.user.role === 'REGIONAL_ADMIN') {
      // Regional admins can see announcements sent to them or all regional admins
      conditions.push(
        sql`(
          ${announcements.targetType} = 'ALL' OR
          ${announcements.targetType} = 'REGIONAL_ADMINS' OR
          ${announcements.authorId} = ${session.user.id}
        )`
      );
      if (status) {
        conditions.push(eq(announcements.status, status.toUpperCase()));
      }
    } else {
      // Other users can only see published announcements targeted to them
      conditions.push(
        sql`(
          ${announcements.targetType} = 'ALL' OR
          ${announcements.targetType} = 'PUBLIC'
        )`
      );
      conditions.push(eq(announcements.status, 'PUBLISHED'));
    }

    // Get announcements
    const announcementsList = await db
      .select()
      .from(announcements)
      .where(and(...conditions))
      .orderBy(desc(announcements.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count
    const totalCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(announcements)
      .where(and(...conditions));

    return NextResponse.json({
      announcements: announcementsList,
      pagination: {
        page,
        limit,
        total: totalCount[0]?.count || 0,
        totalPages: Math.ceil((totalCount[0]?.count || 0) / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return NextResponse.json(
      { error: 'Failed to fetch announcements' },
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

    // Only admins can create announcements
    if (!['SUPER_ADMIN', 'REGIONAL_ADMIN'].includes(session.user.role || '')) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      title,
      content,
      targetType,
      targetRegions,
      targetRoles,
      priority = 'MEDIUM',
      scheduledAt,
      expiresAt,
    } = body;

    // Validate required fields
    if (!title || !content || !targetType) {
      return NextResponse.json(
        { error: 'Title, content, and target type are required' },
        { status: 400 }
      );
    }

    // Create announcement
    const [newAnnouncement] = await db
      .insert(announcements)
      .values({
        id: crypto.randomUUID(),
        title,
        content,
        targetType: targetType.toUpperCase(),
        targetRegions: targetRegions || [],
        targetRoles: targetRoles || [],
        priority: priority.toUpperCase(),
        status: 'DRAFT',
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        authorId: session.user.id,
        authorName: session.user.name || 'Unknown',
        authorRole: session.user.role || 'USER',
        totalRecipients: 0, // Will be calculated when published
        readCount: 0,
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
      entity: 'ANNOUNCEMENT',
      entityId: newAnnouncement.id,
      description: `Created announcement: ${title}`,
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      occurredAt: new Date(),
      severity: 'LOW',
      category: 'WORKFLOW',
    });

    return NextResponse.json(newAnnouncement, { status: 201 });
  } catch (error) {
    console.error('Error creating announcement:', error);
    return NextResponse.json(
      { error: 'Failed to create announcement' },
      { status: 500 }
    );
  }
}