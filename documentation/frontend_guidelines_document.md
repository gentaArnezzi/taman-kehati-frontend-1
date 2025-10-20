# Frontend Guidelines Document

# Frontend Guideline Document for Taman Kehati

This document lays out the frontend architecture, design principles, technologies, and best practices for the Taman Kehati platform. It’s written in plain language so that anyone—technical or not—can understand how the frontend is built, why certain choices were made, and how to extend or maintain it.

## 1. Frontend Architecture

### Frameworks and Libraries
- **Next.js 15 (App Router)**: Provides file-based routing, server-side rendering (SSR), static site generation (SSG), and built-in code splitting.
- **TypeScript**: Adds type safety across the codebase.
- **Tailwind CSS**: A utility-first CSS framework for rapid styling.
- **shadcn/ui & Radix UI**: A set of accessible, unstyled UI primitives and prebuilt components.
- **React Query (@tanstack/react-query)**: Manages server state and data fetching.
- **Recharts**: Renders interactive charts and KPI summaries.
- **Drizzle ORM + PostgreSQL**: Handles data persistence and offers type-safe database queries.

### How It Supports Scalability, Maintainability, and Performance
- **Modular Structure**: Separate folders for pages (`/app`), components (`/components`), and services (`/services`). This makes it easy to add new features without clutter.
- **SSR & SSG**: Next.js delivers fast page loads and SEO-friendly content.
- **Code Splitting & Lazy Loading**: Only the code needed for each page is loaded, reducing bundle size.
- **Type Safety**: TypeScript and Drizzle ORM catch errors at compile time.
- **Design System**: A central `components/ui` library ensures consistent look-and-feel and reusability.

## 2. Design Principles

### Key Principles
- **Usability**: Simple, clear interfaces. Minimal clicks to complete tasks.
- **Accessibility**: Follow WCAG guidelines—semantic HTML, ARIA attributes, proper color contrast.
- **Responsiveness**: Mobile-first design with breakpoints for tablets and desktops.
- **Consistency**: Reuse components, colors, and spacing tokens everywhere.
- **Performance**: Fast load times and smooth interactions.

### How They’re Applied
- **Buttons & Forms**: All inputs have labels, error messages, and focus states.
- **Navigation**: Visible at all screen sizes; collapses into a hamburger menu on mobile.
- **Feedback**: Loading spinners, toasts, and disabled states communicate progress.
- **Color & Typography**: Use a fixed set of design tokens for spacing, font sizes, and colors.

## 3. Styling and Theming

### Styling Approach
- **Tailwind CSS**: Utility classes in markup for margins, padding, typography, colors, and layout.
- **Component-Level Styles**: Use `className` and conditional classes in React components—no global CSS files.
- **Theme Config**: Defined in `tailwind.config.ts`, supporting light and dark modes.

### Theming and Consistency
- **Light/Dark Mode**: Toggle via a CSS class on `<html>`. Theme tokens in Tailwind config.
- **Design Tokens**: Spacing (`sm`, `md`, `lg`), font sizes, border radii, shadows.

### Visual Style
- **Style**: Modern and flat with subtle glassmorphism on dashboard cards—light background blur and soft shadows.
- **Color Palette**:
  - Primary Green: #2F855A
  - Secondary Green: #68D391
  - Accent Yellow: #ECC94B
  - Danger Red: #E53E3E
  - Neutral Background: #F7FAFC
  - Text Dark: #1A202C
  - Text Muted: #A0AEC0
- **Font**: "Inter" (sans-serif) for all body and heading text.

## 4. Component Structure

### Organization and Reuse
- **`/components/ui/`**: Atomic and generic UI elements (Buttons, Inputs, Modals, DataTable, Badge).
- **`/components/layouts/`**: Page layouts (PublicLayout, DashboardLayout).
- **`/components/modules/`**: Feature-specific components (InteractiveMap, Chatbot, WorkflowStatus).
- **Index Exports**: Each folder has an `index.ts` to simplify imports.

### Benefits of Component-Based Architecture
- **Reusability**: Build once, reuse everywhere—reduces bugs and speeds up development.
- **Isolation**: Each component manages its own logic and styles, making fixes and updates safer.
- **Testability**: Small, focused components are easier to test.

## 5. State Management

### Approach and Libraries
- **React Query**: Handles all server-side data (floras, faunas, Berita, stats). It caches results and keeps UI in sync.
- **React Context API**: Manages lightweight global state such as theme mode and authentication status.

### Data Flow
1. **Services (`/services/api.ts`)** define functions like `getFloraList()` or `getStatistics()`.
2. **Custom Hooks** (e.g., `useFloraList()`) use React Query to fetch and cache data.
3. Components call hooks and automatically re-render on data updates.

## 6. Routing and Navigation

### Next.js App Router
- **File-Based Routes**: Pages live under `/app`:
  - Public: `/app/page.tsx`, `/app/taman/page.tsx`, `/app/flora/page.tsx`, etc.
  - Authenticated: `/app/(auth)/login/page.tsx` and `/app/dashboard/...`.
- **Layouts**: Shared wrappers in `/app/layout.tsx` or nested layouts in `/app/dashboard/layout.tsx`.
- **Dynamic Routes**: Support `[id]` files for detail views.

### Protected Routes
- **Next.js Middleware** or a `ProtectedRoute` component checks user roles.
- **Role-Based Menus**: Sidebar links and action buttons render based on Super Admin vs. Regional Admin.

## 7. Performance Optimization

### Key Strategies
- **Lazy Loading**: Dynamically import heavy modules (maps, charts) with `next/dynamic`.
- **Code Splitting**: Next.js auto-splits routes; further split large components manually.
- **Image Optimization**: Use `<Image />` from Next.js for responsive, lazy-loaded images.
- **Caching**:
  - **React Query**: Stale-while-revalidate for data.
  - **HTTP Caching**: Set sensible headers on API responses.
- **Minification & Compression**: Handled by Next.js out of the box.

### Impact on User Experience
- Faster initial load.
- Smooth transitions between sections.
- Less data usage on mobile devices.

## 8. Testing and Quality Assurance

### Testing Layers
- **Unit Tests**: Jest + React Testing Library for individual components (Buttons, DataTable, WorkflowStatus).
- **Integration Tests**: Combine components and hooks to test data fetching and interactions.
- **End-to-End Tests**: Cypress or Playwright for critical flows—login, content submission, approval, public map interaction.

### Tools and Practices
- **MSW (Mock Service Worker)**: Mock API calls in tests.
- **ESLint + Prettier**: Enforce code style and catch common errors.
- **Type Checking**: `tsc --noEmit` in CI to ensure no type errors.
- **GitHub Actions**: Run lint, tests, and build on every pull request.

## 9. Conclusion and Overall Frontend Summary

The Taman Kehati frontend combines modern frameworks and clear design principles to deliver a scalable, maintainable, and high-performance application. With Next.js and TypeScript at its core, a consistent Tailwind-based design system, and robust state management via React Query, it’s ready to handle both public-facing pages and a rich Admin CMS. Accessibility, responsive layout, and thorough testing ensure a great experience for all users. Unique aspects—like role-based dashboards, interactive maps, and integrated chatbot—set this project apart and can be built confidently on the solid foundation described here.

---
**Document Details**
- **Project ID**: 125b8398-fcf4-4e07-81aa-33955413dab3
- **Document ID**: 46bf9c38-22c8-4729-b660-822d5be08d8e
- **Type**: custom
- **Custom Type**: frontend_guidelines_document
- **Status**: completed
- **Generated On**: 2025-10-20T15:36:37.159Z
- **Last Updated**: N/A
