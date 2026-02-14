-- ============================================
-- FIX: GUEST CHECKOUT WITH STRICT ADMIN RLS
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

-- 4. POLICIES: 
-- Keep the tables EXTREMELY restricted for standard REST access
CREATE POLICY "Admins only SELECT" ON orders FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins only UPDATE" ON orders FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins only DELETE" ON orders FOR DELETE USING (public.is_admin());
-- Note: No INSERT policy here means standard REST inserts will fail, 
-- but we will use an RPC (Database Function) to handle it securely.

CREATE POLICY "Admins only SELECT items" ON order_items FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins only INSERT items" ON order_items FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins only DELETE items" ON order_items FOR DELETE USING (public.is_admin());

-- 5. RPC: Create Order (Bypass RLS securely)
-- This function can be called by anyone (guest/auth)
-- It performs the inserts and returns the order data
CREATE OR REPLACE FUNCTION public.place_order(
    p_order JSONB,
    p_items JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER -- This allows bypassing RLS
AS $$
DECLARE
    v_order_id UUID;
    v_item JSONB;
    v_result JSONB;
BEGIN
    -- 1. Insert the main order
    INSERT INTO public.orders (
        order_number,
        customer_id,
        customer_name,
        customer_email,
        total,
        phone,
        address,
        apartment,
        city,
        postcode,
        status
    ) VALUES (
        p_order->>'order_number',
        (p_order->>'customer_id')::UUID,
        p_order->>'customer_name',
        p_order->>'customer_email',
        (p_order->>'total')::DECIMAL,
        p_order->>'phone',
        p_order->>'address',
        p_order->>'apartment',
        p_order->>'city',
        p_order->>'postcode',
        'Pending Payment'
    )
    RETURNING id INTO v_order_id;

    -- 2. Insert the order items
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        INSERT INTO public.order_items (
            order_id,
            product_id,
            product_name,
            quantity,
            price
        ) VALUES (
            v_order_id,
            (v_item->>'product_id')::UUID,
            v_item->>'product_name',
            (v_item->>'quantity')::INTEGER,
            (v_item->>'price')::DECIMAL
        );
    END LOOP;

    -- 3. Return the created order details
    SELECT row_to_json(o) INTO v_result
    FROM public.orders o
    WHERE o.id = v_order_id;

    RETURN v_result;
END;
$$;

-- 6. RPC: Confirm Payment (Bypass RLS securely)
CREATE OR REPLACE FUNCTION public.confirm_payment(
    p_order_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.orders
    SET status = 'Processing',
        updated_at = NOW()
    WHERE id = p_order_id
    AND status = 'Pending Payment';
END;
$$;

-- Grant access to the functions
GRANT EXECUTE ON FUNCTION public.place_order(JSONB, JSONB) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.confirm_payment(UUID) TO anon, authenticated;
