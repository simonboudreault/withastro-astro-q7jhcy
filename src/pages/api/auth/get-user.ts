// With `output: 'hybrid'` configured:
export const prerender = false;
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
  const user = await supabase.auth.getUser();
  return new Response(JSON.stringify({ user }), {
    headers: { 'content-type': 'application/json' },
  });
};
