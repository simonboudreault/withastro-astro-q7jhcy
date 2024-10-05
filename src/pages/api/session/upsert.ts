// With `output: 'hybrid'` configured:
export const prerender = false;
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  if (request.headers.get('Content-Type') === 'application/json') {
    const session = await request.json();
    const upsertResponse = await upsert('sessions', session);
    return new Response(JSON.stringify(upsertResponse), {
      status: 200,
    });
  }
  return new Response(null, { status: 400 });

  // let { data: sessions, error } = await supabase.from('sessions').select('*');
};

async function upsert(table: string, rowData: Record<string, any>) {
  try {
    const { data, error } = await supabase.from(table).upsert(rowData).select();

    if (error) {
      console.error('Error inserting data:', error);
      return { success: false, error };
    }

    console.log('Data inserted successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { success: false, error };
  }
}
