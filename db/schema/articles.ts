import {
  uuid,
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
  boolean,
  json
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./auth";
import { parks } from "./taman";

// Articles Table
export const articles = pgTable("articles", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 500 }).notNull(),
  slug: varchar("slug", { length: 500 }).notNull().unique(),
  content: text("content").notNull(),
  summary: varchar("summary", { length: 1000 }),
  featuredImage: varchar("featured_image", { length: 500 }),

  // Authoring
  authorId: text("author_id").references(() => user.id, { onDelete: "set null" }).notNull(),
  authorName: varchar("author_name", { length: 255 }).notNull(),
  authorRole: varchar("author_role", { length: 20 }).notNull(), // SUPER_ADMIN, REGIONAL_ADMIN
  authorRegionId: uuid("author_region_id").references(() => parks.id, { onDelete: "set null" }),

  // Categorization
  category: varchar("category", { length: 20 }).notNull().default("NEWS"), // NEWS, CONSERVATION, RESEARCH, EDUCATION, EVENT, SUCCESS_STORY, POLICY, TECHNOLOGY, COMMUNITY
  tags: text("tags").array(),
  topics: text("topics").array(),

  // Park Association (optional)
  parkId: uuid("park_id").references(() => parks.id, { onDelete: "set null" }),

  // SEO & Publishing
  metaTitle: varchar("meta_title", { length: 60 }),
  metaDescription: varchar("meta_description", { length: 160 }),
  metaKeywords: text("meta_keywords").array(),
  readingTime: integer("reading_time").default(0), // Estimated reading time in minutes

  // Publishing Workflow
  status: varchar("status", { length: 20 }).default("DRAFT"), // DRAFT, IN_REVIEW, PUBLISHED, REJECTED, ARCHIVED
  publishedAt: timestamp("published_at"),
  scheduledAt: timestamp("scheduled_at"), // For scheduled publishing

  // Statistics
  viewCount: integer("view_count").default(0),
  likeCount: integer("like_count").default(0),
  shareCount: integer("share_count").default(0),
  commentCount: integer("comment_count").default(0),

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
  lastReadAt: timestamp("last_read_at"),

  // Flags
  isFeatured: boolean("is_featured").default(false),
  isBreaking: boolean("is_breaking").default(false),
  isSponsored: boolean("is_sponsored").default(false),
});

// Article Comments Table
export const articleComments = pgTable("article_comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  articleId: uuid("article_id").references(() => articles.id, { onDelete: "cascade" }).notNull(),
  authorName: varchar("author_name", { length: 255 }).notNull(),
  authorEmail: varchar("author_email", { length: 255 }).notNull(),
  content: text("content").notNull(),
  status: varchar("status", { length: 20 }).default("PENDING"), // PENDING, APPROVED, REJECTED
  parentId: uuid("parent_id").references(() => articleComments.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Article Likes Table
export const articleLikes = pgTable("article_likes", {
  id: uuid("id").primaryKey().defaultRandom(),
  articleId: uuid("article_id").references(() => articles.id, { onDelete: "cascade" }).notNull(),
  userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
  ipAddress: varchar("ip_address", { length: 45 }), // Support IPv6
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Article Views Table
export const articleViews = pgTable("article_views", {
  id: uuid("id").primaryKey().defaultRandom(),
  articleId: uuid("article_id").references(() => articles.id, { onDelete: "cascade" }).notNull(),
  userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
  ipAddress: varchar("ip_address", { length: 45 }), // Support IPv6
  userAgent: text("user_agent"),
  referrer: text("referrer"),
  viewedAt: timestamp("viewed_at").defaultNow().notNull(),
});

// Article Shares Table
export const articleShares = pgTable("article_shares", {
  id: uuid("id").primaryKey().defaultRandom(),
  articleId: uuid("article_id").references(() => articles.id, { onDelete: "cascade" }).notNull(),
  platform: varchar("platform", { length: 50 }).notNull(), // facebook, twitter, whatsapp, email, etc.
  url: varchar("url", { length: 500 }),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const articlesRelations = relations(articles, ({ one, many }) => ({
  author: one(user, {
    fields: [articles.authorId],
    references: [user.id],
  }),
  park: one(parks, {
    fields: [articles.parkId],
    references: [parks.id],
  }),
  authorRegion: one(parks, {
    fields: [articles.authorRegionId],
    references: [parks.id],
  }),
  comments: many(articleComments),
  likes: many(articleLikes),
  views: many(articleViews),
  shares: many(articleShares),
}));

export const articleCommentsRelations = relations(articleComments, ({ one, many }) => ({
  article: one(articles, {
    fields: [articleComments.articleId],
    references: [articles.id],
  }),
  parent: one(articleComments, {
    fields: [articleComments.parentId],
    references: [articleComments.id],
  }),
  replies: many(articleComments),
}));

export const articleLikesRelations = relations(articleLikes, ({ one }) => ({
  article: one(articles, {
    fields: [articleLikes.articleId],
    references: [articles.id],
  }),
  user: one(user, {
    fields: [articleLikes.userId],
    references: [user.id],
  }),
}));

export const articleViewsRelations = relations(articleViews, ({ one }) => ({
  article: one(articles, {
    fields: [articleViews.articleId],
    references: [articles.id],
  }),
  user: one(user, {
    fields: [articleViews.userId],
    references: [user.id],
  }),
}));

export const articleSharesRelations = relations(articleShares, ({ one }) => ({
  article: one(articles, {
    fields: [articleShares.articleId],
    references: [articles.id],
  }),
}));

// Types
export type Article = typeof articles.$inferSelect;
export type NewArticle = typeof articles.$inferInsert;
export type ArticleComment = typeof articleComments.$inferSelect;
export type NewArticleComment = typeof articleComments.$inferInsert;
export type ArticleLike = typeof articleLikes.$inferSelect;
export type NewArticleLike = typeof articleLikes.$inferInsert;
export type ArticleView = typeof articleViews.$inferSelect;
export type NewArticleView = typeof articleViews.$inferInsert;
export type ArticleShare = typeof articleShares.$inferSelect;
export type NewArticleShare = typeof articleShares.$inferInsert;

// Enums
export type ArticleCategory = "NEWS" | "CONSERVATION" | "RESEARCH" | "EDUCATION" | "EVENT" | "SUCCESS_STORY" | "POLICY" | "TECHNOLOGY" | "COMMUNITY";
export type ArticleStatus = "DRAFT" | "IN_REVIEW" | "PUBLISHED" | "REJECTED" | "ARCHIVED";
export type CommentStatus = "PENDING" | "APPROVED" | "REJECTED";