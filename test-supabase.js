const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = 'https://seqjtokzwcfxdtptzbxr.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlcWp0b2t6d2NmeGR0cHR6YnhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1NDcwODQsImV4cCI6MjA5MTEyMzA4NH0.68tTft9vM8PP4Ok32rzQfA1VDwJn-zp-VfBEFs_1FeU';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testConnection() {
    console.log("Fetching products...");
    const { data, error } = await supabase.from('products').select('*');
    if (error) {
        console.error("Error fetching products:", error);
    } else {
        console.log("Products count:", data.length);
        if (data.length > 0) {
            console.log("First product columns:", Object.keys(data[0]));
        } else {
            console.log("Table is empty. Checking schema by doing an empty insert...");
        }
    }
    
    console.log("Attempting a dummy insert to check schema errors...");
    const dummyProduct = {
      name: "Test",
      brand: "Test",
      description: "Test",
      price: 100,
      promoPrice: null,
      stock: 10,
      category: "homme",
      volume: "100ml",
      image: "test.png",
      images: ["test.png"],
      featured: false,
      hidden: false,
      tags: [],
      notes_top: "test",
      notes_heart: "test",
      notes_base: "test",
      olfactive_family: "test",
    };
    
    const insertRes = await supabase.from('products').insert([dummyProduct]).select();
    if (insertRes.error) {
         console.error("INSERT ERROR DETAILS:", insertRes.error);
    } else {
         console.log("Insert Success! Row:", insertRes.data[0]);
         const deleteRes = await supabase.from('products').delete().eq('id', insertRes.data[0].id);
         console.log("Deleted dummy test row.");
    }
}

testConnection();
