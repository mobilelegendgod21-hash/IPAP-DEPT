-- ==========================================
-- ADMIN PROMOTION SCRIPT
-- ==========================================
-- Run this script in your Supabase SQL Editor to manually make a user an Admin.

-- 1. Replace 'YOUR_EMAIL_HERE' with the email address you registered with.
--    Example: email = 'admin@example.com'

UPDATE public.profiles
SET is_admin = TRUE
WHERE id IN (
    SELECT id 
    FROM auth.users 
    WHERE email = 'YOUR_EMAIL_HERE' -- <--- CHANGE THIS EMAIL
);

-- 2. Verify the update
SELECT * FROM public.profiles WHERE is_admin = TRUE;
