-- Supabase SQL Schema for KofaBeauty
-- Run this in your Supabase Dashboard > SQL Editor

-- ============================================
-- PROFILES TABLE (linked to auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    first_name TEXT,
    last_name TEXT,
    full_name TEXT,
    role TEXT DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, first_name, last_name, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'first_name',
        NEW.raw_user_meta_data->>'last_name',
        NEW.raw_user_meta_data->>'full_name'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- PRODUCTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    sku TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock INTEGER DEFAULT 0,
    status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Draft', 'Out of Stock')),
    image TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ORDERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL,
    customer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    status TEXT DEFAULT 'Pending Payment' CHECK (status IN ('Pending Payment', 'Processing', 'Shipped', 'Delivered', 'Cancelled')),
    total DECIMAL(10,2) NOT NULL,
    phone TEXT,
    address TEXT,
    apartment TEXT,
    city TEXT,
    postcode TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ORDER ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- PROFILES: Users can read their own profile
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

-- PROFILES: Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON profiles
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- PROFILES: Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

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

-- PRODUCTS: Everyone can read, only authenticated users can modify
CREATE POLICY "Anyone can view products" ON products
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert products" ON products
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update products" ON products
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete products" ON products
    FOR DELETE USING (auth.role() = 'authenticated');

-- ORDERS: Users can view their own orders, admins can view all
-- Using IS NOT DISTINCT FROM allows guests (NULL customer_id) to see their own records
CREATE POLICY "Users can view own orders" ON orders
    FOR SELECT USING (
        auth.uid() IS NOT DISTINCT FROM customer_id OR 
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Fallback to allow anyone to select - useful for Guest checkout success page
CREATE POLICY "Allow anyone to select orders" ON orders
    FOR SELECT USING (true);

CREATE POLICY "Anyone can create orders" ON orders
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can update orders" ON orders
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Admins can delete orders" ON orders
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- ORDER ITEMS: Users can view their own order items, admins can view all
CREATE POLICY "Users can view own order items" ON order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_items.order_id 
            AND (orders.customer_id IS NOT DISTINCT FROM auth.uid() OR 
                 EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
        )
    );

-- Fallback to allow anyone to select order items
CREATE POLICY "Allow anyone to select order items" ON order_items
    FOR SELECT USING (true);

CREATE POLICY "Anyone can create order items" ON order_items
    FOR INSERT WITH CHECK (true);

-- ============================================
-- SEED DATA (Products only)
-- ============================================
INSERT INTO products (name, description, sku, category, price, stock, status, image) VALUES
('12 Piece Brush Set', 'Professional grade makeup brush set containing all essentials.', 'KB-BR-12', 'Brushes', 30.00, 45, 'Active', 'https://images.unsplash.com/photo-1631214500115-598fc2cb8d2d?q=80&w=2525&auto=format&fit=crop'),
('Long-Lasting Lipgloss', 'High shine, non-sticky lipgloss that lasts all day.', 'KB-LIP-01', 'Lips', 18.00, 12, 'Active', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=2670&auto=format&fit=crop'),
('Cat Eye Strip Lashes', 'Dramatic cat-eye lashes for a bold look.', 'KB-LASH-03', 'Lashes', 10.00, 0, 'Out of Stock', 'https://images.unsplash.com/photo-1632283038677-70a256950346?q=80&w=2670&auto=format&fit=crop'),
('Setting Powder', 'Translucent setting powder for a flawless finish.', 'KB-FACE-01', 'Face', 24.00, 25, 'Active', 'https://images.unsplash.com/photo-1596462502278-27bfdd403348?q=80&w=2670&auto=format&fit=crop')
ON CONFLICT (sku) DO NOTHING;
