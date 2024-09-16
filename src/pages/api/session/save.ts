// With `output: 'hybrid'` configured:
export const prerender = false;
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  if (request.headers.get('Content-Type') === 'application/json') {
    const body = await request.json();
    const bodyString = JSON.stringify(body);
    saveRow('sessions', body);
    return new Response(
      JSON.stringify({
        message: 'Your name was: ' + bodyString,
      }),
      {
        status: 200,
      }
    );
  }
  return new Response(null, { status: 400 });
  let { data: sessions, error } = await supabase.from('sessions').select('*');
  const theSession = await request.json();
  console.log('theSession', theSession);

  async function saveRow(table: string, rowData: Record<string, any>) {
    try {
      const { data, error } = await supabase.from(table).insert([rowData]);

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
  const data = await request.json();
  console.log('data', data);

  return new Response(JSON.stringify({ message: 'saved sessions', data: theSession }), {
    status: 200,
  });
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
};
