import * as tsImport from 'ts-import';


const { createClient: db } = require("../utils/supabase/server");

const {
    invoices,
    customers,
    revenue,
    users,
} = require('../app/lib/placeholder-data.js');

async function seedInvoices(client) {
    try {
        await client.from('invoices').upsert(invoices).execute();
    } catch (error) {
        console.error('Error seeding invoices:', error);
        throw error;
    }
}

async function main() {
    await seedInvoices(db);
}

main().catch((err) => {
    console.error(
      'An error occurred while attempting to seed the database:',
      err,
    );
  });
  