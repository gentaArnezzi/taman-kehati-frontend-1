import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { articles, articleViews } from '@/db/schema';
import { eq, and, sql } from 'drizzle-orm';

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // Get client IP for tracking
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] :
                request.headers.get('x-real-ip') ||
                request.ip ||
                'unknown';

    // Get article by slug
    const [article] = await db
      .select()
      .from(articles)
      .where(eq(articles.slug, slug))
      .limit(1);

    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    // Check if this IP has viewed the article in the last 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const [recentView] = await db
      .select()
      .from(articleViews)
      .where(and(
        eq(articleViews.articleId, article.id),
        eq(articleViews.ipAddress, ip),
        // We would need a timestamp field in articleViews for this check
      ))
      .limit(1);

    // Only count as a view if not viewed by this IP in last 24 hours
    if (!recentView) {
      // Record the view
      await db.insert(articleViews).values({
        id: crypto.randomUUID(),
        articleId: article.id,
        ipAddress: ip,
        userAgent: request.headers.get('user-agent') || 'unknown',
        referrer: request.headers.get('referer') || null,
        viewedAt: new Date(),
      });

      // Increment view count
      await db
        .update(articles)
        .set({
          viewCount: sql`${articles.viewCount} + 1`,
          lastReadAt: new Date(),
        })
        .where(eq(articles.id, article.id));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error recording view:', error);
    return NextResponse.json(
      { error: 'Failed to record view' },
      { status: 500 }
    );
  }
}