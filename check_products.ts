
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zxwsrxdcmnipcpymeejo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4d3NyeGRjbW5pcGNweW1lZWpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4MTU1NDgsImV4cCI6MjA4NTM5MTU0OH0.-k4llENHmKDua_7gZLi-J8BFxfAkdEdyUldWLFsybdE';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProducts() {
  console.log('Fetching products from:', supabaseUrl);
  const { data: products, error } = await supabase
    .from('products')
    .select('*');

  if (error) {
    console.error('Error fetching products:', error);
    process.exit(1);
  }

  console.log('Total products found:', products?.length);
  if (products && products.length > 0) {
    products.forEach((p, i) => {
        console.log(`\n--- Product ${i + 1} ---`);
        console.log(`ID: ${p.id}`);
        console.log(`Name: ${p.name}`);
        console.log(`Category: ${p.category}`);
        console.log(`Price: ${p.price}`);
        console.log(`Sale Price: ${p.sale_price}`);
        console.log(`Status: ${p.status}`);
        if (!p.name) console.error(`!!! CRITICAL: Product ${p.id} has MISSING NAME!`);
        if (!p.price && p.price !== 0) console.error(`!!! CRITICAL: Product ${p.id} has MISSING PRICE!`);
    });
  } else {
    console.log('No products found in the table.');
  }
  process.exit(0);
}

checkProducts().catch(err => {
    console.error('Script failed:', err);
    process.exit(1);
});
