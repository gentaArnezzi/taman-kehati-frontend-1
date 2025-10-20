import {
  uuid,
  pgTable,
  text,
  timestamp,
  varchar,
  json
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./auth";

// Audit Logs Table
export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  actorId: text("actor_id").references(() => user.id, { onDelete: "set null" }).notNull(),
  actorName: varchar("actor_name", { length: 255 }).notNull(),
  actorRole: varchar("actor_role", { length: 20 }).notNull(), // SUPER_ADMIN, REGIONAL_ADMIN
  actorRegionId: uuid("actor_region_id"),

  // Action Details
  action: varchar("action", { length: 50 }).notNull(), // CREATE, READ, UPDATE, DELETE, LOGIN, APPROVE, etc.
  entity: varchar("entity", { length: 50 }).notNull(), // USER, PARK, FLORA, FAUNA, etc.
  entityId: uuid("entity_id").notNull(),
  entityName: varchar("entity_name", { length: 255 }), // Human-readable name for display

  // Change Details
  oldValues: json("old_values"),
  newValues: json("new_values"),
  changes: json("changes").$type<Array<{
    field: string;
    oldValue: any;
    newValue: any;
    fieldType: string;
    changeType: string;
  }>>(),

  // Metadata
  ipAddress: varchar("ip_address", { length: 45 }).notNull(), // Support IPv6
  userAgent: text("user_agent"),
  sessionId: varchar("session_id", { length: 255 }),
  requestId: varchar("request_id", { length: 255 }),

  // Timestamps
  occurredAt: timestamp("occurred_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),

  // Additional Context
  description: text("description"),
  category: varchar("category", { length: 20 }).default("DATA_CHANGE"), // SECURITY, DATA_CHANGE, WORKFLOW, SYSTEM, ACCESS
  severity: varchar("severity", { length: 20 }).default("MEDIUM"), // LOW, MEDIUM, HIGH, CRITICAL
});

// Audit Log Summary Cache (for performance)
export const auditLogSummary = pgTable("audit_log_summary", {
  id: uuid("id").primaryKey().defaultRandom(),
  summaryDate: timestamp("summary_date").notNull().unique(),
  totalLogs: json("total_logs").$type<number>(),
  actionsByType: json("actions_by_type").$type<Record<string, number>>(),
  entitiesByType: json("entities_by_type").$type<Record<string, number>>(),
  actorsByActivity: json("actors_by_activity").$type<Array<{
    actorId: string;
    actorName: string;
    actionCount: number;
  }>>(),
  timelineData: json("timeline_data").$type<Array<{
    date: string;
    count: number;
  }>>(),
  criticalEvents: json("critical_events").$type<Array<{
    id: string;
    actorName: string;
    action: string;
    entity: string;
    description: string;
    occurredAt: Date;
    severity: string;
  }>>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  actor: one(user, {
    fields: [auditLogs.actorId],
    references: [user.id],
  }),
}));

// Types
export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;
export type AuditLogSummary = typeof auditLogSummary.$inferSelect;
export type NewAuditLogSummary = typeof auditLogSummary.$inferInsert;

// Enums
export type AuditAction =
  | "CREATE" | "READ" | "UPDATE" | "DELETE"
  | "BULK_CREATE" | "BULK_UPDATE" | "BULK_DELETE"
  | "LOGIN" | "LOGOUT" | "LOGIN_FAILED" | "PASSWORD_CHANGE" | "PROFILE_UPDATE"
  | "APPROVE" | "REJECT" | "SUBMIT_FOR_REVIEW" | "WITHDRAW"
  | "EXPORT" | "IMPORT" | "BACKUP" | "RESTORE"
  | "ARCHIVE" | "UNARCHIVE" | "PUBLISH" | "UNPUBLISH"
  | "ASSIGN_ROLE" | "REMOVE_ROLE" | "CHANGE_PERMISSIONS";

export type AuditEntity =
  | "USER" | "PARK" | "FLORA" | "FAUNA" | "ACTIVITY" | "ARTICLE" | "MEDIA"
  | "ANNOUNCEMENT" | "BIODIVERSITY_INDEX" | "ROLE" | "PERMISSION"
  | "SYSTEM_CONFIG" | "AUDIT_LOG" | "BACKUP";

export type AuditCategory = "SECURITY" | "DATA_CHANGE" | "WORKFLOW" | "SYSTEM" | "ACCESS";
export type AuditSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

// Change Detail Interface
export interface ChangeDetail {
  field: string;
  oldValue: any;
  newValue: any;
  fieldType: "string" | "number" | "date" | "boolean" | "json" | "array";
  changeType: "CREATE" | "UPDATE" | "DELETE" | "STATUS_CHANGE";
}