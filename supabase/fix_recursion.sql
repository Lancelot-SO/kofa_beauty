-- ============================================
-- FIX: INFINITE RECURSION IN RLS POLICIES
-- Run this in your Supabase Dashboard > SQL Editor
-- ============================================

-- 1. Create a security definer function to check roles
-- This function runs with the privileges of the creator, bypassing RLS
-- specifically for this check, which prevents infinite loops.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Update PROFILES policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
CREATE POLICY "Admins can view all profiles" ON profiles
    FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
CREATE POLICY "Admins can update all profiles" ON profiles
    FOR UPDATE USING (public.is_admin());

-- 3. Update ORDERS policies (for consistency and speed)
DROP POLICY IF EXISTS "Admins can update orders" ON orders;
CREATE POLICY "Admins can update orders" ON orders
    FOR UPDATE USING (public.is_admin());

-- 4. FINAL STEP: Re-promote your account just in case
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'fsowah001@gmail.com';
