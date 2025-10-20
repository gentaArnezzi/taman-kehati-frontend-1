# AI Development Agent Guidelines

## Project Overview
**Project:** taman-kehati-frontend-1
**** Here is the enhanced repository summary, integrating your build goals for the "Dokumentasi Frontend Taman Kehati" project.

***

## Enhanced Repository Summary: `taman-kehati-frontend-1` as a Foundation for the Taman Kehati Platform

This repository provides an excellent and highly relevant foundation for building the **Taman Kehati** frontend application. It contains a modern, production-ready boilerplate for a dashboard-centric web application, leveraging a technology stack that aligns almost perfectly with your project's technical specifications. This summary analyzes the existing codebase and provides a strategic guide on how to adapt and extend it to meet your specific build goals.

### 1. What this codebase does and its relevance to Taman Kehati

The primary purpose of this codebase is to deliver a dynamic, authenticated user interface, making it an ideal starting point for the **Admin CMS** portion of the Taman Kehati project.

*   **User Authentication & Authorization:** The repository features a complete authentication system ("Better Auth" with PostgreSQL/Drizzle) that directly supports your requirement for an admin login page (`/login`). This system can be extended to implement the specified **Role-Based Access Control (RBAC)**, differentiating between **Super Admin** and **Regional Admin** roles.
*   **Admin Dashboard & Data Presentation:** The existing dashboard (`/dashboard`) serves as the perfect template for your Admin CMS. Its pre-built components for data display are directly applicable:
    *   The `DataTable` component is the foundation for all content management pages (e.g., Flora, Fauna, Berita), ready to be adapted for features like filtering by `WorkflowStatus`, search, and pagination.
    *   The `ChartAreaInteractive` component can be repurposed to display the "Statistik Nasional" and `summaryCards` on the Super Admin dashboard.
*   **Public Website Foundation:** While the repository is focused on the authenticated dashboard, its Next.js App Router structure provides the necessary routing and layout patterns to build out the public-facing sections of the Taman Kehati website (`/`, `/taman`, `/flora`, `/fauna`, etc.).

### 2. Key Architecture and Technology Choices: A Strong Match

The project's technology stack is a near-perfect match for your requirements, significantly accelerating development time.

*   **Frontend Framework:** **Next.js** (App Router) aligns with your choice of **Next.js 15**, providing the ideal structure for both the public site and the admin dashboard.
*   **Language:** **TypeScript** is used throughout, satisfying your requirement for type safety.
*   **UI Components & Styling:** The use of **shadcn/ui**, **Radix UI**, and **Tailwind CSS** is precisely what your build goals specify. The existing `components/ui` directory is a ready-to-use library for building all required UI elements, from `Card` components for the dashboard to complex `Form` components for content creation.
*   **Data Fetching & State Management:** The original summary recommended integrating a data-fetching library. Your choice of **React Query (@tanstack/react-query)** is the industry standard for this. It can be seamlessly integrated into the existing structure within the `lib/` or a new `services/` directory to manage server state for flora/fauna data, replacing the current static `data.json`.
*   **Authentication & Database:** The existing "Better Auth" with **PostgreSQL** and **Drizzle ORM** is a robust, type-safe foundation. This stack is perfectly suited for extending the database schema (`db/schema/auth.ts`) to include roles, permissions, and region codes as specified in your RBAC design.
*   **Data Visualization:** The use of **Recharts** is a direct asset for implementing the KPI and statistical displays on the admin dashboards.

### 3. Main Components and how they can be leveraged for Taman Kehati

The existing component structure maps directly to the needs of the Taman Kehati application.

*   **`/app` Directory:**
    *   `app/(auth)/sign-in/page.tsx`: This is your **Admin Login page** (`/login`), ready for styling and integration.
    *   `app/dashboard/layout.tsx`: This is your **`DashboardLayout.tsx`**, providing the persistent header, sidebar, and main content area for the Admin CMS.
    *   `app/dashboard/page.tsx`: This page serves as the template for both the **Super Admin** and **Regional Admin** dashboard overviews.
*   **`/components` Directory:**
    *   `components/ui/`: This is your core design system. It will be used to build everything from the public `Header` and `Footer` to the admin-specific `DataTable`, `StatusBadge`, and `RejectionModal`.
    *   `components/data-table.tsx`: This is a critical accelerator for building the content management UIs. It can be configured with custom columns and actions to manage Flora, Fauna, and Berita, including the role-specific action buttons you've designed.
    *   `components/app-header.tsx` & `components/app-sidebar.tsx`: These are the starting points for the Admin CMS navigation, which can be dynamically rendered based on the logged-in user's role (Super Admin vs. Regional Admin).
*   **`/db` Directory:**
    *   `db/schema/auth.ts`: This file is where you will implement the RBAC logic by adding `role` and `region_code` fields to the user table, aligning with your permission model.

### 4. How to Extend This Repository for the Taman Kehati Project

This codebase provides a solid foundation, but requires extension and customization to fully realize your vision. Here are the key areas to focus on:

1.  **Implement Dynamic Data Fetching:**
    *   **Action:** Replace the static `app/dashboard/data.json` with dynamic data fetching.
    *   **How:** Integrate **React Query** as planned. Create a new `services/api.ts` file to define API service functions (e.g., `floraService.searchFlora`). Use custom hooks (`useFloraList`) to fetch, cache, and mutate data in your components, powering the `DataTable` and other UI elements.

2.  **Build Out the Role-Based Access Control (RBAC):**
    *   **Action:** Extend the authentication system to support "Super Admin" and "Regional Admin" roles.
    *   **How:**
        *   Modify the `db/schema/auth.ts` Drizzle schema to add a `role` enum and an optional `region_code` to the user model.
        *   Create a `ProtectedRoute.tsx` component or use Next.js Middleware to protect routes and layouts based on user role, as outlined in your specification.
        *   Conditionally render UI elements (e.g., sidebar links, action buttons) based on the user's permissions.

3.  **Develop the Public-Facing Website:**
    *   **Action:** Create the public routes, pages, and layouts.
    *   **How:** Add new route groups and pages within the `app/` directory for `/`, `/taman`, `/flora`, `/fauna`, etc. Create a shared public `Layout.tsx` that includes the public `Header.tsx` and `Footer.tsx`.

4.  **Integrate New Features:**
    *   **Action:** Build the features not present in the original repository.
    *   **How:**
        *   **Map Integration:** Choose a library like Leaflet or Mapbox and create a new `InteractiveMap` component.
        *   **Chatbot:** Develop the chatbot UI and connect it to the specified API endpoint (`/api/public/chat`).
        *   **Content Workflow UI:** Use the `shadcn/ui` components (`DataTable`, `Badge`, `Modal`, `Button`) to build the full content management experience, including status tracking (`WorkflowStatus`), the approval queue for Super Admins, and the rejection modal.

5.  **Establish a Comprehensive Testing Suite:**
    *   **Action:** Implement the recommended testing strategy.
    *   **How:** Use Jest and React Testing Library for unit/integration tests on critical components like the `DataTable`, forms, and RBAC logic. Employ Playwright or Cypress for end-to-end tests covering key user flows like content submission/approval.

### 6. Conclusion: A Strategic Head Start

This repository is not just a random template; it's a strategic asset that provides a significant head start for the Taman Kehati project. The alignment in technology choices, architecture, and core features means your team can focus immediately on building business logic and unique features rather than setting up boilerplate. By following the extension plan outlined above, you can efficiently transform this solid foundation into the full-featured, scalable, and maintainable Taman Kehati platform you have designed.

## CodeGuide CLI Usage Instructions

This project is managed using CodeGuide CLI. The AI agent should follow these guidelines when working on this project.

### Essential Commands

#### Project Setup & Initialization
```bash
# Login to CodeGuide (first time setup)
codeguide login

# Start a new project (generates title, outline, docs, tasks)
codeguide start "project description prompt"

# Initialize current directory with CLI documentation
codeguide init
```

#### Task Management
```bash
# List all tasks
codeguide task list

# List tasks by status
codeguide task list --status pending
codeguide task list --status in_progress
codeguide task list --status completed

# Start working on a task
codeguide task start <task_id>

# Update task with AI results
codeguide task update <task_id> "completion summary or AI results"

# Update task status
codeguide task update <task_id> --status completed
```

#### Documentation Generation
```bash
# Generate documentation for current project
codeguide generate

# Generate documentation with custom prompt
codeguide generate --prompt "specific documentation request"

# Generate documentation for current codebase
codeguide generate --current-codebase
```

#### Project Analysis
```bash
# Analyze current project structure
codeguide analyze

# Check API health
codeguide health
```

### Workflow Guidelines

1. **Before Starting Work:**
   - Run `codeguide task list` to understand current tasks
   - Identify appropriate task to work on
   - Use `codeguide task update <task_id> --status in_progress` to begin work

2. **During Development:**
   - Follow the task requirements and scope
   - Update progress using `codeguide task update <task_id>` when significant milestones are reached
   - Generate documentation for new features using `codeguide generate`

3. **Completing Work:**
   - Update task with completion summary: `codeguide task update <task_id> "completed work summary"`
   - Mark task as completed: `codeguide task update <task_id> --status completed`
   - Generate any necessary documentation

### AI Agent Best Practices

- **Task Focus**: Work on one task at a time as indicated by the task management system
- **Documentation**: Always generate documentation for new features and significant changes
- **Communication**: Provide clear, concise updates when marking task progress
- **Quality**: Follow existing code patterns and conventions in the project
- **Testing**: Ensure all changes are properly tested before marking tasks complete

### Project Configuration
This project includes:
- `codeguide.json`: Project configuration with ID and metadata
- `documentation/`: Generated project documentation
- `AGENTS.md`: AI agent guidelines

### Getting Help
Use `codeguide --help` or `codeguide <command> --help` for detailed command information.

---
*Generated by CodeGuide CLI on 2025-10-20T17:10:41.060Z*
