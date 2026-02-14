-- Run this in your Supabase SQL Editor to add the sale expiration date column
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS sale_end_date TIMESTAMPTZ;

-- Optional: Create an index for faster queries if you plan to filter by date often
CREATE INDEX IF NOT EXISTS products_sale_end_date_idx ON products (sale_end_date);
