# Backend Structure Document for Taman Kehati Platform

This document outlines the backend architecture, database setup, API design, hosting, infrastructure, and security measures for the Taman Kehati project. It is written in everyday language so anyone can understand how the backend works and how it supports the application.

## 1. Backend Architecture

### Overall Design
- We use Next.js API Routes to handle all backend logic. Each folder under `/pages/api` (or `/app/api`) maps directly to a REST endpoint.  
- We organize code in layers:  
  • **Routes** receive HTTP requests and forward them to  
  • **Controllers** (or handlers) that apply business logic and call  
  • **Services** which encapsulate database operations via  
  • **Data Models** (Drizzle ORM).  
- This simple MVC‐style separation keeps the code organized and easy to maintain.

### Frameworks and Patterns
- Next.js (Node.js runtime) for serverless API functions.  
- Drizzle ORM to map JavaScript/TypeScript objects to Postgres tables.  
- Repository pattern in services to isolate data access from business logic.
- Environment variables (`.env`) store secrets (database URL, JWT secret).

### Scalability, Maintainability, Performance
- **Scalability**: Serverless functions auto‐scale with traffic on Vercel (or similar).  
- **Maintainability**: Modular file layout eases onboarding new developers.  
- **Performance**: Lightweight, stateless API routes, connection pooling, and selective caching deliver fast responses.

## 2. Database Management

### Technology
- PostgreSQL (SQL relational database).  
- Managed service (e.g., Supabase, AWS RDS, or Neon) ensures backups, high availability, and automatic updates.
- Connection pooling via PgBouncer or the built-in pool in `node-postgres`.

### Data Handling Practices
- **Migrations**: Drizzle’s migration tool tracks schema changes in versioned SQL files.  
- **ORM Schema Definitions**: Tables and columns defined in code (`db/schema/*.ts`).  
- **Access Patterns**: Services use parameterized queries through Drizzle to prevent SQL injection.  
- **Backups**: Daily automated snapshots with a 7‐day retention policy.

## 3. Database Schema

### Human-Readable Overview
- **Users**: Stores admin credentials, role, and optional region code.  
- **Flora**, **Fauna**, **Berita**: Separate tables for each content type. Each record has a workflow status (draft, pending, approved, rejected) and metadata (title, description, timestamps).  
- **Roles**: Enum within Users (SUPER_ADMIN, REGIONAL_ADMIN).  
- **Regions**: Optional code linked to Users and content items for regional filtering.  
- **ChatMessages**: Logs public chat interactions (user query, AI response, timestamp).

### SQL Schema (PostgreSQL)
```sql
-- Users table with role‐based access
CREATE TABLE users (
  id              SERIAL PRIMARY KEY,
  email           VARCHAR(255) UNIQUE NOT NULL,
  password_hash   TEXT NOT NULL,
  role            VARCHAR(20) NOT NULL CHECK (role IN ('SUPER_ADMIN','REGIONAL_ADMIN')),
  region_code     VARCHAR(10),
  created_at      TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at      TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Flora content table
CREATE TABLE flora (
  id              SERIAL PRIMARY KEY,
  name            TEXT NOT NULL,
  scientific_name TEXT,
  description     TEXT,
  workflow_status VARCHAR(20) NOT NULL CHECK (workflow_status IN ('DRAFT','PENDING','APPROVED','REJECTED')),
  region_code     VARCHAR(10),
  created_by      INT REFERENCES users(id),
  created_at      TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at      TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Fauna content table (similar structure)
CREATE TABLE fauna (
  id              SERIAL PRIMARY KEY,
  name            TEXT NOT NULL,
  scientific_name TEXT,
  description     TEXT,
  workflow_status VARCHAR(20) NOT NULL,
  region_code     VARCHAR(10),
  created_by      INT REFERENCES users(id),
  created_at      TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at      TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Berita (news) content table
CREATE TABLE berita (
  id              SERIAL PRIMARY KEY,
  title           TEXT NOT NULL,
  body            TEXT NOT NULL,
  workflow_status VARCHAR(20) NOT NULL,
  region_code     VARCHAR(10),
  created_by      INT REFERENCES users(id),
  published_at    TIMESTAMP WITH TIME ZONE,
  created_at      TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at      TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Public chat messages log
CREATE TABLE chat_messages (
  id              SERIAL PRIMARY KEY,
  user_query      TEXT NOT NULL,
  ai_response     TEXT NOT NULL,
  created_at      TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

## 4. API Design and Endpoints

We follow a RESTful approach under `/api`:

- **Authentication**  
  • POST `/api/auth/login` – Log in and issue JWT token.  
  • POST `/api/auth/logout` – Invalidate session.  
  • GET `/api/auth/me` – Fetch current user’s profile and role.

- **Flora Management**  
  • GET `/api/flora` – List flora with filters (status, search, pagination).  
  • POST `/api/flora` – Create new flora item (admin only).  
  • GET `/api/flora/{id}` – Fetch a single item.  
  • PUT `/api/flora/{id}` – Update item (admin only).  
  • DELETE `/api/flora/{id}` – Remove item (admin only).

- **Fauna & Berita**  
  • Same pattern as Flora under `/api/fauna` and `/api/berita`.

- **Chatbot**  
  • POST `/api/public/chat` – Accept user message, forward to AI service, store and return response.

- **Middleware & Guards**  
  • Protect admin routes with JWT validation.  
  • Role‐based checks in Next.js middleware to restrict SUPER vs. REGIONAL admins.

## 5. Hosting Solutions

### Application Hosting
- **Vercel** is our primary host for Next.js frontend and API Routes.  
  • Auto-deploy on Git pushes.  
  • Global CDN for static assets and serverless function distribution.

### Database Hosting
- Managed PostgreSQL via **Supabase** (or AWS RDS/Neon).  
  • Automated backups, scaling, and high availability.  
  • Secure network access (VPC/private).  

### Benefits
- **Reliability**: SLA-backed services.  
- **Scalability**: Auto-scale functions and database replicas.  
- **Cost-effectiveness**: Pay-as-you-go with generous free tiers for testing phases.

## 6. Infrastructure Components

- **Load Balancer**: Implicitly provided by Vercel – directs traffic to the nearest edge location.  
- **CDN**: Vercel’s edge network caches static assets and pre-renders pages worldwide.  
- **Caching**:  
  • **In-memory cache** (Node.js) or **Redis** for heavy read operations (e.g., statistics endpoints).  
  • HTTP-level caching headers (Cache-Control) for public pages and API GET routes.
- **CI/CD**: GitHub Actions (or Vercel’s built-in pipeline) runs linting, tests, and deploys on merge to main.

## 7. Security Measures

- **Authentication**: JWT stored in HttpOnly cookies to prevent XSS.  
- **Authorization**: Role checks in middleware; APIs return 403 if unauthorized.  
- **Data Encryption**:  
  • SSL/TLS for all traffic (HTTPS everywhere).  
  • Encryption at rest for the database (managed by host).  
- **OWASP Best Practices**:  
  • Input validation & sanitization.  
  • Rate limiting on login and chat endpoints.  
  • Secret management via environment variables in Vercel.

## 8. Monitoring and Maintenance

- **Error Tracking**: Sentry captures exceptions in API Routes and frontend.  
- **Performance Monitoring**: Vercel Analytics for page load metrics; Datadog or New Relic for serverless functions.  
- **Logging**: Centralized logs via Vercel dashboards or an external service (Logflare/Datadog).  
- **Health Checks**:  
  • Scheduled pings to `/api/health` endpoint.  
  • Database connection tests on startup.  
- **Maintenance**:  
  • Regular dependency updates via Dependabot.  
  • Quarterly security audits and load tests.

## 9. Conclusion and Overall Backend Summary

The Taman Kehati backend is built on a familiar Next.js + PostgreSQL stack, leveraging serverless API Routes for flexibility and global edge distribution. Drizzle ORM and a clear folder structure keep data models and business logic clean. Managed hosting on Vercel and Supabase ensures reliability, automatic scaling, and cost efficiency. Security best practices and monitoring tools safeguard user data and uptime. This backend aligns perfectly with project goals—supporting an intuitive Admin CMS, role-based workflows, and a responsive public site—while remaining easy to maintain, extend, and secure.