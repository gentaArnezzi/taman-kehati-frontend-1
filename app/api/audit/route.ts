import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { auditLogs, users } from '@/db/schema';
import { eq, desc, and, ilike, sql, gte, lte } from 'drizzle-orm';
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

    // Only admins can access audit logs
    if (!['SUPER_ADMIN', 'REGIONAL_ADMIN'].includes(session.user.role || '')) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const action = searchParams.get('action');
    const entity = searchParams.get('entity');
    const category = searchParams.get('category');
    const severity = searchParams.get('severity');
    const actorId = searchParams.get('actorId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const search = searchParams.get('search');
    const offset = (page - 1) * limit;

    // Build query conditions
    const conditions = [];

    if (action) {
      conditions.push(eq(auditLogs.action, action.toUpperCase()));
    }

    if (entity) {
      conditions.push(eq(auditLogs.entity, entity.toUpperCase()));
    }

    if (category) {
      conditions.push(eq(auditLogs.category, category.toUpperCase()));
    }

    if (severity) {
      conditions.push(eq(auditLogs.severity, severity.toUpperCase()));
    }

    if (actorId) {
      conditions.push(eq(auditLogs.actorId, actorId));
    }

    if (startDate) {
      conditions.push(gte(auditLogs.occurredAt, new Date(startDate)));
    }

    if (endDate) {
      conditions.push(lte(auditLogs.occurredAt, new Date(endDate)));
    }

    if (search) {
      conditions.push(
        sql`(${ilike(auditLogs.description, ${`%${search}%`})} OR ${ilike(auditLogs.actorName, ${`%${search}%`})})`
      );
    }

    // Regional admins can only see logs from their region
    if (session.user.role === 'REGIONAL_ADMIN') {
      // This would require region information in the audit logs or user table
      // For now, we'll allow them to see all logs but in production this should be filtered
    }

    // Get audit logs with user information
    const auditData = await db
      .select({
        id: auditLogs.id,
        actorId: auditLogs.actorId,
        actorName: auditLogs.actorName,
        action: auditLogs.action,
        entity: auditLogs.entity,
        entityId: auditLogs.entityId,
        description: auditLogs.description,
        ipAddress: auditLogs.ipAddress,
        userAgent: auditLogs.userAgent,
        occurredAt: auditLogs.occurredAt,
        severity: auditLogs.severity,
        category: auditLogs.category,
        oldValues: auditLogs.oldValues,
        newValues: auditLogs.newValues,
        changes: auditLogs.changes,
      })
      .from(auditLogs)
      .where(and(...conditions))
      .orderBy(desc(auditLogs.occurredAt))
      .limit(limit)
      .offset(offset);

    // Get total count
    const totalCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(auditLogs)
      .where(and(...conditions));

    // Get summary statistics
    const [stats] = await db
      .select({
        totalLogs: sql<number>`count(*)`,
        criticalEvents: sql<number>`count(*) FILTER (WHERE severity = 'CRITICAL')`,
        todayLogs: sql<number>`count(*) FILTER (WHERE occurredAt >= CURRENT_DATE)`,
        uniqueActors: sql<number>`count(DISTINCT actorId)`,
      })
      .from(auditLogs)
      .where(and(...conditions));

    return NextResponse.json({
      logs: auditData,
      pagination: {
        page,
        limit,
        total: totalCount[0]?.count || 0,
        totalPages: Math.ceil((totalCount[0]?.count || 0) / limit),
      },
      stats: {
        totalLogs: stats.totalLogs || 0,
        criticalEvents: stats.criticalEvents || 0,
        todayLogs: stats.todayLogs || 0,
        uniqueActors: stats.uniqueActors || 0,
      },
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch audit logs' },
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

    // Only super admins can manually create audit logs
    if (session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      actorId,
      action,
      entity,
      entityId,
      description,
      severity = 'MEDIUM',
      category = 'SYSTEM',
      oldValues,
      newValues,
      changes,
    } = body;

    // Validate required fields
    if (!action || !entity || !description) {
      return NextResponse.json(
        { error: 'Action, entity, and description are required' },
        { status: 400 }
      );
    }

    // Create audit log entry
    const [newAuditLog] = await db
      .insert(auditLogs)
      .values({
        id: crypto.randomUUID(),
        actorId: actorId || session.user.id,
        actorName: session.user.name || 'Unknown',
        action: action.toUpperCase(),
        entity: entity.toUpperCase(),
        entityId,
        description,
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        occurredAt: new Date(),
        severity: severity.toUpperCase(),
        category: category.toUpperCase(),
        oldValues,
        newValues,
        changes,
      })
      .returning();

    return NextResponse.json(newAuditLog, { status: 201 });
  } catch (error) {
    console.error('Error creating audit log:', error);
    return NextResponse.json(
      { error: 'Failed to create audit log' },
      { status: 500 }
    );
  }
}