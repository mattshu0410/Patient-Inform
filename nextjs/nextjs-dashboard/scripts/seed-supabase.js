//import { createClient } from '@/utils/supabase/server';
const { createBrowserClient } = require('@supabase/ssr');

const db = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

const {
  invoices,
  customers,
  revenue,
  users,
} = require('../app/lib/placeholder-data.js');

async function seedCustomers(db) {
  try {
    const { error } = await db.from('customers').upsert(customers);
    if (error) {
      throw error;
    }
    console.log(`Seeded ${customers.length} customers`);
  } catch (error) {
    console.error('Error seeding customers:', error);
  }
}

async function seedInvoices(db) {
  try {
    const { error } = await db.from('invoices').upsert(invoices);
    if (error) {
      throw error;
    }
    console.log(`Seeded ${invoices.length} invoices`);
  } catch (error) {
    console.error('Error seeding invoices:', error);
  }
}

async function seedRevenue(db) {
  try {
    const { error } = await db.from('revenue').upsert(revenue);
    if (error) {
      throw error;
    }
    console.log(`Seeded ${revenue.length} revenue`);
  } catch (error) {
    console.error('Error seeding revenue:', error);
  }
}

async function main(db) {
  await seedCustomers(db);
  await seedInvoices(db);
  await seedRevenue(db);
}

main(db);
