-- ============================================
-- RLS POLICY UPDATES FOR ADMIN ACCESS
-- Run this if you already created the tables
-- ============================================

-- Drop existing policies first (to avoid conflicts)
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can delete customers" ON profiles;

-- PROFILES: Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON profiles
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- PROFILES: Admins can update all profiles
CREATE POLICY "Admins can update all profiles" ON profiles
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- PROFILES: Admins can delete non-admin profiles
CREATE POLICY "Admins can delete customers" ON profiles
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
        AND role = 'customer'
    );

-- ============================================
-- PROMOTE YOUR ACCOUNT TO ADMIN
-- Replace 'your-email@example.com' with your actual email
-- ============================================
-- UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';
