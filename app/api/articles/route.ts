import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { articles } from '@/db/schema';
import { eq, desc, and, ilike, sql } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'latest';
    const offset = (page - 1) * limit;

    // Build query conditions
    const conditions = [eq(articles.status, 'PUBLISHED')];

    if (category) {
      conditions.push(eq(articles.category, category.toUpperCase()));
    }

    if (search) {
      conditions.push(
        sql`(${ilike(articles.title, ${`%${search}%`})} OR ${ilike(articles.content, ${`%${search}%`})} OR ${ilike(articles.summary, ${`%${search}%`})})`
      );
    }

    // Build order by clause
    let orderBy;
    switch (sortBy) {
      case 'popular':
        orderBy = desc(articles.viewCount);
        break;
      case 'trending':
        orderBy = desc(sql`${articles.likeCount} + ${articles.shareCount}`);
        break;
      case 'latest':
      default:
        orderBy = desc(articles.publishedAt);
        break;
    }

    // Get articles
    const articlesList = await db
      .select()
      .from(articles)
      .where(and(...conditions))
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    // Get total count
    const totalCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(articles)
      .where(and(...conditions));

    return NextResponse.json({
      articles: articlesList,
      pagination: {
        page,
        limit,
        total: totalCount[0]?.count || 0,
        totalPages: Math.ceil((totalCount[0]?.count || 0) / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
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

    const body = await request.json();
    const {
      title,
      content,
      summary,
      category,
      tags,
      topics,
      metaTitle,
      metaDescription,
      metaKeywords,
      isFeatured,
      isBreaking,
      isSponsored,
      publishedAt,
    } = body;

    // Validate required fields
    if (!title || !content || !category) {
      return NextResponse.json(
        { error: 'Title, content, and category are required' },
        { status: 400 }
      );
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug already exists
    const existingArticle = await db
      .select()
      .from(articles)
      .where(eq(articles.slug, slug))
      .limit(1);

    if (existingArticle.length > 0) {
      return NextResponse.json(
        { error: 'Article with this title already exists' },
        { status: 409 }
      );
    }

    // Create article
    const [newArticle] = await db
      .insert(articles)
      .values({
        id: crypto.randomUUID(),
        title,
        slug,
        content,
        summary,
        category: category.toUpperCase(),
        tags: tags || [],
        topics: topics || [],
        metaTitle,
        metaDescription,
        metaKeywords,
        isFeatured: isFeatured || false,
        isBreaking: isBreaking || false,
        isSponsored: isSponsored || false,
        authorId: session.user.id,
        authorName: session.user.name || 'Unknown',
        authorRole: session.user.role || 'USER',
        status: publishedAt ? 'PUBLISHED' : 'DRAFT',
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        scheduledAt: null,
        readingTime: Math.ceil(content.split(' ').length / 200), // Estimate reading time
        viewCount: 0,
        likeCount: 0,
        shareCount: 0,
        commentCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return NextResponse.json(newArticle, { status: 201 });
  } catch (error) {
    console.error('Error creating article:', error);
    return NextResponse.json(
      { error: 'Failed to create article' },
      { status: 500 }
    );
  }
}