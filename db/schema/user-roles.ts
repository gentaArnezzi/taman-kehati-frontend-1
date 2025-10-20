import { pgTable, serial, text, timestamp, varchar, boolean } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const userRoles = pgTable("user_roles", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  role: varchar("role", { length: 50 }).notNull(), // 'super_admin', 'regional_admin'
  regionCode: varchar("region_code", { length: 10 }), // For regional admins
  permissions: text("permissions"), // JSON field for specific permissions
  isActive: boolean("is_active").default(true).notNull(),
  assignedBy: text("assigned_by").references(() => user.id),
  assignedAt: timestamp("assigned_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});