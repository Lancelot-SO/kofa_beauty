-- ============================================
-- STOCK MANAGEMENT & SECURE ORDERING
-- ============================================

-- 1. Update place_order to check and decrement stock
CREATE OR REPLACE FUNCTION public.place_order(
    p_order JSONB,
    p_items JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_order_id UUID;
    v_item JSONB;
    v_product_id UUID;
    v_requested_qty INTEGER;
    v_current_stock INTEGER;
    v_product_name TEXT;
    v_result JSONB;
BEGIN
    -- 1. Validate Stock for all items first
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        v_product_id := (v_item->>'product_id')::UUID;
        v_requested_qty := (v_item->>'quantity')::INTEGER;
        
        SELECT stock, name INTO v_current_stock, v_product_name
        FROM public.products
        WHERE id = v_product_id;

        IF v_current_stock < v_requested_qty THEN
            RAISE EXCEPTION 'Insufficient stock for product: % (Available: %, Requested: %)', 
                v_product_name, v_current_stock, v_requested_qty;
        END IF;
    END LOOP;

    -- 2. Insert the main order
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

    -- 3. Insert order items AND decrement stock
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        v_product_id := (v_item->>'product_id')::UUID;
        v_requested_qty := (v_item->>'quantity')::INTEGER;

        -- Insert item
        INSERT INTO public.order_items (
            order_id,
            product_id,
            product_name,
            quantity,
            price
        ) VALUES (
            v_order_id,
            v_product_id,
            v_item->>'product_name',
            v_requested_qty,
            (v_item->>'price')::DECIMAL
        );

        -- Decrement stock
        UPDATE public.products
        SET stock = stock - v_requested_qty,
            status = CASE WHEN stock - v_requested_qty <= 0 THEN 'Out of Stock' ELSE status END,
            updated_at = NOW()
        WHERE id = v_product_id;
    END LOOP;

    -- 4. Return the created order details
    SELECT row_to_json(o) INTO v_result
    FROM public.orders o
    WHERE o.id = v_order_id;

    RETURN v_result;
END;
$$;

-- 2. Update confirm_payment to handle status change
-- (Stock is already decremented in place_order to reserve it)
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

-- 3. (Optional) Add a function to cancel order and restore stock
CREATE OR REPLACE FUNCTION public.cancel_order(
    p_order_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_item RECORD;
BEGIN
    -- Only allow cancelling if pending payment or processing
    IF EXISTS (SELECT 1 FROM public.orders WHERE id = p_order_id AND status IN ('Pending Payment', 'Cancelled')) THEN
        -- If already cancelled, do nothing
        IF EXISTS (SELECT 1 FROM public.orders WHERE id = p_order_id AND status = 'Cancelled') THEN
            RETURN;
        END IF;

        -- Restore stock
        FOR v_item IN SELECT product_id, quantity FROM public.order_items WHERE order_id = p_order_id
        LOOP
            UPDATE public.products
            SET stock = stock + v_item.quantity,
                status = CASE WHEN status = 'Out of Stock' THEN 'Active' ELSE status END,
                updated_at = NOW()
            WHERE id = v_item.product_id;
        END LOOP;

        -- Update order status
        UPDATE public.orders
        SET status = 'Cancelled',
            updated_at = NOW()
        WHERE id = p_order_id;
    END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.cancel_order(UUID) TO anon, authenticated;
