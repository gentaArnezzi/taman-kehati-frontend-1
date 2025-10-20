# Project Requirements Document: Taman Kehati Frontend

## 1. Project Overview

Taman Kehati is a web-based platform designed to showcase and manage biodiversity data—flora, fauna, and related news—within protected parks. It consists of two main parts: a public-facing website where visitors can explore information, interactive maps, and a conversational assistant, and an Admin CMS portal where authorized personnel can log in, create or update content, and view real-time statistics. By unifying content management and public presentation in one codebase, Taman Kehati simplifies workflows, ensures data consistency, and delivers an engaging user experience.

The project is being built to replace fragmented spreadsheets and static sites with a modern, secure, and scalable application. Key objectives include:

•  Implement a role-based Admin portal for Super Admins and Regional Admins, with secure authentication and fine-grained access controls.
•  Deliver dynamic content management for flora, fauna, and news items, complete with approval workflows and statistical dashboards.
•  Provide a responsive, fast public website with dedicated pages, an interactive map, and a chatbot interface.
•  Meet performance, security, and usability standards so that pages load quickly, data is protected, and visitors of all abilities can navigate the site.

Success will be measured by: a fully functional login and RBAC system, content creation and approval flows, a polished public UI, less than 2-second page loads, and passing accessibility audits.

---

## 2. In-Scope vs. Out-of-Scope

**In-Scope (Version 1):**

•  Admin Authentication & Authorization (Super Admin, Regional Admin)
•  Admin Dashboard layout with header, sidebar, and main content area
•  Content management pages for:
   - Flora (CRUD, filter by status, search, pagination)
   - Fauna (CRUD, filter by status, search, pagination)
   - Berita/News (CRUD, filter, search, pagination)
•  Workflow Status tracking (Draft, Pending Approval, Published, Rejected)
•  Summary cards and interactive charts for national and regional statistics
•  Public Website pages: Home (`/`), Taman (`/taman`), Flora (`/flora`), Fauna (`/fauna`), Berita (`/berita`)
•  Shared public Layout with Header and Footer
•  Basic Interactive Map component (Leaflet or Mapbox)
•  Chatbot UI connected to `/api/public/chat`
•  Dynamic data fetching via React Query and REST API endpoints
•  Middleware or ProtectedRoute component for RBAC enforcement
•  Unit and integration tests (Jest, React Testing Library)
•  End-to-end tests for key flows (Playwright or Cypress)

**Out-of-Scope (Planned Later):**

•  Multi-language support and localization
•  Offline or mobile-first native applications
•  Social login integrations (Google, Facebook)
•  Advanced analytics (machine learning or AI-driven insights)
•  Bulk import/export of content via CSV/Excel
•  Custom theming or white-labeling options

---

## 3. User Flow

**Admin User Journey:**
A new admin visits the `/login` page and signs in with their email and password. After authentication, they land on the Admin Dashboard overview. Depending on their role (Super Admin or Regional Admin), they see navigation links in the sidebar for managing Flora, Fauna, and Berita, as well as a Statistics section. When they click on "Flora", they see a table of existing records, can filter by workflow status, search by name, and use pagination to browse more items. They can click "Add New" to open a form, fill in details, and submit for approval. Super Admins can also view a queue of pending items, approve or reject them via a modal, and the action updates the item's workflow status.

**Public Visitor Journey:**
A visitor lands on the Home page (`/`), which features a hero section, a search bar, and quick links to Flora, Fauna, and Taman information. They click on "Flora" to see a grid or list of plants, with basic filters and search. They can view individual detail pages for each species. A map embedded on the Flora page highlights distribution points. At any time, they can open the chatbot in the bottom corner, enter a question about species or park rules, and receive a response fetched from `/api/public/chat`. On mobile devices, all components adapt to a single-column layout.

---

## 4. Core Features

- **Authentication & Role-Based Access Control**  
  Secure login with Next.js middleware or ProtectedRoute, two roles (Super Admin, Regional Admin), region-limited operations.

- **Admin Dashboard Layout**  
  Persistent header, collapsible sidebar, main content area following a consistent design system.

- **Content Management (CRUD)**  
  - Flora, Fauna, Berita modules  
  - DataTable with columns, filters (WorkflowStatus), search, pagination  
  - Create/Edit forms, status badges, rejection modal

- **Workflow & Approvals**  
  Content status life cycle (Draft → Pending Approval → Published/Rejected), approval queue for Super Admins.

- **Statistics & Charts**  
  Summary cards, interactive charts (Recharts) showing national and regional KPIs.

- **Public Website**  
  Static and dynamic pages: Home, Taman, Flora, Fauna, Berita; shared public layout.

- **Interactive Map**  
  Map component for species distribution (Leaflet or Mapbox).

- **Chatbot Interface**  
  UI component connected to `/api/public/chat` for visitor questions.

- **Data Fetching & State Management**  
  React Query for server state, custom hooks (`useFloraList`), services in `services/api.ts`.

- **Testing Suite**  
  Unit/integration tests (Jest, React Testing Library), end-to-end tests (Playwright/Cypress).

---

## 5. Tech Stack & Tools

- **Frontend Framework:** Next.js 15 (App Router) with TypeScript
- **Styling & UI Components:** Tailwind CSS, shadcn/ui, Radix UI
- **State & Data Fetching:** @tanstack/react-query (React Query), custom hooks
- **Authentication & ORM:** Drizzle ORM with PostgreSQL, Better Auth boilerplate
- **Charts & Visualization:** Recharts
- **Map Library:** Leaflet or Mapbox GL JS
- **Testing:** Jest, React Testing Library, Playwright or Cypress
- **Linting & Formatting:** ESLint, Prettier
- **IDE Integrations (Optional):** VSCode with Cursor or Windsurf plugins

---

## 6. Non-Functional Requirements

- **Performance:**  
  - First meaningful paint under 2 seconds on 4G connection  
  - Subsequent data fetches under 100ms latency  
  - Code-splitting and lazy loading for routes and heavy components

- **Security:**  
  - All API routes protected by HTTPS and middleware checks  
  - OWASP best practices (XSS, CSRF, SQL injection defenses)  
  - Secure HTTP-only cookies or JWT for session management

- **Usability & Accessibility:**  
  - WCAG 2.1 AA compliance (semantic HTML, ARIA labels, keyboard navigation)  
  - Mobile-responsive across common breakpoints  
  - Clear error messaging and form validation

- **Scalability & Maintainability:**  
  - Modular component library via shadcn/ui  
  - Clean folder structure (`app/`, `components/`, `services/`, `db/`)  
  - Type-safe code with TypeScript

- **Compliance:**  
  - GDPR-ready consent banners if user data is collected  
  - Data residency per regional admin scope

---

## 7. Constraints & Assumptions

- **Next.js v15** features (App Router, middleware) will be available and stable.
- **Drizzle ORM** supports schema migrations for adding `role` and `region_code` fields.
- **API Endpoints** for flora, fauna, berita, and chatbot are implemented or mocked.
- **Map API Key** will be provided for Leaflet/Mapbox usage.
- **Hosting Environment:** Node.js 18+ with PostgreSQL database access.
- **Users** have modern browsers; IE11 support is not required.

---

## 8. Known Issues & Potential Pitfalls

- **API Rate Limits:**  
  High-frequency calls from React Query may hit server limits; implement request debouncing and rate-limiting middleware.

- **Large Data Sets:**  
  Rendering huge tables may slow down the UI; use virtualization (e.g., react-window) if needed.

- **Role-Based Caching:**  
  Caching data per user role might leak restricted data; ensure cache keys include role and region identifiers.

- **Map Performance & Licensing:**  
  Map libraries can be heavy; lazy-load the map component and optimize tile usage. Check Mapbox license if chosen.

- **Content Approval Race Conditions:**  
  Simultaneous approvals could conflict; use optimistic UI updates and server-side locking or version checks.

Mitigation guidelines: set conservative fetch intervals, introduce virtualization for large lists, tag cache entries with role-based keys, and handle map code splitting. Conduct regular security audits and load tests before production launch.

---

This document serves as the single source of truth for the Taman Kehati frontend. Every requirement is spelled out in clear, everyday language to allow the AI model—or any developer—to build the application without ambiguity.