-- ============================================
-- FIX: STRICT ADMIN-ONLY ORDER ACCESS
-- Run this in your Supabase Dashboard > SQL Editor
-- ============================================

-- 1. Ensure is_admin() function exists
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. CLEANUP: Drop all existing policies on orders and order_items 
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

-- 3. ENABLE RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- 4. INSERT POLICIES: Anyone can create an order (Required for guest checkout)
CREATE POLICY "Anyone can create orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can create order items" ON order_items FOR INSERT WITH CHECK (true);

-- 5. SELECT POLICIES: Only admins can view orders
CREATE POLICY "Only admins can view orders" ON orders 
FOR SELECT USING (public.is_admin());

CREATE POLICY "Only admins can view order items" ON order_items 
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND public.is_admin()
  )
);

-- 6. UPDATE POLICIES: Only admins can update orders
CREATE POLICY "Only admins can update orders" ON orders 
FOR UPDATE USING (public.is_admin());

-- ============================================
-- VERIFICATION: Run this to see active policies
-- SELECT * FROM pg_policies WHERE tablename IN ('orders', 'order_items');
-- ============================================
