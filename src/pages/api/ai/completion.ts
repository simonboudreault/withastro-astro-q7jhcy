export const prerender = false;
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { useAnthropicApi } from '../../../lib/ai';
// Initialize the Supabase client

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Error getting session:', error);
    return new Response(error.message, { status: 401 });
  }
  const user = data.session?.user;
  if (!user) {
    console.log('Unauthorized');
    return new Response(error.message, { status: 401 });
  }
  console.log('user', user);
  // if (user.id !== '58dbfc9a-ad5d-46cc-9ccd-9efbd3b63ff') {
  if (user.id !== '58dbfc9a-ad5d-46cc-9ccd-9efbd3b63fff') {
    console.log('Unauthorized');
    return new Response('user not authorized', { status: 401 });
  }
  console.log('Authorized');

  const body = await request.json();
  const messages = body.messages;

  try {
    if (false /* not implementeed */) {
    }
    const completion = await useAnthropicApi(messages);

    console.log(completion);

    return new Response(JSON.stringify(completion), {
      status: 200,
    });
  } catch (error) {
    console.error('Error inserting data:', error);
    return new Response(null, { status: 400 });
  }

  // let { data: sessions, error } = await supabase.from('sessions').select('*');
};
