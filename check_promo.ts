
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zxwsrxdcmnipcpymeejo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4d3NyeGRjbW5pcGNweW1lZWpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4MTU1NDgsImV4cCI6MjA4NTM5MTU0OH0.-k4llENHmKDua_7gZLi-J8BFxfAkdEdyUldWLFsybdE';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkPromoData() {
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, price, sale_price, sale_end_date, category');

  if (error) {
    console.error('Error:', error);
    process.exit(1);
  }

  console.log('--- Current Product Data ---');
  products?.forEach(p => {
    console.log(`Product: ${p.name || 'N/A'} (${p.id})`);
    console.log(`  Price: ${p.price}`);
    console.log(`  Sale Price: ${p.sale_price}`);
    console.log(`  Sale End Date: ${p.sale_end_date}`);
    console.log(`  Category: ${p.category}`);
    
    // Check isSaleActive logic locally
    const isSaleActiveLocal = !!p.sale_price && (!p.sale_end_date || new Date() <= new Date(p.sale_end_date));
    console.log(`  Is Sale Active (Local Check): ${isSaleActiveLocal}`);
  });
  process.exit(0);
}

checkPromoData();
