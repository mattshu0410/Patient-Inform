//import { sql } from '@vercel/postgres';
import { createClient } from '@/utils/supabase/server';

import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  User,
  Revenue,
} from './definitions';
import { formatCurrency } from './utils';

// For Vercel Postgres
// export async function fetchRevenue() {
//   const supabase = createClient();
//   // Add noStore() here to prevent the response from being cached.
//   // This is equivalent to in fetch(..., {cache: 'no-store'}).

//   try {

//     // Artificially delay a response for demo purposes.
//     // Don't do this in production :)

//     // console.log('Fetching revenue data...');
//     // await new Promise((resolve) => setTimeout(resolve, 3000));

//     const data = await sql<Revenue>`SELECT * FROM revenue`;

//     // console.log('Data fetch completed after 3 seconds.');

//     return data.rows;
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch revenue data.');
//   }
// }

export const revalidate = 0
export async function fetchRevenue() {
  
  const supabase = createClient();
  // Add noStore() here to prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).

  try {
    console.log('Fetching revenue data...');
    await new Promise((resolve) => setTimeout(resolve, 3000));
    const { data, error } = await supabase.from('revenue').select('*');
    if (error) throw error;
    //console.log('Revenue data:', data);
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}


// export async function fetchLatestInvoices() {
//   try {
//     const data = await sql<LatestInvoiceRaw>`
//       SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
//       FROM invoices
//       JOIN customers ON invoices.customer_id = customers.id
//       ORDER BY invoices.date DESC
//       LIMIT 5`;

//     const latestInvoices = data.rows.map((invoice) => ({
//       ...invoice,
//       amount: formatCurrency(invoice.amount),
//     }));
//     return latestInvoices;
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch the latest invoices.');
//   }
// }


export async function fetchLatestInvoices() {
  const supabase = createClient();
  try {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    const { data, error } = await supabase.from('invoices').select(`
      amount, 
      id,
      customers(
        name,
        image_url,
        email
      )
    `).order(`date`, {ascending: false}).limit(5);
    if (error) throw error;
    //console.log('Retrieved data:', data);
    const latestInvoices = data.map((invoice) => ({
      amount: formatCurrency(invoice.amount),
      id: invoice.id,
      name: invoice.customers.name,
      image_url: invoice.customers.image_url,
      email: invoice.customers.email
    }));
    //console.log(latestInvoices)
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

// export async function fetchCardData() {
//   try {
//     // You can probably combine these into a single SQL query
//     // However, we are intentionally splitting them to demonstrate
//     // how to initialize multiple queries in parallel with JS.
//     const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
//     const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
//     const invoiceStatusPromise = sql`SELECT
//          SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
//          SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
//          FROM invoices`;

//     const data = await Promise.all([
//       invoiceCountPromise,
//       customerCountPromise,
//       invoiceStatusPromise,
//     ]);

//     const numberOfInvoices = Number(data[0].rows[0].count ?? '0');
//     const numberOfCustomers = Number(data[1].rows[0].count ?? '0');
//     const totalPaidInvoices = formatCurrency(data[2].rows[0].paid ?? '0');
//     const totalPendingInvoices = formatCurrency(data[2].rows[0].pending ?? '0');

//     return {
//       numberOfCustomers,
//       numberOfInvoices,
//       totalPaidInvoices,
//       totalPendingInvoices,
//     };
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch card data.');
//   }
// }

export async function fetchCardData() {
  const supabase = createClient();

  try {
    const { data: invoices, error: invoicesError } = await supabase
      .from('invoices')
      .select('id, amount, status');
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const { data: customerCountData, error: customerCountError } = await supabase
      .from('customers')
      .select('id', { count: 'exact' });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (invoicesError || customerCountError) {
      throw new Error('Failed to fetch card data.');
    }

    const numberOfInvoices = invoices?.length ?? 0;
    const numberOfCustomers = customerCountData?.length ?? 0;

    const totalPaidInvoices = formatCurrency(
      invoices
        ?.filter((invoice) => invoice.status === 'paid')
        .reduce((total, invoice) => total + invoice.amount, 0) ?? 0
    );

    const totalPendingInvoices = formatCurrency(
      invoices
        ?.filter((invoice) => invoice.status === 'pending')
        .reduce((total, invoice) => total + invoice.amount, 0) ?? 0
    );

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;
// export async function fetchFilteredInvoices(
//   query: string,
//   currentPage: number,
// ) {
//   const offset = (currentPage - 1) * ITEMS_PER_PAGE;

//   try {
//     const invoices = await sql<InvoicesTable>`
//       SELECT
//         invoices.id,
//         invoices.amount,
//         invoices.date,
//         invoices.status,
//         customers.name,
//         customers.email,
//         customers.image_url
//       FROM invoices
//       JOIN customers ON invoices.customer_id = customers.id
//       WHERE
//         customers.name ILIKE ${`%${query}%`} OR
//         customers.email ILIKE ${`%${query}%`} OR
//         invoices.amount::text ILIKE ${`%${query}%`} OR
//         invoices.date::text ILIKE ${`%${query}%`} OR
//         invoices.status ILIKE ${`%${query}%`}
//       ORDER BY invoices.date DESC
//       LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
//     `;

//     return invoices.rows;
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch invoices.');
//   }
// }

// fetchfilteredinvoices invoke function in supabase
export async function fetchFilteredInvoices(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const supabase = createClient();
  try {
    const { data: invoices, error: error } = await supabase
    .rpc('fetchfilteredinvoices', {
      items : ITEMS_PER_PAGE, 
      pageoffset : offset,
      query : query
    })
    if (error) throw error
    else console.log(invoices)

    return invoices;
  } catch (error) {
    console.error('Database Error:', error);
  } 
}

// export async function fetchInvoicesPages(query: string) {
//   try {
//     const count = await sql`SELECT COUNT(*)
//     FROM invoices
//     JOIN customers ON invoices.customer_id = customers.id
//     WHERE
//       customers.name ILIKE ${`%${query}%`} OR
//       customers.email ILIKE ${`%${query}%`} OR
//       invoices.amount::text ILIKE ${`%${query}%`} OR
//       invoices.date::text ILIKE ${`%${query}%`} OR
//       invoices.status ILIKE ${`%${query}%`}
//   `;

//     const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
//     return totalPages;
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch total number of invoices.');
//   }
// }

export async function fetchInvoicesPages(query: string) {
  const supabase = createClient();
  try {
    const { data: count, error: error } = await supabase
    .rpc('fetchinvoicespages', {
      query : query
    })

    if (error) throw error
    if (count === null) throw new Error('Failed to fetch total number of invoices.');
    const totalPages = Math.ceil(count / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
  }
}

// export async function fetchInvoiceById(id: string) {
//   try {
//     const data = await sql<InvoiceForm>`
//       SELECT
//         invoices.id,
//         invoices.customer_id,
//         invoices.amount,
//         invoices.status
//       FROM invoices
//       WHERE invoices.id = ${id};
//     `;

//     const invoice = data.rows.map((invoice) => ({
//       ...invoice,
//       // Convert amount from cents to dollars
//       amount: invoice.amount / 100,
//     }));

//     return invoice[0];
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch invoice.');
//   }
// }
export async function fetchInvoiceById(id: string) {
  const supabase = createClient();
  try {
    const { data: invoices, error } = await supabase
      .from('invoices')
      .select(`
        id,
        customer_id,
        amount,
        status
      `)
      .eq('id', id)
      .single();

    if (error) {
      throw new Error('Failed to fetch invoice.');
    }

    const invoice = {
      ...invoices,
      amount: invoices.amount / 100,
    };

    return invoice;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

// export async function fetchCustomers() {
//   try {
//     const data = await sql<CustomerField>`
//       SELECT
//         id,
//         name
//       FROM customers
//       ORDER BY name ASC
//     `;

//     const customers = data.rows;
//     return customers;
//   } catch (err) {
//     console.error('Database Error:', err);
//     throw new Error('Failed to fetch all customers.');
//   }
// }

export async function fetchCustomers() {
  const supabase = createClient();
  try {
    const { data: customers, error } = await supabase
      .from('customers')
      .select(`
        id,
        name
      `)
      .order('name', { ascending: true });

    if (error) {
      throw new Error('Failed to fetch all customers.');
    }

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

// export async function fetchFilteredCustomers(query: string) {
//   try {
//     const data = await sql<CustomersTableType>`
// 		SELECT
// 		  customers.id,
// 		  customers.name,
// 		  customers.email,
// 		  customers.image_url,
// 		  COUNT(invoices.id) AS total_invoices,
// 		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
// 		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
// 		FROM customers
// 		LEFT JOIN invoices ON customers.id = invoices.customer_id
// 		WHERE
// 		  customers.name ILIKE ${`%${query}%`} OR
//         customers.email ILIKE ${`%${query}%`}
// 		GROUP BY customers.id, customers.name, customers.email, customers.image_url
// 		ORDER BY customers.name ASC
// 	  `;

//     const customers = data.rows.map((customer) => ({
//       ...customer,
//       total_pending: formatCurrency(customer.total_pending),
//       total_paid: formatCurrency(customer.total_paid),
//     }));

//     return customers;
//   } catch (err) {
//     console.error('Database Error:', err);
//     throw new Error('Failed to fetch customer table.');
//   }
// }

export async function fetchFilteredCustomers(query: string) {
  const supabase = createClient();
  try {
    const { data: customers, error } = await supabase
      .from('customers')
      .select(`
        id,
        name,
        email,
        image_url,
        invoices (
          id,
          amount,
          status
        )
      `)
      .ilike('name', `%${query}%`)
      .or(`email.ilike.%${query}%`);

    if (error) {
      throw new Error('Failed to fetch customer table.');
    }

    const formattedCustomers = customers.map((customer) => ({
      ...customer,
      total_invoices: customer.invoices.length,
      total_pending: formatCurrency(
        customer.invoices
          .filter((invoice) => invoice.status === 'pending')
          .reduce((total, invoice) => total + invoice.amount, 0)
      ),
      total_paid: formatCurrency(
        customer.invoices
          .filter((invoice) => invoice.status === 'paid')
          .reduce((total, invoice) => total + invoice.amount, 0)
      ),
    }));

    return formattedCustomers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}

// export async function getUser(email: string) {
//   try {
//     const user = await sql`SELECT * FROM users WHERE email=${email}`;
//     return user.rows[0] as User;
//   } catch (error) {
//     console.error('Failed to fetch user:', error);
//     throw new Error('Failed to fetch user.');
//   }
// }
