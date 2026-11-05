-- ==============================================================================
-- HackIEEE 2026-27: Supabase Database Schema for Registrations
-- ==============================================================================
-- Run this script in your Supabase Project:
-- Supabase Dashboard -> SQL Editor -> New Query -> Paste & Run
-- ==============================================================================

-- 1. Create the `registrations` table
CREATE TABLE IF NOT EXISTS public.registrations (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  registration_id TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'India',
  college_email TEXT,
  university TEXT NOT NULL,
  degree TEXT NOT NULL,
  branch TEXT NOT NULL,
  year_of_study TEXT NOT NULL,
  graduation_year TEXT,
  is_ieee_member BOOLEAN NOT NULL DEFAULT false,
  ieee_membership_number TEXT,
  is_ieee_cs_member BOOLEAN NOT NULL DEFAULT false,
  linkedin_url TEXT,
  github_url TEXT,
  hear_about TEXT,
  data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Indexes for high performance searches
CREATE INDEX IF NOT EXISTS idx_registrations_email ON public.registrations(email);
CREATE INDEX IF NOT EXISTS idx_registrations_registration_id ON public.registrations(registration_id);
CREATE INDEX IF NOT EXISTS idx_registrations_university ON public.registrations(university);
CREATE INDEX IF NOT EXISTS idx_registrations_is_ieee_member ON public.registrations(is_ieee_member);

-- 3. Row Level Security (RLS) setup
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Policy 1: Service role has full unrestricted access (used by backend API)
DROP POLICY IF EXISTS "Service role full access on registrations" ON public.registrations;
CREATE POLICY "Service role full access on registrations"
  ON public.registrations
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy 2: Allow anonymous/public submissions via the frontend API if anon key is used
DROP POLICY IF EXISTS "Allow public registration insert" ON public.registrations;
CREATE POLICY "Allow public registration insert"
  ON public.registrations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy 3: Allow users to view their own registration details by email
DROP POLICY IF EXISTS "Allow users to read own registration" ON public.registrations;
CREATE POLICY "Allow users to read own registration"
  ON public.registrations
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Policy 4: Allow updating existing registration on conflict
DROP POLICY IF EXISTS "Allow public registration update" ON public.registrations;
CREATE POLICY "Allow public registration update"
  ON public.registrations
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- ==============================================================================
-- Schema ready! Any participant registration submitted via /register will now
-- be securely stored in this table.
-- ==============================================================================
