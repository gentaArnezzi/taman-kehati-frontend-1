import {
  pgTable,
  uuid,
  serial,
  text,
  timestamp,
  varchar,
  decimal,
  integer,
  boolean,
  json
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./auth";

// Keep legacy table for compatibility
export const taman = pgTable("taman", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  province: text("province").notNull(),
  area: text("area"), // area as text to support values like "122.956 ha"
  designation: varchar("designation", { length: 100 }), // UNESCO World Heritage, etc
  description: text("description"),
  type: varchar("type", { length: 50 }).notNull(), // Taman Nasional, Cagar Alam, etc
  location: text("location"), // geographical location
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  imageUrl: text("image_url"),
  status: varchar("status", { length: 20 }).default("published").notNull(), // draft, in_review, published, rejected
  submittedBy: text("submitted_by").references(() => user.id),
  submittedAt: timestamp("submitted_at"),
  approvedBy: text("approved_by").references(() => user.id),
  approvedAt: timestamp("approved_at"),
  rejectedBy: text("rejected_by").references(() => user.id),
  rejectedAt: timestamp("rejected_at"),
  rejectionReason: text("rejection_reason"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// New enhanced parks table with PostGIS support
export const parks = pgTable("parks", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: varchar("slug", { length: 255 }).unique(),
  officialName: varchar("official_name", { length: 255 }).notNull(),
  skNumber: varchar("sk_number", { length: 100 }), // Surat Keputusan
  managingAgency: varchar("managing_agency", { length: 255 }),
  province: varchar("province", { length: 100 }).notNull(),
  regency: varchar("regency", { length: 100 }),
  district: varchar("district", { length: 100 }),
  village: varchar("village", { length: 100 }),
  areaHa: decimal("area_ha", { precision: 12, scale: 2 }), // Area in hectares

  // Physical & Ecological
  physicalCondition: varchar("physical_condition", { length: 100 }),
  ecologicalValue: varchar("ecological_value", { length: 100 }),
  ecoregionType: varchar("ecoregion_type", { length: 100 }),

  // Documents
  history: text("history"),
  visionMission: text("vision_mission"),
  coreValues: text("core_values"),

  // Geospatial (PostGIS)
  // Note: geom will be added via migration as it requires PostGIS extension
  centroidLat: decimal("centroid_lat", { precision: 10, scale: 8 }),
  centroidLng: decimal("centroid_lng", { precision: 11, scale: 8 }),

  // Media
  featuredImage: varchar("featured_image", { length: 500 }),
  gallery: json("gallery").$type<Array<{
    id: string;
    url: string;
    caption: string;
    type: string;
  }>>().default([]),

  // Biodiversity Score (calculated)
  biodiversityScore: integer("biodiversity_score").default(0),

  // Content Counts
  totalFlora: integer("total_flora").default(0),
  totalFauna: integer("total_fauna").default(0),
  totalActivities: integer("total_activities").default(0),

  // Status & Workflow
  status: varchar("status", { length: 20 }).default("DRAFT"), // DRAFT, PENDING, APPROVED, REJECTED
  workflowStatus: varchar("workflow_status", { length: 20 }).default("DRAFT"),

  // Metadata
  isActive: boolean("is_active").default(true),
  isFeatured: boolean("is_featured").default(false),
  tags: text("tags").array(),

  // Audit & Tracking
  createdBy: text("created_by").references(() => user.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedBy: text("updated_by").references(() => user.id),
  updatedAt: timestamp("updated_at").defaultNow(),

  // Workflow timestamps
  submittedAt: timestamp("submitted_at"),
  submittedBy: text("submitted_by").references(() => user.id),
  reviewedAt: timestamp("reviewed_at"),
  reviewedBy: text("reviewed_by").references(() => user.id),
  approvedAt: timestamp("approved_at"),
  approvedBy: text("approved_by").references(() => user.id),
  rejectedAt: timestamp("rejected_at"),
  rejectedBy: text("rejected_by").references(() => user.id),
  rejectionReason: text("rejection_reason"),
});

// Relations
export const parksRelations = relations(parks, ({ one, many }) => ({
  createdByUser: one(user, {
    fields: [parks.createdBy],
    references: [user.id],
  }),
  updatedByUser: one(user, {
    fields: [parks.updatedBy],
    references: [user.id],
  }),
  submittedByUser: one(user, {
    fields: [parks.submittedBy],
    references: [user.id],
  }),
  reviewedByUser: one(user, {
    fields: [parks.reviewedBy],
    references: [user.id],
  }),
  approvedByUser: one(user, {
    fields: [parks.approvedBy],
    references: [user.id],
  }),
  rejectedByUser: one(user, {
    fields: [parks.rejectedBy],
    references: [user.id],
  }),
}));

// Types
export type Taman = typeof taman.$inferSelect;
export type NewTaman = typeof taman.$inferInsert;
export type Park = typeof parks.$inferSelect;
export type NewPark = typeof parks.$inferInsert;

// Enums
export type ParkStatus = "DRAFT" | "PENDING" | "APPROVED" | "REJECTED";
export type WorkflowStatus = "DRAFT" | "IN_REVIEW" | "APPROVED" | "REJECTED";