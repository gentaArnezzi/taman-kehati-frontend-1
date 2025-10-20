import {
  uuid,
  integer,
  pgTable,
  text,
  date,
  decimal,
  timestamp,
  json,
  varchar
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { parks } from "./taman";
import { user } from "./auth";

// Biodiversity Index Table
export const biodiversityIndex = pgTable("biodiversity_index", {
  id: uuid("id").primaryKey().defaultRandom(),
  parkId: uuid("park_id").references(() => parks.id, { onDelete: "cascade" }),
  regionId: uuid("region_id").references(() => parks.id, { onDelete: "set null" }),
  assessmentDate: date("assessment_date").notNull(),

  // Flora Metrics
  totalFloraSpecies: integer("total_flora_species").default(0),
  endemicFloraSpecies: integer("endemic_flora_species").default(0),
  threatenedFloraSpecies: integer("threatened_flora_species").default(0),
  floraDiversityScore: integer("flora_diversity_score").default(0), // 0-100

  // Fauna Metrics
  totalFaunaSpecies: integer("total_fauna_species").default(0),
  endemicFaunaSpecies: integer("endemic_fauna_species").default(0),
  threatenedFaunaSpecies: integer("threatened_fauna_species").default(0),
  faunaDiversityScore: integer("fauna_diversity_score").default(0), // 0-100

  // Ecosystem Metrics
  ecosystemTypes: text("ecosystem_types").array(),
  habitatQuality: integer("habitat_quality").default(0), // 0-100
  areaCoverage: decimal("area_coverage", { precision: 12, scale: 2 }), // hectares

  // Overall Index
  overallBiodiversityScore: integer("overall_biodiversity_score").default(0), // 0-100
  ranking: integer("ranking").default(0),

  // Metadata
  notes: text("notes"),
  updatedBy: text("updated_by").references(() => user.id),
  status: varchar("status", { length: 20 }).default("DRAFT"), // DRAFT, PENDING, APPROVED, REJECTED
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Biodiversity Trend Table
export const biodiversityTrend = pgTable("biodiversity_trend", {
  id: uuid("id").primaryKey().defaultRandom(),
  parkId: uuid("park_id").references(() => parks.id, { onDelete: "cascade" }),
  year: integer("year").notNull(),
  biodiversityScore: integer("biodiversity_score").default(0),
  floraScore: integer("flora_score").default(0),
  faunaScore: integer("fauna_score").default(0),
  ecosystemScore: integer("ecosystem_score").default(0),
  changeFromPreviousYear: integer("change_from_previous_year").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Biodiversity Comparison Table
export const biodiversityComparison = pgTable("biodiversity_comparison", {
  id: uuid("id").primaryKey().defaultRandom(),
  assessmentDate: date("assessment_date").notNull(),
  nationalAverage: decimal("national_average", { precision: 5, scale: 2 }),
  provincialAverage: decimal("provincial_average", { precision: 5, scale: 2 }),
  totalParks: integer("total_parks").default(0),
  topPerformers: json("top_performers").$type<Array<{
    parkId: string;
    parkName: string;
    score: number;
  }>>(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const biodiversityIndexRelations = relations(biodiversityIndex, ({ one }) => ({
  park: one(parks, {
    fields: [biodiversityIndex.parkId],
    references: [parks.id],
  }),
  region: one(parks, {
    fields: [biodiversityIndex.regionId],
    references: [parks.id],
  }),
  updatedByUser: one(user, {
    fields: [biodiversityIndex.updatedBy],
    references: [user.id],
  }),
}));

export const biodiversityTrendRelations = relations(biodiversityTrend, ({ one }) => ({
  park: one(parks, {
    fields: [biodiversityTrend.parkId],
    references: [parks.id],
  }),
}));

// Types
export type BiodiversityIndex = typeof biodiversityIndex.$inferSelect;
export type NewBiodiversityIndex = typeof biodiversityIndex.$inferInsert;
export type BiodiversityTrend = typeof biodiversityTrend.$inferSelect;
export type NewBiodiversityTrend = typeof biodiversityTrend.$inferInsert;
export type BiodiversityComparison = typeof biodiversityComparison.$inferSelect;
export type NewBiodiversityComparison = typeof biodiversityComparison.$inferInsert;