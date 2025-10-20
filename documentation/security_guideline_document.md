# Security Guideline Document

# Security Guidelines for `taman-kehati-frontend-1`

This document outlines the security principles, controls, and best practices for the **Taman Kehati** frontend application, based on a Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui + Radix UI stack, with React Query for data fetching and Drizzle ORM + PostgreSQL for persistence. Adhering to these guidelines will help protect the application and its data from common threats and vulnerabilities.

---

## 1. Security by Design

- Embed security reviews at each development phase: design, implementation, testing, and deployment.
- Use threat modeling to identify and mitigate risks for new features (e.g., map integration, chatbot).
- Perform regular code reviews with security focus, emphasizing parameterized queries, XSS, CSRF, and access control.

## 2. Authentication & Access Control

### 2.1 Robust Authentication
- Leverage the existing “Better Auth” system with PostgreSQL + Drizzle ORM.
- Store passwords with Argon2 or bcrypt + unique salts.
- Enforce a strong password policy: minimum length (e.g., 12 chars), complexity (upper, lower, digits, symbols), and rotation guidelines for admin accounts.
- Implement account lockout after repeated failed attempts and monitor for brute-force patterns.

### 2.2 Session & Token Security
- If using JWTs:
  - Use a strong signing algorithm (e.g., RS256 or HS256 with 256-bit secret).
  - Validate `iss`, `aud`, and `exp` claims on every request.
  - Keep token lifetimes short (e.g., 15–30 minutes) and implement refresh tokens with revocation lists.
- Store session tokens in **Secure**, **HttpOnly**, **SameSite=Strict** cookies to prevent XSS and CSRF.
- Implement idle and absolute session timeouts, with a logout endpoint that invalidates sessions on the server.

### 2.3 Role-Based Access Control (RBAC)
- Extend the Drizzle schema (`db/schema/auth.ts`) to include a `role` enum (`SUPER_ADMIN`, `REGIONAL_ADMIN`, `VIEWER`, etc.) and an optional `region_code`.
- Protect routes and layouts using Next.js [Middleware](https://nextjs.org/docs/advanced-features/middleware) or a `ProtectedRoute.tsx` component that reads and validates the user’s role from a signed session.
- On the client, conditionally render UI elements (sidebar links, action buttons) based on server-validated permissions to avoid exposing unauthorized features.

## 3. Input Handling & Processing

- Treat all incoming data (query params, form inputs, JSON bodies) as untrusted.
- Use Next.js API Route handlers with explicit validation using a schema library (e.g., Zod or Joi) for every route.
- Prevent injection:
  - Use Drizzle ORM’s parameterized queries to avoid SQL injection.
  - Sanitize or reject file names to prevent path traversal.
- Protect against XSS:
  - Use `next/image` for user-uploaded images and strip dangerous tags from rich text (if any) via a library like DOMPurify.
  - Leverage React’s built-in escaping for interpolated values; avoid using `dangerouslySetInnerHTML` unless strictly sanitized.
- Validate redirect targets against an allow-list of known safe paths to prevent open-redirect attacks.

## 4. Data Protection & Privacy

- Enforce HTTPS/TLS 1.2+ for all public endpoints; redirect HTTP to HTTPS at the CDN or load balancer.
- Encrypt at rest:
  - Enable database encryption (if supported) or use field-level encryption for sensitive PII.
  - Securely manage encryption keys via a vault solution (e.g., AWS KMS, HashiCorp Vault).
- Mask or omit sensitive fields (passwords, tokens, PII) in API responses and logs.
- Securely store environment variables and secrets using Next.js `process.env` together with a secrets manager—do not check secrets into version control.

## 5. API & Service Security

- Enforce HTTPS on every API route; reject non-TLS connections.
- Implement rate limiting and throttling per IP or API key for both public and authenticated endpoints (e.g., with `express-rate-limit` or a serverless equivalent).
- Configure CORS in Next.js (`next.config.js` or custom middleware) to allow only trusted origins (e.g., `https://app.taman-kehati.id`).
- Use proper HTTP verbs:
  - GET for safe reads
  - POST for creation
  - PUT/PATCH for updates
  - DELETE for deletions
- Version your public API endpoints (e.g., `/api/v1/flora` → `/api/v2/flora`) to manage breaking changes safely.

## 6. Web Application Security Hygiene

- CSRF Protection:
  - Use anti-CSRF tokens in forms and API calls, or rely on same-site cookies with `SameSite=Strict`.
- Security Headers (configured via Next.js `headers()` in `next.config.js`):
  - `Content-Security-Policy`: restrict scripts, styles, images to trusted sources.
  - `Strict-Transport-Security`: `max-age=63072000; includeSubDomains; preload`.
  - `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: no-referrer-when-downgrade`.
- Secure third-party resources with Subresource Integrity (SRI) if loaded via `next/script`.
- Avoid storing sensitive tokens or PII in `localStorage`; prefer HttpOnly cookies.

## 7. Infrastructure & Configuration Management

- Harden server and hosting environment:
  - Disable unused ports and services.
  - Enforce least privilege on file and directory permissions.
- Remove all default or demo accounts and change default credentials.
- Keep the OS, Node.js, and all dependencies (including transitive) up to date with security patches.
- Disable Next.js debugging and verbose error messages in production (`NODE_ENV=production`).

## 8. Dependency Management

- Maintain a lockfile (`package-lock.json`) and freeze dependency versions.
- Regularly scan dependencies using SCA tools (e.g., `npm audit`, Snyk, Dependabot).
- Remove or replace unmaintained or vulnerable libraries.
- Limit the use of large or optional dependencies to reduce the attack surface.

## 9. Testing, Monitoring & Incident Response

- Implement automated tests:
  - **Unit/Integration**: Jest + React Testing Library for components, hooks, and API handlers.
  - **End-to-End**: Playwright or Cypress for critical user flows (login/logout, content CRUD, approval workflows).
- Set up runtime security monitoring and alerting (e.g., Cloudflare Firewall, WAF logs, Sentry for error monitoring).
- Define an incident response plan: how to detect, contain, and remediate security events.

---

By following these guidelines, the **Taman Kehati** frontend will achieve a strong security posture, safeguarding data integrity, confidentiality, and availability for both administrators and public users.

---
**Document Details**
- **Project ID**: 125b8398-fcf4-4e07-81aa-33955413dab3
- **Document ID**: 345e5b7d-c212-428e-bdf5-69ed22a06e51
- **Type**: custom
- **Custom Type**: security_guideline_document
- **Status**: completed
- **Generated On**: 2025-10-20T15:36:57.861Z
- **Last Updated**: N/A
