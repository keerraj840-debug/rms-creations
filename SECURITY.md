# Security Policy & Architecture

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.6.x   | :white_check_mark: |
| < 1.6   | :x:                |

---

## 1. Credentials & Environment Variable Security

### Client-Side (Browser) Keys vs Privileged Keys
- **Supabase Anon / Publishable Key (`SUPABASE_ANON_KEY`)**:
  - The `SUPABASE_ANON_KEY` is embedded in the frontend bundle and used by `@supabase/supabase-js`.
  - **Security Principle**: This key is public by design and operates under the identity of the current user session (or anonymous visitor). It grants **ZERO** unauthorized data access on its own.
  - All security and authorization are strictly enforced at the database layer via **Row Level Security (RLS)** policies.
- **Supabase Service Role Key (`SUPABASE_SERVICE_ROLE_KEY`)**:
  - The service role key bypasses Row Level Security and has full admin privileges.
  - **CRITICAL**: The service role key **MUST NEVER** be placed in frontend code, `.env` files for frontend builds, or browser environments.
  - The automated build script `scripts/generate-env.mjs` enforces this with an automatic blocker that halts the build if a `service_role` key is accidentally configured.
  - Privileged tasks (e.g., automated email notifications, background order processing) are executed exclusively within isolated Supabase Edge Functions (`supabase/functions/`).

### Local Development & CI/CD Configuration
- Copy `.env.example` to `.env` for local environment configuration.
- The `.gitignore` file strictly blocks `.env`, `.env.*`, and any secret keys from being checked into git.
- For deployment platforms (Netlify, Vercel, Docker), configure `SUPABASE_URL` and `SUPABASE_ANON_KEY` in the hosting provider's secure dashboard settings.

---

## 2. Row Level Security (RLS) & Access Controls
- Every table in Supabase (`orders`, `order_items`, `users`, `custom_hampers`, `pincodes`, etc.) has Row Level Security active.
- Anonymous visitors can only read published products, catalog categories, active banners, and deliverable pincodes.
- Authenticated customers can read and modify only their own profile, addresses, and placed orders (`auth.uid() = user_id`).
- Administrative actions (`/admin/*`) require server-verified role checks in `public.users` matching `role = 'admin'`.

---

## 3. Reporting a Vulnerability

If you discover a security vulnerability or sensitive information disclosure:
1. Please do **NOT** open a public issue.
2. Email full details to: **rmsgifthampers@gmail.com** with the subject `[SECURITY VULNERABILITY]`.
3. We will acknowledge receipt within 24 hours and provide an estimated resolution timeline.
