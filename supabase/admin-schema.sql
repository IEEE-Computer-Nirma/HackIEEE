-- ==============================================================================
-- HackIEEE 2026-27: Supabase Admin Access Control & Realtime Setup
-- ==============================================================================
-- Execute this script in:
-- Supabase Dashboard -> SQL Editor -> New Query -> Paste & Run
-- ==============================================================================

-- 1. Enable Supabase Realtime broadcast for registrations
-- (Publishes change events to the realtime channel without modifying table data)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'registrations'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.registrations;
  END IF;
END $$;

-- 2. Create the admin_users table for team access control
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'organizer', -- 'owner', 'admin', 'organizer'
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Row Level Security (RLS) on admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Backend Service Role has full access via SUPABASE_SERVICE_ROLE_KEY
DROP POLICY IF EXISTS "Service role full access on admin_users" ON public.admin_users;
CREATE POLICY "Service role full access on admin_users"
  ON public.admin_users
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Authenticated admins can view their own record
DROP POLICY IF EXISTS "Admins can view their own record" ON public.admin_users;
CREATE POLICY "Admins can view their own record"
  ON public.admin_users
  FOR SELECT
  TO authenticated
  USING (email = auth.jwt() ->> 'email');

-- 4. Initial Organizer / Admin Whitelist
INSERT INTO public.admin_users (email, full_name, role, is_active)
VALUES 
  ('lead@ieeenirma.org', 'Lead Organizer', 'owner', true),
  ('deep@computer.org', 'Technical Coordinator', 'admin', true),
  ('priyanshpatel9506@gmail.com', 'Priyansh Patel', 'owner', true),
  ('keyajeni0@gmail.com', 'Keya Jeni', 'admin', true),
  ('mahiacharya81@gmail.com', 'Mahi Acharya', 'admin', true),
  ('vishwaghori@gmail.com', 'Vishwa Ghori', 'admin', true),
  ('meet.r.patel1109@gmail.com', 'Meet Patel', 'admin', true),
  ('shahridham0512@gmail.com', 'Ridham Shah', 'admin', true)
ON CONFLICT (email) DO UPDATE 
SET role = EXCLUDED.role, is_active = true, full_name = EXCLUDED.full_name;

-- 5. Verification Queries
SELECT schemaname, tablename FROM pg_publication_tables WHERE pubname = 'supabase_realtime';
SELECT * FROM public.admin_users;
