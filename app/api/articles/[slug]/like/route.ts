import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { articles, articleLikes } from '@/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { slug } = params;
    const userId = session.user.id;

    // First get the article by slug to get the ID
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

    // Check if user already liked the article
    const [existingLike] = await db
      .select()
      .from(articleLikes)
      .where(and(eq(articleLikes.articleId, article.id), eq(articleLikes.userId, userId)))
      .limit(1);

    if (existingLike) {
      // Unlike the article
      await db
        .delete(articleLikes)
        .where(and(eq(articleLikes.articleId, article.id), eq(articleLikes.userId, userId)));

      // Decrement like count
      await db
        .update(articles)
        .set({
          likeCount: sql`${articles.likeCount} - 1`,
        })
        .where(eq(articles.id, article.id));

      return NextResponse.json({ liked: false });
    } else {
      // Like the article
      await db.insert(articleLikes).values({
        id: crypto.randomUUID(),
        articleId: article.id,
        userId,
        createdAt: new Date(),
      });

      // Increment like count
      await db
        .update(articles)
        .set({
          likeCount: sql`${articles.likeCount} + 1`,
        })
        .where(eq(articles.id, article.id));

      return NextResponse.json({ liked: true });
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    return NextResponse.json(
      { error: 'Failed to toggle like' },
      { status: 500 }
    );
  }
}