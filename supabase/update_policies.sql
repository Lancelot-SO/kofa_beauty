-- ============================================
-- ROBUST RLS POLICY UPDATES FOR GUEST CHECKOUT
-- Run this in your Supabase Dashboard > SQL Editor
-- ============================================

-- 1. CLEANUP: Drop all existing policies on orders and order_items 
-- This ensures no conflicting policies are left behind
DO $$ 
DECLARE 
    pol record;
BEGIN 
    FOR pol IN (SELECT policyname FROM pg_policies WHERE tablename = 'orders') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(pol.policyname) || ' ON orders';
    END LOOP;
    FOR pol IN (SELECT policyname FROM pg_policies WHERE tablename = 'order_items') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(pol.policyname) || ' ON order_items';
    END LOOP;
END $$;

-- 2. SCHEMA UPDATE: Ensure status allowing 'Pending Payment'
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_status_check 
    CHECK (status IN ('Pending Payment', 'Processing', 'Shipped', 'Delivered', 'Cancelled'));
ALTER TABLE orders ALTER COLUMN status SET DEFAULT 'Pending Payment';

-- 3. POLICIES: Orders
-- Allow anyone to create an order
CREATE POLICY "Anyone can create orders" ON orders FOR INSERT WITH CHECK (true);

-- Allow anyone to see orders (necessary for guest checkout confirmation)
CREATE POLICY "Allow guest to select created order" ON orders FOR SELECT USING (true);

-- Allow admins to update status
CREATE POLICY "Admins can update orders" ON orders FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 4. POLICIES: Order Items
-- Allow anyone to create order items
CREATE POLICY "Anyone can create order items" ON order_items FOR INSERT WITH CHECK (true);

-- Allow anyone to see order items
CREATE POLICY "Allow guest to select order items" ON order_items FOR SELECT USING (true);

-- 5. POLICIES: Profiles (Admin convenience)
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ============================================
-- VERIFICATION: Run this to see active policies
-- SELECT * FROM pg_policies WHERE tablename IN ('orders', 'order_items');
-- ============================================
