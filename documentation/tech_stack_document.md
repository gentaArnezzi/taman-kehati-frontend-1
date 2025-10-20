# Tech Stack Document

# Tech Stack Document

This document explains, in everyday language, the technology choices for the **Taman Kehati** frontend project. It shows how each piece fits together to deliver a fast, secure, and user-friendly experience—without requiring a technical background.

## 1. Frontend Technologies

We chose a set of tools and libraries that work together to build a responsive, attractive, and easy-to-use interface.

- **Next.js (App Router)**
  - A React framework that handles page routing, server-side rendering, and static site generation behind the scenes.
  - Makes navigation feel instant and helps pages load quickly.
- **TypeScript**
  - Adds clear labels to data and functions, catching mistakes early.
  - Helps developers understand and maintain the code over time.
- **Tailwind CSS**
  - A utility-first styling tool that lets us build designs by composing small, reusable classes.
  - Speeds up styling and ensures a consistent look across the site.
- **Radix UI & shadcn/ui**
  - Pre-built, accessible building blocks (buttons, modals, tables) that follow design best practices out of the box.
  - Ensures interactive elements behave predictably for all users.
- **React Query (@tanstack/react-query)**
  - Manages data fetching, caching, and synchronization with the server.
  - Keeps the data on the screen fresh without extra loading spinners or manual refresh logic.
- **Recharts**
  - A simple charting library for React to display statistics and KPIs in bar charts, line graphs, and more.
- **Leaflet / Mapbox (planned)**
  - Interactive map libraries for showing locations, park boundaries, and points of interest.
  - Lets users explore Taman Kehati visually on a map.

These choices work together to create an interface that feels snappy, looks polished, and adapts well to different devices.

## 2. Backend Technologies

Behind the scenes, the following tools power data storage, business logic, and user authentication.

- **Node.js & Next.js API Routes**  
  The same framework that builds the frontend also handles server code (for example, login checks or fetching lists of flora and fauna).
- **PostgreSQL**  
  A reliable, open-source database for storing user accounts, content records (like Flora, Fauna, and News), and regional statistics.
- **Drizzle ORM**  
  A lightweight layer that connects our code to the database in a type-safe way, reducing errors when reading or writing data.
- **"Better Auth" System**  
  A custom authentication setup using PostgreSQL and Drizzle.  
  - Supports secure login at `/login`.  
  - Easily extended to include role-based access (Super Admin vs. Regional Admin) and region codes.

Together, these technologies ensure data is stored safely, retrieved quickly, and that only authorized users can see or change sensitive information.

## 3. Infrastructure and Deployment

To keep the site reliable, up-to-date, and easy to operate, we rely on modern hosting and automation tools.

- **Git & GitHub**  
  Version control system where all code changes are tracked, reviewed, and managed collaboratively.
- **Vercel (or similar)**  
  A hosting platform optimized for Next.js projects:
  - Automatically builds and deploys every time new code is merged.
  - Distributes your site across a global content delivery network (CDN) for fast loading everywhere.
- **GitHub Actions (CI/CD)**  
  Automated pipelines that:
  - Run tests on every code change.
  - Validate coding standards and catch errors early.
  - Deploy to the hosting platform once everything passes.
- **Automated Testing**  
  - **Unit & Integration Tests:** Jest and React Testing Library ensure individual components and functions work as expected.
  - **End-to-End Tests:** Playwright or Cypress simulate real user flows (logging in, submitting content) to catch issues before they reach production.

This setup keeps downtime to a minimum, ensures new features don’t break existing ones, and makes it easy to roll out updates.

## 4. Third-Party Integrations

We connect external services to add functionality without reinventing the wheel.

- **Interactive Map Service (Leaflet/Mapbox)**  
  Shows park areas and points of interest on an interactive map.
- **Chatbot API**  
  A custom endpoint (`/api/public/chat`) powers an on-site chat assistant to help visitors find information.
- **Analytics (e.g., Google Analytics)**  
  Tracks visitor behavior to understand which pages are most popular and where improvements are needed.

These integrations enrich the user experience and provide valuable insights without heavy in-house development.

## 5. Security and Performance Considerations

We’ve built in safeguards and optimizations to protect data and keep the site running smoothly.

- **Role-Based Access Control (RBAC)**  
  - Super Admins and Regional Admins see only the pages and actions they’re permitted to use.
  - Protected routes and middleware prevent unauthorized access.
- **Encrypted Connections**  
  - All data in transit is encrypted (HTTPS/TLS).
  - Sensitive information in the database is stored following best practices.
- **Caching & Code Splitting**  
  - React Query caches data on the client for faster repeat visits.
  - Next.js splits code into smaller bundles so users only load what they need for each page.
- **Performance Monitoring**  
  - Built-in metrics track page load times and errors.
  - Alerts notify the team if performance drops below acceptable levels.

Together, these measures keep user data safe and ensure a consistently fast experience.

## 6. Conclusion and Overall Tech Stack Summary

By combining Next.js, TypeScript, and a suite of modern tools, we’ve created a technology foundation that:

- Delivers a polished, responsive interface for both public visitors and admin users.
- Ensures data is handled securely and reliably with PostgreSQL and Drizzle ORM.
- Automates builds, tests, and deployments for a dependable, always-up-to-date site.
- Integrates interactive maps, chat support, and analytics to engage users and gather insights.

This cohesive stack aligns perfectly with the project’s goals: a user-friendly public site, a powerful admin dashboard, and the flexibility to grow and extend features over time. The combination of type safety, design consistency, and automation makes **Taman Kehati** a robust platform that’s easy to maintain and ready for the future.

---
**Document Details**
- **Project ID**: 125b8398-fcf4-4e07-81aa-33955413dab3
- **Document ID**: 4ee849cc-d53a-4a40-be10-0ceb03c99ff8
- **Type**: custom
- **Custom Type**: tech_stack_document
- **Status**: completed
- **Generated On**: 2025-10-20T15:37:16.951Z
- **Last Updated**: N/A
