PRD — Indonesia Biodiversity Park (Taman Kehati) Information System


Tech: Next.js (App Router), Drizzle ORM, PostgreSQL (+ PostGIS)
Date: October 20, 2025
Product Owners: KLH (Super Admin) • Park Managers (Regional Admin)

1) Executive Summary

A national web platform to integrate and present data for all Biodiversity Parks (Taman Kehati) across Indonesia—covering park profiles, flora, fauna, activities, articles, media, and a biodiversity index—operating through the workflow input → review → publish. There are two admin roles: Super Admin (KLH) and Regional Admin (Park Managers). Public users access an interactive map and information pages.


MVP Goals (Phase 1):
   •   Admin panel for Super Admin & Regional Admin with RBAC.
   •   Approval workflow from Regional → Super.
   •   Public pages: Home, Interactive Map, Park List, Flora, Articles, Details.
   •   Core data structures in PostgreSQL (enable PostGIS).
   •   Announcements created by Super Admin for all Regional Admins.
   •   Audit log & change history.


Phase 2+:
   •   Biodiversity Index (per region/park).
   •   AI Chatbot (RAG) for Q&A on park and article data.
   •   Advanced statistics & national dashboards.


2) Goals & KPIs
   •   Data completeness: ≥ 80% of parks have minimum profiles (name, location, area) within 3 months.
   •   Approval cycle time: median < 3 days.
   •   Data quality: < 5% entries rejected due to validation failures.
   •   Performance: TTI < 3 s (on 4G), Core Web Vitals green.
   •   Adoption: ≥ 70% Regional Admins actively input data within 60 days.


3) Personas & Roles
   •   Super Admin (KLH): manage users & roles, review/approve nationwide data, create announcements, monitor data quality & system health.
   •   Regional Admin (Park Manager): input/update data for their park(s) (park profile, flora, fauna, activities, media, articles), submit for review.
   •   Public Visitor: browse the map & park list, read articles, explore flora/fauna, view the Biodiversity Index (when available).


4) Scope (MVP)


In-Scope
   •   Authentication & RBAC (Super vs Regional).
   •   CRUD for core entities: Parks, Flora, Fauna, Activities, Articles, Media.
   •   Workflow statuses: DRAFT → IN_REVIEW → APPROVED/REJECTED.
   •   Announcements from Super Admin (+ read receipt).
   •   Interactive map (clustering, province filter).
   •   Audit log & status history.
   •   Data validation & media attachments.


Out-of-Scope (Phase 2+)
   •   Automatically computed Biodiversity Index (start with manual/placeholder input).
   •   RAG chatbot (internal knowledge + documents).
   •   Advanced taxonomy management (authority, synonymy).
   •   Native mobile apps.


5) Information Architecture & Navigation


5.1 Public
   •   / Home (hero + quick stats + highlighted parks/articles)
   •   /map Interactive Map of Indonesia (provinces, filters & clustering)
   •   /taman Park List → /taman/[slug] Park Details (profile, map, gallery, related flora/fauna/articles)
   •   /flora Flora List → /flora/[id] Flora Details
   •   /fauna Fauna List → /fauna/[id] Fauna Details
   •   /artikel Articles → /artikel/[slug] Article Details
   •   /indeks Biodiversity Index (Phase 2; placeholder + methodology docs for MVP)


5.2 Admin (App Shell)
   •   /admin (redirect by role)


Super Admin
   •   Dashboard: national KPIs, pending approvals, mini-map, activity feed, system health, announcements.
   •   Users & Roles: manage Regional accounts.
   •   Approvals: cross-module review queue.
   •   Announcements: create/manage announcements.
   •   Content (all parks): Parks, Flora, Fauna, Activities, Articles, Media.
   •   Logs: audit trail & data quality.
   •   Settings: metadata, basic taxonomy, validation parameters.


Regional Admin
   •   Dashboard: regional KPIs, pending by module, KLH announcements.
   •   Park Profile: create/manage park (zone/geometry).
   •   Flora/Fauna/Activities/Articles/Media: scoped to own park(s).
   •   Submit for Review & handle revision cycles.


6) RBAC & Permissions (Summary)


Entity  Regional Admin  Super Admin
Parks   CRUD within own region; submit for review   CRUD all; approve/reject
Flora/Fauna CRUD within own region; submit for review   CRUD all; approve/reject
Activities  CRUD within own region; submit for review   CRUD all; approve/reject
Articles    CRUD within own region; submit for review   CRUD all; approve/reject
Media   Upload/manage attachments (own region)  Manage all media
Users/Roles —   CRUD users, assign roles
Announcements   Read    Create, edit, send, archive
Logs/Settings   Optional regional read  Full access


7) Functional Requirements (FR)


FR-1 Authentication & Session
   •   Email+password login (optional SSO in Phase 2).
   •   Password reset, MFA (optional).
   •   Server-side session (Next.js) + token rotation.


FR-2 CRUD & Data Validation
   •   Park Profile: Official Name*, Decree (SK), Managing Agency, Location (province/regency/district/village), Area (ha), Physical Condition, Ecological Value, Ecoregion Type, Geometry (MultiPolygon), Centroid (Point).
   •   Park Documents: History, Vision & Mission, Core Values.
   •   Flora: Scientific Name*, Local Name, Family, Genus, Morphology, Benefits/Uses.
   •   Fauna: Scientific Name*, Common Name, Order, Description, Habitat/Food, Pest Status (enum).
   •   Activities: Title*, Description, Date, Location (point/area).
   •   Articles: Title*, Unique Slug, Content (rich text), Tags, Status.
   •   Media: Kind (Leaf/Stem/Flower/Fruit/Fauna/Activity), Description, URL/File*.
   •   Fields marked * are required; validate format & constraints.


FR-3 Approval Workflow
   •   Statuses: DRAFT | IN_REVIEW | APPROVED | REJECTED.
   •   Regional can Submit for Review.
   •   Super sees pending queue, diffs/changes summary, actions Approve/Reject with notes.
   •   In-app notifications (optional email).


FR-4 Announcements
   •   Super creates announcement (title, content, target: all/region/user).
   •   Regional sees on dashboard, can mark as read, archive, and search.


FR-5 Public Interactive Map
   •   Render park boundaries (PostGIS → GeoJSON).
   •   Cluster by centroid points, filter by province, search by park name.
   •   Click feature → popover + deep link to details.


FR-6 Search & Filters
   •   PostgreSQL full-text search (tsvector) for parks, flora, fauna, articles.
   •   Filters by province, publication status, category.


FR-7 Audit & Data Quality
   •   Audit log (actor, action, entity, id, timestamp, before/after summary).
   •   Basic health checks (DB, storage); summarized on Super Admin dashboard.


FR-8 Public Access & SEO
   •   SSR/SSG for primary public pages.
   •   Meta tags, sitemap, OpenGraph, basic structured data.


8) Non-Functional Requirements (NFR)
   •   Security: CSRF, XSS protection, API rate limiting, modern password hashing, least-privilege, sanitized file uploads.
   •   Performance: P95 API response < 500 ms; public pages LCP < 2.5 s.
   •   Reliability: Daily DB backups; migrations managed via Drizzle.
   •   Accessibility: WCAG 2.1 AA baseline.
   •   I18n: Indonesian as default, en-US optional (Phase 2).
   •   Observability: request logging, error tracking, audit logging.



9) Technical Design


9.1 Architecture
   •   Next.js App Router: server actions for secure mutations; API routes for public/geo endpoints.
   •   Drizzle ORM: schema-first with migrations.
   •   PostgreSQL: enable PostGIS (geometry) and pg_trgm/tsvector for search.
   •   Media Storage: S3-compatible (Supabase Storage / MinIO).
   •   Maps: Leaflet/MapLibre + OSM/paid tiles; GeoJSON from API.
   •   Caching: response caching & SWR; optional Redis (Phase 2) for geo cache.


9.2 Suggested Directory Structure


apps/web/
 app/
   (public)/
     page.tsx                # Home
     map/page.tsx
     taman/[slug]/page.tsx
     flora/[id]/page.tsx
     fauna/[id]/page.tsx
     artikel/[slug]/page.tsx
     indeks/page.tsx
   admin/
     layout.tsx              # Admin app shell
     page.tsx                # redirect -> /admin/super or /admin/regional
     super/
       dashboard/page.tsx
       approvals/page.tsx
       announcements/page.tsx
       users/page.tsx
       content/{taman,flora,fauna,kegiatan,artikel,media}/page.tsx
       logs/page.tsx
       settings/page.tsx
     regional/
       dashboard/page.tsx
       taman/page.tsx
       flora/page.tsx
       fauna/page.tsx
       kegiatan/page.tsx
       artikel/page.tsx
       media/page.tsx
   api/
     geo/taman/route.ts      # GeoJSON provider
     search/route.ts
 db/
   schema.ts                 # Drizzle schemas
   migrations/
 lib/
   auth.ts                   # auth & RBAC guards
   rbac.ts
   validation.ts
   upload.ts
   geo.ts
 components/
   ui/*                      # shadcn/ui or custom components
   map/*                     # map widgets
   charts/*                  # charts overview


9.3 Core Data Schema (concise)


Align SQL types with Drizzle; add created_at, updated_at, created_by, status to content entities.


   •   users: id (uuid), email (unique), name, role (SUPER|REGIONAL), region_id (nullable), last_login.
   •   announcements: id, title, content, target (ALL|REGION|USER), target_ref (nullable), published_at.
   •   parks (taman): id, slug, name, sk_number, manager_agency, province, regency, district, village, area_ha (numeric), physical_condition, ecological_value, ecoregion_type, history, vision_mission, core_values, geom (MultiPolygon), centroid (Point), status.
   •   flora: id, park_id, scientific_name, local_name, family, genus, morphology, benefits, status.
   •   fauna: id, park_id, scientific_name, common_name, order, description, habitat_food, pest_status (enum), status.
   •   activities (kegiatan): id, park_id, title, description, start_date, location_text, geom (Point/Polygon), status.
   •   articles: id, park_id (nullable for national), title, slug, content, tags[], status, published_at.
   •   media: id, park_id (nullable), ref_type (FLORA|FAUNA|PARK|ACTIVITY|ARTICLE|OTHER), ref_id, kind (DAUN|BATANG|BUNGA|BUAH|FAUNA|KEGIATAN), caption, url, status.
   •   approvals: id, entity (PARK|FLORA|FAUNA|ACTIVITY|ARTICLE|MEDIA), entity_id, submitted_by, reviewer_id, status, notes.
   •   audit_logs: id, actor_id, action, entity, entity_id, meta (jsonb), occurred_at.


Notes: enable extensions postgis, pg_trgm, and uuid-ossp (if needed).


9.4 Validation & Integrity
   •   Foreign key constraints (e.g., park_id required for related flora/fauna/activity/media).
   •   Uniqueness: parks.slug, articles.slug, users.email.
   •   Enums: pest_status, content status.
   •   Trigger to update updated_at.
   •   Optional soft delete (Phase 2).



10) Key Flows


10.1 Input & Approval
   1.  Regional creates/edits entry (DRAFT).
   2.  Click Submit for Review → status IN_REVIEW.
   3.  Super reviews: Approve (becomes APPROVED, visible publicly) or Reject (back to REJECTED with notes).
   4.  Every action is recorded in the audit log.


10.2 Announcements
   •   Super writes & publishes; Regional sees on dashboard → marks as read.


10.3 Public Map
   •   API serves GeoJSON for parks (only APPROVED).
   •   Frontend renders map with clustering, province filters, feature popovers, deep links.



11) UI/UX (MVP)


Super Admin Dashboard
   •   KPI cards: total parks, flora, fauna, % approved, new entries (last 30 days).
   •   Time trend: submissions vs approvals.
   •   Mini national map (choropleth by province: #approved parks).
   •   Pending approvals (table by module).
   •   Announcement composer + list.
   •   Activity feed & system health (db up, storage ok, migrations).


Regional Admin Dashboard
   •   Regional KPIs: entry counts by module.
   •   Latest announcements (unread badge).
   •   Draft & Pending lists.
   •   Quick actions: “Create Park”, “Add Flora”, etc.


Public
   •   Home: hero, global search, highlight cards (parks/articles).
   •   List pages with filters/search; detail pages with breadcrumbs, tabbed content, gallery.


12) Analytics & Logging
   •   Page analytics (public & admin pages).
   •   Search analytics (popular queries).
   •   Error monitoring & admin audit log.


13) Release Plan & Milestones


MVP (4–6 effective weeks)
   1.  Foundation: auth + RBAC, DB schema, migrations, PostGIS, uploads.
   2.  Regional Admin: CRUD + submit for review.
   3.  Super Admin: approvals, announcements, basic user management.
   4.  Public: Home, Map, Park list/detail, Article list/detail.
   5.  Audit log, validations, basic SEO, accessibility baseline.


Phase 2
   •   Biodiversity Index (data model, manual input, visualizations).
   •   RAG chatbot (ingest articles+profiles, Q&A), pgvector.
   •   Advanced taxonomy, national statistics, cache/Redis.


14) Risks & Mitigations
   •   Geospatial complexity → start with centroid & simple boundaries; test tile/GeoJSON performance per province.
   •   Data quality → form validation, enums, helper tooltips, pre-submit preview.
   •   Media scalability → S3-compatible storage + CDN.
   •   Security → RBAC audit, least-privilege in server actions/API routes.


15) Acceptance Criteria (UAT, MVP)
   •   Regional can create a Park with geometry & submit for review.
   •   Super can see Approval queue and approve/reject with notes.
   •   Super can create Announcements & they appear on Regional dashboards (with read status).
   •   Public can use the interactive map and open details of approved parks.
   •   Audit log records create/update/submit/approve/reject with sufficient detail.
   •   Build passes baseline accessibility (keyboard navigation) & SEO meta checks.


16) Appendix — Statuses & Enums
   •   content_status: DRAFT | IN_REVIEW | APPROVED | REJECTED
   •   pest_status: BUKAN_HAMA | HAMA_RINGAN | HAMA_SEDANG | HAMA_BERAT
   •   media.kind: DAUN | BATANG | BUNGA | BUAH | FAUNA | KEGIATAN
   •   role: SUPER | REGIONAL


17) Implementation Notes
   •   Use Drizzle for schema & migrations; seed minimal users (1 Super, 1 Regional sample).
   •   Add Zod for form validation, shadcn/ui for components, Leaflet/MapLibre for maps.
   •   Geo API: constrain payloads (bbox/province filters) for performance.
   •   Enforce CSP & sanitize rich text (articles) to prevent XSS.