import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const fauna = pgTable("fauna", {
  id: serial("id").primaryKey(),
  scientificName: text("scientific_name").notNull(),
  localName: text("local_name").notNull(),
  family: text("family"),
  description: text("description"),
  conservationStatus: varchar("conservation_status", { length: 50 }).notNull(), // IUCN status
  region: text("region"),
  habitat: text("habitat"),
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