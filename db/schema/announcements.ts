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

// Announcements Table
export const announcements = pgTable("announcements", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  summary: varchar("summary", { length: 500 }),

  // Targeting
  targetType: varchar("target_type", { length: 20 }).notNull(), // ALL, REGION, USER, ROLE
  targetRef: varchar("target_ref", { length: 255 }),

  // Authoring
  createdBy: text("created_by").references(() => user.id, { onDelete: "cascade" }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedBy: text("updated_by").references(() => user.id),
  updatedAt: timestamp("updated_at"),

  // Publishing
  publishedAt: timestamp("published_at"),
  expiresAt: timestamp("expires_at"),
  priority: varchar("priority", { length: 20 }).default("MEDIUM"), // LOW, MEDIUM, HIGH, URGENT
  status: varchar("status", { length: 20 }).default("DRAFT"), // DRAFT, PUBLISHED, ARCHIVED, EXPIRED

  // Metadata
  category: varchar("category", { length: 20 }).default("GENERAL"), // SYSTEM, POLICY, EVENT, MAINTENANCE, GENERAL
  tags: text("tags").array(),
  attachments: json("attachments").$type<Array<{
    id: string;
    fileName: string;
    originalName: string;
    mimeType: string;
    fileSize: number;
    url: string;
    uploadedAt: Date;
  }>>().default([]),

  // Statistics
  totalRecipients: integer("total_recipients").default(0),
  readCount: integer("read_count").default(0),
  archivedCount: integer("archived_count").default(0),

  // Workflow
  description: text("description"),
});

// Announcement Attachments Table
export const announcementAttachments = pgTable("announcement_attachments", {
  id: uuid("id").primaryKey().defaultRandom(),
  announcementId: uuid("announcement_id").references(() => announcements.id, { onDelete: "cascade" }).notNull(),
  fileName: varchar("file_name", { length: 255 }).notNull(),
  originalName: varchar("original_name", { length: 255 }).notNull(),
  mimeType: varchar("mime_type", { length: 100 }).notNull(),
  fileSize: integer("file_size").notNull(),
  url: varchar("url", { length: 500 }).notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
});

// Announcement Status Tracking Table
export const announcementStatus = pgTable("announcement_status", {
  id: uuid("id").primaryKey().defaultRandom(),
  announcementId: uuid("announcement_id").references(() => announcements.id, { onDelete: "cascade" }).notNull(),
  userId: text("user_id").references(() => user.id, { onDelete: "cascade" }).notNull(),
  status: varchar("status", { length: 20 }).default("UNREAD"), // UNREAD, READ, ARCHIVED
  readAt: timestamp("read_at"),
  archivedAt: timestamp("archived_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Announcement Recipients Table - for tracking targeted delivery
export const announcementRecipients = pgTable("announcement_recipients", {
  id: uuid("id").primaryKey().defaultRandom(),
  announcementId: uuid("announcement_id").references(() => announcements.id, { onDelete: "cascade" }).notNull(),
  userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
  regionId: uuid("region_id"), // Reference to region/park if targeting by region
  role: varchar("role", { length: 20 }), // SUPER_ADMIN, REGIONAL_ADMIN, etc.
  deliveredAt: timestamp("delivered_at"),
  readAt: timestamp("read_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const announcementsRelations = relations(announcements, ({ one, many }) => ({
  createdByUser: one(user, {
    fields: [announcements.createdBy],
    references: [user.id],
  }),
  updatedByUser: one(user, {
    fields: [announcements.updatedBy],
    references: [user.id],
  }),
  attachments: many(announcementAttachments),
  statusTrackings: many(announcementStatus),
  recipients: many(announcementRecipients),
}));

export const announcementAttachmentsRelations = relations(announcementAttachments, ({ one }) => ({
  announcement: one(announcements, {
    fields: [announcementAttachments.announcementId],
    references: [announcements.id],
  }),
}));

export const announcementStatusRelations = relations(announcementStatus, ({ one }) => ({
  announcement: one(announcements, {
    fields: [announcementStatus.announcementId],
    references: [announcements.id],
  }),
  user: one(user, {
    fields: [announcementStatus.userId],
    references: [user.id],
  }),
}));

export const announcementRecipientsRelations = relations(announcementRecipients, ({ one }) => ({
  announcement: one(announcements, {
    fields: [announcementRecipients.announcementId],
    references: [announcements.id],
  }),
  user: one(user, {
    fields: [announcementRecipients.userId],
    references: [user.id],
  }),
}));

// Types
export type Announcement = typeof announcements.$inferSelect;
export type NewAnnouncement = typeof announcements.$inferInsert;
export type AnnouncementAttachment = typeof announcementAttachments.$inferSelect;
export type NewAnnouncementAttachment = typeof announcementAttachments.$inferInsert;
export type AnnouncementStatus = typeof announcementStatus.$inferSelect;
export type NewAnnouncementStatus = typeof announcementStatus.$inferInsert;
export type AnnouncementRecipient = typeof announcementRecipients.$inferSelect;
export type NewAnnouncementRecipient = typeof announcementRecipients.$inferInsert;

// Enums
export type AnnouncementPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type AnnouncementStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED" | "EXPIRED";
export type AnnouncementCategory = "SYSTEM" | "POLICY" | "EVENT" | "MAINTENANCE" | "GENERAL";
export type AnnouncementTargetType = "ALL" | "REGION" | "USER" | "ROLE";
export type UserAnnouncementStatus = "UNREAD" | "READ" | "ARCHIVED";