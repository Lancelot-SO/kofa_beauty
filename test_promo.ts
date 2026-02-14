
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zxwsrxdcmnipcpymeejo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4d3NyeGRjbW5pcGNweW1lZWpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4MTU1NDgsImV4cCI6MjA4NTM5MTU0OH0.-k4llENHmKDua_7gZLi-J8BFxfAkdEdyUldWLFsybdE';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testApplyPromo() {
  const { data: products } = await supabase.from('products').select('*').limit(1);
  if (!products || products.length === 0) { console.log('No products'); return; }

  const p = products[0];
  const salePrice = p.price * 0.8;
  const endDate = new Date();
  endDate.setHours(endDate.getHours() + 24);

  console.log(`Applying 20% sale to ${p.name}. New price: ${salePrice}`);

  const { error } = await supabase
    .from('products')
    .update({ 
        sale_price: salePrice, 
        sale_end_date: endDate.toISOString() 
    })
    .eq('id', p.id);

  if (error) {
    console.error('Update failed:', error);
  } else {
    console.log('Update successful!');
  }
  process.exit(0);
}

testApplyPromo();
