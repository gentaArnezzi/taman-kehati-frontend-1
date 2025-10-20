CREATE TABLE "announcement_attachments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"announcement_id" uuid NOT NULL,
	"file_name" varchar(255) NOT NULL,
	"original_name" varchar(255) NOT NULL,
	"mime_type" varchar(100) NOT NULL,
	"file_size" integer NOT NULL,
	"url" varchar(500) NOT NULL,
	"uploaded_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "announcement_recipients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"announcement_id" uuid NOT NULL,
	"user_id" uuid,
	"region_id" uuid,
	"role" varchar(20),
	"delivered_at" timestamp,
	"read_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "announcement_status" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"announcement_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"status" varchar(20) DEFAULT 'UNREAD',
	"read_at" timestamp,
	"archived_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "announcements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"summary" varchar(500),
	"target_type" varchar(20) NOT NULL,
	"target_ref" varchar(255),
	"created_by" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_by" uuid,
	"updated_at" timestamp,
	"published_at" timestamp,
	"expires_at" timestamp,
	"priority" varchar(20) DEFAULT 'MEDIUM',
	"status" varchar(20) DEFAULT 'DRAFT',
	"category" varchar(20) DEFAULT 'GENERAL',
	"tags" text[],
	"attachments" json DEFAULT '[]'::json,
	"total_recipients" integer DEFAULT 0,
	"read_count" integer DEFAULT 0,
	"archived_count" integer DEFAULT 0,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "article_comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"article_id" uuid NOT NULL,
	"author_name" varchar(255) NOT NULL,
	"author_email" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"status" varchar(20) DEFAULT 'PENDING',
	"parent_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "article_likes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"article_id" uuid NOT NULL,
	"user_id" uuid,
	"ip_address" varchar(45),
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "article_shares" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"article_id" uuid NOT NULL,
	"platform" varchar(50) NOT NULL,
	"url" varchar(500),
	"ip_address" varchar(45),
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "article_views" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"article_id" uuid NOT NULL,
	"user_id" uuid,
	"ip_address" varchar(45),
	"user_agent" text,
	"referrer" text,
	"viewed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "articles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(500) NOT NULL,
	"slug" varchar(500) NOT NULL,
	"content" text NOT NULL,
	"summary" varchar(1000),
	"featured_image" varchar(500),
	"author_id" uuid NOT NULL,
	"author_name" varchar(255) NOT NULL,
	"author_role" varchar(20) NOT NULL,
	"author_region_id" uuid,
	"category" varchar(20) DEFAULT 'NEWS' NOT NULL,
	"tags" text[],
	"topics" text[],
	"park_id" uuid,
	"meta_title" varchar(60),
	"meta_description" varchar(160),
	"meta_keywords" text[],
	"reading_time" integer DEFAULT 0,
	"status" varchar(20) DEFAULT 'DRAFT',
	"published_at" timestamp,
	"scheduled_at" timestamp,
	"view_count" integer DEFAULT 0,
	"like_count" integer DEFAULT 0,
	"share_count" integer DEFAULT 0,
	"comment_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"last_read_at" timestamp,
	"is_featured" boolean DEFAULT false,
	"is_breaking" boolean DEFAULT false,
	"is_sponsored" boolean DEFAULT false,
	CONSTRAINT "articles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "audit_log_summary" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"summary_date" timestamp NOT NULL,
	"total_logs" json,
	"actions_by_type" json,
	"entities_by_type" json,
	"actors_by_activity" json,
	"timeline_data" json,
	"critical_events" json,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "audit_log_summary_summary_date_unique" UNIQUE("summary_date")
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_id" uuid NOT NULL,
	"actor_name" varchar(255) NOT NULL,
	"actor_role" varchar(20) NOT NULL,
	"actor_region_id" uuid,
	"action" varchar(50) NOT NULL,
	"entity" varchar(50) NOT NULL,
	"entity_id" uuid NOT NULL,
	"entity_name" varchar(255),
	"old_values" json,
	"new_values" json,
	"changes" json,
	"ip_address" varchar(45) NOT NULL,
	"user_agent" text,
	"session_id" varchar(255),
	"request_id" varchar(255),
	"occurred_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"description" text,
	"category" varchar(20) DEFAULT 'DATA_CHANGE',
	"severity" varchar(20) DEFAULT 'MEDIUM'
);
--> statement-breakpoint
CREATE TABLE "biodiversity_comparison" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"assessment_date" date NOT NULL,
	"national_average" numeric(5, 2),
	"provincial_average" numeric(5, 2),
	"total_parks" integer DEFAULT 0,
	"top_performers" json,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "biodiversity_index" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"park_id" uuid,
	"region_id" uuid,
	"assessment_date" date NOT NULL,
	"total_flora_species" integer DEFAULT 0,
	"endemic_flora_species" integer DEFAULT 0,
	"threatened_flora_species" integer DEFAULT 0,
	"flora_diversity_score" integer DEFAULT 0,
	"total_fauna_species" integer DEFAULT 0,
	"endemic_fauna_species" integer DEFAULT 0,
	"threatened_fauna_species" integer DEFAULT 0,
	"fauna_diversity_score" integer DEFAULT 0,
	"ecosystem_types" text[],
	"habitat_quality" integer DEFAULT 0,
	"area_coverage" numeric(12, 2),
	"overall_biodiversity_score" integer DEFAULT 0,
	"ranking" integer DEFAULT 0,
	"notes" text,
	"updated_by" uuid,
	"status" varchar(20) DEFAULT 'DRAFT',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "biodiversity_trend" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"park_id" uuid,
	"year" integer NOT NULL,
	"biodiversity_score" integer DEFAULT 0,
	"flora_score" integer DEFAULT 0,
	"fauna_score" integer DEFAULT 0,
	"ecosystem_score" integer DEFAULT 0,
	"change_from_previous_year" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "parks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(255),
	"official_name" varchar(255) NOT NULL,
	"sk_number" varchar(100),
	"managing_agency" varchar(255),
	"province" varchar(100) NOT NULL,
	"regency" varchar(100),
	"district" varchar(100),
	"village" varchar(100),
	"area_ha" numeric(12, 2),
	"physical_condition" varchar(100),
	"ecological_value" varchar(100),
	"ecoregion_type" varchar(100),
	"history" text,
	"vision_mission" text,
	"core_values" text,
	"centroid_lat" numeric(10, 8),
	"centroid_lng" numeric(11, 8),
	"featured_image" varchar(500),
	"gallery" json DEFAULT '[]'::json,
	"biodiversity_score" integer DEFAULT 0,
	"total_flora" integer DEFAULT 0,
	"total_fauna" integer DEFAULT 0,
	"total_activities" integer DEFAULT 0,
	"status" varchar(20) DEFAULT 'DRAFT',
	"workflow_status" varchar(20) DEFAULT 'DRAFT',
	"is_active" boolean DEFAULT true,
	"is_featured" boolean DEFAULT false,
	"tags" text[],
	"created_by" uuid,
	"created_at" timestamp DEFAULT now(),
	"updated_by" uuid,
	"updated_at" timestamp DEFAULT now(),
	"submitted_at" timestamp,
	"submitted_by" uuid,
	"reviewed_at" timestamp,
	"reviewed_by" uuid,
	"approved_at" timestamp,
	"approved_by" uuid,
	"rejected_at" timestamp,
	"rejected_by" uuid,
	"rejection_reason" text,
	CONSTRAINT "parks_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "berita" ALTER COLUMN "submitted_by" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "berita" ALTER COLUMN "approved_by" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "berita" ALTER COLUMN "rejected_by" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "fauna" ALTER COLUMN "submitted_by" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "fauna" ALTER COLUMN "approved_by" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "fauna" ALTER COLUMN "rejected_by" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "flora" ALTER COLUMN "submitted_by" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "flora" ALTER COLUMN "approved_by" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "flora" ALTER COLUMN "rejected_by" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "taman" ALTER COLUMN "submitted_by" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "taman" ALTER COLUMN "approved_by" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "taman" ALTER COLUMN "rejected_by" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "user_roles" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "user_roles" ALTER COLUMN "assigned_by" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "announcement_attachments" ADD CONSTRAINT "announcement_attachments_announcement_id_announcements_id_fk" FOREIGN KEY ("announcement_id") REFERENCES "public"."announcements"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "announcement_recipients" ADD CONSTRAINT "announcement_recipients_announcement_id_announcements_id_fk" FOREIGN KEY ("announcement_id") REFERENCES "public"."announcements"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "announcement_recipients" ADD CONSTRAINT "announcement_recipients_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "announcement_status" ADD CONSTRAINT "announcement_status_announcement_id_announcements_id_fk" FOREIGN KEY ("announcement_id") REFERENCES "public"."announcements"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "announcement_status" ADD CONSTRAINT "announcement_status_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_updated_by_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_comments" ADD CONSTRAINT "article_comments_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_comments" ADD CONSTRAINT "article_comments_parent_id_article_comments_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."article_comments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_likes" ADD CONSTRAINT "article_likes_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_likes" ADD CONSTRAINT "article_likes_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_shares" ADD CONSTRAINT "article_shares_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_views" ADD CONSTRAINT "article_views_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_views" ADD CONSTRAINT "article_views_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "articles" ADD CONSTRAINT "articles_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "articles" ADD CONSTRAINT "articles_author_region_id_parks_id_fk" FOREIGN KEY ("author_region_id") REFERENCES "public"."parks"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "articles" ADD CONSTRAINT "articles_park_id_parks_id_fk" FOREIGN KEY ("park_id") REFERENCES "public"."parks"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_id_user_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "biodiversity_index" ADD CONSTRAINT "biodiversity_index_park_id_parks_id_fk" FOREIGN KEY ("park_id") REFERENCES "public"."parks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "biodiversity_index" ADD CONSTRAINT "biodiversity_index_region_id_parks_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."parks"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "biodiversity_index" ADD CONSTRAINT "biodiversity_index_updated_by_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "biodiversity_trend" ADD CONSTRAINT "biodiversity_trend_park_id_parks_id_fk" FOREIGN KEY ("park_id") REFERENCES "public"."parks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parks" ADD CONSTRAINT "parks_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parks" ADD CONSTRAINT "parks_updated_by_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parks" ADD CONSTRAINT "parks_submitted_by_user_id_fk" FOREIGN KEY ("submitted_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parks" ADD CONSTRAINT "parks_reviewed_by_user_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parks" ADD CONSTRAINT "parks_approved_by_user_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parks" ADD CONSTRAINT "parks_rejected_by_user_id_fk" FOREIGN KEY ("rejected_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;