<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# HackIEEE 2027: Agent Guidelines & Architecture Standards

> **Notice to AI Agents & Developers:**  
> These rules document the fundamental architectural decisions for the HackIEEE codebase. Whenever an architecture, flag, or environment standard changes, update this document and `.env.local.example` immediately.

---

## 1. Feature Flags & Navigation Control Standards

- **Primary Flag: `AUTH_NAV_MODE` (String)**
  The navigation bar and authentication state are controlled via `AUTH_NAV_MODE` defined in `app/flags.ts`.
  It supports 4 distinct variants:
  - `"both"`: Displays `[Login]` button on the left and `[Register]` CTA on the right corner.
  - `"registration_only"`: Displays `[Register]` CTA on the right corner only (Default active state).
  - `"login_only"`: Displays `[Login]` button on the right corner only.
  - `"none"`: Displays `[Contact Us]` only (Registration closed; routes `/register` and `POST /api/register` return 403 Forbidden).

- **Backward Compatibility: `IS_REGISTRATION_ACTIVE` (Boolean)**
  - Legacy toggle: `IS_REGISTRATION_ACTIVE="false"` automatically maps to `AUTH_NAV_MODE="none"`.
  - `IS_REGISTRATION_ACTIVE="true"` automatically maps to `AUTH_NAV_MODE="registration_only"`.

- **KIRO Supporter Badge Trial Flags (Boolean on/off):**
  - `SHOW_KIRO_COLLABORATION` (Master Toggle, default: `true`).
  - `SHOW_KIRO_IN_HERO` (Variant 1: Hero 2-line obsidian badge above title, default: `false`).
  - `SHOW_KIRO_IN_ABOUT` (Variant 2: About "Supported by" section above Organised by, default: `false`).
  - `SHOW_KIRO_IN_NAV` (Variant 3: Top-left header bar badge beside navigation, default: `true` — Active).

- **Local Development Fallback Rule:**
  - `app/flags.ts` must always resolve its `defaultValue` and error catch blocks using `getFallbackAuthNavMode()`.
  - Never hardcode a static string as `defaultValue` that ignores `process.env.AUTH_NAV_MODE` or `process.env.IS_REGISTRATION_ACTIVE`.
  - Any new flag added to the system must immediately be mirrored in `app/flags.ts`, `.env.local.example`, `.env.local`, and `README.md`.

---

## 2. Environment Variables & Secret Management

- **Zero Duplication:**
  Never duplicate variables in `.env.local.example` or `.env.local`.
- **Git Security:**
  `.env.local` contains live credentials and is strictly tracked in `.gitignore`. Never commit `.env.local` to git.
- **Client vs. Server Boundary:**
  - Only variables that must be exposed to the browser may use the `NEXT_PUBLIC_` prefix (e.g., `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
  - Sensitive server-side keys (`SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`) must **never** be prefixed with `NEXT_PUBLIC_`.

---

## 3. Database Schema & SQL Location Rule

- **Strict Folder Isolation:**
  - All Supabase schemas, SQL migrations, RLS policies, and query scripts **must strictly live in the `supabase/` root directory**, never in `docs/`.
  - `supabase/schema.sql`: Base `public.registrations` table schema, indexes, and RLS policies.
  - `supabase/admin-schema.sql`: `public.admin_users` table schema, RLS policies, and Realtime publication setup.
  - `supabase/queries.sql`: Pre-written analysis and inspection queries for the Supabase SQL Editor.
- **Table Immutability:**
  - The live `public.registrations` table is production-critical. Never alter its columns, types, or data schema.

---

## 4. Organizer Admin Dashboard (`/admin`) Architecture

- **Database-Driven Access Control:**
  - Admin access is validated against the `public.admin_users` table via server-side Supabase client using `SUPABASE_SERVICE_ROLE_KEY`.
  - Do **not** hardcode admin emails in `.env` or application source code.
- **Phased Implementation Roadmap:**
  - **Phase 1 (Top Priority):** Interactive Participant Directory Table, Multi-field Search, Filter Pills, Participant Detail Card Modal, and 1-Click Multi-Format Export Engine (Excel `.xlsx`, CSV, PDF).
  - **Phase 2:** 4 Live KPI Stat Cards, Velocity Line Chart, Donut / Demographic Comparison Chart, and Top 10 Colleges Bar Leaderboard.
  - **Phase 3:** Deep Analytics (Sankey Flow Diagram & Sunburst radial hierarchy).

---

## 5. Code Hygiene & Commit Workflow

- **No Dead Code:**
  Remove unused routes, test endpoints, and orphaned components immediately. Keep the repository lean and clean.
- **Pre-Commit Build Verification:**
  Always run `npm run build` and ensure **0 errors / 0 warnings** before committing or pushing changes to `origin main`.
- **Commit Convention:**
  Use Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`).
