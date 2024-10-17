// With `output: 'hybrid'` configured:
export const prerender = false;
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
  // get id from request body
  // const res = await supabase.from('sessions').select('*');
  let { data: sessions, error } = await supabase.from('sessions').select('*');

  console.log('res', sessions);

  return new Response(JSON.stringify({ message: 'got sessions', data: sessions }), { status: 200 });
};
