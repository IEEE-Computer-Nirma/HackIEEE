-- ==============================================================================
-- HackIEEE 2026-27: Supabase SQL Analysis & Participant Queries
-- ==============================================================================
-- Run these queries directly in Supabase SQL Editor to analyze participant data:
-- ==============================================================================

-- 1. View all registered participants (ordered by most recent)
SELECT 
  registration_id,
  full_name,
  email,
  phone,
  university,
  degree,
  branch,
  year_of_study,
  is_ieee_member,
  ieee_membership_number,
  created_at
FROM public.registrations
ORDER BY created_at DESC;

-- 2. Total registrations count
SELECT COUNT(*) AS total_registrations FROM public.registrations;

-- 3. IEEE vs Non-IEEE membership split
SELECT 
  CASE WHEN is_ieee_member THEN 'IEEE Member' ELSE 'Non-IEEE' END AS member_status,
  COUNT(*) AS count,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM public.registrations), 2) AS percentage
FROM public.registrations
GROUP BY is_ieee_member;

-- 4. Total unique colleges / universities registered
SELECT COUNT(DISTINCT university) AS total_colleges FROM public.registrations;

-- 5. Top 10 Colleges ranked by participant count
SELECT 
  university,
  COUNT(*) AS total_participants,
  COUNT(*) FILTER (WHERE is_ieee_member = true) AS ieee_members_count
FROM public.registrations
GROUP BY university
ORDER BY total_participants DESC
LIMIT 10;

-- 6. Participants distribution by Year of Study
SELECT 
  year_of_study,
  COUNT(*) AS count
FROM public.registrations
GROUP BY year_of_study
ORDER BY count DESC;

-- 7. Daily registration trends (Velocity)
SELECT 
  DATE(created_at) AS registration_date,
  COUNT(*) AS daily_count
FROM public.registrations
GROUP BY DATE(created_at)
ORDER BY registration_date DESC;

-- 8. Quick search for a participant (Replace with search keyword)
-- Matches ID, Name, Email, or Phone
SELECT *
FROM public.registrations
WHERE 
  registration_id ILIKE '%HI27%' OR
  full_name ILIKE '%Deep%' OR
  email ILIKE '%@%' OR
  phone ILIKE '%9876%';
