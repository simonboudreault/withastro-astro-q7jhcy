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
  // const formData = await request.formData();
  // const email = formData.get('email')?.toString();
  // const password = formData.get('password')?.toString();

  // if (!email || !password) {
  //   return new Response('Email and password are required', { status: 400 });
  // }
  // const { data, error } = await supabase.auth.signInWithPassword({
  //   email,
  //   password,
  // });

  // if (error) {
  //   return new Response(error.message, { status: 500 });
  // }

  // const { access_token, refresh_token } = data.session;
  // cookies.set('sb-access-token', access_token, {
  //   path: '/',
  //   httpOnly: true,
  //   secure: import.meta.env.PROD,
  //   sameSite: 'strict',
  //   maxAge: 60 * 60 * 24 * 7, // 1 week
  // });
  // cookies.set('sb-refresh-token', refresh_token, {
  //   path: '/',
  //   httpOnly: true,
  //   secure: import.meta.env.PROD,
  //   sameSite: 'strict',
  //   maxAge: 60 * 60 * 24 * 7, // 1 week
  // });
  // return redirect('/dashboard');
};
