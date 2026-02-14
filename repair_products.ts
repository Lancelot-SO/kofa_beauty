
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zxwsrxdcmnipcpymeejo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4d3NyeGRjbW5pcGNweW1lZWpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4MTU1NDgsImV4cCI6MjA4NTM5MTU0OH0.-k4llENHmKDua_7gZLi-J8BFxfAkdEdyUldWLFsybdE';
const supabase = createClient(supabaseUrl, supabaseKey);

async function repairProducts() {
  const { data: products, error } = await supabase.from('products').select('*');
  if (error) { console.error(error); return; }

  for (const p of (products || [])) {
    console.log(`Checking product ${p.id}...`);
    const updates: any = {};
    if (!p.name) updates.name = 'Kofa Beauty Product';
    if (!p.category) updates.category = 'Brushes';
    if (!p.status) updates.status = 'Active';
    if (!p.image) updates.image = '/kofa-logo.png';
    if (!p.price && p.price !== 0) updates.price = 100;

    if (Object.keys(updates).length > 0) {
      console.log(`Repairing product ${p.id} with:`, updates);
      await supabase.from('products').update(updates).eq('id', p.id);
    }
  }
  console.log('Repair complete.');
  process.exit(0);
}

repairProducts();
